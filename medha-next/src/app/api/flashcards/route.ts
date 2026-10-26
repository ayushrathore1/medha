import { NextRequest } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db/mongoose";
import Flashcard from "@/lib/models/Flashcard";
import Note from "@/lib/models/Note";
import Topic from "@/lib/models/Topic";
import { requireAuth, apiResponse, apiError } from "@/lib/utils/api-helpers";

/** GET /api/flashcards — Get all flashcards */
export async function GET(req: NextRequest) {
  const auth = requireAuth(req);
  if ("error" in auth) return auth.error;
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const noteId = searchParams.get("noteId");
    const subject = searchParams.get("subject");
    const topic = searchParams.get("topic");

    const filter: Record<string, unknown> = { owner: auth.user.userId };
    if (noteId) filter.note = noteId;
    if (subject) filter.subject = subject;
    if (topic) filter.topicName = decodeURIComponent(topic);

    const flashcards = await Flashcard.find(filter).sort({ createdAt: -1 });
    return apiResponse({ flashcards });
  } catch { return apiError("Could not get flashcards.", 500); }
}

/** POST /api/flashcards — Create a manual flashcard */
export async function POST(req: NextRequest) {
  const auth = requireAuth(req);
  if ("error" in auth) return auth.error;
  try {
    await connectDB();
    const { noteId, question, answer, subject, topicName } = (await req.json()) as {
      noteId?: string; question?: string; answer?: string; subject?: string; topicName?: string;
    };
    if (!question || !answer) return apiError("Missing required fields.", 400);

    if (noteId) {
      const note = await Note.findOne({ _id: noteId, owner: auth.user.userId });
      if (!note) return apiError("Note not found or unauthorized", 404);
    }

    let topic = await Topic.findOne({ name: topicName || "Manual", owner: auth.user.userId });
    if (!topic) {
      topic = await Topic.create({ name: topicName || "Manual", owner: auth.user.userId, subject: subject || "General", difficulty: "medium" });
    }

    const flashcard = await Flashcard.create({
      note: noteId || undefined, question, answer, owner: auth.user.userId,
      subject: subject || "General", topicName: topicName || "Manual", isAIGenerated: false, difficulty: "medium",
    });
    return apiResponse({ message: "Flashcard created.", flashcard }, 201);
  } catch { return apiError("Server error creating flashcard.", 500); }
}
