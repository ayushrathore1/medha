/**
 * RuntimePolymorphismLecture.jsx - All 13 Scenes
 * Function Overriding & Runtime Polymorphism
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
  const keywords = ['int', 'void', 'class', 'public', 'private', 'virtual', 'override', 'cout', 'for', 'if'];
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
// SCENE 1: What Is Runtime Polymorphism?
// ============================================
const Scene1 = () => {
  const [phase, setPhase] = useState(0);
  useEffect(() => { const t = [setTimeout(() => setPhase(1), 600), setTimeout(() => setPhase(2), 1200)]; return () => t.forEach(clearTimeout); }, []);
  return (
    <div style={{ ...containerStyle, background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #1a1a2e 100%)" }}>
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: "center", marginBottom: "1.5rem" }}>
        <div style={{ color: colors.accent, fontWeight: 700, fontSize: "12px", letterSpacing: "3px", marginBottom: "0.3rem" }}>RTU OOP DEEP DIVE</div>
        <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} style={{ fontSize: "1.8rem", fontWeight: 700, color: colors.text }}>Runtime Polymorphism in C++</motion.div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 1 ? 1 : 0 }} style={{ color: colors.virtualColor, fontSize: "13px", marginTop: "0.3rem" }}>Virtual Functions & Function Overriding</motion.div>
      </motion.div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 1 ? 1 : 0 }} style={{ display: "flex", gap: "1rem", justifyContent: "center", marginBottom: "1.5rem" }}>
        {["Many", "Forms"].map((w, i) => (
          <motion.div key={i} animate={{ x: phase >= 2 ? (i === 0 ? 30 : -30) : 0 }} style={{ padding: "10px 20px", borderRadius: "12px", background: `${colors.virtualColor}20`, border: `2px solid ${colors.virtualColor}`, fontWeight: 700, color: colors.virtualColor }}>{w}</motion.div>
        ))}
      </motion.div>
      <AnimatePresence>{phase >= 2 && <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} style={{ padding: "14px 32px", borderRadius: "16px", background: `${colors.accent}20`, border: `2px solid ${colors.accent}`, textAlign: "center" }}>
        <span style={{ color: colors.accent, fontWeight: 700, fontSize: "1.2rem" }}>POLYMORPHISM</span>
        <div style={{ color: colors.textSec, fontSize: "12px", marginTop: "0.3rem" }}>"One interface. Many behaviors."</div>
      </motion.div>}</AnimatePresence>
    </div>
  );
};

// ============================================
// SCENE 2: The Problem Setup (Animal Example)
// ============================================
const Scene2 = () => {
  const [phase, setPhase] = useState(0);
  useEffect(() => { const t = [setTimeout(() => setPhase(1), 800)]; return () => t.forEach(clearTimeout); }, []);
  const animalCode = `class Animal {
public:
    void speak() {
        cout << "Animal makes sound";
    }
};`;
  const dogCode = `class Dog : public Animal {
public:
    void speak() {
        cout << "Dog barks";
    }
};`;
  return (
    <div style={containerStyle}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: colors.primary, fontWeight: 700, fontSize: "13px", letterSpacing: "1.5px", marginBottom: "1rem" }}>🐾 THE PROBLEM SETUP: ANIMAL EXAMPLE</motion.div>
      <div style={{ display: "flex", gap: "1.5rem", justifyContent: "center", marginBottom: "1rem" }}>
        <div>
          <div style={{ color: colors.primary, fontSize: "10px", fontWeight: 600, marginBottom: "0.3rem" }}>Base Class</div>
          <GlassCard style={{ maxWidth: "260px" }}><CodeBlock code={animalCode} fontSize="9px" /></GlassCard>
        </div>
        <motion.div initial={{ x: 30, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
          <div style={{ color: colors.success, fontSize: "10px", fontWeight: 600, marginBottom: "0.3rem" }}>Derived Class</div>
          <GlassCard glow={colors.success} style={{ maxWidth: "280px" }}><CodeBlock code={dogCode} fontSize="9px" /></GlassCard>
        </motion.div>
      </div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 1 ? 1 : 0 }} style={{ padding: "10px 24px", borderRadius: "100px", background: `${colors.virtualColor}15`, textAlign: "center" }}>
        <span style={{ color: colors.virtualColor, fontWeight: 600, fontSize: "12px" }}>Function Overriding = Child provides its own version</span>
      </motion.div>
    </div>
  );
};

// ============================================
// SCENE 3: The Confusing Behavior (The Bug)
// ============================================
const Scene3 = () => {
  const [phase, setPhase] = useState(0);
  useEffect(() => { const t = [setTimeout(() => setPhase(1), 600), setTimeout(() => setPhase(2), 1200)]; return () => t.forEach(clearTimeout); }, []);
  const code = `Animal* a;
Dog d;
a = &d;
a->speak();  // What prints?`;
  return (
    <div style={containerStyle}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: colors.danger, fontWeight: 700, fontSize: "13px", letterSpacing: "1.5px", marginBottom: "1.5rem" }}>🐛 THE CONFUSING BEHAVIOR</motion.div>
      <div style={{ display: "flex", gap: "2rem", alignItems: "flex-start" }}>
        <GlassCard style={{ maxWidth: "280px" }}><CodeBlock code={code} fontSize="10px" /></GlassCard>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: phase >= 1 ? 1 : 0, x: 0 }} style={{ padding: "12px 20px", borderRadius: "12px", background: `${colors.success}15`, border: `1px solid ${colors.success}` }}>
            <div style={{ color: colors.success, fontWeight: 600, fontSize: "11px" }}>Expected:</div>
            <div style={{ fontFamily: "monospace", color: colors.success, fontSize: "12px" }}>"Dog barks"</div>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: phase >= 2 ? 1 : 0, x: 0 }} style={{ padding: "12px 20px", borderRadius: "12px", background: `${colors.danger}15`, border: `2px solid ${colors.danger}` }}>
            <div style={{ color: colors.danger, fontWeight: 600, fontSize: "11px" }}>Actual Output:</div>
            <div style={{ fontFamily: "monospace", color: colors.danger, fontSize: "12px" }}>"Animal makes sound" ❌</div>
          </motion.div>
        </div>
      </div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 2 ? 1 : 0 }} style={{ marginTop: "1rem", padding: "10px 20px", borderRadius: "100px", background: `${colors.warning}15`, textAlign: "center" }}>
        <span style={{ color: colors.warning, fontSize: "12px" }}>Why does this happen? 🤔</span>
      </motion.div>
    </div>
  );
};

// ============================================
// SCENE 4: Static Binding Explained
// ============================================
const Scene4 = () => {
  const [phase, setPhase] = useState(0);
  useEffect(() => { const t = [setTimeout(() => setPhase(1), 800)]; return () => t.forEach(clearTimeout); }, []);
  return (
    <div style={containerStyle}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: colors.warning, fontWeight: 700, fontSize: "13px", letterSpacing: "1.5px", marginBottom: "1.5rem" }}>⚡ STATIC BINDING EXPLAINED</motion.div>
      <div style={{ display: "flex", gap: "2rem", alignItems: "center", justifyContent: "center", marginBottom: "1.5rem" }}>
        <div style={{ padding: "16px 24px", borderRadius: "12px", background: `${colors.primary}15`, border: `2px solid ${colors.primary}`, textAlign: "center" }}>
          <div style={{ fontFamily: "monospace", color: colors.primary, fontWeight: 600 }}>Animal* a</div>
          <div style={{ color: colors.textSec, fontSize: "10px" }}>Pointer type</div>
        </div>
        <motion.div animate={{ x: [0, 10, 0] }} transition={{ duration: 1, repeat: Infinity }} style={{ fontSize: "1.5rem" }}>➡️</motion.div>
        <div style={{ padding: "16px 24px", borderRadius: "12px", background: `${colors.success}15`, border: `2px solid ${colors.success}`, textAlign: "center" }}>
          <div style={{ fontFamily: "monospace", color: colors.success, fontWeight: 600 }}>Dog Object</div>
          <div style={{ color: colors.textSec, fontSize: "10px" }}>Actual object</div>
        </div>
      </div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 1 ? 1 : 0 }} style={{ padding: "14px 24px", borderRadius: "12px", background: `${colors.danger}15`, border: `2px solid ${colors.danger}`, textAlign: "center" }}>
        <div style={{ color: colors.danger, fontWeight: 600, fontSize: "12px" }}>⚙️ Compiler only sees: Animal*</div>
        <div style={{ color: colors.textSec, fontSize: "11px", marginTop: "0.3rem" }}>Decision made by pointer TYPE, not object TYPE!</div>
      </motion.div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 1 ? 1 : 0 }} style={{ marginTop: "1rem", textAlign: "center" }}>
        <span style={{ color: colors.warning, fontSize: "12px" }}>C++ by default uses <span style={{ fontWeight: 700 }}>STATIC (compile-time)</span> binding</span>
      </motion.div>
    </div>
  );
};

// ============================================
// SCENE 5: The One-Word Fix: virtual
// ============================================
const Scene5 = () => {
  const [phase, setPhase] = useState(0);
  useEffect(() => { const t = [setTimeout(() => setPhase(1), 800)]; return () => t.forEach(clearTimeout); }, []);
  const animalCode = `class Animal {
public:
    virtual void speak() {
        cout << "Animal makes sound";
    }
};`;
  return (
    <div style={containerStyle}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: colors.success, fontWeight: 700, fontSize: "13px", letterSpacing: "1.5px", marginBottom: "1rem" }}>✨ THE ONE-WORD FIX: virtual</motion.div>
      <div style={{ display: "flex", gap: "2rem", alignItems: "flex-start" }}>
        <GlassCard glow={colors.virtualColor} style={{ maxWidth: "300px" }}><CodeBlock code={animalCode} fontSize="10px" /></GlassCard>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 1 ? 1 : 0 }} style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
          <div style={{ padding: "12px 20px", borderRadius: "12px", background: `${colors.virtualColor}20`, border: `2px solid ${colors.virtualColor}` }}>
            <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 1, repeat: Infinity }} style={{ color: colors.virtualColor, fontWeight: 700, fontSize: "1.2rem", fontFamily: "monospace" }}>virtual ✨</motion.div>
          </div>
          <div style={{ padding: "10px 16px", borderRadius: "10px", background: `${colors.success}15`, border: `1px solid ${colors.success}` }}>
            <div style={{ color: colors.success, fontSize: "11px" }}>🔓 Compile-time lock BROKEN</div>
          </div>
          <div style={{ padding: "10px 16px", borderRadius: "10px", background: `${colors.accent}15`, border: `1px solid ${colors.accent}` }}>
            <div style={{ color: colors.accent, fontSize: "11px" }}>🎯 Dynamic Binding ENABLED</div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

// ============================================
// SCENE 6: Now What Happens At Runtime?
// ============================================
const Scene6 = () => {
  const [phase, setPhase] = useState(0);
  useEffect(() => { const t = [setTimeout(() => setPhase(1), 600), setTimeout(() => setPhase(2), 1200)]; return () => t.forEach(clearTimeout); }, []);
  const code = `Animal* a = &d;
a->speak();  // Now works!`;
  return (
    <div style={containerStyle}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: colors.success, fontWeight: 700, fontSize: "13px", letterSpacing: "1.5px", marginBottom: "1.5rem" }}>🎯 NOW WHAT HAPPENS AT RUNTIME?</motion.div>
      <div style={{ display: "flex", gap: "2rem", alignItems: "center", justifyContent: "center", marginBottom: "1.5rem" }}>
        <GlassCard style={{ maxWidth: "260px" }}><CodeBlock code={code} fontSize="10px" /></GlassCard>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 1 ? 1 : 0 }} style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          {["Follow pointer to object", "Find Dog object", "Call Dog::speak()"].map((s, i) => (
            <motion.div key={i} initial={{ x: 20 }} animate={{ x: 0 }} transition={{ delay: i * 0.15 }} style={{ padding: "8px 16px", borderRadius: "8px", background: `${colors.success}15`, display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span style={{ width: "20px", height: "20px", borderRadius: "50%", background: colors.success, color: "#000", fontWeight: 700, fontSize: "10px", display: "flex", alignItems: "center", justifyContent: "center" }}>{i + 1}</span>
              <span style={{ fontSize: "10px", color: colors.textSec }}>{s}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
      <AnimatePresence>{phase >= 2 && <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} style={{ padding: "14px 28px", borderRadius: "16px", background: `${colors.success}20`, border: `3px solid ${colors.success}`, textAlign: "center" }}>
        <div style={{ fontFamily: "monospace", color: colors.success, fontSize: "14px" }}>"Dog barks" ✅</div>
        <div style={{ color: colors.accent, fontWeight: 700, fontSize: "13px", marginTop: "0.3rem" }}>This is RUNTIME POLYMORPHISM!</div>
      </motion.div>}</AnimatePresence>
    </div>
  );
};

// ============================================
// SCENE 7: Real World Example - Game Engine
// ============================================
const Scene7 = () => {
  const [phase, setPhase] = useState(0);
  useEffect(() => { const t = [setTimeout(() => setPhase(1), 800)]; return () => t.forEach(clearTimeout); }, []);
  const code = `class GameObject {
public:
    virtual void update();
};

// Game loop
for(auto obj : objects)
    obj->update();`;
  const objects = [
    { icon: "🎮", name: "Player", behavior: "Input control" },
    { icon: "👾", name: "Enemy", behavior: "AI movement" },
    { icon: "💥", name: "Bullet", behavior: "Move forward" },
    { icon: "⭐", name: "PowerUp", behavior: "Float & spin" },
  ];
  return (
    <div style={containerStyle}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: colors.accent, fontWeight: 700, fontSize: "13px", letterSpacing: "1.5px", marginBottom: "1rem" }}>🎮 REAL WORLD: GAME ENGINE</motion.div>
      <div style={{ display: "flex", gap: "2rem", alignItems: "flex-start" }}>
        <GlassCard style={{ maxWidth: "280px" }}><CodeBlock code={code} fontSize="9px" /></GlassCard>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 1 ? 1 : 0 }} style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          {objects.map((o, i) => (
            <motion.div key={i} animate={{ x: [0, 5, 0] }} transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }} style={{ padding: "8px 14px", borderRadius: "8px", background: `${colors.primary}15`, display: "flex", alignItems: "center", gap: "0.8rem" }}>
              <span style={{ fontSize: "1.3rem" }}>{o.icon}</span>
              <div>
                <div style={{ color: colors.primary, fontWeight: 600, fontSize: "11px" }}>{o.name}</div>
                <div style={{ color: colors.textSec, fontSize: "9px" }}>{o.behavior}</div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 1 ? 1 : 0 }} style={{ marginTop: "1rem", padding: "10px 24px", borderRadius: "100px", background: `${colors.accent}15`, textAlign: "center" }}>
        <span style={{ color: colors.accent, fontSize: "12px" }}>"Same call. Different behavior."</span>
      </motion.div>
    </div>
  );
};

// ============================================
// SCENE 8: Shape Example (Extensibility)
// ============================================
const Scene8 = () => {
  const [phase, setPhase] = useState(0);
  useEffect(() => { const t = [setTimeout(() => setPhase(1), 800)]; return () => t.forEach(clearTimeout); }, []);
  const code = `void drawAll(Shape* shapes[], int n) {
    for(int i=0; i<n; i++)
        shapes[i]->draw();
}

// Add Triangle later...
// drawAll() unchanged! ✅`;
  return (
    <div style={containerStyle}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: colors.success, fontWeight: 700, fontSize: "13px", letterSpacing: "1.5px", marginBottom: "1rem" }}>🔷 SHAPE EXAMPLE: EXTENSIBILITY</motion.div>
      <div style={{ display: "flex", gap: "2rem", alignItems: "flex-start" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          {["⚪ Circle", "🟦 Rectangle", "🔺 Triangle"].map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: i <= 1 || phase >= 1 ? 1 : 0.3, x: 0 }} transition={{ delay: i * 0.15 }} style={{ padding: "10px 16px", borderRadius: "10px", background: i === 2 && phase >= 1 ? `${colors.success}20` : `${colors.text}10`, border: `1px solid ${i === 2 && phase >= 1 ? colors.success : colors.text}30`, fontSize: "12px", color: i === 2 && phase >= 1 ? colors.success : colors.text }}>
              {s} {i === 2 && phase >= 1 && <span style={{ color: colors.success }}>NEW!</span>}
            </motion.div>
          ))}
        </div>
        <GlassCard style={{ maxWidth: "320px" }}><CodeBlock code={code} fontSize="9px" /></GlassCard>
      </div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 1 ? 1 : 0 }} style={{ marginTop: "1rem", padding: "10px 24px", borderRadius: "100px", background: `${colors.success}15`, textAlign: "center" }}>
        <span style={{ color: colors.success, fontSize: "12px" }}>"Open for extension. Closed for modification." (OCP)</span>
      </motion.div>
    </div>
  );
};

// ============================================
// SCENE 9: The 3 Golden Rules
// ============================================
const Scene9 = () => {
  const [phase, setPhase] = useState(0);
  useEffect(() => { const t = [setTimeout(() => setPhase(1), 500), setTimeout(() => setPhase(2), 1000), setTimeout(() => setPhase(3), 1500)]; return () => t.forEach(clearTimeout); }, []);
  const rules = [
    "Base function must be virtual",
    "Call via base pointer/reference",
    "Signature must match exactly",
  ];
  return (
    <div style={containerStyle}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: colors.warning, fontWeight: 700, fontSize: "13px", letterSpacing: "1.5px", marginBottom: "1.5rem" }}>📜 THE 3 GOLDEN RULES</motion.div>
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem", maxWidth: "400px", margin: "0 auto" }}>
        {rules.map((r, i) => (
          <motion.div key={i} initial={{ opacity: 0, x: -30 }} animate={{ opacity: phase > i ? 1 : 0, x: 0 }} style={{ padding: "14px 20px", borderRadius: "12px", background: `${colors.warning}15`, border: `2px solid ${colors.warning}`, display: "flex", alignItems: "center", gap: "1rem" }}>
            <span style={{ width: "28px", height: "28px", borderRadius: "50%", background: colors.warning, color: "#000", fontWeight: 700, fontSize: "12px", display: "flex", alignItems: "center", justifyContent: "center" }}>{i + 1}</span>
            <span style={{ color: colors.text, fontSize: "12px" }}>{r}</span>
            <motion.span initial={{ scale: 0 }} animate={{ scale: phase > i ? 1 : 0 }} style={{ marginLeft: "auto", color: colors.success, fontSize: "1.2rem" }}>✅</motion.span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// ============================================
// SCENE 10: The override Keyword (Safety Net)
// ============================================
const Scene10 = () => {
  const [phase, setPhase] = useState(0);
  useEffect(() => { const t = [setTimeout(() => setPhase(1), 800)]; return () => t.forEach(clearTimeout); }, []);
  const goodCode = `class Dog : public Animal {
public:
    void speak() override;  // ✓
};`;
  const badCode = `class Dog : public Animal {
public:
    void speek() override;  // typo!
};`;
  return (
    <div style={containerStyle}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: colors.virtualColor, fontWeight: 700, fontSize: "13px", letterSpacing: "1.5px", marginBottom: "1rem" }}>🛡️ THE override KEYWORD (SAFETY NET)</motion.div>
      <div style={{ display: "flex", gap: "1.5rem", justifyContent: "center" }}>
        <div>
          <div style={{ color: colors.success, fontSize: "10px", fontWeight: 600, marginBottom: "0.3rem" }}>✓ Correct:</div>
          <GlassCard glow={colors.success} style={{ maxWidth: "280px" }}><CodeBlock code={goodCode} fontSize="9px" /></GlassCard>
        </div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 1 ? 1 : 0 }}>
          <div style={{ color: colors.danger, fontSize: "10px", fontWeight: 600, marginBottom: "0.3rem" }}>✗ Typo:</div>
          <GlassCard glow={colors.danger} style={{ maxWidth: "280px" }}><CodeBlock code={badCode} fontSize="9px" /></GlassCard>
        </motion.div>
      </div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 1 ? 1 : 0 }} style={{ marginTop: "1rem", padding: "12px 20px", borderRadius: "12px", background: `${colors.danger}15`, border: `2px solid ${colors.danger}`, textAlign: "center" }}>
        <span style={{ color: colors.danger, fontSize: "11px" }}>❌ "Marked override, but does not override any base function"</span>
      </motion.div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 1 ? 1 : 0 }} style={{ marginTop: "0.8rem", textAlign: "center" }}>
        <span style={{ color: colors.virtualColor, fontSize: "12px" }}>override = Bug prevention system! 🛡️</span>
      </motion.div>
    </div>
  );
};

// ============================================
// SCENE 11: Under The Hood - vtable & vptr
// ============================================
const Scene11 = () => {
  const [phase, setPhase] = useState(0);
  useEffect(() => { const t = [setTimeout(() => setPhase(1), 600), setTimeout(() => setPhase(2), 1200)]; return () => t.forEach(clearTimeout); }, []);
  return (
    <div style={containerStyle}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: colors.accent, fontWeight: 700, fontSize: "13px", letterSpacing: "1.5px", marginBottom: "1.5rem" }}>🔧 UNDER THE HOOD: vtable & vptr</motion.div>
      <div style={{ display: "flex", gap: "2rem", justifyContent: "center", marginBottom: "1rem" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ color: colors.textSec, fontSize: "10px", marginBottom: "0.3rem" }}>Animal vtable</div>
          <div style={{ padding: "10px 16px", borderRadius: "8px", background: `${colors.primary}15`, border: `1px solid ${colors.primary}`, fontFamily: "monospace", fontSize: "9px", color: colors.primary }}>speak → Animal::speak</div>
        </div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 1 ? 1 : 0 }} style={{ textAlign: "center" }}>
          <div style={{ color: colors.textSec, fontSize: "10px", marginBottom: "0.3rem" }}>Dog vtable</div>
          <div style={{ padding: "10px 16px", borderRadius: "8px", background: `${colors.success}15`, border: `1px solid ${colors.success}`, fontFamily: "monospace", fontSize: "9px", color: colors.success }}>speak → Dog::speak</div>
        </motion.div>
      </div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 2 ? 1 : 0 }} style={{ display: "flex", justifyContent: "center", marginBottom: "1rem" }}>
        <div style={{ display: "flex", borderRadius: "8px", overflow: "hidden", border: `2px solid ${colors.accent}` }}>
          <div style={{ padding: "10px 16px", background: `${colors.virtualColor}20`, fontSize: "10px", color: colors.virtualColor, fontWeight: 600 }}>vptr</div>
          <div style={{ padding: "10px 16px", background: `${colors.primary}15`, fontSize: "10px", color: colors.textSec }}>Animal data</div>
          <div style={{ padding: "10px 16px", background: `${colors.success}15`, fontSize: "10px", color: colors.textSec }}>Dog data</div>
        </div>
      </motion.div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 2 ? 1 : 0 }} style={{ display: "flex", gap: "0.5rem", justifyContent: "center", flexWrap: "wrap" }}>
        {["a→object", "read vptr", "find vtable", "lookup speak", "call Dog::speak"].map((s, i) => (
          <motion.div key={i} animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }} style={{ padding: "6px 10px", borderRadius: "6px", background: `${colors.accent}15`, fontSize: "9px", color: colors.accent }}>
            {i + 1}. {s}
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

// ============================================
// SCENE 12: Performance Cost
// ============================================
const Scene12 = () => {
  const [phase, setPhase] = useState(0);
  useEffect(() => { const t = [setTimeout(() => setPhase(1), 800)]; return () => t.forEach(clearTimeout); }, []);
  return (
    <div style={containerStyle}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: colors.warning, fontWeight: 700, fontSize: "13px", letterSpacing: "1.5px", marginBottom: "1.5rem" }}>⚡ PERFORMANCE COST</motion.div>
      <div style={{ display: "flex", gap: "2rem", justifyContent: "center", marginBottom: "1.5rem" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ color: colors.success, fontSize: "11px", fontWeight: 600, marginBottom: "0.5rem" }}>Normal Call</div>
          <div style={{ padding: "12px 20px", borderRadius: "10px", background: `${colors.success}15`, border: `1px solid ${colors.success}` }}>
            <span style={{ fontFamily: "monospace", fontSize: "10px", color: colors.success }}>➜ Direct jump</span>
          </div>
        </div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 1 ? 1 : 0 }} style={{ textAlign: "center" }}>
          <div style={{ color: colors.warning, fontSize: "11px", fontWeight: 600, marginBottom: "0.5rem" }}>Virtual Call</div>
          <div style={{ padding: "12px 20px", borderRadius: "10px", background: `${colors.warning}15`, border: `1px solid ${colors.warning}` }}>
            <span style={{ fontFamily: "monospace", fontSize: "10px", color: colors.warning }}>➜ vptr ➜ vtable ➜ fn</span>
          </div>
        </motion.div>
      </div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 1 ? 1 : 0 }} style={{ padding: "14px 28px", borderRadius: "12px", background: `${colors.text}10`, textAlign: "center" }}>
        <div style={{ color: colors.textSec, fontSize: "12px" }}>"A few extra memory reads"</div>
        <div style={{ color: colors.textSec, fontSize: "11px", marginTop: "0.3rem" }}>Usually negligible. <span style={{ color: colors.warning }}>Sometimes critical.</span></div>
      </motion.div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 1 ? 1 : 0 }} style={{ marginTop: "1rem", textAlign: "center" }}>
        <span style={{ color: colors.accent, fontSize: "12px" }}>"Where is flexibility worth the cost?"</span>
      </motion.div>
    </div>
  );
};

// ============================================
// SCENE 13: The Architect's View
// ============================================
const Scene13 = () => {
  const [phase, setPhase] = useState(0);
  useEffect(() => { const t = [setTimeout(() => setPhase(1), 1000)]; return () => t.forEach(clearTimeout); }, []);
  return (
    <div style={{ ...containerStyle, background: "linear-gradient(135deg, #1a1a2e 0%, #0f0f1a 100%)" }}>
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: "center", marginBottom: "2rem" }}>
        <div style={{ color: colors.accent, fontWeight: 700, fontSize: "1rem", marginBottom: "1rem" }}>"Good programmers know how to use polymorphism."</div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 1 ? 1 : 0 }} style={{ color: colors.virtualColor, fontWeight: 700, fontSize: "1.2rem" }}>"Great architects know when NOT to use it."</motion.div>
      </motion.div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 1 ? 1 : 0 }} style={{ display: "flex", gap: "1.5rem", justifyContent: "center" }}>
        <div style={{ padding: "16px 24px", borderRadius: "12px", background: `${colors.success}15`, border: `2px solid ${colors.success}`, textAlign: "center" }}>
          <div style={{ fontSize: "1.5rem", marginBottom: "0.3rem" }}>🎨</div>
          <div style={{ color: colors.success, fontWeight: 600, fontSize: "11px" }}>Flexibility</div>
        </div>
        <div style={{ fontSize: "1.5rem", display: "flex", alignItems: "center" }}>⚖️</div>
        <div style={{ padding: "16px 24px", borderRadius: "12px", background: `${colors.warning}15`, border: `2px solid ${colors.warning}`, textAlign: "center" }}>
          <div style={{ fontSize: "1.5rem", marginBottom: "0.3rem" }}>⚡</div>
          <div style={{ color: colors.warning, fontWeight: 600, fontSize: "11px" }}>Performance</div>
        </div>
      </motion.div>
    </div>
  );
};

// Export all scenes
export const RuntimePolymorphismScenes = [
  { title: "What Is Runtime Polymorphism?", component: Scene1, contentText: "Polymorphism = Many Forms. One interface, many behaviors. Virtual functions enable this!" },
  { title: "Animal Example", component: Scene2, contentText: "Animal::speak() vs Dog::speak(). Function overriding = child provides its own version." },
  { title: "The Bug", component: Scene3, contentText: "Animal* a = &d; a->speak() prints 'Animal makes sound'. Expected Dog! Bug!" },
  { title: "Static Binding", component: Scene4, contentText: "Compiler only sees Animal*. Decision by pointer TYPE, not object TYPE. Static binding!" },
  { title: "The virtual Fix", component: Scene5, contentText: "Add 'virtual' to base function. Compile-time lock broken. Dynamic binding enabled!" },
  { title: "Runtime Behavior", component: Scene6, contentText: "Now: Follow pointer → Find Dog → Call Dog::speak(). 'Dog barks' ✅ Runtime polymorphism!" },
  { title: "Game Engine Example", component: Scene7, contentText: "GameObject::update(). Player, Enemy, Bullet all update differently. Same call, different behavior!" },
  { title: "Shape Extensibility", component: Scene8, contentText: "drawAll() never changes. Add Triangle later. Open/Closed Principle!" },
  { title: "3 Golden Rules", component: Scene9, contentText: "1) Base virtual 2) Call via pointer/ref 3) Signature match exactly." },
  { title: "override Keyword", component: Scene10, contentText: "override catches typos! 'speek' vs 'speak'. Bug prevention system!" },
  { title: "vtable & vptr", component: Scene11, contentText: "Each class has vtable. Each object has vptr. Runtime lookup: vptr → vtable → function." },
  { title: "Performance Cost", component: Scene12, contentText: "Normal: direct jump. Virtual: vptr → vtable → fn. Usually negligible, sometimes critical." },
  { title: "Architect's View", component: Scene13, contentText: "Good programmers know how. Great architects know when NOT to use it. Balance!" },
];
