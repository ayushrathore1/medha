/**
 * OperatorOverloadingLecture.jsx - Scenes 1-9
 * Operator Overloading Deep Dive - Part 1
 */
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { colors, containerStyle } from "./VirtualFunctionsTheme";

// ============================================
// SHARED COMPONENTS
// ============================================
export const GlassCard = ({ children, style = {}, glow = null }) => (
  <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} style={{ background: "rgba(28, 28, 30, 0.65)", backdropFilter: "blur(25px)", border: `1px solid ${glow ? `${glow}40` : "rgba(255, 255, 255, 0.12)"}`, borderRadius: "24px", padding: "1.5rem", boxShadow: glow ? `0 8px 32px ${glow}30` : "0 8px 32px rgba(0, 0, 0, 0.4)", ...style }}>{children}</motion.div>
);

const SyntaxHighlight = ({ code }) => {
  const keywords = ['int', 'float', 'double', 'char', 'void', 'bool', 'class', 'struct', 'public', 'private', 'protected', 'virtual', 'return', 'new', 'delete', 'this', 'const', 'friend', 'using', 'namespace', 'std', 'operator', 'override', 'endl', 'cout', 'cin', 'string', 'ostream', 'vector', 'auto'];
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
    return <div key={lIdx} style={{ minHeight: '1.3em' }}>{els.length > 0 ? els : '\u00A0'}</div>;
  });
};

export const CodeBlock = ({ code, fontSize = "10px" }) => (
  <motion.pre initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ fontFamily: "'Fira Code', monospace", fontSize, lineHeight: 1.35, margin: 0, whiteSpace: "pre", overflowX: "auto", background: "rgba(30, 30, 30, 0.95)", padding: "10px 14px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.1)", maxHeight: "320px", overflowY: "auto" }}>
    <SyntaxHighlight code={code} />
  </motion.pre>
);

// ============================================
// SCENE 1: Introduction - Why Operator Overloading?
// ============================================
const Scene1 = () => {
  const [phase, setPhase] = useState(0);
  useEffect(() => { const t = [setTimeout(() => setPhase(1), 600), setTimeout(() => setPhase(2), 1400), setTimeout(() => setPhase(3), 2200)]; return () => t.forEach(clearTimeout); }, []);
  return (
    <div style={containerStyle}>
      <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} style={{ marginBottom: "2rem", textAlign: "center" }}>
        <div style={{ color: colors.accent, fontWeight: 700, fontSize: "14px", letterSpacing: "2px", marginBottom: "0.5rem" }}>RTU OOP DEEP DIVE</div>
        <div style={{ fontSize: "2rem", fontWeight: 700, color: colors.text }}>Operator Overloading</div>
      </motion.div>
      <div style={{ display: "flex", gap: "1.5rem" }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: phase >= 1 ? 1 : 0, y: 0 }} style={{ flex: 1 }}>
          <div style={{ color: colors.success, fontSize: "11px", fontWeight: 600, marginBottom: "0.3rem" }}>✓ int + int</div>
          <GlassCard glow={colors.success}><CodeBlock code={`int a = 5, b = 3;
int result = a + b; // 8`} fontSize="9px" /></GlassCard>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: phase >= 2 ? 1 : 0, y: 0 }} style={{ flex: 1 }}>
          <div style={{ color: colors.success, fontSize: "11px", fontWeight: 600, marginBottom: "0.3rem" }}>✓ string + string</div>
          <GlassCard glow={colors.success}><CodeBlock code={`string s1 = "hello";
string s2 = "world";
string r = s1 + s2; //"helloworld"`} fontSize="9px" /></GlassCard>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: phase >= 3 ? 1 : 0, y: 0 }} style={{ flex: 1 }}>
          <div style={{ color: colors.danger, fontSize: "11px", fontWeight: 600, marginBottom: "0.3rem" }}>❌ class + class</div>
          <GlassCard glow={colors.danger}><CodeBlock code={`Student s1, s2;
Student s3 = s1 + s2;
// COMPILER ERROR!`} fontSize="9px" /></GlassCard>
        </motion.div>
      </div>
    </div>
  );
};

// ============================================
// SCENE 2: The Problem - Compiler Confusion
// ============================================
const Scene2 = () => {
  const code = `class Student {
    int rollNo;
    float marks;
};

Student s1, s2;
s1 + s2;  // What does this mean?
          // Add roll numbers?
          // Average marks?
          // Compiler has no idea!`;
  const [phase, setPhase] = useState(0);
  useEffect(() => { const t = [setTimeout(() => setPhase(1), 800)]; return () => t.forEach(clearTimeout); }, []);
  return (
    <div style={containerStyle}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: colors.danger, fontWeight: 700, fontSize: "13px", letterSpacing: "1.5px", marginBottom: "1.5rem" }}>❓ THE PROBLEM: COMPILER CONFUSION</motion.div>
      <div style={{ display: "flex", gap: "2rem", alignItems: "center" }}>
        <GlassCard style={{ maxWidth: "350px" }}><CodeBlock code={code} /></GlassCard>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 1 ? 1 : 0 }} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" }}>
          <motion.div animate={{ y: [0, -5, 0], rotate: [-5, 5, -5] }} transition={{ duration: 2, repeat: Infinity }} style={{ fontSize: "4rem" }}>🤖</motion.div>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            {["❓", "❓", "❓"].map((q, i) => (
              <motion.div key={i} animate={{ y: [0, -10, 0] }} transition={{ duration: 1, delay: i * 0.2, repeat: Infinity }} style={{ fontSize: "1.5rem" }}>{q}</motion.div>
            ))}
          </div>
          <div style={{ padding: "12px 20px", borderRadius: "12px", background: `${colors.danger}20`, border: `1px solid ${colors.danger}`, color: colors.danger, fontSize: "12px", fontWeight: 600, textAlign: "center" }}>"Compiler is NOT<br/>a mind reader!"</div>
        </motion.div>
      </div>
    </div>
  );
};

// ============================================
// SCENE 3: The Solution - Teaching the Compiler
// ============================================
const Scene3 = () => {
  const [phase, setPhase] = useState(0);
  useEffect(() => { const t = [setTimeout(() => setPhase(1), 800), setTimeout(() => setPhase(2), 1800)]; return () => t.forEach(clearTimeout); }, []);
  return (
    <div style={containerStyle}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: colors.success, fontWeight: 700, fontSize: "13px", letterSpacing: "1.5px", marginBottom: "2rem" }}>💡 THE SOLUTION: TEACH THE COMPILER</motion.div>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1.5rem" }}>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ padding: "16px 40px", borderRadius: "16px", background: `${colors.text}10`, border: `2px solid ${colors.text}30` }}>
          <span style={{ fontFamily: "monospace", fontSize: "1.5rem", color: colors.text }}>a + b</span>
        </motion.div>
        <motion.div initial={{ opacity: 0, scaleY: 0 }} animate={{ opacity: phase >= 1 ? 1 : 0, scaleY: 1 }} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{ width: "3px", height: "30px", background: `linear-gradient(to bottom, ${colors.primary}, ${colors.accent})` }} />
          <motion.div animate={{ y: [0, 5, 0] }} transition={{ duration: 1, repeat: Infinity }} style={{ fontSize: "1.5rem" }}>⬇️</motion.div>
        </motion.div>
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: phase >= 1 ? 1 : 0, scale: 1 }} style={{ padding: "20px 40px", borderRadius: "20px", background: `linear-gradient(135deg, ${colors.operatorColor}30, ${colors.primary}20)`, border: `3px solid ${colors.operatorColor}`, boxShadow: `0 0 30px ${colors.operatorColor}30` }}>
          <span style={{ fontFamily: "monospace", fontSize: "1.3rem", color: colors.operatorColor, fontWeight: 700 }}>a.operator+(b)</span>
        </motion.div>
      </div>
      <AnimatePresence>{phase >= 2 && <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ marginTop: "2rem", padding: "14px 28px", borderRadius: "100px", background: `${colors.accent}15`, border: `1px solid ${colors.accent}40`, textAlign: "center" }}>
        <span style={{ color: colors.text }}>"Operator Overloading = Teaching the compiler what </span><span style={{ color: colors.accent, fontWeight: 700 }}>+ means for YOUR class</span>"
      </motion.div>}</AnimatePresence>
    </div>
  );
};

// ============================================
// SCENE 4: Box Class - Complete Example
// ============================================
const Scene4 = () => {
  const code = `class Box {
public:
    int weight;
    
    Box(int w) : weight(w) {}
    
    // Operator Overloading Function
    Box operator+(const Box& other) const {
        Box temp(this->weight + other.weight);
        return temp;
    }
};

// Usage:
Box b1(10);
Box b2(20);
Box b3 = b1 + b2;  // b3.weight = 30`;
  const [phase, setPhase] = useState(0);
  useEffect(() => { const t = [setTimeout(() => setPhase(1), 1000)]; return () => t.forEach(clearTimeout); }, []);
  return (
    <div style={containerStyle}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: colors.operatorColor, fontWeight: 700, fontSize: "13px", letterSpacing: "1.5px", marginBottom: "1rem" }}>📦 BOX CLASS EXAMPLE</motion.div>
      <div style={{ display: "flex", gap: "2rem", alignItems: "flex-start" }}>
        <GlassCard style={{ maxWidth: "400px" }}><CodeBlock code={code} fontSize="9px" /></GlassCard>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 1 ? 1 : 0 }} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <motion.div animate={{ x: [0, 20, 0] }} transition={{ duration: 2, repeat: Infinity }} style={{ padding: "16px 24px", borderRadius: "12px", background: `${colors.primary}20`, border: `2px solid ${colors.primary}`, fontWeight: 700, color: colors.primary }}>📦 10</motion.div>
            <span style={{ fontSize: "1.5rem", color: colors.operatorColor }}>+</span>
            <motion.div animate={{ x: [0, -20, 0] }} transition={{ duration: 2, repeat: Infinity }} style={{ padding: "16px 24px", borderRadius: "12px", background: `${colors.primary}20`, border: `2px solid ${colors.primary}`, fontWeight: 700, color: colors.primary }}>📦 20</motion.div>
          </div>
          <div style={{ textAlign: "center", fontSize: "1.5rem" }}>⬇️</div>
          <motion.div animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 1.5, repeat: Infinity }} style={{ padding: "20px 40px", borderRadius: "16px", background: `${colors.success}20`, border: `3px solid ${colors.success}`, textAlign: "center", boxShadow: `0 0 20px ${colors.success}30` }}>
            <span style={{ fontWeight: 700, color: colors.success, fontSize: "1.3rem" }}>📦 30</span>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

// ============================================
// SCENE 5: Breakdown - Understanding Each Keyword
// ============================================
const Scene5 = () => {
  const [phase, setPhase] = useState(0);
  useEffect(() => { const t = [setTimeout(() => setPhase(1), 400), setTimeout(() => setPhase(2), 800), setTimeout(() => setPhase(3), 1200), setTimeout(() => setPhase(4), 1600)]; return () => t.forEach(clearTimeout); }, []);
  const parts = [
    { label: "Return Type", code: "Box", desc: "Returns new Box object", color: colors.compileTime },
    { label: "Keyword", code: "operator+", desc: "Special function name", color: colors.success },
    { label: "Parameter", code: "const Box& other", desc: "Reference (efficient), const (safe)", color: colors.pointerColor },
    { label: "Trailing const", code: "const", desc: "Doesn't modify 'this'", color: colors.warning },
  ];
  return (
    <div style={containerStyle}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: colors.accent, fontWeight: 700, fontSize: "13px", letterSpacing: "1.5px", marginBottom: "1rem" }}>🔍 BREAKDOWN: EACH KEYWORD</motion.div>
      <GlassCard style={{ marginBottom: "1.5rem" }}>
        <div style={{ fontFamily: "monospace", fontSize: "14px", color: colors.text, letterSpacing: "0.5px" }}>
          <span style={{ color: colors.compileTime }}>Box</span> <span style={{ color: colors.success }}>operator+</span>(<span style={{ color: colors.pointerColor }}>const Box& other</span>) <span style={{ color: colors.warning }}>const</span>
        </div>
      </GlassCard>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
        {parts.map((p, i) => (
          <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: phase > i ? 1 : 0, x: 0 }} style={{ padding: "12px 16px", borderRadius: "12px", background: `${p.color}15`, border: `1px solid ${p.color}40` }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.3rem" }}>
              <span style={{ color: p.color, fontWeight: 700, fontSize: "12px" }}>{p.label}</span>
              <span style={{ fontFamily: "monospace", fontSize: "11px", color: p.color, background: `${p.color}20`, padding: "2px 6px", borderRadius: "4px" }}>{p.code}</span>
            </div>
            <div style={{ color: colors.textSec, fontSize: "11px" }}>{p.desc}</div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// ============================================
// SCENE 6: Behind the Scenes - Transformation
// ============================================
const Scene6 = () => {
  const [phase, setPhase] = useState(0);
  useEffect(() => { const t = [setTimeout(() => setPhase(1), 600), setTimeout(() => setPhase(2), 1500)]; return () => t.forEach(clearTimeout); }, []);
  const steps = ["b1 calls member function", "b2 passed as argument", "New Box returned", "Assigned to b3"];
  return (
    <div style={containerStyle}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: colors.primary, fontWeight: 700, fontSize: "13px", letterSpacing: "1.5px", marginBottom: "1.5rem" }}>🔧 BEHIND THE SCENES</motion.div>
      <div style={{ display: "flex", gap: "2rem", alignItems: "center" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <GlassCard><CodeBlock code={`// Programmer writes:
Box b3 = b1 + b2;`} fontSize="11px" /></GlassCard>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 1 ? 1 : 0 }} style={{ textAlign: "center", fontSize: "1.5rem" }}>⬇️ Compiler transforms</motion.div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 1 ? 1 : 0 }}>
            <GlassCard glow={colors.accent}><CodeBlock code={`// Compiler sees:
Box b3 = b1.operator+(b2);`} fontSize="11px" /></GlassCard>
          </motion.div>
        </div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 2 ? 1 : 0 }} style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          {steps.map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.15 }} style={{ padding: "8px 16px", borderRadius: "8px", background: `${colors.success}10`, display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span style={{ color: colors.success }}>✓</span>
              <span style={{ color: colors.textSec, fontSize: "11px" }}>{s}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

// ============================================
// SCENE 7: Complex Numbers Example
// ============================================
const Scene7 = () => {
  const code = `class Complex {
    double real, imag;
public:
    Complex(double r, double i) 
        : real(r), imag(i) {}
    
    Complex operator+(const Complex& o) const {
        return Complex(
            real + o.real,
            imag + o.imag
        );
    }
};

// Usage:
Complex c1(3, 4);     // 3 + 4i
Complex c2(1, 2);     // 1 + 2i
Complex c3 = c1 + c2; // 4 + 6i`;
  const [phase, setPhase] = useState(0);
  useEffect(() => { const t = [setTimeout(() => setPhase(1), 800)]; return () => t.forEach(clearTimeout); }, []);
  return (
    <div style={containerStyle}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: colors.virtualColor, fontWeight: 700, fontSize: "13px", letterSpacing: "1.5px", marginBottom: "1rem" }}>🔢 COMPLEX NUMBERS EXAMPLE</motion.div>
      <div style={{ display: "flex", gap: "2rem", alignItems: "flex-start" }}>
        <GlassCard style={{ maxWidth: "380px" }}><CodeBlock code={code} fontSize="9px" /></GlassCard>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 1 ? 1 : 0 }} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
            <div style={{ padding: "10px 16px", borderRadius: "10px", background: `${colors.primary}20`, border: `1px solid ${colors.primary}`, fontFamily: "monospace", color: colors.primary }}>3 + 4i</div>
            <span style={{ color: colors.operatorColor, fontWeight: 700 }}>+</span>
            <div style={{ padding: "10px 16px", borderRadius: "10px", background: `${colors.primary}20`, border: `1px solid ${colors.primary}`, fontFamily: "monospace", color: colors.primary }}>1 + 2i</div>
          </div>
          <div style={{ display: "flex", gap: "2rem", justifyContent: "center" }}>
            <div style={{ fontSize: "11px", color: colors.textSec }}>Real: 3+1=4</div>
            <div style={{ fontSize: "11px", color: colors.textSec }}>Imag: 4+2=6</div>
          </div>
          <div style={{ padding: "14px 24px", borderRadius: "12px", background: `${colors.success}20`, border: `2px solid ${colors.success}`, fontFamily: "monospace", color: colors.success, fontWeight: 700, textAlign: "center" }}>= 4 + 6i ✓</div>
        </motion.div>
      </div>
    </div>
  );
};

// ============================================
// SCENE 8: The Problem - cout << myBox
// ============================================
const Scene8 = () => {
  const code = `Box myBox(25);
cout << myBox;  // ❌ ERROR!

// Why?
cout << myBox
// ↑      ↑
// │      └── Box (OUR class)
// └───────── ostream (NOT our class)`;
  const [phase, setPhase] = useState(0);
  useEffect(() => { const t = [setTimeout(() => setPhase(1), 800)]; return () => t.forEach(clearTimeout); }, []);
  return (
    <div style={containerStyle}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: colors.danger, fontWeight: 700, fontSize: "13px", letterSpacing: "1.5px", marginBottom: "1.5rem" }}>❌ PROBLEM: cout &lt;&lt; myBox</motion.div>
      <div style={{ display: "flex", gap: "2rem", alignItems: "center" }}>
        <GlassCard glow={colors.danger} style={{ maxWidth: "350px" }}><CodeBlock code={code} /></GlassCard>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 1 ? 1 : 0 }} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <div style={{ padding: "12px 20px", borderRadius: "12px", background: `${colors.danger}20`, border: `2px solid ${colors.danger}`, color: colors.danger, fontWeight: 600 }}>cout (std library)</div>
            <span style={{ fontSize: "1.5rem" }}>❌</span>
            <div style={{ padding: "12px 20px", borderRadius: "12px", background: `${colors.primary}20`, border: `2px solid ${colors.primary}`, color: colors.primary, fontWeight: 600 }}>Box (our class)</div>
          </div>
          <div style={{ padding: "12px 20px", borderRadius: "12px", background: `${colors.warning}15`, border: `1px solid ${colors.warning}`, textAlign: "center" }}>
            <div style={{ color: colors.warning, fontWeight: 700 }}>Left operand is NOT our class!</div>
            <div style={{ color: colors.textSec, fontSize: "11px" }}>Member function approach FAILS</div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

// ============================================
// SCENE 9: Friend Functions - The Solution
// ============================================
const Scene9 = () => {
  const code = `class Box {
private:
    int weight;
public:
    Box(int w) : weight(w) {}
    
    // Friend declaration (inside class)
    friend ostream& operator<<(
        ostream& out, const Box& b);
};

// Definition (outside class)
ostream& operator<<(ostream& out, const Box& b) {
    out << "Weight: " << b.weight;
    return out;
}

// Now works!
Box myBox(25);
cout << myBox;  // ✓ Output: Weight: 25`;
  const [phase, setPhase] = useState(0);
  useEffect(() => { const t = [setTimeout(() => setPhase(1), 800)]; return () => t.forEach(clearTimeout); }, []);
  return (
    <div style={containerStyle}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: colors.success, fontWeight: 700, fontSize: "13px", letterSpacing: "1.5px", marginBottom: "1rem" }}>🤝 FRIEND FUNCTIONS - THE SOLUTION</motion.div>
      <div style={{ display: "flex", gap: "2rem", alignItems: "flex-start" }}>
        <GlassCard style={{ maxWidth: "420px" }}><CodeBlock code={code} fontSize="9px" /></GlassCard>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 1 ? 1 : 0 }} style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
          {[
            { icon: "🔑", text: "Declared inside with 'friend'" },
            { icon: "📝", text: "Defined outside the class" },
            { icon: "✌️", text: "Two parameters (both operands)" },
            { icon: "🔄", text: "Returns ostream& for chaining" },
          ].map((item, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} style={{ padding: "10px 16px", borderRadius: "10px", background: `${colors.success}10`, display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span>{item.icon}</span>
              <span style={{ color: colors.textSec, fontSize: "11px" }}>{item.text}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

// Export Part 1 scenes
export const OperatorScenesPart1 = [
  { title: "Why Operator Overloading?", component: Scene1, contentText: "int+int works, string+string works, but Student+Student gives COMPILER ERROR!" },
  { title: "Compiler Confusion", component: Scene2, contentText: "Student s1+s2 - Add roll numbers? Average marks? Compiler is NOT a mind reader!" },
  { title: "Teaching the Compiler", component: Scene3, contentText: "a+b transforms to a.operator+(b). Operator Overloading = Teaching compiler what + means." },
  { title: "Box Class Example", component: Scene4, contentText: "Box(10) + Box(20) = Box(30). Complete working example with operator+ implementation." },
  { title: "Breakdown: Each Keyword", component: Scene5, contentText: "Return type (Box), operator+ keyword, const Box& parameter, trailing const - all explained." },
  { title: "Behind the Scenes", component: Scene6, contentText: "b1 + b2 → b1.operator+(b2). b1 calls member function, b2 passed as argument." },
  { title: "Complex Numbers", component: Scene7, contentText: "Complex(3,4) + Complex(1,2) = Complex(4,6). Real parts add, imaginary parts add." },
  { title: "Problem: cout << myBox", component: Scene8, contentText: "cout is ostream (NOT our class), myBox is Box. Member function approach FAILS!" },
  { title: "Friend Functions", component: Scene9, contentText: "friend declaration inside class, definition outside. Returns ostream& for chaining." },
];
