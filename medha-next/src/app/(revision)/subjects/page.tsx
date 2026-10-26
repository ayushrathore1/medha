"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { apiGet, apiPost, apiDelete } from "@/lib/api";

interface Subject { _id: string; name: string; }

export default function SubjectsPage() {
  const { isAuthenticated } = useAuth();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [newName, setNewName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) return;
    apiGet<{ subjects: Subject[] }>("/api/subjects")
      .then(d => setSubjects(d.subjects || []))
      .catch(() => {}).finally(() => setLoading(false));
  }, [isAuthenticated]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    try {
      const d = await apiPost<{ subject: Subject }>("/api/subjects", { name: newName });
      setSubjects([...subjects, d.subject]);
      setNewName("");
    } catch {}
  };

  const handleDelete = async (id: string) => {
    await apiDelete(`/api/subjects/${id}`);
    setSubjects(subjects.filter(s => s._id !== id));
  };

  if (loading) return <div style={{ display: "flex", justifyContent: "center", padding: 80 }}><div style={{ width: 40, height: 40, border: "3px solid var(--border)", borderTopColor: "var(--primary)", borderRadius: "50%", animation: "spin 1s linear infinite" }} /><style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style></div>;

  return (
    <div style={{ maxWidth: 600, margin: "32px auto", padding: "0 16px" }}>
      <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 24 }}>📚 My Subjects</h1>
      <form onSubmit={handleAdd} style={{ display: "flex", gap: 8, marginBottom: 24 }}>
        <input value={newName} onChange={e => setNewName(e.target.value)} placeholder="Add a subject..." required
          style={{ flex: 1, padding: "12px 14px", border: "1.5px solid var(--border)", borderRadius: 10, fontSize: 14, color: "var(--foreground)", background: "var(--secondary)", outline: "none", fontFamily: "inherit" }} />
        <button type="submit" style={{ padding: "12px 20px", background: "var(--primary)", color: "white", borderRadius: 10, border: "none", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>Add</button>
      </form>
      {subjects.length === 0 ? (
        <div style={{ textAlign: "center", padding: 40, color: "var(--muted-foreground)" }}>No subjects yet.</div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {subjects.map(s => (
            <div key={s._id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 16px", background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12 }}>
              <span style={{ fontWeight: 600 }}>{s.name}</span>
              <button onClick={() => handleDelete(s._id)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 14, color: "var(--muted-foreground)" }}>🗑</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
