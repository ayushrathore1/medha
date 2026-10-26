/**
 * ClassesObjectsLecture.jsx - All 15 Scenes
 * Classes and Objects - From Ideas to Living Systems
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
  const keywords = ['int', 'void', 'class', 'struct', 'public', 'private', 'cout'];
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
// SCENE 1: Before Objects - The Age of Chaos
// ============================================
const Scene1 = () => {
  const [phase, setPhase] = useState(0);
  useEffect(() => { const t = [setTimeout(() => setPhase(1), 800), setTimeout(() => setPhase(2), 1600)]; return () => t.forEach(clearTimeout); }, []);
  return (
    <div style={{ ...containerStyle, background: "linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 50%, #0a0a0f 100%)" }}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: "center", marginBottom: "1.5rem" }}>
        <div style={{ color: colors.accent, fontWeight: 700, fontSize: "12px", letterSpacing: "3px", marginBottom: "0.5rem" }}>CHAPTER 1</div>
        <div style={{ fontSize: "1.5rem", fontWeight: 700, color: colors.text }}>Before Objects: The Age of Chaos</div>
      </motion.div>
      <div style={{ display: "flex", gap: "3rem", justifyContent: "center", marginBottom: "1.5rem" }}>
        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} style={{ padding: "16px 24px", borderRadius: "12px", background: `${colors.primary}15`, border: `2px dashed ${colors.primary}`, textAlign: "center" }}>
          <div style={{ fontSize: "1.5rem", marginBottom: "0.3rem" }}>📦</div>
          <div style={{ color: colors.primary, fontWeight: 600, fontSize: "11px" }}>DATA</div>
        </motion.div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 1 ? 1 : 0 }} style={{ fontSize: "2rem", alignSelf: "center" }}>🔀</motion.div>
        <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} style={{ padding: "16px 24px", borderRadius: "12px", background: `${colors.success}15`, border: `2px dashed ${colors.success}`, textAlign: "center" }}>
          <div style={{ fontSize: "1.5rem", marginBottom: "0.3rem" }}>⚙️</div>
          <div style={{ color: colors.success, fontWeight: 600, fontSize: "11px" }}>FUNCTIONS</div>
        </motion.div>
      </div>
      <AnimatePresence>{phase >= 2 && <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} style={{ padding: "14px 28px", borderRadius: "16px", background: `${colors.danger}20`, border: `2px solid ${colors.danger}`, textAlign: "center" }}>
        <div style={{ color: colors.danger, fontWeight: 700, fontSize: "13px" }}>PROCEDURAL PROGRAMMING</div>
        <div style={{ color: colors.textSec, fontSize: "11px", marginTop: "0.3rem" }}>"Everything can change everything."</div>
      </motion.div>}</AnimatePresence>
    </div>
  );
};

// ============================================
// SCENE 2: The Problem of Scale
// ============================================
const Scene2 = () => {
  const [phase, setPhase] = useState(0);
  useEffect(() => { const t = [setTimeout(() => setPhase(1), 800)]; return () => t.forEach(clearTimeout); }, []);
  return (
    <div style={containerStyle}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: "center", marginBottom: "1.5rem" }}>
        <div style={{ color: colors.accent, fontWeight: 700, fontSize: "12px", letterSpacing: "3px", marginBottom: "0.5rem" }}>CHAPTER 2</div>
        <div style={{ fontSize: "1.5rem", fontWeight: 700, color: colors.danger }}>The Problem of Scale</div>
      </motion.div>
      <div style={{ display: "flex", justifyContent: "center", marginBottom: "1.5rem" }}>
        <motion.div animate={{ scale: [1, 0.95, 1] }} transition={{ duration: 2, repeat: Infinity }} style={{ position: "relative", width: "200px", height: "120px" }}>
          {Array(8).fill(0).map((_, i) => (
            <motion.div key={i} animate={{ opacity: [0.3, 0.8, 0.3] }} transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 }} style={{ position: "absolute", width: `${150 - i * 15}px`, height: "2px", background: colors.danger, top: `${15 + i * 12}px`, left: `${25 + i * 7}px`, transform: `rotate(${i * 20 - 70}deg)` }} />
          ))}
        </motion.div>
      </div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 1 ? 1 : 0 }} style={{ textAlign: "center" }}>
        <div style={{ color: colors.text, fontSize: "13px", marginBottom: "0.5rem" }}>"Small programs survive."</div>
        <div style={{ color: colors.danger, fontSize: "13px", fontWeight: 600 }}>"Large systems collapse."</div>
        <div style={{ color: colors.accent, fontSize: "12px", marginTop: "0.8rem" }}>"We needed a new way to build software."</div>
      </motion.div>
    </div>
  );
};

// ============================================
// SCENE 3: The Birth of the Blueprint
// ============================================
const Scene3 = () => {
  const [phase, setPhase] = useState(0);
  useEffect(() => { const t = [setTimeout(() => setPhase(1), 800)]; return () => t.forEach(clearTimeout); }, []);
  return (
    <div style={containerStyle}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: "center", marginBottom: "1.5rem" }}>
        <div style={{ color: colors.accent, fontWeight: 700, fontSize: "12px", letterSpacing: "3px", marginBottom: "0.5rem" }}>CHAPTER 3</div>
        <div style={{ fontSize: "1.5rem", fontWeight: 700, color: colors.virtualColor }}>The Birth of the Blueprint</div>
      </motion.div>
      <motion.div initial={{ opacity: 0, rotateY: -30 }} animate={{ opacity: 1, rotateY: 0 }} style={{ display: "flex", justifyContent: "center", marginBottom: "1.5rem" }}>
        <div style={{ padding: "20px 32px", borderRadius: "16px", background: `${colors.virtualColor}15`, border: `3px dashed ${colors.virtualColor}`, textAlign: "center" }}>
          <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>📐</div>
          <div style={{ color: colors.virtualColor, fontWeight: 700, fontSize: "14px" }}>STUDENT</div>
          <div style={{ display: "flex", gap: "0.8rem", marginTop: "0.8rem" }}>
            {["ID", "Name", "Marks"].map((l, i) => (
              <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: phase >= 1 ? 1 : 0 }} transition={{ delay: i * 0.15 }} style={{ padding: "4px 10px", borderRadius: "6px", background: `${colors.primary}20`, fontSize: "9px", color: colors.primary }}>{l}</motion.div>
            ))}
          </div>
        </div>
      </motion.div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 1 ? 1 : 0 }} style={{ textAlign: "center" }}>
        <div style={{ color: colors.text, fontSize: "12px" }}>"This is not a student. This is a <span style={{ color: colors.virtualColor, fontWeight: 700 }}>plan</span>."</div>
        <div style={{ color: colors.accent, fontSize: "12px", marginTop: "0.3rem" }}>"In C++, this is called a <span style={{ fontWeight: 700 }}>Class</span>."</div>
      </motion.div>
    </div>
  );
};

// ============================================
// SCENE 4: Class Is Not an Object
// ============================================
const Scene4 = () => {
  const [phase, setPhase] = useState(0);
  useEffect(() => { const t = [setTimeout(() => setPhase(1), 800)]; return () => t.forEach(clearTimeout); }, []);
  const code = `class Student { int id; };`;
  return (
    <div style={containerStyle}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: "center", marginBottom: "1.5rem" }}>
        <div style={{ color: colors.accent, fontWeight: 700, fontSize: "12px", letterSpacing: "3px", marginBottom: "0.5rem" }}>CHAPTER 4</div>
        <div style={{ fontSize: "1.5rem", fontWeight: 700, color: colors.warning }}>Class Is Not an Object</div>
      </motion.div>
      <div style={{ display: "flex", gap: "2rem", alignItems: "center", justifyContent: "center", marginBottom: "1.5rem" }}>
        <GlassCard style={{ maxWidth: "280px" }}><CodeBlock code={code} fontSize="11px" /></GlassCard>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 1 ? 1 : 0 }} style={{ padding: "20px", borderRadius: "12px", background: `${colors.text}10`, border: `2px dashed ${colors.text}30`, textAlign: "center" }}>
          <div style={{ color: colors.textSec, fontSize: "11px" }}>Memory Grid</div>
          <div style={{ marginTop: "0.5rem", color: colors.warning, fontSize: "12px" }}>🔍 Empty!</div>
        </motion.div>
      </div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 1 ? 1 : 0 }} style={{ textAlign: "center" }}>
        <div style={{ color: colors.warning, fontSize: "12px" }}>"No memory allocated. No real object exists."</div>
        <div style={{ color: colors.textSec, fontSize: "11px", marginTop: "0.3rem" }}>"A class is only an <span style={{ fontWeight: 700, color: colors.text }}>idea</span>."</div>
      </motion.div>
    </div>
  );
};

// ============================================
// SCENE 5: The Moment of Creation - Object
// ============================================
const Scene5 = () => {
  const [phase, setPhase] = useState(0);
  useEffect(() => { const t = [setTimeout(() => setPhase(1), 800)]; return () => t.forEach(clearTimeout); }, []);
  const code = `Student s1;  // Object created!`;
  return (
    <div style={containerStyle}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: "center", marginBottom: "1.5rem" }}>
        <div style={{ color: colors.accent, fontWeight: 700, fontSize: "12px", letterSpacing: "3px", marginBottom: "0.5rem" }}>CHAPTER 5</div>
        <div style={{ fontSize: "1.5rem", fontWeight: 700, color: colors.success }}>The Moment of Creation ✨</div>
      </motion.div>
      <div style={{ display: "flex", gap: "2rem", alignItems: "center", justifyContent: "center", marginBottom: "1.5rem" }}>
        <GlassCard glow={colors.success} style={{ maxWidth: "280px" }}><CodeBlock code={code} fontSize="11px" /></GlassCard>
        <motion.div initial={{ opacity: 0, scale: 0 }} animate={{ opacity: phase >= 1 ? 1 : 0, scale: 1 }} style={{ padding: "20px 28px", borderRadius: "12px", background: `${colors.success}20`, border: `3px solid ${colors.success}`, textAlign: "center" }}>
          <div style={{ fontSize: "1.5rem", marginBottom: "0.3rem" }}>📦</div>
          <div style={{ color: colors.success, fontWeight: 700 }}>s1</div>
          <div style={{ color: colors.textSec, fontSize: "9px" }}>Memory Allocated!</div>
        </motion.div>
      </div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 1 ? 1 : 0 }} style={{ textAlign: "center" }}>
        <div style={{ color: colors.success, fontSize: "13px" }}>"Now it <span style={{ fontWeight: 700 }}>exists</span>."</div>
        <div style={{ color: colors.accent, fontSize: "12px", marginTop: "0.3rem" }}>"This is an <span style={{ fontWeight: 700 }}>Object</span>."</div>
      </motion.div>
    </div>
  );
};

// ============================================
// SCENE 6: Inside the Object
// ============================================
const Scene6 = () => {
  const [phase, setPhase] = useState(0);
  useEffect(() => { const t = [setTimeout(() => setPhase(1), 800)]; return () => t.forEach(clearTimeout); }, []);
  return (
    <div style={containerStyle}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: "center", marginBottom: "1.5rem" }}>
        <div style={{ color: colors.accent, fontWeight: 700, fontSize: "12px", letterSpacing: "3px", marginBottom: "0.5rem" }}>CHAPTER 6</div>
        <div style={{ fontSize: "1.5rem", fontWeight: 700, color: colors.primary }}>Inside the Object</div>
      </motion.div>
      <div style={{ display: "flex", justifyContent: "center", marginBottom: "1.5rem" }}>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ padding: "24px", borderRadius: "16px", background: `${colors.primary}15`, border: `2px solid ${colors.primary}` }}>
          <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
            <div style={{ padding: "16px 24px", borderRadius: "8px", background: `${phase >= 1 ? colors.success : colors.warning}20`, border: `2px solid ${phase >= 1 ? colors.success : colors.warning}` }}>
              <div style={{ color: phase >= 1 ? colors.success : colors.warning, fontWeight: 700, fontSize: "18px" }}>{phase >= 1 ? "101" : "???"}</div>
              <div style={{ color: colors.textSec, fontSize: "9px" }}>id</div>
            </div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 1 ? 1 : 0 }} style={{ color: colors.success, fontSize: "11px" }}>
              <div>setId(101)</div>
              <div style={{ fontSize: "9px", color: colors.textSec }}>→ Stabilized!</div>
            </motion.div>
          </div>
        </motion.div>
      </div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: "center" }}>
        <div style={{ color: phase >= 1 ? colors.success : colors.warning, fontSize: "11px" }}>{phase >= 1 ? "✓ Value initialized" : "⚠️ Uninitialized = garbage value"}</div>
      </motion.div>
    </div>
  );
};

// ============================================
// SCENE 7: Data + Behavior = Living Unit
// ============================================
const Scene7 = () => {
  const [phase, setPhase] = useState(0);
  useEffect(() => { const t = [setTimeout(() => setPhase(1), 800)]; return () => t.forEach(clearTimeout); }, []);
  return (
    <div style={containerStyle}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: "center", marginBottom: "1.5rem" }}>
        <div style={{ color: colors.accent, fontWeight: 700, fontSize: "12px", letterSpacing: "3px", marginBottom: "0.5rem" }}>CHAPTER 7</div>
        <div style={{ fontSize: "1.5rem", fontWeight: 700, color: colors.virtualColor }}>Data + Behavior = Living Unit</div>
      </motion.div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: "flex", justifyContent: "center", marginBottom: "1.5rem" }}>
        <div style={{ padding: "24px", borderRadius: "16px", background: `${colors.virtualColor}15`, border: `3px solid ${colors.virtualColor}` }}>
          <div style={{ textAlign: "center", marginBottom: "0.8rem" }}>
            <div style={{ padding: "10px 20px", borderRadius: "8px", background: `${colors.primary}20`, display: "inline-block" }}>
              <span style={{ color: colors.primary, fontWeight: 600, fontSize: "12px" }}>id = 101</span>
            </div>
          </div>
          <div style={{ display: "flex", gap: "0.8rem" }}>
            {["setId()", "showId()"].map((m, i) => (
              <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: phase >= 1 ? 1 : 0 }} transition={{ delay: i * 0.2 }} style={{ padding: "8px 14px", borderRadius: "100px", background: `${colors.success}20`, border: `1px solid ${colors.success}`, fontSize: "10px", color: colors.success }}>{m}</motion.div>
            ))}
          </div>
        </div>
      </motion.div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 1 ? 1 : 0 }} style={{ textAlign: "center" }}>
        <div style={{ color: colors.text, fontSize: "12px" }}>"Data and functions bound together."</div>
        <div style={{ color: colors.virtualColor, fontSize: "12px", marginTop: "0.3rem" }}>"This is <span style={{ fontWeight: 700 }}>Encapsulation</span>."</div>
      </motion.div>
    </div>
  );
};

// ============================================
// SCENE 8: The Locked Vault
// ============================================
const Scene8 = () => {
  const [phase, setPhase] = useState(0);
  useEffect(() => { const t = [setTimeout(() => setPhase(1), 800)]; return () => t.forEach(clearTimeout); }, []);
  return (
    <div style={containerStyle}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: "center", marginBottom: "1.5rem" }}>
        <div style={{ color: colors.accent, fontWeight: 700, fontSize: "12px", letterSpacing: "3px", marginBottom: "0.5rem" }}>CHAPTER 8</div>
        <div style={{ fontSize: "1.5rem", fontWeight: 700, color: colors.danger }}>The Locked Vault 🔒</div>
      </motion.div>
      <div style={{ display: "flex", gap: "1.5rem", alignItems: "center", justifyContent: "center", marginBottom: "1.5rem" }}>
        <div style={{ padding: "20px", borderRadius: "16px", background: `${colors.danger}20`, border: `3px solid ${colors.danger}`, textAlign: "center" }}>
          <div style={{ fontSize: "1.3rem", marginBottom: "0.3rem" }}>🔒</div>
          <div style={{ color: colors.danger, fontWeight: 700, fontSize: "11px" }}>private</div>
          <div style={{ padding: "8px 16px", borderRadius: "6px", background: `${colors.text}10`, marginTop: "0.5rem", fontSize: "10px", color: colors.textSec }}>id</div>
        </div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 1 ? 1 : 0 }} style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <div style={{ padding: "8px 14px", borderRadius: "100px", background: `${colors.success}20`, border: `1px solid ${colors.success}`, fontSize: "10px", color: colors.success }}>🔑 setId()</div>
          <div style={{ padding: "8px 14px", borderRadius: "100px", background: `${colors.success}20`, border: `1px solid ${colors.success}`, fontSize: "10px", color: colors.success }}>🔑 showId()</div>
        </motion.div>
      </div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 1 ? 1 : 0 }} style={{ textAlign: "center" }}>
        <div style={{ color: colors.danger, fontSize: "11px" }}>❌ Direct access blocked</div>
        <div style={{ color: colors.success, fontSize: "11px", marginTop: "0.3rem" }}>✓ "You must request services."</div>
      </motion.div>
    </div>
  );
};

// ============================================
// SCENE 9: Why This Matters
// ============================================
const Scene9 = () => {
  const [phase, setPhase] = useState(0);
  useEffect(() => { const t = [setTimeout(() => setPhase(1), 800)]; return () => t.forEach(clearTimeout); }, []);
  return (
    <div style={containerStyle}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: "center", marginBottom: "1.5rem" }}>
        <div style={{ color: colors.accent, fontWeight: 700, fontSize: "12px", letterSpacing: "3px", marginBottom: "0.5rem" }}>CHAPTER 9</div>
        <div style={{ fontSize: "1.5rem", fontWeight: 700, color: colors.warning }}>Why This Matters</div>
      </motion.div>
      <div style={{ display: "flex", gap: "2rem", justifyContent: "center", marginBottom: "1.5rem" }}>
        <div style={{ padding: "16px", borderRadius: "12px", background: `${colors.danger}15`, border: `2px solid ${colors.danger}`, textAlign: "center" }}>
          <div style={{ color: colors.danger, fontWeight: 600, fontSize: "11px", marginBottom: "0.5rem" }}>❌ Without Encapsulation</div>
          <div style={{ fontFamily: "monospace", fontSize: "10px", color: colors.danger }}>id = -999</div>
          <div style={{ color: colors.textSec, fontSize: "9px", marginTop: "0.3rem" }}>System breaks!</div>
        </div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 1 ? 1 : 0 }} style={{ padding: "16px", borderRadius: "12px", background: `${colors.success}15`, border: `2px solid ${colors.success}`, textAlign: "center" }}>
          <div style={{ color: colors.success, fontWeight: 600, fontSize: "11px", marginBottom: "0.5rem" }}>✓ With Encapsulation</div>
          <div style={{ fontFamily: "monospace", fontSize: "10px", color: colors.success }}>setId(-999)</div>
          <div style={{ color: colors.textSec, fontSize: "9px", marginTop: "0.3rem" }}>Rejected by logic!</div>
        </motion.div>
      </div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 1 ? 1 : 0 }} style={{ padding: "10px 24px", borderRadius: "100px", background: `${colors.warning}15`, textAlign: "center" }}>
        <span style={{ color: colors.warning, fontSize: "11px" }}>"This is not about trust. This is about <span style={{ fontWeight: 700 }}>safety</span>."</span>
      </motion.div>
    </div>
  );
};

// ============================================
// SCENE 10: The Dot Operator Bridge
// ============================================
const Scene10 = () => {
  const [phase, setPhase] = useState(0);
  useEffect(() => { const t = [setTimeout(() => setPhase(1), 800)]; return () => t.forEach(clearTimeout); }, []);
  const code = `s1.setId(101);
s1.showId();  // Output: 101`;
  return (
    <div style={containerStyle}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: "center", marginBottom: "1.5rem" }}>
        <div style={{ color: colors.accent, fontWeight: 700, fontSize: "12px", letterSpacing: "3px", marginBottom: "0.5rem" }}>CHAPTER 10</div>
        <div style={{ fontSize: "1.5rem", fontWeight: 700, color: colors.primary }}>The Dot Operator Bridge</div>
      </motion.div>
      <div style={{ display: "flex", gap: "2rem", alignItems: "center", justifyContent: "center", marginBottom: "1.5rem" }}>
        <GlassCard glow={colors.primary} style={{ maxWidth: "280px" }}><CodeBlock code={code} fontSize="10px" /></GlassCard>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 1 ? 1 : 0 }} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <div style={{ padding: "10px 16px", borderRadius: "8px", background: `${colors.primary}20`, color: colors.primary, fontWeight: 600, fontSize: "11px" }}>s1</div>
          <motion.div animate={{ x: [0, 5, 0] }} transition={{ duration: 1, repeat: Infinity }} style={{ color: colors.accent, fontSize: "1.2rem" }}>.</motion.div>
          <div style={{ padding: "10px 16px", borderRadius: "8px", background: `${colors.success}20`, color: colors.success, fontSize: "11px" }}>method()</div>
        </motion.div>
      </div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 1 ? 1 : 0 }} style={{ textAlign: "center" }}>
        <span style={{ color: colors.accent, fontSize: "11px" }}>The dot operator connects object to its methods</span>
      </motion.div>
    </div>
  );
};

// ============================================
// SCENE 11: Multiple Objects, Same Blueprint
// ============================================
const Scene11 = () => {
  const [phase, setPhase] = useState(0);
  useEffect(() => { const t = [setTimeout(() => setPhase(1), 800)]; return () => t.forEach(clearTimeout); }, []);
  const code = `Student s1;
Student s2;`;
  return (
    <div style={containerStyle}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: "center", marginBottom: "1.5rem" }}>
        <div style={{ color: colors.accent, fontWeight: 700, fontSize: "12px", letterSpacing: "3px", marginBottom: "0.5rem" }}>CHAPTER 11</div>
        <div style={{ fontSize: "1.5rem", fontWeight: 700, color: colors.success }}>Multiple Objects, Same Blueprint</div>
      </motion.div>
      <div style={{ display: "flex", gap: "2rem", alignItems: "flex-start", justifyContent: "center", marginBottom: "1.5rem" }}>
        <GlassCard style={{ maxWidth: "200px" }}><CodeBlock code={code} fontSize="10px" /></GlassCard>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 1 ? 1 : 0 }} style={{ display: "flex", gap: "1rem" }}>
          <div style={{ padding: "16px", borderRadius: "12px", background: `${colors.primary}20`, border: `2px solid ${colors.primary}`, textAlign: "center" }}>
            <div style={{ color: colors.primary, fontWeight: 700, fontSize: "12px" }}>s1</div>
            <div style={{ fontSize: "9px", color: colors.textSec }}>@1000</div>
            <div style={{ marginTop: "0.3rem", fontSize: "10px", color: colors.success }}>id = 101</div>
          </div>
          <div style={{ padding: "16px", borderRadius: "12px", background: `${colors.success}20`, border: `2px solid ${colors.success}`, textAlign: "center" }}>
            <div style={{ color: colors.success, fontWeight: 700, fontSize: "12px" }}>s2</div>
            <div style={{ fontSize: "9px", color: colors.textSec }}>@2000</div>
            <div style={{ marginTop: "0.3rem", fontSize: "10px", color: colors.primary }}>id = 525</div>
          </div>
        </motion.div>
      </div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 1 ? 1 : 0 }} style={{ textAlign: "center" }}>
        <div style={{ color: colors.text, fontSize: "12px" }}>"Same class. Different lives."</div>
      </motion.div>
    </div>
  );
};

// ============================================
// SCENE 12: Struct vs Class - Philosophy Shift
// ============================================
const Scene12 = () => {
  const [phase, setPhase] = useState(0);
  useEffect(() => { const t = [setTimeout(() => setPhase(1), 800)]; return () => t.forEach(clearTimeout); }, []);
  return (
    <div style={containerStyle}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: "center", marginBottom: "1.5rem" }}>
        <div style={{ color: colors.accent, fontWeight: 700, fontSize: "12px", letterSpacing: "3px", marginBottom: "0.5rem" }}>CHAPTER 12</div>
        <div style={{ fontSize: "1.5rem", fontWeight: 700, color: colors.warning }}>struct vs class</div>
      </motion.div>
      <div style={{ display: "flex", gap: "2rem", justifyContent: "center", marginBottom: "1.5rem" }}>
        <div style={{ padding: "16px", borderRadius: "12px", background: `${colors.warning}15`, border: `2px solid ${colors.warning}`, textAlign: "center" }}>
          <div style={{ fontFamily: "monospace", color: colors.warning, fontWeight: 600, fontSize: "11px" }}>struct Student</div>
          <div style={{ color: colors.textSec, fontSize: "10px", marginTop: "0.3rem" }}>public by default</div>
          <div style={{ marginTop: "0.5rem", fontSize: "10px", color: colors.warning }}>⚠️ Open access</div>
        </div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 1 ? 1 : 0 }} style={{ padding: "16px", borderRadius: "12px", background: `${colors.success}15`, border: `2px solid ${colors.success}`, textAlign: "center" }}>
          <div style={{ fontFamily: "monospace", color: colors.success, fontWeight: 600, fontSize: "11px" }}>class Student</div>
          <div style={{ color: colors.textSec, fontSize: "10px", marginTop: "0.3rem" }}>private by default</div>
          <div style={{ marginTop: "0.5rem", fontSize: "10px", color: colors.success }}>🔒 Protected</div>
        </motion.div>
      </div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 1 ? 1 : 0 }} style={{ textAlign: "center" }}>
        <div style={{ color: colors.text, fontSize: "11px" }}>"Same power. Different philosophy."</div>
        <div style={{ color: colors.success, fontSize: "11px", marginTop: "0.3rem" }}>"Class protects by default."</div>
      </motion.div>
    </div>
  );
};

// ============================================
// SCENE 13: C++ Design Message
// ============================================
const Scene13 = () => {
  const [phase, setPhase] = useState(0);
  useEffect(() => { const t = [setTimeout(() => setPhase(1), 800)]; return () => t.forEach(clearTimeout); }, []);
  return (
    <div style={containerStyle}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: "center", marginBottom: "1.5rem" }}>
        <div style={{ color: colors.accent, fontWeight: 700, fontSize: "12px", letterSpacing: "3px", marginBottom: "0.5rem" }}>CHAPTER 13</div>
        <div style={{ fontSize: "1.5rem", fontWeight: 700, color: colors.virtualColor }}>C++ Design Message</div>
      </motion.div>
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} style={{ display: "flex", justifyContent: "center", marginBottom: "1.5rem" }}>
        <div style={{ padding: "24px 40px", borderRadius: "16px", background: `${colors.virtualColor}15`, border: `3px solid ${colors.virtualColor}`, textAlign: "center" }}>
          <motion.div animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 2, repeat: Infinity }} style={{ fontFamily: "monospace", color: colors.virtualColor, fontWeight: 700, fontSize: "1.5rem" }}>class</motion.div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 1 ? 1 : 0 }} style={{ marginTop: "0.8rem", color: colors.textSec, fontSize: "11px" }}>private by default</motion.div>
        </div>
      </motion.div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 1 ? 1 : 0 }} style={{ textAlign: "center" }}>
        <span style={{ color: colors.accent, fontSize: "12px" }}>"C++ is teaching you <span style={{ fontWeight: 700 }}>discipline</span>."</span>
      </motion.div>
    </div>
  );
};

// ============================================
// SCENE 14: From Ideas to Living Systems
// ============================================
const Scene14 = () => {
  const [phase, setPhase] = useState(0);
  useEffect(() => { const t = [setTimeout(() => setPhase(1), 800)]; return () => t.forEach(clearTimeout); }, []);
  return (
    <div style={containerStyle}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: "center", marginBottom: "1.5rem" }}>
        <div style={{ color: colors.accent, fontWeight: 700, fontSize: "12px", letterSpacing: "3px", marginBottom: "0.5rem" }}>CHAPTER 14</div>
        <div style={{ fontSize: "1.5rem", fontWeight: 700, color: colors.success }}>From Ideas to Living Systems</div>
      </motion.div>
      <div style={{ display: "flex", gap: "1rem", justifyContent: "center", marginBottom: "1.5rem" }}>
        {Array(5).fill(0).map((_, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} style={{ padding: "12px", borderRadius: "8px", background: `${colors.primary}15`, border: `1px solid ${colors.primary}` }}>
            <div style={{ fontSize: "1rem" }}>🏢</div>
          </motion.div>
        ))}
      </div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 1 ? 1 : 0 }} style={{ textAlign: "center" }}>
        <div style={{ color: colors.text, fontSize: "12px" }}>"Class defines structure and behavior."</div>
        <div style={{ color: colors.success, fontSize: "12px", marginTop: "0.3rem" }}>"Object is the <span style={{ fontWeight: 700 }}>real thing</span>."</div>
        <div style={{ color: colors.accent, fontSize: "11px", marginTop: "0.5rem" }}>"This is how software becomes architecture."</div>
      </motion.div>
    </div>
  );
};

// ============================================
// SCENE 15: Ending Thought
// ============================================
const Scene15 = () => {
  const [phase, setPhase] = useState(0);
  useEffect(() => { const t = [setTimeout(() => setPhase(1), 1000)]; return () => t.forEach(clearTimeout); }, []);
  return (
    <div style={{ ...containerStyle, background: "linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 50%, #0a0a0f 100%)" }}>
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: "center", marginBottom: "2rem" }}>
        <div style={{ color: colors.textSec, fontSize: "12px" }}>"If data is power…"</div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 1 ? 1 : 0 }} style={{ color: colors.accent, fontSize: "1.3rem", fontWeight: 700, marginTop: "0.5rem" }}>"Then control is everything."</motion.div>
      </motion.div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 1 ? 1 : 0 }} style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
        {["Classes", "Objects", "Encapsulation"].map((w, i) => (
          <div key={i} style={{ padding: "10px 18px", borderRadius: "100px", background: `${colors.virtualColor}15`, border: `1px solid ${colors.virtualColor}`, color: colors.virtualColor, fontWeight: 600, fontSize: "11px" }}>{w}</div>
        ))}
      </motion.div>
    </div>
  );
};

// Export all scenes
export const ClassesObjectsScenes = [
  { title: "Age of Chaos", component: Scene1, contentText: "Procedural programming: data and functions separate. Everything can change everything." },
  { title: "Problem of Scale", component: Scene2, contentText: "Small programs survive. Large systems collapse. We needed a new way." },
  { title: "Birth of Blueprint", component: Scene3, contentText: "STUDENT blueprint with ID, Name, Marks. Not a student - a plan. This is a Class." },
  { title: "Class Is Not Object", component: Scene4, contentText: "class Student { int id; }; No memory allocated. A class is only an idea." },
  { title: "Moment of Creation", component: Scene5, contentText: "Student s1; Memory allocated. Now it exists. This is an Object." },
  { title: "Inside the Object", component: Scene6, contentText: "Uninitialized = garbage. setId(101) stabilizes. Data gets real values." },
  { title: "Data + Behavior", component: Scene7, contentText: "id + setId() + showId() bound together. Data and functions = Encapsulation." },
  { title: "Locked Vault", component: Scene8, contentText: "private data, public methods. You cannot touch data, must request services." },
  { title: "Why This Matters", component: Scene9, contentText: "Without: id = -999 breaks. With: setId(-999) rejected. Safety, not trust." },
  { title: "Dot Operator", component: Scene10, contentText: "s1.setId(101); s1.showId(); Dot connects object to method." },
  { title: "Multiple Objects", component: Scene11, contentText: "Student s1; Student s2; Same class, different memory, different lives." },
  { title: "struct vs class", component: Scene12, contentText: "struct = public default. class = private default. Same power, different philosophy." },
  { title: "C++ Message", component: Scene13, contentText: "class keyword, private by default. C++ teaches discipline." },
  { title: "Living Systems", component: Scene14, contentText: "Class = structure. Object = real thing. Software becomes architecture." },
  { title: "Ending Thought", component: Scene15, contentText: "If data is power, then control is everything. Classes, Objects, Encapsulation." },
];
