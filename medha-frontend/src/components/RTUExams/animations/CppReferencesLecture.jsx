/**
 * CppReferencesLecture.jsx - Scenes 1-7
 * C++ Memory & Reference Mechanics - Part 1
 */
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { colors, containerStyle } from "./VirtualFunctionsTheme";

// Theme colors for this lecture
const memColors = {
  stack: "#3B82F6",    // Blue
  heap: "#F59E0B",     // Orange
  reference: "#8B5CF6", // Purple
  pointer: "#6B7280",  // Gray
  danger: "#EF4444",   // Red
  safe: "#10B981",     // Green
};

// ============================================
// SHARED COMPONENTS
// ============================================
export const GlassCard = ({ children, style = {}, glow = null }) => (
  <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} style={{ background: "rgba(28, 28, 30, 0.65)", backdropFilter: "blur(25px)", border: `1px solid ${glow ? `${glow}40` : "rgba(255, 255, 255, 0.12)"}`, borderRadius: "20px", padding: "1.5rem", boxShadow: glow ? `0 8px 32px ${glow}30` : "0 8px 32px rgba(0, 0, 0, 0.4)", ...style }}>{children}</motion.div>
);

const SyntaxHighlight = ({ code }) => {
  const keywords = ['int', 'float', 'double', 'char', 'void', 'bool', 'class', 'struct', 'public', 'private', 'const', 'new', 'delete', 'return', 'this', 'using', 'namespace', 'std', 'cout', 'cin', 'endl', 'unique_ptr', 'make_unique', 'include', 'memory'];
  const cColors = { keyword: '#569CD6', string: '#CE9178', comment: '#6A9955', preprocessor: '#C586C0', number: '#B5CEA8', function: '#DCDCAA', default: '#D4D4D4' };
  const lines = code.split('\n');
  return lines.map((line, lIdx) => {
    const els = []; let i = 0;
    while (i < line.length) {
      if (line.slice(i, i + 2) === '//') { els.push(<span key={`${lIdx}-${i}`} style={{ color: cColors.comment }}>{line.slice(i)}</span>); break; }
      if (line[i] === '#') { const m = line.slice(i).match(/^#\w+/); if (m) { els.push(<span key={`${lIdx}-${i}`} style={{ color: cColors.preprocessor }}>{m[0]}</span>); i += m[0].length; continue; } }
      if (line[i] === '"' || line[i] === '<') { const end = line[i] === '"' ? '"' : '>'; let e = i + 1; while (e < line.length && line[e] !== end) e++; els.push(<span key={`${lIdx}-${i}`} style={{ color: cColors.string }}>{line.slice(i, e + 1)}</span>); i = e + 1; continue; }
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
// SCENE 1: Introduction & Problem Setup
// ============================================
const Scene1 = () => {
  const [phase, setPhase] = useState(0);
  useEffect(() => { const t = [setTimeout(() => setPhase(1), 600), setTimeout(() => setPhase(2), 1500)]; return () => t.forEach(clearTimeout); }, []);
  return (
    <div style={containerStyle}>
      <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} style={{ marginBottom: "2rem", textAlign: "center" }}>
        <div style={{ color: colors.accent, fontWeight: 700, fontSize: "14px", letterSpacing: "2px", marginBottom: "0.5rem" }}>RTU OOP DEEP DIVE</div>
        <div style={{ fontSize: "2rem", fontWeight: 700, color: colors.text }}>C++ Memory & Reference Mechanics</div>
      </motion.div>
      <div style={{ display: "flex", gap: "2rem" }}>
        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: phase >= 1 ? 1 : 0, x: 0 }} style={{ flex: 1, padding: "20px", borderRadius: "16px", background: `${memColors.safe}15`, border: `2px solid ${memColors.safe}`, textAlign: "center" }}>
          <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>🛡️</div>
          <div style={{ color: memColors.safe, fontWeight: 700 }}>Safe & Disciplined</div>
          <div style={{ color: colors.textSec, fontSize: "11px", marginTop: "0.3rem" }}>References</div>
        </motion.div>
        <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: phase >= 2 ? 1 : 0, x: 0 }} style={{ flex: 1, padding: "20px", borderRadius: "16px", background: `${memColors.danger}15`, border: `2px solid ${memColors.danger}`, textAlign: "center" }}>
          <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>⚡</div>
          <div style={{ color: memColors.danger, fontWeight: 700 }}>Powerful & Dangerous</div>
          <div style={{ color: colors.textSec, fontSize: "11px", marginTop: "0.3rem" }}>Dynamic Memory</div>
        </motion.div>
      </div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 2 ? 1 : 0 }} style={{ marginTop: "1.5rem" }}>
        <GlassCard><CodeBlock code={`int a = 10;
// Problem: Passing to function creates a COPY
// Imagine copying 1GB of data... 😱`} fontSize="10px" /></GlassCard>
      </motion.div>
    </div>
  );
};

// ============================================
// SCENE 2: References - The Alias Concept
// ============================================
const Scene2 = () => {
  const code = `int a = 10;
int &r = a;  // r is alias of a

r = 20;      // Changes both r and a
cout << a;   // Outputs: 20`;
  const [val, setVal] = useState(10);
  const [phase, setPhase] = useState(0);
  useEffect(() => { const t = [setTimeout(() => setPhase(1), 800), setTimeout(() => { setPhase(2); setVal(20); }, 1800)]; return () => t.forEach(clearTimeout); }, []);
  return (
    <div style={containerStyle}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: memColors.reference, fontWeight: 700, fontSize: "13px", letterSpacing: "1.5px", marginBottom: "1.5rem" }}>📌 REFERENCES: THE ALIAS CONCEPT</motion.div>
      <div style={{ display: "flex", gap: "2.5rem", alignItems: "center" }}>
        <GlassCard style={{ maxWidth: "320px" }}><CodeBlock code={code} /></GlassCard>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" }}>
          <div style={{ display: "flex", gap: "1.5rem" }}>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div style={{ padding: "4px 12px", borderRadius: "8px", background: `${memColors.reference}30`, color: memColors.reference, fontWeight: 600, marginBottom: "0.3rem" }}>a</div>
              <motion.div key={val} initial={{ scale: 0.8 }} animate={{ scale: 1 }} style={{ width: "50px", height: "50px", borderRadius: "10px", background: `${memColors.stack}20`, border: `2px solid ${memColors.stack}`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, color: memColors.stack }}>{val}</motion.div>
            </motion.div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 1 ? 1 : 0 }} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div style={{ padding: "4px 12px", borderRadius: "8px", background: `${memColors.reference}30`, color: memColors.reference, fontWeight: 600, marginBottom: "0.3rem" }}>r</div>
              <motion.div animate={{ x: [-5, 5, -5] }} transition={{ duration: 1, repeat: Infinity }} style={{ fontSize: "1.5rem" }}>↘️</motion.div>
            </motion.div>
          </div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 1 ? 1 : 0 }} style={{ padding: "8px 16px", borderRadius: "8px", background: `${memColors.reference}15`, color: memColors.reference, fontSize: "11px" }}>Same memory location!</motion.div>
        </div>
      </div>
      <AnimatePresence>{phase >= 2 && <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ marginTop: "1rem", padding: "10px 20px", borderRadius: "100px", background: `${memColors.safe}15`, border: `1px solid ${memColors.safe}40`, textAlign: "center" }}>
        <span style={{ color: memColors.safe }}>r = 20 changes BOTH → a is now 20</span>
      </motion.div>}</AnimatePresence>
    </div>
  );
};

// ============================================
// SCENE 3: Pass by Reference
// ============================================
const Scene3 = () => {
  const code = `void change(int &x) {
    x = 100;  // Modifies original!
}

int main() {
    int a = 50;
    change(a);
    cout << a;  // Outputs: 100
}`;
  const [phase, setPhase] = useState(0);
  useEffect(() => { const t = [setTimeout(() => setPhase(1), 800)]; return () => t.forEach(clearTimeout); }, []);
  return (
    <div style={containerStyle}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: memColors.safe, fontWeight: 700, fontSize: "13px", letterSpacing: "1.5px", marginBottom: "1rem" }}>📤 PASS BY REFERENCE</motion.div>
      <div style={{ display: "flex", gap: "2rem", alignItems: "flex-start" }}>
        <GlassCard style={{ maxWidth: "300px" }}><CodeBlock code={code} /></GlassCard>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 1 ? 1 : 0 }} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div style={{ display: "flex", gap: "1.5rem" }}>
            <div style={{ padding: "16px 24px", borderRadius: "12px", background: `${memColors.danger}15`, border: `2px solid ${memColors.danger}`, textAlign: "center" }}>
              <div style={{ color: memColors.danger, fontWeight: 600, fontSize: "12px" }}>Pass by Value</div>
              <div style={{ color: colors.textSec, fontSize: "10px" }}>Creates copy 📋</div>
              <div style={{ color: memColors.danger, fontSize: "10px" }}>Slow for large data</div>
            </div>
            <div style={{ padding: "16px 24px", borderRadius: "12px", background: `${memColors.safe}15`, border: `2px solid ${memColors.safe}`, textAlign: "center" }}>
              <div style={{ color: memColors.safe, fontWeight: 600, fontSize: "12px" }}>Pass by Reference</div>
              <div style={{ color: colors.textSec, fontSize: "10px" }}>Direct link 🔗</div>
              <div style={{ color: memColors.safe, fontSize: "10px" }}>No copying!</div>
            </div>
          </div>
          <motion.div animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 1.5, repeat: Infinity }} style={{ padding: "12px 20px", borderRadius: "12px", background: `${memColors.safe}20`, border: `2px solid ${memColors.safe}`, textAlign: "center" }}>
            <span style={{ color: memColors.safe, fontWeight: 600 }}>🚀 Efficient!</span>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

// ============================================
// SCENE 4: Const References - Safety Layer
// ============================================
const Scene4 = () => {
  const code = `void lookButDontTouch(const int &x) {
    // x = 50;  // ERROR! Cannot modify
    cout << x; // OK - can read
}`;
  const [phase, setPhase] = useState(0);
  useEffect(() => { const t = [setTimeout(() => setPhase(1), 600)]; return () => t.forEach(clearTimeout); }, []);
  return (
    <div style={containerStyle}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: colors.warning, fontWeight: 700, fontSize: "13px", letterSpacing: "1.5px", marginBottom: "1.5rem" }}>🔒 CONST REFERENCES: SAFETY LAYER</motion.div>
      <div style={{ display: "flex", gap: "2rem", alignItems: "center" }}>
        <GlassCard glow={colors.warning} style={{ maxWidth: "380px" }}><CodeBlock code={code} /></GlassCard>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 1 ? 1 : 0 }} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span style={{ fontSize: "1.5rem" }}>🔒</span>
            <span style={{ color: colors.warning, fontWeight: 600 }}>const</span>
            <span style={{ color: colors.textSec, fontSize: "11px" }}>= Promise not to modify</span>
          </div>
          <div style={{ padding: "10px 16px", borderRadius: "10px", background: `${memColors.danger}15`, display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span style={{ color: memColors.danger }}>❌</span>
            <span style={{ fontFamily: "monospace", fontSize: "11px", color: memColors.danger }}>x = 50</span>
            <span style={{ color: colors.textSec, fontSize: "10px" }}>Write blocked</span>
          </div>
          <div style={{ padding: "10px 16px", borderRadius: "10px", background: `${memColors.safe}15`, display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span style={{ color: memColors.safe }}>✓</span>
            <span style={{ fontFamily: "monospace", fontSize: "11px", color: memColors.safe }}>cout &lt;&lt; x</span>
            <span style={{ color: colors.textSec, fontSize: "10px" }}>Read allowed</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

// ============================================
// SCENE 5: References vs Pointers
// ============================================
const Scene5 = () => {
  const [phase, setPhase] = useState(0);
  useEffect(() => { const t = [setTimeout(() => setPhase(1), 800)]; return () => t.forEach(clearTimeout); }, []);
  return (
    <div style={containerStyle}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: colors.accent, fontWeight: 700, fontSize: "13px", letterSpacing: "1.5px", marginBottom: "1.5rem" }}>⚖️ REFERENCES vs POINTERS</motion.div>
      <div style={{ display: "flex", gap: "2.5rem" }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ flex: 1, padding: "20px", borderRadius: "16px", background: `${memColors.pointer}15`, border: `2px solid ${memColors.pointer}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
            <span style={{ fontSize: "1.5rem" }}>📍</span>
            <span style={{ color: memColors.pointer, fontWeight: 700 }}>POINTER</span>
          </div>
          <div style={{ fontSize: "12px", color: colors.textSec, lineHeight: 1.6 }}>
            <div>• Like a house <b>address slip</b></div>
            <div>• Can be NULL</div>
            <div>• Can be reassigned</div>
            <div>• Flexible but <span style={{ color: memColors.danger }}>dangerous</span></div>
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: phase >= 1 ? 1 : 0, y: 0 }} style={{ flex: 1, padding: "20px", borderRadius: "16px", background: `${memColors.reference}15`, border: `2px solid ${memColors.reference}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
            <span style={{ fontSize: "1.5rem" }}>🔑</span>
            <span style={{ color: memColors.reference, fontWeight: 700 }}>REFERENCE</span>
          </div>
          <div style={{ fontSize: "12px", color: colors.textSec, lineHeight: 1.6 }}>
            <div>• Like a house <b>key</b></div>
            <div>• Cannot be NULL</div>
            <div>• Cannot reassign</div>
            <div>• Restricted but <span style={{ color: memColors.safe }}>safe</span></div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

// ============================================
// SCENE 6: Three Strict Rules of References
// ============================================
const Scene6 = () => {
  const [phase, setPhase] = useState(0);
  useEffect(() => { const t = [setTimeout(() => setPhase(1), 400), setTimeout(() => setPhase(2), 800), setTimeout(() => setPhase(3), 1200)]; return () => t.forEach(clearTimeout); }, []);
  const rules = [
    { num: 1, title: "Must Initialize", good: "int &r = a;", bad: "int &r;", reason: "References need a target" },
    { num: 2, title: "Cannot be NULL", good: "Always valid", bad: "No null check needed", reason: "References are always bound" },
    { num: 3, title: "Cannot Reassign", good: "r = value (changes value)", bad: "r = &b (can't rebind)", reason: "Permanent binding" },
  ];
  return (
    <div style={containerStyle}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: memColors.reference, fontWeight: 700, fontSize: "13px", letterSpacing: "1.5px", marginBottom: "1.5rem" }}>📜 THREE STRICT RULES OF REFERENCES</motion.div>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
        {rules.map((r, i) => (
          <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: phase > i ? 1 : 0, x: 0 }} style={{ padding: "12px 16px", borderRadius: "12px", background: `${memColors.reference}10`, border: `1px solid ${memColors.reference}30`, display: "flex", alignItems: "center", gap: "1rem" }}>
            <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: `${memColors.reference}30`, display: "flex", alignItems: "center", justifyContent: "center", color: memColors.reference, fontWeight: 700, fontSize: "12px" }}>{r.num}</div>
            <div style={{ flex: 1 }}>
              <div style={{ color: memColors.reference, fontWeight: 600, fontSize: "12px" }}>{r.title}</div>
              <div style={{ color: colors.textSec, fontSize: "10px" }}>{r.reason}</div>
            </div>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <span style={{ padding: "4px 8px", borderRadius: "4px", background: `${memColors.safe}15`, fontFamily: "monospace", fontSize: "9px", color: memColors.safe }}>✓ {r.good}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// ============================================
// SCENE 7: Stack vs Heap
// ============================================
const Scene7 = () => {
  const [phase, setPhase] = useState(0);
  useEffect(() => { const t = [setTimeout(() => setPhase(1), 800)]; return () => t.forEach(clearTimeout); }, []);
  return (
    <div style={containerStyle}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: colors.accent, fontWeight: 700, fontSize: "13px", letterSpacing: "1.5px", marginBottom: "1.5rem" }}>🧠 MEMORY MODEL: STACK vs HEAP</motion.div>
      <div style={{ display: "flex", gap: "2.5rem" }}>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ flex: 1, padding: "20px", borderRadius: "16px", background: `${memColors.stack}15`, border: `2px solid ${memColors.stack}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
            <span style={{ fontSize: "1.5rem" }}>📚</span>
            <span style={{ color: memColors.stack, fontWeight: 700 }}>STACK</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
            {["Auto cleanup", "Fast access", "Function-bound", "Fixed size"].map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.1 }} style={{ padding: "6px 10px", borderRadius: "6px", background: `${memColors.stack}20`, fontSize: "11px", color: colors.text }}>{item}</motion.div>
            ))}
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 1 ? 1 : 0 }} style={{ flex: 1, padding: "20px", borderRadius: "16px", background: `${memColors.heap}15`, border: `2px solid ${memColors.heap}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
            <span style={{ fontSize: "1.5rem" }}>🏭</span>
            <span style={{ color: memColors.heap, fontWeight: 700 }}>HEAP</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
            {["Manual cleanup", "Persistent", "Flexible size", "Slower access"].map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.1 }} style={{ padding: "6px 10px", borderRadius: "6px", background: `${memColors.heap}20`, fontSize: "11px", color: colors.text }}>{item}</motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

// Export Part 1 scenes
export const RefScenesPart1 = [
  { title: "Introduction", component: Scene1, contentText: "C++ Memory & References - Safe & Disciplined vs Powerful & Dangerous." },
  { title: "References: Alias Concept", component: Scene2, contentText: "int &r = a; r is alias of a. r = 20 changes both! Same memory location." },
  { title: "Pass by Reference", component: Scene3, contentText: "void change(int &x) modifies original. No copying = efficient for large data!" },
  { title: "Const References", component: Scene4, contentText: "const int &x - can read, cannot modify. Promise not to touch!" },
  { title: "References vs Pointers", component: Scene5, contentText: "Pointer = address slip (flexible but dangerous). Reference = key (restricted but safe)." },
  { title: "Three Reference Rules", component: Scene6, contentText: "1. Must initialize 2. Cannot be NULL 3. Cannot reassign. Permanent binding!" },
  { title: "Stack vs Heap", component: Scene7, contentText: "Stack: auto cleanup, fast, function-bound. Heap: manual cleanup, persistent, flexible." },
];
