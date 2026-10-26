import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db/mongoose";
import Quiz from "@/lib/models/Quiz";
import Note from "@/lib/models/Note";
import { requireAuth, apiResponse, apiError } from "@/lib/utils/api-helpers";

const GROQ_API_KEY = process.env.GROQ_API_KEY || "";
const GROQ_MODEL = "llama-3.3-70b-versatile";

/** POST /api/quizzes/generate — AI-powered quiz generation */
export async function POST(req: NextRequest) {
  const auth = requireAuth(req);
  if ("error" in auth) return auth.error;

  if (!GROQ_API_KEY) return apiError("AI service not configured.", 503);

  try {
    await connectDB();
    const { noteId, subject } = (await req.json()) as { noteId: string; subject?: string };
    if (!noteId) return apiError("noteId is required", 400);

    const note = await Note.findById(noteId);
    if (!note) return apiError("Note not found", 404);

    const prompt = `Generate a 10-question multiple choice quiz (MCQ) with 4 options (A-D) and one correct answer.
Output format: [{"question":"...","options":{"A":"...","B":"...","C":"...","D":"..."}, "answer":"A"}].
Use this study material: ${note.extractedText || note.content?.trim()}`;

    const aiRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${GROQ_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages: [
          { role: "system", content: "You generate MCQ quizzes from notes. Respond ONLY with a JSON array." },
          { role: "user", content: prompt },
        ],
        max_tokens: 2048,
      }),
    });

    const aiData = await aiRes.json();
    let aiContent = aiData.choices?.[0]?.message?.content?.trim() || "";

    // Strip markdown code fences
    if (aiContent.startsWith("```json")) aiContent = aiContent.slice(7).trim();
    if (aiContent.startsWith("```")) aiContent = aiContent.slice(3).trim();
    if (aiContent.endsWith("```")) aiContent = aiContent.slice(0, -3).trim();

    let questions: Array<{ question: string; options: Record<string, string>; answer: string }>;
    try {
      questions = JSON.parse(aiContent);
      if (!Array.isArray(questions)) throw new Error("Not array");
    } catch {
      const match = aiContent.match(/\[[\s\S]*\]/);
      if (!match) return apiError("AI generated invalid quiz format", 400);
      try { questions = JSON.parse(match[0]); } catch {
        return apiError("Could not parse AI quiz response", 400);
      }
    }

    const quiz = await Quiz.create({
      user: auth.user.userId, note: noteId, questions,
      subject: subject || "General", isAIGenerated: true,
    });

    return apiResponse({ message: "AI quiz generated.", quiz }, 201);
  } catch (err) {
    console.error("[AI QUIZ GEN]", err);
    return apiError("Could not generate AI quiz.", 500);
  }
}
