/**
 * MultipleInheritanceLecture.jsx - All 11 Scenes
 * Multiple Inheritance & Virtual Base Class
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
  const keywords = ['int', 'void', 'class', 'public', 'private', 'virtual', 'cout'];
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
// SCENE 1: Opening - The Dangerous Power Tool
// ============================================
const Scene1 = () => {
  const [phase, setPhase] = useState(0);
  useEffect(() => { const t = [setTimeout(() => setPhase(1), 600), setTimeout(() => setPhase(2), 1200)]; return () => t.forEach(clearTimeout); }, []);
  return (
    <div style={{ ...containerStyle, background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #1a1a2e 100%)" }}>
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: "center", marginBottom: "1.5rem" }}>
        <div style={{ color: colors.accent, fontWeight: 700, fontSize: "12px", letterSpacing: "3px", marginBottom: "0.3rem" }}>RTU OOP DEEP DIVE</div>
        <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} style={{ fontSize: "1.8rem", fontWeight: 700, color: colors.text }}>Multiple Inheritance in C++</motion.div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 1 ? 1 : 0 }} style={{ color: colors.warning, fontSize: "13px", marginTop: "0.3rem" }}>"Powerful. Useful. Dangerous."</motion.div>
      </motion.div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 1 ? 1 : 0 }} style={{ display: "flex", justifyContent: "center", gap: "2rem", alignItems: "center", marginBottom: "1.5rem" }}>
        <div style={{ padding: "20px 28px", borderRadius: "16px", background: `${colors.success}15`, border: `2px solid ${colors.success}`, textAlign: "center" }}>
          <div style={{ color: colors.success, fontWeight: 700, fontSize: "12px" }}>Parent A</div>
        </div>
        <div style={{ padding: "20px 28px", borderRadius: "16px", background: `${colors.primary}15`, border: `2px solid ${colors.primary}`, textAlign: "center" }}>
          <div style={{ color: colors.primary, fontWeight: 700, fontSize: "12px" }}>Parent B</div>
        </div>
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: phase >= 1 ? 1 : 0, y: 0 }} style={{ display: "flex", justifyContent: "center" }}>
        <div style={{ padding: "16px 32px", borderRadius: "12px", background: `${colors.warning}20`, border: `2px solid ${colors.warning}`, textAlign: "center" }}>
          <div style={{ color: colors.warning, fontWeight: 700, fontSize: "14px" }}>Child</div>
          <div style={{ color: colors.textSec, fontSize: "10px", marginTop: "0.3rem" }}>Inherits from BOTH!</div>
        </div>
      </motion.div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 2 ? 1 : 0 }} style={{ marginTop: "1rem", textAlign: "center" }}>
        <span style={{ fontSize: "1.3rem" }}>⚠️</span>
        <span style={{ color: colors.textSec, fontSize: "12px", marginLeft: "0.5rem" }}>"One class… Multiple parents?"</span>
      </motion.div>
    </div>
  );
};

// ============================================
// SCENE 2: Why Does This Exist? (TA Example)
// ============================================
const Scene2 = () => {
  const [phase, setPhase] = useState(0);
  useEffect(() => { const t = [setTimeout(() => setPhase(1), 800)]; return () => t.forEach(clearTimeout); }, []);
  return (
    <div style={containerStyle}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: colors.primary, fontWeight: 700, fontSize: "13px", letterSpacing: "1.5px", marginBottom: "1.5rem" }}>🎓 WHY DOES THIS EXIST?</motion.div>
      <div style={{ display: "flex", gap: "2rem", justifyContent: "center", marginBottom: "1.5rem" }}>
        <div style={{ padding: "16px 20px", borderRadius: "12px", background: `${colors.primary}15`, border: `2px solid ${colors.primary}`, textAlign: "center" }}>
          <div style={{ fontSize: "1.5rem", marginBottom: "0.3rem" }}>👨‍🎓</div>
          <div style={{ color: colors.primary, fontWeight: 600, fontSize: "11px" }}>Student</div>
          <div style={{ fontFamily: "monospace", fontSize: "9px", color: colors.textSec, marginTop: "0.3rem" }}>enroll(), studentID</div>
        </div>
        <div style={{ padding: "16px 20px", borderRadius: "12px", background: `${colors.success}15`, border: `2px solid ${colors.success}`, textAlign: "center" }}>
          <div style={{ fontSize: "1.5rem", marginBottom: "0.3rem" }}>👨‍🏫</div>
          <div style={{ color: colors.success, fontWeight: 600, fontSize: "11px" }}>Teacher</div>
          <div style={{ fontFamily: "monospace", fontSize: "9px", color: colors.textSec, marginTop: "0.3rem" }}>grade(), teacherID</div>
        </div>
      </div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: phase >= 1 ? 1 : 0, y: 0 }} style={{ display: "flex", justifyContent: "center", marginBottom: "1rem" }}>
        <div style={{ padding: "16px 28px", borderRadius: "16px", background: `${colors.accent}20`, border: `3px solid ${colors.accent}`, textAlign: "center" }}>
          <div style={{ fontSize: "1.5rem", marginBottom: "0.3rem" }}>🧑‍💻</div>
          <div style={{ color: colors.accent, fontWeight: 700, fontSize: "12px" }}>TeachingAssistant</div>
          <div style={{ fontFamily: "monospace", fontSize: "9px", color: colors.textSec }}>IS-A Student & IS-A Teacher</div>
        </div>
      </motion.div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 1 ? 1 : 0 }} style={{ padding: "10px 24px", borderRadius: "100px", background: `${colors.accent}15`, textAlign: "center" }}>
        <span style={{ color: colors.accent, fontSize: "11px" }}>"Some things belong to multiple categories."</span>
      </motion.div>
    </div>
  );
};

// ============================================
// SCENE 3: Basic Syntax (Father & Mother)
// ============================================
const Scene3 = () => {
  const [phase, setPhase] = useState(0);
  useEffect(() => { const t = [setTimeout(() => setPhase(1), 800)]; return () => t.forEach(clearTimeout); }, []);
  const parentCode = `class Father {
public:
    void money() {
        cout << "Father's money";
    }
};

class Mother {
public:
    void house() {
        cout << "Mother's house";
    }
};`;
  const childCode = `class Child : public Father,
             public Mother {
    // Gets both!
};`;
  return (
    <div style={containerStyle}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: colors.success, fontWeight: 700, fontSize: "13px", letterSpacing: "1.5px", marginBottom: "1rem" }}>📝 BASIC SYNTAX</motion.div>
      <div style={{ display: "flex", gap: "1.5rem", justifyContent: "center", marginBottom: "1rem" }}>
        <GlassCard style={{ maxWidth: "280px" }}><CodeBlock code={parentCode} fontSize="9px" /></GlassCard>
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: phase >= 1 ? 1 : 0, x: 0 }}>
          <GlassCard glow={colors.success} style={{ maxWidth: "260px" }}><CodeBlock code={childCode} fontSize="9px" /></GlassCard>
        </motion.div>
      </div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 1 ? 1 : 0 }} style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
        <div style={{ padding: "8px 16px", borderRadius: "8px", background: `${colors.primary}15`, fontSize: "11px" }}>
          <span style={{ color: colors.primary }}>Child gets:</span> <span style={{ color: colors.success, fontFamily: "monospace" }}>money()</span>
        </div>
        <div style={{ padding: "8px 16px", borderRadius: "8px", background: `${colors.warning}15`, fontSize: "11px" }}>
          <span style={{ color: colors.warning }}>Child gets:</span> <span style={{ color: colors.success, fontFamily: "monospace" }}>house()</span>
        </div>
      </motion.div>
    </div>
  );
};

// ============================================
// SCENE 4: Inheritance vs Composition
// ============================================
const Scene4 = () => {
  const [phase, setPhase] = useState(0);
  useEffect(() => { const t = [setTimeout(() => setPhase(1), 800)]; return () => t.forEach(clearTimeout); }, []);
  return (
    <div style={containerStyle}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: colors.accent, fontWeight: 700, fontSize: "13px", letterSpacing: "1.5px", marginBottom: "1.5rem" }}>🤔 INHERITANCE VS COMPOSITION</motion.div>
      <div style={{ display: "flex", gap: "2.5rem", justifyContent: "center", marginBottom: "1.5rem" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ padding: "16px 24px", borderRadius: "12px", background: `${colors.success}15`, border: `2px solid ${colors.success}`, marginBottom: "0.5rem" }}>
            <div style={{ color: colors.success, fontWeight: 700, fontSize: "12px" }}>Inheritance</div>
            <div style={{ fontFamily: "monospace", fontSize: "10px", color: colors.textSec }}>Child IS-A Parent</div>
          </div>
          <div style={{ color: colors.textSec, fontSize: "10px" }}>= Identity</div>
        </div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 1 ? 1 : 0 }} style={{ textAlign: "center" }}>
          <div style={{ padding: "16px 24px", borderRadius: "12px", background: `${colors.primary}15`, border: `2px solid ${colors.primary}`, marginBottom: "0.5rem" }}>
            <div style={{ color: colors.primary, fontWeight: 700, fontSize: "12px" }}>Composition</div>
            <div style={{ fontFamily: "monospace", fontSize: "10px", color: colors.textSec }}>Child HAS-A Part</div>
          </div>
          <div style={{ color: colors.textSec, fontSize: "10px" }}>= Parts</div>
        </motion.div>
      </div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 1 ? 1 : 0 }} style={{ padding: "12px 24px", borderRadius: "12px", background: `${colors.warning}15`, border: `1px solid ${colors.warning}`, textAlign: "center" }}>
        <span style={{ color: colors.warning, fontSize: "12px" }}>💡 Rule: Prefer composition over inheritance!</span>
      </motion.div>
    </div>
  );
};

// ============================================
// SCENE 5: The Diamond Is Born
// ============================================
const Scene5 = () => {
  const [phase, setPhase] = useState(0);
  useEffect(() => { const t = [setTimeout(() => setPhase(1), 600), setTimeout(() => setPhase(2), 1200)]; return () => t.forEach(clearTimeout); }, []);
  const code = `class A { public: int x; };

class B : public A {};
class C : public A {};

class D : public B, public C {};`;
  return (
    <div style={containerStyle}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: colors.danger, fontWeight: 700, fontSize: "13px", letterSpacing: "1.5px", marginBottom: "1rem" }}>💎 THE DIAMOND IS BORN</motion.div>
      <div style={{ display: "flex", gap: "2rem", alignItems: "flex-start" }}>
        <GlassCard style={{ maxWidth: "300px" }}><CodeBlock code={code} fontSize="9px" /></GlassCard>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 1 ? 1 : 0 }} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{ padding: "12px 24px", borderRadius: "8px", background: `${colors.primary}15`, border: `2px solid ${colors.primary}`, marginBottom: "0.5rem" }}>
            <span style={{ color: colors.primary, fontWeight: 700 }}>A</span>
          </div>
          <div style={{ display: "flex", gap: "2rem" }}>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 2 ? 1 : 0 }} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div style={{ width: "2px", height: "20px", background: colors.textSec }} />
              <div style={{ padding: "10px 20px", borderRadius: "8px", background: `${colors.success}15`, border: `1px solid ${colors.success}` }}>
                <span style={{ color: colors.success, fontWeight: 600 }}>B</span>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 2 ? 1 : 0 }} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div style={{ width: "2px", height: "20px", background: colors.textSec }} />
              <div style={{ padding: "10px 20px", borderRadius: "8px", background: `${colors.warning}15`, border: `1px solid ${colors.warning}` }}>
                <span style={{ color: colors.warning, fontWeight: 600 }}>C</span>
              </div>
            </motion.div>
          </div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 2 ? 1 : 0 }} style={{ marginTop: "0.5rem" }}>
            <div style={{ width: "2px", height: "20px", background: colors.textSec, margin: "0 auto" }} />
            <div style={{ padding: "12px 24px", borderRadius: "8px", background: `${colors.danger}20`, border: `3px solid ${colors.danger}` }}>
              <span style={{ color: colors.danger, fontWeight: 700 }}>D 💎</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

// ============================================
// SCENE 6: The Ambiguity Explosion
// ============================================
const Scene6 = () => {
  const [phase, setPhase] = useState(0);
  useEffect(() => { const t = [setTimeout(() => setPhase(1), 800)]; return () => t.forEach(clearTimeout); }, []);
  const code = `D obj;
obj.x = 10;  // ❌ ERROR!`;
  return (
    <div style={containerStyle}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: colors.danger, fontWeight: 700, fontSize: "13px", letterSpacing: "1.5px", marginBottom: "1rem" }}>💥 THE AMBIGUITY EXPLOSION</motion.div>
      <div style={{ display: "flex", gap: "2rem", alignItems: "flex-start" }}>
        <GlassCard glow={colors.danger} style={{ maxWidth: "220px" }}><CodeBlock code={code} fontSize="10px" /></GlassCard>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 1 ? 1 : 0 }} style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
          <div style={{ padding: "12px 20px", borderRadius: "12px", background: `${colors.danger}20`, border: `2px solid ${colors.danger}` }}>
            <div style={{ color: colors.danger, fontWeight: 600, fontSize: "11px" }}>❌ Compiler Error:</div>
            <div style={{ fontFamily: "monospace", fontSize: "10px", color: colors.textSec }}>"request for 'x' is ambiguous"</div>
          </div>
          <div style={{ padding: "12px 16px", borderRadius: "10px", background: `${colors.text}10` }}>
            <div style={{ color: colors.textSec, fontSize: "10px", marginBottom: "0.3rem" }}>D object contains:</div>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <div style={{ padding: "4px 8px", borderRadius: "4px", background: `${colors.danger}20`, fontFamily: "monospace", fontSize: "9px", color: colors.danger }}>B→A→x</div>
              <div style={{ padding: "4px 8px", borderRadius: "4px", background: `${colors.danger}20`, fontFamily: "monospace", fontSize: "9px", color: colors.danger }}>C→A→x</div>
            </div>
          </div>
        </motion.div>
      </div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 1 ? 1 : 0 }} style={{ marginTop: "1rem", padding: "10px 24px", borderRadius: "100px", background: `${colors.warning}15`, textAlign: "center" }}>
        <span style={{ color: colors.warning, fontSize: "12px" }}>"Which x do you mean?" 🤷‍♂️</span>
      </motion.div>
    </div>
  );
};

// ============================================
// SCENE 7: Why This Happens (Memory Layout)
// ============================================
const Scene7 = () => {
  const [phase, setPhase] = useState(0);
  useEffect(() => { const t = [setTimeout(() => setPhase(1), 800)]; return () => t.forEach(clearTimeout); }, []);
  return (
    <div style={containerStyle}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: colors.warning, fontWeight: 700, fontSize: "13px", letterSpacing: "1.5px", marginBottom: "1.5rem" }}>🧠 WHY THIS HAPPENS: MEMORY LAYOUT</motion.div>
      <div style={{ display: "flex", justifyContent: "center", marginBottom: "1rem" }}>
        <div style={{ padding: "16px", borderRadius: "12px", background: `${colors.text}10`, border: `1px solid ${colors.text}30` }}>
          <div style={{ color: colors.textSec, fontSize: "10px", marginBottom: "0.5rem" }}>Object D in memory:</div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
            <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
              <span style={{ color: colors.success }}>├─</span>
              <span style={{ padding: "4px 12px", borderRadius: "4px", background: `${colors.success}20`, fontFamily: "monospace", fontSize: "10px", color: colors.success }}>B part</span>
              <span style={{ color: colors.textSec }}>→</span>
              <span style={{ padding: "4px 8px", borderRadius: "4px", background: `${colors.danger}20`, fontFamily: "monospace", fontSize: "10px", color: colors.danger }}>A → x</span>
            </div>
            <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
              <span style={{ color: colors.warning }}>└─</span>
              <span style={{ padding: "4px 12px", borderRadius: "4px", background: `${colors.warning}20`, fontFamily: "monospace", fontSize: "10px", color: colors.warning }}>C part</span>
              <span style={{ color: colors.textSec }}>→</span>
              <span style={{ padding: "4px 8px", borderRadius: "4px", background: `${colors.danger}20`, fontFamily: "monospace", fontSize: "10px", color: colors.danger }}>A → x</span>
            </div>
          </div>
        </div>
      </div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 1 ? 1 : 0 }} style={{ padding: "14px 28px", borderRadius: "12px", background: `${colors.danger}15`, border: `2px solid ${colors.danger}`, textAlign: "center" }}>
        <span style={{ color: colors.danger, fontWeight: 700, fontSize: "13px" }}>A is DUPLICATED. That's the real problem!</span>
      </motion.div>
    </div>
  );
};

// ============================================
// SCENE 8: The One-Word Cure: virtual Base Class
// ============================================
const Scene8 = () => {
  const [phase, setPhase] = useState(0);
  useEffect(() => { const t = [setTimeout(() => setPhase(1), 800)]; return () => t.forEach(clearTimeout); }, []);
  const code = `class B : virtual public A {};
class C : virtual public A {};
class D : public B, public C {};

// Now only ONE copy of A!`;
  return (
    <div style={containerStyle}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: colors.success, fontWeight: 700, fontSize: "13px", letterSpacing: "1.5px", marginBottom: "1rem" }}>✨ THE ONE-WORD CURE: virtual BASE CLASS</motion.div>
      <div style={{ display: "flex", gap: "2rem", alignItems: "flex-start" }}>
        <GlassCard glow={colors.virtualColor} style={{ maxWidth: "320px" }}><CodeBlock code={code} fontSize="9px" /></GlassCard>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 1 ? 1 : 0 }} style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
          <div style={{ padding: "12px 20px", borderRadius: "12px", background: `${colors.virtualColor}20`, border: `2px solid ${colors.virtualColor}` }}>
            <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 1, repeat: Infinity }} style={{ color: colors.virtualColor, fontWeight: 700, fontFamily: "monospace" }}>virtual ✨</motion.div>
          </div>
          <div style={{ padding: "12px 16px", borderRadius: "10px", background: `${colors.success}15`, border: `1px solid ${colors.success}` }}>
            <div style={{ color: colors.success, fontSize: "11px" }}>✓ A is now SHARED</div>
            <div style={{ color: colors.success, fontSize: "11px" }}>✓ Only ONE copy of x</div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

// ============================================
// SCENE 9: Important Clarification: virtual ≠ virtual
// ============================================
const Scene9 = () => {
  const [phase, setPhase] = useState(0);
  useEffect(() => { const t = [setTimeout(() => setPhase(1), 800)]; return () => t.forEach(clearTimeout); }, []);
  return (
    <div style={containerStyle}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: colors.accent, fontWeight: 700, fontSize: "13px", letterSpacing: "1.5px", marginBottom: "1.5rem" }}>⚠️ CLARIFICATION: virtual ≠ virtual</motion.div>
      <div style={{ display: "flex", gap: "2rem", justifyContent: "center" }}>
        <div style={{ padding: "20px", borderRadius: "16px", background: `${colors.virtualColor}15`, border: `2px solid ${colors.virtualColor}`, textAlign: "center", width: "180px" }}>
          <div style={{ fontFamily: "monospace", color: colors.virtualColor, fontWeight: 700, fontSize: "12px" }}>virtual function</div>
          <div style={{ color: colors.textSec, fontSize: "10px", marginTop: "0.5rem" }}>→ Runtime behavior</div>
          <div style={{ color: colors.textSec, fontSize: "10px" }}>→ Polymorphism</div>
        </div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 1 ? 1 : 0 }} style={{ padding: "20px", borderRadius: "16px", background: `${colors.success}15`, border: `2px solid ${colors.success}`, textAlign: "center", width: "180px" }}>
          <div style={{ fontFamily: "monospace", color: colors.success, fontWeight: 700, fontSize: "12px" }}>virtual base class</div>
          <div style={{ color: colors.textSec, fontSize: "10px", marginTop: "0.5rem" }}>→ Memory layout</div>
          <div style={{ color: colors.textSec, fontSize: "10px" }}>→ Structure</div>
        </motion.div>
      </div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 1 ? 1 : 0 }} style={{ marginTop: "1.5rem", padding: "10px 24px", borderRadius: "100px", background: `${colors.warning}15`, textAlign: "center" }}>
        <span style={{ color: colors.warning, fontSize: "12px" }}>"Same keyword. Totally different meanings!"</span>
      </motion.div>
    </div>
  );
};

// ============================================
// SCENE 10: When SHOULD You Use It?
// ============================================
const Scene10 = () => {
  const [phase, setPhase] = useState(0);
  useEffect(() => { const t = [setTimeout(() => setPhase(1), 600), setTimeout(() => setPhase(2), 1200)]; return () => t.forEach(clearTimeout); }, []);
  return (
    <div style={containerStyle}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: colors.success, fontWeight: 700, fontSize: "13px", letterSpacing: "1.5px", marginBottom: "1rem" }}>✅ WHEN SHOULD YOU USE IT?</motion.div>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} style={{ padding: "12px 16px", borderRadius: "10px", background: `${colors.success}15`, border: `1px solid ${colors.success}` }}>
          <div style={{ color: colors.success, fontWeight: 600, fontSize: "11px" }}>✓ True IS-A multiple identity:</div>
          <div style={{ fontFamily: "monospace", fontSize: "10px", color: colors.textSec }}>Amphibious : LandVehicle, WaterVehicle</div>
        </motion.div>
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: phase >= 1 ? 1 : 0, x: 0 }} style={{ padding: "12px 16px", borderRadius: "10px", background: `${colors.primary}15`, border: `1px solid ${colors.primary}` }}>
          <div style={{ color: colors.primary, fontWeight: 600, fontSize: "11px" }}>✓ Interfaces (no data = no diamond):</div>
          <div style={{ fontFamily: "monospace", fontSize: "10px", color: colors.textSec }}>Smartphone : ICallable, IInternet, ICamera</div>
        </motion.div>
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: phase >= 2 ? 1 : 0, x: 0 }} style={{ padding: "12px 16px", borderRadius: "10px", background: `${colors.danger}15`, border: `1px solid ${colors.danger}` }}>
          <div style={{ color: colors.danger, fontWeight: 600, fontSize: "11px" }}>❌ HAS-A relationships:</div>
          <div style={{ fontFamily: "monospace", fontSize: "10px", color: colors.textSec }}>Car : Engine, GPS → Use composition!</div>
        </motion.div>
      </div>
    </div>
  );
};

// ============================================
// SCENE 11: The Design Philosophy
// ============================================
const Scene11 = () => {
  const [phase, setPhase] = useState(0);
  useEffect(() => { const t = [setTimeout(() => setPhase(1), 800), setTimeout(() => setPhase(2), 1600)]; return () => t.forEach(clearTimeout); }, []);
  return (
    <div style={{ ...containerStyle, background: "linear-gradient(135deg, #1a1a2e 0%, #0f0f1a 100%)" }}>
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: "center", marginBottom: "1.5rem" }}>
        <div style={{ color: colors.textSec, fontSize: "12px" }}>"The real question is not:</div>
        <div style={{ color: colors.text, fontSize: "14px", fontWeight: 600 }}>Can I use inheritance?"</div>
      </motion.div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 1 ? 1 : 0 }} style={{ textAlign: "center", marginBottom: "2rem" }}>
        <div style={{ color: colors.textSec, fontSize: "12px" }}>"The real question is:</div>
        <div style={{ color: colors.accent, fontSize: "1.3rem", fontWeight: 700 }}>SHOULD I?"</div>
      </motion.div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 1 ? 1 : 0 }} style={{ display: "flex", gap: "2rem", justifyContent: "center", marginBottom: "1.5rem" }}>
        <div style={{ padding: "14px 24px", borderRadius: "12px", background: `${colors.success}15`, border: `2px solid ${colors.success}`, textAlign: "center" }}>
          <div style={{ color: colors.success, fontWeight: 700, fontSize: "12px" }}>IS-A</div>
        </div>
        <div style={{ fontSize: "1.3rem" }}>vs</div>
        <div style={{ padding: "14px 24px", borderRadius: "12px", background: `${colors.primary}15`, border: `2px solid ${colors.primary}`, textAlign: "center" }}>
          <div style={{ color: colors.primary, fontWeight: 700, fontSize: "12px" }}>HAS-A</div>
        </div>
      </motion.div>
      <AnimatePresence>{phase >= 2 && <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ padding: "12px 28px", borderRadius: "100px", background: `${colors.virtualColor}20`, border: `1px solid ${colors.virtualColor}`, textAlign: "center" }}>
        <span style={{ color: colors.virtualColor, fontSize: "11px" }}>Use virtual inheritance to ensure a single shared instance of a common base class</span>
      </motion.div>}</AnimatePresence>
    </div>
  );
};

// Export all scenes
export const MultipleInheritanceScenes = [
  { title: "The Dangerous Power Tool", component: Scene1, contentText: "Multiple Inheritance: Powerful, Useful, Dangerous. One class, multiple parents!" },
  { title: "Why It Exists", component: Scene2, contentText: "TeachingAssistant IS-A Student AND IS-A Teacher. Some things belong to multiple categories." },
  { title: "Basic Syntax", component: Scene3, contentText: "class Child : public Father, public Mother. Child gets money() and house()!" },
  { title: "Inheritance vs Composition", component: Scene4, contentText: "Inheritance = IS-A (identity). Composition = HAS-A (parts). Prefer composition!" },
  { title: "The Diamond Problem", component: Scene5, contentText: "A→B, A→C, D inherits B and C. Diamond shape forms. Problem incoming!" },
  { title: "Ambiguity Explosion", component: Scene6, contentText: "obj.x is ambiguous! D has TWO copies of A, TWO x variables. Which one?" },
  { title: "Memory Layout", component: Scene7, contentText: "D contains: B→A→x AND C→A→x. A is DUPLICATED. That's the real problem!" },
  { title: "virtual Base Class", component: Scene8, contentText: "class B : virtual public A. Now A is SHARED. Only ONE copy of x!" },
  { title: "virtual ≠ virtual", component: Scene9, contentText: "virtual function = runtime polymorphism. virtual base = memory layout. Different meanings!" },
  { title: "When To Use", component: Scene10, contentText: "✓ True IS-A multiple. ✓ Interfaces (no data). ❌ HAS-A = use composition!" },
  { title: "Design Philosophy", component: Scene11, contentText: "Not 'Can I?' but 'SHOULD I?' IS-A vs HAS-A. Use virtual for shared base." },
];
