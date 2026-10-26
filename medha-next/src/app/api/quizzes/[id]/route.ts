import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db/mongoose";
import Quiz from "@/lib/models/Quiz";
import { requireAuth, apiResponse, apiError } from "@/lib/utils/api-helpers";

/** GET /api/quizzes/[id] — Get quiz by ID */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = requireAuth(req);
  if ("error" in auth) return auth.error;
  try {
    await connectDB();
    const { id } = await params;
    const quiz = await Quiz.findOne({ _id: id, user: auth.user.userId });
    if (!quiz) return apiError("Quiz not found.", 404);
    return apiResponse(quiz);
  } catch { return apiError("Error fetching quiz.", 500); }
}

/** PUT /api/quizzes/[id] — Update quiz */
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = requireAuth(req);
  if ("error" in auth) return auth.error;
  try {
    await connectDB();
    const { id } = await params;
    const { questions, subject } = (await req.json()) as { questions?: unknown[]; subject?: string };
    const quiz = await Quiz.findOneAndUpdate(
      { _id: id, user: auth.user.userId },
      { questions, subject, updatedAt: Date.now() },
      { new: true }
    );
    if (!quiz) return apiError("Quiz not found or unauthorized", 404);
    return apiResponse({ message: "Quiz updated.", quiz });
  } catch { return apiError("Could not update quiz.", 500); }
}

/** DELETE /api/quizzes/[id] — Delete quiz */
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = requireAuth(req);
  if ("error" in auth) return auth.error;
  try {
    await connectDB();
    const { id } = await params;
    const quiz = await Quiz.findOneAndDelete({ _id: id, user: auth.user.userId });
    if (!quiz) return apiError("Quiz not found or unauthorized", 404);
    return apiResponse({ message: "Quiz deleted." });
  } catch { return apiError("Could not delete quiz.", 500); }
}

/** PATCH /api/quizzes/[id] — Submit quiz attempt */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = requireAuth(req);
  if ("error" in auth) return auth.error;
  try {
    await connectDB();
    const { id } = await params;
    const { answers } = (await req.json()) as { answers: string[] };
    const quiz = await Quiz.findOne({ _id: id, user: auth.user.userId });
    if (!quiz) return apiError("Quiz not found.", 404);
    if (!Array.isArray(answers) || answers.length !== quiz.questions.length)
      return apiError("Answer array length mismatch.", 400);

    let score = 0;
    quiz.questions.forEach((q, idx) => { if (answers[idx] === q.answer) score += 1; });
    quiz.attempts.push({ answers, score, attemptDate: new Date() });
    await quiz.save();

    return apiResponse({ message: "Quiz attempt recorded.", score, total: quiz.questions.length });
  } catch { return apiError("Error during quiz attempt.", 500); }
}
