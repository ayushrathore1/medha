"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { apiGet, apiPost, apiDelete } from "@/lib/api";

export default function NotesPage() {
  const { isAuthenticated } = useAuth();
  const [notes, setNotes] = useState<Array<{ _id: string; title: string; content: string; subjectTag?: string; isPublic: boolean; createdAt: string; likes: string[]; owner?: { name: string } }>>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [subjectTag, setSubjectTag] = useState("");

  useEffect(() => {
    if (!isAuthenticated) return;
    apiGet<{ notes: typeof notes }>("/api/notes").then(data => setNotes(data.notes)).catch(() => {}).finally(() => setLoading(false));
  }, [isAuthenticated]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    try {
      const res = await apiPost<{ note: typeof notes[0] }>("/api/notes", { title, content, subjectTag: subjectTag || "General" });
      setNotes([res.note, ...notes]); setTitle(""); setContent(""); setSubjectTag(""); setShowCreate(false);
    } catch {}
  };

  const handleDelete = async (id: string) => {
    await apiDelete(`/api/notes/${id}`); setNotes(notes.filter(n => n._id !== id));
  };

  const inputStyle: React.CSSProperties = { width: "100%", padding: "12px 14px", border: "1.5px solid var(--border)", borderRadius: 10, fontSize: 14, color: "var(--foreground)", background: "var(--secondary)", outline: "none", fontFamily: "inherit", boxSizing: "border-box" };

  if (loading) return <div style={{ display: "flex", justifyContent: "center", padding: 80 }}><div style={{ width: 40, height: 40, border: "3px solid var(--border)", borderTopColor: "var(--primary)", borderRadius: "50%", animation: "spin 1s linear infinite" }} /><style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style></div>;

  return (
    <div style={{ maxWidth: 800, margin: "32px auto", padding: "0 16px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 4 }}>📝 My Notes</h1>
          <p style={{ color: "var(--muted-foreground)", fontSize: 14 }}>Your personal study vault</p>
        </div>
        <button onClick={() => setShowCreate(!showCreate)} style={{ padding: "10px 20px", borderRadius: 10, border: showCreate ? "1px solid var(--border)" : "none", background: showCreate ? "var(--card)" : "var(--primary)", color: showCreate ? "var(--foreground)" : "white", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
          {showCreate ? "Cancel" : "+ New Note"}
        </button>
      </div>

      {showCreate && (
        <form onSubmit={handleCreate} style={{ padding: 24, background: "var(--card)", border: "1px solid var(--border)", borderRadius: 16, marginBottom: 24 }}>
          <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Note title" required style={{ ...inputStyle, marginBottom: 12 }} />
          <input value={subjectTag} onChange={e => setSubjectTag(e.target.value)} placeholder="Subject (e.g. DSA, DBMS)" style={{ ...inputStyle, marginBottom: 12 }} />
          <textarea value={content} onChange={e => setContent(e.target.value)} placeholder="Write your note..." required rows={6} style={{ ...inputStyle, marginBottom: 12, resize: "vertical" }} />
          <button type="submit" style={{ padding: "12px 24px", background: "var(--primary)", color: "white", borderRadius: 10, border: "none", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>📝 Create Note</button>
        </form>
      )}

      {notes.length === 0 ? (
        <div style={{ textAlign: "center", padding: 60, background: "var(--card)", border: "1px solid var(--border)", borderRadius: 16 }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>📝</div>
          <p style={{ fontWeight: 600 }}>No notes yet</p>
          <p style={{ color: "var(--muted-foreground)", fontSize: 14 }}>Create your first one above!</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {notes.map(note => (
            <div key={note._id} style={{ padding: "18px 20px", background: "var(--card)", border: "1px solid var(--border)", borderRadius: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>{note.title}</h3>
                  {note.subjectTag && <span style={{ fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 6, background: "var(--secondary)", color: "var(--primary)" }}>{note.subjectTag}</span>}
                </div>
                <button onClick={() => handleDelete(note._id)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 14, color: "var(--muted-foreground)" }}>🗑</button>
              </div>
              <p style={{ fontSize: 14, color: "var(--muted-foreground)", marginTop: 8, lineHeight: 1.6, overflow: "hidden", maxHeight: 60 }}>{note.content}</p>
              <div style={{ fontSize: 12, color: "var(--muted-foreground)", marginTop: 8 }}>{note.isPublic ? "🌍 Public" : "🔒 Private"} · ❤️ {note.likes?.length || 0} · {new Date(note.createdAt).toLocaleDateString()}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
