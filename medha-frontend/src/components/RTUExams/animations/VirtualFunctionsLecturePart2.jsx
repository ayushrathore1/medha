/**
 * VirtualFunctionsLecturePart2.jsx - Scenes 7-11
 * Override, VTable, Pure Virtual, Summary
 */
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { colors, containerStyle } from "./VirtualFunctionsTheme";
import { GlassCard, CodeBlock, Terminal } from "./VirtualFunctionsLecture";

// ============================================
// SCENE 7: Override Keyword
// ============================================
const Scene7 = () => {
  const codeWrong = `class Dog : public Animal {
public:
    void speek() {  // Typo!
        cout << "Dog barks";
    }
    // Compiles fine, WRONG function!
};`;
  const codeRight = `class Dog : public Animal {
public:
    void speek() override {
        cout << "Dog barks";
    }
    // Compiler ERROR! Bug caught!
};`;
  const [phase, setPhase] = useState(0);
  useEffect(() => { const t = [setTimeout(() => setPhase(1), 1000)]; return () => t.forEach(clearTimeout); }, []);
  return (
    <div style={containerStyle}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem" }}>
        <span style={{ color: colors.primary, fontWeight: 700, fontSize: "13px", letterSpacing: "1.5px" }}>🛡️ OVERRIDE KEYWORD</span>
        <span style={{ padding: "4px 12px", borderRadius: "100px", background: `${colors.primary}30`, color: colors.primary, fontSize: "10px", fontWeight: 600 }}>C++11</span>
      </motion.div>
      <div style={{ display: "flex", gap: "2rem" }}>
        <div>
          <div style={{ color: colors.danger, fontWeight: 600, marginBottom: "0.5rem", fontSize: "12px" }}>❌ Without override - Silent bug:</div>
          <GlassCard glow={colors.danger} style={{ maxWidth: "300px" }}><CodeBlock code={codeWrong} fontSize="9px" /></GlassCard>
        </div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 1 ? 1 : 0 }}>
          <div style={{ color: colors.success, fontWeight: 600, marginBottom: "0.5rem", fontSize: "12px" }}>✓ With override - Bug caught:</div>
          <GlassCard glow={colors.success} style={{ maxWidth: "300px" }}><CodeBlock code={codeRight} fontSize="9px" /></GlassCard>
        </motion.div>
      </div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 1 ? 1 : 0 }} style={{ marginTop: "1.5rem", color: colors.textSec, fontSize: "13px" }}>
        <span style={{ color: colors.primary, fontWeight: 600 }}>Best Practice:</span> Always use <span style={{ color: colors.success }}>override</span> keyword for safety
      </motion.div>
    </div>
  );
};

// ============================================
// SCENE 8: VTable Mechanism
// ============================================
const Scene8 = () => {
  const [phase, setPhase] = useState(0);
  useEffect(() => { const t = [setTimeout(() => setPhase(1), 600), setTimeout(() => setPhase(2), 1200), setTimeout(() => setPhase(3), 2000)]; return () => t.forEach(clearTimeout); }, []);
  return (
    <div style={containerStyle}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: colors.accent, fontWeight: 700, fontSize: "13px", letterSpacing: "1.5px", marginBottom: "1.5rem" }}>⚙️ VTABLE MECHANISM - Under the Hood</motion.div>
      <div style={{ display: "flex", gap: "3rem", alignItems: "flex-start" }}>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div style={{ color: colors.textSec, fontSize: "12px", fontWeight: 600 }}>Animal's VTable:</div>
          <div style={{ padding: "16px", borderRadius: "12px", background: `${colors.baseClass}15`, border: `1px solid ${colors.baseClass}`, fontFamily: "monospace", fontSize: "10px" }}>
            <div>speak() → <span style={{ color: colors.baseClass }}>Animal::speak</span></div>
            <div>eat() → <span style={{ color: colors.baseClass }}>Animal::eat</span></div>
          </div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 1 ? 1 : 0 }}>
            <div style={{ color: colors.textSec, fontSize: "12px", fontWeight: 600 }}>Dog's VTable:</div>
            <div style={{ padding: "16px", borderRadius: "12px", background: `${colors.derivedClass}15`, border: `1px solid ${colors.derivedClass}`, fontFamily: "monospace", fontSize: "10px" }}>
              <div>speak() → <span style={{ color: colors.success }}>Dog::speak</span></div>
              <div>eat() → <span style={{ color: colors.baseClass }}>Animal::eat</span></div>
            </div>
          </motion.div>
        </motion.div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 2 ? 1 : 0 }} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div style={{ color: colors.accent, fontSize: "12px", fontWeight: 600 }}>Runtime Steps:</div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {["1. Access object via pointer", "2. Follow object's VPTR", "3. Navigate to VTable", "4. Lookup function address", "5. Execute correct version"].map((step, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: 20 }} animate={{ opacity: phase >= 2 ? 1 : 0, x: 0 }} transition={{ delay: i * 0.1 }} style={{ padding: "8px 16px", borderRadius: "8px", background: `${colors.accent}10`, fontSize: "11px", color: colors.text }}>
                {step}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
      <AnimatePresence>{phase >= 3 && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ marginTop: "1.5rem", color: colors.textSec, fontSize: "12px" }}>
        <span style={{ color: colors.warning }}>Performance:</span> Minor overhead (1-2 memory accesses), negligible on modern CPUs
      </motion.div>}</AnimatePresence>
    </div>
  );
};

// ============================================
// SCENE 9: Pure Virtual & Abstract Classes
// ============================================
const Scene9 = () => {
  const code = `class Shape {
public:
    virtual void area() = 0;  // Pure virtual
    virtual ~Shape() { }
};

// Shape s;  // ERROR! Cannot instantiate

class Rectangle : public Shape {
public:
    void area() override {  // MUST implement
        cout << "Rectangle area" << endl;
    }
};

class Triangle : public Shape {
    // No area() - Triangle is also abstract!
};

// Triangle t;  // ERROR! Still abstract`;
  const [phase, setPhase] = useState(0);
  useEffect(() => { const t = [setTimeout(() => setPhase(1), 800)]; return () => t.forEach(clearTimeout); }, []);
  return (
    <div style={containerStyle}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: colors.warning, fontWeight: 700, fontSize: "13px", letterSpacing: "1.5px", marginBottom: "1rem" }}>📋 PURE VIRTUAL & ABSTRACT CLASSES</motion.div>
      <div style={{ display: "flex", gap: "2rem", alignItems: "flex-start" }}>
        <GlassCard style={{ maxWidth: "400px" }}><CodeBlock code={code} fontSize="9px" /></GlassCard>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 1 ? 1 : 0 }} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div style={{ padding: "16px 24px", borderRadius: "16px", background: `${colors.warning}15`, border: `2px solid ${colors.warning}` }}>
            <div style={{ color: colors.warning, fontWeight: 700 }}>= 0</div>
            <div style={{ color: colors.textSec, fontSize: "11px" }}>Makes function pure virtual</div>
          </div>
          <div style={{ padding: "16px 24px", borderRadius: "16px", background: `${colors.danger}15`, border: `2px solid ${colors.danger}` }}>
            <div style={{ color: colors.danger, fontWeight: 700 }}>Abstract Class</div>
            <div style={{ color: colors.textSec, fontSize: "11px" }}>Cannot be instantiated</div>
          </div>
          <div style={{ padding: "16px 24px", borderRadius: "16px", background: `${colors.success}15`, border: `2px solid ${colors.success}` }}>
            <div style={{ color: colors.success, fontWeight: 700 }}>Interface Contract</div>
            <div style={{ color: colors.textSec, fontSize: "11px" }}>Forces implementation</div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

// ============================================
// SCENE 10: Summary & Best Practices
// ============================================
const Scene10 = () => {
  const [phase, setPhase] = useState(0);
  useEffect(() => { const t = [setTimeout(() => setPhase(1), 400), setTimeout(() => setPhase(2), 800), setTimeout(() => setPhase(3), 1200), setTimeout(() => setPhase(4), 1600), setTimeout(() => setPhase(5), 2000)]; return () => t.forEach(clearTimeout); }, []);
  const practices = [
    { icon: "✅", text: "Always declare base destructor as virtual", color: colors.success },
    { icon: "✅", text: "Use 'override' in derived classes", color: colors.success },
    { icon: "✅", text: "Use = 0 for interface contracts", color: colors.success },
    { icon: "✅", text: "Prefer virtual functions over type checking", color: colors.success },
    { icon: "❌", text: "Don't make everything virtual (performance)", color: colors.danger },
  ];
  return (
    <div style={containerStyle}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: colors.success, fontWeight: 700, fontSize: "13px", letterSpacing: "1.5px", marginBottom: "1.5rem" }}>📋 BEST PRACTICES CHECKLIST</motion.div>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
        {practices.map((p, i) => (
          <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: phase > i ? 1 : 0, x: 0 }} style={{ padding: "12px 20px", borderRadius: "12px", background: `${p.color}10`, border: `1px solid ${p.color}40`, display: "flex", alignItems: "center", gap: "1rem" }}>
            <span style={{ fontSize: "1.2rem" }}>{p.icon}</span>
            <span style={{ color: colors.text, fontSize: "13px" }}>{p.text}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// ============================================
// SCENE 11: Closing / Achievement
// ============================================
const Scene11 = () => {
  const [phase, setPhase] = useState(0);
  useEffect(() => { const t = [setTimeout(() => setPhase(1), 600), setTimeout(() => setPhase(2), 1500)]; return () => t.forEach(clearTimeout); }, []);
  const concepts = [
    { icon: "⚡", label: "Static vs Dynamic", color: colors.compileTime },
    { icon: "✨", label: "virtual keyword", color: colors.virtualColor },
    { icon: "⚙️", label: "VTable Mechanism", color: colors.accent },
    { icon: "📋", label: "Pure Virtual", color: colors.warning },
  ];
  return (
    <div style={containerStyle}>
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }} style={{ marginBottom: "2rem" }}>
        <div style={{ fontSize: "4rem", marginBottom: "0.5rem" }}>🏆</div>
        <div style={{ color: colors.success, fontWeight: 700, fontSize: "1.3rem" }}>Virtual Functions Mastered!</div>
      </motion.div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 1 ? 1 : 0 }} style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap", justifyContent: "center" }}>
        {concepts.map((c, i) => (
          <motion.div key={i} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: i * 0.1 }} style={{ padding: "16px 24px", borderRadius: "16px", background: `${c.color}15`, border: `1px solid ${c.color}40`, textAlign: "center" }}>
            <div style={{ fontSize: "1.8rem", marginBottom: "0.3rem" }}>{c.icon}</div>
            <div style={{ color: c.color, fontSize: "11px", fontWeight: 600 }}>{c.label}</div>
          </motion.div>
        ))}
      </motion.div>
      <AnimatePresence>{phase >= 2 && <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ marginTop: "2rem", padding: "16px 32px", borderRadius: "100px", background: `linear-gradient(135deg, ${colors.accent}20, ${colors.primary}10)`, border: `1px solid ${colors.accent}40` }}>
        <span style={{ color: colors.text }}>"</span><span style={{ color: colors.accent, fontWeight: 600 }}>Foundation of C++ Polymorphism</span><span style={{ color: colors.text }}>"</span>
      </motion.div>}</AnimatePresence>
    </div>
  );
};

// Export Part 2 scenes
export const LectureScenesPart2 = [
  { title: "Override Keyword", component: Scene7, contentText: "C++11 feature: 'override' catches typos at compile time. Without it, wrong function is silently created." },
  { title: "VTable Mechanism", component: Scene8, contentText: "Each class has VTable (function addresses). Each object has VPTR. Runtime: follow VPTR → lookup → call correct function." },
  { title: "Pure Virtual & Abstract", component: Scene9, contentText: "= 0 makes function pure virtual. Class becomes abstract. Derived MUST implement or remain abstract." },
  { title: "Best Practices", component: Scene10, contentText: "Always virtual destructor, use override, prefer virtual over type checking, don't over-virtualize." },
  { title: "Closing", component: Scene11, contentText: "Achievement unlocked! Mastered: Static vs Dynamic, virtual keyword, VTable mechanism, Pure Virtual." },
];
