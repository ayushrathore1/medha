import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db/mongoose";
import CharchaComment from "@/lib/models/CharchaComment";
import Post from "@/lib/models/Post";
import { requireAuth, apiResponse, apiError } from "@/lib/utils/api-helpers";

/** POST /api/charcha/comments — Create a comment */
export async function POST(req: NextRequest) {
  const auth = requireAuth(req);
  if ("error" in auth) return auth.error;
  try {
    await connectDB();
    const { content, postId, parentComment, isAnonymous } = (await req.json()) as {
      content: string; postId: string; parentComment?: string; isAnonymous?: boolean;
    };

    if (!content?.trim() || !postId) return apiError("Content and postId are required", 400);

    let depth = 0;
    if (parentComment) {
      const parent = await CharchaComment.findById(parentComment);
      if (parent) depth = Math.min(parent.depth + 1, 10);
    }

    const comment = await CharchaComment.create({
      content: content.trim(), author: auth.user.userId, post: postId,
      parentComment: parentComment || null, depth, isAnonymous: isAnonymous || false,
    });

    await Post.findByIdAndUpdate(postId, { $inc: { commentCount: 1 } });
    await comment.populate("author", "name avatar charchaUsername karma rank");

    return apiResponse({ message: "Comment created", comment }, 201);
  } catch (err) {
    console.error("[CHARCHA COMMENT CREATE]", err);
    return apiError("Error creating comment", 500);
  }
}
