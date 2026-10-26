import Link from "next/link";

interface AuthLeftColumnProps {
  preLabel: string;
  headline1: string;
  headline2: string;
  subText: string;
}

export default function AuthLeftColumn({ preLabel, headline1, headline2, subText }: AuthLeftColumnProps) {
  return (
    <div style={{ background: "var(--ink)", position: "relative", overflow: "hidden", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "60px 48px", minHeight: "100vh" }}>
      <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)", backgroundSize: "48px 48px", opacity: 0.5 }} />
      <div style={{ position: "absolute", width: 400, height: 400, right: -80, top: -80, borderRadius: "50%", background: "radial-gradient(circle, var(--primary) 0%, transparent 70%)", opacity: 0.12, filter: "blur(80px)" }} />
      <div style={{ position: "absolute", width: 300, height: 300, left: -60, bottom: -60, borderRadius: "50%", background: "radial-gradient(circle, #F59E0B 0%, transparent 70%)", opacity: 0.1, filter: "blur(80px)" }} />
      <div style={{ position: "absolute", fontSize: 200, fontWeight: 900, color: "rgba(255,255,255,0.02)", bottom: "-5%", left: "-2%", userSelect: "none", pointerEvents: "none" }}>MEDHA</div>

      <div style={{ position: "relative", zIndex: 10 }}>
        <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 22, fontWeight: 800, color: "white" }}>MEDHA</span>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--primary)", display: "inline-block" }} />
        </Link>
      </div>

      <div style={{ position: "relative", zIndex: 10 }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(232,129,78,0.15)", border: "1px solid rgba(232,129,78,0.3)", borderRadius: 999, padding: "6px 14px", fontSize: 11, fontWeight: 700, color: "var(--primary)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 24 }}>
          <span style={{ width: 5, height: 5, borderRadius: "50%", background: "var(--primary)" }} />
          {preLabel}
        </div>
        <h1 style={{ fontSize: 52, fontWeight: 800, color: "white", letterSpacing: "-0.04em", lineHeight: 1.0, margin: 0 }}>
          {headline1}<br />{headline2.replace(".", "")}<span style={{ color: "#F59E0B" }}>.</span>
        </h1>
        <p style={{ fontSize: 16, color: "rgba(255,255,255,0.6)", lineHeight: 1.7, maxWidth: 360, marginTop: 20 }}>{subText}</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 32 }}>
          {[{ icon: "⚡", t: "AI Note Summaries" }, { icon: "📄", t: "RTU PYQ Archive" }, { icon: "🎯", t: "Syllabus-Matched" }].map((f, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 999, padding: "8px 14px", fontSize: 13, color: "rgba(255,255,255,0.8)" }}>
              <span>{f.icon}</span><span>{f.t}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ position: "relative", zIndex: 10, display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ display: "flex" }}>
          {[{ f: "var(--primary)", t2: "#d46936", l: "RS" }, { f: "#F59E0B", t2: "#D97706", l: "PM" }, { f: "#8B5CF6", t2: "#6D28D9", l: "AK" }].map((a, i) => (
            <div key={i} style={{ width: 32, height: 32, borderRadius: "50%", border: "2px solid var(--ink)", background: `linear-gradient(135deg, ${a.f}, ${a.t2})`, marginLeft: i === 0 ? 0 : -8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "white" }}>{a.l}</div>
          ))}
        </div>
        <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)" }}>
          <span style={{ color: "white", fontWeight: 700 }}>149+ students</span> studying smarter
        </div>
      </div>
    </div>
  );
}
