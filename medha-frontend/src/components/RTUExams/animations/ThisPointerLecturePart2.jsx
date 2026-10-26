/**
 * ThisPointerLecturePart2.jsx - Scenes 11-19
 * Destructor Order, Friend Functions, Friend Class
 */
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { colors, containerStyle } from "./VirtualFunctionsTheme";
import { GlassCard, CodeBlock } from "./ThisPointerLecture";

// ============================================
// SCENE 11: Destructor Call Order
// ============================================
const Scene11 = () => {
  const code = `void function() {
    Sample obj1;  // Created first
    Sample obj2;  // Created second
    Sample obj3;  // Created third
}
// Destructors: obj3 → obj2 → obj1`;
  const [phase, setPhase] = useState(0);
  useEffect(() => { const t = [setTimeout(() => setPhase(1), 600), setTimeout(() => setPhase(2), 1200), setTimeout(() => setPhase(3), 1800)]; return () => t.forEach(clearTimeout); }, []);
  return (
    <div style={containerStyle}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: colors.warning, fontWeight: 700, fontSize: "13px", letterSpacing: "1.5px", marginBottom: "1rem" }}>📚 DESTRUCTOR CALL ORDER (LIFO)</motion.div>
      <div style={{ display: "flex", gap: "2rem", alignItems: "center" }}>
        <GlassCard style={{ maxWidth: "320px" }}><CodeBlock code={code} /></GlassCard>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: phase >= 1 ? 1 : 0, x: 0 }} style={{ padding: "10px 20px", borderRadius: "10px", background: `${colors.success}15`, border: `1px solid ${colors.success}` }}>
            <span style={{ color: colors.success, fontSize: "11px" }}>✓ Created: obj1 → obj2 → obj3</span>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: phase >= 2 ? 1 : 0, x: 0 }} style={{ padding: "10px 20px", borderRadius: "10px", background: `${colors.danger}15`, border: `1px solid ${colors.danger}` }}>
            <span style={{ color: colors.danger, fontSize: "11px" }}>💥 Destroyed: obj3 → obj2 → obj1</span>
          </motion.div>
          <AnimatePresence>{phase >= 3 && <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} style={{ padding: "12px 16px", borderRadius: "12px", background: `${colors.accent}15`, border: `2px solid ${colors.accent}`, textAlign: "center" }}>
            <div style={{ color: colors.accent, fontWeight: 700, fontSize: "12px" }}>LIFO Stack</div>
            <div style={{ color: colors.textSec, fontSize: "10px" }}>Last In, First Out</div>
          </motion.div>}</AnimatePresence>
        </div>
      </div>
    </div>
  );
};

// ============================================
// SCENE 12: Encapsulation Principle
// ============================================
const Scene12 = () => {
  const [phase, setPhase] = useState(0);
  useEffect(() => { const t = [setTimeout(() => setPhase(1), 600)]; return () => t.forEach(clearTimeout); }, []);
  return (
    <div style={containerStyle}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: colors.primary, fontWeight: 700, fontSize: "13px", letterSpacing: "1.5px", marginBottom: "1.5rem" }}>🔒 ENCAPSULATION PRINCIPLE</motion.div>
      <div style={{ display: "flex", gap: "2.5rem" }}>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ padding: "24px", borderRadius: "20px", background: `${colors.danger}15`, border: `3px solid ${colors.danger}`, textAlign: "center" }}>
          <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }} style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>🔐</motion.div>
          <div style={{ color: colors.danger, fontWeight: 700, fontSize: "14px" }}>Private</div>
          <div style={{ color: colors.textSec, fontSize: "10px", marginTop: "0.3rem" }}>Hidden data</div>
        </motion.div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 1 ? 1 : 0 }} style={{ padding: "24px", borderRadius: "20px", background: `${colors.success}15`, border: `3px solid ${colors.success}`, textAlign: "center" }}>
          <div style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>🌐</div>
          <div style={{ color: colors.success, fontWeight: 700, fontSize: "14px" }}>Public</div>
          <div style={{ color: colors.textSec, fontSize: "10px", marginTop: "0.3rem" }}>Interface exposed</div>
        </motion.div>
      </div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 1 ? 1 : 0 }} style={{ marginTop: "1.5rem", padding: "10px 24px", borderRadius: "100px", background: `${colors.primary}15` }}>
        <span style={{ color: colors.primary, fontSize: "12px" }}>Protection from external access 🛡️</span>
      </motion.div>
    </div>
  );
};

// ============================================
// SCENE 13: Friend Function - The Problem
// ============================================
const Scene13 = () => {
  const code = `class A {
    int x;  // Private
};

void show(A obj) {
    cout << obj.x;  // ERROR! Cannot access
}`;
  const [phase, setPhase] = useState(0);
  useEffect(() => { const t = [setTimeout(() => setPhase(1), 800)]; return () => t.forEach(clearTimeout); }, []);
  return (
    <div style={containerStyle}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: colors.danger, fontWeight: 700, fontSize: "13px", letterSpacing: "1.5px", marginBottom: "1rem" }}>🚫 FRIEND FUNCTION: THE PROBLEM</motion.div>
      <div style={{ display: "flex", gap: "2rem", alignItems: "center" }}>
        <GlassCard glow={colors.danger} style={{ maxWidth: "300px" }}><CodeBlock code={code} /></GlassCard>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 1 ? 1 : 0 }} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" }}>
          <motion.div animate={{ x: [-5, 5, -5] }} transition={{ duration: 0.4, repeat: Infinity }} style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <div style={{ fontSize: "2rem" }}>🚪</div>
            <div style={{ fontSize: "1.5rem" }}>🔒</div>
          </motion.div>
          <div style={{ padding: "12px 20px", borderRadius: "12px", background: `${colors.danger}20`, border: `2px solid ${colors.danger}` }}>
            <div style={{ color: colors.danger, fontWeight: 600, fontSize: "12px" }}>ACCESS DENIED</div>
            <div style={{ color: colors.textSec, fontSize: "10px" }}>Normal functions can't access private</div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

// ============================================
// SCENE 14: Friend Function - The Solution
// ============================================
const Scene14 = () => {
  const code = `class A {
    int x;
    A() { x = 10; }
    friend void show(A obj);  // Friend!
};

void show(A obj) {
    cout << obj.x;  // Now accessible!
}`;
  const [phase, setPhase] = useState(0);
  useEffect(() => { const t = [setTimeout(() => setPhase(1), 800)]; return () => t.forEach(clearTimeout); }, []);
  return (
    <div style={containerStyle}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: colors.success, fontWeight: 700, fontSize: "13px", letterSpacing: "1.5px", marginBottom: "1rem" }}>🤝 FRIEND FUNCTION: THE SOLUTION</motion.div>
      <div style={{ display: "flex", gap: "2rem", alignItems: "flex-start" }}>
        <GlassCard glow={colors.success} style={{ maxWidth: "340px" }}><CodeBlock code={code} /></GlassCard>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 1 ? 1 : 0 }} style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
          <motion.div animate={{ rotate: [0, 5, -5, 0] }} transition={{ duration: 2, repeat: Infinity }} style={{ fontSize: "2.5rem", textAlign: "center" }}>🔑</motion.div>
          {[
            { icon: "✓", text: "Declared with friend keyword" },
            { icon: "✓", text: "Not a member function" },
            { icon: "✓", text: "Has access to private members" },
            { icon: "✓", text: "Pass object as parameter" },
          ].map((item, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span style={{ color: colors.success }}>{item.icon}</span>
              <span style={{ fontSize: "10px", color: colors.textSec }}>{item.text}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

// ============================================
// SCENE 15: Friend Class
// ============================================
const Scene15 = () => {
  const code = `class B;  // Forward declaration

class A {
    int privateData;
    friend class B;  // B is friend of A
};

class B {
    void access(A &obj) {
        obj.privateData = 100;  // Full access!
    }
};`;
  const [phase, setPhase] = useState(0);
  useEffect(() => { const t = [setTimeout(() => setPhase(1), 800)]; return () => t.forEach(clearTimeout); }, []);
  return (
    <div style={containerStyle}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: colors.accent, fontWeight: 700, fontSize: "13px", letterSpacing: "1.5px", marginBottom: "1rem" }}>🏢 FRIEND CLASS</motion.div>
      <div style={{ display: "flex", gap: "2rem", alignItems: "flex-start" }}>
        <GlassCard style={{ maxWidth: "340px" }}><CodeBlock code={code} fontSize="9px" /></GlassCard>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 1 ? 1 : 0 }} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <div style={{ padding: "12px 20px", borderRadius: "12px", background: `${colors.primary}15`, border: `1px solid ${colors.primary}`, textAlign: "center" }}>
              <div style={{ fontWeight: 700, color: colors.primary }}>Class A</div>
            </div>
            <motion.div animate={{ x: [0, 10, 0] }} transition={{ duration: 1, repeat: Infinity }} style={{ fontSize: "1.5rem" }}>➡️</motion.div>
            <div style={{ padding: "12px 20px", borderRadius: "12px", background: `${colors.accent}15`, border: `2px solid ${colors.accent}`, textAlign: "center" }}>
              <div style={{ fontWeight: 700, color: colors.accent }}>Class B 🔑</div>
            </div>
          </div>
          <div style={{ padding: "10px 16px", borderRadius: "10px", background: `${colors.warning}15`, border: `1px solid ${colors.warning}` }}>
            <div style={{ color: colors.warning, fontSize: "11px", fontWeight: 600 }}>⚠️ Friendship NOT mutual</div>
            <div style={{ color: colors.textSec, fontSize: "10px" }}>B can access A, but A can't access B</div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

// ============================================
// SCENE 16: Friend - Warning & Dangers
// ============================================
const Scene16 = () => {
  const [phase, setPhase] = useState(0);
  useEffect(() => { const t = [setTimeout(() => setPhase(1), 400), setTimeout(() => setPhase(2), 800), setTimeout(() => setPhase(3), 1200)]; return () => t.forEach(clearTimeout); }, []);
  const dangers = [
    { text: "Breaks encapsulation", icon: "🔓" },
    { text: "Creates tight coupling", icon: "🔗" },
    { text: "Hard to maintain", icon: "⚙️" },
    { text: "Use sparingly", icon: "⚠️" },
  ];
  return (
    <div style={containerStyle}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: colors.danger, fontWeight: 700, fontSize: "13px", letterSpacing: "1.5px", marginBottom: "1.5rem" }}>⚠️ FRIEND: WARNINGS & DANGERS</motion.div>
      <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 1, repeat: Infinity }} style={{ fontSize: "3rem", textAlign: "center", marginBottom: "1rem" }}>⚠️</motion.div>
      <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
        {dangers.map((d, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: phase > i ? 1 : 0, y: 0 }} style={{ padding: "12px 16px", borderRadius: "12px", background: `${colors.danger}15`, border: `1px solid ${colors.danger}30`, textAlign: "center" }}>
            <div style={{ fontSize: "1.3rem", marginBottom: "0.3rem" }}>{d.icon}</div>
            <div style={{ color: colors.danger, fontSize: "10px", fontWeight: 600 }}>{d.text}</div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// ============================================
// SCENE 17: Summary - Three Pillars
// ============================================
const Scene17 = () => {
  const [phase, setPhase] = useState(0);
  useEffect(() => { const t = [setTimeout(() => setPhase(1), 400), setTimeout(() => setPhase(2), 800), setTimeout(() => setPhase(3), 1200)]; return () => t.forEach(clearTimeout); }, []);
  const pillars = [
    { icon: "👆", label: "this Pointer", desc: "Self-Reference", color: colors.primary },
    { icon: "🔄", label: "Constructor/Destructor", desc: "Life Cycle", color: colors.success },
    { icon: "🤝", label: "friend", desc: "Controlled Access", color: colors.accent },
  ];
  return (
    <div style={containerStyle}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: colors.accent, fontWeight: 700, fontSize: "13px", letterSpacing: "1.5px", marginBottom: "2rem" }}>📊 SUMMARY: THREE PILLARS</motion.div>
      <div style={{ display: "flex", gap: "1.5rem", justifyContent: "center" }}>
        {pillars.map((p, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 30 }} animate={{ opacity: phase > i ? 1 : 0, y: 0 }} style={{ padding: "20px 24px", borderRadius: "16px", background: `${p.color}15`, border: `2px solid ${p.color}`, textAlign: "center", minWidth: "130px" }}>
            <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>{p.icon}</div>
            <div style={{ color: p.color, fontWeight: 700, fontSize: "12px" }}>{p.label}</div>
            <div style={{ color: colors.textSec, fontSize: "10px", marginTop: "0.5rem" }}>{p.desc}</div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// ============================================
// SCENE 18: Real-World Connections
// ============================================
const Scene18 = () => {
  const [phase, setPhase] = useState(0);
  useEffect(() => { const t = [setTimeout(() => setPhase(1), 600)]; return () => t.forEach(clearTimeout); }, []);
  const connections = [
    { concept: "this", realWorld: "Self-awareness in identity systems", icon: "🪪" },
    { concept: "Constructor/Destructor", realWorld: "Setup/cleanup in workflows", icon: "⚙️" },
    { concept: "friend", realWorld: "Trusted access in security systems", icon: "🔐" },
  ];
  return (
    <div style={containerStyle}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: colors.primary, fontWeight: 700, fontSize: "13px", letterSpacing: "1.5px", marginBottom: "1.5rem" }}>🌍 REAL-WORLD CONNECTIONS</motion.div>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
        {connections.map((c, i) => (
          <motion.div key={i} initial={{ opacity: 0, x: -30 }} animate={{ opacity: phase >= 1 ? 1 : 0, x: 0 }} transition={{ delay: i * 0.15 }} style={{ padding: "12px 20px", borderRadius: "12px", background: `${colors.primary}10`, display: "flex", alignItems: "center", gap: "1rem" }}>
            <span style={{ fontSize: "1.5rem" }}>{c.icon}</span>
            <div>
              <div style={{ color: colors.primary, fontWeight: 600, fontSize: "12px" }}>{c.concept}</div>
              <div style={{ color: colors.textSec, fontSize: "10px" }}>{c.realWorld}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// ============================================
// SCENE 19: Final Thought & Conclusion
// ============================================
const Scene19 = () => {
  const [phase, setPhase] = useState(0);
  useEffect(() => { const t = [setTimeout(() => setPhase(1), 600), setTimeout(() => setPhase(2), 1200)]; return () => t.forEach(clearTimeout); }, []);
  return (
    <div style={containerStyle}>
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }} style={{ marginBottom: "1.5rem", textAlign: "center" }}>
        <motion.div animate={{ rotate: [0, 360] }} transition={{ duration: 3, repeat: Infinity, ease: "linear" }} style={{ fontSize: "4rem", marginBottom: "0.5rem" }}>🏆</motion.div>
        <div style={{ color: colors.accent, fontWeight: 700, fontSize: "1.3rem" }}>Concepts Mastered!</div>
      </motion.div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 1 ? 1 : 0 }} style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginBottom: "1.5rem" }}>
        {["✓ Write robust C++ code", "✓ Manage object lifecycles", "✓ Design maintainable systems"].map((t, i) => (
          <motion.div key={i} initial={{ x: -20 }} animate={{ x: 0 }} transition={{ delay: i * 0.1 }} style={{ padding: "10px 20px", borderRadius: "10px", background: `${colors.success}10`, color: colors.success, fontSize: "12px", textAlign: "center" }}>{t}</motion.div>
        ))}
      </motion.div>
      <AnimatePresence>{phase >= 2 && <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ padding: "14px 32px", borderRadius: "100px", background: `linear-gradient(135deg, ${colors.accent}20, ${colors.primary}10)`, border: `1px solid ${colors.accent}40`, textAlign: "center" }}>
        <span style={{ color: colors.text }}>"Master these to become a </span><span style={{ color: colors.accent, fontWeight: 700 }}>C++ Expert</span>"
      </motion.div>}</AnimatePresence>
    </div>
  );
};

// Export Part 2 scenes
export const ThisPointerScenesPart2 = [
  { title: "Destructor Call Order", component: Scene11, contentText: "LIFO: Last In, First Out. obj3 destroyed first, obj1 last. Stack-based storage." },
  { title: "Encapsulation Principle", component: Scene12, contentText: "Private data hidden, public interface exposed. Protection from external access." },
  { title: "Friend Function Problem", component: Scene13, contentText: "Normal functions can't access private members. Encapsulation prevents external access." },
  { title: "Friend Function Solution", component: Scene14, contentText: "friend keyword grants access. Declared inside class, has access to private members." },
  { title: "Friend Class", component: Scene15, contentText: "friend class B grants full access. All of B's functions can access A's private. NOT mutual!" },
  { title: "Friend Warnings", component: Scene16, contentText: "CAUTION: Breaks encapsulation, creates tight coupling, hard to maintain. Use sparingly!" },
  { title: "Summary: Three Pillars", component: Scene17, contentText: "this = Self-Reference, Constructor/Destructor = Life Cycle, friend = Controlled Access." },
  { title: "Real-World Connections", component: Scene18, contentText: "this = identity systems, Constructor/Destructor = workflows, friend = security systems." },
  { title: "Conclusion", component: Scene19, contentText: "Master these: Write robust code, manage lifecycles, design maintainable systems." },
];
