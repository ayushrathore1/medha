"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { apiGet, apiPost } from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Share2, ThumbsUp, ThumbsDown, MessageSquare, Shield, Clock } from "lucide-react";

const AVATARS = ["🐼", "🦊", "🦉", "🐯", "🦁", "🐺", "🐸", "🐵", "🐰", "🐻", "🦄", "🐲", "🦅", "🐧", "🦋", "🌟", "🚀", "🎨", "📚", "💡"];

const CATEGORIES = [
  { id: "doubts", label: "💡 Doubts" },
  { id: "resources", label: "📚 Resources" },
  { id: "memes", label: "😂 Memes" },
  { id: "off-topic", label: "💬 Off-Topic" },
  { id: "announcements", label: "📢 Announcements" },
];

const COMMENT_SORTS = [
  { id: "best", label: "🏆 Best" },
  { id: "new", label: "✨ New" },
  { id: "top", label: "⬆️ Top" },
  { id: "old", label: "📅 Old" },
];

interface Comment {
  _id: string;
  content: string;
  createdAt: string;
  score: number;
  userVote: number;
  author?: {
    charchaUsername?: string;
    avatarIndex?: number;
    rank?: string;
  };
  replies?: Comment[];
}

interface Post {
  _id: string;
  title: string;
  content: string;
  tag: string;
  score: number;
  commentCount: number;
  userVote: number;
  shareSlug?: string;
  createdAt: string;
  author?: {
    charchaUsername?: string;
    avatarIndex?: number;
    rank?: string;
  };
}

function CharchaPostContent() {
  const { idOrSlug } = useParams();
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();

  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [commentSort, setCommentSort] = useState("best");
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchPost = useCallback(async () => {
    try {
      setLoading(true);
      const res = await apiGet<{ post: Post }>(`/api/charcha/posts/${idOrSlug}`);
      setPost(res.post);
    } catch (error) {
      console.error("Error fetching post:", error);
    } finally {
      setLoading(false);
    }
  }, [idOrSlug]);

  const fetchComments = useCallback(async () => {
    if (!post) return;
    try {
      const res = await apiGet<{ comments: Comment[] }>(
        `/api/charcha/posts/${post._id}/comments?sort=${commentSort}`
      );
      setComments(res.comments);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  }, [post, commentSort]);

  useEffect(() => {
    fetchPost();
  }, [fetchPost]);

  useEffect(() => {
    if (post) {
      fetchComments();
    }
  }, [post, commentSort, fetchComments]);

  const handleVote = async (targetType: "post" | "comment", targetId: string, voteType: 1 | -1) => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    try {
      const res = await apiPost<{ upvotes: number; downvotes: number; score: number; userVote: number }>(
        `/api/charcha/vote`,
        { targetType, targetId, voteType }
      );

      if (targetType === "post") {
        setPost((prev) =>
          prev
            ? {
                ...prev,
                score: res.score,
                userVote: res.userVote,
              }
            : null
        );
      } else {
        const updateCommentVote = (items: Comment[]): Comment[] => {
          return items.map((item) => {
            if (item._id === targetId) {
              return {
                ...item,
                score: res.score,
                userVote: res.userVote,
              };
            }
            if (item.replies && item.replies.length > 0) {
              return { ...item, replies: updateCommentVote(item.replies) };
            }
            return item;
          });
        };
        setComments(updateCommentVote(comments));
      }
    } catch (error) {
      console.error("Vote error:", error);
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated || !newComment.trim() || !post) return;

    try {
      setSubmitting(true);
      const res = await apiPost<{ comment: Comment }>(
        `/api/charcha/posts/${post._id}/comments`,
        { content: newComment }
      );

      setComments((prev) => [res.comment, ...prev]);
      setNewComment("");
      setPost((prev) =>
        prev ? { ...prev, commentCount: (prev.commentCount || 0) + 1 } : null
      );
    } catch (error) {
      console.error("Add comment error:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleReply = async (parentCommentId: string) => {
    if (!isAuthenticated || !replyContent.trim() || !post) return;

    try {
      setSubmitting(true);
      const res = await apiPost<{ comment: Comment }>(
        `/api/charcha/posts/${post._id}/comments`,
        { content: replyContent, parentCommentId }
      );

      const addReplyToComment = (items: Comment[]): Comment[] => {
        return items.map((item) => {
          if (item._id === parentCommentId) {
            return {
              ...item,
              replies: [...(item.replies || []), res.comment],
            };
          }
          if (item.replies && item.replies.length > 0) {
            return { ...item, replies: addReplyToComment(item.replies) };
          }
          return item;
        });
      };

      setComments(addReplyToComment(comments));
      setReplyingTo(null);
      setReplyContent("");
      setPost((prev) =>
        prev ? { ...prev, commentCount: (prev.commentCount || 0) + 1 } : null
      );
    } catch (error) {
      console.error("Reply error:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleShare = async () => {
    if (!post) return;
    const shareUrl = `${window.location.origin}/charcha/post/${post.shareSlug || post._id}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: post.content.substring(0, 100) + "...",
          url: shareUrl,
        });
      } catch (err) {}
    } else {
      navigator.clipboard.writeText(shareUrl);
      alert("Link copied to clipboard!");
    }
  };

  const formatTime = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const m = Math.floor(diff / 60000);
    if (m < 1) return "just now";
    if (m < 60) return `${m}m ago`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h ago`;
    const d = Math.floor(h / 24);
    if (d < 7) return `${d}d ago`;
    return new Date(dateStr).toLocaleDateString();
  };

  const getAvatar = (avatarIndex: number | undefined) => {
    if (avatarIndex === undefined || avatarIndex === -1) return "🎭";
    return AVATARS[avatarIndex % AVATARS.length];
  };

  const renderComment = (comment: Comment, depth = 0) => {
    const maxDepth = 5;

    return (
      <div
        key={comment._id}
        className="mt-4 p-4 rounded-xl bg-[var(--card)] border border-[var(--border)] transition-all hover:border-[var(--primary)]/30"
        style={{
          marginLeft: Math.min(depth, maxDepth) * 16,
        }}
      >
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xl">{getAvatar(comment.author?.avatarIndex)}</span>
          <span className="font-semibold text-sm text-[var(--foreground)]">
            {comment.author?.charchaUsername || "Anonymous"}
          </span>
          {comment.author?.rank && comment.author.rank !== "Noob" && (
            <span className="px-1.5 py-0.5 rounded bg-[var(--secondary)] text-[var(--primary)] text-[10px] font-bold">
              {comment.author.rank}
            </span>
          )}
          <span className="text-xs text-[var(--muted-foreground)] flex items-center gap-1 ml-auto">
            <Clock size={10} /> {formatTime(comment.createdAt)}
          </span>
        </div>

        <p className="text-sm text-[var(--muted-foreground)] leading-relaxed mb-3 whitespace-pre-wrap">{comment.content}</p>

        <div className="flex items-center gap-3">
          <button
            onClick={() => handleVote("comment", comment._id, 1)}
            className={`p-1.5 rounded-lg hover:bg-[var(--secondary)] transition-colors text-sm flex items-center gap-1 ${
              comment.userVote === 1 ? "text-[var(--primary)] font-extrabold" : "text-[var(--muted-foreground)]"
            }`}
          >
            <ThumbsUp size={14} />
          </button>
          <span className="font-bold text-xs text-[var(--foreground)]">{comment.score || 0}</span>
          <button
            onClick={() => handleVote("comment", comment._id, -1)}
            className={`p-1.5 rounded-lg hover:bg-[var(--secondary)] transition-colors text-sm flex items-center gap-1 ${
              comment.userVote === -1 ? "text-red-500 font-extrabold" : "text-[var(--muted-foreground)]"
            }`}
          >
            <ThumbsDown size={14} />
          </button>

          {isAuthenticated && depth < maxDepth && (
            <button
              onClick={() => setReplyingTo(replyingTo === comment._id ? null : comment._id)}
              className="text-xs font-semibold text-[var(--primary)] hover:underline ml-4 cursor-pointer"
            >
              💬 Reply
            </button>
          )}
        </div>

        {replyingTo === comment._id && (
          <div className="mt-3 flex flex-col gap-2">
            <textarea
              className="w-full min-h-[80px] p-3 rounded-lg border border-[var(--border)] text-sm text-[var(--foreground)] bg-[var(--secondary)] outline-none focus:border-[var(--primary)]"
              placeholder="Write a reply..."
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
            />
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => handleReply(comment._id)}
                disabled={submitting || !replyContent.trim()}
                className="px-4 py-2 rounded-lg bg-[var(--primary)] text-white text-xs font-semibold hover:opacity-90 disabled:opacity-50 cursor-pointer"
              >
                {submitting ? "Replying..." : "Post Reply"}
              </button>
              <button
                onClick={() => setReplyingTo(null)}
                className="px-4 py-2 rounded-lg bg-[var(--secondary)] text-[var(--foreground)] text-xs font-semibold border border-[var(--border)] hover:bg-[var(--border)] cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {comment.replies && comment.replies.length > 0 && (
          <div className="mt-2 border-l border-dashed border-[var(--border)] pl-2">
            {comment.replies.map((reply) => renderComment(reply, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-10 h-10 border-4 border-[var(--border)] border-t-[var(--primary)] rounded-full animate-spin" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="max-w-xl mx-auto my-12 text-center p-8 bg-[var(--card)] border border-[var(--border)] rounded-2xl">
        <div className="text-4xl mb-4">🔍</div>
        <h3 className="text-xl font-bold mb-2">Post Not Found</h3>
        <p className="text-[var(--muted-foreground)] text-sm mb-6">This discussion may have been deleted or the link is invalid.</p>
        <button
          onClick={() => router.push("/charcha")}
          className="px-6 py-2.5 rounded-xl bg-[var(--primary)] text-white font-semibold cursor-pointer"
        >
          Back to Charcha
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 800, margin: "32px auto", padding: "0 16px" }}>
      <button
        onClick={() => router.push("/charcha")}
        className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[var(--card)] border border-[var(--border)] hover:bg-[var(--secondary)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] font-semibold text-sm transition-all mb-6 cursor-pointer"
      >
        <ArrowLeft size={16} /> Back to Charcha
      </button>

      <article className="p-6 rounded-2xl bg-[var(--card)] border border-[var(--border)] mb-8 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-3xl">{getAvatar(post.author?.avatarIndex)}</span>
          <div>
            <div className="font-bold text-sm text-[var(--foreground)]">
              {post.author?.charchaUsername || "Anonymous"}
              {post.author?.rank && post.author.rank !== "Noob" && (
                <span className="ml-2 px-1.5 py-0.5 rounded bg-[var(--secondary)] text-[var(--primary)] text-[10px] font-bold">
                  {post.author.rank}
                </span>
              )}
            </div>
            <div className="text-xs text-[var(--muted-foreground)] flex items-center gap-1 mt-0.5">
              <Clock size={11} /> {formatTime(post.createdAt)}
            </div>
          </div>
          <span className="ml-auto text-xs font-bold px-3 py-1 rounded-full bg-[var(--secondary)] text-[var(--primary)]">
            {CATEGORIES.find((c) => c.id === post.tag)?.label || post.tag}
          </span>
        </div>

        <h1 className="text-2xl font-black text-[var(--foreground)] tracking-tight mb-4">{post.title}</h1>
        <p className="text-sm text-[var(--muted-foreground)] leading-relaxed mb-6 whitespace-pre-wrap">{post.content}</p>

        <div className="flex items-center gap-4 pt-4 border-t border-[var(--border)]">
          <button
            onClick={() => handleVote("post", post._id, 1)}
            className={`p-2 rounded-xl hover:bg-[var(--secondary)] transition-colors flex items-center gap-1.5 ${
              post.userVote === 1 ? "text-[var(--primary)] font-extrabold" : "text-[var(--muted-foreground)]"
            }`}
          >
            <ThumbsUp size={18} />
          </button>
          <span className="font-extrabold text-sm text-[var(--foreground)]">{post.score || 0}</span>
          <button
            onClick={() => handleVote("post", post._id, -1)}
            className={`p-2 rounded-xl hover:bg-[var(--secondary)] transition-colors flex items-center gap-1.5 ${
              post.userVote === -1 ? "text-red-500 font-extrabold" : "text-[var(--muted-foreground)]"
            }`}
          >
            <ThumbsDown size={18} />
          </button>

          <span className="text-xs font-bold text-[var(--muted-foreground)] flex items-center gap-1.5 ml-auto">
            <MessageSquare size={16} /> {post.commentCount || 0} Comments
          </span>

          <button
            onClick={handleShare}
            className="p-2 rounded-xl hover:bg-[var(--secondary)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors flex items-center gap-1.5 cursor-pointer font-bold text-xs"
          >
            <Share2 size={16} /> Share
          </button>
        </div>
      </article>

      <section>
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <h2 className="text-lg font-bold flex items-center gap-1.5 text-[var(--foreground)]">
            💬 Discussion ({comments.length})
          </h2>
          <div className="flex gap-1.5 bg-[var(--secondary)] p-1 rounded-xl border border-[var(--border)]">
            {COMMENT_SORTS.map((s) => (
              <button
                key={s.id}
                onClick={() => setCommentSort(s.id)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  commentSort === s.id
                    ? "bg-[var(--primary)] text-white shadow-sm"
                    : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {isAuthenticated ? (
          <form onSubmit={handleAddComment} className="mb-6 flex flex-col gap-2">
            <textarea
              className="w-full min-h-[100px] p-4 rounded-xl border border-[var(--border)] text-sm text-[var(--foreground)] bg-[var(--card)] outline-none focus:border-[var(--primary)]"
              placeholder="Add a comment... Use @username to mention someone"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <button
              type="submit"
              disabled={submitting || !newComment.trim()}
              className="self-end px-5 py-2.5 rounded-xl bg-[var(--primary)] text-white text-sm font-bold hover:opacity-90 disabled:opacity-50 cursor-pointer"
            >
              {submitting ? "Posting..." : "Comment"}
            </button>
          </form>
        ) : (
          <div className="p-4 rounded-xl bg-[var(--secondary)] text-center text-sm text-[var(--muted-foreground)] mb-6 border border-[var(--border)]">
            <a href="/login" className="text-[var(--primary)] font-bold hover:underline">
              Sign In
            </a>{" "}
            to join the discussion and share your thoughts.
          </div>
        )}

        <div className="space-y-4">
          {comments.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-[var(--card)] border border-[var(--border)] text-[var(--muted-foreground)]">
              <div className="text-3xl mb-2">💭</div>
              <p className="font-semibold text-sm">No comments yet</p>
              <p className="text-xs">Be the first to share your thoughts!</p>
            </div>
          ) : (
            comments.map((comment) => renderComment(comment))
          )}
        </div>
      </section>
    </div>
  );
}

export default function CharchaPostPage() {
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-10 h-10 border-4 border-[var(--border)] border-t-[var(--primary)] rounded-full animate-spin" />
      </div>
    }>
      <CharchaPostContent />
    </Suspense>
  );
}
