import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db/mongoose";
import Post from "@/lib/models/Post";
import { requireAuth, apiResponse, apiError, getAuthUser } from "@/lib/utils/api-helpers";

/** GET /api/charcha/posts — Get posts with sorting and tag filters */
export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const tag = searchParams.get("tag");
    const sort = searchParams.get("sort") || "hot";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 50);

    const filter: Record<string, unknown> = { isDeleted: false };
    if (tag && tag !== "all") filter.tag = tag;

    let sortOption: Record<string, 1 | -1> = {};
    switch (sort) {
      case "hot": sortOption = { hotScore: -1 }; break;
      case "new": sortOption = { createdAt: -1 }; break;
      case "top": sortOption = { upvotes: -1 }; break;
      default: sortOption = { hotScore: -1 };
    }

    const [posts, total] = await Promise.all([
      Post.find(filter)
        .sort(sortOption)
        .skip((page - 1) * limit)
        .limit(limit)
        .populate("author", "name avatar charchaUsername karma rank"),
      Post.countDocuments(filter),
    ]);

    return apiResponse({ posts, total, page, pages: Math.ceil(total / limit) });
  } catch (err) {
    console.error("[CHARCHA POSTS GET]", err);
    return apiError("Error fetching posts", 500);
  }
}

/** POST /api/charcha/posts — Create a new post */
export async function POST(req: NextRequest) {
  const auth = requireAuth(req);
  if ("error" in auth) return auth.error;
  try {
    await connectDB();
    const { title, content, tag, isAnonymous, mediaUrls } = (await req.json()) as {
      title: string; content: string; tag?: string; isAnonymous?: boolean; mediaUrls?: unknown[];
    };

    if (!title?.trim() || !content?.trim()) return apiError("Title and content are required", 400);

    const post = await Post.create({
      title: title.trim(),
      content: content.trim(),
      author: auth.user.userId,
      tag: tag || "off-topic",
      isAnonymous: isAnonymous || false,
      mediaUrls: mediaUrls || [],
    });

    await post.populate("author", "name avatar charchaUsername karma rank");
    return apiResponse({ message: "Post created!", post }, 201);
  } catch (err) {
    console.error("[CHARCHA POST CREATE]", err);
    return apiError("Error creating post", 500);
  }
}
