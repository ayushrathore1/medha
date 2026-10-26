/**
 * OopFeaturesLecture.jsx - All 10 Scenes
 * Features of OOP - From Chaos to a City
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

// ============================================
// SCENE 1: From Chaos to a City
// ============================================
const Scene1 = () => {
  const [phase, setPhase] = useState(0);
  useEffect(() => { const t = [setTimeout(() => setPhase(1), 800), setTimeout(() => setPhase(2), 1600)]; return () => t.forEach(clearTimeout); }, []);
  return (
    <div style={{ ...containerStyle, background: "linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 50%, #0a0a0f 100%)" }}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: "center", marginBottom: "1.5rem" }}>
        <div style={{ color: colors.accent, fontWeight: 700, fontSize: "12px", letterSpacing: "3px", marginBottom: "0.5rem" }}>CHAPTER 1</div>
        <div style={{ fontSize: "1.5rem", fontWeight: 700, color: colors.text }}>From Chaos to a City</div>
      </motion.div>
      {/* Chaotic lines animation */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: "1.5rem", height: "100px", position: "relative", overflow: "hidden" }}>
        {Array(12).fill(0).map((_, i) => (
          <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: phase >= 1 ? 0.6 : 0, x: Math.sin(i) * 20, y: Math.cos(i) * 15, rotate: i * 30 }} style={{ position: "absolute", width: "80px", height: "2px", background: `linear-gradient(90deg, ${colors.danger}, transparent)`, top: "50%", left: "50%", transformOrigin: "left center" }} />
        ))}
      </div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 1 ? 1 : 0 }} style={{ textAlign: "center", marginBottom: "1rem" }}>
        <div style={{ color: colors.textSec, fontSize: "12px" }}>"This is how large software used to look."</div>
      </motion.div>
      <AnimatePresence>{phase >= 2 && <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} style={{ padding: "16px 32px", borderRadius: "16px", background: `${colors.danger}20`, border: `2px solid ${colors.danger}`, textAlign: "center" }}>
        <div style={{ color: colors.danger, fontWeight: 700, fontSize: "1.3rem" }}>SPAGHETTI CODE 🍝</div>
        <div style={{ color: colors.textSec, fontSize: "11px", marginTop: "0.3rem" }}>Procedural Programming</div>
      </motion.div>}</AnimatePresence>
    </div>
  );
};

// ============================================
// SCENE 2: The Need for Order
// ============================================
const Scene2 = () => {
  const [phase, setPhase] = useState(0);
  useEffect(() => { const t = [setTimeout(() => setPhase(1), 800), setTimeout(() => setPhase(2), 1600)]; return () => t.forEach(clearTimeout); }, []);
  return (
    <div style={containerStyle}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: "center", marginBottom: "1.5rem" }}>
        <div style={{ color: colors.accent, fontWeight: 700, fontSize: "12px", letterSpacing: "3px", marginBottom: "0.5rem" }}>CHAPTER 2</div>
        <div style={{ fontSize: "1.5rem", fontWeight: 700, color: colors.text }}>The Need for Order</div>
      </motion.div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 1 ? 1 : 0 }} style={{ display: "flex", gap: "1rem", justifyContent: "center", marginBottom: "1.5rem" }}>
        {["🏗️", "🏢", "🏛️", "🏰"].map((b, i) => (
          <motion.div key={i} initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: i * 0.2 }} style={{ padding: "20px", borderRadius: "12px", background: `${colors.primary}15`, border: `1px solid ${colors.primary}`, fontSize: "2rem" }}>{b}</motion.div>
        ))}
      </motion.div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 1 ? 1 : 0 }} style={{ textAlign: "center", marginBottom: "1rem" }}>
        <div style={{ color: colors.textSec, fontSize: "12px" }}>"As software grew, chaos became impossible to manage."</div>
        <div style={{ color: colors.accent, fontSize: "12px", marginTop: "0.3rem" }}>"We needed structure. Safety. Cities instead of jungles."</div>
      </motion.div>
      <AnimatePresence>{phase >= 2 && <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} style={{ padding: "16px 32px", borderRadius: "16px", background: `${colors.virtualColor}20`, border: `2px solid ${colors.virtualColor}`, textAlign: "center" }}>
        <div style={{ color: colors.virtualColor, fontWeight: 700, fontSize: "1.2rem" }}>Object Oriented Programming</div>
        <div style={{ color: colors.textSec, fontSize: "11px", marginTop: "0.3rem" }}>Not syntax. <span style={{ fontWeight: 700, color: colors.accent }}>Thinking.</span></div>
      </motion.div>}</AnimatePresence>
    </div>
  );
};

// ============================================
// SCENE 3: What Is an Object?
// ============================================
const Scene3 = () => {
  const [phase, setPhase] = useState(0);
  useEffect(() => { const t = [setTimeout(() => setPhase(1), 800)]; return () => t.forEach(clearTimeout); }, []);
  return (
    <div style={containerStyle}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: "center", marginBottom: "1.5rem" }}>
        <div style={{ color: colors.accent, fontWeight: 700, fontSize: "12px", letterSpacing: "3px", marginBottom: "0.5rem" }}>CHAPTER 3</div>
        <div style={{ fontSize: "1.5rem", fontWeight: 700, color: colors.text }}>What Is an Object?</div>
      </motion.div>
      <div style={{ display: "flex", gap: "2rem", justifyContent: "center", marginBottom: "1.5rem" }}>
        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} style={{ padding: "20px", borderRadius: "16px", background: `${colors.primary}20`, border: `2px solid ${colors.primary}`, textAlign: "center" }}>
          <div style={{ fontSize: "1.5rem", marginBottom: "0.3rem" }}>📦</div>
          <div style={{ color: colors.primary, fontWeight: 700, fontSize: "12px" }}>DATA (State)</div>
          <div style={{ color: colors.textSec, fontSize: "10px", marginTop: "0.3rem" }}>name, roll, grades</div>
        </motion.div>
        <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: phase >= 1 ? 1 : 0, x: 0 }} style={{ padding: "20px", borderRadius: "16px", background: `${colors.success}20`, border: `2px solid ${colors.success}`, textAlign: "center" }}>
          <div style={{ fontSize: "1.5rem", marginBottom: "0.3rem" }}>⚙️</div>
          <div style={{ color: colors.success, fontWeight: 700, fontSize: "12px" }}>BEHAVIOR (Methods)</div>
          <div style={{ color: colors.textSec, fontSize: "10px", marginTop: "0.3rem" }}>calculate(), attend()</div>
        </motion.div>
      </div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 1 ? 1 : 0 }} style={{ padding: "14px 28px", borderRadius: "16px", background: `${colors.accent}20`, border: `2px solid ${colors.accent}`, textAlign: "center" }}>
        <span style={{ color: colors.accent, fontWeight: 700, fontSize: "14px" }}>Data + Methods = Object</span>
      </motion.div>
    </div>
  );
};

// ============================================
// SCENE 4: Encapsulation - The Capsule
// ============================================
const Scene4 = () => {
  const [phase, setPhase] = useState(0);
  useEffect(() => { const t = [setTimeout(() => setPhase(1), 800)]; return () => t.forEach(clearTimeout); }, []);
  return (
    <div style={containerStyle}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: "center", marginBottom: "1.5rem" }}>
        <div style={{ color: colors.accent, fontWeight: 700, fontSize: "12px", letterSpacing: "3px", marginBottom: "0.5rem" }}>CHAPTER 4</div>
        <div style={{ fontSize: "1.5rem", fontWeight: 700, color: colors.virtualColor }}>Encapsulation 💊</div>
        <div style={{ color: colors.textSec, fontSize: "12px" }}>The Capsule</div>
      </motion.div>
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} style={{ display: "flex", justifyContent: "center", marginBottom: "1.5rem" }}>
        <div style={{ position: "relative", padding: "30px 40px", borderRadius: "100px", background: `linear-gradient(135deg, ${colors.virtualColor}20, ${colors.primary}10)`, border: `3px solid ${colors.virtualColor}`, boxShadow: `0 0 40px ${colors.virtualColor}30` }}>
          <div style={{ display: "flex", gap: "1rem" }}>
            <div style={{ padding: "12px", borderRadius: "8px", background: `${colors.primary}30`, fontSize: "10px", color: colors.primary }}>📦 data</div>
            <div style={{ padding: "12px", borderRadius: "8px", background: `${colors.success}30`, fontSize: "10px", color: colors.success }}>⚙️ methods</div>
          </div>
          <motion.div animate={{ scale: [1, 1.02, 1] }} transition={{ duration: 2, repeat: Infinity }} style={{ position: "absolute", inset: -5, borderRadius: "100px", border: `2px dashed ${colors.virtualColor}40` }} />
        </div>
      </motion.div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 1 ? 1 : 0 }} style={{ textAlign: "center" }}>
        <div style={{ color: colors.text, fontSize: "13px" }}>"Like medicine inside a capsule."</div>
        <div style={{ color: colors.textSec, fontSize: "11px", marginTop: "0.3rem" }}>Internal parts organized. Only buttons accessible outside.</div>
      </motion.div>
    </div>
  );
};

// ============================================
// SCENE 5: Data Hiding - The ATM Vault
// ============================================
const Scene5 = () => {
  const [phase, setPhase] = useState(0);
  useEffect(() => { const t = [setTimeout(() => setPhase(1), 800)]; return () => t.forEach(clearTimeout); }, []);
  return (
    <div style={containerStyle}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: "center", marginBottom: "1.5rem" }}>
        <div style={{ color: colors.accent, fontWeight: 700, fontSize: "12px", letterSpacing: "3px", marginBottom: "0.5rem" }}>CHAPTER 5</div>
        <div style={{ fontSize: "1.5rem", fontWeight: 700, color: colors.danger }}>Data Hiding 🔒</div>
        <div style={{ color: colors.textSec, fontSize: "12px" }}>The ATM Vault</div>
      </motion.div>
      <div style={{ display: "flex", gap: "2rem", alignItems: "center", justifyContent: "center", marginBottom: "1.5rem" }}>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ padding: "20px", borderRadius: "12px", background: `${colors.danger}15`, border: `3px solid ${colors.danger}`, textAlign: "center" }}>
          <div style={{ fontSize: "2rem", marginBottom: "0.3rem" }}>🏦</div>
          <div style={{ color: colors.danger, fontSize: "10px" }}>💰 DATA (private)</div>
          <div style={{ marginTop: "0.5rem", padding: "4px 8px", borderRadius: "4px", background: `${colors.danger}30`, fontSize: "9px", color: colors.danger }}>🛡️ Force Field</div>
        </motion.div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 1 ? 1 : 0 }} style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <div style={{ padding: "8px 16px", borderRadius: "8px", background: `${colors.danger}15`, fontSize: "10px", color: colors.danger }}>❌ Direct access blocked</div>
          <div style={{ padding: "8px 16px", borderRadius: "8px", background: `${colors.success}15`, fontSize: "10px", color: colors.success }}>✓ withdraw() → Logic runs</div>
        </motion.div>
      </div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 1 ? 1 : 0 }} style={{ padding: "10px 24px", borderRadius: "100px", background: `${colors.accent}15`, textAlign: "center" }}>
        <span style={{ color: colors.accent, fontSize: "11px" }}>"You don't touch data. You request services."</span>
      </motion.div>
    </div>
  );
};

// ============================================
// SCENE 6: Abstraction - The Simple Interface
// ============================================
const Scene6 = () => {
  const [phase, setPhase] = useState(0);
  useEffect(() => { const t = [setTimeout(() => setPhase(1), 800)]; return () => t.forEach(clearTimeout); }, []);
  return (
    <div style={containerStyle}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: "center", marginBottom: "1.5rem" }}>
        <div style={{ color: colors.accent, fontWeight: 700, fontSize: "12px", letterSpacing: "3px", marginBottom: "0.5rem" }}>CHAPTER 6</div>
        <div style={{ fontSize: "1.5rem", fontWeight: 700, color: colors.success }}>Abstraction 🎭</div>
        <div style={{ color: colors.textSec, fontSize: "12px" }}>The Simple Interface</div>
      </motion.div>
      <div style={{ display: "flex", gap: "1.5rem", alignItems: "center", justifyContent: "center", marginBottom: "1.5rem" }}>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ padding: "20px", borderRadius: "12px", background: `${colors.success}20`, border: `2px solid ${colors.success}`, textAlign: "center" }}>
          <div style={{ fontSize: "1.5rem", marginBottom: "0.3rem" }}>🖥️</div>
          <div style={{ color: colors.success, fontWeight: 600, fontSize: "11px" }}>Simple UI</div>
          <div style={{ color: colors.textSec, fontSize: "9px" }}>WHAT it does</div>
        </motion.div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 1 ? 1 : 0 }} style={{ padding: "20px", borderRadius: "12px", background: `${colors.text}10`, border: `2px dashed ${colors.text}30`, textAlign: "center", filter: "blur(2px)" }}>
          <div style={{ fontSize: "1.5rem", marginBottom: "0.3rem" }}>⚙️🔧🔩</div>
          <div style={{ color: colors.textSec, fontWeight: 600, fontSize: "11px" }}>Complex Logic</div>
          <div style={{ color: colors.textSec, fontSize: "9px" }}>HOW it works</div>
        </motion.div>
      </div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 1 ? 1 : 0 }} style={{ display: "flex", gap: "0.8rem", justifyContent: "center" }}>
        {["🚗 Car pedals", "📺 TV remote", "⬆️ Upload btn"].map((e, i) => (
          <div key={i} style={{ padding: "6px 12px", borderRadius: "100px", background: `${colors.success}15`, fontSize: "10px", color: colors.success }}>{e}</div>
        ))}
      </motion.div>
    </div>
  );
};

// ============================================
// SCENE 7: Inheritance - Blueprints That Evolve
// ============================================
const Scene7 = () => {
  const [phase, setPhase] = useState(0);
  useEffect(() => { const t = [setTimeout(() => setPhase(1), 800)]; return () => t.forEach(clearTimeout); }, []);
  return (
    <div style={containerStyle}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: "center", marginBottom: "1.5rem" }}>
        <div style={{ color: colors.accent, fontWeight: 700, fontSize: "12px", letterSpacing: "3px", marginBottom: "0.5rem" }}>CHAPTER 7</div>
        <div style={{ fontSize: "1.5rem", fontWeight: 700, color: colors.primary }}>Inheritance 🧬</div>
        <div style={{ color: colors.textSec, fontSize: "12px" }}>Blueprints That Evolve</div>
      </motion.div>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.8rem", marginBottom: "1.5rem" }}>
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} style={{ padding: "14px 28px", borderRadius: "12px", background: `${colors.primary}20`, border: `2px solid ${colors.primary}` }}>
          <span style={{ color: colors.primary, fontWeight: 700, fontSize: "12px" }}>📋 Vehicle</span>
        </motion.div>
        <div style={{ width: "2px", height: "20px", background: colors.textSec }} />
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 1 ? 1 : 0 }} style={{ display: "flex", gap: "1rem" }}>
          {["🚗 Car", "🏍️ Bike", "🚚 Truck"].map((v, i) => (
            <motion.div key={i} initial={{ y: 20 }} animate={{ y: 0 }} transition={{ delay: i * 0.15 }} style={{ padding: "10px 16px", borderRadius: "10px", background: `${colors.success}15`, border: `1px solid ${colors.success}`, fontSize: "11px", color: colors.success }}>{v}</motion.div>
          ))}
        </motion.div>
      </div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 1 ? 1 : 0 }} style={{ textAlign: "center" }}>
        <div style={{ color: colors.accent, fontSize: "12px" }}>"Reuse. Extend. Evolve."</div>
        <div style={{ color: colors.warning, fontSize: "10px", marginTop: "0.3rem" }}>⚠️ Powerful. But handle with care.</div>
      </motion.div>
    </div>
  );
};

// ============================================
// SCENE 8: Polymorphism - One Command, Many Behaviors
// ============================================
const Scene8 = () => {
  const [phase, setPhase] = useState(0);
  useEffect(() => { const t = [setTimeout(() => setPhase(1), 800)]; return () => t.forEach(clearTimeout); }, []);
  const objects = [
    { icon: "🚗", name: "Car", action: "starts engine" },
    { icon: "🧺", name: "Washing Machine", action: "starts cycle" },
    { icon: "🤖", name: "Robot", action: "boots up" },
    { icon: "🎮", name: "Game Character", action: "runs" },
  ];
  return (
    <div style={containerStyle}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: "center", marginBottom: "1rem" }}>
        <div style={{ color: colors.accent, fontWeight: 700, fontSize: "12px", letterSpacing: "3px", marginBottom: "0.5rem" }}>CHAPTER 8</div>
        <div style={{ fontSize: "1.5rem", fontWeight: 700, color: colors.warning }}>Polymorphism 🎭</div>
        <div style={{ color: colors.textSec, fontSize: "12px" }}>One Command, Many Behaviors</div>
      </motion.div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ padding: "10px 24px", borderRadius: "100px", background: `${colors.accent}20`, border: `2px solid ${colors.accent}`, textAlign: "center", marginBottom: "1rem" }}>
        <span style={{ color: colors.accent, fontWeight: 700, fontSize: "14px" }}>START()</span>
      </motion.div>
      <div style={{ display: "flex", gap: "0.8rem", justifyContent: "center", marginBottom: "1rem" }}>
        {objects.map((o, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: phase >= 1 ? 1 : 0, y: 0 }} transition={{ delay: i * 0.1 }} style={{ padding: "10px 14px", borderRadius: "10px", background: `${colors.warning}15`, border: `1px solid ${colors.warning}`, textAlign: "center" }}>
            <div style={{ fontSize: "1.3rem" }}>{o.icon}</div>
            <div style={{ fontSize: "9px", color: colors.textSec }}>{o.action}</div>
          </motion.div>
        ))}
      </div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 1 ? 1 : 0 }} style={{ textAlign: "center" }}>
        <div style={{ color: colors.warning, fontSize: "12px" }}>"One interface. Many forms."</div>
        <div style={{ color: colors.textSec, fontSize: "10px" }}>No if-else. No type checks. Just behavior.</div>
      </motion.div>
    </div>
  );
};

// ============================================
// SCENE 9: The Four Pillars Become a City
// ============================================
const Scene9 = () => {
  const [phase, setPhase] = useState(0);
  useEffect(() => { const t = [setTimeout(() => setPhase(1), 800)]; return () => t.forEach(clearTimeout); }, []);
  const pillars = [
    { icon: "💊", name: "Encapsulation", label: "Capsules" },
    { icon: "🔒", name: "Data Hiding", label: "Secure" },
    { icon: "🎭", name: "Abstraction", label: "Clean entrances" },
    { icon: "🧬", name: "Inheritance", label: "Shared blueprints" },
    { icon: "🎭", name: "Polymorphism", label: "Generic commands" },
  ];
  return (
    <div style={containerStyle}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: "center", marginBottom: "1.5rem" }}>
        <div style={{ color: colors.accent, fontWeight: 700, fontSize: "12px", letterSpacing: "3px", marginBottom: "0.5rem" }}>CHAPTER 9</div>
        <div style={{ fontSize: "1.5rem", fontWeight: 700, color: colors.text }}>The Four Pillars Become a City 🏙️</div>
      </motion.div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.8rem", justifyContent: "center", marginBottom: "1.5rem" }}>
        {pillars.map((p, i) => (
          <motion.div key={i} initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }} style={{ padding: "12px 16px", borderRadius: "12px", background: `${colors.virtualColor}15`, border: `1px solid ${colors.virtualColor}`, textAlign: "center", minWidth: "90px" }}>
            <div style={{ fontSize: "1.3rem" }}>{p.icon}</div>
            <div style={{ color: colors.virtualColor, fontWeight: 600, fontSize: "10px" }}>{p.name}</div>
          </motion.div>
        ))}
      </div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 1 ? 1 : 0 }} style={{ display: "flex", gap: "0.8rem", justifyContent: "center" }}>
        {["Secure", "Organized", "Expandable", "Intelligent"].map((l, i) => (
          <div key={i} style={{ padding: "6px 12px", borderRadius: "100px", background: `${colors.success}15`, fontSize: "10px", color: colors.success }}>{l}</div>
        ))}
      </motion.div>
    </div>
  );
};

// ============================================
// SCENE 10: OOP Is Not Code. It's Architecture.
// ============================================
const Scene10 = () => {
  const [phase, setPhase] = useState(0);
  useEffect(() => { const t = [setTimeout(() => setPhase(1), 1000), setTimeout(() => setPhase(2), 2000)]; return () => t.forEach(clearTimeout); }, []);
  return (
    <div style={{ ...containerStyle, background: "linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 50%, #0a0a0f 100%)" }}>
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: "center", marginBottom: "2rem" }}>
        <div style={{ color: colors.textSec, fontSize: "12px" }}>"OOP is not about writing code."</div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 1 ? 1 : 0 }} style={{ color: colors.accent, fontSize: "1.3rem", fontWeight: 700, marginTop: "0.5rem" }}>"It is about designing systems."</motion.div>
      </motion.div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 1 ? 1 : 0 }} style={{ display: "flex", gap: "1.5rem", justifyContent: "center", marginBottom: "2rem" }}>
        {["Objects", "Safety", "Structure"].map((w, i) => (
          <div key={i} style={{ padding: "12px 20px", borderRadius: "100px", background: `${colors.virtualColor}15`, border: `1px solid ${colors.virtualColor}`, color: colors.virtualColor, fontWeight: 600, fontSize: "12px" }}>{w}</div>
        ))}
      </motion.div>
      <AnimatePresence>{phase >= 2 && <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: "center", padding: "14px 28px", borderRadius: "16px", background: `${colors.accent}20`, border: `1px solid ${colors.accent}` }}>
        <div style={{ color: colors.text, fontSize: "12px" }}>"If we can model cars and students…"</div>
        <div style={{ color: colors.accent, fontSize: "12px", marginTop: "0.3rem" }}>"Can we model ideas, rules, and processes too?"</div>
      </motion.div>}</AnimatePresence>
    </div>
  );
};

// Export all scenes
export const OopFeaturesScenes = [
  { title: "From Chaos to a City", component: Scene1, contentText: "Spaghetti code. Procedural programming. Chaos that became impossible to manage." },
  { title: "The Need for Order", component: Scene2, contentText: "We needed structure. Safety. Cities instead of jungles. OOP = Thinking, not just syntax." },
  { title: "What Is an Object?", component: Scene3, contentText: "Every object has: Data (state) and Behavior (methods). Data + Methods = Object." },
  { title: "Encapsulation", component: Scene4, contentText: "Like medicine in a capsule. Internal parts organized. Only buttons accessible outside." },
  { title: "Data Hiding", component: Scene5, contentText: "ATM vault: can't touch data directly. You request services. Withdraw() runs logic." },
  { title: "Abstraction", component: Scene6, contentText: "Show WHAT it does. Hide HOW. Car pedals, TV remote, Upload button = simple interfaces." },
  { title: "Inheritance", component: Scene7, contentText: "Vehicle → Car, Bike, Truck. Shared parts copy. Each adds unique parts. Reuse. Extend. Evolve." },
  { title: "Polymorphism", component: Scene8, contentText: "START() → Car starts engine, Machine starts cycle, Robot boots. One interface, many forms." },
  { title: "Four Pillars City", component: Scene9, contentText: "OOP city: Encapsulation, Abstraction, Inheritance, Polymorphism. Secure, Organized, Intelligent." },
  { title: "OOP Is Architecture", component: Scene10, contentText: "Not about writing code. It's about designing systems. Objects. Safety. Structure." },
];
