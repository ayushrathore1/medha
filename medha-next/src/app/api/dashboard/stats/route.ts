import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db/mongoose";
import User from "@/lib/models/User";
import Todo from "@/lib/models/Todo";
import Quiz from "@/lib/models/Quiz";
import Flashcard from "@/lib/models/Flashcard";
import Note from "@/lib/models/Note";
import Topic from "@/lib/models/Topic";
import { requireAuth, apiResponse, apiError } from "@/lib/utils/api-helpers";

/** GET /api/dashboard/stats — Get dashboard stats */
export async function GET(req: NextRequest) {
  const auth = requireAuth(req);
  if ("error" in auth) return auth.error;

  try {
    await connectDB();
    const userId = auth.user.userId;

    const [user, quizCount, flashcardCount, noteCount, reviewList] = await Promise.all([
      User.findById(userId),
      Quiz.countDocuments({ user: userId }),
      Flashcard.countDocuments({ owner: userId, viewed: true }),
      Note.countDocuments({ owner: userId }),
      Topic.find({ owner: userId, difficulty: "hard" }),
    ]);

    // Calculate accuracy from quiz attempts
    const quizzes = await Quiz.find({ user: userId }).select("attempts");
    let totalQuestions = 0;
    let totalCorrect = 0;
    for (const q of quizzes) {
      if (q.attempts?.length > 0) {
        const lastAttempt = q.attempts[q.attempts.length - 1];
        totalCorrect += lastAttempt.score;
        totalQuestions += 1;
      }
    }
    const accuracy = totalQuestions > 0 ? Math.round(totalCorrect / totalQuestions) : 0;

    return apiResponse({
      streak: user?.streak || 0,
      cardsLearned: flashcardCount,
      notesCreated: noteCount,
      quizzesTaken: quizCount,
      accuracy,
      reviewList,
      userName: user?.name,
    });
  } catch (err) {
    console.error("[DASHBOARD STATS]", err);
    return apiError("Error fetching dashboard stats", 500);
  }
}
