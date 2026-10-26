/**
 * VersatileFunctionsLecture.jsx - Scenes 1-12
 * Function Overloading, Default Arguments, Inline Functions - Part 1
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
  const keywords = ['int', 'float', 'double', 'char', 'void', 'bool', 'class', 'inline', 'return', 'for', 'if', 'else', 'using', 'namespace', 'std', 'cout', 'endl', 'include'];
  const cColors = { keyword: '#569CD6', string: '#CE9178', comment: '#6A9955', number: '#B5CEA8', function: '#DCDCAA', default: '#D4D4D4', preprocessor: '#C586C0' };
  const lines = code.split('\n');
  return lines.map((line, lIdx) => {
    const els = []; let i = 0;
    while (i < line.length) {
      if (line.slice(i, i + 2) === '//') { els.push(<span key={`${lIdx}-${i}`} style={{ color: cColors.comment }}>{line.slice(i)}</span>); break; }
      if (line[i] === '#') { const m = line.slice(i).match(/^#\w+/); if (m) { els.push(<span key={`${lIdx}-${i}`} style={{ color: cColors.preprocessor }}>{m[0]}</span>); i += m[0].length; continue; } }
      if (line[i] === '"' || line[i] === '<') { const end = line[i] === '"' ? '"' : '>'; let e = i + 1; while (e < line.length && line[e] !== end) e++; els.push(<span key={`${lIdx}-${i}`} style={{ color: cColors.string }}>{line.slice(i, e + 1)}</span>); i = e + 1; continue; }
      if (/\d/.test(line[i])) { const m = line.slice(i).match(/^\d+\.?\d*f?/); if (m) { els.push(<span key={`${lIdx}-${i}`} style={{ color: cColors.number }}>{m[0]}</span>); i += m[0].length; continue; } }
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
// SCENE 1: Title Screen
// ============================================
const Scene1 = () => {
  const [phase, setPhase] = useState(0);
  useEffect(() => { const t = [setTimeout(() => setPhase(1), 500), setTimeout(() => setPhase(2), 1000), setTimeout(() => setPhase(3), 1400), setTimeout(() => setPhase(4), 1800)]; return () => t.forEach(clearTimeout); }, []);
  const features = [
    { icon: "🔀", label: "Function Overloading", color: colors.primary },
    { icon: "⚙️", label: "Default Arguments", color: colors.success },
    { icon: "⚡", label: "Inline Functions", color: colors.warning },
  ];
  return (
    <div style={{ ...containerStyle, background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #1a1a2e 100%)" }}>
      <motion.div initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: "center", marginBottom: "2rem" }}>
        <div style={{ color: colors.accent, fontWeight: 700, fontSize: "12px", letterSpacing: "3px", marginBottom: "0.5rem" }}>RTU OOP DEEP DIVE</div>
        <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} style={{ fontSize: "2rem", fontWeight: 700, color: colors.text }}>Versatile Functions in C++</motion.div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 1 ? 1 : 0 }} style={{ color: colors.textSec, fontSize: "13px", marginTop: "0.5rem" }}>Making Functions More Flexible, Readable & Efficient</motion.div>
      </motion.div>
      <div style={{ display: "flex", gap: "1.5rem", justifyContent: "center" }}>
        {features.map((f, i) => (
          <motion.div key={i} initial={{ opacity: 0, x: -30 }} animate={{ opacity: phase >= i + 2 ? 1 : 0, x: 0 }} style={{ padding: "20px 28px", borderRadius: "16px", background: `${f.color}15`, border: `2px solid ${f.color}`, textAlign: "center", minWidth: "130px" }}>
            <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }} style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>{f.icon}</motion.div>
            <div style={{ color: f.color, fontWeight: 600, fontSize: "11px" }}>{f.label}</div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// ============================================
// SCENE 2: Problem Statement - Why Overloading?
// ============================================
const Scene2 = () => {
  const [phase, setPhase] = useState(0);
  useEffect(() => { const t = [setTimeout(() => setPhase(1), 600), setTimeout(() => setPhase(2), 1200)]; return () => t.forEach(clearTimeout); }, []);
  return (
    <div style={containerStyle}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: colors.danger, fontWeight: 700, fontSize: "13px", letterSpacing: "1.5px", marginBottom: "1.5rem" }}>❓ THE PROBLEM: OLD C STYLE</motion.div>
      <div style={{ display: "flex", gap: "2rem", alignItems: "center" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          {["addTwoIntegers()", "addTwoFloats()", "addThreeIntegers()"].map((fn, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.2 }} style={{ padding: "10px 20px", borderRadius: "10px", background: `${colors.danger}15`, border: `2px solid ${colors.danger}`, fontFamily: "monospace", fontSize: "11px", color: colors.danger, display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem" }}>
              {fn} <span>❌</span>
            </motion.div>
          ))}
        </div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 1 ? 1 : 0 }} style={{ fontSize: "2rem" }}>➡️</motion.div>
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: phase >= 2 ? 1 : 0, scale: 1 }} style={{ padding: "20px 30px", borderRadius: "16px", background: `${colors.success}15`, border: `3px solid ${colors.success}`, textAlign: "center" }}>
          <div style={{ fontFamily: "monospace", fontSize: "1.3rem", color: colors.success, fontWeight: 700 }}>add() ✓</div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem", marginTop: "0.5rem" }}>
            {["Works with int", "Works with float", "Works with 3 nums"].map((t, i) => (
              <div key={i} style={{ fontSize: "10px", color: colors.textSec }}>{t}</div>
            ))}
          </div>
        </motion.div>
      </div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 2 ? 1 : 0 }} style={{ marginTop: "1.5rem", padding: "10px 24px", borderRadius: "100px", background: `${colors.accent}15`, textAlign: "center" }}>
        <span style={{ color: colors.accent, fontWeight: 700 }}>ONE NAME, MULTIPLE FORMS</span>
      </motion.div>
    </div>
  );
};

// ============================================
// SCENE 3: Understanding Parameter Lists
// ============================================
const Scene3 = () => {
  const [phase, setPhase] = useState(0);
  useEffect(() => { const t = [setTimeout(() => setPhase(1), 600)]; return () => t.forEach(clearTimeout); }, []);
  return (
    <div style={containerStyle}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: colors.primary, fontWeight: 700, fontSize: "13px", letterSpacing: "1.5px", marginBottom: "1.5rem" }}>🔍 WHAT MAKES FUNCTIONS DIFFERENT?</motion.div>
      <div style={{ display: "flex", gap: "2.5rem" }}>
        <div style={{ flex: 1 }}>
          <div style={{ color: colors.primary, fontWeight: 600, fontSize: "12px", marginBottom: "0.5rem" }}>NUMBER OF ARGUMENTS</div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <GlassCard glow={colors.primary} style={{ padding: "12px 16px" }}>
              <div style={{ fontFamily: "monospace", fontSize: "11px", color: colors.text }}>add(a, b) → <span style={{ color: colors.primary }}>2 params</span></div>
            </GlassCard>
            <GlassCard glow={colors.success} style={{ padding: "12px 16px" }}>
              <div style={{ fontFamily: "monospace", fontSize: "11px", color: colors.text }}>add(a, b, c) → <span style={{ color: colors.success }}>3 params</span></div>
            </GlassCard>
          </div>
        </div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 1 ? 1 : 0 }} style={{ flex: 1 }}>
          <div style={{ color: colors.warning, fontWeight: 600, fontSize: "12px", marginBottom: "0.5rem" }}>TYPE OF ARGUMENTS</div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <GlassCard glow={colors.primary} style={{ padding: "12px 16px" }}>
              <div style={{ fontFamily: "monospace", fontSize: "11px", color: colors.text }}>add(int, int) → <span style={{ padding: "2px 6px", borderRadius: "4px", background: colors.primary, color: "#000", fontWeight: 600, fontSize: "9px" }}>INT</span></div>
            </GlassCard>
            <GlassCard glow={colors.warning} style={{ padding: "12px 16px" }}>
              <div style={{ fontFamily: "monospace", fontSize: "11px", color: colors.text }}>add(float, float) → <span style={{ padding: "2px 6px", borderRadius: "4px", background: colors.warning, color: "#000", fontWeight: 600, fontSize: "9px" }}>FLOAT</span></div>
            </GlassCard>
          </div>
        </motion.div>
      </div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 1 ? 1 : 0 }} style={{ marginTop: "1.5rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}>
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 3, repeat: Infinity, ease: "linear" }} style={{ fontSize: "1.5rem" }}>⚙️</motion.div>
        <span style={{ color: colors.textSec }}>Compiler checks both to find matching function</span>
      </motion.div>
    </div>
  );
};

// ============================================
// SCENE 4: Complete Code Example
// ============================================
const Scene4 = () => {
  const code = `#include <iostream>
using namespace std;

// Three overloaded functions
int add(int a, int b) {
    return a + b;
}

float add(float a, float b) {
    return a + b;
}

int add(int a, int b, int c) {
    return a + b + c;
}

int main() {
    cout << add(2, 3);        // Result: 5
    cout << add(2.5f, 3.5f);  // Result: 6.0
    cout << add(1, 2, 3);     // Result: 6
}`;
  return (
    <div style={containerStyle}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: colors.success, fontWeight: 700, fontSize: "13px", letterSpacing: "1.5px", marginBottom: "1rem" }}>💻 COMPLETE CODE EXAMPLE</motion.div>
      <div style={{ display: "flex", gap: "1.5rem", alignItems: "flex-start" }}>
        <GlassCard style={{ maxWidth: "420px" }}><CodeBlock code={code} fontSize="8.5px" /></GlassCard>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
          {[
            { call: "add(2, 3)", match: "int add(int, int)", result: "5", color: colors.primary },
            { call: "add(2.5f, 3.5f)", match: "float add(float, float)", result: "6.0", color: colors.warning },
            { call: "add(1, 2, 3)", match: "int add(int, int, int)", result: "6", color: colors.success },
          ].map((item, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.2 }} style={{ padding: "10px 14px", borderRadius: "10px", background: `${item.color}10`, border: `1px solid ${item.color}30` }}>
              <div style={{ fontFamily: "monospace", fontSize: "10px", color: item.color }}>{item.call}</div>
              <div style={{ fontSize: "9px", color: colors.textSec }}>→ {item.match}</div>
              <div style={{ fontWeight: 700, color: item.color, fontSize: "12px" }}>= {item.result}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ============================================
// SCENE 5: Function Signature Explained
// ============================================
const Scene5 = () => {
  const [phase, setPhase] = useState(0);
  useEffect(() => { const t = [setTimeout(() => setPhase(1), 800)]; return () => t.forEach(clearTimeout); }, []);
  return (
    <div style={containerStyle}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: colors.accent, fontWeight: 700, fontSize: "13px", letterSpacing: "1.5px", marginBottom: "1.5rem" }}>📝 FUNCTION SIGNATURE</motion.div>
      <GlassCard glow={colors.accent} style={{ marginBottom: "1.5rem", textAlign: "center" }}>
        <span style={{ color: colors.text }}>Function Signature = </span>
        <span style={{ color: colors.accent, fontWeight: 700 }}>Name + Parameter List</span>
      </GlassCard>
      <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
        {[
          { fn: "int add(int a, int b)", sig: "add(int, int)" },
          { fn: "float add(float a, float b)", sig: "add(float, float)" },
          { fn: "int add(int a, int b, int c)", sig: "add(int, int, int)" },
        ].map((item, i) => (
          <div key={i} style={{ flex: 1, padding: "12px", borderRadius: "10px", background: `${colors.primary}10` }}>
            <div style={{ fontFamily: "monospace", fontSize: "9px", color: colors.textSec }}>{item.fn}</div>
            <div style={{ fontFamily: "monospace", fontSize: "11px", color: colors.primary, fontWeight: 600, marginTop: "0.3rem" }}>→ {item.sig}</div>
          </div>
        ))}
      </div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 1 ? 1 : 0 }} style={{ padding: "12px 20px", borderRadius: "12px", background: `${colors.danger}15`, border: `2px solid ${colors.danger}`, display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <span style={{ fontSize: "1.3rem" }}>⚠️</span>
        <span style={{ color: colors.danger, fontWeight: 600, fontSize: "12px" }}>Return type is NOT part of signature!</span>
      </motion.div>
    </div>
  );
};

// ============================================
// SCENE 6: Common Mistakes
// ============================================
const Scene6 = () => {
  const code1 = `int fun(int x);    // ❌
float fun(int x);  // ❌ Same signature!`;
  const code2 = `int add(int a, int b);   // ❌
int add(int x, int y);   // ❌ Same signature!`;
  const [phase, setPhase] = useState(0);
  useEffect(() => { const t = [setTimeout(() => setPhase(1), 800)]; return () => t.forEach(clearTimeout); }, []);
  return (
    <div style={containerStyle}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: colors.danger, fontWeight: 700, fontSize: "13px", letterSpacing: "1.5px", marginBottom: "1rem" }}>⚠️ COMMON MISTAKES</motion.div>
      <div style={{ display: "flex", gap: "1.5rem" }}>
        <div>
          <div style={{ color: colors.danger, fontSize: "11px", fontWeight: 600, marginBottom: "0.3rem" }}>Different return type ≠ Different function</div>
          <GlassCard glow={colors.danger} style={{ maxWidth: "280px" }}><CodeBlock code={code1} fontSize="9px" /></GlassCard>
        </div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 1 ? 1 : 0 }}>
          <div style={{ color: colors.danger, fontSize: "11px", fontWeight: 600, marginBottom: "0.3rem" }}>Parameter NAMES don't matter!</div>
          <GlassCard glow={colors.danger} style={{ maxWidth: "280px" }}><CodeBlock code={code2} fontSize="9px" /></GlassCard>
        </motion.div>
      </div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 1 ? 1 : 0 }} style={{ marginTop: "1rem", padding: "10px 20px", borderRadius: "100px", background: `${colors.danger}15`, textAlign: "center" }}>
        <span style={{ color: colors.danger }}>Only TYPES matter for overloading, not names!</span>
      </motion.div>
    </div>
  );
};

// ============================================
// SCENE 7: Compile-Time Polymorphism
// ============================================
const Scene7 = () => {
  const [phase, setPhase] = useState(0);
  useEffect(() => { const t = [setTimeout(() => setPhase(1), 600), setTimeout(() => setPhase(2), 1200)]; return () => t.forEach(clearTimeout); }, []);
  return (
    <div style={containerStyle}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: colors.virtualColor, fontWeight: 700, fontSize: "13px", letterSpacing: "1.5px", marginBottom: "1rem" }}>🔮 COMPILE-TIME POLYMORPHISM</motion.div>
      <GlassCard style={{ marginBottom: "1.5rem", textAlign: "center" }}>
        <span style={{ color: colors.textSec }}>Polymorphism = </span>
        <span style={{ color: colors.virtualColor, fontWeight: 700 }}>Poly (Many) + Morph (Forms)</span>
      </GlassCard>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "2rem" }}>
        <motion.div initial={{ scale: 0 }} animate={{ scale: phase >= 1 ? 1 : 0 }} style={{ padding: "16px 24px", borderRadius: "50%", background: `${colors.accent}20`, border: `3px solid ${colors.accent}` }}>
          <span style={{ fontFamily: "monospace", fontWeight: 700, color: colors.accent }}>add()</span>
        </motion.div>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          {[
            { sig: "add(int, int)", color: colors.primary },
            { sig: "add(float, float)", color: colors.warning },
            { sig: "add(int, int, int)", color: colors.success },
          ].map((item, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: 20 }} animate={{ opacity: phase >= 2 ? 1 : 0, x: 0 }} transition={{ delay: i * 0.15 }} style={{ padding: "8px 16px", borderRadius: "8px", background: `${item.color}15`, fontFamily: "monospace", fontSize: "11px", color: item.color }}>{item.sig}</motion.div>
          ))}
        </div>
      </div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 2 ? 1 : 0 }} style={{ marginTop: "1.5rem", padding: "10px 20px", borderRadius: "12px", background: `${colors.success}15` }}>
        <span style={{ color: colors.success, fontSize: "11px" }}>✓ Decision made at COMPILE TIME (Static Binding)</span>
      </motion.div>
    </div>
  );
};

// ============================================
// SCENE 8: Name Mangling
// ============================================
const Scene8 = () => {
  const [phase, setPhase] = useState(0);
  useEffect(() => { const t = [setTimeout(() => setPhase(1), 800)]; return () => t.forEach(clearTimeout); }, []);
  return (
    <div style={containerStyle}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: colors.accent, fontWeight: 700, fontSize: "13px", letterSpacing: "1.5px", marginBottom: "1.5rem" }}>🔧 UNDER THE HOOD: NAME MANGLING</motion.div>
      <div style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <div style={{ padding: "10px 16px", borderRadius: "8px", background: `${colors.text}10`, fontFamily: "monospace", fontSize: "11px", color: colors.text }}>int add(int, int);</div>
          <div style={{ padding: "10px 16px", borderRadius: "8px", background: `${colors.text}10`, fontFamily: "monospace", fontSize: "11px", color: colors.text }}>float add(float, float);</div>
        </div>
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }} style={{ fontSize: "2rem" }}>⚙️</motion.div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 1 ? 1 : 0 }} style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <div style={{ padding: "10px 16px", borderRadius: "8px", background: `${colors.success}15`, fontFamily: "monospace", fontSize: "11px", color: colors.success }}>_Z3addii</div>
          <div style={{ padding: "10px 16px", borderRadius: "8px", background: `${colors.success}15`, fontFamily: "monospace", fontSize: "11px", color: colors.success }}>_Z3addff</div>
        </motion.div>
      </div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 1 ? 1 : 0 }} style={{ marginTop: "1.5rem", color: colors.textSec, fontSize: "11px", textAlign: "center" }}>Compiler creates UNIQUE internal names for linker</motion.div>
    </div>
  );
};

// ============================================
// SCENE 9: Transition to Default Arguments
// ============================================
const Scene9 = () => {
  const code = `sum(5, 10, 0);
sum(3, 7, 0);
sum(2, 8, 0);
// 90% calls use 0!`;
  const [phase, setPhase] = useState(0);
  useEffect(() => { const t = [setTimeout(() => setPhase(1), 800)]; return () => t.forEach(clearTimeout); }, []);
  return (
    <div style={containerStyle}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: colors.warning, fontWeight: 700, fontSize: "13px", letterSpacing: "1.5px", marginBottom: "1.5rem" }}>🔄 WHAT ABOUT FLEXIBILITY?</motion.div>
      <div style={{ display: "flex", gap: "2rem", alignItems: "center" }}>
        <div>
          <div style={{ color: colors.danger, fontSize: "11px", fontWeight: 600, marginBottom: "0.3rem" }}>The Problem: Repetitive Code</div>
          <GlassCard glow={colors.danger} style={{ maxWidth: "250px" }}><CodeBlock code={code} fontSize="10px" /></GlassCard>
        </div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 1 ? 1 : 0 }} style={{ textAlign: "center" }}>
          <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1.5, repeat: Infinity }} style={{ fontSize: "3rem", marginBottom: "0.5rem" }}>⚙️</motion.div>
          <div style={{ color: colors.success, fontWeight: 700, fontSize: "1.3rem" }}>DEFAULT</div>
          <div style={{ color: colors.success, fontWeight: 700, fontSize: "1.3rem" }}>ARGUMENTS</div>
        </motion.div>
      </div>
    </div>
  );
};

// ============================================
// SCENE 10: Default Arguments Explained
// ============================================
const Scene10 = () => {
  const code = `int sum(int a, int b, int c = 0);

sum(2, 3);      // = sum(2, 3, 0) → 5
sum(2, 3, 4);   // Overrides → 9`;
  const [phase, setPhase] = useState(0);
  useEffect(() => { const t = [setTimeout(() => setPhase(1), 800)]; return () => t.forEach(clearTimeout); }, []);
  return (
    <div style={containerStyle}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: colors.success, fontWeight: 700, fontSize: "13px", letterSpacing: "1.5px", marginBottom: "1rem" }}>📌 DEFAULT ARGUMENTS EXPLAINED</motion.div>
      <GlassCard glow={colors.success} style={{ maxWidth: "400px", marginBottom: "1.5rem" }}><CodeBlock code={code} /></GlassCard>
      <div style={{ display: "flex", gap: "1.5rem" }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: phase >= 1 ? 1 : 0, y: 0 }} style={{ padding: "14px 20px", borderRadius: "12px", background: `${colors.primary}15`, border: `1px solid ${colors.primary}` }}>
          <div style={{ fontFamily: "monospace", color: colors.primary, fontWeight: 600 }}>sum(2, 3)</div>
          <div style={{ color: colors.textSec, fontSize: "10px", marginTop: "0.3rem" }}>c uses default = 0</div>
          <div style={{ color: colors.primary, fontWeight: 700, marginTop: "0.3rem" }}>Result: 5</div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: phase >= 1 ? 1 : 0, y: 0 }} transition={{ delay: 0.2 }} style={{ padding: "14px 20px", borderRadius: "12px", background: `${colors.warning}15`, border: `1px solid ${colors.warning}` }}>
          <div style={{ fontFamily: "monospace", color: colors.warning, fontWeight: 600 }}>sum(2, 3, 4)</div>
          <div style={{ color: colors.textSec, fontSize: "10px", marginTop: "0.3rem" }}>c overridden = 4</div>
          <div style={{ color: colors.warning, fontWeight: 700, marginTop: "0.3rem" }}>Result: 9</div>
        </motion.div>
      </div>
    </div>
  );
};

// ============================================
// SCENE 11: Default Arguments Rules
// ============================================
const Scene11 = () => {
  const codeValid = `int fun(int a, int b = 10, int c = 20);  ✅`;
  const codeInvalid = `int fun(int a = 10, int b, int c);  ❌`;
  const [phase, setPhase] = useState(0);
  useEffect(() => { const t = [setTimeout(() => setPhase(1), 800)]; return () => t.forEach(clearTimeout); }, []);
  return (
    <div style={containerStyle}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: colors.primary, fontWeight: 700, fontSize: "13px", letterSpacing: "1.5px", marginBottom: "1rem" }}>📜 DEFAULT ARGUMENTS RULES</motion.div>
      <div style={{ marginBottom: "1rem" }}>
        <div style={{ color: colors.accent, fontSize: "12px", fontWeight: 600, marginBottom: "0.5rem" }}>Rule: Right-to-Left Assignment</div>
        <div style={{ display: "flex", gap: "1.5rem" }}>
          <div>
            <div style={{ color: colors.success, fontSize: "10px", marginBottom: "0.3rem" }}>✅ VALID:</div>
            <GlassCard glow={colors.success} style={{ maxWidth: "340px" }}><CodeBlock code={codeValid} fontSize="9px" /></GlassCard>
          </div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 1 ? 1 : 0 }}>
            <div style={{ color: colors.danger, fontSize: "10px", marginBottom: "0.3rem" }}>❌ INVALID:</div>
            <GlassCard glow={colors.danger} style={{ maxWidth: "300px" }}><CodeBlock code={codeInvalid} fontSize="9px" /></GlassCard>
          </motion.div>
        </div>
      </div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 1 ? 1 : 0 }} style={{ padding: "10px 20px", borderRadius: "10px", background: `${colors.warning}15`, border: `1px solid ${colors.warning}` }}>
        <span style={{ color: colors.warning, fontSize: "11px" }}>⚠️ Once defaults start, ALL parameters to the RIGHT must have defaults!</span>
      </motion.div>
    </div>
  );
};

// ============================================
// SCENE 12: Backward Compatibility
// ============================================
const Scene12 = () => {
  const [phase, setPhase] = useState(0);
  useEffect(() => { const t = [setTimeout(() => setPhase(1), 600), setTimeout(() => setPhase(2), 1200)]; return () => t.forEach(clearTimeout); }, []);
  return (
    <div style={containerStyle}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: colors.success, fontWeight: 700, fontSize: "13px", letterSpacing: "1.5px", marginBottom: "1rem" }}>🛡️ BACKWARD COMPATIBILITY</motion.div>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
        <div style={{ padding: "12px 16px", borderRadius: "10px", background: `${colors.text}10` }}>
          <div style={{ fontFamily: "monospace", fontSize: "10px", color: colors.textSec }}>Version 1.0:</div>
          <div style={{ fontFamily: "monospace", fontSize: "11px", color: colors.text }}>void setup(int version);</div>
        </div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 1 ? 1 : 0 }} style={{ padding: "12px 16px", borderRadius: "10px", background: `${colors.danger}15`, border: `1px solid ${colors.danger}30` }}>
          <div style={{ fontFamily: "monospace", fontSize: "10px", color: colors.danger }}>Version 2.0 WITHOUT default:</div>
          <div style={{ fontFamily: "monospace", fontSize: "11px", color: colors.danger }}>void setup(int version, bool enableLogging);</div>
          <div style={{ fontSize: "10px", color: colors.danger, marginTop: "0.3rem" }}>❌ Old code: setup(5) → BREAKS!</div>
        </motion.div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 2 ? 1 : 0 }} style={{ padding: "12px 16px", borderRadius: "10px", background: `${colors.success}15`, border: `2px solid ${colors.success}` }}>
          <div style={{ fontFamily: "monospace", fontSize: "10px", color: colors.success }}>Version 2.0 WITH default:</div>
          <div style={{ fontFamily: "monospace", fontSize: "11px", color: colors.success }}>void setup(int version, bool enableLogging = false);</div>
          <div style={{ fontSize: "10px", color: colors.success, marginTop: "0.3rem" }}>✅ Old code: setup(5) → WORKS! ✅ New: setup(5, true) → WORKS!</div>
        </motion.div>
      </div>
    </div>
  );
};

// Export Part 1 scenes
export const VersatileScenesPart1 = [
  { title: "Title Screen", component: Scene1, contentText: "Versatile Functions in C++: Function Overloading, Default Arguments, Inline Functions." },
  { title: "Why Overloading?", component: Scene2, contentText: "Old C: addTwoIntegers(), addTwoFloats(). C++ Solution: ONE add() for all. One name, multiple forms!" },
  { title: "Parameter Lists", component: Scene3, contentText: "Compiler checks: 1) Number of arguments 2) Type of arguments. Both matter for matching." },
  { title: "Complete Code Example", component: Scene4, contentText: "add(2,3)→5, add(2.5f,3.5f)→6.0, add(1,2,3)→6. Compiler picks the right function!" },
  { title: "Function Signature", component: Scene5, contentText: "Signature = Name + Parameter List. Return type is NOT part of signature!" },
  { title: "Common Mistakes", component: Scene6, contentText: "Different return type ≠ Different function. Parameter NAMES don't matter, only TYPES!" },
  { title: "Compile-Time Polymorphism", component: Scene7, contentText: "Polymorphism = Many Forms. One name 'add()' → 3 different versions. Decided at COMPILE TIME." },
  { title: "Name Mangling", component: Scene8, contentText: "Compiler creates unique internal names: add(int,int) → _Z3addii. Linker uses these." },
  { title: "Need for Default Arguments", component: Scene9, contentText: "Problem: sum(5,10,0), sum(3,7,0)... 90% calls use 0! Tedious repetition." },
  { title: "Default Arguments Explained", component: Scene10, contentText: "int sum(a, b, c=0). sum(2,3) uses default=0, sum(2,3,4) overrides." },
  { title: "Default Arguments Rules", component: Scene11, contentText: "Right-to-Left: Once defaults start, ALL right params need defaults. fun(a, b=10, c=20) ✅" },
  { title: "Backward Compatibility", component: Scene12, contentText: "Add new param with default. Old code works, new code uses feature. Best of both!" },
];
