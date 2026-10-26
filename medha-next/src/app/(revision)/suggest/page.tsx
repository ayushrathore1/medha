"use client";

import { useState } from "react";
import { apiPost } from "@/lib/api";

const EMOJIS = ["💡", "🐛", "🎨", "🚀", "📚", "🤔"];

export default function SuggestPage() {
  const [message, setMessage] = useState("");
  const [emoji, setEmoji] = useState("💡");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    setLoading(true); setError("");
    try {
      await apiPost("/api/suggestions", { message, emoji });
      setSubmitted(true);
    } catch (err) { setError(err instanceof Error ? err.message : "Failed to submit"); }
    finally { setLoading(false); }
  };

  if (submitted) return (
    <div style={{ maxWidth: 500, margin: "80px auto", textAlign: "center", padding: 32 }}>
      <div style={{ fontSize: 64, marginBottom: 16 }}>🎉</div>
      <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 8 }}>Thank You!</h2>
      <p style={{ color: "var(--muted-foreground)", marginBottom: 24 }}>Your suggestion has been received. We review every piece of feedback.</p>
      <button onClick={() => { setSubmitted(false); setMessage(""); }} style={{ padding: "10px 24px", borderRadius: 10, border: "1px solid var(--border)", background: "var(--card)", fontSize: 14, fontWeight: 600, cursor: "pointer", color: "var(--foreground)" }}>Submit Another</button>
    </div>
  );

  return (
    <div style={{ maxWidth: 600, margin: "32px auto", padding: "0 16px" }}>
      <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 4 }}>💡 Suggest a Feature</h1>
      <p style={{ color: "var(--muted-foreground)", marginBottom: 28 }}>Have an idea to make Medha better? We&apos;d love to hear it!</p>

      {error && <div style={{ padding: "12px 16px", background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 10, color: "#DC2626", fontSize: 13, marginBottom: 16 }}>{error}</div>}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 20 }}>
          <label style={{ fontSize: 14, fontWeight: 600, marginBottom: 8, display: "block" }}>Category</label>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {EMOJIS.map(e => (
              <button key={e} type="button" onClick={() => setEmoji(e)}
                style={{ width: 44, height: 44, borderRadius: 10, border: emoji === e ? "2px solid var(--primary)" : "1px solid var(--border)", background: emoji === e ? "var(--secondary)" : "var(--card)", fontSize: 20, cursor: "pointer", transition: "all 200ms" }}>{e}</button>
            ))}
          </div>
        </div>
        <div style={{ marginBottom: 24 }}>
          <label style={{ fontSize: 14, fontWeight: 600, marginBottom: 8, display: "block" }}>Your Suggestion</label>
          <textarea value={message} onChange={e => setMessage(e.target.value)} placeholder="Describe your idea, bug report, or feedback..." required rows={5}
            style={{ width: "100%", padding: "14px 16px", border: "1.5px solid var(--border)", borderRadius: 12, fontSize: 15, color: "var(--foreground)", background: "var(--secondary)", outline: "none", fontFamily: "inherit", resize: "vertical", boxSizing: "border-box" }} />
        </div>
        <button type="submit" disabled={loading || !message.trim()} style={{ width: "100%", padding: 16, background: "var(--primary)", color: "white", borderRadius: 12, border: "none", fontSize: 16, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer" }}>
          {loading ? "Submitting..." : "📤 Submit Suggestion"}
        </button>
      </form>
    </div>
  );
}
