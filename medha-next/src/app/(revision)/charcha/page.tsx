"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { apiGet, apiPost } from "@/lib/api";

const CATEGORIES = [
  { id: "all", label: "🎯 All" }, { id: "doubts", label: "💡 Doubts" },
  { id: "resources", label: "📚 Resources" }, { id: "memes", label: "😂 Memes" },
  { id: "off-topic", label: "💬 Off-Topic" }, { id: "announcements", label: "📢 Announce" },
];
const SORTS = [
  { id: "hot", label: "🔥 Hot" }, { id: "new", label: "✨ New" }, { id: "top", label: "🏆 Top" },
];
const AVATARS = ["🐼","🦊","🦉","🐯","🦁","🐺","🐸","🐵","🐰","🐻","🦄","🐲","🦅","🐧","🦋","🌟","🚀","🎨","📚","💡"];

interface Post { _id: string; title: string; content: string; tag: string; score: number; commentCount: number; shareSlug?: string; createdAt: string; author?: { charchaUsername?: string; avatarIndex?: number; rank?: string }; userVote?: number; }

export default function CharchaPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState("hot");
  const [category, setCategory] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [newPost, setNewPost] = useState({ title: "", content: "", tag: "off-topic", isAnonymous: false });
  const [creating, setCreating] = useState(false);

  useEffect(() => { fetchPosts(); }, [sort, category]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ sort, limit: "20" });
      if (category !== "all") params.append("tag", category);
      const data = await apiGet<{ posts: Post[] }>(`/api/charcha/posts?${params}`);
      setPosts(data.posts || []);
    } catch {} finally { setLoading(false); }
  };

  const handleVote = async (postId: string, voteType: 1 | -1) => {
    if (!isAuthenticated) { router.push("/login"); return; }
    try {
      const res = await apiPost<{ userVote: number }>(`/api/charcha/posts/${postId}`, { voteType });
      setPosts((prev) => prev.map((p) => p._id === postId ? { ...p, userVote: res.userVote, score: p.score + (res.userVote === 0 ? -voteType : voteType) } : p));
    } catch {}
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost.title.trim() || !newPost.content.trim()) return;
    setCreating(true);
    try {
      const res = await apiPost<{ post: Post }>("/api/charcha/posts", newPost);
      setPosts([res.post, ...posts]);
      setShowModal(false);
      setNewPost({ title: "", content: "", tag: "off-topic", isAnonymous: false });
    } catch {} finally { setCreating(false); }
  };

  const formatTime = (d: string) => {
    const diff = Date.now() - new Date(d).getTime();
    const m = Math.floor(diff / 60000); if (m < 1) return "now";
    if (m < 60) return `${m}m`; const h = Math.floor(m / 60);
    if (h < 24) return `${h}h`; return `${Math.floor(h / 24)}d`;
  };

  const cardStyle: React.CSSProperties = { background: "var(--card)", border: "1px solid var(--border)", borderRadius: 18, padding: "20px 18px", marginBottom: 12, transition: "border-color 200ms" };
  const inputStyle: React.CSSProperties = { width: "100%", padding: "12px 14px", border: "1.5px solid var(--border)", borderRadius: 10, fontSize: 14, color: "var(--foreground)", background: "var(--secondary)", outline: "none", fontFamily: "inherit", boxSizing: "border-box" };

  return (
    <div style={{ maxWidth: 900, margin: "24px auto", padding: "0 16px" }}>
      <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 4 }}>💬 Charcha</h1>
      <p style={{ color: "var(--muted-foreground)", marginBottom: 24 }}>Where students connect, share, and grow together ✨</p>

      {/* Sort + Category */}
      <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
        {SORTS.map((s) => (
          <button key={s.id} onClick={() => setSort(s.id)} style={{ padding: "8px 16px", borderRadius: 10, border: sort === s.id ? "2px solid var(--primary)" : "1px solid var(--border)", background: sort === s.id ? "var(--secondary)" : "var(--card)", fontSize: 13, fontWeight: 600, cursor: "pointer", color: "var(--foreground)" }}>{s.label}</button>
        ))}
      </div>
      <div style={{ display: "flex", gap: 6, marginBottom: 24, flexWrap: "wrap" }}>
        {CATEGORIES.map((c) => (
          <button key={c.id} onClick={() => setCategory(c.id)} style={{ padding: "6px 14px", borderRadius: 8, border: category === c.id ? "2px solid var(--primary)" : "1px solid var(--border)", background: category === c.id ? "var(--secondary)" : "transparent", fontSize: 12, fontWeight: 600, cursor: "pointer", color: "var(--foreground)" }}>{c.label}</button>
        ))}
      </div>

      {/* Posts */}
      {loading ? (
        <div style={{ textAlign: "center", padding: 60 }}><div style={{ width: 36, height: 36, border: "3px solid var(--border)", borderTopColor: "var(--primary)", borderRadius: "50%", animation: "spin 1s linear infinite", margin: "0 auto" }} /><style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style></div>
      ) : posts.length === 0 ? (
        <div style={{ textAlign: "center", padding: 60, ...cardStyle }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>📝</div>
          <p style={{ fontWeight: 600, marginBottom: 4 }}>No posts yet!</p>
          <p style={{ color: "var(--muted-foreground)", fontSize: 14 }}>Be the first to start a discussion</p>
        </div>
      ) : posts.map((post) => (
        <div key={post._id} style={cardStyle}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
            <span style={{ fontSize: 24 }}>{AVATARS[(post.author?.avatarIndex || 0) % AVATARS.length]}</span>
            <div>
              <span style={{ fontWeight: 600, fontSize: 14 }}>{post.author?.charchaUsername || "Anonymous"}</span>
              {post.author?.rank && post.author.rank !== "Noob" && <span style={{ fontSize: 12, opacity: 0.6, marginLeft: 6 }}>[{post.author.rank}]</span>}
              <div style={{ fontSize: 11, color: "var(--muted-foreground)" }}>{formatTime(post.createdAt)}</div>
            </div>
            <span style={{ marginLeft: "auto", fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 6, background: "var(--secondary)", color: "var(--primary)" }}>{CATEGORIES.find((c) => c.id === post.tag)?.label || post.tag}</span>
          </div>
          <h3 onClick={() => router.push(`/charcha/${post.shareSlug || post._id}`)} style={{ fontSize: 17, fontWeight: 700, cursor: "pointer", marginBottom: 6, color: "var(--foreground)" }}>{post.title}</h3>
          <p style={{ fontSize: 14, color: "var(--muted-foreground)", lineHeight: 1.6, marginBottom: 14 }}>{post.content.length > 300 ? post.content.slice(0, 300) + "..." : post.content}</p>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button onClick={() => handleVote(post._id, 1)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 16, opacity: post.userVote === 1 ? 1 : 0.5 }}>⬆️</button>
            <span style={{ fontWeight: 700, fontSize: 14 }}>{post.score || 0}</span>
            <button onClick={() => handleVote(post._id, -1)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 16, opacity: post.userVote === -1 ? 1 : 0.5 }}>⬇️</button>
            <button onClick={() => router.push(`/charcha/${post.shareSlug || post._id}`)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 13, color: "var(--muted-foreground)", marginLeft: 8 }}>💬 {post.commentCount || 0}</button>
          </div>
        </div>
      ))}

      {/* FAB */}
      <button onClick={() => isAuthenticated ? setShowModal(true) : router.push("/login")} style={{ position: "fixed", bottom: 24, right: 24, width: 56, height: 56, borderRadius: 16, background: "var(--primary)", color: "white", border: "none", fontSize: 24, cursor: "pointer", boxShadow: "0 8px 24px rgba(99,102,241,0.3)", zIndex: 50 }}>✏️</button>

      {/* Modal */}
      {showModal && (
        <div onClick={() => setShowModal(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
          <div onClick={(e) => e.stopPropagation()} style={{ background: "var(--card)", borderRadius: 20, padding: 28, maxWidth: 500, width: "100%", border: "1px solid var(--border)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
              <h2 style={{ fontSize: 20, fontWeight: 700 }}>✏️ Create Post</h2>
              <button onClick={() => setShowModal(false)} style={{ background: "none", border: "none", fontSize: 18, cursor: "pointer", color: "var(--muted-foreground)" }}>✕</button>
            </div>
            <form onSubmit={handleCreate}>
              <input value={newPost.title} onChange={(e) => setNewPost({ ...newPost, title: e.target.value })} placeholder="What's on your mind?" required maxLength={300} style={{ ...inputStyle, marginBottom: 12 }} />
              <textarea value={newPost.content} onChange={(e) => setNewPost({ ...newPost, content: e.target.value })} placeholder="Share your thoughts..." required maxLength={10000} rows={5} style={{ ...inputStyle, marginBottom: 12, resize: "vertical" }} />
              <select value={newPost.tag} onChange={(e) => setNewPost({ ...newPost, tag: e.target.value })} style={{ ...inputStyle, marginBottom: 12 }}>
                {CATEGORIES.filter((c) => c.id !== "all").map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
              </select>
              <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, marginBottom: 16, cursor: "pointer", color: "var(--muted-foreground)" }}>
                <input type="checkbox" checked={newPost.isAnonymous} onChange={(e) => setNewPost({ ...newPost, isAnonymous: e.target.checked })} /> Post anonymously
              </label>
              <button type="submit" disabled={creating} style={{ width: "100%", padding: 14, background: "var(--primary)", color: "white", borderRadius: 12, border: "none", fontSize: 15, fontWeight: 700, cursor: creating ? "not-allowed" : "pointer" }}>
                {creating ? "Posting..." : "📤 Post to Charcha"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
