/**
 * VirtualFunctionsLecture.jsx - Scenes 1-6
 * Virtual Functions Deep Dive Lecture
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
  const keywords = ['int', 'float', 'double', 'char', 'void', 'bool', 'class', 'struct', 'public', 'private', 'protected', 'virtual', 'return', 'new', 'delete', 'this', 'using', 'namespace', 'std', 'override', 'endl', 'cout', 'cin', 'string'];
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
    return <div key={lIdx} style={{ minHeight: '1.4em' }}>{els.length > 0 ? els : '\u00A0'}</div>;
  });
};

export const CodeBlock = ({ code, fontSize = "10px" }) => (
  <motion.pre initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ fontFamily: "'Fira Code', monospace", fontSize, lineHeight: 1.4, margin: 0, whiteSpace: "pre", overflowX: "auto", background: "rgba(30, 30, 30, 0.95)", padding: "12px 16px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.1)", maxHeight: "350px", overflowY: "auto" }}>
    <SyntaxHighlight code={code} />
  </motion.pre>
);

export const Terminal = ({ output, title = "Output" }) => (
  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ background: "linear-gradient(180deg, #1a1a1a 0%, #0d0d0d 100%)", borderRadius: "10px", overflow: "hidden", border: "1px solid rgba(255,255,255,0.1)", marginTop: "12px" }}>
    <div style={{ background: "rgba(60, 60, 60, 0.8)", padding: "6px 12px", display: "flex", alignItems: "center", gap: "8px" }}><div style={{ display: "flex", gap: "6px" }}><div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#FF5F56" }} /><div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#FFBD2E" }} /><div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#27CA40" }} /></div><span style={{ fontSize: "10px", color: "#888", fontFamily: "monospace" }}>{title}</span></div>
    <div style={{ padding: "12px 16px", fontFamily: "monospace", fontSize: "11px", color: "#4AF626", lineHeight: 1.5 }}>{output}</div>
  </motion.div>
);

// ============================================
// SCENE 0: Title Screen
// ============================================
const Scene0 = () => {
  const [phase, setPhase] = useState(0);
  useEffect(() => { const t = [setTimeout(() => setPhase(1), 600), setTimeout(() => setPhase(2), 1200)]; return () => t.forEach(clearTimeout); }, []);
  return (
    <div style={containerStyle}>
      <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 100 }} style={{ textAlign: "center" }}>
        <motion.div initial={{ y: -30 }} animate={{ y: 0 }} style={{ color: colors.accent, fontWeight: 700, fontSize: "14px", letterSpacing: "3px", marginBottom: "1.5rem" }}>RTU OOP DEEP DIVE</motion.div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 1 ? 1 : 0 }} style={{ fontSize: "2.5rem", fontWeight: 700, color: colors.text, lineHeight: 1.2, marginBottom: "1rem" }}>Virtual Functions</motion.div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 1 ? 1 : 0 }} style={{ fontSize: "1.5rem", color: colors.virtualColor, fontWeight: 600 }}>&amp; Polymorphism</motion.div>
      </motion.div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 2 ? 1 : 0 }} style={{ marginTop: "3rem", display: "flex", gap: "2rem" }}>
        {[{ icon: "🎯", label: "Dynamic Binding" }, { icon: "📊", label: "VTable Mechanism" }, { icon: "🔧", label: "Best Practices" }].map((item, i) => (
          <motion.div key={i} initial={{ y: 20 }} animate={{ y: 0 }} transition={{ delay: i * 0.15 }} style={{ padding: "16px 24px", borderRadius: "16px", background: `${colors.text}08`, border: `1px solid ${colors.text}20`, textAlign: "center" }}>
            <div style={{ fontSize: "1.8rem", marginBottom: "0.5rem" }}>{item.icon}</div>
            <div style={{ color: colors.textSec, fontSize: "12px" }}>{item.label}</div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

// ============================================
// SCENE 1: Introduction & Analogy
// ============================================
const Scene1 = () => {
  const [phase, setPhase] = useState(0);
  useEffect(() => { const t = [setTimeout(() => setPhase(1), 600), setTimeout(() => setPhase(2), 1500), setTimeout(() => setPhase(3), 2500)]; return () => t.forEach(clearTimeout); }, []);
  return (
    <div style={containerStyle}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: colors.primary, fontWeight: 700, fontSize: "13px", letterSpacing: "1.5px", marginBottom: "2rem" }}>🚗 REAL-WORLD ANALOGY</motion.div>
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }} style={{ padding: "20px 40px", borderRadius: "50%", background: `linear-gradient(135deg, ${colors.accent}40, ${colors.primary}30)`, border: `3px solid ${colors.accent}`, marginBottom: "2rem", boxShadow: `0 0 30px ${colors.accent}30` }}>
        <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 1.5, repeat: Infinity }} style={{ fontSize: "3rem" }}>📱</motion.div>
      </motion.div>
      <div style={{ display: "flex", gap: "3rem" }}>
        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: phase >= 1 ? 1 : 0, x: 0 }} style={{ padding: "20px 32px", borderRadius: "20px", background: `${colors.success}15`, border: `2px solid ${colors.success}`, textAlign: "center" }}>
          <div style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>🚗</div>
          <div style={{ color: colors.success, fontWeight: 600 }}>Car</div>
          <div style={{ color: colors.textSec, fontSize: "12px", marginTop: "0.5rem" }}>Doors unlock</div>
        </motion.div>
        <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: phase >= 2 ? 1 : 0, x: 0 }} style={{ padding: "20px 32px", borderRadius: "20px", background: `${colors.warning}15`, border: `2px solid ${colors.warning}`, textAlign: "center" }}>
          <div style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>🏍️</div>
          <div style={{ color: colors.warning, fontWeight: 600 }}>Bike</div>
          <div style={{ color: colors.textSec, fontSize: "12px", marginTop: "0.5rem" }}>Seat opens</div>
        </motion.div>
      </div>
      <AnimatePresence>{phase >= 3 && <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ marginTop: "2rem", padding: "16px 32px", borderRadius: "100px", background: `${colors.accent}15`, border: `1px solid ${colors.accent}40` }}>
        <span style={{ color: colors.text }}>One Action → </span><span style={{ color: colors.accent, fontWeight: 700 }}>Different Results</span>
      </motion.div>}</AnimatePresence>
    </div>
  );
};

// ============================================
// SCENE 2: The Problem - Basic Setup
// ============================================
const Scene2 = () => {
  const code = `class Animal {
public:
    void speak() {
        cout << "Animal makes a sound" << endl;
    }
};

class Dog : public Animal {
public:
    void speak() {  // Function Overriding
        cout << "Dog barks" << endl;
    }
};

int main() {
    Animal* a;     // Base class pointer
    Dog d;         // Derived class object
    a = &d;        // Base pointer → derived object
    
    a->speak();    // What gets called?
}`;
  const [phase, setPhase] = useState(0);
  useEffect(() => { const t = [setTimeout(() => setPhase(1), 1000)]; return () => t.forEach(clearTimeout); }, []);
  return (
    <div style={containerStyle}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: colors.danger, fontWeight: 700, fontSize: "13px", letterSpacing: "1.5px", marginBottom: "1rem" }}>❓ THE PROBLEM</motion.div>
      <div style={{ display: "flex", gap: "2rem", alignItems: "flex-start" }}>
        <GlassCard style={{ maxWidth: "400px" }}><CodeBlock code={code} /></GlassCard>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 1 ? 1 : 0 }} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div style={{ padding: "16px 24px", borderRadius: "16px", background: `${colors.success}15`, border: `2px solid ${colors.success}` }}>
            <div style={{ color: colors.textSec, fontSize: "11px" }}>Expected:</div>
            <div style={{ color: colors.success, fontWeight: 600, fontFamily: "monospace" }}>Dog barks</div>
          </div>
          <div style={{ padding: "16px 24px", borderRadius: "16px", background: `${colors.danger}15`, border: `2px solid ${colors.danger}` }}>
            <div style={{ color: colors.textSec, fontSize: "11px" }}>Actual:</div>
            <div style={{ color: colors.danger, fontWeight: 600, fontFamily: "monospace" }}>Animal makes a sound</div>
          </div>
          <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 1.5, repeat: Infinity }} style={{ fontSize: "4rem", textAlign: "center" }}>🤔</motion.div>
        </motion.div>
      </div>
    </div>
  );
};

// ============================================
// SCENE 3: Static Binding Explanation
// ============================================
const Scene3 = () => {
  const [phase, setPhase] = useState(0);
  useEffect(() => { const t = [setTimeout(() => setPhase(1), 600), setTimeout(() => setPhase(2), 1500), setTimeout(() => setPhase(3), 2500)]; return () => t.forEach(clearTimeout); }, []);
  return (
    <div style={containerStyle}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: colors.compileTime, fontWeight: 700, fontSize: "13px", letterSpacing: "1.5px", marginBottom: "2rem" }}>⚡ STATIC BINDING (Default)</motion.div>
      <div style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ padding: "20px", borderRadius: "16px", background: `${colors.compileTime}20`, border: `2px solid ${colors.compileTime}`, textAlign: "center" }}>
          <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>🦾</div>
          <div style={{ color: colors.compileTime, fontWeight: 600 }}>Compiler</div>
        </motion.div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 1 ? 1 : 0 }} style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <div style={{ color: colors.textSec }}>1. What is 'a'? → <span style={{ color: colors.compileTime }}>Animal*</span></div>
          <div style={{ color: colors.textSec }}>2. Call → <span style={{ color: colors.compileTime }}>Animal::speak()</span></div>
          <div style={{ color: colors.danger }}>3. Ignore actual object type!</div>
        </motion.div>
      </div>
      <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: phase >= 2 ? 1 : 0, scale: 1 }} style={{ marginTop: "2rem", padding: "20px 40px", borderRadius: "20px", background: `${colors.danger}15`, border: `2px solid ${colors.danger}` }}>
        <div style={{ color: colors.danger, fontWeight: 700, textAlign: "center" }}>Decision made at COMPILE TIME based on POINTER TYPE</div>
      </motion.div>
      <AnimatePresence>{phase >= 3 && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ marginTop: "1.5rem", display: "flex", alignItems: "center", gap: "0.5rem", color: colors.textSec }}>
        <span>Dog object</span>
        <span style={{ color: colors.danger }}>IGNORED</span>
        <span style={{ fontSize: "1.5rem" }}>❌</span>
      </motion.div>}</AnimatePresence>
    </div>
  );
};

// ============================================
// SCENE 4: The Solution - Virtual Keyword
// ============================================
const Scene4 = () => {
  const codeBefore = `void speak() {
    cout << "Animal sound";
}`;
  const codeAfter = `virtual void speak() {
    cout << "Animal sound";
}`;
  const [phase, setPhase] = useState(0);
  useEffect(() => { const t = [setTimeout(() => setPhase(1), 800), setTimeout(() => setPhase(2), 2000)]; return () => t.forEach(clearTimeout); }, []);
  return (
    <div style={containerStyle}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: colors.virtualColor, fontWeight: 700, fontSize: "13px", letterSpacing: "1.5px", marginBottom: "2rem" }}>✨ THE SOLUTION: virtual</motion.div>
      <div style={{ display: "flex", gap: "2rem", alignItems: "center" }}>
        <motion.div initial={{ opacity: 1 }} animate={{ opacity: phase >= 1 ? 0.4 : 1 }} style={{ position: "relative" }}>
          <GlassCard glow={colors.danger}><CodeBlock code={codeBefore} fontSize="12px" /></GlassCard>
          {phase >= 1 && <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", fontSize: "3rem" }}>❌</div>}
        </motion.div>
        <motion.div initial={{ scale: 0 }} animate={{ scale: phase >= 1 ? 1 : 0 }} style={{ fontSize: "2rem" }}>→</motion.div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 1 ? 1 : 0 }}>
          <GlassCard glow={colors.virtualColor} style={{ boxShadow: `0 0 40px ${colors.virtualColor}40` }}><CodeBlock code={codeAfter} fontSize="12px" /></GlassCard>
        </motion.div>
      </div>
      <AnimatePresence>{phase >= 2 && <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ marginTop: "2rem", display: "flex", alignItems: "center", gap: "1.5rem" }}>
        <div style={{ padding: "16px 28px", borderRadius: "16px", background: `${colors.success}20`, border: `2px solid ${colors.success}` }}>
          <div style={{ color: colors.textSec, fontSize: "11px" }}>Now outputs:</div>
          <div style={{ color: colors.success, fontWeight: 700, fontFamily: "monospace" }}>Dog barks ✓</div>
        </div>
        <div style={{ color: colors.textSec }}>Decision moved to <span style={{ color: colors.runTime, fontWeight: 700 }}>RUNTIME</span></div>
      </motion.div>}</AnimatePresence>
    </div>
  );
};

// ============================================
// SCENE 5: Practical Example - Shape Hierarchy
// ============================================
const Scene5 = () => {
  const code = `class Shape {
public:
    virtual void area() {
        cout << "Generic shape" << endl;
    }
};

class Rectangle : public Shape {
    double length, width;
public:
    Rectangle(double l, double w) : length(l), width(w) {}
    void area() {
        cout << "Area: " << length * width << endl;
    }
};

class Circle : public Shape {
    double radius;
public:
    Circle(double r) : radius(r) {}
    void area() {
        cout << "Area: " << 3.14 * radius * radius << endl;
    }
};

int main() {
    Shape* s;
    Rectangle r(5, 3);
    Circle c(4);
    
    s = &r; s->area();  // Rectangle: 15
    s = &c; s->area();  // Circle: 50.24
}`;
  return (
    <div style={containerStyle}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: colors.derivedClass, fontWeight: 700, fontSize: "13px", letterSpacing: "1.5px", marginBottom: "1rem" }}>📐 PRACTICAL EXAMPLE: Shape Hierarchy</motion.div>
      <div style={{ display: "flex", gap: "2rem", alignItems: "flex-start" }}>
        <GlassCard style={{ maxWidth: "450px" }}><CodeBlock code={code} fontSize="9px" /></GlassCard>
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div style={{ padding: "16px 24px", borderRadius: "16px", background: `${colors.pointerColor}15`, border: `2px solid ${colors.pointerColor}`, textAlign: "center" }}>
            <div style={{ fontSize: "2rem" }}>⬜</div>
            <div style={{ fontFamily: "monospace", color: colors.pointerColor, fontSize: "12px" }}>5 × 3 = 15</div>
          </div>
          <div style={{ padding: "16px 24px", borderRadius: "16px", background: `${colors.accent}15`, border: `2px solid ${colors.accent}`, textAlign: "center" }}>
            <div style={{ fontSize: "2rem" }}>⭕</div>
            <div style={{ fontFamily: "monospace", color: colors.accent, fontSize: "12px" }}>π × 4² = 50.24</div>
          </div>
          <div style={{ color: colors.success, fontSize: "12px", textAlign: "center" }}>Same pointer,<br />different calculations!</div>
        </div>
      </div>
    </div>
  );
};

// ============================================
// SCENE 6: Virtual Destructors
// ============================================
const Scene6 = () => {
  const codeWrong = `class Animal {
public:
    ~Animal() { cout << "~Animal"; }
};

class Dog : public Animal {
    int* data;
public:
    Dog() { data = new int[100]; }
    ~Dog() { delete[] data; } // NEVER CALLED!
};

Animal* a = new Dog;
delete a;  // Only ~Animal() runs!`;
  const codeRight = `class Animal {
public:
    virtual ~Animal() { cout << "~Animal"; }
};
// Now: ~Dog() then ~Animal() ✓`;
  const [phase, setPhase] = useState(0);
  useEffect(() => { const t = [setTimeout(() => setPhase(1), 1200)]; return () => t.forEach(clearTimeout); }, []);
  return (
    <div style={containerStyle}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: colors.warning, fontWeight: 700, fontSize: "13px", letterSpacing: "1.5px", marginBottom: "1rem" }}>⚠️ CRITICAL: Virtual Destructors</motion.div>
      <div style={{ display: "flex", gap: "2rem" }}>
        <div>
          <div style={{ color: colors.danger, fontWeight: 600, marginBottom: "0.5rem", fontSize: "12px" }}>❌ Memory Leak Risk:</div>
          <GlassCard glow={colors.danger} style={{ maxWidth: "320px" }}><CodeBlock code={codeWrong} fontSize="9px" /></GlassCard>
        </div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 1 ? 1 : 0 }}>
          <div style={{ color: colors.success, fontWeight: 600, marginBottom: "0.5rem", fontSize: "12px" }}>✓ Solution:</div>
          <GlassCard glow={colors.success} style={{ maxWidth: "320px" }}><CodeBlock code={codeRight} fontSize="9px" /></GlassCard>
        </motion.div>
      </div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 1 ? 1 : 0 }} style={{ marginTop: "1.5rem", padding: "12px 24px", borderRadius: "100px", background: `${colors.warning}20`, border: `2px solid ${colors.warning}` }}>
        <span style={{ color: colors.warning, fontWeight: 700 }}>🏆 Golden Rule:</span><span style={{ color: colors.text }}> Always make base class destructor virtual</span>
      </motion.div>
    </div>
  );
};

// Export Part 1 scenes
export const LectureScenesPart1 = [
  { title: "Title Screen", component: Scene0, contentText: "Virtual Functions & Polymorphism - Dynamic Binding, VTable Mechanism, Best Practices." },
  { title: "Introduction & Analogy", component: Scene1, contentText: "Car remote analogy - pressing same button: car doors unlock, bike seat opens. One action, different results." },
  { title: "The Problem - Basic Setup", component: Scene2, contentText: "Animal* pointer to Dog object, calling speak() outputs 'Animal makes a sound' not 'Dog barks'. Why?" },
  { title: "Static Binding", component: Scene3, contentText: "C++ uses Static Binding by default - function decided at compile time based on pointer type, ignoring actual object." },
  { title: "The Solution - virtual", component: Scene4, contentText: "Add 'virtual' keyword. Now compiler waits until runtime to check actual object. Dog barks correctly!" },
  { title: "Shape Hierarchy Example", component: Scene5, contentText: "Shape base with virtual area(). Rectangle: length×width. Circle: π×r². Same pointer, different calculations." },
  { title: "Virtual Destructors", component: Scene6, contentText: "CRITICAL: If base has virtual functions, destructor MUST be virtual. Prevents memory leaks when deleting via base pointer." },
];
