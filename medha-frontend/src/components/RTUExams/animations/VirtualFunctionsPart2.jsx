/**
 * VirtualFunctionsPart2.jsx - Scenes 17-32
 * Virtual Functions, ID Card Analogy & Dynamic Binding
 */
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { colors, containerStyle } from "./VirtualFunctionsTheme";
import { GlassCard, CodeBlock, Terminal } from "./VirtualFunctionsAnimation";

// SCENE 17: ID Card & CEO Analogy (VERY IMPORTANT)
const Scene17 = () => {
  const [phase, setPhase] = useState(0);
  useEffect(() => { const t = [setTimeout(() => setPhase(1), 800), setTimeout(() => setPhase(2), 2000)]; return () => t.forEach(clearTimeout); }, []);
  return (
    <div style={containerStyle}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: colors.warning, fontWeight: 700, fontSize: "13px", letterSpacing: "1.5px", marginBottom: "2rem" }}>🎭 ID CARD ANALOGY (VERY IMPORTANT!)</motion.div>
      <div style={{ display: "flex", alignItems: "center", gap: "2.5rem" }}>
        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} style={{ padding: "24px", borderRadius: "20px", background: `${colors.success}20`, border: `3px solid ${colors.success}`, textAlign: "center" }}>
          <div style={{ fontSize: "3rem", marginBottom: "0.5rem" }}>👑</div>
          <div style={{ color: colors.success, fontWeight: 700 }}>Person is CEO</div>
        </motion.div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 1 ? 1 : 0 }} style={{ fontSize: "2rem" }}>but shows</motion.div>
        <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: phase >= 1 ? 1 : 0, x: 0 }} style={{ padding: "24px", borderRadius: "20px", background: `${colors.baseClass}20`, border: `3px solid ${colors.baseClass}`, textAlign: "center" }}>
          <div style={{ fontSize: "3rem", marginBottom: "0.5rem" }}>🪪</div>
          <div style={{ color: colors.baseClass, fontWeight: 700 }}>Employee ID Card</div>
        </motion.div>
      </div>
      <AnimatePresence>{phase >= 2 && <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ marginTop: "2rem", padding: "20px 32px", borderRadius: "20px", background: `${colors.danger}15`, border: `2px solid ${colors.danger}`, display: "flex", alignItems: "center", gap: "1.5rem" }}>
        <div style={{ fontSize: "2.5rem" }}>😐</div>
        <div style={{ color: colors.danger, fontWeight: 600 }}>Guard sends him to general area!</div>
      </motion.div>}</AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 2 ? 1 : 0 }} style={{ marginTop: "1.5rem", color: colors.warning }}>"Compiler only sees <span style={{ fontWeight: 700 }}>pointer type</span>."</motion.div>
    </div>
  );
};

// SCENE 18: Without Virtual (Wrong Call)
const Scene18 = () => {
  const code = `Shape* p = &circle;
p->draw();  // calls Shape version`;
  const [phase, setPhase] = useState(0);
  useEffect(() => { const t = [setTimeout(() => setPhase(1), 800)]; return () => t.forEach(clearTimeout); }, []);
  return (
    <div style={containerStyle}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: colors.danger, fontWeight: 700, fontSize: "13px", letterSpacing: "1.5px", marginBottom: "1.5rem" }}>❌ WITHOUT VIRTUAL FUNCTION</motion.div>
      <GlassCard glow={colors.danger}><CodeBlock code={code} fontSize="14px" /></GlassCard>
      <AnimatePresence>{phase >= 1 && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ marginTop: "1.5rem" }}>
        <Terminal output="Drawing Shape" />
        <div style={{ marginTop: "1rem", color: colors.danger, fontWeight: 600, textAlign: "center" }}>WRONG! We expected "Drawing Circle"</div>
      </motion.div>}</AnimatePresence>
    </div>
  );
};

// SCENE 19: Static Binding Explanation
const Scene19 = () => {
  const [phase, setPhase] = useState(0);
  useEffect(() => { const t = [setTimeout(() => setPhase(1), 800)]; return () => t.forEach(clearTimeout); }, []);
  return (
    <div style={containerStyle}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: colors.compileTime, fontWeight: 700, fontSize: "13px", letterSpacing: "1.5px", marginBottom: "2rem" }}>📌 STATIC BINDING</motion.div>
      <div style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} style={{ padding: "20px 32px", borderRadius: "16px", background: `${colors.compileTime}20`, border: `2px solid ${colors.compileTime}` }}>
          <div style={{ fontFamily: "monospace", color: colors.compileTime, fontWeight: 600 }}>Pointer Type</div>
          <div style={{ color: colors.textSec, fontSize: "12px" }}>Shape*</div>
        </motion.div>
        <motion.div animate={{ x: [0, 10, 0] }} transition={{ duration: 1, repeat: Infinity }} style={{ fontSize: "2rem" }}>→</motion.div>
        <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: phase >= 1 ? 1 : 0, x: 0 }} style={{ padding: "20px 32px", borderRadius: "16px", background: `${colors.baseClass}20`, border: `2px solid ${colors.baseClass}` }}>
          <div style={{ fontFamily: "monospace", color: colors.baseClass, fontWeight: 600 }}>Function</div>
          <div style={{ color: colors.textSec, fontSize: "12px" }}>Shape::draw()</div>
        </motion.div>
      </div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 1 ? 1 : 0 }} style={{ marginTop: "2rem", padding: "16px 28px", borderRadius: "100px", background: `${colors.compileTime}15`, border: `1px solid ${colors.compileTime}40`, color: colors.compileTime }}>Decision made at <span style={{ fontWeight: 700 }}>compile time</span></motion.div>
    </div>
  );
};

// SCENE 20: Virtual Keyword = Magic Sticker
const Scene20 = () => {
  const [phase, setPhase] = useState(0);
  useEffect(() => { const t = [setTimeout(() => setPhase(1), 800), setTimeout(() => setPhase(2), 1800)]; return () => t.forEach(clearTimeout); }, []);
  return (
    <div style={containerStyle}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: colors.virtualColor, fontWeight: 700, fontSize: "13px", letterSpacing: "1.5px", marginBottom: "2rem" }}>✨ VIRTUAL = MAGIC STICKER</motion.div>
      <div style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ position: "relative", padding: "24px", borderRadius: "20px", background: `${colors.baseClass}20`, border: `2px solid ${colors.baseClass}`, textAlign: "center" }}>
          <div style={{ fontSize: "3rem" }}>🪪</div>
          <div style={{ color: colors.baseClass, marginTop: "0.5rem" }}>ID Card</div>
          <motion.div initial={{ opacity: 0, scale: 0 }} animate={{ opacity: phase >= 1 ? 1 : 0, scale: 1 }} style={{ position: "absolute", top: "-10px", right: "-10px", padding: "8px 16px", borderRadius: "100px", background: `${colors.virtualColor}`, fontWeight: 700, fontSize: "12px", color: "#000", boxShadow: `0 0 20px ${colors.virtualColor}` }}>VIRTUAL</motion.div>
        </motion.div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 2 ? 1 : 0 }} style={{ fontSize: "2rem" }}>→</motion.div>
        <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: phase >= 2 ? 1 : 0, x: 0 }} style={{ padding: "24px", borderRadius: "20px", background: `${colors.success}20`, border: `3px solid ${colors.success}`, textAlign: "center" }}>
          <div style={{ fontSize: "3rem" }}>🔍👤</div>
          <div style={{ color: colors.success, marginTop: "0.5rem", fontWeight: 600 }}>Guard checks PERSON!</div>
        </motion.div>
      </div>
    </div>
  );
};

// SCENE 21: With Virtual Function
const Scene21 = () => {
  const code = `virtual void draw();

// Now:
p->draw();  // calls Circle version!`;
  return (
    <div style={containerStyle}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: colors.success, fontWeight: 700, fontSize: "13px", letterSpacing: "1.5px", marginBottom: "1.5rem" }}>✅ WITH VIRTUAL FUNCTION</motion.div>
      <GlassCard glow={colors.success}><CodeBlock code={code} fontSize="14px" /></GlassCard>
      <Terminal output="Drawing Circle" />
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ marginTop: "1rem", color: colors.success, fontWeight: 600 }}>Now the ACTUAL object type determines the function! 🎉</motion.div>
    </div>
  );
};

// SCENE 22: Dynamic Binding Explained
const Scene22 = () => {
  const [phase, setPhase] = useState(0);
  useEffect(() => { const t = [setTimeout(() => setPhase(1), 800)]; return () => t.forEach(clearTimeout); }, []);
  return (
    <div style={containerStyle}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: colors.runTime, fontWeight: 700, fontSize: "13px", letterSpacing: "1.5px", marginBottom: "2rem" }}>⚙️ DYNAMIC BINDING</motion.div>
      <motion.div animate={{ rotate: [0, 360] }} transition={{ duration: 3, repeat: Infinity, ease: "linear" }} style={{ fontSize: "5rem", marginBottom: "1.5rem" }}>⚙️</motion.div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 1 ? 1 : 0 }} style={{ padding: "20px 40px", borderRadius: "20px", background: `${colors.runTime}20`, border: `2px solid ${colors.runTime}` }}>
        <div style={{ color: colors.runTime, fontWeight: 700, fontSize: "1.2rem" }}>Decision made at RUNTIME</div>
      </motion.div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 1 ? 1 : 0 }} style={{ marginTop: "1.5rem", color: colors.textSec }}>Also called: <span style={{ color: colors.runTime, fontWeight: 700 }}>Late Binding</span></motion.div>
    </div>
  );
};

// SCENE 23: Runtime Polymorphism Full Program
const Scene23 = () => {
  const code = `class Shape {
public:
    virtual void draw() { cout<<"Drawing Shape\\n"; }
};

class Circle : public Shape {
public:
    void draw() { cout<<"Drawing Circle\\n"; }
};

class Rectangle : public Shape {
public:
    void draw() { cout<<"Drawing Rectangle\\n"; }
};`;
  return (
    <div style={containerStyle}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: colors.virtualColor, fontWeight: 700, fontSize: "13px", letterSpacing: "1.5px", marginBottom: "1rem" }}>📝 RUNTIME POLYMORPHISM PROGRAM</motion.div>
      <GlassCard style={{ maxWidth: "500px" }}><CodeBlock code={code} fontSize="10px" /></GlassCard>
    </div>
  );
};

// SCENE 24: Output Animation
const Scene24 = () => {
  const [phase, setPhase] = useState(0);
  useEffect(() => { const t = [setTimeout(() => setPhase(1), 600), setTimeout(() => setPhase(2), 1500)]; return () => t.forEach(clearTimeout); }, []);
  return (
    <div style={containerStyle}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: colors.success, fontWeight: 700, fontSize: "13px", letterSpacing: "1.5px", marginBottom: "2rem" }}>🖥️ OUTPUT ANIMATION</motion.div>
      <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: phase >= 1 ? 1 : 0, x: 0 }} style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
          <div style={{ fontSize: "2.5rem" }}>⭕</div>
          <div style={{ padding: "16px 32px", borderRadius: "16px", background: `${colors.success}20`, border: `2px solid ${colors.success}`, fontFamily: "monospace", color: colors.success, fontSize: "1.2rem" }}>Drawing Circle</div>
        </motion.div>
        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: phase >= 2 ? 1 : 0, x: 0 }} style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
          <div style={{ fontSize: "2.5rem" }}>⬜</div>
          <div style={{ padding: "16px 32px", borderRadius: "16px", background: `${colors.success}20`, border: `2px solid ${colors.success}`, fontFamily: "monospace", color: colors.success, fontSize: "1.2rem" }}>Drawing Rectangle</div>
        </motion.div>
      </div>
    </div>
  );
};

// SCENE 25: Function Overriding Highlight
const Scene25 = () => {
  const [phase, setPhase] = useState(0);
  useEffect(() => { const t = [setTimeout(() => setPhase(1), 800)]; return () => t.forEach(clearTimeout); }, []);
  return (
    <div style={containerStyle}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: colors.accent, fontWeight: 700, fontSize: "13px", letterSpacing: "1.5px", marginBottom: "2rem" }}>🔄 FUNCTION OVERRIDING</motion.div>
      <div style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
        <motion.div initial={{ opacity: 0.3 }} animate={{ opacity: phase >= 1 ? 0.3 : 0.8 }} style={{ padding: "20px 32px", borderRadius: "16px", background: `${colors.baseClass}15`, border: `2px dashed ${colors.baseClass}` }}>
          <div style={{ fontFamily: "monospace", color: colors.baseClass }}>Shape::draw()</div>
        </motion.div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 1 ? 1 : 0 }} style={{ fontSize: "2rem" }}>➡️</motion.div>
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: phase >= 1 ? 1 : 0, scale: 1 }} style={{ padding: "20px 32px", borderRadius: "16px", background: `${colors.derivedClass}20`, border: `3px solid ${colors.derivedClass}`, boxShadow: `0 0 20px ${colors.derivedClass}30` }}>
          <div style={{ fontFamily: "monospace", color: colors.derivedClass, fontWeight: 600 }}>Circle::draw()</div>
        </motion.div>
      </div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 1 ? 1 : 0 }} style={{ marginTop: "2rem", color: colors.textSec }}>"Same name, same signature, <span style={{ color: colors.accent }}>new behavior</span>."</motion.div>
    </div>
  );
};

// SCENE 26: Virtual Destructor Story
const Scene26 = () => {
  const code = `Shape* p = new Circle();
delete p;`;
  const [phase, setPhase] = useState(0);
  useEffect(() => { const t = [setTimeout(() => setPhase(1), 800)]; return () => t.forEach(clearTimeout); }, []);
  return (
    <div style={containerStyle}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: colors.danger, fontWeight: 700, fontSize: "13px", letterSpacing: "1.5px", marginBottom: "1.5rem" }}>⚠️ MEMORY LEAK STORY</motion.div>
      <GlassCard glow={colors.danger}><CodeBlock code={code} fontSize="14px" /></GlassCard>
      <AnimatePresence>{phase >= 1 && <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ marginTop: "1.5rem", display: "flex", alignItems: "center", gap: "2rem" }}>
        <div style={{ padding: "16px 24px", borderRadius: "12px", background: `${colors.baseClass}15`, border: `1px solid ${colors.baseClass}` }}>~Shape() runs</div>
        <div style={{ color: colors.danger, fontWeight: 600, display: "flex", alignItems: "center", gap: "0.5rem" }}>❌ ~Circle() skipped! <span style={{ fontSize: "1.5rem" }}>💧</span></div>
      </motion.div>}</AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 1 ? 1 : 0 }} style={{ marginTop: "1rem", color: colors.danger }}>Memory leak! Circle's resources not freed.</motion.div>
    </div>
  );
};

// SCENE 27: Fix - Virtual Destructor
const Scene27 = () => {
  const code = `virtual ~Shape() {}`;
  const [phase, setPhase] = useState(0);
  useEffect(() => { const t = [setTimeout(() => setPhase(1), 800)]; return () => t.forEach(clearTimeout); }, []);
  return (
    <div style={containerStyle}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: colors.success, fontWeight: 700, fontSize: "13px", letterSpacing: "1.5px", marginBottom: "1.5rem" }}>✅ FIX: VIRTUAL DESTRUCTOR</motion.div>
      <GlassCard glow={colors.virtualColor}><CodeBlock code={code} fontSize="16px" /></GlassCard>
      <AnimatePresence>{phase >= 1 && <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ marginTop: "1.5rem", display: "flex", alignItems: "center", gap: "1.5rem" }}>
        <div style={{ padding: "12px 20px", borderRadius: "12px", background: `${colors.derivedClass}15`, border: `1px solid ${colors.derivedClass}`, color: colors.derivedClass }}>~Circle() first</div>
        <div style={{ fontSize: "1.5rem" }}>→</div>
        <div style={{ padding: "12px 20px", borderRadius: "12px", background: `${colors.baseClass}15`, border: `1px solid ${colors.baseClass}`, color: colors.baseClass }}>~Shape() second</div>
        <div style={{ color: colors.success, fontWeight: 600 }}>✅ Memory safe!</div>
      </motion.div>}</AnimatePresence>
    </div>
  );
};

// SCENE 28: Two Tools Side by Side
const Scene28 = () => {
  const rows = [
    { left: "Compile Time", right: "Run Time" },
    { left: "Early Binding", right: "Late Binding" },
    { left: "Syntax Convenience", right: "Logic Flexibility" },
    { left: "Zero Overhead", right: "Small Overhead" },
  ];
  return (
    <div style={containerStyle}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: colors.accent, fontWeight: 700, fontSize: "13px", letterSpacing: "1.5px", marginBottom: "2rem" }}>⚖️ SIDE BY SIDE COMPARISON</motion.div>
      <div style={{ display: "flex", gap: "2rem" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem", alignItems: "center" }}>
          <div style={{ padding: "12px 24px", borderRadius: "12px", background: `${colors.operatorColor}30`, border: `2px solid ${colors.operatorColor}`, color: colors.operatorColor, fontWeight: 700 }}>Operator Overloading</div>
          {rows.map((r, i) => <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.2 }} style={{ padding: "10px 20px", borderRadius: "8px", background: `${colors.operatorColor}10`, color: colors.textSec, fontSize: "14px" }}>{r.left}</motion.div>)}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem", alignItems: "center" }}>
          <div style={{ padding: "12px 24px", borderRadius: "12px", background: `${colors.virtualColor}30`, border: `2px solid ${colors.virtualColor}`, color: colors.virtualColor, fontWeight: 700 }}>Virtual Function</div>
          {rows.map((r, i) => <motion.div key={i} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.2 }} style={{ padding: "10px 20px", borderRadius: "8px", background: `${colors.virtualColor}10`, color: colors.textSec, fontSize: "14px" }}>{r.right}</motion.div>)}
        </div>
      </div>
    </div>
  );
};

// SCENE 29: Tradeoff Discussion
const Scene29 = () => {
  const [phase, setPhase] = useState(0);
  useEffect(() => { const t = [setTimeout(() => setPhase(1), 800)]; return () => t.forEach(clearTimeout); }, []);
  return (
    <div style={containerStyle}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: colors.secondary, fontWeight: 700, fontSize: "13px", letterSpacing: "1.5px", marginBottom: "2rem" }}>⚖️ TRADEOFF DISCUSSION</motion.div>
      <motion.div animate={{ rotate: [-5, 5, -5] }} transition={{ duration: 2, repeat: Infinity }} style={{ fontSize: "5rem", marginBottom: "1.5rem" }}>⚖️</motion.div>
      <div style={{ display: "flex", gap: "3rem" }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: phase >= 1 ? 1 : 0, y: 0 }} style={{ padding: "20px 32px", borderRadius: "16px", background: `${colors.success}15`, border: `2px solid ${colors.success}`, textAlign: "center" }}>
          <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>🚀</div>
          <div style={{ color: colors.success, fontWeight: 600 }}>Performance</div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: phase >= 1 ? 1 : 0, y: 0 }} transition={{ delay: 0.2 }} style={{ padding: "20px 32px", borderRadius: "16px", background: `${colors.runTime}15`, border: `2px solid ${colors.runTime}`, textAlign: "center" }}>
          <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>🧠</div>
          <div style={{ color: colors.runTime, fontWeight: 600 }}>Flexibility</div>
        </motion.div>
      </div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 1 ? 1 : 0 }} style={{ marginTop: "2rem", color: colors.secondary }}>"What are you <span style={{ fontWeight: 700 }}>optimizing for</span>?"</motion.div>
    </div>
  );
};

// SCENE 30: Final Philosophy
const Scene30 = () => {
  const [phase, setPhase] = useState(0);
  useEffect(() => { const t = [setTimeout(() => setPhase(1), 800)]; return () => t.forEach(clearTimeout); }, []);
  return (
    <div style={containerStyle}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: colors.primary, fontWeight: 700, fontSize: "13px", letterSpacing: "1.5px", marginBottom: "2rem" }}>💡 C++ PHILOSOPHY</motion.div>
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }} style={{ fontSize: "5rem", marginBottom: "1.5rem" }}>⚡</motion.div>
      <div style={{ display: "flex", gap: "2rem" }}>
        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: phase >= 1 ? 1 : 0, x: 0 }} style={{ padding: "16px 28px", borderRadius: "16px", background: `${colors.danger}15`, border: `2px solid ${colors.danger}`, color: colors.danger, fontWeight: 600 }}>Low-level Control</motion.div>
        <motion.div initial={{ scale: 0 }} animate={{ scale: phase >= 1 ? 1 : 0 }} style={{ fontSize: "1.5rem", color: colors.textSec }}>+</motion.div>
        <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: phase >= 1 ? 1 : 0, x: 0 }} style={{ padding: "16px 28px", borderRadius: "16px", background: `${colors.primary}15`, border: `2px solid ${colors.primary}`, color: colors.primary, fontWeight: 600 }}>High-level Abstraction</motion.div>
      </div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 1 ? 1 : 0 }} style={{ marginTop: "2rem", color: colors.textSec }}>"This is why <span style={{ color: colors.primary, fontWeight: 700 }}>C++ is powerful</span>."</motion.div>
    </div>
  );
};

// SCENE 31: Final Exam-Oriented Summary
const Scene31 = () => {
  const [phase, setPhase] = useState(0);
  useEffect(() => { const t = [setTimeout(() => setPhase(1), 400), setTimeout(() => setPhase(2), 800), setTimeout(() => setPhase(3), 1200), setTimeout(() => setPhase(4), 1600)]; return () => t.forEach(clearTimeout); }, []);
  const items = [
    { label: "Operator overloading", value: "Compile time polymorphism", color: colors.operatorColor },
    { label: "Virtual function", value: "Runtime polymorphism", color: colors.virtualColor },
    { label: "Dynamic binding", value: "Late decision", color: colors.runTime },
    { label: "Virtual destructor", value: "Safety rule", color: colors.warning },
  ];
  return (
    <div style={containerStyle}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: colors.success, fontWeight: 700, fontSize: "13px", letterSpacing: "1.5px", marginBottom: "2rem" }}>📝 EXAM-ORIENTED SUMMARY</motion.div>
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {items.map((item, i) => (
          <motion.div key={i} initial={{ opacity: 0, x: -30 }} animate={{ opacity: phase > i ? 1 : 0, x: 0 }} style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
            <div style={{ padding: "10px 20px", borderRadius: "12px", background: `${item.color}20`, border: `2px solid ${item.color}`, color: item.color, fontWeight: 600, minWidth: "200px" }}>{item.label}</div>
            <div style={{ color: colors.textSec }}>=</div>
            <div style={{ color: colors.text }}>{item.value}</div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// SCENE 32: Closing Frame
const Scene32 = () => {
  const [phase, setPhase] = useState(0);
  useEffect(() => { const t = [setTimeout(() => setPhase(1), 800)]; return () => t.forEach(clearTimeout); }, []);
  return (
    <div style={containerStyle}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: colors.accent, fontWeight: 700, fontSize: "13px", letterSpacing: "1.5px", marginBottom: "2rem" }}>🎬 CLOSING</motion.div>
      <div style={{ fontSize: "1.3rem", color: colors.textSec, marginBottom: "2rem" }}>Two faces of Polymorphism:</div>
      <div style={{ display: "flex", gap: "3rem" }}>
        <motion.div initial={{ opacity: 0, rotateY: -90 }} animate={{ opacity: phase >= 1 ? 1 : 0, rotateY: 0 }} style={{ padding: "32px 40px", borderRadius: "24px", background: `${colors.operatorColor}20`, border: `3px solid ${colors.operatorColor}`, textAlign: "center" }}>
          <div style={{ fontSize: "3rem", marginBottom: "0.5rem" }}>✨</div>
          <div style={{ color: colors.operatorColor, fontWeight: 700 }}>Clean</div>
        </motion.div>
        <motion.div initial={{ opacity: 0, rotateY: 90 }} animate={{ opacity: phase >= 1 ? 1 : 0, rotateY: 0 }} style={{ padding: "32px 40px", borderRadius: "24px", background: `${colors.virtualColor}20`, border: `3px solid ${colors.virtualColor}`, textAlign: "center" }}>
          <div style={{ fontSize: "3rem", marginBottom: "0.5rem" }}>🧠</div>
          <div style={{ color: colors.virtualColor, fontWeight: 700 }}>Intelligent</div>
        </motion.div>
      </div>
      <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: phase >= 1 ? 1 : 0, scale: 1 }} style={{ marginTop: "2.5rem", padding: "20px 40px", borderRadius: "100px", background: `linear-gradient(135deg, ${colors.accent}20, ${colors.primary}10)`, border: `2px solid ${colors.accent}` }}>
        <div style={{ color: colors.text, fontWeight: 700, fontSize: "1.2rem" }}>"One language. <span style={{ color: colors.accent }}>Two superpowers</span>."</div>
      </motion.div>
    </div>
  );
};

// Export scenes 17-32
export const AnimationStepsPart2 = [
  { title: "ID Card & CEO Analogy", component: Scene17, contentText: "Person is CEO but shows Employee ID card. Guard sends him to general area. Compiler only sees pointer type." },
  { title: "Without Virtual Function", component: Scene18, contentText: "Shape* p = &circle; p->draw() calls Shape version - WRONG!" },
  { title: "Static Binding", component: Scene19, contentText: "Arrow from Pointer Type to Function. Decision made at compile time." },
  { title: "Virtual = Magic Sticker", component: Scene20, contentText: "ID card gets VIRTUAL sticker. Guard now checks the person, not card!" },
  { title: "With Virtual Function", component: Scene21, contentText: "virtual void draw(); Now p->draw() calls Circle version - Correct!" },
  { title: "Dynamic Binding", component: Scene22, contentText: "Gears turning at runtime. Decision made at runtime." },
  { title: "Runtime Polymorphism Program", component: Scene23, contentText: "Complete Shape hierarchy with virtual draw() function." },
  { title: "Output Animation", component: Scene24, contentText: "Drawing Circle, Drawing Rectangle - same pointer, different behavior!" },
  { title: "Function Overriding", component: Scene25, contentText: "Circle replaces Shape's draw(). Same name, same signature, new behavior." },
  { title: "Memory Leak Story", component: Scene26, contentText: "Shape* p = new Circle(); delete p; - Only Shape destructor runs. Memory leaking!" },
  { title: "Fix: Virtual Destructor", component: Scene27, contentText: "virtual ~Shape() {} - Now Circle destructor runs first, then Shape. Memory safe!" },
  { title: "Side by Side Comparison", component: Scene28, contentText: "Operator Overloading vs Virtual Function comparison table." },
  { title: "Tradeoff Discussion", component: Scene29, contentText: "Balance scale: Performance vs Flexibility. What are you optimizing for?" },
  { title: "C++ Philosophy", component: Scene30, contentText: "Low-level control + High-level abstraction. This is why C++ is powerful." },
  { title: "Exam-Oriented Summary", component: Scene31, contentText: "Operator overloading = Compile time. Virtual function = Runtime. Dynamic binding = Late decision." },
  { title: "Closing Frame", component: Scene32, contentText: "Two faces of Polymorphism: Clean & Intelligent. One language. Two superpowers." },
];
