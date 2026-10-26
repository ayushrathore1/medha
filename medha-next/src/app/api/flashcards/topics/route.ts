import { NextRequest } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db/mongoose";
import Flashcard from "@/lib/models/Flashcard";
import Topic from "@/lib/models/Topic";
import { requireAuth, apiResponse, apiError } from "@/lib/utils/api-helpers";

/** GET /api/flashcards/topics — Get topics with stats */
export async function GET(req: NextRequest) {
  const auth = requireAuth(req);
  if ("error" in auth) return auth.error;
  try {
    await connectDB();
    const topics = await Flashcard.aggregate([
      { $match: { owner: new mongoose.Types.ObjectId(auth.user.userId) } },
      {
        $group: {
          _id: "$topicName",
          subject: { $first: "$subject" },
          difficulty: { $first: "$difficulty" },
          total: { $sum: 1 },
          viewed: { $sum: { $cond: [{ $eq: ["$viewed", true] }, 1, 0] } },
          createdAt: { $min: "$createdAt" },
        },
      },
      { $sort: { createdAt: -1 } },
    ]);

    const result = topics.map((t) => ({
      topicName: t._id,
      subject: t.subject || "General",
      difficulty: t.difficulty || "medium",
      total: t.total,
      viewed: t.viewed,
    }));

    return apiResponse({ topics: result });
  } catch { return apiError("Error fetching topics", 500); }
}

/** DELETE /api/flashcards/topics — Delete all flashcards of a topic */
export async function DELETE(req: NextRequest) {
  const auth = requireAuth(req);
  if ("error" in auth) return auth.error;
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const topicName = decodeURIComponent(searchParams.get("name") || "");
    if (!topicName) return apiError("Topic name is required", 400);

    await Flashcard.deleteMany({ owner: auth.user.userId, topicName });
    await Topic.findOneAndDelete({ owner: auth.user.userId, name: topicName });
    return apiResponse({ message: "Topic deleted successfully" });
  } catch { return apiError("Error deleting topic", 500); }
}
