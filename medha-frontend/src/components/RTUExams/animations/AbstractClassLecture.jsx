/**
 * AbstractClassLecture.jsx - All 11 Scenes
 * Abstract Class & Pure Virtual Functions
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
  const keywords = ['int', 'float', 'void', 'class', 'public', 'private', 'virtual', 'override', 'string', 'cout', 'new', 'for', 'auto', 'return', 'if', 'else'];
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
// SCENE 1: The Strange Idea
// ============================================
const Scene1 = () => {
  const [phase, setPhase] = useState(0);
  useEffect(() => { const t = [setTimeout(() => setPhase(1), 600), setTimeout(() => setPhase(2), 1200)]; return () => t.forEach(clearTimeout); }, []);
  return (
    <div style={{ ...containerStyle, background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #1a1a2e 100%)" }}>
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: "center", marginBottom: "1.5rem" }}>
        <div style={{ color: colors.accent, fontWeight: 700, fontSize: "12px", letterSpacing: "3px", marginBottom: "0.3rem" }}>RTU OOP DEEP DIVE</div>
        <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} style={{ fontSize: "1.5rem", fontWeight: 700, color: colors.text }}>A class you can't create objects from?</motion.div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 1 ? 1 : 0 }} style={{ color: colors.warning, fontSize: "13px", marginTop: "0.5rem" }}>"Isn't that… pointless?"</motion.div>
      </motion.div>
      <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: phase >= 1 ? 1 : 0, scale: 1 }} style={{ marginBottom: "1.5rem" }}>
        <div style={{ padding: "16px 32px", borderRadius: "16px", background: `${colors.virtualColor}20`, border: `3px solid ${colors.virtualColor}`, textAlign: "center" }}>
          <span style={{ color: colors.virtualColor, fontWeight: 700, fontSize: "1.3rem" }}>Abstract Classes in C++</span>
        </div>
      </motion.div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 2 ? 1 : 0 }} style={{ display: "flex", gap: "2rem", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ padding: "14px 20px", borderRadius: "10px", background: `${colors.success}15`, border: `1px solid ${colors.success}`, marginBottom: "0.3rem" }}>
            <span style={{ color: colors.success, fontSize: "12px" }}>Normal Class</span>
          </div>
          <span style={{ color: colors.textSec, fontSize: "10px" }}>→ Produces objects</span>
        </div>
        <div style={{ textAlign: "center" }}>
          <div style={{ padding: "14px 20px", borderRadius: "10px", background: `${colors.virtualColor}15`, border: `1px solid ${colors.virtualColor}`, marginBottom: "0.3rem" }}>
            <span style={{ color: colors.virtualColor, fontSize: "12px" }}>Abstract Class</span>
          </div>
          <span style={{ color: colors.textSec, fontSize: "10px" }}>→ Produces rules</span>
        </div>
      </motion.div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 2 ? 1 : 0 }} style={{ marginTop: "1rem", textAlign: "center", color: colors.accent, fontSize: "12px" }}>"A blueprint… for other blueprints." 📐</motion.div>
    </div>
  );
};

// ============================================
// SCENE 2: The Shape Problem
// ============================================
const Scene2 = () => {
  const [phase, setPhase] = useState(0);
  useEffect(() => { const t = [setTimeout(() => setPhase(1), 800)]; return () => t.forEach(clearTimeout); }, []);
  return (
    <div style={containerStyle}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: colors.accent, fontWeight: 700, fontSize: "1.3rem", marginBottom: "1.5rem", textAlign: "center" }}>"What is a Shape?"</motion.div>
      <div style={{ display: "flex", gap: "1.5rem", justifyContent: "center", marginBottom: "1.5rem" }}>
        {[{ icon: "⚪", name: "Circle" }, { icon: "🟦", name: "Rectangle" }, { icon: "🔺", name: "Triangle" }].map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.15 }} style={{ padding: "16px 24px", borderRadius: "12px", background: `${colors.primary}15`, border: `1px solid ${colors.primary}`, textAlign: "center" }}>
            <div style={{ fontSize: "2rem", marginBottom: "0.3rem" }}>{s.icon}</div>
            <div style={{ color: colors.primary, fontSize: "11px", fontWeight: 600 }}>{s.name}</div>
          </motion.div>
        ))}
      </div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 1 ? 1 : 0 }} style={{ textAlign: "center" }}>
        <div style={{ color: colors.warning, fontSize: "14px", fontWeight: 600, marginBottom: "0.8rem" }}>"But what is a Shape by itself?"</div>
        <div style={{ padding: "12px 20px", borderRadius: "10px", background: `${colors.danger}15`, border: `2px solid ${colors.danger}`, display: "inline-block" }}>
          <span style={{ fontFamily: "monospace", color: colors.danger, fontSize: "12px" }}>Shape s; </span>
          <span style={{ color: colors.danger, fontSize: "11px" }}>❌ "What kind of shape?"</span>
        </div>
      </motion.div>
    </div>
  );
};

// ============================================
// SCENE 3: The Bad Design (If-Else Disaster)
// ============================================
const Scene3 = () => {
  const [phase, setPhase] = useState(0);
  useEffect(() => { const t = [setTimeout(() => setPhase(1), 800)]; return () => t.forEach(clearTimeout); }, []);
  const code = `class Shape {
public:
    string type;
};

// Bad design! 😱
if(type == "circle") { ... }
else if(type == "rectangle") { ... }
else if(type == "triangle") { ... }`;
  return (
    <div style={containerStyle}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: colors.danger, fontWeight: 700, fontSize: "13px", letterSpacing: "1.5px", marginBottom: "1rem" }}>😱 THE BAD DESIGN: IF-ELSE DISASTER</motion.div>
      <div style={{ display: "flex", gap: "2rem", alignItems: "flex-start" }}>
        <GlassCard glow={colors.danger} style={{ maxWidth: "320px" }}><CodeBlock code={code} fontSize="9px" /></GlassCard>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 1 ? 1 : 0 }} style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <div style={{ padding: "8px 14px", borderRadius: "8px", background: `${colors.danger}15`, fontSize: "10px", color: colors.danger }}>➕ New shape → more if-else</div>
          <div style={{ padding: "8px 14px", borderRadius: "8px", background: `${colors.danger}15`, fontSize: "10px", color: colors.danger }}>🐛 Easy to forget a case</div>
          <div style={{ padding: "8px 14px", borderRadius: "8px", background: `${colors.danger}15`, fontSize: "10px", color: colors.danger }}>📍 Logic scattered everywhere</div>
        </motion.div>
      </div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 1 ? 1 : 0 }} style={{ marginTop: "1rem", padding: "10px 24px", borderRadius: "100px", background: `${colors.danger}15`, textAlign: "center" }}>
        <span style={{ color: colors.danger, fontSize: "11px" }}>"Not scalable. Not safe."</span>
      </motion.div>
    </div>
  );
};

// ============================================
// SCENE 4: The Real Idea: A Contract
// ============================================
const Scene4 = () => {
  const [phase, setPhase] = useState(0);
  useEffect(() => { const t = [setTimeout(() => setPhase(1), 800)]; return () => t.forEach(clearTimeout); }, []);
  return (
    <div style={containerStyle}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: colors.accent, fontWeight: 700, fontSize: "13px", letterSpacing: "1.5px", marginBottom: "1.5rem" }}>📜 THE REAL IDEA: A CONTRACT</motion.div>
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} style={{ padding: "20px 32px", borderRadius: "16px", background: `${colors.virtualColor}20`, border: `2px solid ${colors.virtualColor}`, textAlign: "center", marginBottom: "1.5rem" }}>
        <div style={{ color: colors.virtualColor, fontWeight: 700, fontSize: "14px" }}>Shape is not an object.</div>
        <div style={{ color: colors.virtualColor, fontSize: "13px" }}>It's a <span style={{ fontWeight: 700 }}>rulebook</span>.</div>
      </motion.div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 1 ? 1 : 0 }} style={{ textAlign: "center" }}>
        <div style={{ color: colors.text, fontSize: "13px", marginBottom: "1rem" }}>"If you want to be a Shape, you <span style={{ color: colors.success, fontWeight: 700 }}>MUST</span> have area()."</div>
        <div style={{ display: "inline-block", padding: "16px 28px", borderRadius: "12px", background: `${colors.accent}15`, border: `2px dashed ${colors.accent}` }}>
          <div style={{ fontSize: "2rem", marginBottom: "0.3rem" }}>📋</div>
          <div style={{ color: colors.accent, fontWeight: 600, fontSize: "12px" }}>CONTRACT</div>
        </div>
      </motion.div>
    </div>
  );
};

// ============================================
// SCENE 5: Pure Virtual Function (The Core Line)
// ============================================
const Scene5 = () => {
  const [phase, setPhase] = useState(0);
  useEffect(() => { const t = [setTimeout(() => setPhase(1), 800)]; return () => t.forEach(clearTimeout); }, []);
  const code = `class Shape {
public:
    virtual float area() = 0;
};`;
  return (
    <div style={containerStyle}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: colors.virtualColor, fontWeight: 700, fontSize: "13px", letterSpacing: "1.5px", marginBottom: "1.5rem" }}>⚡ PURE VIRTUAL FUNCTION</motion.div>
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} style={{ maxWidth: "320px", margin: "0 auto", marginBottom: "1.5rem" }}>
        <GlassCard glow={colors.virtualColor}><CodeBlock code={code} fontSize="11px" /></GlassCard>
      </motion.div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 1 ? 1 : 0 }} style={{ display: "flex", gap: "1.5rem", justifyContent: "center" }}>
        <div style={{ padding: "12px 20px", borderRadius: "12px", background: `${colors.virtualColor}15`, border: `1px solid ${colors.virtualColor}`, textAlign: "center" }}>
          <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 1, repeat: Infinity }} style={{ fontFamily: "monospace", color: colors.virtualColor, fontWeight: 700 }}>virtual</motion.div>
        </div>
        <div style={{ padding: "12px 20px", borderRadius: "12px", background: `${colors.accent}15`, border: `1px solid ${colors.accent}`, textAlign: "center" }}>
          <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 1, repeat: Infinity, delay: 0.5 }} style={{ fontFamily: "monospace", color: colors.accent, fontWeight: 700 }}>= 0</motion.div>
        </div>
      </motion.div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 1 ? 1 : 0 }} style={{ marginTop: "1rem", textAlign: "center" }}>
        <div style={{ color: colors.text, fontSize: "12px" }}>"This function has <span style={{ color: colors.danger }}>NO implementation</span>."</div>
        <div style={{ color: colors.success, fontSize: "12px" }}>"But it is <span style={{ fontWeight: 700 }}>MANDATORY</span>."</div>
      </motion.div>
    </div>
  );
};

// ============================================
// SCENE 6: Abstract Class Is Born
// ============================================
const Scene6 = () => {
  const [phase, setPhase] = useState(0);
  useEffect(() => { const t = [setTimeout(() => setPhase(1), 800)]; return () => t.forEach(clearTimeout); }, []);
  return (
    <div style={containerStyle}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: colors.danger, fontWeight: 700, fontSize: "13px", letterSpacing: "1.5px", marginBottom: "1.5rem" }}>🚫 ABSTRACT CLASS IS BORN</motion.div>
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} style={{ maxWidth: "220px", margin: "0 auto", marginBottom: "1rem" }}>
        <GlassCard>
          <div style={{ fontFamily: "monospace", fontSize: "12px", color: colors.text }}>Shape s;</div>
        </GlassCard>
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: phase >= 1 ? 1 : 0, y: 0 }} style={{ padding: "14px 24px", borderRadius: "12px", background: `${colors.danger}20`, border: `3px solid ${colors.danger}`, textAlign: "center", marginBottom: "1rem" }}>
        <span style={{ color: colors.danger, fontSize: "11px" }}>❌ "Cannot create object of abstract class Shape"</span>
      </motion.div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 1 ? 1 : 0 }} style={{ textAlign: "center" }}>
        <div style={{ color: colors.success, fontSize: "13px", fontWeight: 600 }}>"The error IS the feature."</div>
        <div style={{ color: colors.textSec, fontSize: "11px", marginTop: "0.3rem" }}>"The compiler enforces good design."</div>
      </motion.div>
    </div>
  );
};

// ============================================
// SCENE 7: Concrete Class (Fulfilling the Contract)
// ============================================
const Scene7 = () => {
  const [phase, setPhase] = useState(0);
  useEffect(() => { const t = [setTimeout(() => setPhase(1), 800)]; return () => t.forEach(clearTimeout); }, []);
  const code = `class Rectangle : public Shape {
public:
    float length, width;

    float area() override {
        return length * width;
    }
};`;
  return (
    <div style={containerStyle}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: colors.success, fontWeight: 700, fontSize: "13px", letterSpacing: "1.5px", marginBottom: "1rem" }}>✅ CONCRETE CLASS: FULFILLING THE CONTRACT</motion.div>
      <div style={{ display: "flex", gap: "2rem", alignItems: "flex-start" }}>
        <GlassCard glow={colors.success} style={{ maxWidth: "320px" }}><CodeBlock code={code} fontSize="9px" /></GlassCard>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 1 ? 1 : 0 }} style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
          <div style={{ padding: "12px 20px", borderRadius: "12px", background: `${colors.success}15`, border: `2px solid ${colors.success}`, textAlign: "center" }}>
            <div style={{ color: colors.success, fontWeight: 700 }}>override ✓</div>
            <div style={{ color: colors.textSec, fontSize: "10px" }}>Contract fulfilled!</div>
          </div>
          <div style={{ padding: "10px 16px", borderRadius: "10px", background: `${colors.primary}15`, border: `1px solid ${colors.primary}` }}>
            <div style={{ fontFamily: "monospace", fontSize: "11px", color: colors.primary }}>Rectangle r; ✓</div>
            <div style={{ color: colors.textSec, fontSize: "10px" }}>Can create objects!</div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

// ============================================
// SCENE 8: The Real Power: Polymorphism
// ============================================
const Scene8 = () => {
  const [phase, setPhase] = useState(0);
  useEffect(() => { const t = [setTimeout(() => setPhase(1), 800)]; return () => t.forEach(clearTimeout); }, []);
  const code1 = `Shape* s = new Rectangle();
cout << s->area();  // Rectangle::area()`;
  const code2 = `vector<Shape*> shapes;
shapes.push_back(new Rectangle());
shapes.push_back(new Circle());

for(auto s : shapes)
    cout << s->area();  // Each own area!`;
  return (
    <div style={containerStyle}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: colors.virtualColor, fontWeight: 700, fontSize: "13px", letterSpacing: "1.5px", marginBottom: "1rem" }}>⚡ THE REAL POWER: POLYMORPHISM</motion.div>
      <div style={{ display: "flex", gap: "1.5rem", justifyContent: "center", marginBottom: "1rem" }}>
        <GlassCard style={{ maxWidth: "280px" }}><CodeBlock code={code1} fontSize="9px" /></GlassCard>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 1 ? 1 : 0 }}>
          <GlassCard glow={colors.virtualColor} style={{ maxWidth: "320px" }}><CodeBlock code={code2} fontSize="9px" /></GlassCard>
        </motion.div>
      </div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 1 ? 1 : 0 }} style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
        <div style={{ padding: "8px 16px", borderRadius: "100px", background: `${colors.virtualColor}15`, fontSize: "11px", color: colors.virtualColor }}>"One pointer. Many shapes."</div>
        <div style={{ padding: "8px 16px", borderRadius: "100px", background: `${colors.success}15`, fontSize: "11px", color: colors.success }}>"Main code doesn't care about type."</div>
      </motion.div>
    </div>
  );
};

// ============================================
// SCENE 9: The Critical Gotcha: Virtual Destructor
// ============================================
const Scene9 = () => {
  const [phase, setPhase] = useState(0);
  useEffect(() => { const t = [setTimeout(() => setPhase(1), 800)]; return () => t.forEach(clearTimeout); }, []);
  const code = `class Shape {
public:
    virtual ~Shape() {}   // Important!
    virtual float area() = 0;
};`;
  return (
    <div style={containerStyle}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: colors.warning, fontWeight: 700, fontSize: "13px", letterSpacing: "1.5px", marginBottom: "1rem" }}>⚠️ CRITICAL GOTCHA: VIRTUAL DESTRUCTOR</motion.div>
      <div style={{ display: "flex", gap: "2rem", alignItems: "flex-start" }}>
        <GlassCard glow={colors.warning} style={{ maxWidth: "300px" }}><CodeBlock code={code} fontSize="9px" /></GlassCard>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 1 ? 1 : 0 }} style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
          <div style={{ padding: "10px 16px", borderRadius: "10px", background: `${colors.danger}15`, border: `1px solid ${colors.danger}` }}>
            <div style={{ color: colors.danger, fontSize: "10px" }}>❌ Without virtual destructor:</div>
            <div style={{ color: colors.textSec, fontSize: "9px" }}>Only Shape destroyed, Rectangle leaks!</div>
          </div>
          <div style={{ padding: "10px 16px", borderRadius: "10px", background: `${colors.success}15`, border: `1px solid ${colors.success}` }}>
            <div style={{ color: colors.success, fontSize: "10px" }}>✓ With virtual destructor:</div>
            <div style={{ color: colors.textSec, fontSize: "9px" }}>Shape → Rectangle → destroyed properly!</div>
          </div>
        </motion.div>
      </div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 1 ? 1 : 0 }} style={{ marginTop: "1rem", padding: "10px 24px", borderRadius: "100px", background: `${colors.warning}15`, textAlign: "center" }}>
        <span style={{ color: colors.warning, fontSize: "11px" }}>"If a class has ANY virtual function, make its destructor virtual."</span>
      </motion.div>
    </div>
  );
};

// ============================================
// SCENE 10: Why This Exists (Big Picture)
// ============================================
const Scene10 = () => {
  const [phase, setPhase] = useState(0);
  useEffect(() => { const t = [setTimeout(() => setPhase(1), 400), setTimeout(() => setPhase(2), 800), setTimeout(() => setPhase(3), 1200), setTimeout(() => setPhase(4), 1600)]; return () => t.forEach(clearTimeout); }, []);
  const pillars = [
    { icon: "🔒", title: "Enforce rules", desc: "at compiler level" },
    { icon: "🎯", title: "Ensure", desc: "consistency" },
    { icon: "👥", title: "Support", desc: "large teams" },
    { icon: "🔮", title: "Enable", desc: "polymorphism" },
  ];
  return (
    <div style={containerStyle}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: colors.accent, fontWeight: 700, fontSize: "13px", letterSpacing: "1.5px", marginBottom: "1.5rem" }}>🏛️ WHY THIS EXISTS (BIG PICTURE)</motion.div>
      <div style={{ display: "flex", gap: "1rem", justifyContent: "center", marginBottom: "1.5rem" }}>
        {pillars.map((p, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: phase > i ? 1 : 0, y: 0 }} style={{ padding: "14px 16px", borderRadius: "12px", background: `${colors.primary}15`, border: `1px solid ${colors.primary}`, textAlign: "center", width: "100px" }}>
            <div style={{ fontSize: "1.5rem", marginBottom: "0.3rem" }}>{p.icon}</div>
            <div style={{ color: colors.primary, fontWeight: 600, fontSize: "10px" }}>{p.title}</div>
            <div style={{ color: colors.textSec, fontSize: "9px" }}>{p.desc}</div>
          </motion.div>
        ))}
      </div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 4 ? 1 : 0 }} style={{ padding: "14px 28px", borderRadius: "16px", background: `${colors.virtualColor}15`, border: `1px solid ${colors.virtualColor}`, textAlign: "center" }}>
        <span style={{ color: colors.virtualColor, fontSize: "12px" }}>"Abstract classes define <span style={{ fontWeight: 700 }}>WHAT</span> must be done, not <span style={{ fontWeight: 700 }}>HOW</span>."</span>
      </motion.div>
    </div>
  );
};

// ============================================
// SCENE 11: Blueprint Analogy & Final Question
// ============================================
const Scene11 = () => {
  const [phase, setPhase] = useState(0);
  useEffect(() => { const t = [setTimeout(() => setPhase(1), 800), setTimeout(() => setPhase(2), 1600)]; return () => t.forEach(clearTimeout); }, []);
  return (
    <div style={{ ...containerStyle, background: "linear-gradient(135deg, #1a1a2e 0%, #0f0f1a 100%)" }}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: colors.accent, fontWeight: 700, fontSize: "13px", letterSpacing: "1.5px", marginBottom: "1.5rem" }}>🏗️ BLUEPRINT ANALOGY</motion.div>
      <div style={{ display: "flex", gap: "2.5rem", justifyContent: "center", marginBottom: "1.5rem" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ padding: "20px", borderRadius: "12px", background: `${colors.virtualColor}15`, border: `2px dashed ${colors.virtualColor}`, marginBottom: "0.5rem" }}>
            <div style={{ fontSize: "2rem" }}>📐</div>
          </div>
          <div style={{ color: colors.virtualColor, fontWeight: 600, fontSize: "11px" }}>Abstract Class</div>
          <div style={{ color: colors.textSec, fontSize: "10px" }}>"There must be a door"</div>
        </div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 1 ? 1 : 0 }} style={{ textAlign: "center" }}>
          <div style={{ padding: "20px", borderRadius: "12px", background: `${colors.success}15`, border: `2px solid ${colors.success}`, marginBottom: "0.5rem" }}>
            <div style={{ fontSize: "2rem" }}>🏠</div>
          </div>
          <div style={{ color: colors.success, fontWeight: 600, fontSize: "11px" }}>Concrete Class</div>
          <div style={{ color: colors.textSec, fontSize: "10px" }}>"Here is the door I built"</div>
        </motion.div>
      </div>
      <AnimatePresence>{phase >= 2 && <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ padding: "14px 28px", borderRadius: "16px", background: `${colors.accent}20`, border: `1px solid ${colors.accent}`, textAlign: "center" }}>
        <div style={{ color: colors.text, fontSize: "12px", marginBottom: "0.3rem" }}>"What behavior is truly common to ALL shapes?"</div>
        <div style={{ color: colors.accent, fontSize: "11px" }}>Put common in base class. Force specific via pure virtual.</div>
      </motion.div>}</AnimatePresence>
    </div>
  );
};

// Export all scenes
export const AbstractClassScenes = [
  { title: "The Strange Idea", component: Scene1, contentText: "A class you can't create objects from? Abstract = blueprint for blueprints!" },
  { title: "The Shape Problem", component: Scene2, contentText: "What is a Shape? Circle, Rectangle, Triangle. But Shape itself? Can't create it!" },
  { title: "If-Else Disaster", component: Scene3, contentText: "Bad design: if(type=='circle')... Not scalable, not safe, logic scattered!" },
  { title: "A Contract", component: Scene4, contentText: "Shape is not an object, it's a rulebook. You MUST have area() to be a Shape." },
  { title: "Pure Virtual Function", component: Scene5, contentText: "virtual float area() = 0; No implementation, but MANDATORY for derived classes." },
  { title: "Abstract Class Born", component: Scene6, contentText: "Shape s; ERROR! Cannot create abstract class object. The error IS the feature!" },
  { title: "Concrete Class", component: Scene7, contentText: "Rectangle implements area() with override. Contract fulfilled! Can create objects." },
  { title: "Polymorphism Power", component: Scene8, contentText: "Shape* s = new Rectangle(); One pointer, many shapes. Main code doesn't care!" },
  { title: "Virtual Destructor", component: Scene9, contentText: "~Shape() must be virtual! Otherwise derived part leaks. Critical gotcha!" },
  { title: "Big Picture", component: Scene10, contentText: "Enforce rules, ensure consistency, support teams, enable polymorphism. Define WHAT, not HOW." },
  { title: "Blueprint Analogy", component: Scene11, contentText: "Abstract = Architect (must have door). Concrete = Builder (here's my door)." },
];
