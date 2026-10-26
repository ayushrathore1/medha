/**
 * TemplatesOneShotPart1 - Scenes 1-9
 * OOPS Unit 5: Templates in C++ - One Shot Lecture
 * Covers: Title, Problem, Placeholder, Syntax, Blueprint, Instantiation, Compile Time, Explicit Call, Multiple Types
 */
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { colors, containerStyle } from "./TemplatesUnit5Theme";

// ============================================
// SHARED COMPONENTS
// ============================================

export const GlassCard = ({ children, style = {}, glow = null }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    style={{
      background: "rgba(28, 28, 30, 0.65)",
      backdropFilter: "blur(25px) saturate(180%)",
      WebkitBackdropFilter: "blur(25px) saturate(180%)",
      border: `1px solid ${glow ? `${glow}40` : "rgba(255, 255, 255, 0.12)"}`,
      borderRadius: "24px",
      padding: "2rem",
      boxShadow: glow
        ? `0 8px 32px ${glow}30`
        : "0 8px 32px rgba(0, 0, 0, 0.4)",
      ...style,
    }}
  >
    {children}
  </motion.div>
);

export const CodeBlock = ({
  code,
  highlight = [],
  typing = false,
  delay = 0,
}) => {
  const [displayed, setDisplayed] = useState(typing ? "" : code);

  useEffect(() => {
    if (typing) {
      setDisplayed("");
      let i = 0;
      const timeout = setTimeout(() => {
        const interval = setInterval(() => {
          if (i <= code.length) {
            setDisplayed(code.slice(0, i));
            i++;
          } else {
            clearInterval(interval);
          }
        }, 30);
        return () => clearInterval(interval);
      }, delay);
      return () => clearTimeout(timeout);
    }
  }, [code, typing, delay]);

  return (
    <motion.pre
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{
        fontFamily: "'SF Mono', 'Menlo', 'Monaco', 'Courier New', monospace",
        fontSize: "15px",
        lineHeight: 1.7,
        color: colors.text,
        margin: 0,
        whiteSpace: "pre-wrap",
        fontWeight: 500,
      }}
    >
      {displayed}
      {typing && displayed.length < code.length && (
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.8, repeat: Infinity }}
          style={{ color: colors.primary }}
        >
          ▋
        </motion.span>
      )}
    </motion.pre>
  );
};

// Floating type labels for background
const FloatingTypes = () => {
  const types = ["int", "float", "double", "char", "string", "T"];

  return (
    <>
      {types.map((type, i) => (
        <motion.div
          key={type}
          initial={{ opacity: 0, y: 50 }}
          animate={{
            opacity: [0.1, 0.3, 0.1],
            y: [-10, 10, -10],
            x: [0, 10, 0],
          }}
          transition={{
            duration: 4 + i * 0.5,
            repeat: Infinity,
            delay: i * 0.3,
          }}
          style={{
            position: "absolute",
            left: `${10 + i * 15}%`,
            top: `${20 + (i % 3) * 25}%`,
            color: colors.textMuted,
            fontSize: "1.5rem",
            fontFamily: "'SF Mono', monospace",
            fontWeight: 600,
            opacity: 0.2,
            zIndex: 0,
          }}
        >
          {type}
        </motion.div>
      ))}
    </>
  );
};

// ============================================
// SCENE 1: Title & Setup
// ============================================
const Scene1 = () => {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 500),
      setTimeout(() => setPhase(2), 1500),
      setTimeout(() => setPhase(3), 2500),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div style={containerStyle}>
      {/* Background glow */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at center, rgba(10, 132, 255, 0.15) 0%, transparent 70%)",
        }}
      />

      {/* Floating type labels */}
      {phase >= 3 && <FloatingTypes />}

      {/* Main content */}
      <motion.div style={{ textAlign: "center", zIndex: 10 }}>
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: phase >= 1 ? 1 : 0, y: 0 }}
          style={{
            display: "inline-block",
            padding: "8px 20px",
            borderRadius: "100px",
            background: "rgba(255,255,255,0.08)",
            marginBottom: "1.5rem",
            color: colors.textSec,
            fontSize: "13px",
            fontWeight: 600,
            letterSpacing: "1.5px",
          }}
        >
          RTU OOP UNIT 5
        </motion.div>

        {/* Title - Letter by letter typing */}
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            fontSize: "4.5rem",
            fontWeight: 700,
            letterSpacing: "-0.03em",
            background: "linear-gradient(180deg, #FFFFFF 0%, #A1A1A6 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            margin: 0,
          }}
        >
          {"Templates in C++".split("").map((char, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: phase >= 1 ? 1 : 0 }}
              transition={{ delay: 0.05 * i }}
            >
              {char}
            </motion.span>
          ))}
        </motion.h1>

        {/* Subtitle */}
        <AnimatePresence>
          {phase >= 2 && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              style={{
                color: colors.primary,
                fontSize: "1.5rem",
                marginTop: "1.2rem",
                fontWeight: 500,
              }}
            >
              Write Once, Use for Many Types
            </motion.p>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

// ============================================
// SCENE 2: The Problem - Code Duplication
// ============================================
const Scene2 = () => {
  const [visibleCount, setVisibleCount] = useState(0);
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisibleCount((c) => {
        if (c < 3) return c + 1;
        return c;
      });
    }, 700);

    const warningTimer = setTimeout(() => setShowWarning(true), 2800);

    return () => {
      clearInterval(interval);
      clearTimeout(warningTimer);
    };
  }, []);

  const functions = [
    { type: "int", color: colors.typeInt },
    { type: "float", color: colors.typeFloat },
    { type: "double", color: colors.typeDouble },
  ];

  return (
    <div style={containerStyle}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "2rem",
        }}
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            color: colors.danger,
            fontWeight: 700,
            fontSize: "13px",
            letterSpacing: "1.5px",
          }}
        >
          ⚠️ THE PROBLEM: CODE DUPLICATION
        </motion.div>

        {/* Stacking function cards */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "0.75rem",
            position: "relative",
          }}
        >
          {functions.slice(0, visibleCount).map((fn, i) => (
            <motion.div
              key={fn.type}
              initial={{ opacity: 0, x: -50 }}
              animate={{
                opacity: 1,
                x: 0,
                y: showWarning ? i * -5 : 0,
              }}
              transition={{ duration: 0.5 }}
              style={{ position: "relative", zIndex: 3 - i }}
            >
              <GlassCard
                glow={showWarning ? colors.danger : null}
                style={{
                  padding: "1rem 1.5rem",
                }}
              >
                <div
                  style={{
                    fontFamily: "'SF Mono', monospace",
                    fontSize: "15px",
                    color: colors.text,
                  }}
                >
                  <span style={{ color: fn.color }}>{fn.type}</span>
                  <span style={{ color: colors.text }}> add(</span>
                  <span style={{ color: fn.color }}>{fn.type}</span>
                  <span style={{ color: colors.text }}> a, </span>
                  <span style={{ color: fn.color }}>{fn.type}</span>
                  <span style={{ color: colors.text }}> b) {"{"} </span>
                  <span style={{ color: colors.keyword }}>return</span>
                  <span style={{ color: colors.text }}> a + b; {"}"}</span>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        {/* Warning message */}
        <AnimatePresence>
          {showWarning && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{
                color: colors.danger,
                background: "rgba(255, 69, 58, 0.12)",
                padding: "14px 28px",
                borderRadius: "100px",
                fontWeight: 600,
                fontSize: "14px",
                border: `1px solid ${colors.danger}40`,
              }}
            >
              📚 Screen becomes crowded with repetitive code!
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// ============================================
// SCENE 3: Zoom Into Logic
// ============================================
const Scene3 = () => {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 600),
      setTimeout(() => setPhase(2), 1500),
      setTimeout(() => setPhase(3), 2500),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  const functions = [
    { type: "int", color: colors.typeInt },
    { type: "float", color: colors.typeFloat },
    { type: "double", color: colors.typeDouble },
  ];

  return (
    <div style={containerStyle}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "2rem",
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
          🔍 SPOT THE PATTERN
        </motion.div>

        {/* Aligned functions */}
        <div
          style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
        >
          {functions.map((fn, i) => (
            <motion.div
              key={fn.type}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2 }}
              style={{
                fontFamily: "'SF Mono', monospace",
                fontSize: "16px",
                color: colors.text,
                padding: "0.75rem 1.5rem",
                background: "rgba(28, 28, 30, 0.65)",
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              {/* Type part - highlights differently */}
              <motion.span
                animate={{
                  color: phase >= 1 ? fn.color : colors.text,
                  textShadow: phase >= 2 ? `0 0 10px ${fn.color}` : "none",
                }}
                style={{ fontWeight: 600 }}
              >
                {fn.type}
              </motion.span>
              <span> add(</span>
              <motion.span
                animate={{
                  color: phase >= 1 ? fn.color : colors.text,
                }}
              >
                {fn.type}
              </motion.span>
              <span>, </span>
              <motion.span
                animate={{
                  color: phase >= 1 ? fn.color : colors.text,
                }}
              >
                {fn.type}
              </motion.span>
              <span>) {"{"} </span>
              {/* Logic part - stays same color */}
              <motion.span
                animate={{
                  color: phase >= 2 ? colors.success : colors.text,
                  textShadow:
                    phase >= 3 ? `0 0 15px ${colors.success}` : "none",
                }}
                style={{ fontWeight: 600 }}
              >
                a + b
              </motion.span>
              <span> {"}"}</span>
            </motion.div>
          ))}
        </div>

        {/* Insight */}
        <AnimatePresence>
          {phase >= 3 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                display: "flex",
                gap: "2rem",
                marginTop: "1rem",
              }}
            >
              <div
                style={{
                  padding: "12px 24px",
                  borderRadius: "16px",
                  background: `${colors.typeInt}20`,
                  border: `1px solid ${colors.typeInt}40`,
                  color: colors.typeInt,
                  fontWeight: 600,
                }}
              >
                Types change ↔
              </div>
              <div
                style={{
                  padding: "12px 24px",
                  borderRadius: "16px",
                  background: `${colors.success}20`,
                  border: `1px solid ${colors.success}40`,
                  color: colors.success,
                  fontWeight: 600,
                }}
              >
                Logic stays same ✓
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// ============================================
// SCENE 4: The Idea of Placeholder
// ============================================
const Scene4 = () => {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 800),
      setTimeout(() => setPhase(2), 1800),
      setTimeout(() => setPhase(3), 2800),
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
            color: colors.success,
            fontWeight: 700,
            fontSize: "13px",
            letterSpacing: "1.5px",
          }}
        >
          💡 THE IDEA: USE A PLACEHOLDER
        </motion.div>

        {/* T Badge - Glowing box */}
        <AnimatePresence>
          {phase >= 1 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              style={{
                background: `linear-gradient(135deg, ${colors.primary}, ${colors.accent})`,
                padding: "20px 40px",
                borderRadius: "16px",
                color: "white",
                fontWeight: 800,
                fontSize: "2.5rem",
                fontFamily: "'SF Mono', monospace",
                boxShadow: `0 15px 40px ${colors.primary}50`,
              }}
            >
              T
            </motion.div>
          )}
        </AnimatePresence>

        {/* Code block with T */}
        <motion.div
          animate={{
            opacity: phase >= 2 ? 0.85 : 1,
            filter: phase >= 3 ? "blur(0px)" : "blur(0px)",
          }}
        >
          <GlassCard glow={phase >= 2 ? colors.success : null}>
            <div
              style={{
                fontFamily: "'SF Mono', monospace",
                fontSize: "18px",
                color: colors.text,
              }}
            >
              <motion.span
                animate={{
                  color: phase >= 1 ? colors.primary : colors.text,
                  textShadow:
                    phase >= 2 ? `0 0 15px ${colors.primary}` : "none",
                }}
                style={{ fontWeight: 700 }}
              >
                T
              </motion.span>
              <span> add(</span>
              <motion.span
                animate={{ color: phase >= 1 ? colors.primary : colors.text }}
              >
                T
              </motion.span>
              <span> a, </span>
              <motion.span
                animate={{ color: phase >= 1 ? colors.primary : colors.text }}
              >
                T
              </motion.span>
              <span> b) {"{"} </span>
              <span style={{ color: colors.keyword }}>return</span>
              <span> a + b; {"}"}</span>
            </div>
          </GlassCard>
        </motion.div>

        {/* Label */}
        <AnimatePresence>
          {phase >= 2 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                background: "#1c1c1e",
                padding: "14px 28px",
                borderRadius: "16px",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              <span
                style={{
                  fontSize: "28px",
                  color: colors.primary,
                  fontWeight: 700,
                  fontFamily: "'SF Mono', monospace",
                }}
              >
                T
              </span>
              <span style={{ color: colors.textSec, fontSize: "20px" }}>=</span>
              <span
                style={{
                  color: colors.text,
                  fontWeight: 500,
                  fontSize: "18px",
                }}
              >
                Some Type (Blank)
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// ============================================
// SCENE 5: Template Syntax Appears
// ============================================
const Scene5 = () => {
  const [highlights, setHighlights] = useState([]);

  useEffect(() => {
    const timers = [
      setTimeout(() => setHighlights(["template"]), 600),
      setTimeout(() => setHighlights(["template", "typename"]), 1400),
      setTimeout(() => setHighlights(["template", "typename", "T"]), 2200),
      setTimeout(
        () => setHighlights(["template", "typename", "T", "all"]),
        3000
      ),
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
          📝 TEMPLATE SYNTAX
        </motion.div>

        <GlassCard>
          <div
            style={{
              fontFamily: "'SF Mono', monospace",
              fontSize: "20px",
              lineHeight: 2.2,
            }}
          >
            {/* First line: template<typename T> */}
            <motion.span
              animate={{
                color: highlights.includes("template")
                  ? colors.secondary
                  : colors.text,
                textShadow: highlights.includes("template")
                  ? `0 0 20px ${colors.secondary}`
                  : "none",
              }}
              style={{ fontWeight: 600 }}
            >
              template
            </motion.span>
            <span style={{ color: colors.textSec }}> {"<"}</span>
            <motion.span
              animate={{
                color: highlights.includes("typename")
                  ? colors.accent
                  : colors.text,
                scale: highlights.includes("typename") ? 1.05 : 1,
              }}
              style={{ fontWeight: 600 }}
            >
              typename
            </motion.span>
            <span> </span>
            <motion.span
              animate={{
                color: highlights.includes("T") ? colors.primary : colors.text,
                textShadow: highlights.includes("T")
                  ? `0 0 15px ${colors.primary}`
                  : "none",
              }}
              style={{ fontWeight: 700 }}
            >
              T
            </motion.span>
            <span style={{ color: colors.textSec }}>{">"}</span>
            <br />

            {/* Second line: T add(T a, T b) */}
            <motion.span
              animate={{
                color: highlights.includes("T") ? colors.primary : colors.text,
              }}
              style={{ fontWeight: 600 }}
            >
              T
            </motion.span>
            <span style={{ color: colors.text }}> add(</span>
            <motion.span
              animate={{
                color: highlights.includes("T") ? colors.primary : colors.text,
              }}
            >
              T
            </motion.span>
            <span style={{ color: colors.text }}> a, </span>
            <motion.span
              animate={{
                color: highlights.includes("T") ? colors.primary : colors.text,
              }}
            >
              T
            </motion.span>
            <span style={{ color: colors.text }}> b)</span>
          </div>
        </GlassCard>

        {/* Legend */}
        <div
          style={{
            display: "flex",
            gap: "1rem",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          {[
            { word: "template", desc: "Keyword", color: colors.secondary },
            { word: "<typename T>", desc: "Parameter", color: colors.accent },
            { word: "T", desc: "Placeholder", color: colors.primary },
          ].map((item, i) => (
            <motion.div
              key={item.word}
              initial={{ opacity: 0, y: 20 }}
              animate={{
                opacity: highlights.length > i ? 1 : 0.3,
                y: 0,
              }}
              transition={{ delay: 0.3 + i * 0.2 }}
              style={{
                padding: "12px 20px",
                borderRadius: "16px",
                background: "#1c1c1e",
                border: `1px solid ${item.color}30`,
                textAlign: "center",
              }}
            >
              <div
                style={{
                  color: item.color,
                  fontFamily: "'SF Mono', monospace",
                  fontWeight: 600,
                  fontSize: "14px",
                }}
              >
                {item.word}
              </div>
              <div
                style={{
                  color: colors.textSec,
                  fontSize: "11px",
                  marginTop: "4px",
                }}
              >
                {item.desc}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ============================================
// SCENE 6: Blueprint Concept
// ============================================
const Scene6 = () => {
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
          gap: "2rem",
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
          📐 NOT A REAL FUNCTION YET
        </motion.div>

        {/* Blueprint-style code */}
        <motion.div
          animate={{
            filter:
              phase >= 1
                ? "drop-shadow(0 0 20px rgba(191, 90, 242, 0.3))"
                : "none",
          }}
        >
          <GlassCard
            style={{
              background:
                phase >= 1
                  ? "repeating-linear-gradient(0deg, rgba(191, 90, 242, 0.05), rgba(191, 90, 242, 0.05) 1px, transparent 1px, transparent 20px), repeating-linear-gradient(90deg, rgba(191, 90, 242, 0.05), rgba(191, 90, 242, 0.05) 1px, transparent 1px, transparent 20px), rgba(28, 28, 30, 0.65)"
                  : "rgba(28, 28, 30, 0.65)",
              borderColor:
                phase >= 1 ? `${colors.accent}50` : "rgba(255,255,255,0.12)",
              borderStyle: phase >= 1 ? "dashed" : "solid",
              borderWidth: "2px",
            }}
          >
            <motion.div
              animate={{
                opacity: phase >= 1 ? 0.7 : 1,
              }}
              style={{
                fontFamily: "'SF Mono', monospace",
                fontSize: "18px",
                color: colors.text,
              }}
            >
              <span style={{ color: colors.secondary }}>template</span>
              <span style={{ color: colors.textSec }}>{" <"}</span>
              <span style={{ color: colors.accent }}>typename</span>
              <span style={{ color: colors.primary }}> T</span>
              <span style={{ color: colors.textSec }}>{">"}</span>
              <br />
              <span style={{ color: colors.primary }}>T</span>
              <span> add(</span>
              <span style={{ color: colors.primary }}>T</span>
              <span> a, </span>
              <span style={{ color: colors.primary }}>T</span>
              <span> b)</span>
            </motion.div>
          </GlassCard>
        </motion.div>

        {/* Labels */}
        <AnimatePresence>
          {phase >= 2 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                display: "flex",
                gap: "1rem",
              }}
            >
              <div
                style={{
                  padding: "14px 28px",
                  borderRadius: "100px",
                  background: `${colors.accent}15`,
                  border: `1px solid ${colors.accent}40`,
                  color: colors.accent,
                  fontWeight: 600,
                  fontSize: "15px",
                }}
              >
                📋 Pattern
              </div>
              <div
                style={{
                  padding: "14px 28px",
                  borderRadius: "100px",
                  background: `${colors.secondary}15`,
                  border: `1px solid ${colors.secondary}40`,
                  color: colors.secondary,
                  fontWeight: 600,
                  fontSize: "15px",
                }}
              >
                🍳 Recipe
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// ============================================
// SCENE 7: Compiler Creates Real Functions
// ============================================
const Scene7 = () => {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPhase((p) => (p < 4 ? p + 1 : p));
    }, 900);
    return () => clearInterval(interval);
  }, []);

  const types = [
    { type: "int", color: colors.typeInt },
    { type: "float", color: colors.typeFloat },
    { type: "double", color: colors.typeDouble },
  ];

  return (
    <div style={containerStyle}>
      <div style={{ display: "flex", alignItems: "center", gap: "3rem" }}>
        {/* Template Source */}
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              color: colors.textSec,
              fontSize: "11px",
              fontWeight: 600,
              letterSpacing: "1.5px",
              marginBottom: "12px",
            }}
          >
            TEMPLATE
          </div>
          <GlassCard style={{ minWidth: "200px" }}>
            <div
              style={{
                fontFamily: "'SF Mono', monospace",
                fontSize: "14px",
                color: colors.text,
              }}
            >
              <div style={{ color: colors.secondary }}>
                template{"<"}typename T{">"}
              </div>
              <div>
                <span style={{ color: colors.primary }}>T</span> add(
                <span style={{ color: colors.primary }}>T</span> a,{" "}
                <span style={{ color: colors.primary }}>T</span> b)
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Compiler Box */}
        <motion.div
          animate={{
            borderColor: phase > 0 ? colors.primary : "rgba(255,255,255,0.1)",
            boxShadow: phase > 0 ? `0 0 50px ${colors.primary}40` : "none",
          }}
          style={{
            width: "120px",
            height: "120px",
            borderRadius: "28px",
            background: "linear-gradient(135deg, #2c2c2e, #1c1c1e)",
            border: "3px solid rgba(255,255,255,0.1)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <motion.div
            animate={{ rotate: phase > 0 ? 360 * phase : 0 }}
            transition={{ duration: 0.8 }}
            style={{ fontSize: "2.5rem" }}
          >
            ⚡️
          </motion.div>
          <div
            style={{
              fontSize: "10px",
              color: colors.textSec,
              marginTop: "8px",
              fontWeight: 700,
              letterSpacing: "1px",
            }}
          >
            COMPILER
          </div>
        </motion.div>

        {/* Generated Functions */}
        <div
          style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}
        >
          <div
            style={{
              color: colors.textSec,
              fontSize: "11px",
              fontWeight: 600,
              letterSpacing: "1.5px",
              marginBottom: "4px",
            }}
          >
            GENERATED
          </div>
          {types.map(
            (t, i) =>
              phase > i && (
                <motion.div
                  key={t.type}
                  initial={{ opacity: 0, x: 30, scale: 0.8 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  transition={{ type: "spring", stiffness: 200 }}
                  style={{
                    fontFamily: "'SF Mono', monospace",
                    color: t.color,
                    background: "#1c1c1e",
                    padding: "12px 18px",
                    borderRadius: "14px",
                    border: `2px solid ${t.color}40`,
                    fontSize: "14px",
                    fontWeight: 600,
                    boxShadow: `0 4px 15px ${t.color}20`,
                  }}
                >
                  {t.type} add({t.type}, {t.type}) ✓
                </motion.div>
              )
          )}
        </div>
      </div>
    </div>
  );
};

// ============================================
// SCENE 8: Compile Time vs Run Time
// ============================================
const Scene8 = () => {
  const [showBadge, setShowBadge] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowBadge(true), 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div style={containerStyle}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "2rem",
        }}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            color: colors.success,
            fontWeight: 700,
            fontSize: "13px",
            letterSpacing: "1.5px",
          }}
        >
          ⏱️ HAPPENS BEFORE PROGRAM RUNS
        </motion.div>

        <div style={{ display: "flex", gap: "2rem" }}>
          {/* Compile Time */}
          <GlassCard glow={colors.success} style={{ minWidth: "300px" }}>
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
              ⚙️ COMPILE TIME
            </div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.75rem",
              }}
            >
              {["Template parsing", "Type substitution", "Code generation"].map(
                (item, i) => (
                  <motion.div
                    key={item}
                    initial={{ x: -30, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.8 + i * 0.3 }}
                    style={{
                      color: colors.text,
                      fontSize: "14px",
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      padding: "8px 12px",
                      background: "rgba(48, 209, 88, 0.1)",
                      borderRadius: "8px",
                    }}
                  >
                    <span style={{ color: colors.success }}>✓</span> {item}
                  </motion.div>
                )
              )}
            </motion.div>
          </GlassCard>

          {/* Run Time */}
          <GlassCard style={{ minWidth: "300px", opacity: 0.5 }}>
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
              🏃 RUN TIME
            </div>
            <div
              style={{
                color: colors.textSec,
                fontSize: "14px",
                textAlign: "center",
                padding: "2rem 0",
              }}
            >
              <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>😴</div>
              No template overhead here
              <br />
              <span style={{ fontSize: "12px", opacity: 0.7 }}>
                Just direct function calls
              </span>
            </div>
          </GlassCard>
        </div>

        {/* Badge */}
        <AnimatePresence>
          {showBadge && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              style={{
                background: `linear-gradient(135deg, ${colors.success}, #28a745)`,
                padding: "16px 32px",
                borderRadius: "100px",
                color: "white",
                fontWeight: 700,
                fontSize: "16px",
                boxShadow: `0 10px 40px ${colors.success}50`,
              }}
            >
              🚀 Zero Runtime Overhead
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// ============================================
// SCENE 9: Explicit Template Call
// ============================================
const Scene9 = () => {
  const [showLabels, setShowLabels] = useState(false);
  const [showBoth, setShowBoth] = useState(false);

  useEffect(() => {
    const timer1 = setTimeout(() => setShowLabels(true), 1000);
    const timer2 = setTimeout(() => setShowBoth(true), 2200);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
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
          📞 CALLING TEMPLATES
        </motion.div>

        <div
          style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
        >
          {/* Explicit Call */}
          <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
            <GlassCard style={{ minWidth: "280px" }}>
              <div
                style={{
                  fontFamily: "'SF Mono', monospace",
                  fontSize: "18px",
                }}
              >
                <span style={{ color: colors.text }}>add</span>
                <span style={{ color: colors.primary }}>{"<"}</span>
                <span style={{ color: colors.typeInt, fontWeight: 700 }}>
                  int
                </span>
                <span style={{ color: colors.primary }}>{">"}</span>
                <span style={{ color: colors.text }}>(3, 4)</span>
              </div>
            </GlassCard>
            <AnimatePresence>
              {showLabels && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  style={{
                    padding: "10px 24px",
                    borderRadius: "100px",
                    background: colors.secondary,
                    color: "#000",
                    fontWeight: 700,
                    fontSize: "13px",
                  }}
                >
                  Explicit ⬅️
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Implicit Call */}
          <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
            <GlassCard style={{ minWidth: "280px" }}>
              <div
                style={{
                  fontFamily: "'SF Mono', monospace",
                  fontSize: "18px",
                }}
              >
                <span style={{ color: colors.text }}>add(3, 4)</span>
              </div>
            </GlassCard>
            <AnimatePresence>
              {showLabels && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  style={{
                    padding: "10px 24px",
                    borderRadius: "100px",
                    background: colors.success,
                    color: "#000",
                    fontWeight: 700,
                    fontSize: "13px",
                  }}
                >
                  Auto-detected 🤖
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Both work */}
        <AnimatePresence>
          {showBoth && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                display: "flex",
                gap: "1rem",
              }}
            >
              <div
                style={{
                  padding: "12px 24px",
                  borderRadius: "100px",
                  background: `${colors.success}20`,
                  border: `1px solid ${colors.success}40`,
                  color: colors.success,
                  fontWeight: 600,
                  fontSize: "15px",
                }}
              >
                ✓ Both work correctly!
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// ============================================
// EXPORTS
// ============================================
export const AnimationStepsPart1 = [
  {
    title: "Title & Setup",
    component: Scene1,
    contentText:
      "C++ Templates - Unit 5 One Shot. Subject: Object Oriented Programming with C++. University: RTU (Rajasthan Technical University). Topic: Generic Programming with Templates - Write Once, Use for Any Type.",
  },
  {
    title: "Code Duplication Problem",
    component: Scene2,
    contentText:
      "The Problem: Code Duplication. Without templates, you write separate functions for each type - int add(int a, int b), double add(double a, double b), float add(float a, float b). Same logic repeated, wasting time and creating maintenance burden.",
  },
  {
    title: "Zoom Into Logic",
    component: Scene3,
    contentText:
      "All these functions have identical logic: return a + b. The ONLY difference is the data type. This violates DRY principle (Don't Repeat Yourself). Templates solve this by writing the logic once.",
  },
  {
    title: "The Placeholder Idea",
    component: Scene4,
    contentText:
      "The Placeholder Concept: Instead of hardcoding types, use a placeholder T. T add(T a, T b) { return a + b; } The compiler replaces T with actual types when needed - int, double, string, any type!",
  },
  {
    title: "Template Syntax",
    component: Scene5,
    contentText:
      "Template Syntax: template<typename T> or template<class T> followed by function/class definition. T is the type parameter. template<typename T> T add(T a, T b) { return a + b; }",
  },
  {
    title: "Blueprint Concept",
    component: Scene6,
    contentText:
      "Templates are Blueprints: A template is NOT actual code - it's a blueprint. The compiler uses this blueprint to generate real functions/classes for specific types when you use them in your code.",
  },
  {
    title: "Compiler Creates Functions",
    component: Scene7,
    contentText:
      "Template Instantiation: When you call add(5, 3), compiler creates int add(int, int). Call add(2.5, 1.5), compiler creates double add(double, double). Each unique type generates new code - called instantiation.",
  },
  {
    title: "Compile Time vs Run Time",
    component: Scene8,
    contentText:
      "Templates work at COMPILE TIME, not runtime. The compiler generates specific functions during compilation. No runtime overhead - templates are as fast as hand-written type-specific functions.",
  },
  {
    title: "Explicit Template Call",
    component: Scene9,
    contentText:
      "Explicit Template Arguments: You can specify the type explicitly - add<int>(5, 3) or add<double>(2.5, 1.5). Useful when compiler can't deduce the type or when you want a specific instantiation.",
  },
];

export default {
  AnimationStepsPart1,
  GlassCard,
  CodeBlock,
};
