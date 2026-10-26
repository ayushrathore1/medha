/**
 * TemplatesOneShotPart2 - Scenes 10-18
 * OOPS Unit 5: Templates in C++ - One Shot Lecture
 * Covers: Multiple Types, Mixed Type, Class Template, Box Specializations,
 *         Compile-Time Polymorphism, General Printer, Specialization for char*,
 *         Partial Specialization, Non-Type Parameter
 */
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { colors, containerStyle } from "./TemplatesUnit5Theme";
import { GlassCard, CodeBlock } from "./TemplatesOneShotPart1";

// ============================================
// SCENE 10: Multiple Type Templates (T and U)
// ============================================
const Scene10 = () => {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 600),
      setTimeout(() => setPhase(2), 1400),
      setTimeout(() => setPhase(3), 2200),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div style={containerStyle}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "2.5rem",
        }}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            color: colors.accent,
            fontWeight: 700,
            fontSize: "13px",
            letterSpacing: "1.5px",
          }}
        >
          🔢 MULTIPLE TYPE PARAMETERS
        </motion.div>

        {/* T and U tokens */}
        <div style={{ display: "flex", gap: "2rem" }}>
          <motion.div
            initial={{ opacity: 0, scale: 0, rotate: -20 }}
            animate={{
              opacity: phase >= 1 ? 1 : 0,
              scale: phase >= 1 ? 1 : 0,
              rotate: 0,
              x: phase >= 3 ? 50 : 0,
            }}
            transition={{ type: "spring", stiffness: 200 }}
            style={{
              background: `linear-gradient(135deg, ${colors.primary}, ${colors.typeInt})`,
              padding: "20px 35px",
              borderRadius: "16px",
              color: "white",
              fontWeight: 800,
              fontSize: "2rem",
              fontFamily: "'SF Mono', monospace",
              boxShadow: `0 15px 40px ${colors.primary}50`,
            }}
          >
            T
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0, rotate: 20 }}
            animate={{
              opacity: phase >= 2 ? 1 : 0,
              scale: phase >= 2 ? 1 : 0,
              rotate: 0,
              x: phase >= 3 ? -50 : 0,
            }}
            transition={{ type: "spring", stiffness: 200 }}
            style={{
              background: `linear-gradient(135deg, ${colors.typeU}, ${colors.accent})`,
              padding: "20px 35px",
              borderRadius: "16px",
              color: "white",
              fontWeight: 800,
              fontSize: "2rem",
              fontFamily: "'SF Mono', monospace",
              boxShadow: `0 15px 40px ${colors.typeU}50`,
            }}
          >
            U
          </motion.div>
        </div>

        {/* Code */}
        <AnimatePresence>
          {phase >= 3 && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <GlassCard glow={colors.accent}>
                <div
                  style={{
                    fontFamily: "'SF Mono', monospace",
                    fontSize: "18px",
                    textAlign: "center",
                  }}
                >
                  <span style={{ color: colors.secondary }}>template</span>
                  <span style={{ color: colors.textSec }}>{"<"}</span>
                  <span style={{ color: colors.accent }}>typename </span>
                  <motion.span
                    animate={{
                      color: [colors.primary, colors.typeInt, colors.primary],
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                    style={{ fontWeight: 700 }}
                  >
                    T
                  </motion.span>
                  <span style={{ color: colors.textSec }}>, </span>
                  <span style={{ color: colors.accent }}>typename </span>
                  <motion.span
                    animate={{
                      color: [colors.typeU, colors.accent, colors.typeU],
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                    style={{ fontWeight: 700 }}
                  >
                    U
                  </motion.span>
                  <span style={{ color: colors.textSec }}>{">"}</span>
                </div>
              </GlassCard>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Label */}
        <AnimatePresence>
          {phase >= 3 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{
                color: colors.textSec,
                fontSize: "14px",
                fontStyle: "italic",
              }}
            >
              Now we can use two different types!
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// ============================================
// SCENE 11: Mixed Type Example
// ============================================
const Scene11 = () => {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 600),
      setTimeout(() => setPhase(2), 1500),
      setTimeout(() => setPhase(3), 2500),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div style={containerStyle}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "2.5rem",
        }}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            color: colors.secondary,
            fontWeight: 700,
            fontSize: "13px",
            letterSpacing: "1.5px",
          }}
        >
          🔀 MIXED TYPE EXAMPLE
        </motion.div>

        {/* Function call */}
        <GlassCard>
          <div
            style={{
              fontFamily: "'SF Mono', monospace",
              fontSize: "24px",
              display: "flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            <span style={{ color: colors.text }}>add(</span>
            <motion.span
              animate={{
                color: phase >= 1 ? colors.typeInt : colors.text,
                textShadow: phase >= 1 ? `0 0 15px ${colors.typeInt}` : "none",
              }}
              style={{ fontWeight: 700 }}
            >
              5
            </motion.span>
            <span style={{ color: colors.textSec }}>, </span>
            <motion.span
              animate={{
                color: phase >= 1 ? colors.typeFloat : colors.text,
                textShadow:
                  phase >= 1 ? `0 0 15px ${colors.typeFloat}` : "none",
              }}
              style={{ fontWeight: 700 }}
            >
              2.5
            </motion.span>
            <span style={{ color: colors.text }}>)</span>
          </div>
        </GlassCard>

        {/* Type labels */}
        <AnimatePresence>
          {phase >= 2 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                display: "flex",
                gap: "3rem",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <div
                  style={{
                    width: "60px",
                    height: "60px",
                    borderRadius: "16px",
                    background: `${colors.typeInt}20`,
                    border: `2px solid ${colors.typeInt}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "'SF Mono', monospace",
                    fontSize: "20px",
                    fontWeight: 700,
                    color: colors.typeInt,
                  }}
                >
                  5
                </div>
                <span
                  style={{
                    color: colors.typeInt,
                    fontWeight: 600,
                    fontSize: "14px",
                  }}
                >
                  int
                </span>
              </div>

              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
                style={{
                  fontSize: "2rem",
                  color: colors.textSec,
                  alignSelf: "center",
                }}
              >
                +
              </motion.div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <div
                  style={{
                    width: "60px",
                    height: "60px",
                    borderRadius: "16px",
                    background: `${colors.typeFloat}20`,
                    border: `2px solid ${colors.typeFloat}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "'SF Mono', monospace",
                    fontSize: "18px",
                    fontWeight: 700,
                    color: colors.typeFloat,
                  }}
                >
                  2.5
                </div>
                <span
                  style={{
                    color: colors.typeFloat,
                    fontWeight: 600,
                    fontSize: "14px",
                  }}
                >
                  float
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Result arrow */}
        <AnimatePresence>
          {phase >= 3 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              <span style={{ color: colors.textSec, fontSize: "1.5rem" }}>
                ↓
              </span>
              <div
                style={{
                  padding: "12px 24px",
                  borderRadius: "100px",
                  background: `${colors.success}15`,
                  border: `1px solid ${colors.success}40`,
                  color: colors.success,
                  fontWeight: 600,
                  fontSize: "15px",
                }}
              >
                Both go into function mold! 🧪
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// ============================================
// SCENE 12: Class Template Appears (Box<T>)
// ============================================
const Scene12 = () => {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 800),
      setTimeout(() => setPhase(2), 1800),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div style={containerStyle}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "2.5rem",
        }}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            color: colors.accent,
            fontWeight: 700,
            fontSize: "13px",
            letterSpacing: "1.5px",
          }}
        >
          📦 CLASS TEMPLATES
        </motion.div>

        {/* 3D Box visualization */}
        <motion.div
          initial={{ opacity: 0, rotateY: -30, scale: 0.8 }}
          animate={{
            opacity: 1,
            rotateY: phase >= 1 ? 0 : -30,
            scale: 1,
          }}
          transition={{ type: "spring", stiffness: 100 }}
          style={{
            perspective: "1000px",
          }}
        >
          <div
            style={{
              width: "200px",
              height: "200px",
              background: `linear-gradient(145deg, ${colors.accent}30, ${colors.primary}20)`,
              border: `3px solid ${colors.accent}`,
              borderRadius: "24px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: `
                20px 20px 60px rgba(0,0,0,0.4),
                -5px -5px 20px rgba(255,255,255,0.05)
              `,
              position: "relative",
            }}
          >
            {/* Box lid effect */}
            <motion.div
              animate={{ y: phase >= 2 ? -20 : 0 }}
              style={{
                position: "absolute",
                top: "-10px",
                width: "180px",
                height: "30px",
                background: `linear-gradient(180deg, ${colors.accent}50, ${colors.accent}30)`,
                borderRadius: "12px 12px 0 0",
                border: `2px solid ${colors.accent}`,
              }}
            />

            <div
              style={{
                fontFamily: "'SF Mono', monospace",
                fontSize: "2.5rem",
                fontWeight: 800,
                color: colors.text,
              }}
            >
              Box
              <span style={{ color: colors.primary }}>{"<"}</span>
              <motion.span
                animate={{
                  color: [colors.primary, colors.accent, colors.primary],
                }}
                transition={{ duration: 2, repeat: Infinity }}
                style={{ fontWeight: 800 }}
              >
                T
              </motion.span>
              <span style={{ color: colors.primary }}>{">"}</span>
            </div>
          </div>
        </motion.div>

        {/* Label */}
        <AnimatePresence>
          {phase >= 2 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                padding: "14px 28px",
                borderRadius: "16px",
                background: "#1c1c1e",
                border: "1px solid rgba(255,255,255,0.1)",
                color: colors.text,
                fontSize: "15px",
              }}
            >
              A{" "}
              <span style={{ color: colors.accent, fontWeight: 600 }}>
                container
              </span>{" "}
              that can hold{" "}
              <span style={{ color: colors.primary, fontWeight: 600 }}>
                any type
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// ============================================
// SCENE 13: Box Specializations
// ============================================
const Scene13 = () => {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 600),
      setTimeout(() => setPhase(2), 1200),
      setTimeout(() => setPhase(3), 1800),
      setTimeout(() => setPhase(4), 2400),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  const boxes = [
    { type: "int", value: "42", color: colors.typeInt },
    { type: "float", value: "3.14", color: colors.typeFloat },
    { type: "string", value: '"Hello"', color: colors.typeString },
  ];

  return (
    <div style={containerStyle}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "2.5rem",
        }}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            color: colors.secondary,
            fontWeight: 700,
            fontSize: "13px",
            letterSpacing: "1.5px",
          }}
        >
          🎁 ONE BOX, MANY TYPES
        </motion.div>

        <div style={{ display: "flex", gap: "2rem" }}>
          {boxes.map((box, i) => (
            <motion.div
              key={box.type}
              initial={{ opacity: 0, scale: 0.5, y: 50 }}
              animate={{
                opacity: phase > i ? 1 : 0,
                scale: phase > i ? 1 : 0.5,
                y: 0,
              }}
              transition={{ type: "spring", stiffness: 150 }}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "1rem",
              }}
            >
              {/* Box container */}
              <motion.div
                animate={{
                  boxShadow: phase >= 4 ? `0 10px 30px ${box.color}40` : "none",
                }}
                style={{
                  width: "140px",
                  height: "140px",
                  background: `linear-gradient(145deg, ${box.color}20, ${box.color}05)`,
                  border: `2px solid ${box.color}`,
                  borderRadius: "20px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem",
                }}
              >
                {/* Type label */}
                <div
                  style={{
                    fontFamily: "'SF Mono', monospace",
                    fontSize: "14px",
                    color: box.color,
                    fontWeight: 600,
                  }}
                >
                  Box{"<"}
                  {box.type}
                  {">"}
                </div>

                {/* Value inside */}
                <AnimatePresence>
                  {phase >= 4 && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      style={{
                        padding: "8px 16px",
                        background: `${box.color}30`,
                        borderRadius: "8px",
                        fontFamily: "'SF Mono', monospace",
                        fontSize: "16px",
                        fontWeight: 700,
                        color: box.color,
                      }}
                    >
                      {box.value}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Description */}
        <AnimatePresence>
          {phase >= 4 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{
                color: colors.textSec,
                fontSize: "14px",
                fontStyle: "italic",
              }}
            >
              Same template, different types → Different classes!
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// ============================================
// SCENE 14: Compile-Time Polymorphism
// ============================================
const Scene14 = () => {
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
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "2.5rem",
        }}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            color: colors.primary,
            fontWeight: 700,
            fontSize: "13px",
            letterSpacing: "1.5px",
          }}
        >
          🔄 TWO TYPES OF POLYMORPHISM
        </motion.div>

        {/* Comparison table */}
        <div style={{ display: "flex", gap: "2rem" }}>
          {/* Runtime Polymorphism */}
          <GlassCard
            style={{ minWidth: "280px", opacity: phase >= 2 ? 0.5 : 1 }}
          >
            <div
              style={{
                color: colors.textSec,
                fontWeight: 700,
                fontSize: "14px",
                letterSpacing: "1px",
                marginBottom: "1.5rem",
                textAlign: "center",
              }}
            >
              RUNTIME POLYMORPHISM
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.75rem",
                alignItems: "center",
              }}
            >
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                style={{
                  padding: "10px 20px",
                  borderRadius: "12px",
                  background: "rgba(255,255,255,0.05)",
                  fontFamily: "'SF Mono', monospace",
                  fontSize: "14px",
                  color: colors.text,
                }}
              >
                virtual functions
              </motion.div>
              <div style={{ color: colors.textSec, fontSize: "13px" }}>
                Decided at runtime
              </div>
              <div style={{ color: colors.textSec, fontSize: "12px" }}>
                (vtable lookup)
              </div>
            </div>
          </GlassCard>

          {/* Compile-Time Polymorphism */}
          <motion.div
            animate={{
              scale: phase >= 2 ? 1.05 : 1,
            }}
          >
            <GlassCard glow={colors.success} style={{ minWidth: "280px" }}>
              <div
                style={{
                  color: colors.success,
                  fontWeight: 700,
                  fontSize: "14px",
                  letterSpacing: "1px",
                  marginBottom: "1.5rem",
                  textAlign: "center",
                }}
              >
                COMPILE-TIME POLYMORPHISM
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.75rem",
                  alignItems: "center",
                }}
              >
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  style={{
                    padding: "10px 20px",
                    borderRadius: "12px",
                    background: `${colors.success}15`,
                    fontFamily: "'SF Mono', monospace",
                    fontSize: "14px",
                    color: colors.success,
                    fontWeight: 600,
                  }}
                >
                  templates
                </motion.div>
                <div style={{ color: colors.text, fontSize: "13px" }}>
                  Decided at compile time
                </div>
                <div
                  style={{
                    color: colors.success,
                    fontSize: "12px",
                    fontWeight: 600,
                  }}
                >
                  (zero overhead) ⚡
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </div>

        {/* Highlight */}
        <AnimatePresence>
          {phase >= 2 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                padding: "12px 24px",
                borderRadius: "100px",
                background: `${colors.success}15`,
                border: `1px solid ${colors.success}40`,
                color: colors.success,
                fontWeight: 600,
              }}
            >
              Templates = Compile-Time Magic ✨
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// ============================================
// SCENE 15: General Printer Template
// ============================================
const Scene15 = () => {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setPhase(1), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div style={containerStyle}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "2.5rem",
        }}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            color: colors.textSec,
            fontWeight: 700,
            fontSize: "13px",
            letterSpacing: "1.5px",
          }}
        >
          🖨️ GENERAL TEMPLATE
        </motion.div>

        {/* Printer block */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{
            width: "300px",
            height: "180px",
            background: "linear-gradient(145deg, #3a3a3c, #2c2c2e)",
            border: "2px solid rgba(255,255,255,0.15)",
            borderRadius: "24px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "1rem",
            boxShadow: "0 20px 50px rgba(0,0,0,0.3)",
          }}
        >
          <div
            style={{
              fontFamily: "'SF Mono', monospace",
              fontSize: "2rem",
              fontWeight: 700,
              color: colors.text,
            }}
          >
            Printer
            <span style={{ color: colors.textSec }}>{"<"}</span>
            <span style={{ color: colors.primary }}>T</span>
            <span style={{ color: colors.textSec }}>{">"}</span>
          </div>

          <AnimatePresence>
            {phase >= 1 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  padding: "8px 20px",
                  borderRadius: "100px",
                  background: "rgba(255,255,255,0.08)",
                  color: colors.textSec,
                  fontSize: "13px",
                }}
              >
                Works for any type
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Neutral label */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          style={{
            color: colors.textSec,
            fontSize: "14px",
            fontStyle: "italic",
          }}
        >
          A neutral, general-purpose template
        </motion.div>
      </div>
    </div>
  );
};

// ============================================
// SCENE 16: Specialization for char*
// ============================================
const Scene16 = () => {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 800),
      setTimeout(() => setPhase(2), 1800),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div style={containerStyle}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "2.5rem",
        }}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            color: colors.secondary,
            fontWeight: 700,
            fontSize: "13px",
            letterSpacing: "1.5px",
          }}
        >
          ⭐ FULL SPECIALIZATION
        </motion.div>

        {/* Specialized Printer block */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{
            opacity: 1,
            scale: 1,
            boxShadow:
              phase >= 1
                ? `0 20px 60px ${colors.secondary}40`
                : "0 20px 50px rgba(0,0,0,0.3)",
          }}
          style={{
            width: "320px",
            height: "180px",
            background:
              phase >= 1
                ? `linear-gradient(145deg, ${colors.secondary}20, ${colors.secondary}05)`
                : "linear-gradient(145deg, #3a3a3c, #2c2c2e)",
            border: `3px solid ${phase >= 1 ? colors.secondary : "rgba(255,255,255,0.15)"}`,
            borderRadius: "24px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "1rem",
          }}
        >
          <div
            style={{
              fontFamily: "'SF Mono', monospace",
              fontSize: "2rem",
              fontWeight: 700,
              color: phase >= 1 ? colors.secondary : colors.text,
            }}
          >
            Printer
            <span style={{ color: colors.textSec }}>{"<"}</span>
            <motion.span
              animate={{
                color: phase >= 1 ? colors.secondary : colors.primary,
              }}
              style={{ fontWeight: 800 }}
            >
              char*
            </motion.span>
            <span style={{ color: colors.textSec }}>{">"}</span>
          </div>
        </motion.div>

        {/* Badge */}
        <AnimatePresence>
          {phase >= 2 && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              style={{
                padding: "14px 28px",
                borderRadius: "100px",
                background: `linear-gradient(135deg, ${colors.secondary}, ${colors.warning})`,
                color: "#000",
                fontWeight: 700,
                fontSize: "15px",
                boxShadow: `0 10px 30px ${colors.secondary}50`,
              }}
            >
              ⭐ Special Case for Strings!
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// ============================================
// SCENE 17: Partial Specialization
// ============================================
const Scene17 = () => {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 800),
      setTimeout(() => setPhase(2), 1800),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div style={containerStyle}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "2.5rem",
        }}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            color: colors.accent,
            fontWeight: 700,
            fontSize: "13px",
            letterSpacing: "1.5px",
          }}
        >
          🔧 PARTIAL SPECIALIZATION
        </motion.div>

        <div style={{ display: "flex", gap: "2rem", alignItems: "center" }}>
          {/* General Pair */}
          <GlassCard style={{ opacity: phase >= 2 ? 0.5 : 1 }}>
            <div
              style={{
                fontFamily: "'SF Mono', monospace",
                fontSize: "18px",
                color: colors.text,
                textAlign: "center",
              }}
            >
              Pair
              <span style={{ color: colors.textSec }}>{"<"}</span>
              <span style={{ color: colors.primary }}>T</span>
              <span style={{ color: colors.textSec }}>, </span>
              <span style={{ color: colors.typeU }}>U</span>
              <span style={{ color: colors.textSec }}>{">"}</span>
            </div>
            <div
              style={{
                color: colors.textSec,
                fontSize: "12px",
                marginTop: "8px",
                textAlign: "center",
              }}
            >
              General template
            </div>
          </GlassCard>

          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
            style={{ fontSize: "1.5rem", color: colors.textSec }}
          >
            →
          </motion.div>

          {/* Partially Specialized */}
          <motion.div animate={{ scale: phase >= 2 ? 1.05 : 1 }}>
            <GlassCard glow={colors.accent}>
              <div
                style={{
                  fontFamily: "'SF Mono', monospace",
                  fontSize: "18px",
                  color: colors.text,
                  textAlign: "center",
                }}
              >
                Pair
                <span style={{ color: colors.textSec }}>{"<"}</span>
                <span style={{ color: colors.primary }}>T</span>
                <span style={{ color: colors.textSec }}>, </span>
                <motion.span
                  animate={{
                    color: phase >= 1 ? colors.typeInt : colors.typeU,
                    textShadow:
                      phase >= 1 ? `0 0 15px ${colors.typeInt}` : "none",
                  }}
                  style={{ fontWeight: 700 }}
                >
                  int
                </motion.span>
                <span style={{ color: colors.textSec }}>{">"}</span>
              </div>
              <div
                style={{
                  color: colors.accent,
                  fontSize: "12px",
                  marginTop: "8px",
                  textAlign: "center",
                  fontWeight: 600,
                }}
              >
                Second type fixed!
              </div>
            </GlassCard>
          </motion.div>
        </div>

        {/* Explanation */}
        <AnimatePresence>
          {phase >= 2 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{
                padding: "12px 24px",
                borderRadius: "16px",
                background: "#1c1c1e",
                color: colors.text,
                fontSize: "14px",
              }}
            >
              <span style={{ color: colors.typeInt, fontWeight: 600 }}>
                int
              </span>{" "}
              snaps into second slot!
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// ============================================
// SCENE 18: Non-Type Template Parameter
// ============================================
const Scene18 = () => {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 800),
      setTimeout(() => setPhase(2), 2000),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div style={containerStyle}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "2.5rem",
        }}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            color: colors.warning,
            fontWeight: 700,
            fontSize: "13px",
            letterSpacing: "1.5px",
          }}
        >
          🔢 NON-TYPE TEMPLATE PARAMETER
        </motion.div>

        {/* Code */}
        <GlassCard>
          <div
            style={{
              fontFamily: "'SF Mono', monospace",
              fontSize: "18px",
              color: colors.text,
            }}
          >
            <span style={{ color: colors.secondary }}>template</span>
            <span style={{ color: colors.textSec }}>{"<"}</span>
            <span style={{ color: colors.typeInt }}>int </span>
            <span style={{ color: colors.warning, fontWeight: 700 }}>N</span>
            <span style={{ color: colors.textSec }}>{">"}</span>
          </div>
        </GlassCard>

        {/* Array visualizations */}
        <div style={{ display: "flex", gap: "3rem" }}>
          {/* Array<10> */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: phase >= 1 ? 1 : 0, y: 0 }}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "1rem",
            }}
          >
            <div
              style={{
                fontFamily: "'SF Mono', monospace",
                fontSize: "16px",
                color: colors.typeInt,
                fontWeight: 600,
              }}
            >
              Array{"<"}10{">"}
            </div>
            <div style={{ display: "flex", gap: "4px" }}>
              {[...Array(10)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  style={{
                    width: "20px",
                    height: "30px",
                    background: `${colors.typeInt}30`,
                    border: `1px solid ${colors.typeInt}`,
                    borderRadius: "4px",
                  }}
                />
              ))}
            </div>
          </motion.div>

          {/* Array<100> - abridged */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: phase >= 2 ? 1 : 0, y: 0 }}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "1rem",
            }}
          >
            <div
              style={{
                fontFamily: "'SF Mono', monospace",
                fontSize: "16px",
                color: colors.warning,
                fontWeight: 600,
              }}
            >
              Array{"<"}100{">"}
            </div>
            <div style={{ display: "flex", gap: "4px", alignItems: "center" }}>
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  style={{
                    width: "12px",
                    height: "20px",
                    background: `${colors.warning}30`,
                    border: `1px solid ${colors.warning}`,
                    borderRadius: "2px",
                  }}
                />
              ))}
              <span style={{ color: colors.textSec, fontSize: "12px" }}>
                ...
              </span>
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i + 5}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: (i + 5) * 0.05 }}
                  style={{
                    width: "12px",
                    height: "20px",
                    background: `${colors.warning}30`,
                    border: `1px solid ${colors.warning}`,
                    borderRadius: "2px",
                  }}
                />
              ))}
            </div>
            <span style={{ color: colors.textSec, fontSize: "11px" }}>
              (100 blocks)
            </span>
          </motion.div>
        </div>

        {/* Note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          style={{
            color: colors.textSec,
            fontSize: "14px",
            fontStyle: "italic",
          }}
        >
          Size is part of the type, known at compile time!
        </motion.div>
      </div>
    </div>
  );
};

// ============================================
// EXPORTS
// ============================================
export const AnimationStepsPart2 = [
  {
    title: "Multiple Type Templates",
    component: Scene10,
    contentText:
      "Multiple Type Parameters: template<typename T, typename U> allows two different types. Example: template<typename T, typename U> T convert(U value) { return static_cast<T>(value); }",
  },
  {
    title: "Mixed Type Example",
    component: Scene11,
    contentText:
      "Mixed Type Template Example: template<typename T, typename U> auto add(T a, U b) -> decltype(a + b) { return a + b; } Can add int + double, returning appropriate type using auto and decltype.",
  },
  {
    title: "Class Template Box<T>",
    component: Scene12,
    contentText:
      "Class Templates: template<typename T> class Box { T value; public: void set(T v); T get(); }; Creates a generic container. Use as Box<int>, Box<string>, Box<double>.",
  },
  {
    title: "Box Specializations",
    component: Scene13,
    contentText:
      "Class Template Instantiation: Box<int> creates integer box, Box<string> creates string box, Box<double> creates double box. Each instantiation is a separate class with the type parameter replaced.",
  },
  {
    title: "Compile-Time Polymorphism",
    component: Scene14,
    contentText:
      "Compile-Time Polymorphism: Templates provide polymorphism resolved at compile time. Different from runtime polymorphism (virtual functions). No overhead, type-safe, catches errors at compile time.",
  },
  {
    title: "General Printer Template",
    component: Scene15,
    contentText:
      "Template Specialization - General Template: template<typename T> class Printer { void print(T val) { cout << val; } }; This is the primary/general template that works for most types.",
  },
  {
    title: "Specialization for char*",
    component: Scene16,
    contentText:
      'Full Specialization: template<> class Printer<char*> { void print(char* val) { cout << "String: " << val; } }; Provides special behavior for char* type. template<> with specific type.',
  },
  {
    title: "Partial Specialization",
    component: Scene17,
    contentText:
      "Partial Specialization: template<typename T> class Printer<T*> { }; Specializes for ALL pointer types. Still has template parameter but restricts to pointers. Works for int*, double*, etc.",
  },
  {
    title: "Non-Type Parameter",
    component: Scene18,
    contentText:
      "Non-Type Template Parameters: template<typename T, int SIZE> class Array { T data[SIZE]; }; SIZE is a compile-time constant, not a type. Use as Array<int, 10>, Array<double, 100>.",
  },
];

export default { AnimationStepsPart2 };
