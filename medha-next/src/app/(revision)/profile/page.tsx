"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { apiGet, apiPut } from "@/lib/api";

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: "", college: "", university: "", branch: "", year: "" });
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({ streak: 0, cardsLearned: 0, notesCreated: 0, quizzesTaken: 0, accuracy: 0 });

  useEffect(() => {
    if (user) setForm({ name: user.name, college: user.college, university: user.university, branch: user.branch, year: user.year });
    apiGet<{ streak: number; cardsLearned: number; notesCreated: number; quizzesTaken: number; accuracy: number }>("/api/dashboard/stats")
      .then(setStats).catch(() => {});
  }, [user]);

  const handleSave = async () => {
    setLoading(true);
    try {
      const res = await apiPut<{ user: Record<string, unknown> }>("/api/users/profile", form);
      updateUser(res.user as Parameters<typeof updateUser>[0]);
      setEditing(false);
    } catch {} finally { setLoading(false); }
  };

  const statCards = [
    { label: "Streak", value: `${stats.streak} 🔥`, color: "#F59E0B" },
    { label: "Cards Learned", value: stats.cardsLearned, color: "var(--primary)" },
    { label: "Notes Created", value: stats.notesCreated, color: "#10B981" },
    { label: "Quizzes Taken", value: stats.quizzesTaken, color: "var(--primary)" },
    { label: "Accuracy", value: `${stats.accuracy}%`, color: "#EF4444" },
  ];

  return (
    <div style={{ maxWidth: 700, margin: "32px auto", padding: "0 16px" }}>
      {/* Profile Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 32 }}>
        <div style={{ width: 80, height: 80, borderRadius: 24, background: "linear-gradient(135deg, var(--primary), #d46936)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, fontWeight: 800, color: "white", flexShrink: 0 }}>
          {user?.name?.[0]?.toUpperCase() || "U"}
        </div>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: "var(--foreground)", margin: 0 }}>{user?.name}</h1>
          <p style={{ fontSize: 14, color: "var(--muted-foreground)", margin: "4px 0 0" }}>{user?.email}</p>
          {user?.college && <p style={{ fontSize: 13, color: "var(--muted-foreground)", margin: "2px 0 0" }}>{user.college}</p>}
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: 12, marginBottom: 32 }}>
        {statCards.map((s) => (
          <div key={s.label} style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 16, padding: "16px 14px", textAlign: "center" }}>
            <div style={{ fontSize: 24, fontWeight: 800, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 12, color: "var(--muted-foreground)", marginTop: 4, fontWeight: 500 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Edit Profile */}
      <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 20, padding: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: "var(--foreground)", margin: 0 }}>Profile Details</h2>
          <button onClick={() => editing ? handleSave() : setEditing(true)} disabled={loading}
            style={{ padding: "8px 20px", borderRadius: 10, border: "none", fontSize: 13, fontWeight: 600, cursor: "pointer", background: editing ? "var(--primary)" : "var(--secondary)", color: editing ? "white" : "var(--foreground)" }}>
            {loading ? "Saving..." : editing ? "Save" : "Edit"}
          </button>
        </div>

        {(["name", "college", "university", "branch", "year"] as const).map((field) => (
          <div key={field} style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: "var(--muted-foreground)", textTransform: "uppercase", display: "block", marginBottom: 6 }}>{field}</label>
            <input value={form[field]} onChange={(e) => setForm({ ...form, [field]: e.target.value })} disabled={!editing}
              style={{ width: "100%", padding: "12px 14px", border: "1.5px solid var(--border)", borderRadius: 10, fontSize: 14, color: "var(--foreground)", background: editing ? "var(--secondary)" : "transparent", outline: "none", fontFamily: "inherit", boxSizing: "border-box", opacity: editing ? 1 : 0.7 }} />
          </div>
        ))}
      </div>
    </div>
  );
}
