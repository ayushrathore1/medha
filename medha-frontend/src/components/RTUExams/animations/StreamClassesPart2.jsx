/**
 * StreamClassesPart2 - Scenes 66-78 (Continuing from Part 6)
 * OOPS Unit 5: Stream Classes in C++ - One Shot Lecture
 * Covers: iomanip, Stream States, Invalid Input, Clearing State,
 *         Chaining, getline, Files, Overloading for Classes,
 *         Manipulators, Exceptions, Big Picture, Closing
 */
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { colors, containerStyle } from "./TemplatesUnit5Theme";
import { GlassCard, CodeBlock } from "./TemplatesOneShotPart1";

// ============================================
// SCENE 66: iomanip Header
// ============================================
const Scene66 = () => {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setPhase(1), 1000);
    return () => clearTimeout(timer);
  }, []);

  const tools = ["setw", "setprecision", "fixed", "hex", "oct"];

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
          🧰 FORMATTING TOOLBOX
        </motion.div>

        <GlassCard glow={colors.secondary}>
          <code
            style={{
              fontFamily: "'SF Mono', monospace",
              fontSize: "20px",
              color: colors.secondary,
            }}
          >
            #include {"<iomanip>"}
          </code>
        </GlassCard>

        {/* Toolbox opening */}
        <AnimatePresence>
          {phase >= 1 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "0.75rem",
                justifyContent: "center",
                maxWidth: "400px",
              }}
            >
              {tools.map((tool, i) => (
                <motion.div
                  key={tool}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.15 }}
                  style={{
                    padding: "10px 18px",
                    borderRadius: "100px",
                    background: `${colors.accent}20`,
                    border: `1px solid ${colors.accent}50`,
                    fontFamily: "'SF Mono', monospace",
                    fontSize: "14px",
                    color: colors.accent,
                    fontWeight: 600,
                  }}
                >
                  {tool}
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// ============================================
// SCENE 67: Stream States
// ============================================
const Scene67 = () => {
  const [activeState, setActiveState] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveState((s) => (s + 1) % 4);
    }, 1200);
    return () => clearInterval(interval);
  }, []);

  const states = [
    { name: "good()", color: colors.success, icon: "🟢" },
    { name: "fail()", color: colors.warning, icon: "🟡" },
    { name: "bad()", color: colors.danger, icon: "🔴" },
    { name: "eof()", color: colors.primary, icon: "🔵" },
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
            color: colors.accent,
            fontWeight: 700,
            fontSize: "13px",
            letterSpacing: "1.5px",
          }}
        >
          🚦 STREAM STATES
        </motion.div>

        <div style={{ display: "flex", gap: "1rem" }}>
          {states.map((state, i) => (
            <motion.div
              key={state.name}
              animate={{
                scale: activeState === i ? 1.1 : 1,
                borderColor:
                  activeState === i ? state.color : "rgba(255,255,255,0.1)",
                boxShadow:
                  activeState === i ? `0 0 20px ${state.color}50` : "none",
              }}
              style={{
                padding: "16px 20px",
                borderRadius: "16px",
                background: `${state.color}15`,
                border: `2px solid rgba(255,255,255,0.1)`,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              <span style={{ fontSize: "2rem" }}>{state.icon}</span>
              <span
                style={{
                  fontFamily: "'SF Mono', monospace",
                  fontSize: "14px",
                  color: state.color,
                  fontWeight: 600,
                }}
              >
                {state.name}
              </span>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            color: colors.textSec,
            fontSize: "14px",
            fontStyle: "italic",
          }}
        >
          Check stream health before/after operations
        </motion.div>
      </div>
    </div>
  );
};

// ============================================
// SCENE 68: Invalid Input Example
// ============================================
const Scene68 = () => {
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
          gap: "2rem",
        }}
      >
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
          ❌ INVALID INPUT
        </motion.div>

        <GlassCard>
          <div
            style={{
              fontFamily: "'SF Mono', monospace",
              fontSize: "16px",
              lineHeight: 1.8,
            }}
          >
            <div>
              <span style={{ color: colors.primary }}>cin</span>
              {" >> x;"}{" "}
              <span style={{ color: colors.textSec }}>// x is int</span>
            </div>
            <motion.div
              animate={{
                backgroundColor:
                  phase >= 2 ? "rgba(255, 69, 58, 0.15)" : "transparent",
              }}
              style={{ padding: "4px 8px", borderRadius: "4px" }}
            >
              <span style={{ color: colors.keyword }}>if</span>(
              <span style={{ color: colors.primary }}>cin</span>.
              <span style={{ color: colors.danger }}>fail</span>())
            </motion.div>
          </div>
        </GlassCard>

        {/* Animation */}
        <div style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
          {/* Letter trying to enter int box */}
          <motion.div
            initial={{ x: 0 }}
            animate={{ x: phase >= 1 ? 80 : 0 }}
            transition={{ duration: 0.5 }}
            style={{
              padding: "12px 20px",
              borderRadius: "8px",
              background: colors.warning,
              color: "#000",
              fontWeight: 700,
              fontFamily: "'SF Mono', monospace",
              fontSize: "20px",
            }}
          >
            "abc"
          </motion.div>

          {/* Int box */}
          <motion.div
            animate={{
              borderColor: phase >= 2 ? colors.danger : colors.typeInt,
              backgroundColor:
                phase >= 2 ? "rgba(255, 69, 58, 0.2)" : `${colors.typeInt}20`,
            }}
            style={{
              width: "80px",
              height: "80px",
              borderRadius: "16px",
              border: `3px solid ${colors.typeInt}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "'SF Mono', monospace",
              fontSize: "16px",
              color: phase >= 2 ? colors.danger : colors.typeInt,
            }}
          >
            {phase >= 2 ? "FAIL" : "int"}
          </motion.div>
        </div>

        <AnimatePresence>
          {phase >= 3 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                padding: "12px 24px",
                borderRadius: "100px",
                background: `${colors.danger}15`,
                border: `1px solid ${colors.danger}40`,
                color: colors.danger,
                fontWeight: 600,
                fontSize: "14px",
              }}
            >
              cin.fail() returns true! ⚠️
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// ============================================
// SCENE 69: Clearing Stream State
// ============================================
const Scene69 = () => {
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
            color: colors.success,
            fontWeight: 700,
            fontSize: "13px",
            letterSpacing: "1.5px",
          }}
        >
          🔄 CLEARING STREAM STATE
        </motion.div>

        <GlassCard>
          <div
            style={{
              fontFamily: "'SF Mono', monospace",
              fontSize: "16px",
              lineHeight: 1.8,
            }}
          >
            <motion.div
              animate={{
                backgroundColor:
                  phase >= 1 ? "rgba(48, 209, 88, 0.15)" : "transparent",
              }}
              style={{ padding: "4px 8px", borderRadius: "4px" }}
            >
              <span style={{ color: colors.primary }}>cin</span>.
              <span style={{ color: colors.success }}>clear</span>();
            </motion.div>
            <motion.div
              animate={{
                backgroundColor:
                  phase >= 2 ? "rgba(48, 209, 88, 0.15)" : "transparent",
              }}
              style={{ padding: "4px 8px", borderRadius: "4px" }}
            >
              <span style={{ color: colors.primary }}>cin</span>.
              <span style={{ color: colors.success }}>ignore</span>();
            </motion.div>
          </div>
        </GlassCard>

        {/* State indicator */}
        <div style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
          <motion.div
            animate={{
              backgroundColor: phase >= 1 ? colors.success : colors.danger,
            }}
            style={{
              width: "80px",
              height: "80px",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "2rem",
              color: "white",
              fontWeight: 700,
              boxShadow:
                phase >= 1
                  ? `0 0 30px ${colors.success}50`
                  : `0 0 30px ${colors.danger}50`,
            }}
          >
            {phase >= 1 ? "✓" : "✗"}
          </motion.div>

          <div style={{ color: colors.textSec, fontSize: "14px" }}>
            {phase >= 1
              ? "Stream reset! Ready for input again"
              : "Stream in error state"}
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================
// SCENE 70: Chaining Operators
// ============================================
const Scene70 = () => {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPhase((p) => (p < 4 ? p + 1 : 0));
    }, 800);
    return () => clearInterval(interval);
  }, []);

  const values = ["a", "b", "c"];

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
          ⛓️ CHAINING OPERATORS
        </motion.div>

        <GlassCard glow={colors.primary}>
          <code
            style={{
              fontFamily: "'SF Mono', monospace",
              fontSize: "20px",
              color: colors.text,
            }}
          >
            <span style={{ color: colors.primary }}>cin</span>
            {" >> a >> b >> c;"}
          </code>
        </GlassCard>

        {/* Chain visualization */}
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          {values.map((v, i) => (
            <React.Fragment key={v}>
              <motion.div
                animate={{
                  scale: phase === i + 1 ? 1.15 : 1,
                  boxShadow:
                    phase === i + 1 ? `0 0 20px ${colors.primary}50` : "none",
                  borderColor: phase > i ? colors.success : colors.primary,
                  backgroundColor:
                    phase > i ? `${colors.success}20` : `${colors.primary}20`,
                }}
                style={{
                  width: "60px",
                  height: "60px",
                  borderRadius: "12px",
                  border: `3px solid ${colors.primary}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: "'SF Mono', monospace",
                  fontSize: "20px",
                  fontWeight: 700,
                  color: phase > i ? colors.success : colors.primary,
                }}
              >
                {phase > i ? (i + 1) * 10 : v}
              </motion.div>

              {i < values.length - 1 && (
                <motion.span
                  animate={{
                    color: phase === i + 1 ? colors.primary : colors.textSec,
                    scale: phase === i + 1 ? 1.2 : 1,
                  }}
                  style={{ fontSize: "1.5rem" }}
                >
                  →
                </motion.span>
              )}
            </React.Fragment>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            color: colors.textSec,
            fontSize: "14px",
            fontStyle: "italic",
          }}
        >
          Data flows through each variable in sequence
        </motion.div>
      </div>
    </div>
  );
};

// ============================================
// SCENE 71: Reading Strings (cin vs getline)
// ============================================
const Scene71 = () => {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 1000),
      setTimeout(() => setPhase(2), 2500),
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
          📝 READING STRINGS
        </motion.div>

        <div style={{ display: "flex", gap: "2rem" }}>
          {/* cin >> name */}
          <motion.div
            animate={{ opacity: phase >= 2 ? 0.5 : 1 }}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "1rem",
            }}
          >
            <GlassCard glow={colors.warning}>
              <code
                style={{ fontFamily: "'SF Mono', monospace", fontSize: "14px" }}
              >
                <span style={{ color: colors.primary }}>cin</span> {">> name;"}
              </code>
            </GlassCard>

            <AnimatePresence>
              {phase >= 1 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  <div style={{ color: colors.textSec, fontSize: "12px" }}>
                    Input: "Hello World"
                  </div>
                  <div
                    style={{
                      padding: "8px 16px",
                      borderRadius: "8px",
                      background: `${colors.warning}20`,
                      border: `2px solid ${colors.warning}`,
                      fontFamily: "'SF Mono', monospace",
                      color: colors.warning,
                    }}
                  >
                    "Hello" <span style={{ color: colors.danger }}>⛔</span>
                  </div>
                  <span style={{ color: colors.danger, fontSize: "12px" }}>
                    Stops at space!
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* getline */}
          <motion.div
            animate={{ scale: phase >= 2 ? 1.05 : 1 }}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "1rem",
            }}
          >
            <GlassCard glow={colors.success}>
              <code
                style={{ fontFamily: "'SF Mono', monospace", fontSize: "14px" }}
              >
                <span style={{ color: colors.success }}>getline</span>(cin,
                name);
              </code>
            </GlassCard>

            <AnimatePresence>
              {phase >= 2 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  <div style={{ color: colors.textSec, fontSize: "12px" }}>
                    Input: "Hello World"
                  </div>
                  <div
                    style={{
                      padding: "8px 16px",
                      borderRadius: "8px",
                      background: `${colors.success}20`,
                      border: `2px solid ${colors.success}`,
                      fontFamily: "'SF Mono', monospace",
                      color: colors.success,
                    }}
                  >
                    "Hello World" ✓
                  </div>
                  <span style={{ color: colors.success, fontSize: "12px" }}>
                    Captures full line!
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

// ============================================
// SCENE 72: Streams and Files Connection
// ============================================
const Scene72 = () => {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setPhase(1), 1500);
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
            color: colors.secondary,
            fontWeight: 700,
            fontSize: "13px",
            letterSpacing: "1.5px",
          }}
        >
          📁 STREAMS & FILES
        </motion.div>

        <div
          style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
        >
          {/* Keyboard stream */}
          <motion.div
            animate={{ opacity: phase >= 1 ? 0.5 : 1 }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              padding: "16px 24px",
              borderRadius: "16px",
              background: `${colors.primary}15`,
              border: `1px solid ${colors.primary}30`,
            }}
          >
            <span style={{ fontSize: "2rem" }}>⌨️</span>
            <span style={{ color: colors.textSec }}>→</span>
            <span
              style={{
                color: colors.primary,
                fontFamily: "'SF Mono', monospace",
                fontWeight: 600,
              }}
            >
              cin
            </span>
            <span style={{ color: colors.textSec }}>→</span>
            <span style={{ color: colors.accent, fontWeight: 600 }}>
              Program
            </span>
          </motion.div>

          {/* File stream */}
          <motion.div
            animate={{
              scale: phase >= 1 ? 1.05 : 1,
              boxShadow:
                phase >= 1 ? `0 10px 30px ${colors.success}30` : "none",
            }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              padding: "16px 24px",
              borderRadius: "16px",
              background: `${colors.success}15`,
              border: `2px solid ${colors.success}`,
            }}
          >
            <span style={{ fontSize: "2rem" }}>📄</span>
            <span style={{ color: colors.textSec }}>→</span>
            <span
              style={{
                color: colors.success,
                fontFamily: "'SF Mono', monospace",
                fontWeight: 600,
              }}
            >
              ifstream
            </span>
            <span style={{ color: colors.textSec }}>→</span>
            <span style={{ color: colors.accent, fontWeight: 600 }}>
              Program
            </span>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: phase >= 1 ? 1 : 0 }}
          style={{
            padding: "12px 24px",
            borderRadius: "100px",
            background: "rgba(255,255,255,0.05)",
            color: colors.text,
            fontSize: "14px",
          }}
        >
          Same concept, different source! 🔄
        </motion.div>
      </div>
    </div>
  );
};

// ============================================
// SCENE 73: Overloading << and >> for Class
// ============================================
const Scene73 = () => {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 1000),
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
          🎨 CUSTOM CLASS I/O
        </motion.div>

        <div style={{ display: "flex", gap: "2rem" }}>
          {/* cin >> student */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: phase >= 1 ? 1 : 0, x: 0 }}
          >
            <GlassCard glow={colors.primary}>
              <code
                style={{ fontFamily: "'SF Mono', monospace", fontSize: "16px" }}
              >
                <span style={{ color: colors.primary }}>cin</span>
                {" >> "}
                <span style={{ color: colors.accent }}>student</span>;
              </code>
            </GlassCard>
          </motion.div>

          {/* cout << student */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: phase >= 2 ? 1 : 0, x: 0 }}
          >
            <GlassCard glow={colors.success}>
              <code
                style={{ fontFamily: "'SF Mono', monospace", fontSize: "16px" }}
              >
                <span style={{ color: colors.success }}>cout</span>
                {" << "}
                <span style={{ color: colors.accent }}>student</span>;
              </code>
            </GlassCard>
          </motion.div>
        </div>

        {/* Student object visualization */}
        <AnimatePresence>
          {phase >= 1 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1.5rem",
              }}
            >
              <motion.div
                animate={{
                  x: phase >= 2 ? [0, 50, 100] : [0, -50, -100, 0],
                }}
                transition={{ duration: 2, repeat: Infinity }}
                style={{
                  padding: "20px",
                  borderRadius: "16px",
                  background: `linear-gradient(135deg, ${colors.accent}30, ${colors.primary}30)`,
                  border: `2px solid ${colors.accent}`,
                }}
              >
                <div style={{ fontSize: "2rem", textAlign: "center" }}>👤</div>
                <div
                  style={{
                    fontFamily: "'SF Mono', monospace",
                    fontSize: "14px",
                    color: colors.accent,
                    textAlign: "center",
                  }}
                >
                  Student
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// ============================================
// SCENE 74: Stream Manipulators
// ============================================
const Scene74 = () => {
  const [activeManip, setActiveManip] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveManip((m) => (m + 1) % 3);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  const manipulators = [
    { name: "endl", effect: "New line + flush", demo: "Hello\\nWorld" },
    { name: "fixed", effect: "Fixed-point", demo: "3.140000" },
    { name: "scientific", effect: "Scientific notation", demo: "3.14e+00" },
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
          🎛️ STREAM MANIPULATORS
        </motion.div>

        <div style={{ display: "flex", gap: "1.5rem" }}>
          {manipulators.map((m, i) => (
            <motion.div
              key={m.name}
              animate={{
                scale: activeManip === i ? 1.1 : 1,
                borderColor:
                  activeManip === i ? colors.accent : "rgba(255,255,255,0.1)",
              }}
              style={{
                padding: "16px 20px",
                borderRadius: "16px",
                background:
                  activeManip === i ? `${colors.accent}20` : "#1c1c1e",
                border: "2px solid rgba(255,255,255,0.1)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "0.75rem",
                minWidth: "120px",
              }}
            >
              <span
                style={{
                  fontFamily: "'SF Mono', monospace",
                  fontSize: "18px",
                  fontWeight: 700,
                  color: activeManip === i ? colors.accent : colors.text,
                }}
              >
                {m.name}
              </span>
              <span style={{ color: colors.textSec, fontSize: "11px" }}>
                {m.effect}
              </span>
              {activeManip === i && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  style={{
                    fontFamily: "'SF Mono', monospace",
                    fontSize: "12px",
                    color: colors.success,
                  }}
                >
                  {m.demo}
                </motion.span>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ============================================
// SCENE 75: endl and Flush
// ============================================
const Scene75 = () => {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 1000),
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
            color: colors.primary,
            fontWeight: 700,
            fontSize: "13px",
            letterSpacing: "1.5px",
          }}
        >
          🚿 ENDL FLUSHES BUFFER
        </motion.div>

        <GlassCard glow={colors.primary}>
          <code
            style={{ fontFamily: "'SF Mono', monospace", fontSize: "18px" }}
          >
            <span style={{ color: colors.success }}>cout</span>
            {" << "}
            <span style={{ color: colors.primary }}>endl</span>;
          </code>
        </GlassCard>

        {/* Buffer visualization */}
        <div style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
          {/* Buffer */}
          <div
            style={{
              padding: "12px",
              borderRadius: "12px",
              background: "#1c1c1e",
              border: "1px solid rgba(255,255,255,0.1)",
              minWidth: "150px",
              minHeight: "50px",
              display: "flex",
              gap: "4px",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {phase < 2 &&
              ["H", "i", "!"].map((c, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: phase >= 1 ? 1 : 0 }}
                  transition={{ delay: i * 0.1 }}
                  style={{
                    padding: "6px 10px",
                    borderRadius: "4px",
                    background: colors.primary,
                    color: "white",
                    fontWeight: 600,
                  }}
                >
                  {c}
                </motion.div>
              ))}
            {phase >= 2 && (
              <span style={{ color: colors.textSec, fontSize: "12px" }}>
                Empty
              </span>
            )}
          </div>

          <motion.span
            animate={{ x: phase >= 2 ? [0, 10, 0] : 0 }}
            transition={{ duration: 0.3, repeat: phase >= 2 ? 3 : 0 }}
            style={{ fontSize: "1.5rem", color: colors.textSec }}
          >
            →
          </motion.span>

          {/* Screen */}
          <motion.div
            animate={{
              boxShadow: phase >= 2 ? `0 0 20px ${colors.success}50` : "none",
            }}
            style={{
              padding: "16px 24px",
              borderRadius: "12px",
              background: "#1c1c1e",
              border: `2px solid ${phase >= 2 ? colors.success : "rgba(255,255,255,0.1)"}`,
              fontFamily: "'SF Mono', monospace",
              fontSize: "18px",
              color: phase >= 2 ? colors.success : colors.textSec,
            }}
          >
            {phase >= 2 ? "Hi!" : "_"}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: phase >= 2 ? 1 : 0 }}
          style={{
            color: colors.textSec,
            fontSize: "14px",
          }}
        >
          Buffer emptied instantly! ⚡
        </motion.div>
      </div>
    </div>
  );
};

// ============================================
// SCENE 76: Streams + Exceptions
// ============================================
const Scene76 = () => {
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
          ⚡ STREAMS + EXCEPTIONS
        </motion.div>

        <GlassCard glow={colors.warning}>
          <code
            style={{ fontFamily: "'SF Mono', monospace", fontSize: "16px" }}
          >
            <span style={{ color: colors.primary }}>cin</span>.
            <span style={{ color: colors.warning }}>exceptions</span>
            (ios::<span style={{ color: colors.danger }}>failbit</span>);
          </code>
        </GlassCard>

        {/* Visualization */}
        <div style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
          <motion.div
            animate={{
              borderColor: phase >= 1 ? colors.danger : colors.primary,
            }}
            style={{
              width: "80px",
              height: "80px",
              borderRadius: "16px",
              background: `${colors.danger}20`,
              border: `3px solid ${colors.primary}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "2rem",
            }}
          >
            {phase >= 1 ? "❌" : "📝"}
          </motion.div>

          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: phase >= 1 ? 1 : 0 }}
            style={{ fontSize: "1.5rem", color: colors.textSec }}
          >
            →
          </motion.span>

          <AnimatePresence>
            {phase >= 2 && (
              <motion.div
                initial={{ opacity: 0, x: -20, scale: 0.8 }}
                animate={{
                  opacity: 1,
                  x: 0,
                  scale: 1,
                  y: [0, -10, 0],
                }}
                transition={{
                  y: { duration: 1, repeat: Infinity },
                }}
                style={{
                  padding: "14px 24px",
                  borderRadius: "100px",
                  background: `linear-gradient(135deg, ${colors.danger}, ${colors.warning})`,
                  color: "white",
                  fontWeight: 700,
                  fontSize: "15px",
                }}
              >
                ⚡ Exception thrown!
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: phase >= 2 ? 1 : 0 }}
          style={{
            color: colors.textSec,
            fontSize: "14px",
            fontStyle: "italic",
          }}
        >
          Stream errors become catchable exceptions
        </motion.div>
      </div>
    </div>
  );
};

// ============================================
// SCENE 77: Big Picture Summary
// ============================================
const Scene77 = () => {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPhase((p) => (p < 4 ? p + 1 : p));
    }, 800);
    return () => clearInterval(interval);
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
          🌐 THE BIG PICTURE
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{
            fontSize: "2rem",
            fontWeight: 700,
            textAlign: "center",
            background: `linear-gradient(135deg, ${colors.text}, ${colors.primary})`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Stream = Data Flow System of C++
        </motion.div>

        {/* All streams merging */}
        <div
          style={{
            display: "flex",
            gap: "1rem",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          {[
            { name: "cin", icon: "⌨️" },
            { name: "cout", icon: "🖥️" },
            { name: "cerr", icon: "⚠️" },
            { name: "ifstream", icon: "📄" },
          ].map((stream, i) => (
            <motion.div
              key={stream.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: phase > i ? 1 : 0, y: 0 }}
              style={{
                padding: "12px 20px",
                borderRadius: "12px",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <span style={{ fontSize: "1.5rem" }}>{stream.icon}</span>
              <span
                style={{
                  fontFamily: "'SF Mono', monospace",
                  fontSize: "14px",
                  color: colors.text,
                  fontWeight: 600,
                }}
              >
                {stream.name}
              </span>
            </motion.div>
          ))}
        </div>

        <AnimatePresence>
          {phase >= 4 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                padding: "14px 28px",
                borderRadius: "100px",
                background: `${colors.success}15`,
                border: `1px solid ${colors.success}40`,
                color: colors.success,
                fontWeight: 600,
                fontSize: "15px",
              }}
            >
              All use the same stream concept! 🔗
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// ============================================
// SCENE 78: Closing
// ============================================
const Scene78 = () => {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 1000),
      setTimeout(() => setPhase(2), 2500),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div style={containerStyle}>
      {/* Background */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at center, rgba(48, 209, 88, 0.1) 0%, transparent 70%)",
        }}
      />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "2rem",
          zIndex: 10,
        }}
      >
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: phase >= 1 ? 1 : 0, y: 0 }}
          style={{
            fontSize: "2rem",
            fontWeight: 700,
            textAlign: "center",
            background: `linear-gradient(180deg, #FFFFFF 0%, ${colors.success} 100%)`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            margin: 0,
          }}
        >
          Understanding Streams =
          <br />
          Understanding I/O in C++
        </motion.h1>

        <AnimatePresence>
          {phase >= 1 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
              }}
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 1, repeat: Infinity }}
                style={{ fontSize: "3rem" }}
              >
                📂
              </motion.div>
              <span style={{ fontSize: "2rem", color: colors.textSec }}>
                ↔
              </span>
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
                style={{ fontSize: "3rem" }}
              >
                🌊
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {phase >= 2 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                padding: "16px 32px",
                borderRadius: "100px",
                background: `linear-gradient(135deg, ${colors.success}, ${colors.primary})`,
                color: "white",
                fontWeight: 600,
                fontSize: "16px",
                boxShadow: `0 10px 30px ${colors.success}40`,
              }}
            >
              Unit 5 Complete! 🎉
            </motion.div>
          )}
        </AnimatePresence>

        {/* All topics completed */}
        <AnimatePresence>
          {phase >= 2 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{
                display: "flex",
                gap: "1rem",
                marginTop: "1rem",
              }}
            >
              {["✓ Templates", "✓ Exceptions", "✓ Streams"].map((topic, i) => (
                <motion.div
                  key={topic}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.2 }}
                  style={{
                    padding: "8px 16px",
                    borderRadius: "100px",
                    background: `${colors.success}20`,
                    border: `1px solid ${colors.success}40`,
                    color: colors.success,
                    fontWeight: 600,
                    fontSize: "13px",
                  }}
                >
                  {topic}
                </motion.div>
              ))}
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
export const AnimationStepsPart7 = [
  {
    title: "iomanip Header",
    component: Scene66,
    contentText:
      "<iomanip> Header: Provides I/O manipulators - setw(), setprecision(), setfill(), fixed, scientific, hex, oct, dec. #include <iomanip> for formatted output control.",
  },
  {
    title: "Stream States",
    component: Scene67,
    contentText:
      "Stream States: goodbit - all OK, eofbit - end of file reached, failbit - operation failed (recoverable), badbit - fatal error. Check with good(), eof(), fail(), bad() methods.",
  },
  {
    title: "Invalid Input Example",
    component: Scene68,
    contentText:
      "Handling Invalid Input: If cin >> int_var receives 'abc', failbit is set. Stream stops working until cleared. Always validate input: if(cin.fail()) { handle error }",
  },
  {
    title: "Clearing Stream State",
    component: Scene69,
    contentText:
      "Clearing Stream State: cin.clear() - resets state flags. cin.ignore(1000, '\\n') - discards bad input. Together they recover from input errors: cin.clear(); cin.ignore(1000, '\\n');",
  },
  {
    title: "Chaining Operators",
    component: Scene70,
    contentText:
      "Operator Chaining: cout << a << b << c; works because << returns ostream&. Each operation returns stream reference for next operation. Same with cin >> x >> y >> z;",
  },
  {
    title: "Reading Strings",
    component: Scene71,
    contentText:
      "Reading Strings: cin >> str reads until whitespace. getline(cin, str) reads entire line including spaces. Use getline for full lines: string line; getline(cin, line);",
  },
  {
    title: "Streams and Files",
    component: Scene72,
    contentText:
      'Streams and Files: Same operators work with files! ifstream fin("input.txt"); fin >> x; ofstream fout("output.txt"); fout << x; File streams inherit from istream/ostream.',
  },
  {
    title: "Custom Class I/O",
    component: Scene73,
    contentText:
      "Custom Class I/O: Overload << and >> for your classes. friend ostream& operator<<(ostream& os, const MyClass& obj) { os << obj.data; return os; } Enables cout << myObj;",
  },
  {
    title: "Stream Manipulators",
    component: Scene74,
    contentText:
      "Common Manipulators: hex/oct/dec - number base, boolalpha - true/false instead of 1/0, showpoint - show decimal point, uppercase - E instead of e. Apply with cout << hex << 255;",
  },
  {
    title: "endl and Flush",
    component: Scene75,
    contentText:
      "endl vs \\n: endl outputs newline AND flushes buffer. \\n only outputs newline. For performance, use \\n in loops. Use endl when you need immediate output. flush manipulator only flushes.",
  },
  {
    title: "Streams + Exceptions",
    component: Scene76,
    contentText:
      "Streams and Exceptions: cin.exceptions(ios::failbit) - throws on fail. Can catch stream errors: try { cin >> x; } catch(ios_base::failure& e) { } Modern way to handle I/O errors.",
  },
  {
    title: "Big Picture Summary",
    component: Scene77,
    contentText:
      "Stream Classes Summary: Unified I/O interface, operator overloading for << >>, stream states for error handling, manipulators for formatting, inheritance enables file/string streams.",
  },
  {
    title: "Stream Classes Closing",
    component: Scene78,
    contentText:
      "Key Takeaways: cin/cout are stream objects, << >> are overloaded operators, check stream states, use iomanip for formatting, getline for strings, same pattern works for files.",
  },
];

export default { AnimationStepsPart7 };
