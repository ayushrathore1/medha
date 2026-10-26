"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { apiGet, apiPost, apiDelete } from "@/lib/api";

interface TopicStat { topicName: string; subject: string; total: number; viewed: number; difficulty: string; }
interface Card { _id: string; question: string; answer: string; subject: string; difficulty: string; viewed: boolean; }

export default function FlashcardsPage() {
  const { isAuthenticated } = useAuth();
  const [topics, setTopics] = useState<TopicStat[]>([]);
  const [cards, setCards] = useState<Card[]>([]);
  const [activeTopic, setActiveTopic] = useState<string | null>(null);
  const [flipped, setFlipped] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [genTopic, setGenTopic] = useState("");
  const [genSubject, setGenSubject] = useState("");
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) return;
    apiGet<{ topics: TopicStat[] }>("/api/flashcards/topics").then(d => setTopics(d.topics || [])).catch(() => {}).finally(() => setLoading(false));
  }, [isAuthenticated]);

  const loadCards = async (topic: string) => {
    setActiveTopic(topic); setFlipped({});
    const d = await apiGet<{ flashcards: Card[] }>(`/api/flashcards?topic=${encodeURIComponent(topic)}`);
    setCards(d.flashcards || []);
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault(); if (!genTopic.trim() || !genSubject.trim()) return;
    setGenerating(true);
    try {
      await apiPost("/api/flashcards/generate", { topic: genTopic, subject: genSubject });
      const d = await apiGet<{ topics: TopicStat[] }>("/api/flashcards/topics");
      setTopics(d.topics || []); setGenTopic(""); setGenSubject("");
    } catch {} finally { setGenerating(false); }
  };

  const deleteTopic = async (name: string) => {
    await apiDelete(`/api/flashcards/topics?name=${encodeURIComponent(name)}`);
    setTopics(t => t.filter(x => x.topicName !== name));
    if (activeTopic === name) { setActiveTopic(null); setCards([]); }
  };

  const inputStyle: React.CSSProperties = { padding: "12px 14px", border: "1.5px solid var(--border)", borderRadius: 10, fontSize: 14, color: "var(--foreground)", background: "var(--secondary)", outline: "none", fontFamily: "inherit" };

  if (loading) return <div style={{ display: "flex", justifyContent: "center", padding: 80 }}><div style={{ width: 40, height: 40, border: "3px solid var(--border)", borderTopColor: "var(--primary)", borderRadius: "50%", animation: "spin 1s linear infinite" }} /><style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style></div>;

  return (
    <div style={{ maxWidth: 900, margin: "32px auto", padding: "0 16px" }}>
      <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 4 }}>🎴 Flashcards</h1>
      <p style={{ color: "var(--muted-foreground)", marginBottom: 24 }}>AI-generated or manual flashcards organized by topic</p>

      <form onSubmit={handleGenerate} style={{ display: "flex", gap: 8, marginBottom: 28, flexWrap: "wrap" }}>
        <input value={genTopic} onChange={e => setGenTopic(e.target.value)} placeholder="Topic (e.g. Binary Trees)" required style={{ ...inputStyle, flex: 1, minWidth: 150 }} />
        <input value={genSubject} onChange={e => setGenSubject(e.target.value)} placeholder="Subject (e.g. DSA)" required style={{ ...inputStyle, width: 150 }} />
        <button type="submit" disabled={generating} style={{ padding: "12px 20px", background: "var(--primary)", color: "white", borderRadius: 10, border: "none", fontSize: 14, fontWeight: 600, cursor: generating ? "not-allowed" : "pointer" }}>
          {generating ? "⏳ Generating..." : "🤖 AI Generate"}
        </button>
      </form>

      {!activeTopic ? (
        topics.length === 0 ? (
          <div style={{ textAlign: "center", padding: 60, background: "var(--card)", border: "1px solid var(--border)", borderRadius: 16 }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🎴</div>
            <p style={{ fontWeight: 600 }}>No flashcard topics yet</p>
            <p style={{ color: "var(--muted-foreground)", fontSize: 14 }}>Generate some above!</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 14 }}>
            {topics.map(t => (
              <div key={t.topicName} onClick={() => loadCards(t.topicName)} style={{ padding: 20, borderRadius: 14, background: "var(--card)", border: "1.5px solid var(--border)", cursor: "pointer", transition: "all 250ms" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "var(--primary)"; (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "var(--border)"; (e.currentTarget as HTMLElement).style.transform = ""; }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <h3 style={{ fontSize: 15, fontWeight: 700 }}>{t.topicName}</h3>
                  <button onClick={(e) => { e.stopPropagation(); deleteTopic(t.topicName); }} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 12, color: "var(--muted-foreground)" }}>🗑</button>
                </div>
                <div style={{ display: "flex", gap: 8, marginTop: 8, fontSize: 12, color: "var(--muted-foreground)" }}>
                  <span style={{ padding: "2px 8px", borderRadius: 6, background: "var(--secondary)", fontWeight: 600, color: "var(--primary)" }}>{t.subject}</span>
                  <span>{t.viewed}/{t.total} reviewed</span>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        <div>
          <button onClick={() => { setActiveTopic(null); setCards([]); }} style={{ padding: "8px 16px", borderRadius: 8, border: "1px solid var(--border)", background: "var(--card)", fontSize: 13, fontWeight: 600, cursor: "pointer", color: "var(--foreground)", marginBottom: 20 }}>← Back to Topics</button>
          <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 20 }}>🎴 {activeTopic}</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 14 }}>
            {cards.map(c => (
              <div key={c._id} onClick={() => setFlipped(f => ({ ...f, [c._id]: !f[c._id] }))}
                style={{ padding: 24, borderRadius: 16, background: "var(--card)", border: `1.5px solid ${flipped[c._id] ? "var(--primary)" : "var(--border)"}`, cursor: "pointer", minHeight: 140, display: "flex", flexDirection: "column", justifyContent: "center", transition: "all 300ms" }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: flipped[c._id] ? "var(--primary)" : "var(--muted-foreground)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10 }}>{flipped[c._id] ? "Answer" : "Question"}</div>
                <p style={{ fontSize: 15, lineHeight: 1.6 }}>{flipped[c._id] ? c.answer : c.question}</p>
                <div style={{ fontSize: 11, color: "var(--muted-foreground)", marginTop: 14 }}>Tap to flip</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
