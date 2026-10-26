/**
 * PolymorphismPart3 - Scenes 27-39
 * OOPS Unit 4: Polymorphism, Operator Overloading - One Shot Lecture
 * Covers: Polymorphism intro, types, operator overloading, compile-time poly
 */
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { colors, containerStyle } from "./ConstStaticUnit4Theme";
import { GlassCard, CodeBlock } from "./ConstStaticPart1";

// ============================================
// SCENE 27: Title Slide - Polymorphism
// ============================================
const Scene27 = () => {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 500),
      setTimeout(() => setPhase(2), 1500),
      setTimeout(() => setPhase(3), 2500),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div style={containerStyle}>
      {/* Background glow */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at center, rgba(10, 132, 255, 0.15) 0%, transparent 70%)",
        }}
      />

      {/* Floating symbols */}
      {phase >= 3 && (
        <>
          {["🔀", "➕", "✨", "🎯"].map((emoji, i) => (
            <motion.div
              key={emoji}
              initial={{ opacity: 0 }}
              animate={{
                opacity: 0.2,
                y: [0, -10, 0],
              }}
              transition={{
                opacity: { duration: 0.5 },
                y: { duration: 3 + i * 0.5, repeat: Infinity },
              }}
              style={{
                position: "absolute",
                left: `${15 + i * 22}%`,
                top: `${25 + (i % 2) * 40}%`,
                fontSize: "2rem",
              }}
            >
              {emoji}
            </motion.div>
          ))}
        </>
      )}

      {/* Main content */}
      <motion.div style={{ textAlign: "center", zIndex: 10 }}>
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: phase >= 1 ? 1 : 0, y: 0 }}
          style={{
            display: "inline-block",
            padding: "8px 20px",
            borderRadius: "100px",
            background: "rgba(10, 132, 255, 0.15)",
            marginBottom: "1.5rem",
            color: colors.primary,
            fontSize: "13px",
            fontWeight: 600,
            letterSpacing: "1.5px",
            border: `1px solid ${colors.primary}30`,
          }}
        >
          RTU OOP UNIT 4 — PART 2
        </motion.div>

        {/* Title - Letter by letter typing */}
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            fontSize: "4rem",
            fontWeight: 700,
            letterSpacing: "-0.03em",
            background: `linear-gradient(180deg, #FFFFFF 0%, ${colors.primary} 100%)`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            margin: 0,
          }}
        >
          {"Polymorphism".split("").map((char, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: phase >= 1 ? 1 : 0 }}
              transition={{ delay: 0.04 * i }}
            >
              {char}
            </motion.span>
          ))}
        </motion.h1>

        {/* Subtitle */}
        <AnimatePresence>
          {phase >= 2 && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                color: colors.secondary,
                fontSize: "1.4rem",
                marginTop: "1.2rem",
                fontWeight: 500,
              }}
            >
              One Name, Many Forms
            </motion.p>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

// ============================================
// SCENE 28: The Word Polymorphism
// ============================================
const Scene28 = () => {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 600),
      setTimeout(() => setPhase(2), 1500),
      setTimeout(() => setPhase(3), 2500),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div style={containerStyle}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "2.5rem" }}>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          style={{ color: colors.primary, fontWeight: 700, fontSize: "13px", letterSpacing: "1.5px" }}
        >
          📚 WORD BREAKDOWN
        </motion.div>

        <div style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: phase >= 1 ? 1 : 0, x: 0 }}
            style={{ padding: "20px 40px", borderRadius: "20px", background: `${colors.primary}20`, border: `2px solid ${colors.primary}`, textAlign: "center" }}
          >
            <div style={{ color: colors.primary, fontSize: "2rem", fontWeight: 700 }}>Poly</div>
            <div style={{ color: colors.textSec, fontSize: "14px" }}>= Many</div>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 2 ? 1 : 0 }}
            style={{ fontSize: "2rem", color: colors.textSec }}
          >+</motion.div>

          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: phase >= 2 ? 1 : 0, x: 0 }}
            style={{ padding: "20px 40px", borderRadius: "20px", background: `${colors.accent}20`, border: `2px solid ${colors.accent}`, textAlign: "center" }}
          >
            <div style={{ color: colors.accent, fontSize: "2rem", fontWeight: 700 }}>Morphism</div>
            <div style={{ color: colors.textSec, fontSize: "14px" }}>= Forms</div>
          </motion.div>
        </div>

        <AnimatePresence>
          {phase >= 3 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              style={{ padding: "20px 40px", borderRadius: "20px", background: `linear-gradient(135deg, ${colors.primary}, ${colors.accent})`, boxShadow: `0 10px 40px ${colors.primary}50` }}
            >
              <span style={{ color: "white", fontWeight: 700, fontSize: "1.3rem" }}>
                Polymorphism = One name, many forms
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// ============================================
// SCENE 29: Programming Meaning
// ============================================
const Scene29 = () => {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 500),
      setTimeout(() => setPhase(2), 1500),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  const shapes = [
    { name: "Circle", output: "Drawing Circle" },
    { name: "Rectangle", output: "Drawing Rectangle" },
    { name: "Triangle", output: "Drawing Triangle" },
  ];

  return (
    <div style={containerStyle}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "2rem" }}>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          style={{ color: colors.function, fontWeight: 700, fontSize: "13px", letterSpacing: "1.5px" }}
        >
          💻 IN PROGRAMMING
        </motion.div>

        {/* Same function name */}
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: phase >= 1 ? 1 : 0, scale: 1 }}
          style={{ padding: "16px 40px", borderRadius: "16px", background: `${colors.function}20`, border: `2px solid ${colors.function}` }}
        >
          <span style={{ color: colors.function, fontWeight: 700, fontSize: "1.5rem", fontFamily: "'SF Mono', monospace" }}>draw()</span>
        </motion.div>

        {/* Three objects with output */}
        <AnimatePresence>
          {phase >= 2 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: "flex", gap: "1.5rem" }}>
              {shapes.map((shape, i) => (
                <motion.div key={shape.name} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.2 }}
                  style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.75rem" }}
                >
                  <div style={{ padding: "12px 20px", borderRadius: "12px", background: `${colors.objectColor}15`, border: `2px solid ${colors.objectColor}` }}>
                    <span style={{ color: colors.objectColor, fontWeight: 600 }}>{shape.name}</span>
                  </div>
                  <motion.div animate={{ y: [0, 5, 0] }} transition={{ duration: 1, repeat: Infinity }} style={{ color: colors.textSec }}>↓</motion.div>
                  <div style={{ padding: "10px 16px", borderRadius: "8px", background: "#1c1c1e", border: "1px solid rgba(255,255,255,0.1)" }}>
                    <span style={{ color: colors.string, fontSize: "13px", fontStyle: "italic" }}>"{shape.output}"</span>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// ============================================
// SCENE 30: Types of Polymorphism
// ============================================
const Scene30 = () => {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 500),
      setTimeout(() => setPhase(2), 1200),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div style={containerStyle}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "2rem" }}>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          style={{ color: colors.accent, fontWeight: 700, fontSize: "13px", letterSpacing: "1.5px" }}
        >
          🌳 TYPES OF POLYMORPHISM
        </motion.div>

        <div style={{ display: "flex", gap: "3rem" }}>
          {/* Compile Time */}
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: phase >= 1 ? 1 : 0, x: 0 }}
            style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" }}
          >
            <div style={{ padding: "16px 28px", borderRadius: "16px", background: `${colors.success}20`, border: `2px solid ${colors.success}`, display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span style={{ fontSize: "1.5rem" }}>🌿</span>
              <span style={{ color: colors.success, fontWeight: 700 }}>Compile Time</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {["Function Overloading", "Operator Overloading"].map((item, i) => (
                <motion.div key={item} initial={{ opacity: 0 }} animate={{ opacity: phase >= 2 ? 1 : 0 }} transition={{ delay: i * 0.2 }}
                  style={{ padding: "10px 20px", borderRadius: "10px", background: "rgba(28, 28, 30, 0.8)", border: "1px solid rgba(255,255,255,0.1)" }}
                >
                  <span style={{ color: colors.textSec, fontSize: "13px" }}>{item}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Run Time */}
          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: phase >= 1 ? 1 : 0, x: 0 }}
            style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" }}
          >
            <div style={{ padding: "16px 28px", borderRadius: "16px", background: `${colors.warning}20`, border: `2px solid ${colors.warning}`, display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span style={{ fontSize: "1.5rem" }}>🌳</span>
              <span style={{ color: colors.warning, fontWeight: 700 }}>Run Time</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {["Virtual Function", "Dynamic Binding"].map((item, i) => (
                <motion.div key={item} initial={{ opacity: 0 }} animate={{ opacity: phase >= 2 ? 1 : 0 }} transition={{ delay: i * 0.2 }}
                  style={{ padding: "10px 20px", borderRadius: "10px", background: "rgba(28, 28, 30, 0.8)", border: "1px solid rgba(255,255,255,0.1)" }}
                >
                  <span style={{ color: colors.textSec, fontSize: "13px" }}>{item}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

// ============================================
// SCENE 31: Focus on Operator Overloading
// ============================================
const Scene31 = () => {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 600),
      setTimeout(() => setPhase(2), 1800),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div style={containerStyle}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "2rem" }}>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          style={{ color: colors.warning, fontWeight: 700, fontSize: "13px", letterSpacing: "1.5px" }}
        >
          🤖 THE PROBLEM WITH OBJECTS
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: phase >= 1 ? 1 : 0, scale: 1 }}>
          <GlassCard>
            <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", fontFamily: "'SF Mono', monospace", fontSize: "1.5rem" }}>
              <span style={{ color: colors.primary }}>(2 + 3i)</span>
              <span style={{ color: colors.accent, fontWeight: 700 }}>+</span>
              <span style={{ color: colors.primary }}>(4 + 5i)</span>
            </div>
          </GlassCard>
        </motion.div>

        <AnimatePresence>
          {phase >= 2 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" }}
            >
              <div style={{ fontSize: "4rem" }}>🤖❓</div>
              <div style={{ padding: "14px 28px", borderRadius: "100px", background: `${colors.danger}15`, border: `1px solid ${colors.danger}40`, color: colors.danger, fontWeight: 600 }}>
                C++ does not know how to add objects!
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// ============================================
// SCENE 32: Without Operator Overloading
// ============================================
const Scene32 = () => {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [setTimeout(() => setPhase(1), 500)];
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div style={containerStyle}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "2rem" }}>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          style={{ color: colors.danger, fontWeight: 700, fontSize: "13px", letterSpacing: "1.5px" }}
        >
          😕 WITHOUT OPERATOR OVERLOADING
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: phase >= 1 ? 1 : 0, scale: 1 }}>
          <GlassCard glow={colors.danger}>
            <div style={{ fontFamily: "'SF Mono', monospace", fontSize: "1.5rem", color: colors.text }}>
              c3 = c1.<span style={{ color: colors.function }}>add</span>(c2);
              <span style={{ color: colors.danger, fontSize: "1rem", marginLeft: "1rem" }}>// ugly and unnatural</span>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
};

// ============================================
// SCENE 33: With Operator Overloading
// ============================================
const Scene33 = () => {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [setTimeout(() => setPhase(1), 500)];
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div style={containerStyle}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "2rem" }}>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          style={{ color: colors.success, fontWeight: 700, fontSize: "13px", letterSpacing: "1.5px" }}
        >
          ✨ WITH OPERATOR OVERLOADING
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: phase >= 1 ? 1 : 0, scale: 1 }}>
          <GlassCard glow={colors.success}>
            <div style={{ fontFamily: "'SF Mono', monospace", fontSize: "1.5rem", color: colors.text }}>
              c3 = c1 <span style={{ color: colors.accent, fontWeight: 700 }}>+</span> c2;
              <span style={{ color: colors.success, fontSize: "1rem", marginLeft: "1rem" }}>// clean and natural</span>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
};

// ============================================
// SCENE 34: Operator Overloading Full Program
// ============================================
const Scene34 = () => {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [setTimeout(() => setPhase(1), 500)];
    return () => timers.forEach(clearTimeout);
  }, []);

  const code = `#include <iostream>
using namespace std;

class Complex {
    int real, imag;

public:
    Complex(int r = 0, int i = 0) {
        real = r;
        imag = i;
    }

    Complex operator + (Complex c) {
        Complex temp;
        temp.real = real + c.real;
        temp.imag = imag + c.imag;
        return temp;
    }

    void display() {
        cout << real << " + " << imag << "i" << endl;
    }
};

int main() {
    Complex c1(2, 3), c2(4, 5);
    Complex c3 = c1 + c2;
    c3.display();
    return 0;
}`;

  return (
    <div style={containerStyle}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" }}>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          style={{ color: colors.primary, fontWeight: 700, fontSize: "13px", letterSpacing: "1.5px" }}
        >
          📝 OPERATOR OVERLOADING PROGRAM
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: phase >= 1 ? 1 : 0, y: 0 }}>
          <GlassCard style={{ maxWidth: "600px", padding: "1.5rem" }}>
            <CodeBlock code={code} />
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
};

// ============================================
// SCENE 35: How Compiler Converts It
// ============================================
const Scene35 = () => {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 600),
      setTimeout(() => setPhase(2), 1800),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div style={containerStyle}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "2rem" }}>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          style={{ color: colors.secondary, fontWeight: 700, fontSize: "13px", letterSpacing: "1.5px" }}
        >
          ⚙️ COMPILER CONVERSION
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: phase >= 1 ? 1 : 0, scale: 1 }}>
          <GlassCard>
            <div style={{ fontFamily: "'SF Mono', monospace", fontSize: "1.5rem", color: colors.text }}>
              c1 <span style={{ color: colors.accent, fontWeight: 700 }}>+</span> c2
            </div>
          </GlassCard>
        </motion.div>

        <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 1, repeat: Infinity }} style={{ fontSize: "2rem", color: colors.secondary }}>⇓</motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: phase >= 2 ? 1 : 0, scale: 1 }}>
          <GlassCard glow={colors.secondary}>
            <div style={{ fontFamily: "'SF Mono', monospace", fontSize: "1.5rem", color: colors.text }}>
              c1.<span style={{ color: colors.function }}>operator+</span>(c2)
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
};

// ============================================
// SCENE 36: Operator Overloading Rules
// ============================================
const Scene36 = () => {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 400),
      setTimeout(() => setPhase(2), 800),
      setTimeout(() => setPhase(3), 1200),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  const rules = [
    { icon: "❌", text: "Cannot overload: ::, ., sizeof, ?:", color: colors.danger },
    { icon: "✅", text: "At least one operand must be object", color: colors.success },
    { icon: "❌", text: "Cannot change precedence", color: colors.danger },
  ];

  return (
    <div style={containerStyle}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "2rem" }}>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          style={{ color: colors.warning, fontWeight: 700, fontSize: "13px", letterSpacing: "1.5px" }}
        >
          📜 OPERATOR OVERLOADING RULES
        </motion.div>

        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {rules.map((rule, i) => (
            <motion.div key={rule.text} initial={{ opacity: 0, x: -30 }} animate={{ opacity: phase > i ? 1 : 0, x: 0 }}
              style={{ padding: "16px 28px", borderRadius: "16px", background: `${rule.color}15`, border: `2px solid ${rule.color}`, display: "flex", alignItems: "center", gap: "1rem", minWidth: "400px" }}
            >
              <span style={{ fontSize: "1.5rem" }}>{rule.icon}</span>
              <span style={{ color: colors.text, fontWeight: 500 }}>{rule.text}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ============================================
// SCENE 37: Shift to Runtime World
// ============================================
const Scene37 = () => {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 500),
      setTimeout(() => setPhase(2), 1500),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div style={containerStyle}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "2rem" }}>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          style={{ color: colors.warning, fontWeight: 700, fontSize: "13px", letterSpacing: "1.5px" }}
        >
          🎯 SHIFT TO RUNTIME WORLD
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: phase >= 1 ? 1 : 0, scale: 1 }} style={{ position: "relative" }}>
          <GlassCard glow={colors.warning}>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <div style={{ fontFamily: "'SF Mono', monospace", fontSize: "1.3rem", color: colors.text }}>
                <span style={{ color: colors.keyword }}>Base</span>* b
              </div>
              <motion.div animate={{ x: [0, 10, -10, 0] }} transition={{ duration: 2, repeat: Infinity }} style={{ fontSize: "2rem" }}>🎯</motion.div>
            </div>
          </GlassCard>
        </motion.div>

        <AnimatePresence>
          {phase >= 2 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              style={{ color: colors.textSec, fontSize: "1.1rem", textAlign: "center" }}
            >
              A base pointer that keeps <span style={{ color: colors.warning, fontWeight: 700 }}>changing</span> what it points to
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// ============================================
// SCENE 38: Base & Derived Setup
// ============================================
const Scene38 = () => {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [setTimeout(() => setPhase(1), 500)];
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div style={containerStyle}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "2rem" }}>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          style={{ color: colors.classColor, fontWeight: 700, fontSize: "13px", letterSpacing: "1.5px" }}
        >
          📦 BASE & DERIVED SETUP
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 1 ? 1 : 0 }}
          style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" }}
        >
          {/* Base class */}
          <div style={{ padding: "20px 60px", borderRadius: "16px", background: `${colors.classColor}20`, border: `3px solid ${colors.classColor}` }}>
            <span style={{ color: colors.classColor, fontWeight: 700, fontSize: "1.2rem" }}>Base</span>
          </div>
          <div style={{ width: "3px", height: "30px", background: colors.objectColor }}></div>
          {/* Derived class */}
          <div style={{ padding: "20px 50px", borderRadius: "16px", background: `${colors.objectColor}20`, border: `3px solid ${colors.objectColor}` }}>
            <span style={{ color: colors.objectColor, fontWeight: 700, fontSize: "1.2rem" }}>Derived</span>
          </div>
        </motion.div>

        <GlassCard>
          <div style={{ fontFamily: "'SF Mono', monospace", fontSize: "1rem", color: colors.text }}>
            <span style={{ color: colors.keyword }}>class</span> <span style={{ color: colors.classColor }}>Base</span> {"{ }"};<br />
            <span style={{ color: colors.keyword }}>class</span> <span style={{ color: colors.objectColor }}>Derived</span> : <span style={{ color: colors.keyword }}>public</span> <span style={{ color: colors.classColor }}>Base</span> {"{ }"};
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

// ============================================
// SCENE 39: The Big Question
// ============================================
const Scene39 = () => {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 600),
      setTimeout(() => setPhase(2), 1800),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div style={containerStyle}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "2rem" }}>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          style={{ color: colors.accent, fontWeight: 700, fontSize: "13px", letterSpacing: "1.5px" }}
        >
          🤔 THE BIG QUESTION
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: phase >= 1 ? 1 : 0, scale: 1 }}>
          <GlassCard>
            <div style={{ fontFamily: "'SF Mono', monospace", fontSize: "1.3rem", color: colors.text }}>
              <span style={{ color: colors.classColor }}>Base</span>* b = &amp;d;
            </div>
          </GlassCard>
        </motion.div>

        <AnimatePresence>
          {phase >= 2 && (
            <motion.div initial={{ opacity: 0, scale: 1.2 }} animate={{ opacity: 1, scale: 1 }}
              style={{ padding: "20px 40px", borderRadius: "20px", background: `${colors.accent}20`, border: `2px solid ${colors.accent}` }}
            >
              <span style={{ color: colors.accent, fontSize: "1.5rem", fontWeight: 700 }}>
                Which function should run? 🤔
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// ============================================
// EXPORT ANIMATION STEPS
// ============================================
export const AnimationStepsPart3 = [
  { title: "Polymorphism", component: Scene27, contentText: "Welcome to RTU OOP Unit 4 Part 2! In this section, we'll explore Polymorphism - the concept of one name with many forms, including operator overloading and virtual functions." },
  { title: "The Word Polymorphism", component: Scene28, contentText: "Polymorphism = Poly (Many) + Morphism (Forms). One name, many forms. Different behaviors from the same interface." },
  { title: "Programming Meaning", component: Scene29, contentText: "Same function name draw() called on Circle, Rectangle, Triangle produces different outputs. Same interface, different implementations." },
  { title: "Types of Polymorphism", component: Scene30, contentText: "Compile Time: Function Overloading, Operator Overloading. Run Time: Virtual Function, Dynamic Binding." },
  { title: "Focus on Operator Overloading", component: Scene31, contentText: "Complex numbers (2+3i) + (4+5i). C++ doesn't know how to add custom objects - we need operator overloading!" },
  { title: "Without Operator Overloading", component: Scene32, contentText: "c3 = c1.add(c2); - This works but looks ugly and unnatural. We want mathematical notation!" },
  { title: "With Operator Overloading", component: Scene33, contentText: "c3 = c1 + c2; - Clean and natural! Operator overloading makes objects work like built-in types." },
  { title: "Operator Overloading Program", component: Scene34, contentText: "Complete Complex class with operator+ overloaded. The + operator is defined inside the class to add complex numbers." },
  { title: "Compiler Conversion", component: Scene35, contentText: "c1 + c2 is converted by compiler to c1.operator+(c2). The + symbol becomes a function call." },
  { title: "Operator Overloading Rules", component: Scene36, contentText: "Rules: Cannot overload ::, ., sizeof, ?:. At least one operand must be object. Cannot change precedence." },
  { title: "Shift to Runtime World", component: Scene37, contentText: "Base pointer that can point to different derived objects. This leads to runtime polymorphism." },
  { title: "Base & Derived Setup", component: Scene38, contentText: "class Base { }; class Derived : public Base { }; - Inheritance setup for polymorphism." },
  { title: "The Big Question", component: Scene39, contentText: "Base* b = &d; - When we call b->show(), which version runs? Base's or Derived's? This is the key question!" },
];

export default { AnimationStepsPart3 };
