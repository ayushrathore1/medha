/**
 * OopIntroLecture.jsx - All 13 Scenes
 * Programming Paradigms & OOP Introduction
 */
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { colors, containerStyle } from "./VirtualFunctionsTheme";

// ============================================
// SHARED COMPONENTS
// ============================================
export const GlassCard = ({ children, style = {}, glow = null }) => (
  <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} style={{ background: "rgba(28, 28, 30, 0.65)", backdropFilter: "blur(25px)", border: `1px solid ${glow ? `${glow}40` : "rgba(255, 255, 255, 0.12)"}`, borderRadius: "20px", padding: "1.5rem", boxShadow: glow ? `0 8px 32px ${glow}30` : "0 8px 32px rgba(0, 0, 0, 0.4)", ...style }}>{children}</motion.div>
);

const SyntaxHighlight = ({ code }) => {
  const keywords = ['int', 'void', 'class', 'public', 'private', 'protected', 'if', 'cout', 'endl'];
  const cColors = { keyword: '#569CD6', string: '#CE9178', comment: '#6A9955', number: '#B5CEA8', function: '#DCDCAA', default: '#D4D4D4' };
  const lines = code.split('\n');
  return lines.map((line, lIdx) => {
    const els = []; let i = 0;
    while (i < line.length) {
      if (line.slice(i, i + 2) === '//') { els.push(<span key={`${lIdx}-${i}`} style={{ color: cColors.comment }}>{line.slice(i)}</span>); break; }
      if (line[i] === '"') { let e = i + 1; while (e < line.length && line[e] !== '"') e++; els.push(<span key={`${lIdx}-${i}`} style={{ color: cColors.string }}>{line.slice(i, e + 1)}</span>); i = e + 1; continue; }
      if (/\d/.test(line[i])) { const m = line.slice(i).match(/^\d+\.?\d*/); if (m) { els.push(<span key={`${lIdx}-${i}`} style={{ color: cColors.number }}>{m[0]}</span>); i += m[0].length; continue; } }
      if (/[a-zA-Z_]/.test(line[i])) { const m = line.slice(i).match(/^[a-zA-Z_]\w*/); if (m) { const w = m[0]; els.push(<span key={`${lIdx}-${i}`} style={{ color: keywords.includes(w) ? cColors.keyword : line[i + w.length] === '(' ? cColors.function : cColors.default }}>{w}</span>); i += w.length; continue; } }
      els.push(<span key={`${lIdx}-${i}`} style={{ color: cColors.default }}>{line[i]}</span>); i++;
    }
    return <div key={lIdx} style={{ minHeight: '1.3em' }}>{els.length > 0 ? els : '\u00A0'}</div>;
  });
};

export const CodeBlock = ({ code, fontSize = "10px" }) => (
  <motion.pre initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ fontFamily: "'Fira Code', monospace", fontSize, lineHeight: 1.35, margin: 0, whiteSpace: "pre", overflowX: "auto", background: "rgba(30, 30, 30, 0.95)", padding: "10px 14px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.1)", maxHeight: "280px", overflowY: "auto" }}>
    <SyntaxHighlight code={code} />
  </motion.pre>
);

// ============================================
// SCENE 1: Programming Feels Like Magic
// ============================================
const Scene1 = () => {
  const [phase, setPhase] = useState(0);
  useEffect(() => { const t = [setTimeout(() => setPhase(1), 600), setTimeout(() => setPhase(2), 1200), setTimeout(() => setPhase(3), 1800)]; return () => t.forEach(clearTimeout); }, []);
  return (
    <div style={{ ...containerStyle, background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #1a1a2e 100%)" }}>
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: "center", marginBottom: "1.5rem" }}>
        <div style={{ color: colors.accent, fontWeight: 700, fontSize: "12px", letterSpacing: "3px", marginBottom: "0.3rem" }}>RTU OOP DEEP DIVE</div>
        <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} style={{ fontSize: "1.8rem", fontWeight: 700, color: colors.text }}>What is Programming?</motion.div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 1 ? 1 : 0 }} style={{ color: colors.textSec, fontSize: "13px", marginTop: "0.3rem" }}>"Write code → Run → Output"</motion.div>
      </motion.div>
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: phase >= 1 ? 1 : 0, scale: 1 }} style={{ maxWidth: "320px", margin: "0 auto", marginBottom: "1rem" }}>
        <GlassCard>
          <div style={{ fontFamily: "monospace", fontSize: "12px", color: colors.text, marginBottom: "0.5rem" }}>cout &lt;&lt; "Hello World";</div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 2 ? 1 : 0 }} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <motion.div animate={{ scale: phase >= 2 ? [1, 0.95, 1] : 1 }} style={{ padding: "6px 14px", borderRadius: "6px", background: colors.success, color: "#000", fontWeight: 600, fontSize: "11px" }}>▶ Run</motion.div>
          </motion.div>
        </GlassCard>
      </motion.div>
      <AnimatePresence>{phase >= 2 && <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ padding: "14px 24px", borderRadius: "12px", background: `${colors.success}20`, border: `2px solid ${colors.success}`, textAlign: "center", maxWidth: "280px", margin: "0 auto" }}>
        <motion.div animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 1, repeat: Infinity }} style={{ color: colors.success, fontWeight: 700, fontFamily: "monospace", fontSize: "14px" }}>Hello World ✨</motion.div>
      </motion.div>}</AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 3 ? 1 : 0 }} style={{ marginTop: "1.5rem", textAlign: "center", color: colors.accent, fontSize: "14px" }}>"Feels like magic, right?" 🪄</motion.div>
    </div>
  );
};

// ============================================
// SCENE 2: The Real Problem Is Organization
// ============================================
const Scene2 = () => {
  const [phase, setPhase] = useState(0);
  useEffect(() => { const t = [setTimeout(() => setPhase(1), 800)]; return () => t.forEach(clearTimeout); }, []);
  return (
    <div style={containerStyle}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: colors.warning, fontWeight: 700, fontSize: "13px", letterSpacing: "1.5px", marginBottom: "1.5rem" }}>📁 THE REAL PROBLEM IS ORGANIZATION</motion.div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", justifyContent: "center", marginBottom: "1.5rem" }}>
        {Array(20).fill(0).map((_, i) => (
          <motion.div key={i} initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.03 }} style={{ width: "40px", height: "50px", borderRadius: "4px", background: `${colors.text}10`, border: `1px solid ${colors.text}20`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontSize: "1.2rem" }}>📄</span>
          </motion.div>
        ))}
      </div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 1 ? 1 : 0 }} style={{ padding: "14px 24px", borderRadius: "12px", background: `${colors.danger}15`, border: `2px solid ${colors.danger}`, textAlign: "center" }}>
        <span style={{ color: colors.danger, fontWeight: 600, fontSize: "12px" }}>⚠️ 100,000+ lines of code</span>
      </motion.div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 1 ? 1 : 0 }} style={{ marginTop: "1rem", textAlign: "center" }}>
        <div style={{ color: colors.text, fontSize: "13px" }}>Small programs are easy.</div>
        <div style={{ color: colors.accent, fontSize: "14px", fontWeight: 600 }}>Big programs are about <span style={{ color: colors.warning }}>ORGANIZATION</span>.</div>
      </motion.div>
    </div>
  );
};

// ============================================
// SCENE 3: Real World Software Needs Structure
// ============================================
const Scene3 = () => {
  const [phase, setPhase] = useState(0);
  useEffect(() => { const t = [setTimeout(() => setPhase(1), 800)]; return () => t.forEach(clearTimeout); }, []);
  const systems = [
    { icon: "🛒", name: "E-Commerce" },
    { icon: "🏦", name: "Banking" },
    { icon: "🖥️", name: "Operating System" },
  ];
  return (
    <div style={containerStyle}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: colors.danger, fontWeight: 700, fontSize: "13px", letterSpacing: "1.5px", marginBottom: "1.5rem" }}>🌍 REAL WORLD SOFTWARE NEEDS STRUCTURE</motion.div>
      <div style={{ display: "flex", gap: "1.5rem", justifyContent: "center", marginBottom: "1.5rem" }}>
        {systems.map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.15 }} style={{ padding: "20px 24px", borderRadius: "16px", background: `${colors.primary}15`, border: `2px solid ${colors.primary}`, textAlign: "center", minWidth: "110px" }}>
            <div style={{ fontSize: "2.5rem", marginBottom: "0.3rem" }}>{s.icon}</div>
            <div style={{ color: colors.primary, fontWeight: 600, fontSize: "11px" }}>{s.name}</div>
          </motion.div>
        ))}
      </div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 1 ? 1 : 0 }} style={{ padding: "14px 28px", borderRadius: "12px", background: `${colors.danger}20`, border: `2px solid ${colors.danger}`, textAlign: "center" }}>
        <span style={{ color: colors.danger, fontWeight: 700, fontSize: "14px" }}>Without structure = CHAOS 🍝</span>
        <div style={{ color: colors.textSec, fontSize: "11px", marginTop: "0.3rem" }}>Disorganization = Failure</div>
      </motion.div>
    </div>
  );
};

// ============================================
// SCENE 4: What Is a Programming Paradigm?
// ============================================
const Scene4 = () => {
  const [phase, setPhase] = useState(0);
  useEffect(() => { const t = [setTimeout(() => setPhase(1), 600), setTimeout(() => setPhase(2), 1200)]; return () => t.forEach(clearTimeout); }, []);
  return (
    <div style={containerStyle}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: colors.accent, fontWeight: 700, fontSize: "13px", letterSpacing: "1.5px", marginBottom: "1.5rem" }}>🎯 WHAT IS A PROGRAMMING PARADIGM?</motion.div>
      <div style={{ display: "flex", gap: "2rem", justifyContent: "center", marginBottom: "1.5rem" }}>
        <div>
          <div style={{ color: colors.textSec, fontSize: "11px", marginBottom: "0.5rem" }}>Teaching Styles:</div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
            {["📚 Lecture", "💬 Discussion", "🎯 Practical"].map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} style={{ padding: "6px 12px", borderRadius: "6px", background: `${colors.primary}15`, fontSize: "11px", color: colors.text }}>{s}</motion.div>
            ))}
          </div>
        </div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 1 ? 1 : 0 }}>
          <div style={{ color: colors.textSec, fontSize: "11px", marginBottom: "0.5rem" }}>Cooking Styles:</div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
            {["🔥 Fry", "💧 Boil", "🍞 Bake"].map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} style={{ padding: "6px 12px", borderRadius: "6px", background: `${colors.warning}15`, fontSize: "11px", color: colors.text }}>{s}</motion.div>
            ))}
          </div>
        </motion.div>
      </div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: phase >= 2 ? 1 : 0, y: 0 }} style={{ padding: "14px 28px", borderRadius: "16px", background: `${colors.accent}20`, border: `2px solid ${colors.accent}`, textAlign: "center" }}>
        <div style={{ color: colors.accent, fontWeight: 700, fontSize: "14px" }}>Programming Paradigm = A way of thinking</div>
        <div style={{ color: colors.textSec, fontSize: "11px", marginTop: "0.3rem" }}>"A blueprint for how programs are structured"</div>
      </motion.div>
    </div>
  );
};

// ============================================
// SCENE 5: Major Paradigms
// ============================================
const Scene5 = () => {
  const [phase, setPhase] = useState(0);
  useEffect(() => { const t = [setTimeout(() => setPhase(1), 800)]; return () => t.forEach(clearTimeout); }, []);
  const paradigms = [
    { name: "Procedural", active: true },
    { name: "Object Oriented", active: true },
    { name: "Functional", active: false },
    { name: "Logic", active: false },
  ];
  return (
    <div style={containerStyle}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: colors.primary, fontWeight: 700, fontSize: "13px", letterSpacing: "1.5px", marginBottom: "1.5rem" }}>📊 MAJOR PARADIGMS</motion.div>
      <div style={{ display: "flex", gap: "1rem", justifyContent: "center", marginBottom: "1.5rem" }}>
        {paradigms.map((p, i) => (
          <motion.div key={i} initial={{ opacity: 0, scale: 0 }} animate={{ opacity: p.active || phase < 1 ? 1 : 0.4, scale: p.active && phase >= 1 ? 1.1 : 1 }} transition={{ delay: i * 0.1 }} style={{ padding: "16px 20px", borderRadius: "12px", background: p.active ? `${colors.success}15` : `${colors.text}10`, border: `2px solid ${p.active ? colors.success : colors.text}30`, textAlign: "center", minWidth: "100px" }}>
            <div style={{ color: p.active ? colors.success : colors.textSec, fontWeight: 600, fontSize: "11px" }}>{p.name}</div>
          </motion.div>
        ))}
      </div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 1 ? 1 : 0 }} style={{ padding: "10px 24px", borderRadius: "100px", background: `${colors.accent}15`, textAlign: "center" }}>
        <span style={{ color: colors.accent, fontSize: "12px" }}>Today's story: <span style={{ fontWeight: 700 }}>Procedural → OOP</span></span>
      </motion.div>
    </div>
  );
};

// ============================================
// SCENE 6: Procedural Banking Example
// ============================================
const Scene6 = () => {
  const [phase, setPhase] = useState(0);
  useEffect(() => { const t = [setTimeout(() => setPhase(1), 800)]; return () => t.forEach(clearTimeout); }, []);
  const code = `int balance = 0;  // Global!

void deposit(int x) {
    balance += x;
}

void withdraw(int x) {
    balance -= x;
}`;
  return (
    <div style={containerStyle}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: colors.warning, fontWeight: 700, fontSize: "13px", letterSpacing: "1.5px", marginBottom: "1rem" }}>🏦 PROCEDURAL BANKING (THE OPEN SYSTEM)</motion.div>
      <div style={{ display: "flex", gap: "2rem", alignItems: "flex-start" }}>
        <GlassCard style={{ maxWidth: "300px" }}><CodeBlock code={code} fontSize="10px" /></GlassCard>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 1 ? 1 : 0 }} style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
          <div style={{ padding: "10px 16px", borderRadius: "10px", background: `${colors.danger}15`, border: `1px solid ${colors.danger}` }}>
            <div style={{ color: colors.danger, fontWeight: 600, fontSize: "11px" }}>🔓 Global Variable</div>
            <div style={{ color: colors.textSec, fontSize: "10px" }}>Anyone can read/change it!</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
            {["deposit()", "withdraw()", "printReport()", "debugTest()", "tempFix()"].map((fn, i) => (
              <motion.div key={i} initial={{ x: 20 }} animate={{ x: 0 }} transition={{ delay: i * 0.1 }} style={{ padding: "6px 12px", borderRadius: "6px", background: `${colors.text}10`, fontFamily: "monospace", fontSize: "10px", color: colors.textSec, display: "flex", alignItems: "center", gap: "0.5rem" }}>
                {fn} <span style={{ color: colors.warning }}>→</span> balance
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

// ============================================
// SCENE 7: Exam Control Room Analogy
// ============================================
const Scene7 = () => {
  const [phase, setPhase] = useState(0);
  useEffect(() => { const t = [setTimeout(() => setPhase(1), 800)]; return () => t.forEach(clearTimeout); }, []);
  return (
    <div style={containerStyle}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: colors.danger, fontWeight: 700, fontSize: "13px", letterSpacing: "1.5px", marginBottom: "1.5rem" }}>🎓 EXAM CONTROL ROOM ANALOGY</motion.div>
      <div style={{ display: "flex", gap: "2rem", alignItems: "center", justifyContent: "center" }}>
        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} style={{ padding: "20px 24px", borderRadius: "16px", background: `${colors.danger}15`, border: `3px dashed ${colors.danger}`, textAlign: "center" }}>
          <div style={{ fontSize: "2rem", marginBottom: "0.3rem" }}>🚪</div>
          <div style={{ color: colors.danger, fontWeight: 700, fontSize: "12px" }}>Marks Database</div>
          <div style={{ color: colors.textSec, fontSize: "10px" }}>Door OPEN!</div>
        </motion.div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 1 ? 1 : 0 }} style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          {[
            { icon: "👨‍🎓", label: "Student", action: "changes marks" },
            { icon: "👨‍💼", label: "Staff", action: "edits randomly" },
            { icon: "🕵️", label: "Random Person", action: "deletes data" },
          ].map((p, i) => (
            <motion.div key={i} animate={{ x: phase >= 1 ? [0, 5, 0] : 0 }} transition={{ duration: 0.5, repeat: phase >= 1 ? Infinity : 0, delay: i * 0.2 }} style={{ padding: "8px 14px", borderRadius: "8px", background: `${colors.warning}15`, display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span style={{ fontSize: "1.2rem" }}>{p.icon}</span>
              <span style={{ fontSize: "10px", color: colors.textSec }}>{p.label} {p.action}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 1 ? 1 : 0 }} style={{ marginTop: "1rem", padding: "10px 20px", borderRadius: "100px", background: `${colors.danger}15`, textAlign: "center" }}>
        <span style={{ color: colors.danger, fontSize: "11px" }}>"This is global data in procedural programming" 🔓</span>
      </motion.div>
    </div>
  );
};

// ============================================
// SCENE 8: The Four Big Problems
// ============================================
const Scene8 = () => {
  const [phase, setPhase] = useState(0);
  useEffect(() => { const t = [setTimeout(() => setPhase(1), 400), setTimeout(() => setPhase(2), 800), setTimeout(() => setPhase(3), 1200), setTimeout(() => setPhase(4), 1600)]; return () => t.forEach(clearTimeout); }, []);
  const problems = [
    { icon: "🔓", title: "No Security", desc: "Data exposed to all" },
    { icon: "🌀", title: "No Structure", desc: "Functions scattered" },
    { icon: "🤯", title: "Hard to Maintain", desc: "Complex to understand" },
    { icon: "💥", title: "Ripple Effect", desc: "Fix 1 → Break 10" },
  ];
  return (
    <div style={containerStyle}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: colors.danger, fontWeight: 700, fontSize: "13px", letterSpacing: "1.5px", marginBottom: "1.5rem" }}>🚨 THE FOUR BIG PROBLEMS</motion.div>
      <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
        {problems.map((p, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 30 }} animate={{ opacity: phase > i ? 1 : 0, y: 0 }} style={{ padding: "16px", borderRadius: "12px", background: `${colors.danger}15`, border: `2px solid ${colors.danger}`, textAlign: "center", width: "110px" }}>
            <div style={{ fontSize: "1.8rem", marginBottom: "0.3rem" }}>{p.icon}</div>
            <div style={{ color: colors.danger, fontWeight: 700, fontSize: "11px" }}>{p.title}</div>
            <div style={{ color: colors.textSec, fontSize: "9px", marginTop: "0.2rem" }}>{p.desc}</div>
          </motion.div>
        ))}
      </div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 4 ? 1 : 0 }} style={{ marginTop: "1.5rem", padding: "10px 24px", borderRadius: "100px", background: `${colors.danger}20`, textAlign: "center" }}>
        <span style={{ color: colors.danger, fontWeight: 700 }}>🍝 SPAGHETTI CODE</span>
      </motion.div>
    </div>
  );
};

// ============================================
// SCENE 9: Enter OOP (The Lock Appears)
// ============================================
const Scene9 = () => {
  const [phase, setPhase] = useState(0);
  useEffect(() => { const t = [setTimeout(() => setPhase(1), 800)]; return () => t.forEach(clearTimeout); }, []);
  const code = `class BankAccount {
private:
    int balance;  // 🔒 Protected!

public:
    void deposit(int x) {
        if (x > 0)
            balance += x;
    }

    void withdraw(int x) {
        if (x > 0 && balance >= x)
            balance -= x;
    }
};`;
  return (
    <div style={containerStyle}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: colors.success, fontWeight: 700, fontSize: "13px", letterSpacing: "1.5px", marginBottom: "1rem" }}>🔐 ENTER OOP: THE LOCK APPEARS</motion.div>
      <div style={{ display: "flex", gap: "2rem", alignItems: "flex-start" }}>
        <GlassCard glow={colors.success} style={{ maxWidth: "320px" }}><CodeBlock code={code} fontSize="9px" /></GlassCard>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 1 ? 1 : 0 }} style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
          <div style={{ padding: "12px 16px", borderRadius: "10px", background: `${colors.success}15`, border: `2px solid ${colors.success}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span style={{ fontSize: "1.3rem" }}>🔒</span>
              <span style={{ color: colors.success, fontWeight: 600, fontSize: "11px" }}>private balance</span>
            </div>
            <div style={{ color: colors.textSec, fontSize: "10px" }}>No direct access!</div>
          </div>
          <div style={{ padding: "12px 16px", borderRadius: "10px", background: `${colors.primary}15`, border: `1px solid ${colors.primary}` }}>
            <div style={{ color: colors.primary, fontWeight: 600, fontSize: "11px" }}>🚪 Controlled Doors:</div>
            <div style={{ fontFamily: "monospace", fontSize: "10px", color: colors.textSec }}>deposit(), withdraw()</div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

// ============================================
// SCENE 10: Encapsulation Explained
// ============================================
const Scene10 = () => {
  const [phase, setPhase] = useState(0);
  useEffect(() => { const t = [setTimeout(() => setPhase(1), 800)]; return () => t.forEach(clearTimeout); }, []);
  return (
    <div style={containerStyle}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: colors.virtualColor, fontWeight: 700, fontSize: "13px", letterSpacing: "1.5px", marginBottom: "1.5rem" }}>💊 ENCAPSULATION EXPLAINED</motion.div>
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} style={{ display: "flex", justifyContent: "center", marginBottom: "1.5rem" }}>
        <div style={{ display: "flex", borderRadius: "100px", overflow: "hidden", border: `3px solid ${colors.accent}` }}>
          <div style={{ padding: "16px 24px", background: `${colors.danger}20`, textAlign: "center" }}>
            <div style={{ fontSize: "1.5rem" }}>📦</div>
            <div style={{ color: colors.danger, fontWeight: 600, fontSize: "11px" }}>Data</div>
            <div style={{ fontFamily: "monospace", fontSize: "9px", color: colors.textSec }}>balance</div>
          </div>
          <div style={{ padding: "16px 24px", background: `${colors.success}20`, textAlign: "center" }}>
            <div style={{ fontSize: "1.5rem" }}>⚙️</div>
            <div style={{ color: colors.success, fontWeight: 600, fontSize: "11px" }}>Functions</div>
            <div style={{ fontFamily: "monospace", fontSize: "9px", color: colors.textSec }}>deposit, withdraw</div>
          </div>
        </div>
      </motion.div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 1 ? 1 : 0 }} style={{ padding: "14px 28px", borderRadius: "16px", background: `${colors.accent}20`, border: `2px solid ${colors.accent}`, textAlign: "center" }}>
        <span style={{ color: colors.accent, fontWeight: 700, fontSize: "13px" }}>"Encapsulation = Data + Functions in one safe unit"</span>
        <div style={{ color: colors.textSec, fontSize: "11px", marginTop: "0.3rem" }}>Outside code can only press buttons, not touch data!</div>
      </motion.div>
    </div>
  );
};

// ============================================
// SCENE 11: Why This Scales
// ============================================
const Scene11 = () => {
  const [phase, setPhase] = useState(0);
  useEffect(() => { const t = [setTimeout(() => setPhase(1), 800)]; return () => t.forEach(clearTimeout); }, []);
  return (
    <div style={containerStyle}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: colors.success, fontWeight: 700, fontSize: "13px", letterSpacing: "1.5px", marginBottom: "1.5rem" }}>📈 WHY THIS SCALES</motion.div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", justifyContent: "center", marginBottom: "1.5rem" }}>
        {Array(15).fill(0).map((_, i) => (
          <motion.div key={i} initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }} style={{ padding: "8px 10px", borderRadius: "8px", background: `${colors.success}15`, border: `1px solid ${colors.success}30`, fontSize: "9px", fontFamily: "monospace", color: colors.success }}>
            acc{i + 1}
          </motion.div>
        ))}
      </div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 1 ? 1 : 0 }} style={{ padding: "14px 28px", borderRadius: "16px", background: `${colors.primary}15`, textAlign: "center" }}>
        <div style={{ color: colors.primary, fontSize: "12px" }}>Programmer only uses:</div>
        <div style={{ fontFamily: "monospace", color: colors.success, fontWeight: 600, fontSize: "14px", margin: "0.3rem 0" }}>deposit() / withdraw()</div>
        <div style={{ color: colors.accent, fontSize: "12px" }}>"You don't care HOW it works. Only THAT it works!"</div>
      </motion.div>
    </div>
  );
};

// ============================================
// SCENE 12: The Big Philosophy Shift
// ============================================
const Scene12 = () => {
  const [phase, setPhase] = useState(0);
  useEffect(() => { const t = [setTimeout(() => setPhase(1), 800)]; return () => t.forEach(clearTimeout); }, []);
  return (
    <div style={containerStyle}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: colors.accent, fontWeight: 700, fontSize: "13px", letterSpacing: "1.5px", marginBottom: "1.5rem" }}>🔄 THE BIG PHILOSOPHY SHIFT</motion.div>
      <div style={{ display: "flex", gap: "2.5rem", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ padding: "20px 24px", borderRadius: "16px", background: `${colors.danger}15`, border: `3px dashed ${colors.danger}`, marginBottom: "0.5rem" }}>
            <div style={{ fontSize: "2rem" }}>🌀</div>
          </div>
          <div style={{ color: colors.danger, fontWeight: 600, fontSize: "12px" }}>Procedural</div>
          <div style={{ color: colors.textSec, fontSize: "10px" }}>Open Chaos</div>
        </div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 1 ? 1 : 0 }} style={{ display: "flex", alignItems: "center" }}>
          <motion.div animate={{ x: [0, 10, 0] }} transition={{ duration: 1, repeat: Infinity }} style={{ fontSize: "2rem" }}>➡️</motion.div>
        </motion.div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 1 ? 1 : 0 }} style={{ textAlign: "center" }}>
          <div style={{ padding: "20px 24px", borderRadius: "16px", background: `${colors.success}15`, border: `3px solid ${colors.success}`, marginBottom: "0.5rem" }}>
            <div style={{ fontSize: "2rem" }}>🏙️</div>
          </div>
          <div style={{ color: colors.success, fontWeight: 600, fontSize: "12px" }}>OOP</div>
          <div style={{ color: colors.textSec, fontSize: "10px" }}>Organized City</div>
        </motion.div>
      </div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 1 ? 1 : 0 }} style={{ marginTop: "1rem", display: "flex", gap: "1rem", justifyContent: "center" }}>
        {["BankAccount Team", "Payment Team", "User Team"].map((t, i) => (
          <div key={i} style={{ padding: "6px 12px", borderRadius: "100px", background: `${colors.success}15`, fontSize: "10px", color: colors.success }}>{t}</div>
        ))}
      </motion.div>
    </div>
  );
};

// ============================================
// SCENE 13: The Cliffhanger
// ============================================
const Scene13 = () => {
  const [phase, setPhase] = useState(0);
  useEffect(() => { const t = [setTimeout(() => setPhase(1), 1000)]; return () => t.forEach(clearTimeout); }, []);
  return (
    <div style={{ ...containerStyle, background: "linear-gradient(135deg, #1a1a2e 0%, #0f0f1a 100%)" }}>
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: "center", marginBottom: "2rem" }}>
        <div style={{ color: colors.accent, fontWeight: 700, fontSize: "1.2rem", marginBottom: "0.5rem" }}>"If objects protect data…"</div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 1 ? 1 : 0 }} style={{ color: colors.text, fontSize: "1.3rem", fontWeight: 700 }}>"How do they talk to each other safely?"</motion.div>
      </motion.div>
      <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: phase >= 1 ? 1 : 0, scale: 1 }} style={{ display: "flex", justifyContent: "center", gap: "1rem" }}>
        <div style={{ padding: "20px 30px", borderRadius: "12px", background: `${colors.primary}20`, border: `2px solid ${colors.primary}`, textAlign: "center" }}>
          <div style={{ fontFamily: "monospace", fontSize: "11px", color: colors.primary }}>Animal part</div>
        </div>
        <div style={{ padding: "20px 30px", borderRadius: "12px", background: `${colors.success}20`, border: `2px solid ${colors.success}`, textAlign: "center" }}>
          <div style={{ fontFamily: "monospace", fontSize: "11px", color: colors.success }}>Dog part</div>
        </div>
      </motion.div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 1 ? 1 : 0 }} style={{ marginTop: "2rem", textAlign: "center", color: colors.textSec, fontSize: "12px" }}>
        "How is this laid out in memory? Object slicing?"
      </motion.div>
    </div>
  );
};

// Export all scenes
export const OopIntroScenes = [
  { title: "Programming Feels Like Magic", component: Scene1, contentText: "Write code, run, output. Hello World! Feels like magic, right?" },
  { title: "The Real Problem", component: Scene2, contentText: "Small programs easy. Big programs = 100,000+ lines. Organization is key!" },
  { title: "Real World Needs Structure", component: Scene3, contentText: "E-Commerce, Banking, OS. Without structure = chaos. Disorganization = failure." },
  { title: "What Is a Paradigm?", component: Scene4, contentText: "Teaching styles, cooking styles. Programming paradigm = a way of thinking." },
  { title: "Major Paradigms", component: Scene5, contentText: "Procedural, OOP, Functional, Logic. Today: Procedural → OOP journey." },
  { title: "Procedural Banking", component: Scene6, contentText: "Global balance. deposit(), withdraw(), everyone accesses same variable. Open system!" },
  { title: "Exam Control Room", component: Scene7, contentText: "Marks database, door open. Student, staff, random person all edit. Chaos!" },
  { title: "Four Big Problems", component: Scene8, contentText: "No security, no structure, hard to maintain, ripple effect. Spaghetti code!" },
  { title: "Enter OOP", component: Scene9, contentText: "class BankAccount with private balance. Only deposit/withdraw have access. Lock appears!" },
  { title: "Encapsulation Explained", component: Scene10, contentText: "Data + Functions in one capsule. Outside can only use buttons, not touch data." },
  { title: "Why This Scales", component: Scene11, contentText: "100 BankAccount objects. Programmer uses deposit/withdraw. Don't care HOW, only THAT!" },
  { title: "Philosophy Shift", component: Scene12, contentText: "Procedural = Open chaos. OOP = Organized city with teams." },
  { title: "Cliffhanger", component: Scene13, contentText: "If objects protect data, how do they talk safely? Memory layout? Object slicing?" },
];
