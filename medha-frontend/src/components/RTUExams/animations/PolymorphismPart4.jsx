/**
 * PolymorphismPart4 - Scenes 40-52
 * OOPS Unit 4: Virtual Functions, Dynamic Binding - One Shot Lecture
 * Covers: Virtual function demo, dynamic binding, runtime polymorphism, summary
 */
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { colors, containerStyle } from "./ConstStaticUnit4Theme";
import { GlassCard, CodeBlock } from "./ConstStaticPart1";

// ============================================
// SCENE 40: Without Virtual Function (Wrong Behavior)
// ============================================
const Scene40 = () => {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [setTimeout(() => setPhase(1), 500)];
    return () => timers.forEach(clearTimeout);
  }, []);

  const code = `#include <iostream>
using namespace std;

class Base {
public:
    void show() {
        cout << "This is Base class show()" << endl;
    }
};

class Derived : public Base {
public:
    void show() {
        cout << "This is Derived class show()" << endl;
    }
};

int main() {
    Base* b;
    Derived d;
    b = &d;
    b->show();   // calls Base version
}`;

  return (
    <div style={containerStyle}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" }}>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          style={{ color: colors.danger, fontWeight: 700, fontSize: "13px", letterSpacing: "1.5px" }}
        >
          ❌ WITHOUT VIRTUAL FUNCTION
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: phase >= 1 ? 1 : 0, y: 0 }}>
          <GlassCard style={{ maxWidth: "550px", padding: "1.5rem" }} glow={colors.danger}>
            <CodeBlock code={code} />
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
};

// ============================================
// SCENE 41: Output Shock
// ============================================
const Scene41 = () => {
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
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: phase >= 2 ? 1 : 0 }}
        style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at center, rgba(255, 69, 58, 0.15) 0%, transparent 70%)" }}
      />

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "2rem", zIndex: 10 }}>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          style={{ color: colors.danger, fontWeight: 700, fontSize: "13px", letterSpacing: "1.5px" }}
        >
          😵 OUTPUT SHOCK
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: phase >= 1 ? 1 : 0, scale: 1 }}>
          <GlassCard glow={colors.danger}>
            <div style={{ fontFamily: "'SF Mono', monospace", fontSize: "1.3rem", color: colors.text, padding: "1rem" }}>
              This is Base class show()
            </div>
          </GlassCard>
        </motion.div>

        <AnimatePresence>
          {phase >= 2 && (
            <motion.div initial={{ opacity: 0, scale: 1.5 }} animate={{ opacity: 1, scale: 1 }}
              style={{ display: "flex", alignItems: "center", gap: "1rem" }}
            >
              <span style={{ fontSize: "4rem" }}>😵</span>
              <div style={{ color: colors.danger, fontSize: "1.2rem", fontWeight: 600 }}>
                Expected Derived, got Base!
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// ============================================
// SCENE 42: Virtual Keyword Appears
// ============================================
const Scene42 = () => {
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
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: phase >= 2 ? 1 : 0 }}
        style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at center, rgba(191, 90, 242, 0.2) 0%, transparent 70%)" }}
      />

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "2.5rem", zIndex: 10 }}>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          style={{ color: colors.primary, fontWeight: 700, fontSize: "13px", letterSpacing: "1.5px" }}
        >
          ✨ THE MAGIC KEYWORD
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.5, rotate: -10 }} animate={{ opacity: phase >= 1 ? 1 : 0, scale: 1, rotate: 0 }}
          style={{ padding: "24px 50px", borderRadius: "20px", background: `linear-gradient(135deg, ${colors.primary}, ${colors.accent})`, boxShadow: `0 15px 50px ${colors.primary}50` }}
        >
          <span style={{ color: "white", fontWeight: 800, fontSize: "2rem", fontFamily: "'SF Mono', monospace" }}>virtual</span>
        </motion.div>

        <AnimatePresence>
          {phase >= 2 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <GlassCard glow={colors.success}>
                <div style={{ fontFamily: "'SF Mono', monospace", fontSize: "1.3rem", color: colors.text }}>
                  <span style={{ color: colors.primary, fontWeight: 700 }}>virtual</span> <span style={{ color: colors.keyword }}>void</span> <span style={{ color: colors.function }}>show</span>()
                </div>
              </GlassCard>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// ============================================
// SCENE 43: With Virtual Function (Correct)
// ============================================
const Scene43 = () => {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [setTimeout(() => setPhase(1), 500)];
    return () => timers.forEach(clearTimeout);
  }, []);

  const code = `#include <iostream>
using namespace std;

class Base {
public:
    virtual void show() {
        cout << "This is Base class show()" << endl;
    }
};

class Derived : public Base {
public:
    void show() {
        cout << "This is Derived class show()" << endl;
    }
};

int main() {
    Base* b;
    Derived d;
    b = &d;
    b->show();   // now calls Derived version
}`;

  return (
    <div style={containerStyle}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" }}>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          style={{ color: colors.success, fontWeight: 700, fontSize: "13px", letterSpacing: "1.5px" }}
        >
          ✅ WITH VIRTUAL FUNCTION
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: phase >= 1 ? 1 : 0, y: 0 }}>
          <GlassCard style={{ maxWidth: "550px", padding: "1.5rem" }} glow={colors.success}>
            <CodeBlock code={code} />
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
};

// ============================================
// SCENE 44: Correct Output
// ============================================
const Scene44 = () => {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [setTimeout(() => setPhase(1), 600)];
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div style={containerStyle}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at center, rgba(48, 209, 88, 0.15) 0%, transparent 70%)" }}
      />

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "2rem", zIndex: 10 }}>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          style={{ color: colors.success, fontWeight: 700, fontSize: "13px", letterSpacing: "1.5px" }}
        >
          ✅ CORRECT OUTPUT
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: phase >= 1 ? 1 : 0, scale: 1 }}>
          <GlassCard glow={colors.success}>
            <div style={{ fontFamily: "'SF Mono', monospace", fontSize: "1.5rem", color: colors.success, padding: "1rem" }}>
              This is Derived class show()
            </div>
          </GlassCard>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 1 ? 1 : 0 }}
          style={{ fontSize: "3rem" }}
        >
          🎉
        </motion.div>
      </div>
    </div>
  );
};

// ============================================
// SCENE 45: What Just Happened (Dynamic Binding)
// ============================================
const Scene45 = () => {
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
          ⚙️ WHAT JUST HAPPENED?
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 1 ? 1 : 0 }}
          style={{ display: "flex", alignItems: "center", gap: "2rem" }}
        >
          <div style={{ padding: "16px 28px", borderRadius: "16px", background: `${colors.warning}20`, border: `2px solid ${colors.warning}`, textAlign: "center" }}>
            <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>⏱️</div>
            <div style={{ color: colors.warning, fontWeight: 600 }}>Runtime</div>
          </div>
          
          <motion.div animate={{ x: [0, 10, 0] }} transition={{ duration: 1, repeat: Infinity }} style={{ fontSize: "2rem", color: colors.textSec }}>→</motion.div>
          
          <div style={{ padding: "16px 28px", borderRadius: "16px", background: `${colors.success}20`, border: `2px solid ${colors.success}`, textAlign: "center" }}>
            <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>⚙️</div>
            <div style={{ color: colors.success, fontWeight: 600 }}>Decision Made</div>
          </div>
        </motion.div>

        <AnimatePresence>
          {phase >= 2 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              style={{ padding: "16px 28px", borderRadius: "100px", background: `${colors.warning}15`, border: `1px solid ${colors.warning}40`, color: colors.text, fontWeight: 500 }}
            >
              Function call decided at <span style={{ color: colors.warning, fontWeight: 700 }}>runtime</span>, not compile time!
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// ============================================
// SCENE 46: Definition Card
// ============================================
const Scene46 = () => {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [setTimeout(() => setPhase(1), 500)];
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div style={containerStyle}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "2rem" }}>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          style={{ color: colors.accent, fontWeight: 700, fontSize: "13px", letterSpacing: "1.5px" }}
        >
          📖 DEFINITION
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: phase >= 1 ? 1 : 0, scale: 1 }}>
          <GlassCard glow={colors.accent} style={{ maxWidth: "600px", textAlign: "center" }}>
            <div style={{ fontSize: "1.5rem", fontWeight: 700, color: colors.accent, marginBottom: "1rem" }}>
              Dynamic Binding
            </div>
            <div style={{ color: colors.text, fontSize: "1.1rem", lineHeight: 1.6 }}>
              Function call linked at <span style={{ color: colors.warning, fontWeight: 600 }}>runtime</span> using{" "}
              <span style={{ color: colors.primary, fontWeight: 600 }}>virtual function</span> and{" "}
              <span style={{ color: colors.classColor, fontWeight: 600 }}>base pointer</span>.
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
};

// ============================================
// SCENE 47: Conditions for Dynamic Binding
// ============================================
const Scene47 = () => {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 400),
      setTimeout(() => setPhase(2), 800),
      setTimeout(() => setPhase(3), 1200),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  const conditions = [
    "Base class pointer",
    "Derived class object",
    "Virtual function",
  ];

  return (
    <div style={containerStyle}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "2rem" }}>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          style={{ color: colors.success, fontWeight: 700, fontSize: "13px", letterSpacing: "1.5px" }}
        >
          ✅ CONDITIONS FOR DYNAMIC BINDING
        </motion.div>

        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {conditions.map((cond, i) => (
            <motion.div key={cond} initial={{ opacity: 0, x: -30 }} animate={{ opacity: phase > i ? 1 : 0, x: 0 }}
              style={{ padding: "16px 32px", borderRadius: "16px", background: `${colors.success}15`, border: `2px solid ${colors.success}`, display: "flex", alignItems: "center", gap: "1rem" }}
            >
              <span style={{ color: colors.success, fontSize: "1.3rem" }}>✅</span>
              <span style={{ color: colors.text, fontWeight: 600, fontSize: "1.1rem" }}>{cond}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ============================================
// SCENE 48: Runtime Polymorphism Setup
// ============================================
const Scene48 = () => {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [setTimeout(() => setPhase(1), 500)];
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div style={containerStyle}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "2rem" }}>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          style={{ color: colors.primary, fontWeight: 700, fontSize: "13px", letterSpacing: "1.5px" }}
        >
          🔷 RUNTIME POLYMORPHISM SETUP
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 1 ? 1 : 0 }}
          style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1.5rem" }}
        >
          {/* Base Shape */}
          <div style={{ padding: "16px 40px", borderRadius: "16px", background: `${colors.classColor}20`, border: `3px solid ${colors.classColor}` }}>
            <span style={{ color: colors.classColor, fontWeight: 700, fontSize: "1.2rem" }}>Shape</span>
          </div>

          {/* Lines down */}
          <div style={{ display: "flex", gap: "4rem" }}>
            {[0, 1, 2].map((i) => (
              <div key={i} style={{ width: "3px", height: "30px", background: colors.objectColor }}></div>
            ))}
          </div>

          {/* Derived classes */}
          <div style={{ display: "flex", gap: "1rem" }}>
            {["Circle", "Rectangle", "Triangle"].map((shape) => (
              <div key={shape} style={{ padding: "12px 20px", borderRadius: "12px", background: `${colors.objectColor}15`, border: `2px solid ${colors.objectColor}` }}>
                <span style={{ color: colors.objectColor, fontWeight: 600 }}>{shape}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

// ============================================
// SCENE 49: Final Mega Runtime Polymorphism Program
// ============================================
const Scene49 = () => {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [setTimeout(() => setPhase(1), 500)];
    return () => timers.forEach(clearTimeout);
  }, []);

  const code = `#include <iostream>
using namespace std;

class Shape {
public:
    virtual void draw() {
        cout << "Drawing Shape" << endl;
    }
};

class Circle : public Shape {
public:
    void draw() {
        cout << "Drawing Circle" << endl;
    }
};

class Rectangle : public Shape {
public:
    void draw() {
        cout << "Drawing Rectangle" << endl;
    }
};

int main() {
    Shape* s;

    Circle c;
    Rectangle r;

    s = &c;
    s->draw();

    s = &r;
    s->draw();

    return 0;
}`;

  return (
    <div style={containerStyle}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" }}>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          style={{ color: colors.accent, fontWeight: 700, fontSize: "13px", letterSpacing: "1.5px" }}
        >
          🏆 RUNTIME POLYMORPHISM PROGRAM
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: phase >= 1 ? 1 : 0, y: 0 }}>
          <GlassCard style={{ maxWidth: "550px", padding: "1.5rem" }}>
            <CodeBlock code={code} />
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
};

// ============================================
// SCENE 50: Output Animation
// ============================================
const Scene50 = () => {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 600),
      setTimeout(() => setPhase(2), 1500),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div style={containerStyle}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "2rem" }}>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          style={{ color: colors.success, fontWeight: 700, fontSize: "13px", letterSpacing: "1.5px" }}
        >
          📺 OUTPUT
        </motion.div>

        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: phase >= 1 ? 1 : 0, x: 0 }}>
            <GlassCard>
              <div style={{ fontFamily: "'SF Mono', monospace", fontSize: "1.2rem", color: colors.success }}>
                Drawing Circle
              </div>
            </GlassCard>
          </motion.div>
          
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: phase >= 2 ? 1 : 0, x: 0 }}>
            <GlassCard>
              <div style={{ fontFamily: "'SF Mono', monospace", fontSize: "1.2rem", color: colors.success }}>
                Drawing Rectangle
              </div>
            </GlassCard>
          </motion.div>
        </div>

        <AnimatePresence>
          {phase >= 2 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ fontSize: "2.5rem" }}>
              🎉✨
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// ============================================
// SCENE 51: Big Concept Merge
// ============================================
const Scene51 = () => {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 400),
      setTimeout(() => setPhase(2), 800),
      setTimeout(() => setPhase(3), 1200),
      setTimeout(() => setPhase(4), 1600),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  const pillars = [
    { name: "Operator\nOverloading", desc: "Compile time", icon: "➕", color: colors.success },
    { name: "Virtual\nFunction", desc: "Runtime poly", icon: "✨", color: colors.primary },
    { name: "Dynamic\nBinding", desc: "Late decision", icon: "⚙️", color: colors.warning },
    { name: "Base\nPointer", desc: "Switch behavior", icon: "🎯", color: colors.secondary },
  ];

  return (
    <div style={containerStyle}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "2rem" }}>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          style={{ color: colors.accent, fontWeight: 700, fontSize: "13px", letterSpacing: "1.5px" }}
        >
          🏛️ BIG CONCEPT MERGE
        </motion.div>

        <div style={{ display: "flex", gap: "1rem" }}>
          {pillars.map((pillar, i) => (
            <motion.div key={pillar.name} initial={{ opacity: 0, y: 30 }} animate={{ opacity: phase > i ? 1 : 0, y: 0 }}
              style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.75rem" }}
            >
              <div style={{ width: "90px", height: "130px", background: `${pillar.color}20`, border: `3px solid ${pillar.color}`, borderRadius: "12px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}>
                <span style={{ fontSize: "2rem" }}>{pillar.icon}</span>
                <span style={{ color: pillar.color, fontSize: "11px", fontWeight: 600, textAlign: "center", whiteSpace: "pre-line" }}>{pillar.name}</span>
              </div>
              <span style={{ color: colors.textSec, fontSize: "11px" }}>{pillar.desc}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ============================================
// SCENE 52: Final Exam Summary
// ============================================
const Scene52 = () => {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 400),
      setTimeout(() => setPhase(2), 800),
      setTimeout(() => setPhase(3), 1200),
      setTimeout(() => setPhase(4), 1600),
      setTimeout(() => setPhase(5), 2200),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  const points = [
    { left: "Polymorphism", right: "one name, many forms" },
    { left: "Operator overloading", right: "compile time" },
    { left: "Virtual function", right: "runtime" },
    { left: "Dynamic binding", right: "late decision" },
  ];

  return (
    <div style={containerStyle}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: phase >= 5 ? 1 : 0 }}
        style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at center, rgba(255, 214, 10, 0.1) 0%, transparent 70%)" }}
      />

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "2rem", zIndex: 10 }}>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          style={{ color: colors.accent, fontWeight: 700, fontSize: "13px", letterSpacing: "1.5px" }}
        >
          📚 FINAL EXAM SUMMARY
        </motion.div>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {points.map((point, i) => (
            <motion.div key={point.left} initial={{ opacity: 0, x: -30 }} animate={{ opacity: phase > i ? 1 : 0, x: 0 }}
              style={{ display: "flex", alignItems: "center", gap: "1.5rem", padding: "12px 24px", borderRadius: "12px", background: "rgba(28, 28, 30, 0.8)", border: "1px solid rgba(255,255,255,0.1)" }}
            >
              <span style={{ color: colors.primary, fontWeight: 700, minWidth: "180px" }}>{point.left}</span>
              <span style={{ color: colors.textSec }}>→</span>
              <span style={{ color: colors.text, fontWeight: 500 }}>{point.right}</span>
            </motion.div>
          ))}
        </div>

        <AnimatePresence>
          {phase >= 5 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              style={{ display: "flex", alignItems: "center", gap: "1rem" }}
            >
              <span style={{ fontSize: "3rem" }}>🏛️</span>
              <span style={{ color: colors.accent, fontSize: "1.2rem", fontWeight: 600 }}>
                A strong OOP building!
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
export const AnimationStepsPart4 = [
  { title: "Without Virtual Function", component: Scene40, contentText: "Program where Base* b points to Derived object but calls Base::show(). Wrong behavior without virtual!" },
  { title: "Output Shock", component: Scene41, contentText: "Output shows 'This is Base class show()' - We expected Derived's version! The pointer type determines the function called." },
  { title: "Virtual Keyword Appears", component: Scene42, contentText: "The magic keyword 'virtual' in 'virtual void show()'. This changes everything!" },
  { title: "With Virtual Function", component: Scene43, contentText: "Same program but with 'virtual' keyword in Base class. Now the correct function is called!" },
  { title: "Correct Output", component: Scene44, contentText: "Output shows 'This is Derived class show()' - Correct behavior with virtual function!" },
  { title: "Dynamic Binding Explained", component: Scene45, contentText: "Decision made at runtime! The actual object type determines which function runs, not the pointer type." },
  { title: "Definition Card", component: Scene46, contentText: "Dynamic Binding = Function call linked at runtime using virtual function and base pointer." },
  { title: "Conditions for Dynamic Binding", component: Scene47, contentText: "Three conditions: Base class pointer, Derived class object, Virtual function." },
  { title: "Runtime Polymorphism Setup", component: Scene48, contentText: "Shape base class with Circle and Rectangle derived classes. Classic polymorphism setup." },
  { title: "Final Mega Program", component: Scene49, contentText: "Complete runtime polymorphism program: Shape* s points to Circle, then Rectangle. Same pointer, different behaviors!" },
  { title: "Output Animation", component: Scene50, contentText: "Output: Drawing Circle, Drawing Rectangle. Same s->draw() call produces different outputs!" },
  { title: "Big Concept Merge", component: Scene51, contentText: "Four pillars: Operator Overloading (compile time), Virtual Function (runtime), Dynamic Binding (late decision), Base Pointer (switch behavior)." },
  { title: "Final Exam Summary", component: Scene52, contentText: "Polymorphism = one name, many forms. Operator overloading = compile time. Virtual function = runtime. Dynamic binding = late decision." },
];

export default { AnimationStepsPart4 };
