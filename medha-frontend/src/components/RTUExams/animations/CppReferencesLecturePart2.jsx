/**
 * CppReferencesLecturePart2.jsx - Scenes 8-14
 * Dynamic Memory, Memory Leaks, Smart Pointers
 */
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { colors, containerStyle } from "./VirtualFunctionsTheme";
import { GlassCard, CodeBlock } from "./CppReferencesLecture";

// Theme colors
const memColors = { stack: "#3B82F6", heap: "#F59E0B", reference: "#8B5CF6", pointer: "#6B7280", danger: "#EF4444", safe: "#10B981" };

// ============================================
// SCENE 8: Dynamic Memory - The 'new' Operator
// ============================================
const Scene8 = () => {
  const code = `int *p = new int;
*p = 10;

// Breakdown:
// new int    → Request memory from heap
// int *p     → Pointer to store address
// *p = 10    → Dereference to set value`;
  const [phase, setPhase] = useState(0);
  useEffect(() => { const t = [setTimeout(() => setPhase(1), 600), setTimeout(() => setPhase(2), 1200)]; return () => t.forEach(clearTimeout); }, []);
  return (
    <div style={containerStyle}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: memColors.heap, fontWeight: 700, fontSize: "13px", letterSpacing: "1.5px", marginBottom: "1rem" }}>🆕 DYNAMIC MEMORY: THE 'new' OPERATOR</motion.div>
      <div style={{ display: "flex", gap: "2rem", alignItems: "flex-start" }}>
        <GlassCard style={{ maxWidth: "360px" }}><CodeBlock code={code} /></GlassCard>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 1 ? 1 : 0 }} style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <div style={{ padding: "10px 16px", borderRadius: "10px", background: `${memColors.stack}15`, border: `1px solid ${memColors.stack}` }}>
              <div style={{ fontFamily: "monospace", fontSize: "11px", color: memColors.stack }}>p (Stack)</div>
              <div style={{ fontSize: "10px", color: colors.textSec }}>Holds address</div>
            </div>
            <motion.div animate={{ x: [0, 5, 0] }} transition={{ duration: 1, repeat: Infinity }} style={{ fontSize: "1.5rem" }}>→</motion.div>
            <div style={{ padding: "10px 16px", borderRadius: "10px", background: `${memColors.heap}15`, border: `1px solid ${memColors.heap}` }}>
              <div style={{ fontFamily: "monospace", fontSize: "11px", color: memColors.heap }}>10 (Heap)</div>
              <div style={{ fontSize: "10px", color: colors.textSec }}>Actual value</div>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 2 ? 1 : 0 }} style={{ padding: "10px 16px", borderRadius: "10px", background: `${memColors.heap}10`, fontSize: "11px" }}>
            <span style={{ color: memColors.heap }}>*p</span><span style={{ color: colors.textSec }}> = Dereference: "go to the address"</span>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

// ============================================
// SCENE 9: Dynamic Arrays
// ============================================
const Scene9 = () => {
  const code = `int size;
cin >> size;  // User input at runtime

int *arr = new int[size];
arr[0] = 5;
arr[1] = 10;

// Fixed stack array:
// int arr[size];  // ❌ Size must be constant!`;
  const [phase, setPhase] = useState(0);
  useEffect(() => { const t = [setTimeout(() => setPhase(1), 800)]; return () => t.forEach(clearTimeout); }, []);
  return (
    <div style={containerStyle}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: memColors.heap, fontWeight: 700, fontSize: "13px", letterSpacing: "1.5px", marginBottom: "1rem" }}>📊 DYNAMIC ARRAYS</motion.div>
      <div style={{ display: "flex", gap: "2rem", alignItems: "flex-start" }}>
        <GlassCard style={{ maxWidth: "350px" }}><CodeBlock code={code} /></GlassCard>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 1 ? 1 : 0 }} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            {[5, 10, "?", "?", "?"].map((v, i) => (
              <motion.div key={i} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: i * 0.1 }} style={{ width: "36px", height: "36px", borderRadius: "8px", background: `${memColors.heap}20`, border: `1px solid ${memColors.heap}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "monospace", fontSize: "11px", color: memColors.heap }}>{v}</motion.div>
            ))}
          </div>
          <div style={{ padding: "10px 16px", borderRadius: "10px", background: `${memColors.safe}15`, display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span style={{ color: memColors.safe }}>✓</span>
            <span style={{ fontSize: "11px", color: colors.text }}>Size determined at <b>runtime</b></span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

// ============================================
// SCENE 10: The 'delete' Operator
// ============================================
const Scene10 = () => {
  const code = `// Single variable
delete p;

// Array - CRITICAL!
delete[] arr;  // Note the []

// Wrong way:
delete arr;    // ⚠️ Memory leak!`;
  const [phase, setPhase] = useState(0);
  useEffect(() => { const t = [setTimeout(() => setPhase(1), 600)]; return () => t.forEach(clearTimeout); }, []);
  return (
    <div style={containerStyle}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: memColors.danger, fontWeight: 700, fontSize: "13px", letterSpacing: "1.5px", marginBottom: "1rem" }}>🗑️ THE 'delete' OPERATOR</motion.div>
      <div style={{ display: "flex", gap: "2rem", alignItems: "flex-start" }}>
        <GlassCard glow={memColors.danger} style={{ maxWidth: "300px" }}><CodeBlock code={code} /></GlassCard>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 1 ? 1 : 0 }} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div style={{ padding: "12px 16px", borderRadius: "12px", background: `${memColors.safe}15`, border: `1px solid ${memColors.safe}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span style={{ color: memColors.safe }}>✓</span>
              <span style={{ fontFamily: "monospace", fontSize: "11px", color: memColors.safe }}>delete p</span>
            </div>
            <div style={{ color: colors.textSec, fontSize: "10px" }}>Single variable</div>
          </div>
          <div style={{ padding: "12px 16px", borderRadius: "12px", background: `${memColors.safe}15`, border: `1px solid ${memColors.safe}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span style={{ color: memColors.safe }}>✓</span>
              <span style={{ fontFamily: "monospace", fontSize: "11px", color: memColors.safe }}>delete[] arr</span>
            </div>
            <div style={{ color: colors.textSec, fontSize: "10px" }}>Array - MUST use []</div>
          </div>
          <div style={{ padding: "12px 16px", borderRadius: "12px", background: `${memColors.danger}15`, border: `1px solid ${memColors.danger}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span style={{ color: memColors.danger }}>❌</span>
              <span style={{ fontFamily: "monospace", fontSize: "11px", color: memColors.danger }}>delete arr</span>
            </div>
            <div style={{ color: memColors.danger, fontSize: "10px" }}>Memory leak!</div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

// ============================================
// SCENE 11: Memory Leak Explained
// ============================================
const Scene11 = () => {
  const code = `void problematic() {
    int *p = new int;
    *p = 10;
    // Forgot to delete p!
}  // Memory lost forever 💧`;
  const [leakLevel, setLeakLevel] = useState(0);
  useEffect(() => { const i = setInterval(() => setLeakLevel(l => l < 5 ? l + 1 : 0), 1000); return () => clearInterval(i); }, []);
  return (
    <div style={containerStyle}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: memColors.danger, fontWeight: 700, fontSize: "13px", letterSpacing: "1.5px", marginBottom: "1rem" }}>💧 MEMORY LEAK EXPLAINED</motion.div>
      <div style={{ display: "flex", gap: "2rem", alignItems: "center" }}>
        <GlassCard glow={memColors.danger} style={{ maxWidth: "320px" }}><CodeBlock code={code} /></GlassCard>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" }}>
          <div style={{ fontSize: "13px", color: colors.textSec }}>🏨 Hotel Room Analogy:</div>
          <div style={{ display: "flex", gap: "0.3rem" }}>
            {[0, 1, 2, 3, 4].map(i => (
              <motion.div key={i} animate={{ backgroundColor: i <= leakLevel ? memColors.danger : `${colors.text}10` }} style={{ width: "30px", height: "40px", borderRadius: "6px", border: `1px solid ${i <= leakLevel ? memColors.danger : colors.text}30`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                {i <= leakLevel && <span style={{ fontSize: "0.8rem" }}>🔒</span>}
              </motion.div>
            ))}
          </div>
          <div style={{ fontSize: "11px", color: memColors.danger }}>Rooms occupied, keys lost! 🔑❌</div>
          <motion.div animate={{ scale: leakLevel >= 5 ? [1, 1.1, 1] : 1 }} style={{ padding: "10px 16px", borderRadius: "10px", background: `${memColors.danger}20`, color: memColors.danger, fontSize: "11px" }}>
            Available: {5 - leakLevel} / 5
          </motion.div>
        </div>
      </div>
    </div>
  );
};

// ============================================
// SCENE 12: Dangling Pointers
// ============================================
const Scene12 = () => {
  const code = `int *p = new int;
*p = 10;
delete p;

*p = 20;  // DANGER! Dangling pointer
          // Accessing freed memory`;
  const [phase, setPhase] = useState(0);
  useEffect(() => { const t = [setTimeout(() => setPhase(1), 800), setTimeout(() => setPhase(2), 1800)]; return () => t.forEach(clearTimeout); }, []);
  return (
    <div style={containerStyle}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: memColors.danger, fontWeight: 700, fontSize: "13px", letterSpacing: "1.5px", marginBottom: "1rem" }}>☠️ DANGLING POINTERS</motion.div>
      <div style={{ display: "flex", gap: "2rem", alignItems: "flex-start" }}>
        <GlassCard glow={memColors.danger} style={{ maxWidth: "340px" }}><CodeBlock code={code} /></GlassCard>
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 1 ? 1 : 0 }} style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <div style={{ padding: "14px", borderRadius: "10px", background: `${memColors.pointer}20`, border: `1px solid ${memColors.pointer}` }}>
              <div style={{ fontFamily: "monospace", fontSize: "10px", color: memColors.pointer }}>p = 0x1234</div>
            </div>
            <motion.div animate={{ x: [0, 5, 0] }} transition={{ duration: 0.5, repeat: Infinity }} style={{ fontSize: "1.5rem" }}>→</motion.div>
            <motion.div animate={{ opacity: phase >= 2 ? [1, 0.3, 1] : 1 }} style={{ padding: "14px", borderRadius: "10px", background: `${memColors.danger}20`, border: `2px dashed ${memColors.danger}` }}>
              <div style={{ fontSize: "1rem" }}>💀</div>
              <div style={{ fontSize: "9px", color: memColors.danger }}>FREED</div>
            </motion.div>
          </motion.div>
          <AnimatePresence>{phase >= 2 && <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} style={{ padding: "12px 16px", borderRadius: "10px", background: `${memColors.danger}20`, border: `2px solid ${memColors.danger}` }}>
            <div style={{ color: memColors.danger, fontWeight: 600, fontSize: "11px" }}>💥 Undefined Behavior!</div>
            <div style={{ color: colors.textSec, fontSize: "10px" }}>Crash, corruption, security bugs</div>
          </motion.div>}</AnimatePresence>
        </div>
      </div>
    </div>
  );
};

// ============================================
// SCENE 13: Smart Pointers
// ============================================
const Scene13 = () => {
  const code = `#include <memory>

// Modern way:
std::unique_ptr<int> p = std::make_unique<int>(10);

// Automatic cleanup when scope ends!
// No delete needed ✨`;
  const [phase, setPhase] = useState(0);
  useEffect(() => { const t = [setTimeout(() => setPhase(1), 800)]; return () => t.forEach(clearTimeout); }, []);
  return (
    <div style={containerStyle}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: memColors.safe, fontWeight: 700, fontSize: "13px", letterSpacing: "1.5px", marginBottom: "1rem" }}>🧠 MODERN C++: SMART POINTERS</motion.div>
      <div style={{ display: "flex", gap: "2rem", alignItems: "flex-start" }}>
        <GlassCard glow={memColors.safe} style={{ maxWidth: "420px" }}><CodeBlock code={code} /></GlassCard>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 1 ? 1 : 0 }} style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span style={{ fontSize: "1.5rem" }}>🛡️</span>
            <span style={{ color: memColors.safe, fontWeight: 600 }}>Auto cleanup</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span style={{ fontSize: "1.5rem" }}>🚀</span>
            <span style={{ color: memColors.safe, fontWeight: 600 }}>No memory leaks</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span style={{ fontSize: "1.5rem" }}>❌</span>
            <span style={{ color: colors.textSec }}>No delete needed</span>
          </div>
          <motion.div animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 2, repeat: Infinity }} style={{ padding: "12px 16px", borderRadius: "12px", background: `${memColors.safe}20`, border: `2px solid ${memColors.safe}`, textAlign: "center" }}>
            <span style={{ color: memColors.safe, fontWeight: 700 }}>Best of both worlds!</span>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

// ============================================
// SCENE 14: Conclusion - The Balance
// ============================================
const Scene14 = () => {
  const [phase, setPhase] = useState(0);
  useEffect(() => { const t = [setTimeout(() => setPhase(1), 500), setTimeout(() => setPhase(2), 1000), setTimeout(() => setPhase(3), 1500)]; return () => t.forEach(clearTimeout); }, []);
  const takeaways = [
    { icon: "🔗", label: "References", desc: "Safe, efficient aliases", color: memColors.reference },
    { icon: "⚡", label: "Dynamic Memory", desc: "Flexible but dangerous", color: memColors.heap },
    { icon: "🧠", label: "Smart Pointers", desc: "Modern solution", color: memColors.safe },
  ];
  return (
    <div style={containerStyle}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: colors.accent, fontWeight: 700, fontSize: "13px", letterSpacing: "1.5px", marginBottom: "1.5rem" }}>⚖️ CONCLUSION: THE BALANCE</motion.div>
      <div style={{ display: "flex", gap: "1.5rem", marginBottom: "1.5rem" }}>
        {takeaways.map((t, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: phase > i ? 1 : 0, y: 0 }} style={{ flex: 1, padding: "16px", borderRadius: "16px", background: `${t.color}15`, border: `2px solid ${t.color}`, textAlign: "center" }}>
            <div style={{ fontSize: "2rem", marginBottom: "0.3rem" }}>{t.icon}</div>
            <div style={{ color: t.color, fontWeight: 700, fontSize: "12px" }}>{t.label}</div>
            <div style={{ color: colors.textSec, fontSize: "10px", marginTop: "0.3rem" }}>{t.desc}</div>
          </motion.div>
        ))}
      </div>
      <AnimatePresence>{phase >= 3 && <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ padding: "14px 28px", borderRadius: "100px", background: `${colors.accent}15`, border: `1px solid ${colors.accent}40`, textAlign: "center" }}>
        <span style={{ color: colors.text }}>"Stack for simple, Heap for flexible, </span><span style={{ color: colors.accent, fontWeight: 700 }}>Smart pointers for modern C++</span>"
      </motion.div>}</AnimatePresence>
    </div>
  );
};

// Export Part 2 scenes
export const RefScenesPart2 = [
  { title: "The 'new' Operator", component: Scene8, contentText: "int *p = new int; Request memory from heap, pointer stores address, *p dereferences." },
  { title: "Dynamic Arrays", component: Scene9, contentText: "new int[size] - size determined at runtime. Stack arrays need constant size!" },
  { title: "The 'delete' Operator", component: Scene10, contentText: "delete p for single, delete[] arr for arrays. Missing [] causes memory leak!" },
  { title: "Memory Leak Explained", component: Scene11, contentText: "Hotel analogy - room occupied, key lost. Memory used forever, system runs out!" },
  { title: "Dangling Pointers", component: Scene12, contentText: "Pointer still holds address after delete. Accessing freed memory = undefined behavior!" },
  { title: "Smart Pointers", component: Scene13, contentText: "unique_ptr auto-deletes when scope ends. No manual delete, no leaks. Modern C++!" },
  { title: "Conclusion", component: Scene14, contentText: "References: safe aliases. Dynamic memory: flexible but dangerous. Smart pointers: modern solution." },
];
