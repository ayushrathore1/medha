/**
 * AccessSpecifiersLecture.jsx - All 15 Scenes
 * Access Specifiers, Member Functions & Array of Objects
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
  const keywords = ['int', 'void', 'class', 'public', 'private', 'protected'];
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
// SCENE 1: The Game World Is Born
// ============================================
const Scene1 = () => {
  const [phase, setPhase] = useState(0);
  useEffect(() => { const t = [setTimeout(() => setPhase(1), 800)]; return () => t.forEach(clearTimeout); }, []);
  return (
    <div style={{ ...containerStyle, background: "linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 50%, #0a0a0f 100%)" }}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: "center", marginBottom: "1.5rem" }}>
        <div style={{ color: colors.accent, fontWeight: 700, fontSize: "12px", letterSpacing: "3px", marginBottom: "0.5rem" }}>CHAPTER 1</div>
        <div style={{ fontSize: "1.5rem", fontWeight: 700, color: colors.text }}>The Game World Is Born 🎮</div>
      </motion.div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: "center", marginBottom: "1.5rem" }}>
        <div style={{ color: colors.textSec, fontSize: "12px", marginBottom: "1rem" }}>"Every real game is a system."</div>
        <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
          {[{ icon: "🗡️", name: "Sword" }, { icon: "🛡️", name: "Shield" }, { icon: "🧪", name: "Potion" }].map((item, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: phase >= 1 ? 1 : 0, y: 0 }} transition={{ delay: i * 0.15 }} style={{ padding: "16px 20px", borderRadius: "12px", background: `${colors.primary}15`, border: `1px solid ${colors.primary}`, textAlign: "center" }}>
              <div style={{ fontSize: "1.5rem", marginBottom: "0.3rem" }}>{item.icon}</div>
              <div style={{ color: colors.primary, fontSize: "10px", fontWeight: 600 }}>{item.name}</div>
            </motion.div>
          ))}
        </div>
      </motion.div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 1 ? 1 : 0 }} style={{ textAlign: "center" }}>
        <span style={{ color: colors.textSec, fontSize: "11px" }}>Hovering, waiting to be created...</span>
      </motion.div>
    </div>
  );
};

// ============================================
// SCENE 2: The First Naive Implementation
// ============================================
const Scene2 = () => {
  const [phase, setPhase] = useState(0);
  useEffect(() => { const t = [setTimeout(() => setPhase(1), 800)]; return () => t.forEach(clearTimeout); }, []);
  return (
    <div style={containerStyle}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: "center", marginBottom: "1.5rem" }}>
        <div style={{ color: colors.accent, fontWeight: 700, fontSize: "12px", letterSpacing: "3px", marginBottom: "0.5rem" }}>CHAPTER 2</div>
        <div style={{ fontSize: "1.5rem", fontWeight: 700, color: colors.danger }}>The First Naive Implementation</div>
      </motion.div>
      <div style={{ display: "flex", gap: "2rem", alignItems: "center", justifyContent: "center", marginBottom: "1.5rem" }}>
        <GlassCard style={{ maxWidth: "200px" }}><CodeBlock code={`swordDurability = 100;`} fontSize="10px" /></GlassCard>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 1 ? 1 : 0 }}>
          <GlassCard glow={colors.danger} style={{ maxWidth: "220px" }}><CodeBlock code={`swordDurability = -500;`} fontSize="10px" /></GlassCard>
        </motion.div>
      </div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 1 ? 1 : 0 }} style={{ textAlign: "center" }}>
        <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 0.5, repeat: 3 }} style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>💥</motion.div>
        <div style={{ color: colors.danger, fontSize: "12px" }}>"Anyone can change anything."</div>
        <div style={{ color: colors.textSec, fontSize: "11px", marginTop: "0.3rem" }}>"This is how systems break."</div>
      </motion.div>
    </div>
  );
};

// ============================================
// SCENE 3: The Safety Wall - Access Specifiers
// ============================================
const Scene3 = () => {
  const [phase, setPhase] = useState(0);
  useEffect(() => { const t = [setTimeout(() => setPhase(1), 800), setTimeout(() => setPhase(2), 1600)]; return () => t.forEach(clearTimeout); }, []);
  return (
    <div style={containerStyle}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: "center", marginBottom: "1.5rem" }}>
        <div style={{ color: colors.accent, fontWeight: 700, fontSize: "12px", letterSpacing: "3px", marginBottom: "0.5rem" }}>CHAPTER 3</div>
        <div style={{ fontSize: "1.5rem", fontWeight: 700, color: colors.success }}>The Safety Wall 🛡️</div>
        <div style={{ color: colors.textSec, fontSize: "12px" }}>Access Specifiers</div>
      </motion.div>
      <div style={{ display: "flex", gap: "1.5rem", alignItems: "center", justifyContent: "center", marginBottom: "1.5rem" }}>
        <div style={{ padding: "20px", borderRadius: "16px", background: `${colors.danger}15`, border: `3px solid ${colors.danger}`, textAlign: "center" }}>
          <div style={{ color: colors.danger, fontWeight: 700, fontSize: "11px", marginBottom: "0.5rem" }}>private 🔒</div>
          <div style={{ padding: "10px 20px", borderRadius: "8px", background: `${colors.text}10` }}>
            <span style={{ fontSize: "10px", color: colors.textSec }}>durability</span>
          </div>
        </div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 1 ? 1 : 0 }} style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <div style={{ padding: "8px 14px", borderRadius: "100px", background: `${colors.success}20`, border: `1px solid ${colors.success}`, fontSize: "10px", color: colors.success }}>setDurability()</div>
          <div style={{ padding: "8px 14px", borderRadius: "100px", background: `${colors.success}20`, border: `1px solid ${colors.success}`, fontSize: "10px", color: colors.success }}>getDurability()</div>
          <div style={{ color: colors.success, fontWeight: 700, fontSize: "10px", textAlign: "center" }}>public</div>
        </motion.div>
      </div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 2 ? 1 : 0 }} style={{ textAlign: "center" }}>
        <div style={{ color: colors.text, fontSize: "11px" }}>"Data is not touched. Data is <span style={{ color: colors.success, fontWeight: 700 }}>requested</span>."</div>
      </motion.div>
    </div>
  );
};

// ============================================
// SCENE 4: Encapsulation - The Living Capsule
// ============================================
const Scene4 = () => {
  const [phase, setPhase] = useState(0);
  useEffect(() => { const t = [setTimeout(() => setPhase(1), 800)]; return () => t.forEach(clearTimeout); }, []);
  return (
    <div style={containerStyle}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: "center", marginBottom: "1.5rem" }}>
        <div style={{ color: colors.accent, fontWeight: 700, fontSize: "12px", letterSpacing: "3px", marginBottom: "0.5rem" }}>CHAPTER 4</div>
        <div style={{ fontSize: "1.5rem", fontWeight: 700, color: colors.virtualColor }}>Encapsulation 💊</div>
        <div style={{ color: colors.textSec, fontSize: "12px" }}>The Living Capsule</div>
      </motion.div>
      <motion.div initial={{ opacity: 0, rotateY: -20 }} animate={{ opacity: 1, rotateY: 0 }} style={{ display: "flex", justifyContent: "center", marginBottom: "1.5rem" }}>
        <div style={{ position: "relative", padding: "30px 40px", borderRadius: "100px", background: `linear-gradient(135deg, ${colors.virtualColor}20, ${colors.primary}10)`, border: `3px solid ${colors.virtualColor}`, boxShadow: `0 0 40px ${colors.virtualColor}30` }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ padding: "10px 20px", borderRadius: "8px", background: `${colors.danger}20`, marginBottom: "0.8rem" }}>
              <span style={{ fontSize: "10px", color: colors.danger }}>🔒 durability</span>
            </div>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <div style={{ padding: "6px 12px", borderRadius: "100px", background: `${colors.success}20`, fontSize: "9px", color: colors.success }}>set()</div>
              <div style={{ padding: "6px 12px", borderRadius: "100px", background: `${colors.success}20`, fontSize: "9px", color: colors.success }}>get()</div>
            </div>
          </div>
        </div>
      </motion.div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 1 ? 1 : 0 }} style={{ textAlign: "center" }}>
        <div style={{ color: colors.virtualColor, fontSize: "12px" }}>"Data + Rules = One sealed unit"</div>
        <div style={{ color: colors.accent, fontSize: "11px", marginTop: "0.3rem" }}>"This is <span style={{ fontWeight: 700 }}>Encapsulation</span>."</div>
      </motion.div>
    </div>
  );
};

// ============================================
// SCENE 5: But Real Code Gets Big
// ============================================
const Scene5 = () => {
  const [phase, setPhase] = useState(0);
  useEffect(() => { const t = [setTimeout(() => setPhase(1), 600), setTimeout(() => setPhase(2), 1200)]; return () => t.forEach(clearTimeout); }, []);
  return (
    <div style={containerStyle}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: "center", marginBottom: "1.5rem" }}>
        <div style={{ color: colors.accent, fontWeight: 700, fontSize: "12px", letterSpacing: "3px", marginBottom: "0.5rem" }}>CHAPTER 5</div>
        <div style={{ fontSize: "1.5rem", fontWeight: 700, color: colors.warning }}>But Real Code Gets Big...</div>
      </motion.div>
      <div style={{ display: "flex", gap: "1rem", justifyContent: "center", marginBottom: "1.5rem" }}>
        {[{ num: 5, show: true }, { num: 20, show: phase >= 1 }, { num: 100, show: phase >= 2 }].map((item, i) => (
          <motion.div key={i} initial={{ opacity: 0, scale: 0 }} animate={{ opacity: item.show ? 1 : 0, scale: item.show ? 1 : 0 }} style={{ padding: "16px 24px", borderRadius: "12px", background: `${i === 2 ? colors.danger : colors.warning}15`, border: `2px solid ${i === 2 ? colors.danger : colors.warning}`, textAlign: "center" }}>
            <div style={{ color: i === 2 ? colors.danger : colors.warning, fontWeight: 700, fontSize: "18px" }}>{item.num}</div>
            <div style={{ color: colors.textSec, fontSize: "9px" }}>functions</div>
          </motion.div>
        ))}
      </div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 2 ? 1 : 0 }} style={{ padding: "10px 24px", borderRadius: "100px", background: `${colors.danger}15`, textAlign: "center" }}>
        <span style={{ color: colors.danger, fontSize: "11px" }}>"This doesn't scale."</span>
      </motion.div>
    </div>
  );
};

// ============================================
// SCENE 6: Blueprint vs Building
// ============================================
const Scene6 = () => {
  const [phase, setPhase] = useState(0);
  useEffect(() => { const t = [setTimeout(() => setPhase(1), 800)]; return () => t.forEach(clearTimeout); }, []);
  return (
    <div style={containerStyle}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: "center", marginBottom: "1.5rem" }}>
        <div style={{ color: colors.accent, fontWeight: 700, fontSize: "12px", letterSpacing: "3px", marginBottom: "0.5rem" }}>CHAPTER 6</div>
        <div style={{ fontSize: "1.5rem", fontWeight: 700, color: colors.primary }}>Blueprint vs Building</div>
      </motion.div>
      <div style={{ display: "flex", gap: "2rem", justifyContent: "center", marginBottom: "1.5rem" }}>
        <div style={{ padding: "16px", borderRadius: "12px", background: `${colors.primary}15`, border: `2px solid ${colors.primary}`, textAlign: "center" }}>
          <div style={{ fontFamily: "monospace", color: colors.primary, fontWeight: 600, fontSize: "11px" }}>GameItem.h</div>
          <div style={{ color: colors.textSec, fontSize: "10px", marginTop: "0.5rem" }}>Clean interface</div>
          <div style={{ color: colors.textSec, fontSize: "9px" }}>Only declarations</div>
        </div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 1 ? 1 : 0 }} style={{ padding: "16px", borderRadius: "12px", background: `${colors.success}15`, border: `2px solid ${colors.success}`, textAlign: "center" }}>
          <div style={{ fontFamily: "monospace", color: colors.success, fontWeight: 600, fontSize: "11px" }}>GameItem.cpp</div>
          <div style={{ color: colors.textSec, fontSize: "10px", marginTop: "0.5rem" }}>Heavy machinery</div>
          <div style={{ color: colors.textSec, fontSize: "9px" }}>Logic, validation</div>
        </motion.div>
      </div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 1 ? 1 : 0 }} style={{ textAlign: "center" }}>
        <div style={{ color: colors.text, fontSize: "11px" }}>"<span style={{ color: colors.primary }}>What it can do</span>" vs "<span style={{ color: colors.success }}>How it does it</span>"</div>
      </motion.div>
    </div>
  );
};

// ============================================
// SCENE 7: Scope Resolution Operator
// ============================================
const Scene7 = () => {
  const [phase, setPhase] = useState(0);
  useEffect(() => { const t = [setTimeout(() => setPhase(1), 800)]; return () => t.forEach(clearTimeout); }, []);
  const code = `void GameItem::setDurability(int d) {
    if(d >= 0 && d <= 100)
        durability = d;
}`;
  return (
    <div style={containerStyle}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: "center", marginBottom: "1.5rem" }}>
        <div style={{ color: colors.accent, fontWeight: 700, fontSize: "12px", letterSpacing: "3px", marginBottom: "0.5rem" }}>CHAPTER 7</div>
        <div style={{ fontSize: "1.5rem", fontWeight: 700, color: colors.virtualColor }}>Scope Resolution ::</div>
        <div style={{ color: colors.textSec, fontSize: "12px" }}>The Binding Spell</div>
      </motion.div>
      <div style={{ display: "flex", gap: "2rem", alignItems: "center", justifyContent: "center", marginBottom: "1.5rem" }}>
        <GlassCard glow={colors.virtualColor} style={{ maxWidth: "320px" }}><CodeBlock code={code} fontSize="9px" /></GlassCard>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 1 ? 1 : 0 }}>
          <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 1, repeat: Infinity }} style={{ fontSize: "2rem", color: colors.virtualColor }}>⚡</motion.div>
        </motion.div>
      </div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 1 ? 1 : 0 }} style={{ textAlign: "center" }}>
        <div style={{ color: colors.virtualColor, fontSize: "12px" }}>"This function <span style={{ fontWeight: 700 }}>belongs</span> to this class."</div>
      </motion.div>
    </div>
  );
};

// ============================================
// SCENE 8: Teamwork Visualization
// ============================================
const Scene8 = () => {
  const [phase, setPhase] = useState(0);
  useEffect(() => { const t = [setTimeout(() => setPhase(1), 800)]; return () => t.forEach(clearTimeout); }, []);
  return (
    <div style={containerStyle}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: "center", marginBottom: "1.5rem" }}>
        <div style={{ color: colors.accent, fontWeight: 700, fontSize: "12px", letterSpacing: "3px", marginBottom: "0.5rem" }}>CHAPTER 8</div>
        <div style={{ fontSize: "1.5rem", fontWeight: 700, color: colors.success }}>Teamwork 👥</div>
      </motion.div>
      <div style={{ display: "flex", gap: "2rem", justifyContent: "center", marginBottom: "1.5rem" }}>
        <div style={{ padding: "16px", borderRadius: "12px", background: `${colors.primary}15`, border: `2px solid ${colors.primary}`, textAlign: "center" }}>
          <div style={{ fontSize: "1.5rem", marginBottom: "0.3rem" }}>👨‍💻</div>
          <div style={{ fontFamily: "monospace", color: colors.primary, fontSize: "10px" }}>.h file</div>
          <div style={{ color: colors.textSec, fontSize: "9px" }}>Interface</div>
        </div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 1 ? 1 : 0 }} style={{ padding: "16px", borderRadius: "12px", background: `${colors.success}15`, border: `2px solid ${colors.success}`, textAlign: "center" }}>
          <div style={{ fontSize: "1.5rem", marginBottom: "0.3rem" }}>👩‍💻</div>
          <div style={{ fontFamily: "monospace", color: colors.success, fontSize: "10px" }}>.cpp file</div>
          <div style={{ color: colors.textSec, fontSize: "9px" }}>Implementation</div>
        </motion.div>
      </div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 1 ? 1 : 0 }} style={{ textAlign: "center" }}>
        <span style={{ color: colors.accent, fontSize: "11px" }}>"This is how large teams survive."</span>
      </motion.div>
    </div>
  );
};

// ============================================
// SCENE 9: But One Item Is Not a Game
// ============================================
const Scene9 = () => {
  const [phase, setPhase] = useState(0);
  useEffect(() => { const t = [setTimeout(() => setPhase(1), 600), setTimeout(() => setPhase(2), 1200)]; return () => t.forEach(clearTimeout); }, []);
  return (
    <div style={containerStyle}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: "center", marginBottom: "1.5rem" }}>
        <div style={{ color: colors.accent, fontWeight: 700, fontSize: "12px", letterSpacing: "3px", marginBottom: "0.5rem" }}>CHAPTER 9</div>
        <div style={{ fontSize: "1.5rem", fontWeight: 700, color: colors.warning }}>But One Item Is Not A Game</div>
      </motion.div>
      <div style={{ display: "flex", gap: "0.5rem", justifyContent: "center", marginBottom: "1.5rem" }}>
        {[1, 10, 50, 100].map((num, i) => (
          <motion.div key={i} initial={{ opacity: 0, scale: 0 }} animate={{ opacity: i <= phase ? 1 : 0, scale: i <= phase ? 1 : 0 }} style={{ padding: "12px 18px", borderRadius: "8px", background: `${num === 1 ? colors.danger : colors.success}15`, border: `1px solid ${num === 1 ? colors.danger : colors.success}`, textAlign: "center" }}>
            <div style={{ color: num === 1 ? colors.danger : colors.success, fontWeight: 700 }}>{num}</div>
            <div style={{ color: colors.textSec, fontSize: "9px" }}>slots</div>
          </motion.div>
        ))}
      </div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 2 ? 1 : 0 }} style={{ textAlign: "center" }}>
        <span style={{ color: colors.text, fontSize: "11px" }}>"Games are not built from one object."</span>
      </motion.div>
    </div>
  );
};

// ============================================
// SCENE 10: Array of Objects
// ============================================
const Scene10 = () => {
  const [phase, setPhase] = useState(0);
  useEffect(() => { const t = [setTimeout(() => setPhase(1), 800)]; return () => t.forEach(clearTimeout); }, []);
  const code = `GameItem inventory[10];`;
  return (
    <div style={containerStyle}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: "center", marginBottom: "1.5rem" }}>
        <div style={{ color: colors.accent, fontWeight: 700, fontSize: "12px", letterSpacing: "3px", marginBottom: "0.5rem" }}>CHAPTER 10</div>
        <div style={{ fontSize: "1.5rem", fontWeight: 700, color: colors.virtualColor }}>Array of Objects ✨</div>
        <div style={{ color: colors.textSec, fontSize: "12px" }}>The Multiplication Spell</div>
      </motion.div>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem", marginBottom: "1.5rem" }}>
        <GlassCard glow={colors.virtualColor}><CodeBlock code={code} fontSize="11px" /></GlassCard>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 1 ? 1 : 0 }} style={{ display: "flex", gap: "0.5rem" }}>
          {Array(5).fill(0).map((_, i) => (
            <motion.div key={i} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: i * 0.1 }} style={{ padding: "10px", borderRadius: "8px", background: `${colors.primary}15`, border: `1px solid ${colors.primary}` }}>
              <div style={{ fontSize: "10px", color: colors.primary }}>[{i}]</div>
            </motion.div>
          ))}
          <span style={{ color: colors.textSec, alignSelf: "center" }}>...</span>
        </motion.div>
      </div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 1 ? 1 : 0 }} style={{ textAlign: "center" }}>
        <span style={{ color: colors.virtualColor, fontSize: "11px" }}>Each is a full object with its own protection rules!</span>
      </motion.div>
    </div>
  );
};

// ============================================
// SCENE 11: Accessing Individual Items
// ============================================
const Scene11 = () => {
  const [phase, setPhase] = useState(0);
  useEffect(() => { const t = [setTimeout(() => setPhase(1), 800)]; return () => t.forEach(clearTimeout); }, []);
  const code = `inventory[0].setDurability(100);
inventory[2].setDurability(80);`;
  return (
    <div style={containerStyle}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: "center", marginBottom: "1.5rem" }}>
        <div style={{ color: colors.accent, fontWeight: 700, fontSize: "12px", letterSpacing: "3px", marginBottom: "0.5rem" }}>CHAPTER 11</div>
        <div style={{ fontSize: "1.5rem", fontWeight: 700, color: colors.success }}>Accessing Individual Items</div>
      </motion.div>
      <div style={{ display: "flex", gap: "2rem", alignItems: "center", justifyContent: "center", marginBottom: "1.5rem" }}>
        <GlassCard glow={colors.success} style={{ maxWidth: "280px" }}><CodeBlock code={code} fontSize="10px" /></GlassCard>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 1 ? 1 : 0 }} style={{ display: "flex", gap: "0.8rem" }}>
          <div style={{ padding: "12px", borderRadius: "8px", background: `${colors.primary}20`, textAlign: "center" }}>
            <div style={{ fontSize: "10px", color: colors.textSec }}>[0]</div>
            <div style={{ height: "40px", width: "20px", background: `${colors.success}40`, borderRadius: "4px", marginTop: "0.3rem" }} />
            <div style={{ fontSize: "9px", color: colors.success }}>100</div>
          </div>
          <div style={{ padding: "12px", borderRadius: "8px", background: `${colors.primary}20`, textAlign: "center" }}>
            <div style={{ fontSize: "10px", color: colors.textSec }}>[2]</div>
            <div style={{ height: "32px", width: "20px", background: `${colors.warning}40`, borderRadius: "4px", marginTop: "0.3rem" }} />
            <div style={{ fontSize: "9px", color: colors.warning }}>80</div>
          </div>
        </motion.div>
      </div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 1 ? 1 : 0 }} style={{ textAlign: "center" }}>
        <span style={{ color: colors.text, fontSize: "11px" }}>"Same rules. Separate lives."</span>
      </motion.div>
    </div>
  );
};

// ============================================
// SCENE 12: The Magic Realization
// ============================================
const Scene12 = () => {
  const [phase, setPhase] = useState(0);
  useEffect(() => { const t = [setTimeout(() => setPhase(1), 800)]; return () => t.forEach(clearTimeout); }, []);
  const code = `inventory[2].durability = -999;`;
  return (
    <div style={containerStyle}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: "center", marginBottom: "1.5rem" }}>
        <div style={{ color: colors.accent, fontWeight: 700, fontSize: "12px", letterSpacing: "3px", marginBottom: "0.5rem" }}>CHAPTER 12</div>
        <div style={{ fontSize: "1.5rem", fontWeight: 700, color: colors.danger }}>The Magic Realization</div>
      </motion.div>
      <div style={{ display: "flex", gap: "2rem", alignItems: "center", justifyContent: "center", marginBottom: "1.5rem" }}>
        <GlassCard glow={colors.danger} style={{ maxWidth: "280px" }}><CodeBlock code={code} fontSize="10px" /></GlassCard>
        <motion.div initial={{ opacity: 0, scale: 0 }} animate={{ opacity: phase >= 1 ? 1 : 0, scale: 1 }} style={{ padding: "20px", borderRadius: "100%", background: `${colors.danger}30`, border: `3px solid ${colors.danger}` }}>
          <div style={{ fontSize: "2rem" }}>🛡️</div>
        </motion.div>
      </div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 1 ? 1 : 0 }} style={{ textAlign: "center" }}>
        <div style={{ color: colors.danger, fontSize: "12px", marginBottom: "0.3rem" }}>❌ Blocked!</div>
        <div style={{ color: colors.success, fontSize: "11px" }}>"You didn't just scale data. You scaled <span style={{ fontWeight: 700 }}>safety</span>."</div>
      </motion.div>
    </div>
  );
};

// ============================================
// SCENE 13: The Particle System Story
// ============================================
const Scene13 = () => {
  const [phase, setPhase] = useState(0);
  useEffect(() => { const t = [setTimeout(() => setPhase(1), 800)]; return () => t.forEach(clearTimeout); }, []);
  return (
    <div style={containerStyle}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: "center", marginBottom: "1.5rem" }}>
        <div style={{ color: colors.accent, fontWeight: 700, fontSize: "12px", letterSpacing: "3px", marginBottom: "0.5rem" }}>CHAPTER 13</div>
        <div style={{ fontSize: "1.5rem", fontWeight: 700, color: colors.warning }}>The Particle System Story</div>
      </motion.div>
      <div style={{ display: "flex", gap: "2rem", justifyContent: "center", marginBottom: "1.5rem" }}>
        <div style={{ padding: "16px", borderRadius: "12px", background: `${colors.danger}15`, border: `2px solid ${colors.danger}`, textAlign: "center" }}>
          <div style={{ color: colors.danger, fontWeight: 600, fontSize: "10px", marginBottom: "0.5rem" }}>❌ Old Way</div>
          <div style={{ fontFamily: "monospace", fontSize: "9px", color: colors.textSec }}>positionX[100]<br/>positionY[100]<br/>velocityX[100]</div>
          <div style={{ color: colors.danger, fontSize: "9px", marginTop: "0.3rem" }}>Tangled!</div>
        </div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 1 ? 1 : 0 }} style={{ padding: "16px", borderRadius: "12px", background: `${colors.success}15`, border: `2px solid ${colors.success}`, textAlign: "center" }}>
          <div style={{ color: colors.success, fontWeight: 600, fontSize: "10px", marginBottom: "0.5rem" }}>✅ OOP Way</div>
          <div style={{ fontFamily: "monospace", fontSize: "10px", color: colors.success }}>Particle particles[100];</div>
          <div style={{ color: colors.success, fontSize: "9px", marginTop: "0.3rem" }}>Clean. Elegant.</div>
        </motion.div>
      </div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 1 ? 1 : 0 }} style={{ textAlign: "center" }}>
        <span style={{ color: colors.accent, fontSize: "11px" }}>"The difference between coding and <span style={{ fontWeight: 700 }}>engineering</span>."</span>
      </motion.div>
    </div>
  );
};

// ============================================
// SCENE 14: The Three Pillars
// ============================================
const Scene14 = () => {
  const [phase, setPhase] = useState(0);
  useEffect(() => { const t = [setTimeout(() => setPhase(1), 600), setTimeout(() => setPhase(2), 1200)]; return () => t.forEach(clearTimeout); }, []);
  const pillars = [
    { icon: "🛡️", name: "SAFETY" },
    { icon: "🧱", name: "MODULARITY" },
    { icon: "📈", name: "SCALABILITY" },
  ];
  return (
    <div style={containerStyle}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: "center", marginBottom: "1.5rem" }}>
        <div style={{ color: colors.accent, fontWeight: 700, fontSize: "12px", letterSpacing: "3px", marginBottom: "0.5rem" }}>CHAPTER 14</div>
        <div style={{ fontSize: "1.5rem", fontWeight: 700, color: colors.virtualColor }}>The Three Pillars</div>
      </motion.div>
      <div style={{ display: "flex", gap: "1.5rem", justifyContent: "center", marginBottom: "1.5rem" }}>
        {pillars.map((p, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 50 }} animate={{ opacity: i <= phase ? 1 : 0, y: 0 }} style={{ padding: "20px 24px", borderRadius: "12px", background: `${colors.virtualColor}15`, border: `2px solid ${colors.virtualColor}`, textAlign: "center" }}>
            <div style={{ fontSize: "1.5rem", marginBottom: "0.3rem" }}>{p.icon}</div>
            <div style={{ color: colors.virtualColor, fontWeight: 700, fontSize: "11px" }}>{p.name}</div>
          </motion.div>
        ))}
      </div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 2 ? 1 : 0 }} style={{ textAlign: "center" }}>
        <div style={{ color: colors.text, fontSize: "11px" }}>"This is not C++ syntax."</div>
        <div style={{ color: colors.accent, fontSize: "12px", marginTop: "0.3rem" }}>"This is <span style={{ fontWeight: 700 }}>software architecture</span>."</div>
      </motion.div>
    </div>
  );
};

// ============================================
// SCENE 15: The Next Mystery
// ============================================
const Scene15 = () => {
  const [phase, setPhase] = useState(0);
  useEffect(() => { const t = [setTimeout(() => setPhase(1), 1000)]; return () => t.forEach(clearTimeout); }, []);
  const code = `GameItem inventory[10];
// durability = ❓`;
  return (
    <div style={{ ...containerStyle, background: "linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 50%, #0a0a0f 100%)" }}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: "center", marginBottom: "1.5rem" }}>
        <div style={{ color: colors.accent, fontWeight: 700, fontSize: "12px", letterSpacing: "3px", marginBottom: "0.5rem" }}>ENDING</div>
        <div style={{ fontSize: "1.5rem", fontWeight: 700, color: colors.text }}>The Next Mystery 🔮</div>
      </motion.div>
      <GlassCard style={{ maxWidth: "280px", margin: "0 auto", marginBottom: "1.5rem" }}><CodeBlock code={code} fontSize="10px" /></GlassCard>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 1 ? 1 : 0 }} style={{ textAlign: "center" }}>
        <div style={{ color: colors.textSec, fontSize: "12px" }}>"When objects are born..."</div>
        <div style={{ color: colors.warning, fontSize: "12px", marginTop: "0.3rem" }}>"Who initializes them?"</div>
        <div style={{ color: colors.accent, fontSize: "14px", fontWeight: 700, marginTop: "0.8rem" }}>Meet the Constructor. →</div>
      </motion.div>
    </div>
  );
};

// Export all scenes
export const AccessSpecifiersScenes = [
  { title: "Game World Is Born", component: Scene1, contentText: "Every real game is a system. Sword, Shield, Potion waiting to be created." },
  { title: "Naive Implementation", component: Scene2, contentText: "swordDurability = -500; Anyone can change anything. Systems break." },
  { title: "Safety Wall", component: Scene3, contentText: "private durability, public setDurability(). Data is requested, not touched." },
  { title: "Encapsulation", component: Scene4, contentText: "Data + Rules = One sealed unit. The living capsule." },
  { title: "Code Gets Big", component: Scene5, contentText: "5 → 20 → 100 functions. This doesn't scale." },
  { title: "Blueprint vs Building", component: Scene6, contentText: ".h = clean interface, .cpp = heavy machinery. What vs How." },
  { title: "Scope Resolution", component: Scene7, contentText: "GameItem::setDurability - this function belongs to this class." },
  { title: "Teamwork", component: Scene8, contentText: ".h and .cpp - how large teams survive without colliding." },
  { title: "One Item Not Enough", component: Scene9, contentText: "1 slot ❌ 10 → 50 → 100 slots. Games need many objects." },
  { title: "Array of Objects", component: Scene10, contentText: "GameItem inventory[10]; Blueprint stamps 10 times into memory." },
  { title: "Accessing Items", component: Scene11, contentText: "inventory[0].setDurability(100); Same rules, separate lives." },
  { title: "Magic Realization", component: Scene12, contentText: "inventory[2].durability = -999; BLOCKED! You scaled safety." },
  { title: "Particle Story", component: Scene13, contentText: "Old: tangled arrays. OOP: Particle particles[100]; Clean, elegant." },
  { title: "Three Pillars", component: Scene14, contentText: "Safety, Modularity, Scalability. Software architecture." },
  { title: "Next Mystery", component: Scene15, contentText: "When objects are born... who initializes them? Meet Constructor." },
];
