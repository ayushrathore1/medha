/**
 * VersatileFunctionsLecturePart2.jsx - Scenes 13-24
 * Inline Functions, Trade-offs, Summary
 */
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { colors, containerStyle } from "./VirtualFunctionsTheme";
import { GlassCard, CodeBlock } from "./VersatileFunctionsLecture";

// ============================================
// SCENE 13: Transition to Performance
// ============================================
const Scene13 = () => {
  const [phase, setPhase] = useState(0);
  useEffect(() => { const t = [setTimeout(() => setPhase(1), 800)]; return () => t.forEach(clearTimeout); }, []);
  return (
    <div style={containerStyle}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: colors.accent, fontWeight: 700, fontSize: "13px", letterSpacing: "1.5px", marginBottom: "1.5rem" }}>🚀 WHAT ABOUT PERFORMANCE?</motion.div>
      <div style={{ display: "flex", gap: "1.5rem", justifyContent: "center", marginBottom: "1.5rem" }}>
        {[
          { label: "Overloading", icon: "🔀", status: "Readability ✓", color: colors.primary },
          { label: "Default Args", icon: "⚙️", status: "Flexibility ✓", color: colors.success },
          { label: "???", icon: "❓", status: "Performance?", color: colors.warning },
        ].map((item, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.2 }} style={{ padding: "16px 20px", borderRadius: "12px", background: `${item.color}15`, border: `2px solid ${item.color}`, textAlign: "center", minWidth: "120px" }}>
            <motion.div animate={i === 2 ? { scale: [1, 1.2, 1] } : {}} transition={{ duration: 1, repeat: Infinity }} style={{ fontSize: "1.8rem", marginBottom: "0.3rem" }}>{item.icon}</motion.div>
            <div style={{ color: item.color, fontWeight: 600, fontSize: "11px" }}>{item.label}</div>
            <div style={{ color: colors.textSec, fontSize: "10px" }}>{item.status}</div>
          </motion.div>
        ))}
      </div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 1 ? 1 : 0 }} style={{ padding: "14px 28px", borderRadius: "100px", background: `${colors.warning}15`, textAlign: "center" }}>
        <span style={{ color: colors.warning, fontWeight: 700, fontSize: "1.2rem" }}>INLINE FUNCTIONS ⚡</span>
      </motion.div>
    </div>
  );
};

// ============================================
// SCENE 14: Function Call Overhead
// ============================================
const Scene14 = () => {
  const [phase, setPhase] = useState(0);
  useEffect(() => { const t = [setTimeout(() => setPhase(1), 600), setTimeout(() => setPhase(2), 1200)]; return () => t.forEach(clearTimeout); }, []);
  const steps = ["Save current location", "Jump to function", "Execute function", "Jump back"];
  return (
    <div style={containerStyle}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: colors.danger, fontWeight: 700, fontSize: "13px", letterSpacing: "1.5px", marginBottom: "1rem" }}>⏱️ FUNCTION CALL OVERHEAD</motion.div>
      <div style={{ display: "flex", gap: "2rem", alignItems: "flex-start" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          {steps.map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: phase >= 1 ? 1 : 0, x: 0 }} transition={{ delay: i * 0.15 }} style={{ padding: "8px 16px", borderRadius: "8px", background: `${colors.warning}15`, display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span style={{ width: "20px", height: "20px", borderRadius: "50%", background: colors.warning, color: "#000", fontWeight: 700, fontSize: "10px", display: "flex", alignItems: "center", justifyContent: "center" }}>{i + 1}</span>
              <span style={{ fontSize: "11px", color: colors.textSec }}>{s}</span>
            </motion.div>
          ))}
        </div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 2 ? 1 : 0 }} style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <div style={{ display: "flex", alignItems: "flex-end", gap: "0.5rem" }}>
            <div style={{ width: "80px", height: "60px", background: colors.danger, borderRadius: "8px 8px 0 0", display: "flex", alignItems: "center", justifyContent: "center", color: "#000", fontWeight: 600, fontSize: "10px" }}>Overhead</div>
            <div style={{ width: "80px", height: "30px", background: colors.success, borderRadius: "8px 8px 0 0", display: "flex", alignItems: "center", justifyContent: "center", color: "#000", fontWeight: 600, fontSize: "10px" }}>Work</div>
          </div>
          <div style={{ color: colors.danger, fontSize: "11px", textAlign: "center" }}>For tiny functions:<br/>overhead &gt; actual work! 😱</div>
        </motion.div>
      </div>
    </div>
  );
};

// ============================================
// SCENE 15: Inline Functions Introduction
// ============================================
const Scene15 = () => {
  const code = `inline int square(int x) {
    return x * x;
}`;
  const [phase, setPhase] = useState(0);
  useEffect(() => { const t = [setTimeout(() => setPhase(1), 800)]; return () => t.forEach(clearTimeout); }, []);
  return (
    <div style={containerStyle}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: colors.warning, fontWeight: 700, fontSize: "13px", letterSpacing: "1.5px", marginBottom: "1.5rem" }}>⚡ INLINE FUNCTIONS</motion.div>
      <GlassCard glow={colors.warning} style={{ marginBottom: "1.5rem", maxWidth: "350px" }}><CodeBlock code={code} fontSize="11px" /></GlassCard>
      <div style={{ display: "flex", gap: "2rem" }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: phase >= 1 ? 1 : 0, y: 0 }} style={{ padding: "14px 20px", borderRadius: "12px", background: `${colors.danger}15`, border: `1px solid ${colors.danger}` }}>
          <div style={{ color: colors.danger, fontWeight: 600, fontSize: "11px" }}>WITHOUT inline:</div>
          <div style={{ fontFamily: "monospace", fontSize: "10px", color: colors.textSec }}>result = square(5);</div>
          <div style={{ fontSize: "10px", color: colors.danger }}>→ Jump to function 🐢</div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: phase >= 1 ? 1 : 0, y: 0 }} transition={{ delay: 0.2 }} style={{ padding: "14px 20px", borderRadius: "12px", background: `${colors.success}15`, border: `1px solid ${colors.success}` }}>
          <div style={{ color: colors.success, fontWeight: 600, fontSize: "11px" }}>WITH inline:</div>
          <div style={{ fontFamily: "monospace", fontSize: "10px", color: colors.textSec }}>result = 5 * 5;</div>
          <div style={{ fontSize: "10px", color: colors.success }}>→ Code pasted directly 🚀</div>
        </motion.div>
      </div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 1 ? 1 : 0 }} style={{ marginTop: "1rem", padding: "8px 16px", borderRadius: "100px", background: `${colors.accent}15`, textAlign: "center" }}>
        <span style={{ color: colors.accent, fontSize: "11px" }}>🖐️ inline is a REQUEST to compiler, not an ORDER!</span>
      </motion.div>
    </div>
  );
};

// ============================================
// SCENE 16: Compiler Decision
// ============================================
const Scene16 = () => {
  const [phase, setPhase] = useState(0);
  useEffect(() => { const t = [setTimeout(() => setPhase(1), 600)]; return () => t.forEach(clearTimeout); }, []);
  return (
    <div style={containerStyle}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: colors.accent, fontWeight: 700, fontSize: "13px", letterSpacing: "1.5px", marginBottom: "1rem" }}>🧑‍⚖️ COMPILER DECISION</motion.div>
      <div style={{ display: "flex", gap: "2rem" }}>
        <div style={{ flex: 1 }}>
          <div style={{ color: colors.success, fontWeight: 600, fontSize: "11px", marginBottom: "0.5rem" }}>✅ ACCEPTS inline:</div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
            {["Small functions (1-2 lines)", "No loops", "No recursion", "No static variables"].map((t, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} style={{ padding: "6px 12px", borderRadius: "6px", background: `${colors.success}10`, fontSize: "10px", color: colors.success }}>✓ {t}</motion.div>
            ))}
          </div>
        </div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 1 ? 1 : 0 }} style={{ flex: 1 }}>
          <div style={{ color: colors.danger, fontWeight: 600, fontSize: "11px", marginBottom: "0.5rem" }}>❌ REJECTS inline:</div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
            {["Large functions", "Has loops", "Recursive", "Static variables"].map((t, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} style={{ padding: "6px 12px", borderRadius: "6px", background: `${colors.danger}10`, fontSize: "10px", color: colors.danger }}>✗ {t}</motion.div>
            ))}
          </div>
        </motion.div>
      </div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 1 ? 1 : 0 }} style={{ marginTop: "1rem", textAlign: "center", fontSize: "12px" }}>
        <span style={{ fontSize: "1.5rem" }}>🦉</span> <span style={{ color: colors.textSec }}>Compiler knows best!</span>
      </motion.div>
    </div>
  );
};

// ============================================
// SCENE 17: Trade-off - Code Bloat
// ============================================
const Scene17 = () => {
  const [phase, setPhase] = useState(0);
  useEffect(() => { const t = [setTimeout(() => setPhase(1), 800)]; return () => t.forEach(clearTimeout); }, []);
  return (
    <div style={containerStyle}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: colors.danger, fontWeight: 700, fontSize: "13px", letterSpacing: "1.5px", marginBottom: "1.5rem" }}>🎈 TRADE-OFF: CODE BLOAT</motion.div>
      <div style={{ marginBottom: "1rem", color: colors.textSec, fontSize: "11px", textAlign: "center" }}>10-line function called 100 times:</div>
      <div style={{ display: "flex", gap: "2.5rem", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ color: colors.success, fontWeight: 600, fontSize: "11px", marginBottom: "0.5rem" }}>WITHOUT inline:</div>
          <div style={{ width: "60px", height: "60px", borderRadius: "12px", background: `${colors.success}20`, border: `2px solid ${colors.success}`, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontWeight: 700, color: colors.success }}>10</span>
          </div>
          <div style={{ fontSize: "10px", color: colors.textSec, marginTop: "0.3rem" }}>lines</div>
        </div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 1 ? 1 : 0 }} style={{ textAlign: "center" }}>
          <div style={{ color: colors.danger, fontWeight: 600, fontSize: "11px", marginBottom: "0.5rem" }}>WITH inline:</div>
          <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 1, repeat: Infinity }} style={{ width: "100px", height: "100px", borderRadius: "12px", background: `${colors.danger}20`, border: `2px solid ${colors.danger}`, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontWeight: 700, color: colors.danger, fontSize: "1.2rem" }}>1000</span>
          </motion.div>
          <div style={{ fontSize: "10px", color: colors.danger, marginTop: "0.3rem" }}>lines! 😱</div>
        </motion.div>
      </div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 1 ? 1 : 0 }} style={{ marginTop: "1rem", padding: "10px 20px", borderRadius: "12px", background: `${colors.danger}15`, textAlign: "center" }}>
        <span style={{ color: colors.danger, fontWeight: 600 }}>🎈 CODE BLOAT</span>
        <span style={{ color: colors.textSec, fontSize: "11px" }}> - Executable size explodes!</span>
      </motion.div>
    </div>
  );
};

// ============================================
// SCENE 18: Cache Miss Problem
// ============================================
const Scene18 = () => {
  const [phase, setPhase] = useState(0);
  useEffect(() => { const t = [setTimeout(() => setPhase(1), 800)]; return () => t.forEach(clearTimeout); }, []);
  return (
    <div style={containerStyle}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: colors.warning, fontWeight: 700, fontSize: "13px", letterSpacing: "1.5px", marginBottom: "1.5rem" }}>💾 CACHE MISS PROBLEM</motion.div>
      <div style={{ display: "flex", gap: "2.5rem", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ padding: "16px", borderRadius: "12px", background: `${colors.success}15`, border: `2px solid ${colors.success}`, marginBottom: "0.5rem" }}>
            <div style={{ fontSize: "1.3rem" }}>⚡</div>
            <div style={{ fontFamily: "monospace", fontSize: "10px", color: colors.success }}>Cache</div>
            <div style={{ fontSize: "9px", color: colors.textSec }}>Fast Memory</div>
          </div>
          <div style={{ fontSize: "10px", color: colors.success }}>Small program fits ✓</div>
        </div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 1 ? 1 : 0 }} style={{ textAlign: "center" }}>
          <div style={{ padding: "16px", borderRadius: "12px", background: `${colors.danger}15`, border: `2px solid ${colors.danger}`, marginBottom: "0.5rem" }}>
            <div style={{ fontSize: "1.3rem" }}>🐢</div>
            <div style={{ fontFamily: "monospace", fontSize: "10px", color: colors.danger }}>RAM</div>
            <div style={{ fontSize: "9px", color: colors.textSec }}>Slower Memory</div>
          </div>
          <div style={{ fontSize: "10px", color: colors.danger }}>Bloated code → Misses!</div>
        </motion.div>
      </div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 1 ? 1 : 0 }} style={{ marginTop: "1rem", padding: "10px 20px", borderRadius: "100px", background: `${colors.warning}15`, textAlign: "center" }}>
        <span style={{ color: colors.warning, fontSize: "11px" }}>Bigger executable = More cache misses = SLOWER!</span>
      </motion.div>
    </div>
  );
};

// ============================================
// SCENE 19: Personal Story
// ============================================
const Scene19 = () => {
  const [phase, setPhase] = useState(0);
  useEffect(() => { const t = [setTimeout(() => setPhase(1), 600), setTimeout(() => setPhase(2), 1200)]; return () => t.forEach(clearTimeout); }, []);
  return (
    <div style={containerStyle}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: colors.accent, fontWeight: 700, fontSize: "13px", letterSpacing: "1.5px", marginBottom: "1.5rem" }}>📖 REAL EXPERIENCE</motion.div>
      <div style={{ display: "flex", gap: "1.5rem" }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ padding: "16px", borderRadius: "12px", background: `${colors.primary}15`, border: `1px solid ${colors.primary}`, textAlign: "center" }}>
          <div style={{ fontSize: "1.5rem", marginBottom: "0.3rem" }}>🚀</div>
          <div style={{ color: colors.primary, fontWeight: 600, fontSize: "11px" }}>Expectation</div>
          <div style={{ fontSize: "10px", color: colors.textSec }}>"inline = FAST!"</div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: phase >= 1 ? 1 : 0, y: 0 }} style={{ padding: "16px", borderRadius: "12px", background: `${colors.danger}15`, border: `1px solid ${colors.danger}`, textAlign: "center" }}>
          <div style={{ fontSize: "1.5rem", marginBottom: "0.3rem" }}>😵</div>
          <div style={{ color: colors.danger, fontWeight: 600, fontSize: "11px" }}>Reality</div>
          <div style={{ fontSize: "10px", color: colors.textSec }}>File size ↑, Slower!</div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: phase >= 2 ? 1 : 0, y: 0 }} style={{ padding: "16px", borderRadius: "12px", background: `${colors.success}15`, border: `1px solid ${colors.success}`, textAlign: "center" }}>
          <div style={{ fontSize: "1.5rem", marginBottom: "0.3rem" }}>⚖️</div>
          <div style={{ color: colors.success, fontWeight: 600, fontSize: "11px" }}>Lesson</div>
          <div style={{ fontSize: "10px", color: colors.textSec }}>Understand trade-off!</div>
        </motion.div>
      </div>
    </div>
  );
};

// ============================================
// SCENE 20: When to Use Inline
// ============================================
const Scene20 = () => {
  const code = `inline int getX() { return x; }
inline void setX(int v) { x = v; }
inline int square(int n) { return n*n; }`;
  return (
    <div style={containerStyle}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: colors.success, fontWeight: 700, fontSize: "13px", letterSpacing: "1.5px", marginBottom: "1rem" }}>✅ WHEN TO USE INLINE</motion.div>
      <div style={{ display: "flex", gap: "2rem", alignItems: "flex-start" }}>
        <div>
          <div style={{ color: colors.success, fontSize: "11px", fontWeight: 600, marginBottom: "0.3rem" }}>Best Case: Small Functions (1-2 lines)</div>
          <GlassCard glow={colors.success} style={{ maxWidth: "350px" }}><CodeBlock code={code} fontSize="9px" /></GlassCard>
        </div>
        <div>
          <div style={{ color: colors.danger, fontSize: "11px", fontWeight: 600, marginBottom: "0.3rem" }}>❌ Avoid:</div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
            {["Large functions", "Recursive functions", "Functions with loops"].map((t, i) => (
              <div key={i} style={{ padding: "6px 12px", borderRadius: "6px", background: `${colors.danger}10`, fontSize: "10px", color: colors.danger }}>✗ {t}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================
// SCENE 21: Summary of Three Features
// ============================================
const Scene21 = () => {
  const [phase, setPhase] = useState(0);
  useEffect(() => { const t = [setTimeout(() => setPhase(1), 400), setTimeout(() => setPhase(2), 800), setTimeout(() => setPhase(3), 1200)]; return () => t.forEach(clearTimeout); }, []);
  const features = [
    { icon: "🔀", title: "Function Overloading", benefit: "Readability", key: "One Name, Many Forms", color: colors.primary },
    { icon: "⚙️", title: "Default Arguments", benefit: "Flexibility", key: "Optional Parameters", color: colors.success },
    { icon: "⚡", title: "Inline Functions", benefit: "Performance", key: "Request, Not Command", color: colors.warning },
  ];
  return (
    <div style={containerStyle}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: colors.accent, fontWeight: 700, fontSize: "13px", letterSpacing: "1.5px", marginBottom: "1.5rem" }}>📊 SUMMARY: THREE FEATURES</motion.div>
      <div style={{ display: "flex", gap: "1rem" }}>
        {features.map((f, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 30 }} animate={{ opacity: phase > i ? 1 : 0, y: 0 }} style={{ flex: 1, padding: "16px", borderRadius: "16px", background: `${f.color}15`, border: `2px solid ${f.color}`, textAlign: "center" }}>
            <div style={{ fontSize: "2rem", marginBottom: "0.3rem" }}>{f.icon}</div>
            <div style={{ color: f.color, fontWeight: 700, fontSize: "11px" }}>{f.title}</div>
            <div style={{ color: colors.textSec, fontSize: "10px", marginTop: "0.3rem" }}>{f.benefit}</div>
            <div style={{ fontFamily: "monospace", fontSize: "9px", color: f.color, marginTop: "0.3rem" }}>{f.key}</div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// ============================================
// SCENE 22: C++ Philosophy
// ============================================
const Scene22 = () => {
  const [phase, setPhase] = useState(0);
  useEffect(() => { const t = [setTimeout(() => setPhase(1), 800)]; return () => t.forEach(clearTimeout); }, []);
  return (
    <div style={containerStyle}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: colors.virtualColor, fontWeight: 700, fontSize: "13px", letterSpacing: "1.5px", marginBottom: "1.5rem" }}>🎯 C++ PHILOSOPHY</motion.div>
      <div style={{ display: "flex", gap: "2.5rem", alignItems: "center", justifyContent: "center" }}>
        <div style={{ padding: "20px", borderRadius: "16px", background: `${colors.primary}15`, border: `2px solid ${colors.primary}`, textAlign: "center" }}>
          <div style={{ fontSize: "2rem", marginBottom: "0.3rem" }}>⚙️</div>
          <div style={{ color: colors.primary, fontWeight: 700, fontSize: "12px" }}>CONTROL</div>
          <div style={{ color: colors.textSec, fontSize: "10px" }}>You decide when & how</div>
        </div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 1 ? 1 : 0 }} style={{ padding: "20px", borderRadius: "16px", background: `${colors.success}15`, border: `2px solid ${colors.success}`, textAlign: "center" }}>
          <div style={{ fontSize: "2rem", marginBottom: "0.3rem" }}>🌊</div>
          <div style={{ color: colors.success, fontWeight: 700, fontSize: "12px" }}>FLEXIBILITY</div>
          <div style={{ color: colors.textSec, fontSize: "10px" }}>Multiple ways to solve</div>
        </motion.div>
      </div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 1 ? 1 : 0 }} style={{ marginTop: "1.5rem", padding: "10px 24px", borderRadius: "100px", background: `${colors.accent}15`, textAlign: "center" }}>
        <span style={{ color: colors.accent }}>"With Great Power Comes Great Responsibility"</span>
      </motion.div>
    </div>
  );
};

// ============================================
// SCENE 23: The Balance Question
// ============================================
const Scene23 = () => {
  const [phase, setPhase] = useState(0);
  useEffect(() => { const t = [setTimeout(() => setPhase(1), 800)]; return () => t.forEach(clearTimeout); }, []);
  return (
    <div style={containerStyle}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: colors.accent, fontWeight: 700, fontSize: "13px", letterSpacing: "1.5px", marginBottom: "1.5rem" }}>⚖️ THE ETERNAL QUESTION</motion.div>
      <div style={{ display: "flex", gap: "2.5rem", alignItems: "center", justifyContent: "center", marginBottom: "1.5rem" }}>
        <div style={{ padding: "16px 20px", borderRadius: "12px", background: `${colors.warning}15`, border: `2px solid ${colors.warning}`, textAlign: "center" }}>
          <div style={{ fontSize: "1.5rem" }}>🚀</div>
          <div style={{ color: colors.warning, fontWeight: 700, fontSize: "12px" }}>PERFORMANCE</div>
        </div>
        <div style={{ fontSize: "1.5rem" }}>⚖️</div>
        <div style={{ padding: "16px 20px", borderRadius: "12px", background: `${colors.primary}15`, border: `2px solid ${colors.primary}`, textAlign: "center" }}>
          <div style={{ fontSize: "1.5rem" }}>📖</div>
          <div style={{ color: colors.primary, fontWeight: 700, fontSize: "12px" }}>READABILITY</div>
        </div>
      </div>
      <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: phase >= 1 ? 1 : 0, scale: 1 }} style={{ padding: "14px 28px", borderRadius: "16px", background: `${colors.success}20`, border: `3px solid ${colors.success}`, textAlign: "center" }}>
        <span style={{ color: colors.success, fontWeight: 700, fontSize: "14px" }}>✓ "It depends on context!"</span>
      </motion.div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 1 ? 1 : 0 }} style={{ marginTop: "1rem", padding: "10px 20px", borderRadius: "100px", background: `${colors.accent}15`, textAlign: "center" }}>
        <span style={{ color: colors.accent, fontSize: "11px" }}>🔍 "Measure First, Optimize Later"</span>
      </motion.div>
    </div>
  );
};

// ============================================
// SCENE 24: Closing
// ============================================
const Scene24 = () => {
  const [phase, setPhase] = useState(0);
  useEffect(() => { const t = [setTimeout(() => setPhase(1), 600), setTimeout(() => setPhase(2), 1200)]; return () => t.forEach(clearTimeout); }, []);
  const takeaways = ["Function Overloading = Polymorphism", "Default Args = Flexibility", "Inline = Performance Request", "Balance Performance & Readability"];
  return (
    <div style={containerStyle}>
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }} style={{ marginBottom: "1.5rem", textAlign: "center" }}>
        <motion.div animate={{ rotate: [0, 360] }} transition={{ duration: 3, repeat: Infinity, ease: "linear" }} style={{ fontSize: "3.5rem", marginBottom: "0.5rem" }}>🎉</motion.div>
        <div style={{ color: colors.accent, fontWeight: 700, fontSize: "1.5rem" }}>Thank You!</div>
      </motion.div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 1 ? 1 : 0 }} style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", justifyContent: "center", marginBottom: "1rem" }}>
        {takeaways.map((t, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} style={{ padding: "8px 16px", borderRadius: "100px", background: `${colors.success}15`, fontSize: "10px", color: colors.success }}>✓ {t}</motion.div>
        ))}
      </motion.div>
      <AnimatePresence>{phase >= 2 && <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ padding: "12px 28px", borderRadius: "100px", background: `linear-gradient(135deg, ${colors.accent}20, ${colors.primary}10)`, border: `1px solid ${colors.accent}40`, textAlign: "center" }}>
        <span style={{ color: colors.text }}>Keep Learning, </span><span style={{ color: colors.accent, fontWeight: 700 }}>Keep Coding! 💻</span>
      </motion.div>}</AnimatePresence>
    </div>
  );
};

// Export Part 2 scenes
export const VersatileScenesPart2 = [
  { title: "Performance Question", component: Scene13, contentText: "Overloading = Readability ✓, Default Args = Flexibility ✓, Performance = ? → INLINE FUNCTIONS!" },
  { title: "Function Call Overhead", component: Scene14, contentText: "Steps: Save location, jump to function, execute, jump back. For tiny functions: overhead > actual work!" },
  { title: "Inline Functions", component: Scene15, contentText: "inline int square(int x). WITHOUT: jump to function. WITH: code pasted directly. Request, not order!" },
  { title: "Compiler Decision", component: Scene16, contentText: "Accepts: small, no loops, no recursion. Rejects: large, loops, recursive. Compiler knows best!" },
  { title: "Code Bloat Trade-off", component: Scene17, contentText: "10-line function × 100 calls = 1000 lines! Executable size explodes with inline abuse." },
  { title: "Cache Miss Problem", component: Scene18, contentText: "Bigger executable = doesn't fit in cache = more cache misses = SLOWER execution!" },
  { title: "Real Experience", component: Scene19, contentText: "Expectation: inline=FAST. Reality: file size ↑, slower! Lesson: Understand the trade-off." },
  { title: "When to Use Inline", component: Scene20, contentText: "Best: getX(), setX(), square(). Avoid: large functions, recursive, loops." },
  { title: "Summary: Three Features", component: Scene21, contentText: "Overloading = Readability, Default Args = Flexibility, Inline = Performance (request)." },
  { title: "C++ Philosophy", component: Scene22, contentText: "CONTROL + FLEXIBILITY. With great power comes great responsibility. Use wisely!" },
  { title: "The Balance Question", component: Scene23, contentText: "Performance vs Readability? Answer: It depends on context! Measure first, optimize later." },
  { title: "Closing", component: Scene24, contentText: "Key takeaways: Overloading=Polymorphism, Default=Flexibility, Inline=Request. Keep coding! 💻" },
];
