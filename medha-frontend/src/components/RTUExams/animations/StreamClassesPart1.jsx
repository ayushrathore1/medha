/**
 * StreamClassesPart1 - Scenes 53-65 (Continuing from Exception Handling)
 * OOPS Unit 5: Stream Classes in C++ - One Shot Lecture
 * Covers: Title, What is Stream, I/O Streams, cin/cout, Objects,
 *         Hierarchy, Operators, Extraction, Insertion, Full Program,
 *         cerr, Buffering, Formatting
 */
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { colors, containerStyle } from "./TemplatesUnit5Theme";
import { GlassCard, CodeBlock } from "./TemplatesOneShotPart1";

// ============================================
// SCENE 53: Stream Classes Title
// ============================================
const Scene53 = () => {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 500),
      setTimeout(() => setPhase(2), 1500),
      setTimeout(() => setPhase(3), 2500),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  // Flowing data particles
  const particles = [...Array(8)].map((_, i) => ({
    delay: i * 0.4,
    y: 30 + (i % 3) * 25,
  }));

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
            "radial-gradient(ellipse at center, rgba(48, 209, 88, 0.1) 0%, transparent 70%)",
        }}
      />

      {/* Flowing particles */}
      {phase >= 3 &&
        particles.map((p, i) => (
          <motion.div
            key={i}
            initial={{ x: "-10%", opacity: 0 }}
            animate={{
              x: "110%",
              opacity: [0, 0.6, 0],
            }}
            transition={{
              duration: 4,
              delay: p.delay,
              repeat: Infinity,
              ease: "linear",
            }}
            style={{
              position: "absolute",
              top: `${p.y}%`,
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              background: colors.primary,
              boxShadow: `0 0 10px ${colors.primary}`,
            }}
          />
        ))}

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
            background: "rgba(48, 209, 88, 0.15)",
            marginBottom: "1.5rem",
            color: colors.success,
            fontSize: "13px",
            fontWeight: 600,
            letterSpacing: "1.5px",
            border: `1px solid ${colors.success}30`,
          }}
        >
          RTU OOP UNIT 5 — PART 3
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            fontSize: "4rem",
            fontWeight: 700,
            letterSpacing: "-0.03em",
            background: `linear-gradient(180deg, #FFFFFF 0%, ${colors.success} 100%)`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            margin: 0,
          }}
        >
          {"Stream Classes".split("").map((char, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: phase >= 1 ? 1 : 0 }}
              transition={{ delay: 0.04 * i }}
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
              style={{
                color: colors.primary,
                fontSize: "1.4rem",
                marginTop: "1.2rem",
                fontWeight: 500,
              }}
            >
              How C++ Handles Input and Output
            </motion.p>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

// ============================================
// SCENE 54: What Is a Stream?
// ============================================
const Scene54 = () => {
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
            color: colors.primary,
            fontWeight: 700,
            fontSize: "13px",
            letterSpacing: "1.5px",
          }}
        >
          🌊 WHAT IS A STREAM?
        </motion.div>

        {/* Definition */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{
            fontSize: "2.5rem",
            fontWeight: 700,
            color: colors.text,
            textAlign: "center",
          }}
        >
          Stream = <span style={{ color: colors.primary }}>Flow of Data</span>
        </motion.div>

        {/* River-like flow visualization */}
        <div
          style={{
            position: "relative",
            width: "500px",
            height: "100px",
          }}
        >
          {/* Flow path */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: phase >= 1 ? 1 : 0 }}
            style={{
              position: "absolute",
              top: "50%",
              left: 0,
              right: 0,
              height: "40px",
              background: `linear-gradient(90deg, ${colors.primary}30, ${colors.success}30)`,
              borderRadius: "20px",
              transform: "translateY(-50%)",
            }}
          />

          {/* Icons */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: phase >= 1 ? 1 : 0 }}
            style={{
              position: "absolute",
              left: "10%",
              top: "50%",
              transform: "translateY(-50%)",
              fontSize: "2rem",
            }}
          >
            ⌨️
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: phase >= 1 ? 1 : 0 }}
            style={{
              position: "absolute",
              left: "45%",
              top: "50%",
              transform: "translateY(-50%)",
              padding: "10px 20px",
              borderRadius: "12px",
              background: colors.accent,
              color: "white",
              fontWeight: 700,
              fontSize: "14px",
            }}
          >
            Program
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: phase >= 1 ? 1 : 0 }}
            style={{
              position: "absolute",
              right: "10%",
              top: "50%",
              transform: "translateY(-50%)",
              fontSize: "2rem",
            }}
          >
            🖥️
          </motion.div>

          {/* Data dots flowing */}
          {phase >= 2 &&
            [...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ x: 50 }}
                animate={{ x: 400 }}
                transition={{
                  duration: 2,
                  delay: i * 0.4,
                  repeat: Infinity,
                  ease: "linear",
                }}
                style={{
                  position: "absolute",
                  top: "50%",
                  transform: "translateY(-50%)",
                  width: "12px",
                  height: "12px",
                  borderRadius: "50%",
                  background: colors.success,
                  boxShadow: `0 0 10px ${colors.success}`,
                }}
              />
            ))}
        </div>
      </div>
    </div>
  );
};

// ============================================
// SCENE 55: Input Stream vs Output Stream
// ============================================
const Scene55 = () => {
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
          🔄 TWO DIRECTIONS
        </motion.div>

        <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
          {/* Input Stream */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: phase >= 1 ? 1 : 0, x: 0 }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              padding: "20px 30px",
              borderRadius: "16px",
              background: `${colors.primary}15`,
              border: `2px solid ${colors.primary}`,
            }}
          >
            <span
              style={{
                color: colors.primary,
                fontWeight: 700,
                fontSize: "16px",
                minWidth: "140px",
              }}
            >
              Input Stream
            </span>
            <motion.span
              animate={{ x: [0, 10, 0] }}
              transition={{ duration: 1, repeat: Infinity }}
              style={{ fontSize: "1.5rem", color: colors.primary }}
            >
              →
            </motion.span>
            <span
              style={{
                padding: "8px 16px",
                borderRadius: "8px",
                background: colors.accent,
                color: "white",
                fontWeight: 600,
              }}
            >
              Program
            </span>
          </motion.div>

          {/* Output Stream */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: phase >= 2 ? 1 : 0, x: 0 }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              padding: "20px 30px",
              borderRadius: "16px",
              background: `${colors.success}15`,
              border: `2px solid ${colors.success}`,
            }}
          >
            <span
              style={{
                padding: "8px 16px",
                borderRadius: "8px",
                background: colors.accent,
                color: "white",
                fontWeight: 600,
              }}
            >
              Program
            </span>
            <motion.span
              animate={{ x: [0, 10, 0] }}
              transition={{ duration: 1, repeat: Infinity }}
              style={{ fontSize: "1.5rem", color: colors.success }}
            >
              →
            </motion.span>
            <span
              style={{
                color: colors.success,
                fontWeight: 700,
                fontSize: "16px",
                minWidth: "140px",
              }}
            >
              Output Stream
            </span>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

// ============================================
// SCENE 56: You Already Use Streams
// ============================================
const Scene56 = () => {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 800),
      setTimeout(() => setPhase(2), 1800),
      setTimeout(() => setPhase(3), 3000),
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
            color: colors.secondary,
            fontWeight: 700,
            fontSize: "13px",
            letterSpacing: "1.5px",
          }}
        >
          ✨ YOU ALREADY USE STREAMS!
        </motion.div>

        <div style={{ display: "flex", gap: "3rem" }}>
          {/* cin */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: phase >= 1 ? 1 : 0, y: 0 }}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "1rem",
            }}
          >
            <GlassCard glow={colors.primary}>
              <code
                style={{
                  fontFamily: "'SF Mono', monospace",
                  fontSize: "20px",
                  color: colors.primary,
                }}
              >
                cin {">"}
                {">"} x;
              </code>
            </GlassCard>

            {/* Flow visualization */}
            <AnimatePresence>
              {phase >= 2 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <span style={{ fontSize: "1.5rem" }}>⌨️</span>
                  <motion.div
                    animate={{ x: [0, 10, 0] }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                    style={{
                      width: "20px",
                      height: "20px",
                      borderRadius: "50%",
                      background: colors.primary,
                    }}
                  />
                  <span style={{ fontSize: "1.5rem" }}>📦</span>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* cout */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: phase >= 1 ? 1 : 0, y: 0 }}
            transition={{ delay: 0.3 }}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "1rem",
            }}
          >
            <GlassCard glow={colors.success}>
              <code
                style={{
                  fontFamily: "'SF Mono', monospace",
                  fontSize: "20px",
                  color: colors.success,
                }}
              >
                cout {"<"}
                {"<"} x;
              </code>
            </GlassCard>

            {/* Flow visualization */}
            <AnimatePresence>
              {phase >= 3 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <span style={{ fontSize: "1.5rem" }}>📦</span>
                  <motion.div
                    animate={{ x: [0, 10, 0] }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                    style={{
                      width: "20px",
                      height: "20px",
                      borderRadius: "50%",
                      background: colors.success,
                    }}
                  />
                  <span style={{ fontSize: "1.5rem" }}>🖥️</span>
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
// SCENE 57: Streams Are Objects
// ============================================
const Scene57 = () => {
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
          📦 STREAMS ARE OBJECTS
        </motion.div>

        <div style={{ display: "flex", gap: "2rem" }}>
          {/* cin */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: phase >= 1 ? 1 : 0, scale: 1 }}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "1rem",
            }}
          >
            <div
              style={{
                padding: "16px 32px",
                borderRadius: "12px",
                background: `${colors.primary}20`,
                border: `2px solid ${colors.primary}`,
                fontFamily: "'SF Mono', monospace",
                fontSize: "24px",
                fontWeight: 700,
                color: colors.primary,
              }}
            >
              cin
            </div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: phase >= 1 ? 1 : 0 }}
              style={{ color: colors.textSec, fontSize: "14px" }}
            >
              ↓
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: phase >= 1 ? 1 : 0, y: 0 }}
              transition={{ delay: 0.3 }}
              style={{
                padding: "12px 20px",
                borderRadius: "8px",
                background: "#1c1c1e",
                border: "1px solid rgba(255,255,255,0.1)",
                fontFamily: "'SF Mono', monospace",
                fontSize: "14px",
                color: colors.text,
              }}
            >
              object of <span style={{ color: colors.primary }}>istream</span>
            </motion.div>
          </motion.div>

          {/* cout */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: phase >= 2 ? 1 : 0, scale: 1 }}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "1rem",
            }}
          >
            <div
              style={{
                padding: "16px 32px",
                borderRadius: "12px",
                background: `${colors.success}20`,
                border: `2px solid ${colors.success}`,
                fontFamily: "'SF Mono', monospace",
                fontSize: "24px",
                fontWeight: 700,
                color: colors.success,
              }}
            >
              cout
            </div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: phase >= 2 ? 1 : 0 }}
              style={{ color: colors.textSec, fontSize: "14px" }}
            >
              ↓
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: phase >= 2 ? 1 : 0, y: 0 }}
              transition={{ delay: 0.3 }}
              style={{
                padding: "12px 20px",
                borderRadius: "8px",
                background: "#1c1c1e",
                border: "1px solid rgba(255,255,255,0.1)",
                fontFamily: "'SF Mono', monospace",
                fontSize: "14px",
                color: colors.text,
              }}
            >
              object of <span style={{ color: colors.success }}>ostream</span>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

// ============================================
// SCENE 58: Stream Class Hierarchy
// ============================================
const Scene58 = () => {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPhase((p) => (p < 3 ? p + 1 : p));
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
          🌳 STREAM CLASS HIERARCHY
        </motion.div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "1rem",
          }}
        >
          {/* Root: ios_base -> ios -> iostream */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: phase >= 1 ? 1 : 0, scale: 1 }}
            style={{
              padding: "14px 28px",
              borderRadius: "16px",
              background: `${colors.accent}20`,
              border: `2px solid ${colors.accent}`,
              fontFamily: "'SF Mono', monospace",
              fontSize: "18px",
              fontWeight: 700,
              color: colors.accent,
            }}
          >
            iostream
          </motion.div>

          {/* Connectors */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: phase >= 2 ? 1 : 0 }}
            style={{
              display: "flex",
              gap: "60px",
            }}
          >
            <div
              style={{
                width: "2px",
                height: "30px",
                background: colors.textSec,
              }}
            />
            <div
              style={{
                width: "2px",
                height: "30px",
                background: colors.textSec,
              }}
            />
          </motion.div>

          {/* Children */}
          <div style={{ display: "flex", gap: "2rem" }}>
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: phase >= 2 ? 1 : 0, y: 0 }}
              style={{
                padding: "12px 24px",
                borderRadius: "12px",
                background: `${colors.primary}20`,
                border: `2px solid ${colors.primary}`,
                fontFamily: "'SF Mono', monospace",
                fontSize: "16px",
                fontWeight: 600,
                color: colors.primary,
              }}
            >
              istream
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: phase >= 3 ? 1 : 0, y: 0 }}
              style={{
                padding: "12px 24px",
                borderRadius: "12px",
                background: `${colors.success}20`,
                border: `2px solid ${colors.success}`,
                fontFamily: "'SF Mono', monospace",
                fontSize: "16px",
                fontWeight: 600,
                color: colors.success,
              }}
            >
              ostream
            </motion.div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: phase >= 3 ? 1 : 0 }}
          style={{
            color: colors.textSec,
            fontSize: "14px",
            fontStyle: "italic",
          }}
        >
          iostream combines input + output capabilities
        </motion.div>
      </div>
    </div>
  );
};

// ============================================
// SCENE 59: Operator Overloading Concept
// ============================================
const Scene59 = () => {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setPhase(1), 1200);
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
            color: colors.warning,
            fontWeight: 700,
            fontSize: "13px",
            letterSpacing: "1.5px",
          }}
        >
          ⚡ OVERLOADED OPERATORS
        </motion.div>

        <div style={{ display: "flex", gap: "3rem" }}>
          {/* Extraction */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "1rem",
            }}
          >
            <div
              style={{
                fontSize: "4rem",
                fontFamily: "'SF Mono', monospace",
                fontWeight: 800,
                color: colors.primary,
              }}
            >
              {">>"}
            </div>
            <div
              style={{
                padding: "10px 20px",
                borderRadius: "100px",
                background: `${colors.primary}20`,
                border: `1px solid ${colors.primary}40`,
                color: colors.primary,
                fontWeight: 600,
              }}
            >
              Extraction
            </div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: phase >= 1 ? 1 : 0 }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                color: colors.textSec,
                fontSize: "14px",
              }}
            >
              <span>Pull data</span>
              <motion.span
                animate={{ x: [0, -5, 0] }}
                transition={{ duration: 0.5, repeat: Infinity }}
              >
                ←
              </motion.span>
              <span>IN</span>
            </motion.div>
          </motion.div>

          {/* Insertion */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "1rem",
            }}
          >
            <div
              style={{
                fontSize: "4rem",
                fontFamily: "'SF Mono', monospace",
                fontWeight: 800,
                color: colors.success,
              }}
            >
              {"<<"}
            </div>
            <div
              style={{
                padding: "10px 20px",
                borderRadius: "100px",
                background: `${colors.success}20`,
                border: `1px solid ${colors.success}40`,
                color: colors.success,
                fontWeight: 600,
              }}
            >
              Insertion
            </div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: phase >= 1 ? 1 : 0 }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                color: colors.textSec,
                fontSize: "14px",
              }}
            >
              <span>Push data</span>
              <motion.span
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 0.5, repeat: Infinity }}
              >
                →
              </motion.span>
              <span>OUT</span>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

// ============================================
// SCENE 60: How cin >> x Works
// ============================================
const Scene60 = () => {
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
          gap: "2rem",
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
          ⌨️ EXTRACTION OPERATOR
        </motion.div>

        <GlassCard glow={colors.primary}>
          <code
            style={{
              fontFamily: "'SF Mono', monospace",
              fontSize: "24px",
              color: colors.text,
            }}
          >
            <span style={{ color: colors.primary }}>cin</span>
            {" >> "}
            <span style={{ color: colors.accent }}>x</span>;
          </code>
        </GlassCard>

        {/* Animation */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1.5rem",
            position: "relative",
          }}
        >
          {/* Keyboard */}
          <motion.div
            style={{
              fontSize: "3rem",
            }}
          >
            ⌨️
          </motion.div>

          {/* Data flowing */}
          <div style={{ position: "relative", width: "150px", height: "40px" }}>
            <AnimatePresence>
              {phase >= 1 && (
                <motion.div
                  initial={{ x: 0, opacity: 1 }}
                  animate={{ x: 120, opacity: phase >= 2 ? 0 : 1 }}
                  transition={{ duration: 1 }}
                  style={{
                    position: "absolute",
                    top: "50%",
                    transform: "translateY(-50%)",
                    padding: "8px 16px",
                    borderRadius: "8px",
                    background: colors.primary,
                    color: "white",
                    fontWeight: 700,
                    fontFamily: "'SF Mono', monospace",
                  }}
                >
                  42
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Variable box */}
          <motion.div
            animate={{
              borderColor: phase >= 2 ? colors.success : colors.accent,
              boxShadow: phase >= 2 ? `0 0 20px ${colors.success}50` : "none",
            }}
            style={{
              width: "80px",
              height: "80px",
              borderRadius: "16px",
              background: `${colors.accent}20`,
              border: `3px solid ${colors.accent}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "'SF Mono', monospace",
              fontSize: "24px",
              fontWeight: 700,
              color: colors.accent,
            }}
          >
            {phase >= 2 ? "42" : "x"}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

// ============================================
// SCENE 61: How cout << x Works
// ============================================
const Scene61 = () => {
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
          🖥️ INSERTION OPERATOR
        </motion.div>

        <GlassCard glow={colors.success}>
          <code
            style={{
              fontFamily: "'SF Mono', monospace",
              fontSize: "24px",
              color: colors.text,
            }}
          >
            <span style={{ color: colors.success }}>cout</span>
            {" << "}
            <span style={{ color: colors.accent }}>x</span>;
          </code>
        </GlassCard>

        {/* Animation */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1.5rem",
            position: "relative",
          }}
        >
          {/* Variable box */}
          <motion.div
            style={{
              width: "80px",
              height: "80px",
              borderRadius: "16px",
              background: `${colors.accent}20`,
              border: `3px solid ${colors.accent}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "'SF Mono', monospace",
              fontSize: "24px",
              fontWeight: 700,
              color: colors.accent,
            }}
          >
            42
          </motion.div>

          {/* Data flowing */}
          <div style={{ position: "relative", width: "150px", height: "40px" }}>
            <AnimatePresence>
              {phase >= 1 && (
                <motion.div
                  initial={{ x: 0, opacity: 1 }}
                  animate={{ x: 120, opacity: phase >= 2 ? 0 : 1 }}
                  transition={{ duration: 1 }}
                  style={{
                    position: "absolute",
                    top: "50%",
                    transform: "translateY(-50%)",
                    padding: "8px 16px",
                    borderRadius: "8px",
                    background: colors.success,
                    color: "white",
                    fontWeight: 700,
                    fontFamily: "'SF Mono', monospace",
                  }}
                >
                  42
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Screen */}
          <motion.div
            animate={{
              boxShadow: phase >= 2 ? `0 0 30px ${colors.success}40` : "none",
            }}
            style={{
              width: "100px",
              height: "80px",
              borderRadius: "12px",
              background: "#1c1c1e",
              border: "2px solid rgba(255,255,255,0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "'SF Mono', monospace",
              fontSize: "20px",
              fontWeight: 700,
              color: phase >= 2 ? colors.success : colors.textSec,
            }}
          >
            {phase >= 2 ? "42" : "_"}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

// ============================================
// SCENE 62: Complete Basic Program
// ============================================
const Scene62 = () => {
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
            color: colors.accent,
            fontWeight: 700,
            fontSize: "13px",
            letterSpacing: "1.5px",
          }}
        >
          📝 COMPLETE PROGRAM
        </motion.div>

        <GlassCard>
          <div
            style={{
              fontFamily: "'SF Mono', monospace",
              fontSize: "16px",
              lineHeight: 1.8,
            }}
          >
            <div style={{ color: colors.typeInt }}>int a, b;</div>
            <motion.div
              animate={{
                backgroundColor:
                  phase >= 1 ? "rgba(10, 132, 255, 0.15)" : "transparent",
              }}
              style={{ padding: "4px 8px", borderRadius: "4px" }}
            >
              <span style={{ color: colors.primary }}>cin</span> {">> a >> b;"}
            </motion.div>
            <motion.div
              animate={{
                backgroundColor:
                  phase >= 3 ? "rgba(48, 209, 88, 0.15)" : "transparent",
              }}
              style={{ padding: "4px 8px", borderRadius: "4px" }}
            >
              <span style={{ color: colors.success }}>cout</span> {"<< a+b;"}
            </motion.div>
          </div>
        </GlassCard>

        {/* Flow visualization */}
        <div style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
          {/* Input */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: phase >= 1 ? 1 : 0 }}
            style={{
              display: "flex",
              gap: "0.5rem",
            }}
          >
            <div
              style={{
                padding: "8px 16px",
                borderRadius: "8px",
                background: colors.primary,
                color: "white",
                fontWeight: 700,
              }}
            >
              5
            </div>
            <div
              style={{
                padding: "8px 16px",
                borderRadius: "8px",
                background: colors.primary,
                color: "white",
                fontWeight: 700,
              }}
            >
              3
            </div>
          </motion.div>

          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: phase >= 2 ? 1 : 0 }}
            style={{ color: colors.textSec, fontSize: "1.5rem" }}
          >
            →
          </motion.span>

          {/* Sum */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: phase >= 3 ? 1 : 0, scale: 1 }}
            style={{
              padding: "12px 24px",
              borderRadius: "12px",
              background: colors.success,
              color: "white",
              fontWeight: 700,
              fontSize: "20px",
            }}
          >
            8
          </motion.div>
        </div>
      </div>
    </div>
  );
};

// ============================================
// SCENE 63: cerr Stream
// ============================================
const Scene63 = () => {
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
            color: colors.danger,
            fontWeight: 700,
            fontSize: "13px",
            letterSpacing: "1.5px",
          }}
        >
          ⚠️ ERROR OUTPUT STREAM
        </motion.div>

        <GlassCard glow={colors.danger}>
          <code
            style={{
              fontFamily: "'SF Mono', monospace",
              fontSize: "18px",
              color: colors.text,
            }}
          >
            <span style={{ color: colors.danger }}>cerr</span>
            {" << "}
            <span style={{ color: colors.typeString }}>"Error message"</span>;
          </code>
        </GlassCard>

        {/* Immediate output visualization */}
        <AnimatePresence>
          {phase >= 1 && (
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
              <motion.div
                animate={{
                  boxShadow: [
                    `0 0 0px ${colors.danger}`,
                    `0 0 20px ${colors.danger}`,
                    `0 0 0px ${colors.danger}`,
                  ],
                }}
                transition={{ duration: 1, repeat: Infinity }}
                style={{
                  padding: "14px 28px",
                  borderRadius: "12px",
                  background: `${colors.danger}20`,
                  border: `2px solid ${colors.danger}`,
                  color: colors.danger,
                  fontWeight: 600,
                  fontSize: "16px",
                }}
              >
                Error message
              </motion.div>
              <span style={{ color: colors.textSec, fontSize: "12px" }}>
                ⚡ Printed immediately (no buffering)
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// ============================================
// SCENE 64: Buffering Concept
// ============================================
const Scene64 = () => {
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
            color: colors.secondary,
            fontWeight: 700,
            fontSize: "13px",
            letterSpacing: "1.5px",
          }}
        >
          📦 BUFFERING CONCEPT
        </motion.div>

        <div style={{ display: "flex", gap: "3rem" }}>
          {/* cout - buffered */}
          <div
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
                fontSize: "20px",
                fontWeight: 700,
                color: colors.success,
              }}
            >
              cout
            </div>

            {/* Buffer queue */}
            <div
              style={{
                display: "flex",
                gap: "4px",
                padding: "8px",
                borderRadius: "8px",
                background: "#1c1c1e",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              {phase >= 1 &&
                ["H", "e", "l", "l", "o"].map((char, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                    style={{
                      width: "24px",
                      height: "24px",
                      borderRadius: "4px",
                      background: colors.success,
                      color: "white",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "12px",
                      fontWeight: 600,
                    }}
                  >
                    {char}
                  </motion.div>
                ))}
            </div>

            <span style={{ color: colors.textSec, fontSize: "12px" }}>
              Waits in queue (buffered)
            </span>
          </div>

          {/* cerr - immediate */}
          <div
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
                fontSize: "20px",
                fontWeight: 700,
                color: colors.danger,
              }}
            >
              cerr
            </div>

            {/* Immediate output */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: phase >= 2 ? 1 : 0 }}
              style={{
                padding: "8px 16px",
                borderRadius: "8px",
                background: colors.danger,
                color: "white",
                fontWeight: 600,
              }}
            >
              Error! ⚡
            </motion.div>

            <span style={{ color: colors.textSec, fontSize: "12px" }}>
              Prints instantly (unbuffered)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================
// SCENE 65: Formatting Output
// ============================================
const Scene65 = () => {
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
          🎨 FORMATTING OUTPUT
        </motion.div>

        <div style={{ display: "flex", gap: "2rem" }}>
          {/* setw */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: phase >= 1 ? 1 : 0, y: 0 }}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "1rem",
            }}
          >
            <GlassCard glow={colors.primary}>
              <code
                style={{
                  fontFamily: "'SF Mono', monospace",
                  fontSize: "16px",
                  color: colors.primary,
                }}
              >
                setw(10)
              </code>
            </GlassCard>

            {/* Wider box animation */}
            <motion.div
              animate={{
                width: phase >= 1 ? "150px" : "60px",
              }}
              style={{
                height: "40px",
                borderRadius: "8px",
                background: `${colors.primary}20`,
                border: `2px solid ${colors.primary}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "'SF Mono', monospace",
                color: colors.primary,
              }}
            >
              42
            </motion.div>
            <span style={{ color: colors.textSec, fontSize: "12px" }}>
              Set field width
            </span>
          </motion.div>

          {/* setprecision */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: phase >= 2 ? 1 : 0, y: 0 }}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "1rem",
            }}
          >
            <GlassCard glow={colors.success}>
              <code
                style={{
                  fontFamily: "'SF Mono', monospace",
                  fontSize: "16px",
                  color: colors.success,
                }}
              >
                setprecision(2)
              </code>
            </GlassCard>

            {/* Decimal trimming */}
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <div
                style={{
                  padding: "8px 16px",
                  borderRadius: "8px",
                  background: "rgba(255,255,255,0.05)",
                  fontFamily: "'SF Mono', monospace",
                  color: colors.textSec,
                  textDecoration: "line-through",
                }}
              >
                3.14159
              </div>
              <span style={{ color: colors.textSec }}>→</span>
              <div
                style={{
                  padding: "8px 16px",
                  borderRadius: "8px",
                  background: `${colors.success}20`,
                  border: `2px solid ${colors.success}`,
                  fontFamily: "'SF Mono', monospace",
                  color: colors.success,
                  fontWeight: 700,
                }}
              >
                3.14
              </div>
            </div>
            <span style={{ color: colors.textSec, fontSize: "12px" }}>
              Limit decimal places
            </span>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

// ============================================
// EXPORTS
// ============================================
export const AnimationStepsPart6 = [
  {
    title: "Stream Classes Intro",
    component: Scene53,
    contentText:
      "Stream Classes in C++ - Unit 5. Topic: Input/Output Stream Classes. Streams provide a uniform interface for I/O operations. Part of <iostream> header. Foundation of C++ I/O system.",
  },
  {
    title: "What Is a Stream?",
    component: Scene54,
    contentText:
      "What is a Stream? A stream is a sequence of bytes flowing between program and I/O device. Like a water pipe - data flows through it. Abstraction that hides device-specific details.",
  },
  {
    title: "Input vs Output Stream",
    component: Scene55,
    contentText:
      "Input Stream vs Output Stream: INPUT (istream) - data flows INTO program from keyboard/file. OUTPUT (ostream) - data flows OUT of program to screen/file. Direction is relative to program.",
  },
  {
    title: "You Already Use Streams",
    component: Scene56,
    contentText:
      "You Already Use Streams! cin is istream object for keyboard input. cout is ostream object for console output. cerr is ostream for error messages. These are predefined stream objects.",
  },
  {
    title: "Streams Are Objects",
    component: Scene57,
    contentText:
      "Streams Are Objects: cin, cout, cerr are OBJECTS of stream classes, not functions. They have methods like cin.get(), cout.put(), cout.precision(). OOP in action!",
  },
  {
    title: "Stream Class Hierarchy",
    component: Scene58,
    contentText:
      "Stream Class Hierarchy: ios_base (base) -> ios -> istream/ostream -> iostream. ifstream/ofstream for files. stringstream for strings. All inherit from common base classes.",
  },
  {
    title: "Overloaded Operators",
    component: Scene59,
    contentText:
      "Overloaded << and >> Operators: << is insertion operator (put data into stream). >> is extraction operator (get data from stream). These are overloaded for all basic types.",
  },
  {
    title: "How cin >> x Works",
    component: Scene60,
    contentText:
      "How cin >> x Works: 1) Reads characters from keyboard buffer, 2) Skips whitespace, 3) Converts to appropriate type, 4) Stores in variable x. Returns reference to cin for chaining.",
  },
  {
    title: "How cout << x Works",
    component: Scene61,
    contentText:
      "How cout << x Works: 1) Takes value x, 2) Converts to character representation, 3) Writes to output buffer, 4) Buffer flushed to screen. Returns reference to cout for chaining.",
  },
  {
    title: "Complete Basic Program",
    component: Scene62,
    contentText:
      'Complete I/O Example: #include <iostream> using namespace std; int main() { int x; cin >> x; cout << "Value: " << x << endl; return 0; } Basic stream I/O pattern.',
  },
  {
    title: "cerr Stream",
    component: Scene63,
    contentText:
      'cerr - Error Stream: cerr is unbuffered output stream for errors. Always displays immediately (no buffering). Use for error messages: cerr << "Error: " << msg; Separate from cout.',
  },
  {
    title: "Buffering Concept",
    component: Scene64,
    contentText:
      "Stream Buffering: cout is buffered - data accumulates before output. cerr is unbuffered - immediate output. endl flushes buffer. flush() method also flushes. Buffering improves performance.",
  },
  {
    title: "Formatting Output",
    component: Scene65,
    contentText:
      "Output Formatting: setw(n) - field width. setprecision(n) - decimal places. fixed/scientific - notation. left/right - alignment. Include <iomanip> header. cout << setw(10) << setprecision(2) << value;",
  },
];

export default { AnimationStepsPart6 };
