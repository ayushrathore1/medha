"use client";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { apiPost, apiGet } from "@/lib/api";

interface Msg { role: "user" | "assistant"; content: string; }

export default function ChatbotPage() {
  const { isAuthenticated } = useAuth();
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sid, setSid] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => { ref.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs]);

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;
    const txt = input.trim(); setInput("");
    setMsgs(p => [...p, { role: "user", content: txt }]);
    setLoading(true);
    try {
      const d = await apiPost<{ reply: string; sessionId: string }>("/api/chatbot", { message: txt, sessionId: sid });
      setMsgs(p => [...p, { role: "assistant", content: d.reply }]);
      if (d.sessionId) setSid(d.sessionId);
    } catch { setMsgs(p => [...p, { role: "assistant", content: "Something went wrong." }]); }
    finally { setLoading(false); }
  };

  const bubbleStyle = (r: string): React.CSSProperties => ({
    maxWidth: "75%", padding: "12px 16px",
    borderRadius: r === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
    background: r === "user" ? "var(--primary)" : "var(--card)",
    color: r === "user" ? "white" : "var(--foreground)",
    border: r === "assistant" ? "1px solid var(--border)" : "none",
    fontSize: 14, lineHeight: 1.7, whiteSpace: "pre-wrap",
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 100px)", maxWidth: 700, margin: "0 auto" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "16px 0", borderBottom: "1px solid var(--border)" }}>
        <h2 style={{ fontSize: 18, fontWeight: 700 }}>🤖 Medha AI</h2>
        <span style={{ fontSize: 12, color: "var(--muted-foreground)" }}>Your smart study assistant</span>
        <button onClick={() => { setMsgs([]); setSid(null); }} style={{ marginLeft: "auto", padding: "6px 14px", borderRadius: 8, border: "1px solid var(--border)", background: "var(--card)", fontSize: 12, fontWeight: 600, cursor: "pointer", color: "var(--foreground)" }}>+ New</button>
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: "20px 0" }}>
        {msgs.length === 0 && (
          <div style={{ textAlign: "center", padding: 60, color: "var(--muted-foreground)" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🤖</div>
            <h3 style={{ fontSize: 20, fontWeight: 700, color: "var(--foreground)", marginBottom: 8 }}>Hi! I&apos;m Medha AI</h3>
            <p>Ask me anything about your studies!</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center", marginTop: 24 }}>
              {["Explain BSTs", "DSA study plan", "ACID properties?", "RTU exam tips"].map(q => (
                <button key={q} onClick={() => setInput(q)} style={{ padding: "8px 16px", borderRadius: 10, border: "1px solid var(--border)", background: "var(--card)", fontSize: 13, cursor: "pointer", color: "var(--foreground)" }}>{q}</button>
              ))}
            </div>
          </div>
        )}
        {msgs.map((m, i) => (
          <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start", marginBottom: 12 }}>
            <div style={bubbleStyle(m.role)}>{m.content}</div>
          </div>
        ))}
        {loading && <div style={{ padding: "12px 16px", color: "var(--muted-foreground)", fontSize: 14 }}>Thinking...</div>}
        <div ref={ref} />
      </div>
      <form onSubmit={send} style={{ display: "flex", gap: 8, padding: "16px 0", borderTop: "1px solid var(--border)" }}>
        <input value={input} onChange={e => setInput(e.target.value)} placeholder="Ask anything..." disabled={loading}
          style={{ flex: 1, padding: "14px 16px", border: "1.5px solid var(--border)", borderRadius: 14, fontSize: 15, color: "var(--foreground)", background: "var(--secondary)", outline: "none", fontFamily: "inherit" }} />
        <button type="submit" disabled={loading || !input.trim()} style={{ padding: "14px 24px", background: "var(--primary)", color: "white", borderRadius: 14, border: "none", fontSize: 15, fontWeight: 600, cursor: "pointer" }}>Send</button>
      </form>
    </div>
  );
}
