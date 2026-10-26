/**
 * VirtualFunctionsAnimation.jsx - Scenes 1-16
 * Virtual Functions & Operator Overloading Animation (Updated)
 */
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { colors, containerStyle } from "./VirtualFunctionsTheme";

// ============================================
// SHARED COMPONENTS
// ============================================
export const GlassCard = ({ children, style = {}, glow = null }) => (
  <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} style={{ background: "rgba(28, 28, 30, 0.65)", backdropFilter: "blur(25px)", border: `1px solid ${glow ? `${glow}40` : "rgba(255, 255, 255, 0.12)"}`, borderRadius: "24px", padding: "2rem", boxShadow: glow ? `0 8px 32px ${glow}30` : "0 8px 32px rgba(0, 0, 0, 0.4)", ...style }}>{children}</motion.div>
);

const SyntaxHighlight = ({ code }) => {
  const keywords = ['int', 'float', 'double', 'char', 'void', 'bool', 'class', 'struct', 'public', 'private', 'virtual', 'return', 'new', 'delete', 'this', 'using', 'namespace', 'std', 'operator', 'endl', 'cout', 'cin'];
  const cColors = { keyword: '#569CD6', string: '#CE9178', comment: '#6A9955', preprocessor: '#C586C0', number: '#B5CEA8', function: '#DCDCAA', default: '#D4D4D4' };
  const lines = code.split('\n');
  return lines.map((line, lIdx) => {
    const els = []; let i = 0;
    while (i < line.length) {
      if (line.slice(i, i + 2) === '//') { els.push(<span key={`${lIdx}-${i}`} style={{ color: cColors.comment }}>{line.slice(i)}</span>); break; }
      if (line[i] === '#') { const m = line.slice(i).match(/^#\w+/); if (m) { els.push(<span key={`${lIdx}-${i}`} style={{ color: cColors.preprocessor }}>{m[0]}</span>); i += m[0].length; continue; } }
      if (line[i] === '"') { let e = i + 1; while (e < line.length && line[e] !== '"') e++; els.push(<span key={`${lIdx}-${i}`} style={{ color: cColors.string }}>{line.slice(i, e + 1)}</span>); i = e + 1; continue; }
      if (/\d/.test(line[i])) { const m = line.slice(i).match(/^\d+\.?\d*/); if (m) { els.push(<span key={`${lIdx}-${i}`} style={{ color: cColors.number }}>{m[0]}</span>); i += m[0].length; continue; } }
      if (/[a-zA-Z_]/.test(line[i])) { const m = line.slice(i).match(/^[a-zA-Z_]\w*/); if (m) { const w = m[0]; els.push(<span key={`${lIdx}-${i}`} style={{ color: keywords.includes(w) ? cColors.keyword : line[i + w.length] === '(' ? cColors.function : cColors.default }}>{w}</span>); i += w.length; continue; } }
      els.push(<span key={`${lIdx}-${i}`} style={{ color: cColors.default }}>{line[i]}</span>); i++;
    }
    return <div key={lIdx} style={{ minHeight: '1.5em' }}>{els.length > 0 ? els : '\u00A0'}</div>;
  });
};

export const CodeBlock = ({ code, fontSize = "11px" }) => (
  <motion.pre initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ fontFamily: "'Fira Code', monospace", fontSize, lineHeight: 1.5, margin: 0, whiteSpace: "pre", overflowX: "auto", background: "rgba(30, 30, 30, 0.95)", padding: "12px 16px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.1)", maxHeight: "400px", overflowY: "auto" }}>
    <SyntaxHighlight code={code} />
  </motion.pre>
);

export const Terminal = ({ output }) => (
  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} style={{ background: "linear-gradient(180deg, #1a1a1a 0%, #0d0d0d 100%)", borderRadius: "10px", overflow: "hidden", border: "1px solid rgba(255,255,255,0.1)", marginTop: "12px" }}>
    <div style={{ background: "rgba(60, 60, 60, 0.8)", padding: "6px 12px", display: "flex", alignItems: "center", gap: "8px" }}><div style={{ display: "flex", gap: "6px" }}><div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#FF5F56" }} /><div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#FFBD2E" }} /><div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#27CA40" }} /></div><span style={{ fontSize: "10px", color: "#888", fontFamily: "monospace" }}>Output</span></div>
    <div style={{ padding: "12px 16px", fontFamily: "monospace", fontSize: "12px", color: "#4AF626", lineHeight: 1.6 }}><span style={{ color: "#888" }}>$ </span><span style={{ color: "#fff" }}>./a.out</span><div style={{ marginTop: "8px" }}>{output}</div></div>
  </motion.div>
);

// ============================================
// SCENE 1: Welcome & Hook
// ============================================
const Scene1 = () => {
  const [phase, setPhase] = useState(0);
  useEffect(() => { const t = [setTimeout(() => setPhase(1), 600), setTimeout(() => setPhase(2), 1500)]; return () => t.forEach(clearTimeout); }, []);
  return (
    <div style={containerStyle}>
      <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} style={{ textAlign: "center", marginBottom: "2.5rem" }}>
        <div style={{ color: colors.accent, fontWeight: 700, fontSize: "14px", letterSpacing: "2px", marginBottom: "1rem" }}>RTU OOP UNIT 4</div>
        <div style={{ fontSize: "2rem", fontWeight: 700, color: colors.text, lineHeight: 1.3 }}>Polymorphism in C++</div>
        <div style={{ color: colors.secondary, fontWeight: 600, fontSize: "1.2rem", marginTop: "0.5rem" }}>Two Faces of Power</div>
      </motion.div>
      <div style={{ display: "flex", gap: "3rem" }}>
        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: phase >= 1 ? 1 : 0, x: 0 }} style={{ padding: "24px 40px", borderRadius: "20px", background: `${colors.compileTime}20`, border: `3px solid ${colors.compileTime}`, textAlign: "center" }}>
          <div style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>⚡</div>
          <div style={{ color: colors.compileTime, fontWeight: 700 }}>Compile Time</div>
        </motion.div>
        <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: phase >= 2 ? 1 : 0, x: 0 }} style={{ padding: "24px 40px", borderRadius: "20px", background: `${colors.runTime}20`, border: `3px solid ${colors.runTime}`, textAlign: "center" }}>
          <div style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>🧠</div>
          <div style={{ color: colors.runTime, fontWeight: 700 }}>Run Time</div>
        </motion.div>
      </div>
    </div>
  );
};

// SCENE 2: Mission Statement
const Scene2 = () => {
  const [phase, setPhase] = useState(0);
  useEffect(() => { const t = [setTimeout(() => setPhase(1), 600), setTimeout(() => setPhase(2), 1200)]; return () => t.forEach(clearTimeout); }, []);
  return (
    <div style={containerStyle}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: colors.primary, fontWeight: 700, fontSize: "13px", letterSpacing: "1.5px", marginBottom: "2rem" }}>📚 MISSION STATEMENT</motion.div>
      <div style={{ display: "flex", gap: "3rem", alignItems: "center" }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: phase >= 1 ? 1 : 0, y: 0 }} style={{ padding: "20px 30px", borderRadius: "16px", background: `${colors.warning}15`, border: `2px solid ${colors.warning}`, textAlign: "center" }}>
          <div style={{ fontSize: "2.5rem" }}>📝</div>
          <div style={{ color: colors.warning, fontWeight: 600, marginTop: "0.5rem" }}>Exam Paper</div>
        </motion.div>
        <motion.div initial={{ scale: 0 }} animate={{ scale: phase >= 1 ? 1 : 0 }} style={{ fontSize: "2rem", color: colors.textSec }}>+</motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: phase >= 2 ? 1 : 0, y: 0 }} style={{ padding: "20px 30px", borderRadius: "16px", background: `${colors.success}15`, border: `2px solid ${colors.success}`, textAlign: "center" }}>
          <div style={{ fontSize: "2.5rem" }}>💻</div>
          <div style={{ color: colors.success, fontWeight: 600, marginTop: "0.5rem" }}>Real Project</div>
        </motion.div>
      </div>
      <AnimatePresence>{phase >= 2 && <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ marginTop: "2rem", padding: "16px 32px", borderRadius: "100px", background: `${colors.accent}15`, border: `1px solid ${colors.accent}40`, color: colors.text }}>Not just for exams. <span style={{ color: colors.accent, fontWeight: 700 }}>For real programming.</span></motion.div>}</AnimatePresence>
    </div>
  );
};

// SCENE 3: Two Tools Analogy
const Scene3 = () => {
  const [phase, setPhase] = useState(0);
  useEffect(() => { const t = [setTimeout(() => setPhase(1), 600), setTimeout(() => setPhase(2), 1200)]; return () => t.forEach(clearTimeout); }, []);
  return (
    <div style={containerStyle}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: colors.secondary, fontWeight: 700, fontSize: "13px", letterSpacing: "1.5px", marginBottom: "2rem" }}>🧰 TWO TOOLS IN YOUR TOOLBOX</motion.div>
      <div style={{ display: "flex", gap: "3rem" }}>
        <motion.div initial={{ opacity: 0, rotateY: -90 }} animate={{ opacity: phase >= 1 ? 1 : 0, rotateY: 0 }} style={{ padding: "24px 40px", borderRadius: "20px", background: `${colors.operatorColor}20`, border: `3px solid ${colors.operatorColor}`, textAlign: "center" }}>
          <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>✨</div>
          <div style={{ color: colors.operatorColor, fontWeight: 700 }}>Tool 1</div>
          <div style={{ color: colors.textSec, fontSize: "14px", marginTop: "0.5rem" }}>Makes code clean</div>
        </motion.div>
        <motion.div initial={{ opacity: 0, rotateY: 90 }} animate={{ opacity: phase >= 2 ? 1 : 0, rotateY: 0 }} style={{ padding: "24px 40px", borderRadius: "20px", background: `${colors.virtualColor}20`, border: `3px solid ${colors.virtualColor}`, textAlign: "center" }}>
          <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>🧠</div>
          <div style={{ color: colors.virtualColor, fontWeight: 700 }}>Tool 2</div>
          <div style={{ color: colors.textSec, fontSize: "14px", marginTop: "0.5rem" }}>Makes program smart</div>
        </motion.div>
      </div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 2 ? 1 : 0 }} style={{ marginTop: "2rem", color: colors.textSec }}>Same idea. Different time. <span style={{ color: colors.accent }}>Different power.</span></motion.div>
    </div>
  );
};

// SCENE 4: Transition to Operator Overloading
const Scene4 = () => {
  const [phase, setPhase] = useState(0);
  useEffect(() => { const t = [setTimeout(() => setPhase(1), 800)]; return () => t.forEach(clearTimeout); }, []);
  return (
    <div style={containerStyle}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: colors.operatorColor, fontWeight: 700, fontSize: "13px", letterSpacing: "1.5px", marginBottom: "2rem" }}>➕ OPERATOR OVERLOADING</motion.div>
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200 }} style={{ fontSize: "6rem", color: colors.operatorColor, fontWeight: 700 }}>+</motion.div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: phase >= 1 ? 1 : 0, y: 0 }} style={{ marginTop: "2rem", display: "flex", alignItems: "center", gap: "1.5rem" }}>
        <div style={{ fontSize: "3rem" }}>😅</div>
        <div style={{ padding: "16px 24px", borderRadius: "16px", background: `${colors.warning}15`, border: `1px solid ${colors.warning}`, color: colors.warning }}>"Can we change the meaning of + ? Isn't that dangerous?"</div>
      </motion.div>
    </div>
  );
};

// SCENE 5: Clarification - Not for int!
const Scene5 = () => {
  const [phase, setPhase] = useState(0);
  useEffect(() => { const t = [setTimeout(() => setPhase(1), 600), setTimeout(() => setPhase(2), 1500)]; return () => t.forEach(clearTimeout); }, []);
  return (
    <div style={containerStyle}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: colors.success, fontWeight: 700, fontSize: "13px", letterSpacing: "1.5px", marginBottom: "2rem" }}>✅ CLARIFICATION</motion.div>
      <div style={{ display: "flex", gap: "3rem" }}>
        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: phase >= 1 ? 1 : 0, x: 0 }} style={{ padding: "24px 40px", borderRadius: "20px", background: `${colors.danger}15`, border: `3px dashed ${colors.danger}`, textAlign: "center" }}>
          <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>🔒</div>
          <div style={{ fontFamily: "monospace", color: colors.danger, fontWeight: 600 }}>int + int</div>
          <div style={{ color: colors.textSec, fontSize: "12px", marginTop: "0.5rem" }}>Locked! Can't change</div>
        </motion.div>
        <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: phase >= 2 ? 1 : 0, x: 0 }} style={{ padding: "24px 40px", borderRadius: "20px", background: `${colors.success}20`, border: `3px solid ${colors.success}`, textAlign: "center", boxShadow: `0 0 30px ${colors.success}30` }}>
          <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>✨</div>
          <div style={{ fontFamily: "monospace", color: colors.success, fontWeight: 600 }}>Complex + Complex</div>
          <div style={{ color: colors.textSec, fontSize: "12px", marginTop: "0.5rem" }}>We can teach C++!</div>
        </motion.div>
      </div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 2 ? 1 : 0 }} style={{ marginTop: "2rem", color: colors.textSec }}>We don't change built-in types. <span style={{ color: colors.success }}>We teach C++ about OUR objects.</span></motion.div>
    </div>
  );
};

// SCENE 6: First-Class Citizen Analogy
const Scene6 = () => {
  const [phase, setPhase] = useState(0);
  useEffect(() => { const t = [setTimeout(() => setPhase(1), 800)]; return () => t.forEach(clearTimeout); }, []);
  return (
    <div style={containerStyle}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: colors.accent, fontWeight: 700, fontSize: "13px", letterSpacing: "1.5px", marginBottom: "2rem" }}>🎭 FIRST-CLASS CITIZEN</motion.div>
      <div style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div style={{ padding: "16px 24px", borderRadius: "12px", background: `${colors.primary}20`, border: `2px solid ${colors.primary}`, fontFamily: "monospace", color: colors.primary }}>int</div>
          <div style={{ padding: "16px 24px", borderRadius: "12px", background: `${colors.primary}20`, border: `2px solid ${colors.primary}`, fontFamily: "monospace", color: colors.primary }}>float</div>
        </motion.div>
        <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }} style={{ fontSize: "2rem" }}>🏛️</motion.div>
        <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: phase >= 1 ? 1 : 0, x: 0 }} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div style={{ padding: "16px 24px", borderRadius: "12px", background: `${colors.success}20`, border: `2px solid ${colors.success}`, fontFamily: "monospace", color: colors.success, display: "flex", alignItems: "center", gap: "0.5rem" }}>Complex <span>😎</span></div>
          <div style={{ padding: "16px 24px", borderRadius: "12px", background: `${colors.success}20`, border: `2px solid ${colors.success}`, fontFamily: "monospace", color: colors.success, display: "flex", alignItems: "center", gap: "0.5rem" }}>Vector <span>😎</span></div>
        </motion.div>
      </div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 1 ? 1 : 0 }} style={{ marginTop: "2rem", color: colors.textSec }}>Make your types feel <span style={{ color: colors.accent }}>native.</span></motion.div>
    </div>
  );
};

// SCENE 7: Readability & Consistency
const Scene7 = () => {
  const [phase, setPhase] = useState(0);
  useEffect(() => { const t = [setTimeout(() => setPhase(1), 1000)]; return () => t.forEach(clearTimeout); }, []);
  return (
    <div style={containerStyle}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: colors.success, fontWeight: 700, fontSize: "13px", letterSpacing: "1.5px", marginBottom: "2rem" }}>📖 READABILITY</motion.div>
      <div style={{ display: "flex", flexDirection: "column", gap: "2rem", alignItems: "center" }}>
        <motion.div initial={{ opacity: 1 }} animate={{ opacity: phase >= 1 ? 0.3 : 1, scale: phase >= 1 ? 0.9 : 1 }} style={{ position: "relative" }}>
          <GlassCard glow={colors.danger}><CodeBlock code={`c3 = c1.add(c2);`} fontSize="16px" /></GlassCard>
          {phase >= 1 && <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", fontSize: "3rem" }}>❌</div>}
        </motion.div>
        <motion.div initial={{ opacity: 0, scale: 0 }} animate={{ opacity: phase >= 1 ? 1 : 0, scale: 1 }} style={{ fontSize: "2rem" }}>⬇️</motion.div>
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: phase >= 1 ? 1 : 0, scale: 1 }}>
          <GlassCard glow={colors.success}><CodeBlock code={`c3 = c1 + c2;`} fontSize="16px" /></GlassCard>
        </motion.div>
      </div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 1 ? 1 : 0 }} style={{ marginTop: "1.5rem", color: colors.textSec }}>Same meaning. <span style={{ color: colors.success }}>Better language.</span></motion.div>
    </div>
  );
};

// SCENE 8: Compile Time Decision
const Scene8 = () => {
  const [phase, setPhase] = useState(0);
  useEffect(() => { const t = [setTimeout(() => setPhase(1), 800)]; return () => t.forEach(clearTimeout); }, []);
  return (
    <div style={containerStyle}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: colors.compileTime, fontWeight: 700, fontSize: "13px", letterSpacing: "1.5px", marginBottom: "2rem" }}>⚡ COMPILE TIME DECISION</motion.div>
      <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 2, repeat: Infinity }} style={{ fontSize: "5rem", marginBottom: "1.5rem" }}>🦾</motion.div>
      <motion.div initial={{ opacity: 0, scale: 0 }} animate={{ opacity: phase >= 1 ? 1 : 0, scale: 1 }} transition={{ type: "spring" }} style={{ padding: "20px 40px", borderRadius: "16px", background: `${colors.compileTime}30`, border: `3px solid ${colors.compileTime}`, boxShadow: `0 0 30px ${colors.compileTime}40` }}>
        <div style={{ color: colors.compileTime, fontWeight: 700, fontSize: "1.2rem" }}>🔖 DECIDED AT COMPILE TIME</div>
      </motion.div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 1 ? 1 : 0 }} style={{ marginTop: "1.5rem", color: colors.textSec }}>This is <span style={{ color: colors.compileTime, fontWeight: 700 }}>Early Binding</span></motion.div>
    </div>
  );
};

// SCENE 9: Under The Hood
const Scene9 = () => {
  const [phase, setPhase] = useState(0);
  useEffect(() => { const t = [setTimeout(() => setPhase(1), 800), setTimeout(() => setPhase(2), 2000)]; return () => t.forEach(clearTimeout); }, []);
  return (
    <div style={containerStyle}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: colors.primary, fontWeight: 700, fontSize: "13px", letterSpacing: "1.5px", marginBottom: "2rem" }}>🔧 UNDER THE HOOD</motion.div>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1.5rem" }}>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ padding: "16px 32px", borderRadius: "16px", background: `${colors.text}10`, border: `2px solid ${colors.text}30`, fontFamily: "monospace", fontSize: "1.5rem", color: colors.text }}>c1 + c2</motion.div>
        <motion.div initial={{ opacity: 0, scaleY: 0 }} animate={{ opacity: phase >= 1 ? 1 : 0, scaleY: 1 }} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{ width: "3px", height: "40px", background: `linear-gradient(to bottom, ${colors.primary}, ${colors.accent})` }} />
          <motion.div animate={{ y: [0, 5, 0] }} transition={{ duration: 1, repeat: Infinity }} style={{ fontSize: "1.5rem" }}>⬇️</motion.div>
        </motion.div>
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: phase >= 2 ? 1 : 0, scale: 1 }} style={{ padding: "20px 40px", borderRadius: "20px", background: `linear-gradient(135deg, ${colors.accent}30, ${colors.primary}20)`, border: `3px solid ${colors.accent}`, boxShadow: `0 0 30px ${colors.accent}30` }}>
          <div style={{ fontFamily: "monospace", fontSize: "1.5rem", color: colors.accent, fontWeight: 700 }}>c1.operator+(c2)</div>
        </motion.div>
      </div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 2 ? 1 : 0 }} style={{ marginTop: "1.5rem", color: colors.textSec }}>It's just a <span style={{ color: colors.accent }}>function call.</span></motion.div>
    </div>
  );
};

// SCENE 10: Operator Overloading Full Program
const Scene10 = () => {
  const code = `class Complex {
    int real, imag;
public:
    Complex(int r=0,int i=0){ real=r; imag=i; }

    Complex operator+(Complex c) {
        Complex temp;
        temp.real = real + c.real;
        temp.imag = imag + c.imag;
        return temp;
    }

    void display() {
        cout << real << " + " << imag << "i";
    }
};`;
  return (
    <div style={containerStyle}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: colors.operatorColor, fontWeight: 700, fontSize: "13px", letterSpacing: "1.5px", marginBottom: "1rem" }}>📝 OPERATOR OVERLOADING PROGRAM</motion.div>
      <GlassCard style={{ maxWidth: "550px" }}><CodeBlock code={code} fontSize="10px" /></GlassCard>
    </div>
  );
};

// SCENE 11: Visual Execution
const Scene11 = () => {
  const [phase, setPhase] = useState(0);
  useEffect(() => { const t = [setTimeout(() => setPhase(1), 500), setTimeout(() => setPhase(2), 1000), setTimeout(() => setPhase(3), 1500)]; return () => t.forEach(clearTimeout); }, []);
  const steps = [{ label: "real parts add", result: "2 + 4 = 6" }, { label: "imag parts add", result: "3 + 5 = 8" }, { label: "new object created", result: "(6 + 8i)" }];
  return (
    <div style={containerStyle}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: colors.success, fontWeight: 700, fontSize: "13px", letterSpacing: "1.5px", marginBottom: "2rem" }}>⚡ VISUAL EXECUTION</motion.div>
      <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
        {steps.map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, x: -30 }} animate={{ opacity: phase > i ? 1 : 0, x: 0 }} style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
            <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: `${colors.success}30`, border: `2px solid ${colors.success}`, display: "flex", alignItems: "center", justifyContent: "center", color: colors.success, fontWeight: 700 }}>{i + 1}</div>
            <div style={{ padding: "10px 20px", borderRadius: "12px", background: `${colors.text}10`, border: `1px solid ${colors.text}30`, color: colors.text }}>{s.label}</div>
            <div style={{ color: colors.textSec }}>→</div>
            <div style={{ padding: "10px 20px", borderRadius: "12px", background: `${colors.success}15`, border: `1px solid ${colors.success}`, color: colors.success, fontWeight: 600 }}>{s.result}</div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// SCENE 12: Rules & Restrictions
const Scene12 = () => {
  const [phase, setPhase] = useState(0);
  useEffect(() => { const t = [setTimeout(() => setPhase(1), 400), setTimeout(() => setPhase(2), 800), setTimeout(() => setPhase(3), 1200)]; return () => t.forEach(clearTimeout); }, []);
  const rules = [{ icon: "❌", text: "Cannot overload: :: . sizeof ?:", color: colors.danger }, { icon: "❌", text: "Cannot change precedence", color: colors.danger }, { icon: "✅", text: "One operand must be object", color: colors.success }];
  return (
    <div style={containerStyle}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: colors.warning, fontWeight: 700, fontSize: "13px", letterSpacing: "1.5px", marginBottom: "2rem" }}>📜 RULES & RESTRICTIONS</motion.div>
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {rules.map((r, i) => (
          <motion.div key={i} initial={{ opacity: 0, x: -30 }} animate={{ opacity: phase > i ? 1 : 0, x: 0 }} style={{ padding: "14px 24px", borderRadius: "14px", background: `${r.color}15`, border: `2px solid ${r.color}`, display: "flex", alignItems: "center", gap: "1rem" }}>
            <span style={{ fontSize: "1.3rem" }}>{r.icon}</span>
            <span style={{ color: r.color, fontWeight: 600 }}>{r.text}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// SCENE 13: ++ Operator Counter Example
const Scene13 = () => {
  const code = `Counter operator++() { ++x; return *this; }`;
  const [val, setVal] = useState(5);
  useEffect(() => { const i = setInterval(() => setVal(v => v < 7 ? v + 1 : 5), 1500); return () => clearInterval(i); }, []);
  return (
    <div style={containerStyle}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: colors.operatorColor, fontWeight: 700, fontSize: "13px", letterSpacing: "1.5px", marginBottom: "1.5rem" }}>➕➕ INCREMENT OPERATOR</motion.div>
      <motion.div key={val} initial={{ scale: 0.8 }} animate={{ scale: 1 }} style={{ padding: "30px 60px", borderRadius: "20px", background: `${colors.success}20`, border: `3px solid ${colors.success}`, marginBottom: "2rem", boxShadow: `0 0 30px ${colors.success}30` }}>
        <span style={{ fontFamily: "monospace", fontSize: "2.5rem", color: colors.success, fontWeight: 700 }}>x = {val}</span>
      </motion.div>
      <GlassCard><CodeBlock code={code} fontSize="13px" /></GlassCard>
    </div>
  );
};

// SCENE 14: Big Transition - Runtime World
const Scene14 = () => {
  const [phase, setPhase] = useState(0);
  useEffect(() => { const t = [setTimeout(() => setPhase(1), 800), setTimeout(() => setPhase(2), 1800)]; return () => t.forEach(clearTimeout); }, []);
  return (
    <div style={containerStyle}>
      <motion.div initial={{ opacity: 0.3 }} animate={{ opacity: phase >= 1 ? 0.2 : 0.8 }} style={{ padding: "30px 50px", borderRadius: "20px", background: `${colors.compileTime}15`, border: `2px solid ${colors.compileTime}40`, marginBottom: "2rem" }}>
        <div style={{ color: colors.compileTime, fontWeight: 600 }}>Compile Time</div>
      </motion.div>
      <motion.div initial={{ scale: 0 }} animate={{ scale: phase >= 1 ? 1 : 0 }} transition={{ type: "spring" }} style={{ fontSize: "4rem", marginBottom: "1.5rem" }}>🎭</motion.div>
      <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: phase >= 2 ? 1 : 0, scale: 1 }} style={{ padding: "30px 60px", borderRadius: "24px", background: `linear-gradient(135deg, ${colors.runTime}30, ${colors.runTime}10)`, border: `3px solid ${colors.runTime}`, boxShadow: `0 0 50px ${colors.runTime}40` }}>
        <div style={{ color: colors.runTime, fontWeight: 700, fontSize: "1.5rem" }}>Welcome to Runtime</div>
      </motion.div>
    </div>
  );
};

// SCENE 15: Shape, Circle, Rectangle Setup
const Scene15 = () => {
  const [phase, setPhase] = useState(0);
  useEffect(() => { const t = [setTimeout(() => setPhase(1), 600)]; return () => t.forEach(clearTimeout); }, []);
  return (
    <div style={containerStyle}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: colors.derivedClass, fontWeight: 700, fontSize: "13px", letterSpacing: "1.5px", marginBottom: "2rem" }}>🏗️ CLASS HIERARCHY</motion.div>
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} style={{ padding: "20px 50px", borderRadius: "16px", background: `${colors.baseClass}20`, border: `3px solid ${colors.baseClass}`, marginBottom: "2rem" }}>
        <span style={{ color: colors.baseClass, fontWeight: 700, fontSize: "1.2rem" }}>Shape (Parent)</span>
      </motion.div>
      <div style={{ display: "flex", gap: "3rem" }}>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: phase >= 1 ? 1 : 0, y: 0 }} style={{ padding: "20px 36px", borderRadius: "16px", background: `${colors.pointerColor}20`, border: `2px solid ${colors.pointerColor}`, textAlign: "center" }}>
          <div style={{ fontSize: "2.5rem" }}>⭕</div>
          <div style={{ color: colors.pointerColor, fontWeight: 600 }}>Circle</div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: phase >= 1 ? 1 : 0, y: 0 }} transition={{ delay: 0.2 }} style={{ padding: "20px 36px", borderRadius: "16px", background: `${colors.accent}20`, border: `2px solid ${colors.accent}`, textAlign: "center" }}>
          <div style={{ fontSize: "2.5rem" }}>⬜</div>
          <div style={{ color: colors.accent, fontWeight: 600 }}>Rectangle</div>
        </motion.div>
      </div>
    </div>
  );
};

// SCENE 16: The Pointer Problem
const Scene16 = () => {
  const [phase, setPhase] = useState(0);
  useEffect(() => { const t = [setTimeout(() => setPhase(1), 600), setTimeout(() => setPhase(2), 1500)]; return () => t.forEach(clearTimeout); }, []);
  return (
    <div style={containerStyle}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: colors.pointerColor, fontWeight: 700, fontSize: "13px", letterSpacing: "1.5px", marginBottom: "2rem" }}>🔷 THE POINTER PROBLEM</motion.div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ padding: "16px 32px", borderRadius: "16px", background: `${colors.pointerColor}20`, border: `2px solid ${colors.pointerColor}`, marginBottom: "2rem" }}>
        <span style={{ fontFamily: "monospace", fontSize: "1.3rem", color: colors.pointerColor }}>Shape* ptr</span>
      </motion.div>
      <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: phase >= 1 ? 1 : 0, x: 0 }} style={{ display: "flex", alignItems: "center", gap: "1.5rem", marginBottom: "1.5rem" }}>
        <span style={{ color: colors.text }}>Points to →</span>
        <div style={{ padding: "12px 24px", borderRadius: "12px", background: `${colors.pointerColor}20`, border: `2px solid ${colors.pointerColor}`, display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <span style={{ fontSize: "1.5rem" }}>⭕</span>
          <span style={{ color: colors.pointerColor, fontWeight: 600 }}>Circle Object</span>
        </div>
      </motion.div>
      <AnimatePresence>{phase >= 2 && <motion.div initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} style={{ fontSize: "5rem" }}>❓</motion.div>}</AnimatePresence>
    </div>
  );
};

// Export scenes 1-16
export const AnimationStepsPart1 = [
  { title: "Welcome & Hook", component: Scene1, contentText: "Polymorphism in C++: Two Faces of Power - Compile Time and Run Time." },
  { title: "Mission Statement", component: Scene2, contentText: "Not just for exams. For real programming." },
  { title: "Two Tools Analogy", component: Scene3, contentText: "Tool 1 makes code clean. Tool 2 makes program smart. Same idea, different power." },
  { title: "Transition to Operator Overloading", component: Scene4, contentText: "Can we change the meaning of +? Isn't that dangerous?" },
  { title: "Clarification - Not for int!", component: Scene5, contentText: "We don't change built-in types. We teach C++ about OUR objects." },
  { title: "First-Class Citizen", component: Scene6, contentText: "int and float are VIPs. Make Complex and Vector join the club!" },
  { title: "Readability & Consistency", component: Scene7, contentText: "c3 = c1.add(c2) becomes c3 = c1 + c2. Same meaning, better language." },
  { title: "Compile Time Decision", component: Scene8, contentText: "Compiler stamps: DECIDED AT COMPILE TIME. This is Early Binding." },
  { title: "Under The Hood", component: Scene9, contentText: "c1 + c2 transforms into c1.operator+(c2). It's just a function call." },
  { title: "Operator Overloading Program", component: Scene10, contentText: "Complete Complex class with operator+ overloaded." },
  { title: "Visual Execution", component: Scene11, contentText: "real parts add, imag parts add, new object created: (6 + 8i)" },
  { title: "Rules & Restrictions", component: Scene12, contentText: "Cannot overload :: . sizeof ?:. Cannot change precedence. One operand must be object." },
  { title: "++ Operator Example", component: Scene13, contentText: "Counter value: 5 → 6 → 7. ++x increments and returns *this." },
  { title: "Transition to Runtime", component: Scene14, contentText: "Curtain opens: Welcome to Runtime Polymorphism!" },
  { title: "Class Hierarchy", component: Scene15, contentText: "Shape is parent. Circle and Rectangle are children." },
  { title: "The Pointer Problem", component: Scene16, contentText: "Shape* ptr points to Circle object. Which function gets called?" },
];
