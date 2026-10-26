import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db/mongoose";
import Flashcard from "@/lib/models/Flashcard";
import Note from "@/lib/models/Note";
import Topic from "@/lib/models/Topic";
import { requireAuth, apiResponse, apiError } from "@/lib/utils/api-helpers";

const GROQ_API_KEY = process.env.GROQ_API_KEY || "";
const GROQ_MODEL = "llama-3.3-70b-versatile";

/** POST /api/flashcards/generate — AI-powered flashcard generation */
export async function POST(req: NextRequest) {
  const auth = requireAuth(req);
  if ("error" in auth) return auth.error;

  if (!GROQ_API_KEY) return apiError("AI service not configured.", 503);

  try {
    await connectDB();
    const { noteId, topic, subject } = (await req.json()) as {
      noteId?: string; topic?: string; subject?: string;
    };

    let promptContext = "";
    let subjectToUse = subject || "General";

    if (noteId) {
      const note = await Note.findById(noteId).populate("subject");
      if (!note) return apiError("Note not found", 404);
      promptContext = `Notes:\n${note.extractedText || note.content}`;
      subjectToUse = (note.subject as { name?: string })?.name || subjectToUse;
    } else if (topic) {
      promptContext = `Topic: ${topic}`;
      if (!subject) return apiError("Subject is required when generating from topic", 400);
    } else {
      return apiError("Either noteId or topic is required", 400);
    }

    const prompt = `From the following source, create the most important flashcards as an array of JSON objects in the form [{"question":"...", "answer":"..."}]. Focus on key concepts, definitions, and exam-relevant points.\n${promptContext}`;

    const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${GROQ_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages: [
          { role: "system", content: "You are a helpful assistant that creates study flashcards. Always respond ONLY with an array of objects in JSON." },
          { role: "user", content: prompt },
        ],
        max_tokens: 1024,
        response_format: { type: "json_object" },
      }),
    });

    const aiData = await groqRes.json();
    const text = aiData.choices?.[0]?.message?.content || "";

    let flashcards: Array<{ question: string; answer: string }> = [];
    try {
      const parsed = JSON.parse(text);
      flashcards = Array.isArray(parsed) ? parsed : parsed.flashcards || parsed.cards || [];
    } catch {
      const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || text.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        try { flashcards = JSON.parse(jsonMatch[1] || jsonMatch[0]); } catch {
          return apiError("AI could not create valid JSON flashcards.", 400);
        }
      } else {
        return apiError("AI could not create valid JSON flashcards.", 400);
      }
    }

    // Ensure topic exists
    const finalTopicName = topic || (noteId ? (await Note.findById(noteId))?.title : "General") || "General";
    let topicDoc = await Topic.findOne({ name: finalTopicName, owner: auth.user.userId });
    if (!topicDoc) {
      topicDoc = await Topic.create({ name: finalTopicName, owner: auth.user.userId, subject: subjectToUse, difficulty: "medium" });
    }

    const created = await Promise.all(
      flashcards.map((fc) =>
        Flashcard.create({
          note: noteId || undefined, question: fc.question, answer: fc.answer,
          owner: auth.user.userId, subject: subjectToUse, topicName: finalTopicName,
          isAIGenerated: true, difficulty: "medium",
        })
      )
    );

    return apiResponse({ message: "AI flashcards generated.", flashcards: created }, 201);
  } catch (err) {
    console.error("[AI FLASHCARD GEN]", err);
    return apiError("Could not generate AI flashcards.", 500);
  }
}
