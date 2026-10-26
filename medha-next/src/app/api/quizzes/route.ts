import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db/mongoose";
import Quiz from "@/lib/models/Quiz";
import Note from "@/lib/models/Note";
import { requireAuth, apiResponse, apiError } from "@/lib/utils/api-helpers";

/** GET /api/quizzes — List quizzes */
export async function GET(req: NextRequest) {
  const auth = requireAuth(req);
  if ("error" in auth) return auth.error;
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const subject = searchParams.get("subject");
    const noteId = searchParams.get("noteId");

    const filter: Record<string, unknown> = { user: auth.user.userId };
    if (noteId) filter.note = noteId;
    if (subject) filter.subject = subject;

    const quizzes = await Quiz.find(filter).sort({ createdAt: -1 });
    return apiResponse(quizzes);
  } catch { return apiError("Error fetching quizzes.", 500); }
}

/** POST /api/quizzes — Create a manual quiz */
export async function POST(req: NextRequest) {
  const auth = requireAuth(req);
  if ("error" in auth) return auth.error;
  try {
    await connectDB();
    const { noteId, questions, subject } = (await req.json()) as {
      noteId?: string; questions?: unknown[]; subject?: string;
    };
    if (!noteId || !Array.isArray(questions) || questions.length === 0)
      return apiError("noteId and questions required.", 400);

    const note = await Note.findOne({ _id: noteId, owner: auth.user.userId });
    if (!note) return apiError("Note not found or unauthorized", 404);

    const quiz = await Quiz.create({ user: auth.user.userId, note: noteId, questions, subject, isAIGenerated: false });
    return apiResponse({ message: "Quiz created.", quiz }, 201);
  } catch { return apiError("Error creating quiz.", 500); }
}
