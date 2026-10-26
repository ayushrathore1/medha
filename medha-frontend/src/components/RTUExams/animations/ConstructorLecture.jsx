/**
 * ConstructorLecture.jsx - All 17 Scenes
 * Constructor and Its Types - The Birth Protocol
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
  const keywords = ['int', 'void', 'class', 'struct', 'public', 'private', 'const', 'new', 'delete', 'return'];
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
// SCENE 1: The Dangerous Birth
// ============================================
const Scene1 = () => {
  const [phase, setPhase] = useState(0);
  useEffect(() => { const t = [setTimeout(() => setPhase(1), 800), setTimeout(() => setPhase(2), 1600)]; return () => t.forEach(clearTimeout); }, []);
  const code = `Student s1;`;
  return (
    <div style={{ ...containerStyle, background: "linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 50%, #0a0a0f 100%)" }}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: "center", marginBottom: "1.5rem" }}>
        <div style={{ color: colors.accent, fontWeight: 700, fontSize: "12px", letterSpacing: "3px", marginBottom: "0.5rem" }}>CHAPTER 1</div>
        <div style={{ fontSize: "1.5rem", fontWeight: 700, color: colors.danger }}>The Dangerous Birth</div>
      </motion.div>
      <div style={{ display: "flex", justifyContent: "center", marginBottom: "1.5rem" }}>
        <GlassCard glow={colors.danger}><CodeBlock code={code} fontSize="12px" /></GlassCard>
      </div>
      <AnimatePresence>
        {phase >= 1 && (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} style={{ display: "flex", justifyContent: "center", marginBottom: "1rem" }}>
            <div style={{ padding: "20px 32px", borderRadius: "16px", background: `${colors.danger}20`, border: `3px solid ${colors.danger}`, textAlign: "center" }}>
              <div style={{ fontSize: "1rem", marginBottom: "0.5rem" }}>📦 Object in Memory</div>
              <motion.div animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 0.5, repeat: Infinity }} style={{ fontFamily: "monospace", color: colors.danger, fontWeight: 700, fontSize: "1.2rem" }}>marks = ❓❓❓</motion.div>
              <div style={{ marginTop: "0.5rem", padding: "6px 12px", borderRadius: "8px", background: `${colors.danger}40`, color: "#fff", fontSize: "10px", fontWeight: 600 }}>⚠️ UNINITIALIZED MEMORY</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {phase >= 2 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: "center" }}>
          <div style={{ color: colors.text, fontSize: "12px" }}>"The object exists…"</div>
          <div style={{ color: colors.danger, fontSize: "12px", fontWeight: 600 }}>"But its soul is chaos."</div>
        </motion.div>
      )}
    </div>
  );
};

// ============================================
// SCENE 2: Garbage Is Not Innocent
// ============================================
const Scene2 = () => {
  const [val, setVal] = useState(0);
  const garbage = [124812, -99999, 0, 42, 777777, -12345];
  useEffect(() => { const t = setInterval(() => setVal(v => (v + 1) % garbage.length), 600); return () => clearInterval(t); }, []);
  return (
    <div style={containerStyle}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: "center", marginBottom: "1.5rem" }}>
        <div style={{ color: colors.accent, fontWeight: 700, fontSize: "12px", letterSpacing: "3px", marginBottom: "0.5rem" }}>CHAPTER 2</div>
        <div style={{ fontSize: "1.5rem", fontWeight: 700, color: colors.warning }}>Garbage Is Not Innocent</div>
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ display: "flex", justifyContent: "center", marginBottom: "1.5rem" }}>
        <div style={{ padding: "24px 40px", borderRadius: "16px", background: `${colors.warning}15`, border: `3px solid ${colors.warning}`, textAlign: "center" }}>
          <div style={{ color: colors.textSec, fontSize: "11px", marginBottom: "0.5rem" }}>marks value:</div>
          <motion.div key={val} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} style={{ fontFamily: "monospace", color: colors.warning, fontWeight: 700, fontSize: "2rem" }}>{garbage[val]}</motion.div>
        </div>
      </motion.div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} style={{ textAlign: "center" }}>
        <div style={{ color: colors.danger, fontSize: "13px", fontWeight: 600 }}>"This is how bugs are born."</div>
        <div style={{ color: colors.success, fontSize: "12px", marginTop: "0.5rem" }}>"We need controlled creation."</div>
      </motion.div>
    </div>
  );
};

// ============================================
// SCENE 3: Enter The Constructor
// ============================================
const Scene3 = () => {
  const [phase, setPhase] = useState(0);
  useEffect(() => { const t = setTimeout(() => setPhase(1), 800); return () => clearTimeout(t); }, []);
  return (
    <div style={containerStyle}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: "center", marginBottom: "1.5rem" }}>
        <div style={{ color: colors.accent, fontWeight: 700, fontSize: "12px", letterSpacing: "3px", marginBottom: "0.5rem" }}>CHAPTER 3</div>
        <div style={{ fontSize: "1.5rem", fontWeight: 700, color: colors.virtualColor }}>Enter: The Constructor</div>
      </motion.div>
      <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} style={{ display: "flex", justifyContent: "center", marginBottom: "1.5rem" }}>
        <div style={{ padding: "32px 48px", borderRadius: "24px", background: `linear-gradient(135deg, ${colors.virtualColor}20 0%, ${colors.primary}20 100%)`, border: `3px solid ${colors.virtualColor}`, textAlign: "center", boxShadow: `0 0 40px ${colors.virtualColor}30` }}>
          <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>⚙️</div>
          <div style={{ fontFamily: "monospace", color: colors.virtualColor, fontWeight: 700, fontSize: "1.2rem" }}>CONSTRUCTOR ENGINE</div>
        </div>
      </motion.div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 1 ? 1 : 0 }} style={{ textAlign: "center" }}>
        <div style={{ color: colors.accent, fontSize: "14px", fontWeight: 600 }}>"A constructor is a birth protocol."</div>
      </motion.div>
    </div>
  );
};

// ============================================
// SCENE 4: Default Constructor - Factory Reset
// ============================================
const Scene4 = () => {
  const [phase, setPhase] = useState(0);
  useEffect(() => { const t = [setTimeout(() => setPhase(1), 800), setTimeout(() => setPhase(2), 1600)]; return () => t.forEach(clearTimeout); }, []);
  const code = `Student() {
    marks = 0;
}`;
  return (
    <div style={containerStyle}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: "center", marginBottom: "1.5rem" }}>
        <div style={{ color: colors.accent, fontWeight: 700, fontSize: "12px", letterSpacing: "3px", marginBottom: "0.5rem" }}>CHAPTER 4</div>
        <div style={{ fontSize: "1.5rem", fontWeight: 700, color: colors.success }}>Default Constructor: Factory Reset</div>
      </motion.div>
      <div style={{ display: "flex", gap: "2rem", alignItems: "center", justifyContent: "center", marginBottom: "1.5rem" }}>
        <GlassCard glow={colors.success}><CodeBlock code={code} fontSize="11px" /></GlassCard>
        {phase >= 1 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <div style={{ padding: "12px 20px", borderRadius: "12px", background: `${colors.warning}20`, border: `2px solid ${colors.warning}` }}>
              <div style={{ fontFamily: "monospace", color: colors.warning, fontSize: "1.1rem" }}>❓</div>
            </div>
            <motion.div animate={{ x: [0, 10, 0] }} transition={{ duration: 0.8, repeat: Infinity }} style={{ color: colors.success, fontSize: "1.5rem" }}>→</motion.div>
            <div style={{ padding: "12px 20px", borderRadius: "12px", background: `${colors.success}20`, border: `2px solid ${colors.success}` }}>
              <div style={{ fontFamily: "monospace", color: colors.success, fontSize: "1.1rem", fontWeight: 700 }}>0</div>
            </div>
          </motion.div>
        )}
      </div>
      {phase >= 2 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: "center" }}>
          <div style={{ padding: "8px 16px", borderRadius: "8px", background: `${colors.virtualColor}20`, display: "inline-block", marginBottom: "0.5rem" }}>
            <span style={{ color: colors.virtualColor, fontWeight: 600, fontSize: "11px" }}>DEFAULT CONSTRUCTOR CALLED</span>
          </div>
          <div style={{ color: colors.text, fontSize: "12px" }}>"Every object is born in a valid state."</div>
        </motion.div>
      )}
    </div>
  );
};

// ============================================
// SCENE 5: Constructor Rules
// ============================================
const Scene5 = () => {
  const [phase, setPhase] = useState(0);
  useEffect(() => { const t = setTimeout(() => setPhase(1), 800); return () => clearTimeout(t); }, []);
  return (
    <div style={containerStyle}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: "center", marginBottom: "1.5rem" }}>
        <div style={{ color: colors.accent, fontWeight: 700, fontSize: "12px", letterSpacing: "3px", marginBottom: "0.5rem" }}>CHAPTER 5</div>
        <div style={{ fontSize: "1.5rem", fontWeight: 700, color: colors.primary }}>Constructor Rules</div>
      </motion.div>
      <div style={{ display: "flex", gap: "1.5rem", justifyContent: "center", marginBottom: "1.5rem" }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ padding: "20px 28px", borderRadius: "16px", background: `${colors.danger}15`, border: `2px solid ${colors.danger}`, textAlign: "center" }}>
          <div style={{ fontSize: "1.5rem", marginBottom: "0.3rem" }}>❌</div>
          <div style={{ color: colors.danger, fontWeight: 700, fontSize: "12px" }}>No return type</div>
          <div style={{ fontFamily: "monospace", color: colors.textSec, fontSize: "10px", marginTop: "0.3rem", textDecoration: "line-through" }}>void Student()</div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: phase >= 1 ? 1 : 0, y: 0 }} transition={{ delay: 0.3 }} style={{ padding: "20px 28px", borderRadius: "16px", background: `${colors.success}15`, border: `2px solid ${colors.success}`, textAlign: "center" }}>
          <div style={{ fontSize: "1.5rem", marginBottom: "0.3rem" }}>✅</div>
          <div style={{ color: colors.success, fontWeight: 700, fontSize: "12px" }}>Name = Class name</div>
          <div style={{ fontFamily: "monospace", color: colors.success, fontSize: "10px", marginTop: "0.3rem" }}>Student()</div>
        </motion.div>
      </div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 1 ? 1 : 0 }} style={{ textAlign: "center" }}>
        <div style={{ color: colors.text, fontSize: "12px" }}>"This is not a normal function."</div>
        <div style={{ color: colors.accent, fontSize: "12px", fontWeight: 600, marginTop: "0.3rem" }}>"This is a creation ritual."</div>
      </motion.div>
    </div>
  );
};

// ============================================
// SCENE 6: Two Objects, Two Births
// ============================================
const Scene6 = () => {
  const [phase, setPhase] = useState(0);
  useEffect(() => { const t = setTimeout(() => setPhase(1), 800); return () => clearTimeout(t); }, []);
  const code = `Counter c1;
Counter c2;`;
  return (
    <div style={containerStyle}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: "center", marginBottom: "1.5rem" }}>
        <div style={{ color: colors.accent, fontWeight: 700, fontSize: "12px", letterSpacing: "3px", marginBottom: "0.5rem" }}>CHAPTER 6</div>
        <div style={{ fontSize: "1.5rem", fontWeight: 700, color: colors.virtualColor }}>Two Objects, Two Births</div>
      </motion.div>
      <div style={{ display: "flex", gap: "2rem", alignItems: "flex-start", justifyContent: "center", marginBottom: "1.5rem" }}>
        <GlassCard><CodeBlock code={code} fontSize="11px" /></GlassCard>
        {phase >= 1 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: "flex", gap: "1rem" }}>
            {["c1", "c2"].map((name, i) => (
              <motion.div key={name} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: i * 0.2 }} style={{ padding: "16px", borderRadius: "12px", background: `${colors.primary}20`, border: `2px solid ${colors.primary}`, textAlign: "center" }}>
                <div style={{ color: colors.primary, fontWeight: 700 }}>{name}</div>
                <div style={{ fontFamily: "monospace", fontSize: "10px", color: colors.success, marginTop: "0.3rem" }}>count = 0</div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 1 ? 1 : 0 }} style={{ textAlign: "center" }}>
        <div style={{ color: colors.text, fontSize: "12px" }}>"Every object is born independently."</div>
      </motion.div>
    </div>
  );
};

// ============================================
// SCENE 7: The Compiler's Trap
// ============================================
const Scene7 = () => {
  const [phase, setPhase] = useState(0);
  useEffect(() => { const t = [setTimeout(() => setPhase(1), 800), setTimeout(() => setPhase(2), 1600)]; return () => t.forEach(clearTimeout); }, []);
  return (
    <div style={containerStyle}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: "center", marginBottom: "1.5rem" }}>
        <div style={{ color: colors.accent, fontWeight: 700, fontSize: "12px", letterSpacing: "3px", marginBottom: "0.5rem" }}>CHAPTER 7</div>
        <div style={{ fontSize: "1.5rem", fontWeight: 700, color: colors.warning }}>The Compiler's Trap</div>
      </motion.div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: "center", marginBottom: "1.5rem" }}>
        <div style={{ color: colors.text, fontSize: "13px" }}>"What if you don't write any constructor?"</div>
      </motion.div>
      {phase >= 1 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ display: "flex", justifyContent: "center", marginBottom: "1.5rem" }}>
          <div style={{ padding: "20px 32px", borderRadius: "16px", background: `${colors.textSec}15`, border: `2px dashed ${colors.textSec}`, textAlign: "center" }}>
            <div style={{ fontSize: "1.2rem", marginBottom: "0.3rem" }}>👻</div>
            <div style={{ color: colors.textSec, fontWeight: 600, fontSize: "11px" }}>Compiler creates ghost constructor</div>
            <div style={{ fontFamily: "monospace", color: colors.warning, fontSize: "10px", marginTop: "0.5rem" }}>marks = ❓❓❓</div>
          </div>
        </motion.div>
      )}
      {phase >= 2 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: "center" }}>
          <div style={{ color: colors.text, fontSize: "11px" }}>"The compiler creates the body…"</div>
          <div style={{ color: colors.danger, fontSize: "11px", fontWeight: 600 }}>"But not the soul."</div>
        </motion.div>
      )}
    </div>
  );
};

// ============================================
// SCENE 8: Parameterized Constructor - Custom DNA
// ============================================
const Scene8 = () => {
  const [phase, setPhase] = useState(0);
  useEffect(() => { const t = setTimeout(() => setPhase(1), 800); return () => clearTimeout(t); }, []);
  const code1 = `Student(int m) {
    marks = m;
}`;
  const code2 = `Student s1(85);`;
  return (
    <div style={containerStyle}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: "center", marginBottom: "1.5rem" }}>
        <div style={{ color: colors.accent, fontWeight: 700, fontSize: "12px", letterSpacing: "3px", marginBottom: "0.5rem" }}>CHAPTER 8</div>
        <div style={{ fontSize: "1.5rem", fontWeight: 700, color: colors.primary }}>Parameterized Constructor: Custom DNA</div>
      </motion.div>
      <div style={{ display: "flex", gap: "1.5rem", justifyContent: "center", marginBottom: "1.5rem", flexWrap: "wrap" }}>
        <GlassCard glow={colors.primary}><CodeBlock code={code1} fontSize="10px" /></GlassCard>
        <GlassCard glow={colors.success}><CodeBlock code={code2} fontSize="10px" /></GlassCard>
      </div>
      {phase >= 1 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
          <div style={{ padding: "10px 20px", borderRadius: "100px", background: `${colors.primary}20`, color: colors.primary, fontWeight: 700 }}>85</div>
          <motion.div animate={{ x: [0, 10, 0] }} transition={{ duration: 0.8, repeat: Infinity }}>→</motion.div>
          <div style={{ padding: "16px", borderRadius: "12px", background: `${colors.success}20`, border: `2px solid ${colors.success}`, textAlign: "center" }}>
            <div style={{ color: colors.success, fontWeight: 700 }}>s1</div>
            <div style={{ fontFamily: "monospace", fontSize: "11px", marginTop: "0.3rem" }}>marks = 85</div>
          </div>
        </motion.div>
      )}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 1 ? 1 : 0 }} style={{ textAlign: "center" }}>
        <div style={{ color: colors.accent, fontSize: "12px" }}>"Now you design the birth."</div>
      </motion.div>
    </div>
  );
};

// ============================================
// SCENE 9: Constructor Overloading
// ============================================
const Scene9 = () => {
  const [active, setActive] = useState(0);
  useEffect(() => { const t = setInterval(() => setActive(a => (a + 1) % 3), 1500); return () => clearInterval(t); }, []);
  const gates = ["Student()", "Student(int)", "Student(int, int)"];
  return (
    <div style={containerStyle}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: "center", marginBottom: "1.5rem" }}>
        <div style={{ color: colors.accent, fontWeight: 700, fontSize: "12px", letterSpacing: "3px", marginBottom: "0.5rem" }}>CHAPTER 9</div>
        <div style={{ fontSize: "1.5rem", fontWeight: 700, color: colors.virtualColor }}>Constructor Overloading</div>
      </motion.div>
      <div style={{ display: "flex", gap: "1rem", justifyContent: "center", marginBottom: "1.5rem" }}>
        {gates.map((gate, i) => (
          <motion.div key={gate} animate={{ scale: active === i ? 1.1 : 1, boxShadow: active === i ? `0 0 30px ${colors.success}50` : "none" }} style={{ padding: "16px 24px", borderRadius: "16px", background: active === i ? `${colors.success}20` : `${colors.text}10`, border: `2px solid ${active === i ? colors.success : colors.textSec}`, textAlign: "center", transition: "all 0.3s" }}>
            <div style={{ fontSize: "1.2rem", marginBottom: "0.3rem" }}>{active === i ? "🟢" : "⚪"}</div>
            <div style={{ fontFamily: "monospace", color: active === i ? colors.success : colors.textSec, fontSize: "10px" }}>{gate}</div>
          </motion.div>
        ))}
      </div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} style={{ textAlign: "center" }}>
        <div style={{ color: colors.text, fontSize: "12px" }}>"Same class. Different birth protocols."</div>
      </motion.div>
    </div>
  );
};

// ============================================
// SCENE 10: The Classic Beginner Trap
// ============================================
const Scene10 = () => {
  const [phase, setPhase] = useState(0);
  useEffect(() => { const t = setTimeout(() => setPhase(1), 1000); return () => clearTimeout(t); }, []);
  const code = `class Student {
public:
    Student(int m) { marks = m; }
};

Student s;  // ❌ ERROR!`;
  return (
    <div style={containerStyle}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: "center", marginBottom: "1.5rem" }}>
        <div style={{ color: colors.accent, fontWeight: 700, fontSize: "12px", letterSpacing: "3px", marginBottom: "0.5rem" }}>CHAPTER 10</div>
        <div style={{ fontSize: "1.5rem", fontWeight: 700, color: colors.danger }}>The Classic Beginner Trap</div>
      </motion.div>
      <div style={{ display: "flex", justifyContent: "center", marginBottom: "1.5rem" }}>
        <GlassCard glow={colors.danger}><CodeBlock code={code} fontSize="10px" /></GlassCard>
      </div>
      {phase >= 1 && (
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <motion.div animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 0.5, repeat: Infinity }} style={{ padding: "10px 20px", borderRadius: "12px", background: `${colors.danger}30`, border: `2px solid ${colors.danger}`, marginBottom: "1rem" }}>
            <span style={{ color: colors.danger, fontWeight: 700, fontSize: "12px" }}>🚨 No default constructor found</span>
          </motion.div>
          <div style={{ color: colors.text, fontSize: "11px" }}>"When you take control…"</div>
          <div style={{ color: colors.warning, fontSize: "11px", fontWeight: 600 }}>"You also take responsibility."</div>
        </motion.div>
      )}
    </div>
  );
};

// ============================================
// SCENE 11: The Clone - Copy Constructor
// ============================================
const Scene11 = () => {
  const [phase, setPhase] = useState(0);
  useEffect(() => { const t = setTimeout(() => setPhase(1), 800); return () => clearTimeout(t); }, []);
  const code = `Student s1(90);
Student s2 = s1;`;
  return (
    <div style={containerStyle}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: "center", marginBottom: "1.5rem" }}>
        <div style={{ color: colors.accent, fontWeight: 700, fontSize: "12px", letterSpacing: "3px", marginBottom: "0.5rem" }}>CHAPTER 11</div>
        <div style={{ fontSize: "1.5rem", fontWeight: 700, color: colors.virtualColor }}>The Clone: Copy Constructor</div>
      </motion.div>
      <div style={{ display: "flex", gap: "2rem", alignItems: "center", justifyContent: "center", marginBottom: "1.5rem" }}>
        <GlassCard glow={colors.virtualColor}><CodeBlock code={code} fontSize="11px" /></GlassCard>
        {phase >= 1 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <div style={{ padding: "16px", borderRadius: "12px", background: `${colors.primary}20`, border: `2px solid ${colors.primary}`, textAlign: "center" }}>
              <div style={{ color: colors.primary, fontWeight: 700 }}>s1</div>
              <div style={{ fontSize: "10px", color: colors.textSec }}>marks = 90</div>
            </div>
            <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1, repeat: Infinity }} style={{ fontSize: "1.5rem" }}>🔄</motion.div>
            <div style={{ padding: "16px", borderRadius: "12px", background: `${colors.success}20`, border: `2px solid ${colors.success}`, textAlign: "center" }}>
              <div style={{ color: colors.success, fontWeight: 700 }}>s2</div>
              <div style={{ fontSize: "10px", color: colors.textSec }}>marks = 90</div>
            </div>
          </motion.div>
        )}
      </div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 1 ? 1 : 0 }} style={{ textAlign: "center" }}>
        <div style={{ padding: "6px 14px", borderRadius: "8px", background: `${colors.virtualColor}20`, display: "inline-block", marginBottom: "0.5rem" }}>
          <span style={{ color: colors.virtualColor, fontWeight: 600, fontSize: "10px" }}>COPY CONSTRUCTOR CALLED</span>
        </div>
        <div style={{ color: colors.text, fontSize: "11px" }}>"This is not assignment."</div>
        <div style={{ color: colors.accent, fontSize: "11px" }}>"This is birth by cloning."</div>
      </motion.div>
    </div>
  );
};

// ============================================
// SCENE 12: How C++ Recognizes It
// ============================================
const Scene12 = () => {
  const [phase, setPhase] = useState(0);
  useEffect(() => { const t = setTimeout(() => setPhase(1), 800); return () => clearTimeout(t); }, []);
  const code = `Student(const Student& s)`;
  return (
    <div style={containerStyle}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: "center", marginBottom: "1.5rem" }}>
        <div style={{ color: colors.accent, fontWeight: 700, fontSize: "12px", letterSpacing: "3px", marginBottom: "0.5rem" }}>CHAPTER 12</div>
        <div style={{ fontSize: "1.5rem", fontWeight: 700, color: colors.primary }}>How C++ Recognizes It</div>
      </motion.div>
      <div style={{ display: "flex", justifyContent: "center", marginBottom: "1.5rem" }}>
        <GlassCard glow={colors.primary}>
          <div style={{ fontFamily: "'Fira Code', monospace", fontSize: "13px" }}>
            <span style={{ color: colors.text }}>Student(</span>
            <span style={{ color: "#569CD6" }}>const</span>
            <span style={{ color: colors.text }}> Student</span>
            <motion.span animate={{ color: phase >= 1 ? [colors.success, "#fff", colors.success] : colors.text }} transition={{ duration: 1, repeat: Infinity }} style={{ fontWeight: 700, fontSize: "1.2em" }}>&</motion.span>
            <span style={{ color: colors.text }}> s)</span>
          </div>
        </GlassCard>
      </div>
      {phase >= 1 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: "flex", justifyContent: "center", marginBottom: "1rem" }}>
          <div style={{ padding: "12px 24px", borderRadius: "12px", background: `${colors.success}15`, border: `2px solid ${colors.success}`, textAlign: "center" }}>
            <div style={{ color: colors.success, fontWeight: 700, fontSize: "1.2rem" }}>&</div>
            <div style={{ color: colors.textSec, fontSize: "10px", marginTop: "0.3rem" }}>Reference = Stability Lock</div>
          </div>
        </motion.div>
      )}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 1 ? 1 : 0 }} style={{ textAlign: "center" }}>
        <div style={{ color: colors.accent, fontSize: "11px" }}>"The & prevents infinite recursion."</div>
      </motion.div>
    </div>
  );
};

// ============================================
// SCENE 13: The Infinite Loop Disaster
// ============================================
const Scene13 = () => {
  const [phase, setPhase] = useState(0);
  useEffect(() => { const t = setTimeout(() => setPhase(1), 800); return () => clearTimeout(t); }, []);
  return (
    <div style={containerStyle}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: "center", marginBottom: "1.5rem" }}>
        <div style={{ color: colors.accent, fontWeight: 700, fontSize: "12px", letterSpacing: "3px", marginBottom: "0.5rem" }}>CHAPTER 13</div>
        <div style={{ fontSize: "1.5rem", fontWeight: 700, color: colors.danger }}>The Infinite Loop Disaster</div>
      </motion.div>
      <div style={{ display: "flex", justifyContent: "center", marginBottom: "1.5rem" }}>
        <div style={{ padding: "16px 24px", borderRadius: "12px", background: `${colors.danger}15`, border: `2px solid ${colors.danger}` }}>
          <div style={{ fontFamily: "'Fira Code', monospace", fontSize: "11px", color: colors.danger }}>
            Student(Student s)  <span style={{ color: colors.textSec }}>// Without &</span>
          </div>
        </div>
      </div>
      {phase >= 1 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <motion.div animate={{ rotate: [0, 360] }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }} style={{ fontSize: "2rem", marginBottom: "1rem" }}>🌀</motion.div>
          <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
            {["copy", "→", "copy", "→", "copy", "→", "∞"].map((t, i) => (
              <motion.span key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.15 }} style={{ color: t === "∞" ? colors.danger : colors.textSec, fontSize: "11px", fontWeight: t === "∞" ? 700 : 400 }}>{t}</motion.span>
            ))}
          </div>
          <div style={{ color: colors.danger, fontSize: "12px", fontWeight: 600 }}>"This is how programs die."</div>
        </motion.div>
      )}
    </div>
  );
};

// ============================================
// SCENE 14: Where Copy Constructor Is Called
// ============================================
const Scene14 = () => {
  const portals = [
    { icon: "📤", text: "Passing object by value to function" },
    { icon: "📥", text: "Returning object by value" },
    { icon: "📋", text: "Creating object from object" },
  ];
  return (
    <div style={containerStyle}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: "center", marginBottom: "1.5rem" }}>
        <div style={{ color: colors.accent, fontWeight: 700, fontSize: "12px", letterSpacing: "3px", marginBottom: "0.5rem" }}>CHAPTER 14</div>
        <div style={{ fontSize: "1.5rem", fontWeight: 700, color: colors.virtualColor }}>Where Copy Constructor Is Called</div>
      </motion.div>
      <div style={{ display: "flex", gap: "1rem", justifyContent: "center", marginBottom: "1.5rem", flexWrap: "wrap" }}>
        {portals.map((p, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.2 }} style={{ padding: "16px 20px", borderRadius: "16px", background: `${colors.virtualColor}15`, border: `2px solid ${colors.virtualColor}`, textAlign: "center", maxWidth: "160px" }}>
            <div style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>{p.icon}</div>
            <div style={{ color: colors.textSec, fontSize: "10px" }}>{p.text}</div>
          </motion.div>
        ))}
      </div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} style={{ textAlign: "center" }}>
        <div style={{ color: colors.accent, fontSize: "12px" }}>"Cloning happens more than you think."</div>
      </motion.div>
    </div>
  );
};

// ============================================
// SCENE 15: The Shallow Copy Horror
// ============================================
const Scene15 = () => {
  const [phase, setPhase] = useState(0);
  useEffect(() => { const t = [setTimeout(() => setPhase(1), 1000), setTimeout(() => setPhase(2), 2000)]; return () => t.forEach(clearTimeout); }, []);
  return (
    <div style={containerStyle}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: "center", marginBottom: "1.5rem" }}>
        <div style={{ color: colors.accent, fontWeight: 700, fontSize: "12px", letterSpacing: "3px", marginBottom: "0.5rem" }}>CHAPTER 15</div>
        <div style={{ fontSize: "1.5rem", fontWeight: 700, color: colors.danger }}>The Shallow Copy Horror</div>
      </motion.div>
      <div style={{ display: "flex", gap: "2rem", justifyContent: "center", marginBottom: "1.5rem" }}>
        <div style={{ padding: "16px", borderRadius: "12px", background: `${colors.primary}15`, border: `2px solid ${colors.primary}`, textAlign: "center" }}>
          <div style={{ color: colors.primary, fontWeight: 700 }}>s1</div>
          <div style={{ fontFamily: "monospace", fontSize: "9px", color: colors.textSec }}>name → 0xAAA</div>
        </div>
        <div style={{ padding: "16px", borderRadius: "12px", background: `${colors.warning}15`, border: `2px solid ${colors.warning}`, textAlign: "center" }}>
          <div style={{ color: colors.warning, fontWeight: 700 }}>s2</div>
          <div style={{ fontFamily: "monospace", fontSize: "9px", color: colors.textSec }}>name → 0xAAA</div>
        </div>
        <div style={{ padding: "16px", borderRadius: "12px", background: `${colors.text}10`, border: `2px dashed ${colors.text}`, textAlign: "center" }}>
          <div style={{ fontFamily: "monospace", fontSize: "10px", color: colors.success }}>0xAAA</div>
          <div style={{ fontSize: "9px", color: colors.textSec }}>Heap Memory</div>
        </div>
      </div>
      {phase >= 1 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: "flex", justifyContent: "center", gap: "1rem", marginBottom: "1rem" }}>
          <div style={{ padding: "10px 16px", borderRadius: "8px", background: `${colors.danger}20`, border: `2px solid ${colors.danger}` }}>
            <span style={{ color: colors.danger, fontSize: "11px" }}>💀 Dangling Pointer</span>
          </div>
          {phase >= 2 && (
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} style={{ padding: "10px 16px", borderRadius: "8px", background: `${colors.danger}30`, border: `2px solid ${colors.danger}` }}>
              <span style={{ color: colors.danger, fontSize: "11px", fontWeight: 700 }}>💥 Double delete crash</span>
            </motion.div>
          )}
        </motion.div>
      )}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 2 ? 1 : 0 }} style={{ textAlign: "center" }}>
        <div style={{ color: colors.danger, fontSize: "11px" }}>"Shallow copy duplicates pointers, not ownership."</div>
      </motion.div>
    </div>
  );
};

// ============================================
// SCENE 16: Deep Copy - True Cloning
// ============================================
const Scene16 = () => {
  const [phase, setPhase] = useState(0);
  useEffect(() => { const t = setTimeout(() => setPhase(1), 800); return () => clearTimeout(t); }, []);
  return (
    <div style={containerStyle}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: "center", marginBottom: "1.5rem" }}>
        <div style={{ color: colors.accent, fontWeight: 700, fontSize: "12px", letterSpacing: "3px", marginBottom: "0.5rem" }}>CHAPTER 16</div>
        <div style={{ fontSize: "1.5rem", fontWeight: 700, color: colors.success }}>Deep Copy: True Cloning</div>
      </motion.div>
      <div style={{ display: "flex", gap: "1.5rem", justifyContent: "center", marginBottom: "1.5rem" }}>
        <div style={{ padding: "16px", borderRadius: "12px", background: `${colors.primary}15`, border: `2px solid ${colors.primary}`, textAlign: "center" }}>
          <div style={{ color: colors.primary, fontWeight: 700 }}>s1</div>
          <div style={{ fontFamily: "monospace", fontSize: "9px", color: colors.textSec }}>name → 0xAAA</div>
        </div>
        <div style={{ padding: "16px", borderRadius: "12px", background: `${colors.text}10`, border: `2px solid ${colors.success}`, textAlign: "center" }}>
          <div style={{ fontFamily: "monospace", fontSize: "10px", color: colors.success }}>0xAAA</div>
          <div style={{ fontSize: "9px", color: colors.textSec }}>"John"</div>
        </div>
        {phase >= 1 && (
          <>
            <div style={{ padding: "16px", borderRadius: "12px", background: `${colors.success}15`, border: `2px solid ${colors.success}`, textAlign: "center" }}>
              <div style={{ color: colors.success, fontWeight: 700 }}>s2</div>
              <div style={{ fontFamily: "monospace", fontSize: "9px", color: colors.textSec }}>name → 0xBBB</div>
            </div>
            <div style={{ padding: "16px", borderRadius: "12px", background: `${colors.text}10`, border: `2px solid ${colors.virtualColor}`, textAlign: "center" }}>
              <div style={{ fontFamily: "monospace", fontSize: "10px", color: colors.virtualColor }}>0xBBB</div>
              <div style={{ fontSize: "9px", color: colors.textSec }}>"John"</div>
            </div>
          </>
        )}
      </div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 1 ? 1 : 0 }} style={{ textAlign: "center" }}>
        <div style={{ color: colors.text, fontSize: "12px" }}>"Same data."</div>
        <div style={{ color: colors.accent, fontSize: "12px", fontWeight: 600 }}>"Different souls."</div>
      </motion.div>
    </div>
  );
};

// ============================================
// SCENE 17: The Three Birth Types - Finale
// ============================================
const Scene17 = () => {
  const [phase, setPhase] = useState(0);
  useEffect(() => { const t = setTimeout(() => setPhase(1), 1000); return () => clearTimeout(t); }, []);
  const pillars = [
    { emoji: "🟦", name: "DEFAULT", desc: "Safe birth", color: colors.primary },
    { emoji: "🟩", name: "PARAMETERIZED", desc: "Custom birth", color: colors.success },
    { emoji: "🟨", name: "COPY", desc: "Cloned birth", color: colors.warning },
  ];
  return (
    <div style={{ ...containerStyle, background: "linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 50%, #0a0a0f 100%)" }}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: "center", marginBottom: "1.5rem" }}>
        <div style={{ color: colors.accent, fontWeight: 700, fontSize: "12px", letterSpacing: "3px", marginBottom: "0.5rem" }}>FINAL CHAPTER</div>
        <div style={{ fontSize: "1.5rem", fontWeight: 700, color: colors.text }}>The Three Birth Types</div>
      </motion.div>
      <div style={{ display: "flex", gap: "1.5rem", justifyContent: "center", marginBottom: "1.5rem" }}>
        {pillars.map((p, i) => (
          <motion.div key={p.name} initial={{ opacity: 0, y: 50, scale: 0.8 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ delay: i * 0.2 }} style={{ padding: "20px 24px", borderRadius: "20px", background: `${p.color}15`, border: `3px solid ${p.color}`, textAlign: "center", boxShadow: `0 0 30px ${p.color}30` }}>
            <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>{p.emoji}</div>
            <div style={{ color: p.color, fontWeight: 700, fontSize: "11px" }}>{p.name}</div>
            <div style={{ color: colors.textSec, fontSize: "10px", marginTop: "0.3rem" }}>{p.desc}</div>
          </motion.div>
        ))}
      </div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 1 ? 1 : 0 }} style={{ textAlign: "center" }}>
        <div style={{ color: colors.text, fontSize: "12px", marginBottom: "0.5rem" }}>"Objects are not variables."</div>
        <div style={{ color: colors.accent, fontSize: "13px", fontWeight: 600 }}>"They are living entities with lifecycles."</div>
      </motion.div>
    </div>
  );
};

// Export all scenes
export const ConstructorScenes = [
  { title: "The Dangerous Birth", component: Scene1, contentText: "Student s1; Object exists but marks = garbage. Uninitialized memory is chaos." },
  { title: "Garbage Is Not Innocent", component: Scene2, contentText: "Random values: 124812, -99999, 0, 42. This is how bugs are born. We need controlled creation." },
  { title: "Enter The Constructor", component: Scene3, contentText: "CONSTRUCTOR ENGINE appears. A constructor is a birth protocol." },
  { title: "Default Constructor", component: Scene4, contentText: "Student() { marks = 0; } Every object born in valid state. DEFAULT CONSTRUCTOR CALLED." },
  { title: "Constructor Rules", component: Scene5, contentText: "No return type. Name = class name. This is not a normal function - a creation ritual." },
  { title: "Two Objects Two Births", component: Scene6, contentText: "Counter c1; Counter c2; Constructor runs twice. Both get count = 0. Every object born independently." },
  { title: "Compiler's Trap", component: Scene7, contentText: "No constructor written? Compiler creates ghost constructor. Creates body, not soul. marks = garbage." },
  { title: "Parameterized Constructor", component: Scene8, contentText: "Student(int m) { marks = m; } Student s1(85); 85 flows in. Now you design the birth." },
  { title: "Constructor Overloading", component: Scene9, contentText: "Student(), Student(int), Student(int, int). Same class, different birth protocols." },
  { title: "Classic Beginner Trap", component: Scene10, contentText: "Only parameterized constructor? Student s; ERROR! When you take control, you take responsibility." },
  { title: "Copy Constructor", component: Scene11, contentText: "Student s2 = s1; Copy chamber activates. Not assignment - birth by cloning." },
  { title: "The Reference &", component: Scene12, contentText: "Student(const Student& s). The & glows. Reference prevents infinite recursion." },
  { title: "Infinite Loop Disaster", component: Scene13, contentText: "Student(Student s) without &. Copy triggers copy triggers copy → ∞. This is how programs die." },
  { title: "Copy Constructor Calls", component: Scene14, contentText: "Passing by value, returning by value, creating from object. Cloning happens more than you think." },
  { title: "Shallow Copy Horror", component: Scene15, contentText: "Both point to 0xAAA. s1 destroyed, memory deleted. s2.name = dangling pointer. Double delete crash." },
  { title: "Deep Copy", component: Scene16, contentText: "New memory allocated, content copied. s1 → 0xAAA, s2 → 0xBBB. Same data, different souls." },
  { title: "The Three Birth Types", component: Scene17, contentText: "DEFAULT - Safe. PARAMETERIZED - Custom. COPY - Cloned. Objects are living entities with lifecycles." },
];
