import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db/mongoose";
import Post from "@/lib/models/Post";
import Vote from "@/lib/models/Vote";
import CharchaComment from "@/lib/models/CharchaComment";
import { requireAuth, apiResponse, apiError } from "@/lib/utils/api-helpers";

/** GET /api/charcha/posts/[id] — Get single post */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const post = await Post.findOne({ _id: id, isDeleted: false })
      .populate("author", "name avatar charchaUsername karma rank");
    if (!post) return apiError("Post not found", 404);

    const comments = await CharchaComment.find({ post: id, isDeleted: false })
      .populate("author", "name avatar charchaUsername karma rank")
      .sort({ wilsonScore: -1, createdAt: 1 });

    return apiResponse({ post, comments });
  } catch (err) {
    console.error("[CHARCHA POST GET]", err);
    return apiError("Error fetching post", 500);
  }
}

/** DELETE /api/charcha/posts/[id] — Delete (soft) a post */
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = requireAuth(req);
  if ("error" in auth) return auth.error;
  try {
    await connectDB();
    const { id } = await params;
    const post = await Post.findOne({ _id: id, author: auth.user.userId });
    if (!post) return apiError("Post not found or unauthorized", 404);
    post.isDeleted = true;
    await post.save();
    return apiResponse({ message: "Post deleted" });
  } catch { return apiError("Error deleting post", 500); }
}

/** PATCH /api/charcha/posts/[id] — Vote on a post */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = requireAuth(req);
  if ("error" in auth) return auth.error;
  try {
    await connectDB();
    const { id } = await params;
    const { voteType } = (await req.json()) as { voteType: 1 | -1 };
    if (![1, -1].includes(voteType)) return apiError("Invalid vote type", 400);

    const existingVote = await Vote.findOne({ user: auth.user.userId, targetType: "post", targetId: id });

    if (existingVote) {
      if (existingVote.voteType === voteType) {
        // Remove vote (toggle off)
        await Vote.deleteOne({ _id: existingVote._id });
        const update = voteType === 1 ? { $inc: { upvotes: -1 } } : { $inc: { downvotes: -1 } };
        await Post.findByIdAndUpdate(id, update);
        return apiResponse({ message: "Vote removed", userVote: 0 });
      } else {
        // Change vote direction
        existingVote.voteType = voteType;
        await existingVote.save();
        const update = voteType === 1
          ? { $inc: { upvotes: 1, downvotes: -1 } }
          : { $inc: { upvotes: -1, downvotes: 1 } };
        await Post.findByIdAndUpdate(id, update);
        return apiResponse({ message: "Vote changed", userVote: voteType });
      }
    } else {
      // New vote
      await Vote.create({ user: auth.user.userId, targetType: "post", targetId: id, targetModel: "Post", voteType });
      const update = voteType === 1 ? { $inc: { upvotes: 1 } } : { $inc: { downvotes: 1 } };
      await Post.findByIdAndUpdate(id, update);
      return apiResponse({ message: "Voted", userVote: voteType });
    }
  } catch (err) {
    console.error("[CHARCHA VOTE]", err);
    return apiError("Error voting", 500);
  }
}
