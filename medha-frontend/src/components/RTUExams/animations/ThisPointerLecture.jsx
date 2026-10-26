/**
 * ThisPointerLecture.jsx - Scenes 1-10
 * this Pointer, Constructors, Destructors - Part 1
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
  const keywords = ['int', 'float', 'double', 'char', 'void', 'bool', 'class', 'struct', 'public', 'private', 'protected', 'this', 'new', 'delete', 'return', 'friend', 'const', 'cout', 'endl'];
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
  <motion.pre initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ fontFamily: "'Fira Code', monospace", fontSize, lineHeight: 1.35, margin: 0, whiteSpace: "pre", overflowX: "auto", background: "rgba(30, 30, 30, 0.95)", padding: "10px 14px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.1)", maxHeight: "300px", overflowY: "auto" }}>
    <SyntaxHighlight code={code} />
  </motion.pre>
);

// ============================================
// SCENE 1: Introduction & Overview
// ============================================
const Scene1 = () => {
  const [phase, setPhase] = useState(0);
  useEffect(() => { const t = [setTimeout(() => setPhase(1), 400), setTimeout(() => setPhase(2), 800), setTimeout(() => setPhase(3), 1200), setTimeout(() => setPhase(4), 1600)]; return () => t.forEach(clearTimeout); }, []);
  const topics = [
    { icon: "👆", label: "this Pointer", color: colors.primary },
    { icon: "🏗️", label: "Constructors", color: colors.success },
    { icon: "💥", label: "Destructors", color: colors.danger },
    { icon: "🤝", label: "Friend Functions", color: colors.accent },
  ];
  return (
    <div style={containerStyle}>
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: "2rem", textAlign: "center" }}>
        <div style={{ color: colors.accent, fontWeight: 700, fontSize: "14px", letterSpacing: "2px", marginBottom: "0.5rem" }}>RTU OOP DEEP DIVE</div>
        <div style={{ fontSize: "1.8rem", fontWeight: 700, color: colors.text }}>C++ Object Oriented Programming</div>
      </motion.div>
      <div style={{ display: "flex", gap: "1.5rem", justifyContent: "center" }}>
        {topics.map((t, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 30 }} animate={{ opacity: phase > i ? 1 : 0, y: 0 }} style={{ padding: "20px 24px", borderRadius: "16px", background: `${t.color}15`, border: `2px solid ${t.color}`, textAlign: "center", minWidth: "120px" }}>
            <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>{t.icon}</div>
            <div style={{ color: t.color, fontWeight: 600, fontSize: "12px" }}>{t.label}</div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// ============================================
// SCENE 2: The Problem - Name Shadowing
// ============================================
const Scene2 = () => {
  const code = `class Student {
    int id;
    void set(int id) {
        id = id;  // PROBLEM!
    }
};`;
  const [phase, setPhase] = useState(0);
  useEffect(() => { const t = [setTimeout(() => setPhase(1), 800)]; return () => t.forEach(clearTimeout); }, []);
  return (
    <div style={containerStyle}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: colors.danger, fontWeight: 700, fontSize: "13px", letterSpacing: "1.5px", marginBottom: "1.5rem" }}>❌ THE PROBLEM: NAME SHADOWING</motion.div>
      <div style={{ display: "flex", gap: "2rem", alignItems: "center" }}>
        <GlassCard glow={colors.danger} style={{ maxWidth: "320px" }}><CodeBlock code={code} /></GlassCard>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 1 ? 1 : 0 }} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <motion.div animate={{ x: [-3, 3, -3] }} transition={{ duration: 0.3, repeat: Infinity }} style={{ padding: "12px 20px", borderRadius: "12px", background: `${colors.danger}20`, border: `2px solid ${colors.danger}` }}>
            <div style={{ fontFamily: "monospace", color: colors.danger, fontWeight: 600 }}>id = id;</div>
            <div style={{ color: colors.textSec, fontSize: "10px", marginTop: "0.3rem" }}>Both refer to parameter only!</div>
          </motion.div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span style={{ color: colors.danger }}>❌</span>
              <span style={{ fontSize: "11px", color: colors.textSec }}>Parameter shadows member variable</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span style={{ color: colors.danger }}>❌</span>
              <span style={{ fontSize: "11px", color: colors.textSec }}>Member never gets updated</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

// ============================================
// SCENE 3: The Solution - this Pointer
// ============================================
const Scene3 = () => {
  const code = `class Student {
    int id;
    void set(int id) {
        this->id = id;  // CORRECT!
    }
};

int main() {
    Student s1;
    s1.set(101);
}`;
  const [phase, setPhase] = useState(0);
  useEffect(() => { const t = [setTimeout(() => setPhase(1), 800)]; return () => t.forEach(clearTimeout); }, []);
  return (
    <div style={containerStyle}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: colors.success, fontWeight: 700, fontSize: "13px", letterSpacing: "1.5px", marginBottom: "1rem" }}>✅ THE SOLUTION: this POINTER</motion.div>
      <div style={{ display: "flex", gap: "2rem", alignItems: "flex-start" }}>
        <GlassCard glow={colors.success} style={{ maxWidth: "320px" }}><CodeBlock code={code} /></GlassCard>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 1 ? 1 : 0 }} style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
          <div style={{ padding: "12px 16px", borderRadius: "12px", background: `${colors.primary}15`, border: `1px solid ${colors.primary}` }}>
            <div style={{ color: colors.primary, fontWeight: 600, fontSize: "12px" }}>this</div>
            <div style={{ color: colors.textSec, fontSize: "10px" }}>Hidden pointer to current object</div>
          </div>
          <div style={{ padding: "12px 16px", borderRadius: "12px", background: `${colors.success}15`, border: `1px solid ${colors.success}` }}>
            <div style={{ color: colors.success, fontWeight: 600, fontSize: "12px" }}>this-&gt;id</div>
            <div style={{ color: colors.textSec, fontSize: "10px" }}>Accesses member variable</div>
          </div>
          <div style={{ padding: "12px 16px", borderRadius: "12px", background: `${colors.accent}15`, border: `1px solid ${colors.accent}` }}>
            <div style={{ color: colors.accent, fontWeight: 600, fontSize: "12px" }}>Auto-passed</div>
            <div style={{ color: colors.textSec, fontSize: "10px" }}>To every non-static member function</div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

// ============================================
// SCENE 4: this Pointer - Memory Visualization
// ============================================
const Scene4 = () => {
  const [phase, setPhase] = useState(0);
  useEffect(() => { const t = [setTimeout(() => setPhase(1), 600), setTimeout(() => setPhase(2), 1200)]; return () => t.forEach(clearTimeout); }, []);
  return (
    <div style={containerStyle}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: colors.primary, fontWeight: 700, fontSize: "13px", letterSpacing: "1.5px", marginBottom: "1.5rem" }}>🧠 this POINTER - MEMORY VIEW</motion.div>
      <div style={{ display: "flex", alignItems: "center", gap: "3rem" }}>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{ fontSize: "11px", color: colors.textSec, marginBottom: "0.5rem" }}>Object s1 in memory</div>
          <div style={{ padding: "20px 30px", borderRadius: "16px", background: `${colors.success}15`, border: `2px solid ${colors.success}`, textAlign: "center" }}>
            <div style={{ fontFamily: "monospace", fontSize: "12px", color: colors.success }}>id: 101</div>
            <div style={{ fontSize: "10px", color: colors.textSec, marginTop: "0.5rem" }}>Address: 0x1000</div>
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 1 ? 1 : 0 }} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <motion.div animate={{ x: [0, 10, 0] }} transition={{ duration: 1, repeat: Infinity }} style={{ fontSize: "2rem" }}>➡️</motion.div>
        </motion.div>
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: phase >= 2 ? 1 : 0, scale: 1 }} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{ fontSize: "11px", color: colors.textSec, marginBottom: "0.5rem" }}>this pointer</div>
          <motion.div animate={{ boxShadow: [`0 0 0px ${colors.primary}`, `0 0 20px ${colors.primary}`, `0 0 0px ${colors.primary}`] }} transition={{ duration: 1.5, repeat: Infinity }} style={{ padding: "20px 30px", borderRadius: "16px", background: `${colors.primary}15`, border: `2px solid ${colors.primary}`, textAlign: "center" }}>
            <div style={{ fontFamily: "monospace", fontSize: "14px", color: colors.primary, fontWeight: 700 }}>0x1000</div>
            <div style={{ fontSize: "10px", color: colors.textSec, marginTop: "0.5rem" }}>Points to s1</div>
          </motion.div>
        </motion.div>
      </div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 2 ? 1 : 0 }} style={{ marginTop: "1.5rem", padding: "10px 20px", borderRadius: "100px", background: `${colors.primary}15`, textAlign: "center" }}>
        <span style={{ color: colors.primary }}>this pointer value = object's memory address</span>
      </motion.div>
    </div>
  );
};

// ============================================
// SCENE 5: Returning *this
// ============================================
const Scene5 = () => {
  const code = `class Student {
    int id;
public:
    Student& get() {
        return *this;  // Return reference
    }
};`;
  const [phase, setPhase] = useState(0);
  useEffect(() => { const t = [setTimeout(() => setPhase(1), 800)]; return () => t.forEach(clearTimeout); }, []);
  return (
    <div style={containerStyle}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: colors.accent, fontWeight: 700, fontSize: "13px", letterSpacing: "1.5px", marginBottom: "1rem" }}>🔄 RETURNING *this</motion.div>
      <div style={{ display: "flex", gap: "2rem", alignItems: "flex-start" }}>
        <GlassCard style={{ maxWidth: "320px" }}><CodeBlock code={code} /></GlassCard>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 1 ? 1 : 0 }} style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
          <div style={{ padding: "12px 16px", borderRadius: "12px", background: `${colors.warning}15`, border: `1px solid ${colors.warning}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span style={{ fontFamily: "monospace", color: colors.warning }}>*this</span>
              <span style={{ color: colors.textSec, fontSize: "10px" }}>= dereference pointer</span>
            </div>
          </div>
          <div style={{ padding: "12px 16px", borderRadius: "12px", background: `${colors.success}15`, border: `1px solid ${colors.success}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span style={{ fontFamily: "monospace", color: colors.success }}>Student&</span>
              <span style={{ color: colors.textSec, fontSize: "10px" }}>= return reference</span>
            </div>
          </div>
          <div style={{ padding: "10px 16px", borderRadius: "10px", background: `${colors.accent}10`, fontSize: "11px", color: colors.accent }}>
            ✨ Enables method chaining!
          </div>
        </motion.div>
      </div>
    </div>
  );
};

// ============================================
// SCENE 6: Constructors - The Problem
// ============================================
const Scene6 = () => {
  const code = `class Test {
    int x;
};

Test obj;  // x has garbage value! 💀`;
  const [phase, setPhase] = useState(0);
  useEffect(() => { const t = [setTimeout(() => setPhase(1), 600)]; return () => t.forEach(clearTimeout); }, []);
  return (
    <div style={containerStyle}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: colors.danger, fontWeight: 700, fontSize: "13px", letterSpacing: "1.5px", marginBottom: "1.5rem" }}>💀 CONSTRUCTORS: THE PROBLEM</motion.div>
      <div style={{ display: "flex", gap: "2rem", alignItems: "center" }}>
        <GlassCard glow={colors.danger} style={{ maxWidth: "300px" }}><CodeBlock code={code} /></GlassCard>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 1 ? 1 : 0 }} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" }}>
          <motion.div animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 0.5, repeat: Infinity }} style={{ padding: "16px 24px", borderRadius: "12px", background: `${colors.danger}20`, border: `2px dashed ${colors.danger}` }}>
            <div style={{ fontFamily: "monospace", color: colors.danger, fontSize: "12px" }}>x = ?!@#$%</div>
            <div style={{ color: colors.textSec, fontSize: "10px" }}>Garbage value!</div>
          </motion.div>
          <motion.div animate={{ rotate: [0, 5, -5, 0] }} transition={{ duration: 0.5, repeat: Infinity }} style={{ fontSize: "2rem" }}>🐛</motion.div>
          <div style={{ fontSize: "11px", color: colors.danger }}>Unpredictable behavior!</div>
        </motion.div>
      </div>
    </div>
  );
};

// ============================================
// SCENE 7: Constructors - The Solution
// ============================================
const Scene7 = () => {
  const code = `class Test {
public:
    Test() {  // Constructor
        cout << "Constructor called";
    }
};

Test myObj;  // Automatically calls constructor`;
  const [phase, setPhase] = useState(0);
  useEffect(() => { const t = [setTimeout(() => setPhase(1), 800)]; return () => t.forEach(clearTimeout); }, []);
  return (
    <div style={containerStyle}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: colors.success, fontWeight: 700, fontSize: "13px", letterSpacing: "1.5px", marginBottom: "1rem" }}>🏗️ CONSTRUCTORS: THE SOLUTION</motion.div>
      <div style={{ display: "flex", gap: "2rem", alignItems: "flex-start" }}>
        <GlassCard glow={colors.success} style={{ maxWidth: "400px" }}><CodeBlock code={code} /></GlassCard>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 1 ? 1 : 0 }} style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
          {[
            { icon: "📛", text: "Same name as class" },
            { icon: "🚫", text: "No return type (not even void)" },
            { icon: "⚡", text: "Called automatically" },
            { icon: "✅", text: "Initializes object" },
          ].map((item, i) => (
            <motion.div key={i} initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: i * 0.1 }} style={{ padding: "8px 14px", borderRadius: "8px", background: `${colors.success}10`, display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span>{item.icon}</span>
              <span style={{ fontSize: "11px", color: colors.textSec }}>{item.text}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

// ============================================
// SCENE 8: Types of Constructors
// ============================================
const Scene8 = () => {
  const code = `class Test {
    int x;
public:
    // 1. Default Constructor
    Test() { x = 0; }
    
    // 2. Parameterized Constructor
    Test(int val) { x = val; }
    
    // 3. Copy Constructor
    Test(Test &obj) { x = obj.x; }
};

Test obj1;        // Default
Test obj2(10);    // Parameterized
Test obj3(obj2);  // Copy`;
  return (
    <div style={containerStyle}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: colors.primary, fontWeight: 700, fontSize: "13px", letterSpacing: "1.5px", marginBottom: "1rem" }}>📚 TYPES OF CONSTRUCTORS</motion.div>
      <div style={{ display: "flex", gap: "2rem", alignItems: "flex-start" }}>
        <GlassCard style={{ maxWidth: "340px" }}><CodeBlock code={code} fontSize="9px" /></GlassCard>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
          {[
            { num: 1, name: "Default", desc: "No parameters", usage: "Test obj1;" },
            { num: 2, name: "Parameterized", desc: "Accepts values", usage: "Test obj2(10);" },
            { num: 3, name: "Copy", desc: "Copies existing object", usage: "Test obj3(obj2);" },
          ].map((t, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.2 }} style={{ padding: "10px 16px", borderRadius: "10px", background: `${colors.primary}10`, border: `1px solid ${colors.primary}30` }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.3rem" }}>
                <span style={{ width: "20px", height: "20px", borderRadius: "50%", background: colors.primary, color: "#000", fontWeight: 700, fontSize: "10px", display: "flex", alignItems: "center", justifyContent: "center" }}>{t.num}</span>
                <span style={{ color: colors.primary, fontWeight: 600, fontSize: "12px" }}>{t.name}</span>
              </div>
              <div style={{ fontSize: "10px", color: colors.textSec }}>{t.desc}</div>
              <div style={{ fontFamily: "monospace", fontSize: "10px", color: colors.text, marginTop: "0.3rem" }}>{t.usage}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ============================================
// SCENE 9: Destructors Introduction
// ============================================
const Scene9 = () => {
  const code = `class Sample {
public:
    ~Sample() {  // Destructor
        cout << "Destructor called";
    }
};`;
  const [phase, setPhase] = useState(0);
  useEffect(() => { const t = [setTimeout(() => setPhase(1), 600)]; return () => t.forEach(clearTimeout); }, []);
  return (
    <div style={containerStyle}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: colors.danger, fontWeight: 700, fontSize: "13px", letterSpacing: "1.5px", marginBottom: "1.5rem" }}>💥 DESTRUCTORS INTRODUCTION</motion.div>
      <div style={{ display: "flex", gap: "2rem", alignItems: "center" }}>
        <GlassCard glow={colors.danger} style={{ maxWidth: "340px" }}><CodeBlock code={code} /></GlassCard>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 1 ? 1 : 0 }} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1.5, repeat: Infinity }} style={{ fontSize: "3rem", textAlign: "center" }}>~</motion.div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {["Tilde (~) before class name", "No parameters, no return", "Called when object destroyed", "Used for cleanup"].map((t, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <span style={{ color: colors.danger }}>•</span>
                <span style={{ fontSize: "11px", color: colors.textSec }}>{t}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

// ============================================
// SCENE 10: Destructors - Memory Leak Example
// ============================================
const Scene10 = () => {
  const code = `class Sample {
    int *p;
public:
    Sample() {
        p = new int;  // Allocate
        cout << "Memory allocated";
    }
    
    ~Sample() {
        delete p;  // Free memory
        cout << "Memory freed";
    }
};`;
  const [phase, setPhase] = useState(0);
  useEffect(() => { const t = [setTimeout(() => setPhase(1), 800)]; return () => t.forEach(clearTimeout); }, []);
  return (
    <div style={containerStyle}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: colors.warning, fontWeight: 700, fontSize: "13px", letterSpacing: "1.5px", marginBottom: "1rem" }}>🧹 DESTRUCTORS: MEMORY CLEANUP</motion.div>
      <div style={{ display: "flex", gap: "2rem", alignItems: "flex-start" }}>
        <GlassCard style={{ maxWidth: "340px" }}><CodeBlock code={code} fontSize="9px" /></GlassCard>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 1 ? 1 : 0 }} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div style={{ padding: "12px 16px", borderRadius: "12px", background: `${colors.success}15`, border: `1px solid ${colors.success}` }}>
            <div style={{ color: colors.success, fontWeight: 600, fontSize: "11px" }}>Constructor</div>
            <div style={{ fontFamily: "monospace", fontSize: "10px", color: colors.textSec }}>new int → Allocate</div>
          </div>
          <div style={{ textAlign: "center", fontSize: "1.5rem" }}>⬇️</div>
          <div style={{ padding: "12px 16px", borderRadius: "12px", background: `${colors.danger}15`, border: `1px solid ${colors.danger}` }}>
            <div style={{ color: colors.danger, fontWeight: 600, fontSize: "11px" }}>Destructor</div>
            <div style={{ fontFamily: "monospace", fontSize: "10px", color: colors.textSec }}>delete p → Free</div>
          </div>
          <div style={{ fontSize: "11px", color: colors.success, textAlign: "center" }}>✓ No memory leak!</div>
        </motion.div>
      </div>
    </div>
  );
};

// Export Part 1 scenes
export const ThisPointerScenesPart1 = [
  { title: "Introduction & Overview", component: Scene1, contentText: "Four main topics: this Pointer, Constructors, Destructors, Friend Functions." },
  { title: "Name Shadowing Problem", component: Scene2, contentText: "id = id; Parameter shadows member variable. Member never gets updated!" },
  { title: "this Pointer Solution", component: Scene3, contentText: "this->id = id; this is hidden pointer to current object. Resolves ambiguity." },
  { title: "this Pointer Memory View", component: Scene4, contentText: "Object s1 at 0x1000. this pointer = 0x1000. Points to current object." },
  { title: "Returning *this", component: Scene5, contentText: "*this dereferences pointer. Student& returns reference. Enables method chaining!" },
  { title: "Constructor Problem", component: Scene6, contentText: "Uninitialized objects have garbage values. Unpredictable behavior, hard to debug." },
  { title: "Constructor Solution", component: Scene7, contentText: "Constructor: same name as class, no return type, called automatically, initializes object." },
  { title: "Types of Constructors", component: Scene8, contentText: "Three types: Default (no params), Parameterized (accepts values), Copy (copies object)." },
  { title: "Destructors Introduction", component: Scene9, contentText: "~ClassName() destructor. Tilde prefix, no params, called when object destroyed." },
  { title: "Destructors: Memory Cleanup", component: Scene10, contentText: "Constructor allocates (new), Destructor frees (delete). Prevents memory leaks!" },
];
