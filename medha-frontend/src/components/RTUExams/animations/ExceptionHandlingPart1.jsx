/**
 * ExceptionHandlingPart1 - Scenes 27-39 (Continuing from Templates)
 * OOPS Unit 5: Exception Handling in C++ - One Shot Lecture
 * Covers: Title, Errors, Crash, Protection, Keywords, try-catch, Flows,
 *         Throw Types, Type Matching, Multiple Catch, Default Catch,
 *         Exception from Function, Stack Unwinding
 */
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { colors, containerStyle } from "./TemplatesUnit5Theme";
import { GlassCard, CodeBlock } from "./TemplatesOneShotPart1";

// ============================================
// SCENE 27: Exception Handling Title
// ============================================
const Scene27 = () => {
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
      {/* Background glow - warning tint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at center, rgba(255, 69, 58, 0.1) 0%, transparent 70%)",
        }}
      />

      {/* Floating warning symbols */}
      {phase >= 3 && (
        <>
          {["⚠️", "⛔", "❌", "🛡️"].map((emoji, i) => (
            <motion.div
              key={emoji}
              initial={{ opacity: 0 }}
              animate={{
                opacity: 0.2,
                y: [0, -10, 0],
              }}
              transition={{
                opacity: { duration: 0.5 },
                y: { duration: 3 + i * 0.5, repeat: Infinity },
              }}
              style={{
                position: "absolute",
                left: `${15 + i * 22}%`,
                top: `${25 + (i % 2) * 40}%`,
                fontSize: "2rem",
              }}
            >
              {emoji}
            </motion.div>
          ))}
        </>
      )}

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
            background: "rgba(255, 69, 58, 0.15)",
            marginBottom: "1.5rem",
            color: colors.danger,
            fontSize: "13px",
            fontWeight: 600,
            letterSpacing: "1.5px",
            border: `1px solid ${colors.danger}30`,
          }}
        >
          RTU OOP UNIT 5 — PART 1
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            fontSize: "4rem",
            fontWeight: 700,
            letterSpacing: "-0.03em",
            background: `linear-gradient(180deg, #FFFFFF 0%, ${colors.danger} 100%)`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            margin: 0,
          }}
        >
          {"Exception Handling".split("").map((char, i) => (
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
                color: colors.warning,
                fontSize: "1.4rem",
                marginTop: "1.2rem",
                fontWeight: 500,
              }}
            >
              Handling Runtime Errors Safely
            </motion.p>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

// ============================================
// SCENE 28: What Is an Error?
// ============================================
const Scene28 = () => {
  const [visibleCount, setVisibleCount] = useState(0);
  const [showDanger, setShowDanger] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisibleCount((c) => (c < 4 ? c + 1 : c));
    }, 700);
    const dangerTimer = setTimeout(() => setShowDanger(true), 3500);
    return () => {
      clearInterval(interval);
      clearTimeout(dangerTimer);
    };
  }, []);

  const errors = [
    { text: "Divide by zero", icon: "➗" },
    { text: "File not found", icon: "📁" },
    { text: "Invalid input", icon: "⌨️" },
    { text: "Out of memory", icon: "💾" },
  ];

  return (
    <div style={containerStyle}>
      <motion.div
        animate={{
          backgroundColor: showDanger
            ? "rgba(255, 69, 58, 0.05)"
            : "transparent",
        }}
        style={{
          position: "absolute",
          inset: 0,
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
          💥 THINGS THAT GO WRONG
        </motion.div>

        <div
          style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}
        >
          {errors.slice(0, visibleCount).map((error, i) => (
            <motion.div
              key={error.text}
              initial={{ opacity: 0, x: -30 }}
              animate={{
                opacity: 1,
                x: 0,
                // Shake effect
              }}
              transition={{ duration: 0.4 }}
              style={{
                padding: "16px 28px",
                borderRadius: "16px",
                background: "rgba(255, 69, 58, 0.1)",
                border: "1px solid rgba(255, 69, 58, 0.3)",
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                minWidth: "280px",
              }}
            >
              <span style={{ fontSize: "1.5rem" }}>{error.icon}</span>
              <span
                style={{
                  color: colors.danger,
                  fontWeight: 600,
                  fontSize: "16px",
                }}
              >
                {error.text}
              </span>
            </motion.div>
          ))}
        </div>

        <AnimatePresence>
          {showDanger && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{
                padding: "14px 28px",
                borderRadius: "100px",
                background: colors.danger,
                color: "white",
                fontWeight: 700,
                fontSize: "15px",
              }}
            >
              🚨 Programs can crash!
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// ============================================
// SCENE 29: Crash Example
// ============================================
const Scene29 = () => {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 1000),
      setTimeout(() => setPhase(2), 2000),
      setTimeout(() => setPhase(3), 3000),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div style={containerStyle}>
      {/* Crack/red overlay */}
      <motion.div
        animate={{
          opacity: phase >= 2 ? 1 : 0,
          background: phase >= 3 ? "rgba(255, 69, 58, 0.2)" : "transparent",
        }}
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 5,
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
          💀 CRASH EXAMPLE
        </motion.div>

        <motion.div
          animate={{
            scale: phase >= 2 ? [1, 1.02, 0.98, 1] : 1,
            rotate: phase >= 2 ? [0, -1, 1, 0] : 0,
          }}
          transition={{ duration: 0.3 }}
        >
          <GlassCard
            glow={phase >= 2 ? colors.danger : null}
            style={{
              borderColor:
                phase >= 2 ? colors.danger : "rgba(255,255,255,0.12)",
            }}
          >
            <div
              style={{
                fontFamily: "'SF Mono', monospace",
                fontSize: "16px",
                lineHeight: 1.8,
              }}
            >
              <motion.div
                animate={{ color: phase >= 1 ? colors.typeInt : colors.text }}
              >
                <span style={{ color: colors.typeInt }}>int</span> a = 10;
              </motion.div>
              <motion.div
                animate={{
                  color: phase >= 1 ? colors.danger : colors.text,
                  textShadow: phase >= 1 ? `0 0 10px ${colors.danger}` : "none",
                }}
              >
                <span style={{ color: colors.typeInt }}>int</span> b =
                <span style={{ color: colors.danger, fontWeight: 700 }}>
                  {" "}
                  0
                </span>
                ;
              </motion.div>
              <motion.div
                animate={{
                  backgroundColor:
                    phase >= 2 ? "rgba(255, 69, 58, 0.2)" : "transparent",
                }}
                style={{
                  padding: "4px 8px",
                  borderRadius: "4px",
                  marginTop: "4px",
                }}
              >
                cout {"<<"} a / b;
              </motion.div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Crash text */}
        <AnimatePresence>
          {phase >= 3 && (
            <motion.div
              initial={{ opacity: 0, scale: 2 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{
                fontSize: "2.5rem",
                fontWeight: 800,
                color: colors.danger,
                textShadow: `0 0 30px ${colors.danger}`,
              }}
            >
              💥 PROGRAM CRASHED
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// ============================================
// SCENE 30: Traditional Problem
// ============================================
const Scene30 = () => {
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
            color: colors.danger,
            fontWeight: 700,
            fontSize: "13px",
            letterSpacing: "1.5px",
          }}
        >
          😢 THE TRADITIONAL PROBLEM
        </motion.div>

        {/* Program window fading */}
        <motion.div
          animate={{
            opacity: phase >= 1 ? 0.3 : 1,
            scale: phase >= 1 ? 0.95 : 1,
            filter: phase >= 1 ? "grayscale(100%)" : "none",
          }}
          transition={{ duration: 1 }}
          style={{
            width: "300px",
            height: "180px",
            background: "linear-gradient(180deg, #3a3a3c 0%, #1c1c1e 100%)",
            borderRadius: "16px",
            border: "1px solid rgba(255,255,255,0.1)",
            padding: "12px",
            position: "relative",
          }}
        >
          {/* Window title bar */}
          <div style={{ display: "flex", gap: "6px", marginBottom: "12px" }}>
            <div
              style={{
                width: "12px",
                height: "12px",
                borderRadius: "50%",
                background: "#ff5f57",
              }}
            />
            <div
              style={{
                width: "12px",
                height: "12px",
                borderRadius: "50%",
                background: "#febc2e",
              }}
            />
            <div
              style={{
                width: "12px",
                height: "12px",
                borderRadius: "50%",
                background: "#28c840",
              }}
            />
          </div>

          {/* Content that fades */}
          <motion.div
            animate={{ opacity: phase >= 2 ? 0 : 1 }}
            style={{
              color: colors.textSec,
              fontSize: "12px",
              fontFamily: "'SF Mono', monospace",
            }}
          >
            Running program...
            <br />
            Processing user data...
            <br />
            <span style={{ color: colors.success }}>✓</span> Connected to
            database
          </motion.div>
        </motion.div>

        {/* Error message */}
        <AnimatePresence>
          {phase >= 1 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                padding: "16px 32px",
                borderRadius: "16px",
                background: "rgba(255, 69, 58, 0.15)",
                border: `2px solid ${colors.danger}`,
                color: colors.danger,
                fontWeight: 600,
                fontSize: "16px",
                display: "flex",
                alignItems: "center",
                gap: "12px",
              }}
            >
              ❌ Program terminated unexpectedly
            </motion.div>
          )}
        </AnimatePresence>

        {/* User data gone */}
        <AnimatePresence>
          {phase >= 2 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{
                color: colors.textSec,
                fontSize: "14px",
                fontStyle: "italic",
              }}
            >
              User data... gone. No explanation. 😞
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// ============================================
// SCENE 31: The Idea of Protection
// ============================================
const Scene31 = () => {
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
          🛡️ THE SOLUTION: PROTECTION
        </motion.div>

        {/* Code with shield */}
        <div style={{ position: "relative" }}>
          {/* Shield overlay */}
          <AnimatePresence>
            {phase >= 1 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{
                  position: "absolute",
                  inset: "-20px",
                  border: `3px solid ${colors.success}`,
                  borderRadius: "28px",
                  boxShadow: `
                    0 0 30px ${colors.success}40,
                    inset 0 0 30px ${colors.success}10
                  `,
                  zIndex: 5,
                }}
              />
            )}
          </AnimatePresence>

          <GlassCard>
            <div
              style={{
                fontFamily: "'SF Mono', monospace",
                fontSize: "14px",
                color: colors.text,
                textAlign: "center",
                padding: "1rem",
              }}
            >
              <div style={{ color: colors.textSec, marginBottom: "0.5rem" }}>
                // Risky code here
              </div>
              <div>a / b</div>
              <div>file.open()</div>
              <div>new int[size]</div>
            </div>
          </GlassCard>
        </div>

        {/* Label */}
        <AnimatePresence>
          {phase >= 2 && (
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
              🛡️ Protect risky code with exception handling!
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// ============================================
// SCENE 32: Three Keywords
// ============================================
const Scene32 = () => {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 600),
      setTimeout(() => setPhase(2), 1200),
      setTimeout(() => setPhase(3), 1800),
      setTimeout(() => setPhase(4), 2600),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  const keywords = [
    { word: "try", color: colors.primary, desc: "Attempt risky code" },
    { word: "throw", color: colors.warning, desc: "Signal an error" },
    { word: "catch", color: colors.success, desc: "Handle the error" },
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
          🔑 THREE MAGIC KEYWORDS
        </motion.div>

        {/* Keywords */}
        <div style={{ display: "flex", gap: "2rem" }}>
          {keywords.map((kw, i) => (
            <motion.div
              key={kw.word}
              initial={{ opacity: 0, y: 30 }}
              animate={{
                opacity: phase > i ? 1 : 0,
                y: 0,
              }}
              transition={{ type: "spring", stiffness: 150 }}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "0.75rem",
              }}
            >
              <motion.div
                animate={{
                  boxShadow: phase >= 4 ? `0 10px 30px ${kw.color}40` : "none",
                }}
                style={{
                  padding: "20px 35px",
                  borderRadius: "20px",
                  background: `${kw.color}15`,
                  border: `2px solid ${kw.color}`,
                  fontFamily: "'SF Mono', monospace",
                  fontSize: "1.8rem",
                  fontWeight: 700,
                  color: kw.color,
                }}
              >
                {kw.word}
              </motion.div>
              <span style={{ color: colors.textSec, fontSize: "12px" }}>
                {kw.desc}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Flow diagram */}
        <AnimatePresence>
          {phase >= 4 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                padding: "16px 28px",
                borderRadius: "16px",
                background: "#1c1c1e",
              }}
            >
              <span
                style={{
                  color: colors.primary,
                  fontFamily: "'SF Mono', monospace",
                  fontWeight: 600,
                }}
              >
                try
              </span>
              <motion.span
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1, repeat: Infinity }}
                style={{ color: colors.textSec }}
              >
                →
              </motion.span>
              <span
                style={{
                  color: colors.warning,
                  fontFamily: "'SF Mono', monospace",
                  fontWeight: 600,
                }}
              >
                throw
              </span>
              <motion.span
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1, repeat: Infinity, delay: 0.3 }}
                style={{ color: colors.textSec }}
              >
                →
              </motion.span>
              <span
                style={{
                  color: colors.success,
                  fontFamily: "'SF Mono', monospace",
                  fontWeight: 600,
                }}
              >
                catch
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// ============================================
// SCENE 33: First try-catch Example
// ============================================
const Scene33 = () => {
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
            color: colors.primary,
            fontWeight: 700,
            fontSize: "13px",
            letterSpacing: "1.5px",
          }}
        >
          📝 FIRST TRY-CATCH EXAMPLE
        </motion.div>

        <div style={{ display: "flex", gap: "2rem", alignItems: "flex-start" }}>
          {/* Try block */}
          <motion.div
            animate={{
              borderColor:
                phase >= 1 ? colors.primary : "rgba(255,255,255,0.12)",
            }}
          >
            <GlassCard glow={phase >= 1 ? colors.primary : null}>
              <div
                style={{
                  color: colors.primary,
                  fontSize: "12px",
                  fontWeight: 600,
                  marginBottom: "0.5rem",
                }}
              >
                TRY BLOCK
              </div>
              <div
                style={{
                  fontFamily: "'SF Mono', monospace",
                  fontSize: "14px",
                  lineHeight: 1.7,
                }}
              >
                <div style={{ color: colors.primary }}>try {"{"}</div>
                <motion.div
                  animate={{
                    backgroundColor:
                      phase >= 2 ? "rgba(255, 159, 10, 0.2)" : "transparent",
                  }}
                  style={{ paddingLeft: "1rem", borderRadius: "4px" }}
                >
                  <span style={{ color: colors.keyword }}>if</span>(b==0)
                  <span style={{ color: colors.warning }}> throw</span> "Error";
                </motion.div>
                <div style={{ color: colors.primary }}>{"}"}</div>
              </div>
            </GlassCard>
          </motion.div>

          {/* Arrow */}
          <AnimatePresence>
            {phase >= 2 && (
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{
                  alignSelf: "center",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <motion.div
                  animate={{
                    x: [0, 20, 0],
                    y: [0, 10, 0],
                  }}
                  transition={{ duration: 1, repeat: 2 }}
                  style={{
                    fontSize: "1.5rem",
                    color: colors.warning,
                  }}
                >
                  ⚡→
                </motion.div>
                <span style={{ color: colors.textSec, fontSize: "10px" }}>
                  exception
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Catch block */}
          <motion.div
            animate={{
              borderColor:
                phase >= 3 ? colors.success : "rgba(255,255,255,0.12)",
            }}
          >
            <GlassCard glow={phase >= 3 ? colors.success : null}>
              <div
                style={{
                  color: colors.success,
                  fontSize: "12px",
                  fontWeight: 600,
                  marginBottom: "0.5rem",
                }}
              >
                CATCH BLOCK
              </div>
              <div
                style={{
                  fontFamily: "'SF Mono', monospace",
                  fontSize: "14px",
                  lineHeight: 1.7,
                }}
              >
                <div style={{ color: colors.success }}>
                  catch(
                  <span style={{ color: colors.typeString }}>const char*</span>{" "}
                  msg) {"{"}
                </div>
                <motion.div
                  animate={{
                    backgroundColor:
                      phase >= 3 ? "rgba(48, 209, 88, 0.2)" : "transparent",
                  }}
                  style={{ paddingLeft: "1rem", borderRadius: "4px" }}
                >
                  cout {"<<"} msg;
                </motion.div>
                <div style={{ color: colors.success }}>{"}"}</div>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

// ============================================
// SCENE 34: Normal Flow vs Exception Flow
// ============================================
const Scene34 = () => {
  const [showExceptionPath, setShowExceptionPath] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowExceptionPath(true), 1500);
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
          🔀 TWO POSSIBLE PATHS
        </motion.div>

        <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
          {/* Normal Flow */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              padding: "16px 24px",
              borderRadius: "16px",
              background: `${colors.success}10`,
              border: `1px solid ${colors.success}30`,
            }}
          >
            <span style={{ color: colors.success, fontWeight: 600 }}>
              Normal:
            </span>
            <div
              style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}
            >
              <span
                style={{
                  color: colors.primary,
                  fontFamily: "'SF Mono', monospace",
                }}
              >
                try
              </span>
              <motion.span
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1, repeat: Infinity }}
                style={{ color: colors.textSec }}
              >
                →
              </motion.span>
              <span
                style={{
                  color: colors.textSec,
                  fontFamily: "'SF Mono', monospace",
                }}
              >
                (no error)
              </span>
              <span style={{ color: colors.textSec }}>→</span>
              <span
                style={{
                  color: colors.success,
                  fontFamily: "'SF Mono', monospace",
                }}
              >
                continue ✓
              </span>
            </div>
          </motion.div>

          {/* Exception Flow */}
          <AnimatePresence>
            {showExceptionPath && (
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                  padding: "16px 24px",
                  borderRadius: "16px",
                  background: `${colors.warning}10`,
                  border: `1px solid ${colors.warning}30`,
                }}
              >
                <span style={{ color: colors.warning, fontWeight: 600 }}>
                  Error:
                </span>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                  }}
                >
                  <span
                    style={{
                      color: colors.primary,
                      fontFamily: "'SF Mono', monospace",
                    }}
                  >
                    try
                  </span>
                  <span style={{ color: colors.textSec }}>→</span>
                  <motion.span
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                    style={{
                      color: colors.warning,
                      fontFamily: "'SF Mono', monospace",
                    }}
                  >
                    throw ⚡
                  </motion.span>
                  <motion.span
                    animate={{ y: [0, -5, 10, 0] }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                    style={{ color: colors.textSec }}
                  >
                    ↘
                  </motion.span>
                  <span
                    style={{
                      color: colors.success,
                      fontFamily: "'SF Mono', monospace",
                    }}
                  >
                    catch
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          style={{
            color: colors.textSec,
            fontSize: "14px",
            fontStyle: "italic",
          }}
        >
          If no error, catch block is skipped!
        </motion.div>
      </div>
    </div>
  );
};

// ============================================
// SCENE 35: What Can Be Thrown?
// ============================================
const Scene35 = () => {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPhase((p) => (p < 3 ? p + 1 : p));
    }, 900);
    return () => clearInterval(interval);
  }, []);

  const throwables = [
    { code: "throw 10;", value: "10", type: "int", color: colors.typeInt },
    {
      code: 'throw "File not found";',
      value: '"File not found"',
      type: "string",
      color: colors.typeString,
    },
    {
      code: "throw 3.14;",
      value: "3.14",
      type: "double",
      color: colors.typeDouble,
    },
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
            color: colors.warning,
            fontWeight: 700,
            fontSize: "13px",
            letterSpacing: "1.5px",
          }}
        >
          🎯 WHAT CAN BE THROWN?
        </motion.div>

        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {throwables.map((item, i) => (
            <motion.div
              key={item.code}
              initial={{ opacity: 0, x: -30 }}
              animate={{
                opacity: phase > i ? 1 : 0,
                x: 0,
              }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
              }}
            >
              <GlassCard style={{ padding: "12px 20px" }}>
                <code
                  style={{
                    fontFamily: "'SF Mono', monospace",
                    fontSize: "14px",
                    color: colors.text,
                  }}
                >
                  <span style={{ color: colors.warning }}>throw</span>{" "}
                  {item.value};
                </code>
              </GlassCard>

              {phase > i && (
                <motion.div
                  initial={{ opacity: 0, x: 20, scale: 0 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  transition={{ type: "spring" }}
                  style={{
                    padding: "8px 16px",
                    borderRadius: "100px",
                    background: `${item.color}20`,
                    border: `2px solid ${item.color}`,
                    color: item.color,
                    fontWeight: 600,
                    fontSize: "13px",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <motion.span
                    animate={{ x: [0, 10, 0] }}
                    transition={{ duration: 0.8, repeat: 2 }}
                  >
                    →
                  </motion.span>
                  {item.type}
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5 }}
          style={{
            color: colors.textSec,
            fontSize: "14px",
            fontStyle: "italic",
          }}
        >
          Anything can become an "error object"!
        </motion.div>
      </div>
    </div>
  );
};

// ============================================
// SCENE 36: Type Matching in catch
// ============================================
const Scene36 = () => {
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
          🔐 TYPE MUST MATCH
        </motion.div>

        {/* Throw statement */}
        <GlassCard>
          <code
            style={{ fontFamily: "'SF Mono', monospace", fontSize: "18px" }}
          >
            <span style={{ color: colors.warning }}>throw</span>
            <span style={{ color: colors.typeInt, fontWeight: 700 }}> 10</span>;
          </code>
        </GlassCard>

        {/* Key-lock visualizations */}
        <div style={{ display: "flex", gap: "3rem" }}>
          {/* int catch - SUCCESS */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: phase >= 1 ? 1 : 0, y: 0 }}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "0.75rem",
            }}
          >
            <div
              style={{
                padding: "12px 20px",
                borderRadius: "12px",
                background: `${colors.success}15`,
                border: `2px solid ${colors.success}`,
                fontFamily: "'SF Mono', monospace",
                fontSize: "14px",
                color: colors.success,
              }}
            >
              catch(<span style={{ color: colors.typeInt }}>int</span> e)
            </div>
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 0.5, repeat: 2 }}
              style={{ fontSize: "2rem" }}
            >
              ✅
            </motion.div>
            <span
              style={{
                color: colors.success,
                fontSize: "13px",
                fontWeight: 600,
              }}
            >
              Types match!
            </span>
          </motion.div>

          {/* double catch - FAIL */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: phase >= 2 ? 1 : 0, y: 0 }}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "0.75rem",
            }}
          >
            <div
              style={{
                padding: "12px 20px",
                borderRadius: "12px",
                background: `${colors.danger}15`,
                border: `2px solid ${colors.danger}`,
                fontFamily: "'SF Mono', monospace",
                fontSize: "14px",
                color: colors.danger,
              }}
            >
              catch(<span style={{ color: colors.typeDouble }}>double</span> e)
            </div>
            <motion.div
              animate={{ rotate: [0, -10, 10, 0] }}
              transition={{ duration: 0.3, repeat: 2 }}
              style={{ fontSize: "2rem" }}
            >
              ❌
            </motion.div>
            <span
              style={{
                color: colors.danger,
                fontSize: "13px",
                fontWeight: 600,
              }}
            >
              Wrong type!
            </span>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

// ============================================
// SCENE 37: Multiple Catch Blocks
// ============================================
const Scene37 = () => {
  const [fallingPhase, setFallingPhase] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setFallingPhase((p) => (p < 4 ? p + 1 : p));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const catches = [
    { type: "int", color: colors.typeInt },
    { type: "double", color: colors.typeDouble },
    { type: "...", color: colors.accent },
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
            color: colors.accent,
            fontWeight: 700,
            fontSize: "13px",
            letterSpacing: "1.5px",
          }}
        >
          📥 MULTIPLE CATCH BLOCKS
        </motion.div>

        <div style={{ display: "flex", gap: "2rem", alignItems: "flex-start" }}>
          {/* Falling exception */}
          <div style={{ position: "relative", height: "250px", width: "80px" }}>
            <motion.div
              animate={{
                y: fallingPhase >= 1 ? (fallingPhase >= 2 ? 180 : 60) : 0,
              }}
              style={{
                position: "absolute",
                top: 0,
                left: "50%",
                transform: "translateX(-50%)",
                padding: "10px 16px",
                borderRadius: "100px",
                background: colors.typeString,
                color: "#000",
                fontWeight: 700,
                fontSize: "12px",
              }}
            >
              "error"
            </motion.div>
          </div>

          {/* Catch blocks stacked */}
          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
          >
            {catches.map((c, i) => (
              <motion.div
                key={c.type}
                animate={{
                  borderColor:
                    fallingPhase >= 3 && i === 2
                      ? colors.success
                      : `${c.color}50`,
                  boxShadow:
                    fallingPhase >= 3 && i === 2
                      ? `0 0 20px ${colors.success}50`
                      : "none",
                }}
                style={{
                  padding: "14px 20px",
                  borderRadius: "12px",
                  background: `${c.color}10`,
                  border: `2px solid ${c.color}50`,
                  fontFamily: "'SF Mono', monospace",
                  fontSize: "14px",
                  color: c.color,
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                catch({c.type})
                {fallingPhase >= 3 && i === 2 && (
                  <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }}>
                    ✓
                  </motion.span>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: fallingPhase >= 3 ? 1 : 0 }}
          style={{
            padding: "12px 24px",
            borderRadius: "100px",
            background: `${colors.accent}15`,
            border: `1px solid ${colors.accent}40`,
            color: colors.accent,
            fontWeight: 600,
            fontSize: "14px",
          }}
        >
          catch(...) catches everything! 🎣
        </motion.div>
      </div>
    </div>
  );
};

// ============================================
// SCENE 38: Default Catch (...)
// ============================================
const Scene38 = () => {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPhase((p) => (p < 4 ? p + 1 : 0));
    }, 800);
    return () => clearInterval(interval);
  }, []);

  const errorTypes = ["int", "string", "double", "???"];

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
          🎯 THE CATCH-ALL
        </motion.div>

        {/* Big net visualization */}
        <div style={{ position: "relative", height: "200px", width: "350px" }}>
          {/* Falling errors */}
          {errorTypes.map((type, i) => (
            <motion.div
              key={type}
              animate={{
                y: phase > i ? 140 : 0,
                opacity: phase > i ? 0 : 1,
              }}
              transition={{ duration: 0.5 }}
              style={{
                position: "absolute",
                top: 0,
                left: `${20 + i * 25}%`,
                padding: "8px 14px",
                borderRadius: "8px",
                background: colors.warning,
                color: "#000",
                fontWeight: 600,
                fontSize: "12px",
              }}
            >
              {type}
            </motion.div>
          ))}

          {/* Net / catch(...) */}
          <motion.div
            style={{
              position: "absolute",
              bottom: 0,
              left: "50%",
              transform: "translateX(-50%)",
              width: "280px",
              height: "80px",
              borderRadius: "0 0 50% 50%",
              background: `linear-gradient(180deg, ${colors.accent}30, ${colors.accent}10)`,
              border: `3px solid ${colors.accent}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span
              style={{
                fontFamily: "'SF Mono', monospace",
                fontSize: "1.5rem",
                fontWeight: 700,
                color: colors.accent,
              }}
            >
              catch(...)
            </span>
          </motion.div>
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
          The "unknown error" safety net 🥅
        </motion.div>
      </div>
    </div>
  );
};

// ============================================
// SCENE 39: Exception from Function & Stack Unwinding
// ============================================
const Scene39 = () => {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPhase((p) => (p < 5 ? p + 1 : p));
    }, 900);
    return () => clearInterval(interval);
  }, []);

  const stack = ["main()", "func1()", "func2()", "divide()"];

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
            color: colors.warning,
            fontWeight: 700,
            fontSize: "13px",
            letterSpacing: "1.5px",
          }}
        >
          📚 STACK UNWINDING
        </motion.div>

        {/* Call stack */}
        <div
          style={{
            display: "flex",
            flexDirection: "column-reverse",
            gap: "4px",
          }}
        >
          {stack.map((fn, i) => (
            <motion.div
              key={fn}
              initial={{ opacity: 1, x: 0 }}
              animate={{
                opacity:
                  phase >= 2 && i > stack.length - 1 - (phase - 1) ? 0 : 1,
                x: phase >= 2 && i > stack.length - 1 - (phase - 1) ? 50 : 0,
                backgroundColor:
                  phase >= 1 && i === stack.length - 1
                    ? "rgba(255, 69, 58, 0.2)"
                    : i === 0 && phase >= 4
                      ? "rgba(48, 209, 88, 0.2)"
                      : "rgba(255,255,255,0.05)",
              }}
              style={{
                padding: "14px 24px",
                borderRadius: "12px",
                border: `1px solid ${
                  phase >= 1 && i === stack.length - 1
                    ? colors.danger
                    : i === 0 && phase >= 4
                      ? colors.success
                      : "rgba(255,255,255,0.1)"
                }`,
                fontFamily: "'SF Mono', monospace",
                fontSize: "14px",
                color: colors.text,
                minWidth: "150px",
                textAlign: "center",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              {fn}
              {phase >= 1 && i === stack.length - 1 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  style={{ color: colors.danger, marginLeft: "8px" }}
                >
                  throw! ⚡
                </motion.span>
              )}
              {i === 0 && phase >= 4 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  style={{ color: colors.success, marginLeft: "8px" }}
                >
                  catch ✓
                </motion.span>
              )}
            </motion.div>
          ))}
        </div>

        {/* Exception traveling */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: phase >= 2 ? 1 : 0 }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            color: colors.textSec,
            fontSize: "13px",
          }}
        >
          <motion.span
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 0.5, repeat: Infinity }}
          >
            ⬆️
          </motion.span>
          Exception travels up, functions clean up
        </motion.div>
      </div>
    </div>
  );
};

// ============================================
// EXPORTS
// ============================================
export const AnimationStepsPart4 = [
  {
    title: "Exception Handling Intro",
    component: Scene27,
    contentText:
      "Introduction to Exception Handling in C++. Part 2 of RTU OOP Unit 5. Topic: Handling Runtime Errors Safely. This section covers how to protect your programs from unexpected errors and crashes.",
  },
  {
    title: "What Is an Error?",
    component: Scene28,
    contentText:
      "What is an Error? Types of errors that can occur: Divide by zero, File not found, Invalid input, Out of memory. These are runtime errors that crash programs if not handled properly.",
  },
  {
    title: "Crash Example",
    component: Scene29,
    contentText:
      "Crash Example in C++: int a = 10; int b = 0; cout << a / b; This code causes PROGRAM CRASHED because we tried to divide by zero without protection.",
  },
  {
    title: "Traditional Problem",
    component: Scene30,
    contentText:
      "The Traditional Problem: Without exception handling, when an error occurs during program execution (like processing user data or database connection), the program terminates unexpectedly without any graceful recovery.",
  },
  {
    title: "The Idea of Protection",
    component: Scene31,
    contentText:
      "The Solution - Protection: We wrap risky code like a/b, file.open(), new int[size] in protection blocks. Exception handling lets us protect risky code and handle errors gracefully instead of crashing.",
  },
  {
    title: "Three Keywords",
    component: Scene32,
    contentText:
      "Three Magic Keywords in C++ Exception Handling: 1) try - Attempt risky code, 2) throw - Signal an error has occurred, 3) catch - Handle the error. These three work together to manage exceptions.",
  },
  {
    title: "First try-catch Example",
    component: Scene33,
    contentText:
      'First try-catch Example: TRY BLOCK contains risky code like if(b==0) throw "Error"; CATCH BLOCK handles it with catch(const char* msg). If b is zero, we throw an error message that catch receives.',
  },
  {
    title: "Normal vs Exception Flow",
    component: Scene34,
    contentText:
      "Two Possible Paths in Exception Handling: Normal Path: try block runs, no error occurs, program continues. Exception Path: try block runs, throw is triggered, catch block handles it, then program continues.",
  },
  {
    title: "What Can Be Thrown?",
    component: Scene35,
    contentText:
      'What Can Be Thrown? You can throw different types: throw 10 (int), throw "File not found" (string/const char*), throw 3.14 (double), throw MyException() (custom objects). Any type can be thrown.',
  },
  {
    title: "Type Matching in catch",
    component: Scene36,
    contentText:
      'Type Matching: The thrown type must match the catch parameter type. throw 10 matches catch(int), throw "error" matches catch(const char*). Wrong type = not caught by that catch block.',
  },
  {
    title: "Multiple Catch Blocks",
    component: Scene37,
    contentText:
      "Multiple Catch Blocks: You can have multiple catch blocks for different types: catch(int), catch(const char*), catch(double). Each handles a different type of thrown exception.",
  },
  {
    title: "Default Catch (...)",
    component: Scene38,
    contentText:
      "Default Catch with catch(...): The ellipsis catch block catch(...) catches ANY exception type. It's a safety net for unknown exceptions. Place it last after specific catch blocks.",
  },
  {
    title: "Stack Unwinding",
    component: Scene39,
    contentText:
      "Stack Unwinding: When exception is thrown, the call stack unwinds. If funcC throws, it propagates to funcB, then funcA, then main until a catch block handles it. Destructors are called automatically during unwinding.",
  },
];

export default { AnimationStepsPart4 };
