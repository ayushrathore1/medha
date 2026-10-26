/**
 * InheritanceLecture.jsx - All 12 Scenes
 * C++ Inheritance - Why, What, and How
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
  const keywords = ['int', 'void', 'class', 'public', 'private', 'protected', 'virtual', 'cout', 'endl'];
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
  <motion.pre initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ fontFamily: "'Fira Code', monospace", fontSize, lineHeight: 1.35, margin: 0, whiteSpace: "pre", overflowX: "auto", background: "rgba(30, 30, 30, 0.95)", padding: "10px 14px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.1)", maxHeight: "280px", overflowY: "auto" }}>
    <SyntaxHighlight code={code} />
  </motion.pre>
);

// ============================================
// SCENE 1: Opening Hook - Why Inheritance
// ============================================
const Scene1 = () => {
  const [phase, setPhase] = useState(0);
  useEffect(() => { const t = [setTimeout(() => setPhase(1), 600), setTimeout(() => setPhase(2), 1200)]; return () => t.forEach(clearTimeout); }, []);
  const carCode = `class Car {
public:
    void startEngine();
    void stopEngine();
};`;
  const busCode = `class Bus {
public:
    void startEngine();
    void stopEngine();
};`;
  return (
    <div style={{ ...containerStyle, background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #1a1a2e 100%)" }}>
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: "center", marginBottom: "1.5rem" }}>
        <div style={{ color: colors.accent, fontWeight: 700, fontSize: "12px", letterSpacing: "3px", marginBottom: "0.3rem" }}>RTU OOP DEEP DIVE</div>
        <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} style={{ fontSize: "1.8rem", fontWeight: 700, color: colors.text }}>C++ Inheritance</motion.div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 1 ? 1 : 0 }} style={{ color: colors.textSec, fontSize: "13px" }}>Why, What, and How</motion.div>
      </motion.div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 1 ? 1 : 0 }} style={{ color: colors.warning, fontSize: "12px", textAlign: "center", marginBottom: "1rem" }}>"Why not just copy-paste?"</motion.div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 2 ? 1 : 0 }} style={{ display: "flex", gap: "1.5rem", justifyContent: "center" }}>
        <motion.div initial={{ x: -50 }} animate={{ x: 0 }}>
          <div style={{ color: colors.primary, fontSize: "11px", fontWeight: 600, marginBottom: "0.3rem" }}>🚗 Car</div>
          <GlassCard style={{ maxWidth: "220px" }}><CodeBlock code={carCode} fontSize="9px" /></GlassCard>
        </motion.div>
        <motion.div initial={{ x: 50 }} animate={{ x: 0 }}>
          <div style={{ color: colors.success, fontSize: "11px", fontWeight: 600, marginBottom: "0.3rem" }}>🚌 Bus</div>
          <GlassCard style={{ maxWidth: "220px" }}><CodeBlock code={busCode} fontSize="9px" /></GlassCard>
        </motion.div>
      </motion.div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 2 ? 1 : 0 }} style={{ marginTop: "1rem", textAlign: "center", color: colors.warning, fontSize: "11px" }}>📋 Copy → Paste... Seems easy?</motion.div>
    </div>
  );
};

// ============================================
// SCENE 2: The Maintenance Nightmare
// ============================================
const Scene2 = () => {
  const [phase, setPhase] = useState(0);
  useEffect(() => { const t = [setTimeout(() => setPhase(1), 800), setTimeout(() => setPhase(2), 1500)]; return () => t.forEach(clearTimeout); }, []);
  const vehicles = ["Car", "Bus", "Truck", "Bike", "Scooter", "Van", "Taxi", "Jeep", "Train", "Auto"];
  return (
    <div style={containerStyle}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: colors.danger, fontWeight: 700, fontSize: "13px", letterSpacing: "1.5px", marginBottom: "1rem" }}>😱 THE MAINTENANCE NIGHTMARE</motion.div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", justifyContent: "center", marginBottom: "1rem" }}>
        {vehicles.map((v, i) => (
          <motion.div key={i} initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1, x: phase >= 2 ? [-2, 2, -2, 0] : 0 }} transition={{ delay: i * 0.08 }} style={{ padding: "8px 12px", borderRadius: "8px", background: phase >= 1 ? `${colors.danger}15` : `${colors.text}10`, border: `1px solid ${phase >= 1 ? colors.danger : colors.text}30`, fontSize: "10px", textAlign: "center" }}>
            <div style={{ color: phase >= 1 ? colors.danger : colors.text, fontWeight: 600 }}>{v}</div>
            <div style={{ fontFamily: "monospace", fontSize: "8px", color: colors.textSec }}>startEngine()</div>
          </motion.div>
        ))}
      </div>
      <AnimatePresence>{phase >= 1 && <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} style={{ padding: "10px 20px", borderRadius: "12px", background: `${colors.danger}20`, border: `2px solid ${colors.danger}`, textAlign: "center", marginBottom: "1rem" }}>
        <span style={{ color: colors.danger, fontWeight: 600 }}>🐛 Bug found in startEngine()!</span>
        <span style={{ color: colors.textSec, fontSize: "11px", marginLeft: "0.5rem" }}>Changes needed: 10 places!</span>
      </motion.div>}</AnimatePresence>
      <AnimatePresence>{phase >= 2 && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
        {["Code Duplication", "Error Prone", "Hard to Maintain"].map((t, i) => (
          <div key={i} style={{ padding: "8px 14px", borderRadius: "8px", background: `${colors.danger}15`, color: colors.danger, fontSize: "10px" }}>❌ {t}</div>
        ))}
      </motion.div>}</AnimatePresence>
    </div>
  );
};

// ============================================
// SCENE 3: Three Core Problems
// ============================================
const Scene3 = () => {
  const [phase, setPhase] = useState(0);
  useEffect(() => { const t = [setTimeout(() => setPhase(1), 500), setTimeout(() => setPhase(2), 1000), setTimeout(() => setPhase(3), 1500)]; return () => t.forEach(clearTimeout); }, []);
  const problems = [
    { icon: "📄", title: "Code Duplication", desc: "Same code repeated everywhere" },
    { icon: "🌐", title: "No Structure", desc: "Classes floating without connection" },
    { icon: "❓", title: "Hard to Extend", desc: "Adding ElectricCar? Good luck!" },
  ];
  return (
    <div style={containerStyle}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: colors.danger, fontWeight: 700, fontSize: "13px", letterSpacing: "1.5px", marginBottom: "1.5rem" }}>🚨 THREE CORE PROBLEMS</motion.div>
      <div style={{ display: "flex", gap: "1.5rem", justifyContent: "center" }}>
        {problems.map((p, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 30 }} animate={{ opacity: phase > i ? 1 : 0, y: 0 }} style={{ padding: "20px", borderRadius: "16px", background: `${colors.danger}15`, border: `2px solid ${colors.danger}`, textAlign: "center", width: "140px" }}>
            <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>{p.icon}</div>
            <div style={{ color: colors.danger, fontWeight: 700, fontSize: "12px" }}>{p.title}</div>
            <div style={{ color: colors.textSec, fontSize: "10px", marginTop: "0.3rem" }}>{p.desc}</div>
            <motion.div initial={{ scale: 0 }} animate={{ scale: phase > i ? 1 : 0 }} style={{ marginTop: "0.5rem", color: colors.danger, fontSize: "1.2rem" }}>❌</motion.div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// ============================================
// SCENE 4: Birth of the Base Class
// ============================================
const Scene4 = () => {
  const [phase, setPhase] = useState(0);
  useEffect(() => { const t = [setTimeout(() => setPhase(1), 600), setTimeout(() => setPhase(2), 1200)]; return () => t.forEach(clearTimeout); }, []);
  const baseCode = `class Vehicle {
public:
    void startEngine();
    void stopEngine();
};`;
  return (
    <div style={containerStyle}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: colors.success, fontWeight: 700, fontSize: "13px", letterSpacing: "1.5px", marginBottom: "1.5rem" }}>✨ THE BIRTH OF THE BASE CLASS</motion.div>
      <motion.div initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} style={{ marginBottom: "1.5rem" }}>
        <GlassCard glow={colors.success} style={{ maxWidth: "300px", margin: "0 auto" }}><CodeBlock code={baseCode} fontSize="10px" /></GlassCard>
      </motion.div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 1 ? 1 : 0 }} style={{ display: "flex", gap: "3rem", justifyContent: "center", marginBottom: "1.5rem" }}>
        {["🚗 Car", "🚌 Bus", "🚚 Truck"].map((v, i) => (
          <motion.div key={i} initial={{ y: 50 }} animate={{ y: 0 }} transition={{ delay: i * 0.15 }} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <motion.div animate={{ height: phase >= 1 ? "30px" : "0px" }} style={{ width: "2px", background: colors.success, marginBottom: "0.5rem" }} />
            <div style={{ padding: "10px 20px", borderRadius: "10px", background: `${colors.primary}15`, border: `1px solid ${colors.primary}`, fontSize: "12px", color: colors.primary }}>{v}</div>
          </motion.div>
        ))}
      </motion.div>
      <AnimatePresence>{phase >= 2 && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
        {["One place for common code", "Reusability", "Structure"].map((t, i) => (
          <div key={i} style={{ padding: "8px 14px", borderRadius: "8px", background: `${colors.success}15`, color: colors.success, fontSize: "10px" }}>✅ {t}</div>
        ))}
      </motion.div>}</AnimatePresence>
    </div>
  );
};

// ============================================
// SCENE 5: First Real Code - Animal
// ============================================
const Scene5 = () => {
  const code = `class Animal {
public:
    void eat() {
        cout << "This creature is eating";
    }
};`;
  return (
    <div style={containerStyle}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: colors.primary, fontWeight: 700, fontSize: "13px", letterSpacing: "1.5px", marginBottom: "1.5rem" }}>🐾 FIRST REAL CODE: ANIMAL BASE CLASS</motion.div>
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} style={{ maxWidth: "400px", margin: "0 auto" }}>
        <GlassCard glow={colors.primary}><CodeBlock code={code} fontSize="11px" /></GlassCard>
      </motion.div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} style={{ marginTop: "1.5rem", display: "flex", justifyContent: "center", gap: "1rem" }}>
        <div style={{ padding: "8px 16px", borderRadius: "100px", background: `${colors.primary}15`, fontSize: "11px" }}>
          <span style={{ color: colors.primary, fontWeight: 600 }}>Animal</span>
          <span style={{ color: colors.textSec }}> = Base Class</span>
        </div>
        <div style={{ padding: "8px 16px", borderRadius: "100px", background: `${colors.success}15`, fontSize: "11px" }}>
          <span style={{ color: colors.success, fontWeight: 600 }}>eat()</span>
          <span style={{ color: colors.textSec }}> = Inherited function</span>
        </div>
      </motion.div>
    </div>
  );
};

// ============================================
// SCENE 6: Dog Inherits Animal - Syntax Breakdown
// ============================================
const Scene6 = () => {
  const [phase, setPhase] = useState(0);
  useEffect(() => { const t = [setTimeout(() => setPhase(1), 800)]; return () => t.forEach(clearTimeout); }, []);
  const animalCode = `class Animal {
public:
    void eat() {
        cout << "Eating...";
    }
};`;
  const dogCode = `class Dog : public Animal {
public:
    void bark() {
        cout << "Barking!";
    }
};`;
  return (
    <div style={containerStyle}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: colors.success, fontWeight: 700, fontSize: "13px", letterSpacing: "1.5px", marginBottom: "1rem" }}>🐕 DOG INHERITS ANIMAL</motion.div>
      <div style={{ display: "flex", gap: "1.5rem", justifyContent: "center", marginBottom: "1rem" }}>
        <div>
          <div style={{ color: colors.primary, fontSize: "10px", fontWeight: 600, marginBottom: "0.3rem" }}>Base Class</div>
          <GlassCard style={{ maxWidth: "240px" }}><CodeBlock code={animalCode} fontSize="9px" /></GlassCard>
        </div>
        <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}>
          <div style={{ color: colors.success, fontSize: "10px", fontWeight: 600, marginBottom: "0.3rem" }}>Derived Class</div>
          <GlassCard glow={colors.success} style={{ maxWidth: "280px" }}><CodeBlock code={dogCode} fontSize="9px" /></GlassCard>
        </motion.div>
      </div>
      <AnimatePresence>{phase >= 1 && <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
        <div style={{ padding: "8px 14px", borderRadius: "8px", background: `${colors.accent}15`, fontSize: "10px" }}>
          <span style={{ color: colors.accent, fontWeight: 600 }}>:</span>
          <span style={{ color: colors.textSec }}> → Inheritance symbol</span>
        </div>
        <div style={{ padding: "8px 14px", borderRadius: "8px", background: `${colors.warning}15`, fontSize: "10px" }}>
          <span style={{ color: colors.warning, fontWeight: 600 }}>public</span>
          <span style={{ color: colors.textSec }}> → Inheritance mode</span>
        </div>
        <div style={{ padding: "8px 14px", borderRadius: "8px", background: `${colors.primary}15`, fontSize: "10px" }}>
          <span style={{ color: colors.primary, fontWeight: 600 }}>Animal</span>
          <span style={{ color: colors.textSec }}> → Base class name</span>
        </div>
      </motion.div>}</AnimatePresence>
    </div>
  );
};

// ============================================
// SCENE 7: The Magic - Eat Without Writing It
// ============================================
const Scene7 = () => {
  const [phase, setPhase] = useState(0);
  useEffect(() => { const t = [setTimeout(() => setPhase(1), 600), setTimeout(() => setPhase(2), 1200)]; return () => t.forEach(clearTimeout); }, []);
  const code = `int main() {
    Dog myDog;
    myDog.eat();   // From Animal!
    myDog.bark();  // From Dog
}`;
  return (
    <div style={containerStyle}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: colors.virtualColor, fontWeight: 700, fontSize: "13px", letterSpacing: "1.5px", marginBottom: "1.5rem" }}>✨ THE MAGIC: INHERITED FUNCTIONS</motion.div>
      <GlassCard style={{ maxWidth: "320px", margin: "0 auto", marginBottom: "1.5rem" }}><CodeBlock code={code} fontSize="10px" /></GlassCard>
      <div style={{ display: "flex", gap: "2rem", justifyContent: "center" }}>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 1 ? 1 : 0 }} style={{ padding: "14px 20px", borderRadius: "12px", background: `${colors.primary}15`, border: `2px solid ${colors.primary}`, textAlign: "center" }}>
          <div style={{ fontFamily: "monospace", color: colors.primary }}>myDog.eat()</div>
          <motion.div animate={{ y: [0, -5, 0] }} transition={{ duration: 1, repeat: Infinity }} style={{ fontSize: "1.2rem", margin: "0.3rem 0" }}>⬆️</motion.div>
          <div style={{ fontSize: "10px", color: colors.textSec }}>From Animal class</div>
        </motion.div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 2 ? 1 : 0 }} style={{ padding: "14px 20px", borderRadius: "12px", background: `${colors.success}15`, border: `2px solid ${colors.success}`, textAlign: "center" }}>
          <div style={{ fontFamily: "monospace", color: colors.success }}>myDog.bark()</div>
          <div style={{ fontSize: "1.2rem", margin: "0.3rem 0" }}>🐕</div>
          <div style={{ fontSize: "10px", color: colors.textSec }}>From Dog class</div>
        </motion.div>
      </div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 2 ? 1 : 0 }} style={{ marginTop: "1rem", padding: "10px 20px", borderRadius: "100px", background: `${colors.accent}15`, textAlign: "center" }}>
        <span style={{ color: colors.accent, fontSize: "11px" }}>Dog doesn't define eat(), but can still call it! 🎉</span>
      </motion.div>
    </div>
  );
};

// ============================================
// SCENE 8: IS-A Test
// ============================================
const Scene8 = () => {
  const [phase, setPhase] = useState(0);
  useEffect(() => { const t = [setTimeout(() => setPhase(1), 500), setTimeout(() => setPhase(2), 1000), setTimeout(() => setPhase(3), 1500)]; return () => t.forEach(clearTimeout); }, []);
  const tests = [
    { text: "Dog IS-A Animal", valid: true },
    { text: "Car IS-A Vehicle", valid: true },
    { text: "Engine IS-A Vehicle", valid: false },
  ];
  return (
    <div style={containerStyle}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: colors.accent, fontWeight: 700, fontSize: "13px", letterSpacing: "1.5px", marginBottom: "1.5rem" }}>✅ THE IS-A TEST</motion.div>
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem", maxWidth: "350px", margin: "0 auto" }}>
        {tests.map((t, i) => (
          <motion.div key={i} initial={{ opacity: 0, x: -30 }} animate={{ opacity: phase > i ? 1 : 0, x: 0 }} style={{ padding: "14px 20px", borderRadius: "12px", background: t.valid ? `${colors.success}15` : `${colors.danger}15`, border: `2px solid ${t.valid ? colors.success : colors.danger}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ color: t.valid ? colors.success : colors.danger, fontWeight: 600, fontSize: "13px" }}>{t.text}</span>
            <motion.span initial={{ scale: 0 }} animate={{ scale: phase > i ? 1 : 0, rotate: t.valid ? 0 : [0, 10, -10, 0] }} transition={t.valid ? {} : { duration: 0.3 }} style={{ fontSize: "1.3rem" }}>{t.valid ? "✅" : "❌"}</motion.span>
          </motion.div>
        ))}
      </div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 3 ? 1 : 0 }} style={{ marginTop: "1.5rem", padding: "10px 20px", borderRadius: "100px", background: `${colors.accent}15`, textAlign: "center" }}>
        <span style={{ color: colors.accent, fontSize: "11px" }}>If IS-A fails, use composition (HAS-A) instead!</span>
      </motion.div>
    </div>
  );
};

// ============================================
// SCENE 9: Access Specifiers - House Analogy
// ============================================
const Scene9 = () => {
  const [phase, setPhase] = useState(0);
  useEffect(() => { const t = [setTimeout(() => setPhase(1), 600), setTimeout(() => setPhase(2), 1200), setTimeout(() => setPhase(3), 1800)]; return () => t.forEach(clearTimeout); }, []);
  const rooms = [
    { name: "public", icon: "🚪", desc: "Open to all", color: colors.success, access: true },
    { name: "protected", icon: "🔑", desc: "Family only (derived)", color: colors.warning, access: true },
    { name: "private", icon: "🔒", desc: "Locked forever", color: colors.danger, access: false },
  ];
  return (
    <div style={containerStyle}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: colors.primary, fontWeight: 700, fontSize: "13px", letterSpacing: "1.5px", marginBottom: "1rem" }}>🏠 ACCESS SPECIFIERS (HOUSE ANALOGY)</motion.div>
      <div style={{ display: "flex", gap: "1.5rem", justifyContent: "center", marginBottom: "1.5rem" }}>
        {rooms.map((r, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 30 }} animate={{ opacity: phase > i ? 1 : 0, y: 0 }} style={{ padding: "16px 20px", borderRadius: "16px", background: `${r.color}15`, border: `2px solid ${r.color}`, textAlign: "center", width: "130px" }}>
            <div style={{ fontSize: "2rem", marginBottom: "0.3rem" }}>{r.icon}</div>
            <div style={{ color: r.color, fontWeight: 700, fontSize: "12px", fontFamily: "monospace" }}>{r.name}</div>
            <div style={{ color: colors.textSec, fontSize: "10px", marginTop: "0.3rem" }}>{r.desc}</div>
            <div style={{ marginTop: "0.5rem", fontSize: "11px" }}>
              <span style={{ color: r.access ? colors.success : colors.danger }}>Derived: {r.access ? "✅" : "❌"}</span>
            </div>
          </motion.div>
        ))}
      </div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 3 ? 1 : 0 }} style={{ padding: "10px 20px", borderRadius: "12px", background: `${colors.primary}15`, textAlign: "center" }}>
        <span style={{ color: colors.primary, fontSize: "11px" }}>🐕 Dog can enter public & protected rooms, but NOT private!</span>
      </motion.div>
    </div>
  );
};

// ============================================
// SCENE 10: Modes of Inheritance
// ============================================
const Scene10 = () => {
  const [phase, setPhase] = useState(0);
  useEffect(() => { const t = [setTimeout(() => setPhase(1), 800)]; return () => t.forEach(clearTimeout); }, []);
  return (
    <div style={containerStyle}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: colors.warning, fontWeight: 700, fontSize: "13px", letterSpacing: "1.5px", marginBottom: "1.5rem" }}>📊 MODES OF INHERITANCE</motion.div>
      <div style={{ background: `${colors.text}05`, borderRadius: "12px", overflow: "hidden", maxWidth: "500px", margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1px", background: `${colors.text}20` }}>
          <div style={{ background: `${colors.accent}20`, padding: "10px", fontWeight: 600, fontSize: "11px", color: colors.accent }}>Mode</div>
          <div style={{ background: `${colors.success}20`, padding: "10px", fontSize: "11px", textAlign: "center", color: colors.success }}>public →</div>
          <div style={{ background: `${colors.warning}20`, padding: "10px", fontSize: "11px", textAlign: "center", color: colors.warning }}>protected →</div>
          {[
            { mode: "public", pub: "public", prot: "protected" },
            { mode: "protected", pub: "protected", prot: "protected" },
            { mode: "private", pub: "private", prot: "private" },
          ].map((row, i) => (
            <React.Fragment key={i}>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 1 ? 1 : 0 }} transition={{ delay: i * 0.2 }} style={{ background: "rgba(28, 28, 30, 0.8)", padding: "10px", fontWeight: 600, fontSize: "11px", color: i === 0 ? colors.success : colors.textSec, fontFamily: "monospace" }}>{row.mode}</motion.div>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 1 ? 1 : 0 }} transition={{ delay: i * 0.2 }} style={{ background: "rgba(28, 28, 30, 0.8)", padding: "10px", fontSize: "10px", textAlign: "center", color: colors.textSec, fontFamily: "monospace" }}>{row.pub}</motion.div>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 1 ? 1 : 0 }} transition={{ delay: i * 0.2 }} style={{ background: "rgba(28, 28, 30, 0.8)", padding: "10px", fontSize: "10px", textAlign: "center", color: colors.textSec, fontFamily: "monospace" }}>{row.prot}</motion.div>
            </React.Fragment>
          ))}
        </div>
      </div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 1 ? 1 : 0 }} style={{ marginTop: "1rem", padding: "8px 16px", borderRadius: "100px", background: `${colors.success}15`, textAlign: "center" }}>
        <span style={{ color: colors.success, fontSize: "11px" }}>💡 public inheritance is most common (90%+ of cases)</span>
      </motion.div>
    </div>
  );
};

// ============================================
// SCENE 11: Types of Inheritance
// ============================================
const Scene11 = () => {
  const [phase, setPhase] = useState(0);
  useEffect(() => { const t = [setTimeout(() => setPhase(1), 400), setTimeout(() => setPhase(2), 800), setTimeout(() => setPhase(3), 1200), setTimeout(() => setPhase(4), 1600), setTimeout(() => setPhase(5), 2000)]; return () => t.forEach(clearTimeout); }, []);
  const types = [
    { name: "Single", icon: "➡️", desc: "A → B", color: colors.primary },
    { name: "Multilevel", icon: "⬇️", desc: "A → B → C", color: colors.success },
    { name: "Hierarchical", icon: "🌳", desc: "A → B, A → C", color: colors.accent },
    { name: "Multiple", icon: "⚡", desc: "A, B → C", color: colors.warning },
    { name: "Hybrid", icon: "💎", desc: "Combination", color: colors.virtualColor },
  ];
  return (
    <div style={containerStyle}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: colors.accent, fontWeight: 700, fontSize: "13px", letterSpacing: "1.5px", marginBottom: "1.5rem" }}>🌳 TYPES OF INHERITANCE</motion.div>
      <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
        {types.map((t, i) => (
          <motion.div key={i} initial={{ opacity: 0, scale: 0 }} animate={{ opacity: phase > i ? 1 : 0, scale: 1 }} style={{ padding: "14px 18px", borderRadius: "12px", background: `${t.color}15`, border: `2px solid ${t.color}`, textAlign: "center", minWidth: "100px" }}>
            <div style={{ fontSize: "1.5rem", marginBottom: "0.3rem" }}>{t.icon}</div>
            <div style={{ color: t.color, fontWeight: 700, fontSize: "11px" }}>{t.name}</div>
            <div style={{ fontFamily: "monospace", fontSize: "9px", color: colors.textSec, marginTop: "0.2rem" }}>{t.desc}</div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// ============================================
// SCENE 12: Diamond Problem & Philosophy
// ============================================
const Scene12 = () => {
  const [phase, setPhase] = useState(0);
  useEffect(() => { const t = [setTimeout(() => setPhase(1), 800), setTimeout(() => setPhase(2), 1600)]; return () => t.forEach(clearTimeout); }, []);
  const code = `class Amphibious : 
    public LandVehicle,
    public WaterVehicle {};
// ⚠️ Which start() to use?`;
  return (
    <div style={containerStyle}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: colors.danger, fontWeight: 700, fontSize: "13px", letterSpacing: "1.5px", marginBottom: "1rem" }}>💎 DIAMOND PROBLEM & PHILOSOPHY</motion.div>
      <div style={{ display: "flex", gap: "2rem", alignItems: "flex-start", marginBottom: "1.5rem" }}>
        <div>
          <div style={{ color: colors.warning, fontSize: "10px", fontWeight: 600, marginBottom: "0.3rem" }}>Multiple Inheritance:</div>
          <GlassCard glow={colors.danger} style={{ maxWidth: "280px" }}><CodeBlock code={code} fontSize="9px" /></GlassCard>
        </div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 1 ? 1 : 0 }} style={{ padding: "14px 20px", borderRadius: "12px", background: `${colors.danger}20`, border: `2px solid ${colors.danger}`, textAlign: "center" }}>
          <div style={{ color: colors.danger, fontWeight: 600, fontSize: "12px" }}>⚠️ Ambiguity Error!</div>
          <div style={{ color: colors.textSec, fontSize: "10px", marginTop: "0.3rem" }}>Two start() functions collide</div>
        </motion.div>
      </div>
      <AnimatePresence>{phase >= 2 && <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ padding: "16px 28px", borderRadius: "16px", background: `linear-gradient(135deg, ${colors.accent}20, ${colors.primary}10)`, border: `1px solid ${colors.accent}40`, textAlign: "center" }}>
        <div style={{ color: colors.accent, fontWeight: 700, fontSize: "13px", marginBottom: "0.5rem" }}>"Inheritance is not about saving code."</div>
        <div style={{ color: colors.text, fontSize: "12px" }}>"It's about <span style={{ color: colors.success, fontWeight: 700 }}>designing systems.</span>"</div>
      </motion.div>}</AnimatePresence>
    </div>
  );
};

// Export all scenes
export const InheritanceScenes = [
  { title: "Opening Hook", component: Scene1, contentText: "Why not copy-paste? Car and Bus have same functions. Seems easy..." },
  { title: "Maintenance Nightmare", component: Scene2, contentText: "10 classes with same code. Bug in startEngine() = 10 places to fix! Nightmare!" },
  { title: "Three Core Problems", component: Scene3, contentText: "1) Code Duplication 2) No Structure 3) Hard to Extend. All bad!" },
  { title: "Birth of Base Class", component: Scene4, contentText: "Vehicle has common code. Car, Bus, Truck inherit from it. Reusability!" },
  { title: "Animal Base Class", component: Scene5, contentText: "class Animal { void eat() }. Base class with common behavior." },
  { title: "Dog Inherits Animal", component: Scene6, contentText: "class Dog : public Animal. Colon = inheritance, public = mode, Animal = base." },
  { title: "Inherited Functions", component: Scene7, contentText: "Dog can call eat() even though it's not defined in Dog! Magic!" },
  { title: "IS-A Test", component: Scene8, contentText: "Dog IS-A Animal ✓. Engine IS-A Vehicle ✗. Use composition for HAS-A." },
  { title: "Access Specifiers", component: Scene9, contentText: "public = open, protected = family only, private = locked. Derived can access public & protected." },
  { title: "Modes of Inheritance", component: Scene10, contentText: "public (most common), protected, private modes. Changes how members are inherited." },
  { title: "Types of Inheritance", component: Scene11, contentText: "Single, Multilevel, Hierarchical, Multiple, Hybrid. Tree structures!" },
  { title: "Diamond Problem", component: Scene12, contentText: "Multiple inheritance can cause ambiguity. Inheritance is about designing systems, not saving code!" },
];
