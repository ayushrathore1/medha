/**
 * FileHandlingPart1 - Scenes 79-91 (Continuing from Stream Classes)
 * OOPS Unit 5: File Handling in C++ - One Shot Lecture
 * Covers: Title, What is File, Why Files, Exam Focus, Steps,
 *         File Streams, fstream Header, Create File, Write Data,
 *         Close File, Full Write Program, Open for Reading, Read Wrong Way
 */
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { colors, containerStyle } from "./TemplatesUnit5Theme";
import { GlassCard, CodeBlock } from "./TemplatesOneShotPart1";

// ============================================
// SCENE 79: File Handling Title
// ============================================
const Scene79 = () => {
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
            "radial-gradient(ellipse at center, rgba(255, 159, 10, 0.1) 0%, transparent 70%)",
        }}
      />

      {/* Icons */}
      <AnimatePresence>
        {phase >= 3 && (
          <>
            {/* RAM fading */}
            <motion.div
              initial={{ opacity: 0.6 }}
              animate={{ opacity: 0.1 }}
              transition={{ duration: 2 }}
              style={{
                position: "absolute",
                left: "20%",
                top: "40%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              <span style={{ fontSize: "3rem" }}>💨</span>
              <span style={{ color: colors.textSec, fontSize: "12px" }}>
                RAM (temporary)
              </span>
            </motion.div>

            {/* Disk glowing */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{
                opacity: 1,
                scale: [1, 1.1, 1],
              }}
              transition={{
                scale: { duration: 2, repeat: Infinity },
              }}
              style={{
                position: "absolute",
                right: "20%",
                top: "40%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              <span style={{ fontSize: "3rem" }}>💾</span>
              <span
                style={{
                  color: colors.secondary,
                  fontSize: "12px",
                  fontWeight: 600,
                }}
              >
                Disk (permanent)
              </span>
            </motion.div>
          </>
        )}
      </AnimatePresence>

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
            background: "rgba(255, 159, 10, 0.15)",
            marginBottom: "1.5rem",
            color: colors.secondary,
            fontSize: "13px",
            fontWeight: 600,
            letterSpacing: "1.5px",
            border: `1px solid ${colors.secondary}30`,
          }}
        >
          RTU OOP UNIT 5 — PART 4
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            fontSize: "4rem",
            fontWeight: 700,
            letterSpacing: "-0.03em",
            background: `linear-gradient(180deg, #FFFFFF 0%, ${colors.secondary} 100%)`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            margin: 0,
          }}
        >
          {"File Handling".split("").map((char, i) => (
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
              Permanent Storage of Data
            </motion.p>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

// ============================================
// SCENE 80: What Is a File?
// ============================================
const Scene80 = () => {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 800),
      setTimeout(() => setPhase(2), 2000),
      setTimeout(() => setPhase(3), 3200),
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
          📁 WHAT IS A FILE?
        </motion.div>

        {/* Definition */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{
            fontSize: "2rem",
            fontWeight: 700,
            color: colors.text,
            textAlign: "center",
          }}
        >
          File ={" "}
          <span style={{ color: colors.secondary }}>Permanent Storage</span> on
          Disk
        </motion.div>

        {/* Comparison */}
        <div style={{ display: "flex", gap: "3rem" }}>
          {/* RAM - disappears */}
          <motion.div
            animate={{ opacity: phase >= 2 ? 0.3 : 1 }}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "1rem",
            }}
          >
            <motion.div
              animate={{
                scale: phase >= 1 ? 1 : 0.8,
                y: phase >= 2 ? [0, -10, 50] : 0,
                opacity: phase >= 2 ? [1, 0.5, 0] : 1,
              }}
              style={{
                width: "80px",
                height: "80px",
                borderRadius: "16px",
                background: `${colors.primary}20`,
                border: `2px solid ${colors.primary}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "2rem",
              }}
            >
              💨
            </motion.div>
            <span style={{ color: colors.textSec, fontSize: "14px" }}>RAM</span>
            {phase >= 2 && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{ color: colors.danger, fontSize: "12px" }}
              >
                Data disappears ❌
              </motion.span>
            )}
          </motion.div>

          {/* File - stays */}
          <motion.div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "1rem",
            }}
          >
            <motion.div
              animate={{
                scale: phase >= 3 ? 1.1 : 1,
                boxShadow:
                  phase >= 3 ? `0 0 30px ${colors.secondary}50` : "none",
              }}
              style={{
                width: "80px",
                height: "80px",
                borderRadius: "16px",
                background: `${colors.secondary}20`,
                border: `2px solid ${colors.secondary}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "2rem",
              }}
            >
              📁
            </motion.div>
            <span
              style={{
                color: colors.secondary,
                fontSize: "14px",
                fontWeight: 600,
              }}
            >
              File
            </span>
            {phase >= 3 && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{ color: colors.success, fontSize: "12px" }}
              >
                Data stays! ✓
              </motion.span>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

// ============================================
// SCENE 81: Why Files Are Needed
// ============================================
const Scene81 = () => {
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
            color: colors.warning,
            fontWeight: 700,
            fontSize: "13px",
            letterSpacing: "1.5px",
          }}
        >
          ❓ WHY FILES?
        </motion.div>

        <div style={{ display: "flex", gap: "3rem" }}>
          {/* Variables - Temporary */}
          <motion.div
            animate={{ opacity: phase >= 2 ? 0.4 : 1 }}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "1rem",
            }}
          >
            <GlassCard glow={colors.danger}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>
                  📦
                </div>
                <div
                  style={{
                    fontFamily: "'SF Mono', monospace",
                    fontSize: "16px",
                    color: colors.text,
                  }}
                >
                  Variables
                </div>
              </div>
            </GlassCard>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: phase >= 1 ? 1 : 0 }}
              style={{
                padding: "8px 16px",
                borderRadius: "100px",
                background: `${colors.danger}20`,
                border: `1px solid ${colors.danger}40`,
                color: colors.danger,
                fontWeight: 600,
                fontSize: "14px",
              }}
            >
              Temporary ⏱️
            </motion.div>
          </motion.div>

          {/* Files - Permanent */}
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
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>
                  📁
                </div>
                <div
                  style={{
                    fontFamily: "'SF Mono', monospace",
                    fontSize: "16px",
                    color: colors.text,
                  }}
                >
                  Files
                </div>
              </div>
            </GlassCard>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: phase >= 1 ? 1 : 0 }}
              style={{
                padding: "8px 16px",
                borderRadius: "100px",
                background: `${colors.success}20`,
                border: `1px solid ${colors.success}40`,
                color: colors.success,
                fontWeight: 600,
                fontSize: "14px",
              }}
            >
              Permanent 💾
            </motion.div>
          </motion.div>
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
          Program closes → Variables gone, Files remain!
        </motion.div>
      </div>
    </div>
  );
};

// ============================================
// SCENE 82: Exam Question Focus
// ============================================
const Scene82 = () => {
  const [checkedCount, setCheckedCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCheckedCount((c) => (c < 3 ? c + 1 : c));
    }, 800);
    return () => clearInterval(interval);
  }, []);

  const questions = [
    "What is a file?",
    "Steps of file handling",
    "Write & Read program",
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
            color: colors.danger,
            fontWeight: 700,
            fontSize: "13px",
            letterSpacing: "1.5px",
          }}
        >
          📝 EXAM FOCUS
        </motion.div>

        <GlassCard glow={colors.warning}>
          <div style={{ textAlign: "center", marginBottom: "1rem" }}>
            <span
              style={{
                color: colors.warning,
                fontWeight: 700,
                fontSize: "16px",
              }}
            >
              Exam Question:
            </span>
          </div>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}
          >
            {questions.map((q, i) => (
              <motion.div
                key={q}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.3 }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  padding: "8px 12px",
                  borderRadius: "8px",
                  background:
                    checkedCount > i ? `${colors.success}15` : "transparent",
                }}
              >
                <motion.div
                  animate={{
                    scale: checkedCount > i ? [1, 1.2, 1] : 1,
                  }}
                  style={{
                    width: "24px",
                    height: "24px",
                    borderRadius: "6px",
                    background:
                      checkedCount > i
                        ? colors.success
                        : "rgba(255,255,255,0.1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    fontWeight: 700,
                    fontSize: "14px",
                  }}
                >
                  {checkedCount > i ? "✓" : ""}
                </motion.div>
                <span style={{ color: colors.text, fontSize: "15px" }}>
                  {q}
                </span>
              </motion.div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

// ============================================
// SCENE 83: Steps of File Handling
// ============================================
const Scene83 = () => {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPhase((p) => (p < 4 ? p + 1 : 0));
    }, 1200);
    return () => clearInterval(interval);
  }, []);

  const steps = [
    { num: "1", text: "Open File", icon: "📂" },
    { num: "2", text: "Read / Write", icon: "📝" },
    { num: "3", text: "Close File", icon: "🔒" },
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
            color: colors.primary,
            fontWeight: 700,
            fontSize: "13px",
            letterSpacing: "1.5px",
          }}
        >
          📋 STEPS OF FILE HANDLING
        </motion.div>

        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          {steps.map((step, i) => (
            <React.Fragment key={step.num}>
              <motion.div
                animate={{
                  scale: phase === i + 1 ? 1.1 : 1,
                  boxShadow:
                    phase === i + 1
                      ? `0 10px 30px ${colors.primary}50`
                      : "none",
                }}
                style={{
                  padding: "20px",
                  borderRadius: "20px",
                  background:
                    phase >= i + 1 ? `${colors.primary}20` : "#1c1c1e",
                  border: `2px solid ${phase >= i + 1 ? colors.primary : "rgba(255,255,255,0.1)"}`,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "0.5rem",
                  minWidth: "100px",
                }}
              >
                <span style={{ fontSize: "2rem" }}>{step.icon}</span>
                <span
                  style={{
                    color: phase >= i + 1 ? colors.primary : colors.textSec,
                    fontWeight: 600,
                    fontSize: "14px",
                  }}
                >
                  {step.text}
                </span>
              </motion.div>

              {i < steps.length - 1 && (
                <motion.span
                  animate={{
                    x: phase === i + 1 ? [0, 10, 0] : 0,
                    color: phase === i + 1 ? colors.primary : colors.textSec,
                  }}
                  style={{ fontSize: "1.5rem" }}
                >
                  →
                </motion.span>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

// ============================================
// SCENE 84: File Stream Classes
// ============================================
const Scene84 = () => {
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
          🔧 FILE STREAM CLASSES
        </motion.div>

        <div style={{ display: "flex", gap: "3rem", alignItems: "center" }}>
          {/* ofstream */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: phase >= 1 ? 1 : 0, x: 0 }}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "0.75rem",
            }}
          >
            <div
              style={{
                padding: "16px 28px",
                borderRadius: "16px",
                background: `${colors.success}20`,
                border: `2px solid ${colors.success}`,
                fontFamily: "'SF Mono', monospace",
                fontSize: "20px",
                fontWeight: 700,
                color: colors.success,
              }}
            >
              ofstream
            </div>
            <span style={{ color: colors.textSec, fontSize: "14px" }}>
              → Write to file
            </span>
          </motion.div>

          {/* File in center */}
          <motion.div
            style={{
              fontSize: "4rem",
            }}
          >
            📁
          </motion.div>

          {/* ifstream */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: phase >= 2 ? 1 : 0, x: 0 }}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "0.75rem",
            }}
          >
            <div
              style={{
                padding: "16px 28px",
                borderRadius: "16px",
                background: `${colors.primary}20`,
                border: `2px solid ${colors.primary}`,
                fontFamily: "'SF Mono', monospace",
                fontSize: "20px",
                fontWeight: 700,
                color: colors.primary,
              }}
            >
              ifstream
            </div>
            <span style={{ color: colors.textSec, fontSize: "14px" }}>
              ← Read from file
            </span>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

// ============================================
// SCENE 85: Include Header
// ============================================
const Scene85 = () => {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setPhase(1), 1000);
    return () => clearTimeout(timer);
  }, []);

  const tools = ["ofstream", "ifstream", "fstream"];

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
          📦 INCLUDE HEADER
        </motion.div>

        <GlassCard glow={colors.secondary}>
          <code
            style={{
              fontFamily: "'SF Mono', monospace",
              fontSize: "24px",
              color: colors.secondary,
            }}
          >
            #include {"<fstream>"}
          </code>
        </GlassCard>

        {/* Toolbox */}
        <AnimatePresence>
          {phase >= 1 && (
            <motion.div
              initial={{ opacity: 0, y: 20, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              style={{
                display: "flex",
                gap: "1rem",
              }}
            >
              {tools.map((tool, i) => (
                <motion.div
                  key={tool}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.2 }}
                  style={{
                    padding: "12px 20px",
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
// SCENE 86: Create File (ofstream)
// ============================================
const Scene86 = () => {
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
            color: colors.success,
            fontWeight: 700,
            fontSize: "13px",
            letterSpacing: "1.5px",
          }}
        >
          ✨ CREATE FILE
        </motion.div>

        <GlassCard glow={colors.success}>
          <code
            style={{
              fontFamily: "'SF Mono', monospace",
              fontSize: "18px",
              color: colors.text,
            }}
          >
            <span style={{ color: colors.success }}>ofstream</span>
            {" fout("}
            <span style={{ color: colors.typeString }}>"myfile.txt"</span>
            {");"}
          </code>
        </GlassCard>

        {/* Folder with file appearing */}
        <div style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
          <motion.div
            style={{
              fontSize: "4rem",
            }}
          >
            📂
          </motion.div>

          <AnimatePresence>
            {phase >= 1 && (
              <motion.div
                initial={{ opacity: 0, x: -20, scale: 0.5 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <motion.div
                  animate={{
                    boxShadow:
                      phase >= 2 ? `0 0 30px ${colors.success}50` : "none",
                  }}
                  style={{
                    fontSize: "3rem",
                  }}
                >
                  📄
                </motion.div>
                <span
                  style={{
                    fontFamily: "'SF Mono', monospace",
                    fontSize: "14px",
                    color: colors.success,
                  }}
                >
                  myfile.txt
                </span>
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
          }}
        >
          New file created! Ready for writing ✓
        </motion.div>
      </div>
    </div>
  );
};

// ============================================
// SCENE 87: Write Data to File
// ============================================
const Scene87 = () => {
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
            color: colors.success,
            fontWeight: 700,
            fontSize: "13px",
            letterSpacing: "1.5px",
          }}
        >
          ✍️ WRITE DATA
        </motion.div>

        <GlassCard glow={colors.success}>
          <code
            style={{
              fontFamily: "'SF Mono', monospace",
              fontSize: "18px",
              color: colors.text,
            }}
          >
            fout {"<<"}
            <span style={{ color: colors.typeString }}>"Hello C++"</span>;
          </code>
        </GlassCard>

        {/* Animation */}
        <div style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
          <motion.div
            initial={{ x: 0 }}
            animate={{ x: phase >= 1 ? 100 : 0, opacity: phase >= 2 ? 0 : 1 }}
            transition={{ duration: 1 }}
            style={{
              padding: "12px 20px",
              borderRadius: "12px",
              background: colors.success,
              color: "white",
              fontWeight: 700,
              fontFamily: "'SF Mono', monospace",
            }}
          >
            Hello C++
          </motion.div>

          <motion.div
            animate={{
              boxShadow: phase >= 2 ? `0 0 30px ${colors.success}50` : "none",
            }}
            style={{
              width: "100px",
              height: "120px",
              borderRadius: "16px",
              background: "#1c1c1e",
              border: `2px solid ${phase >= 2 ? colors.success : "rgba(255,255,255,0.1)"}`,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
            }}
          >
            <span style={{ fontSize: "2rem" }}>📄</span>
            {phase >= 2 && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{
                  fontSize: "10px",
                  color: colors.success,
                  fontFamily: "'SF Mono', monospace",
                }}
              >
                Hello C++
              </motion.span>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

// ============================================
// SCENE 88: Close File
// ============================================
const Scene88 = () => {
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
          🔒 CLOSE FILE
        </motion.div>

        <GlassCard glow={colors.warning}>
          <code
            style={{
              fontFamily: "'SF Mono', monospace",
              fontSize: "20px",
              color: colors.text,
            }}
          >
            fout.<span style={{ color: colors.warning }}>close</span>();
          </code>
        </GlassCard>

        {/* File closing animation */}
        <motion.div
          animate={{
            scale: phase >= 1 ? [1, 0.95, 1] : 1,
          }}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "0.75rem",
          }}
        >
          <motion.div
            style={{
              fontSize: "4rem",
            }}
          >
            {phase >= 1 ? "📁" : "📂"}
          </motion.div>

          {phase >= 1 && (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              <span style={{ fontSize: "1.5rem" }}>🔒</span>
              <span
                style={{
                  color: colors.success,
                  fontWeight: 600,
                  fontSize: "14px",
                }}
              >
                Saved & Closed
              </span>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

// ============================================
// SCENE 89: Full Write Program
// ============================================
const Scene89 = () => {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPhase((p) => (p < 4 ? p + 1 : p));
    }, 1000);
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
            color: colors.success,
            fontWeight: 700,
            fontSize: "13px",
            letterSpacing: "1.5px",
          }}
        >
          📝 COMPLETE WRITE PROGRAM
        </motion.div>

        <GlassCard>
          <div
            style={{
              fontFamily: "'SF Mono', monospace",
              fontSize: "15px",
              lineHeight: 2,
            }}
          >
            <motion.div
              animate={{
                backgroundColor:
                  phase === 1 ? "rgba(48, 209, 88, 0.2)" : "transparent",
              }}
              style={{ padding: "4px 8px", borderRadius: "4px" }}
            >
              <span style={{ color: colors.success }}>ofstream</span>
              {" fout("}
              <span style={{ color: colors.typeString }}>"myfile.txt"</span>
              {");"}
            </motion.div>
            <motion.div
              animate={{
                backgroundColor:
                  phase === 2 ? "rgba(48, 209, 88, 0.2)" : "transparent",
              }}
              style={{ padding: "4px 8px", borderRadius: "4px" }}
            >
              fout {"<<"}
              <span style={{ color: colors.typeString }}>"Hello"</span>;
            </motion.div>
            <motion.div
              animate={{
                backgroundColor:
                  phase === 3 ? "rgba(255, 159, 10, 0.2)" : "transparent",
              }}
              style={{ padding: "4px 8px", borderRadius: "4px" }}
            >
              fout.<span style={{ color: colors.warning }}>close</span>();
            </motion.div>
          </div>
        </GlassCard>

        {/* Step indicator */}
        <div style={{ display: "flex", gap: "1rem" }}>
          {["Open", "Write", "Close"].map((step, i) => (
            <motion.div
              key={step}
              animate={{
                scale: phase === i + 1 ? 1.1 : 1,
                backgroundColor:
                  phase > i ? colors.success : "rgba(255,255,255,0.05)",
              }}
              style={{
                padding: "8px 16px",
                borderRadius: "100px",
                color: phase > i ? "white" : colors.textSec,
                fontWeight: 600,
                fontSize: "13px",
              }}
            >
              {phase > i ? "✓" : ""} {step}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ============================================
// SCENE 90: Open File for Reading
// ============================================
const Scene90 = () => {
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
            color: colors.primary,
            fontWeight: 700,
            fontSize: "13px",
            letterSpacing: "1.5px",
          }}
        >
          📖 OPEN FOR READING
        </motion.div>

        <GlassCard glow={colors.primary}>
          <code
            style={{
              fontFamily: "'SF Mono', monospace",
              fontSize: "18px",
              color: colors.text,
            }}
          >
            <span style={{ color: colors.primary }}>ifstream</span>
            {" fin("}
            <span style={{ color: colors.typeString }}>"myfile.txt"</span>
            {");"}
          </code>
        </GlassCard>

        {/* File opening animation */}
        <motion.div
          animate={{
            rotateY: phase >= 1 ? [0, -20, 0] : 0,
          }}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          <motion.div
            style={{
              fontSize: "4rem",
            }}
          >
            {phase >= 1 ? "📂" : "📁"}
          </motion.div>

          {phase >= 1 && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{
                color: colors.primary,
                fontSize: "14px",
                fontWeight: 600,
              }}
            >
              File opened! Ready to read
            </motion.span>
          )}
        </motion.div>
      </div>
    </div>
  );
};

// ============================================
// SCENE 91: Read Data (Wrong Way)
// ============================================
const Scene91 = () => {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 1000),
      setTimeout(() => setPhase(2), 2200),
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
          ⚠️ WRONG WAY TO READ
        </motion.div>

        <GlassCard glow={colors.danger}>
          <code
            style={{
              fontFamily: "'SF Mono', monospace",
              fontSize: "18px",
              color: colors.text,
            }}
          >
            fin {">> data;"}
          </code>
        </GlassCard>

        {/* Visualization */}
        <div style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
          {/* File with content */}
          <div
            style={{
              padding: "16px",
              borderRadius: "12px",
              background: "#1c1c1e",
              border: "1px solid rgba(255,255,255,0.1)",
              textAlign: "center",
            }}
          >
            <span style={{ fontSize: "1.5rem" }}>📄</span>
            <div
              style={{
                fontFamily: "'SF Mono', monospace",
                fontSize: "12px",
                color: colors.textSec,
                marginTop: "0.5rem",
              }}
            >
              Hello World
            </div>
          </div>

          <span style={{ color: colors.textSec, fontSize: "1.5rem" }}>→</span>

          {/* Only first word comes out */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: phase >= 1 ? 1 : 0 }}
              style={{
                padding: "10px 16px",
                borderRadius: "8px",
                background: `${colors.warning}20`,
                border: `2px solid ${colors.warning}`,
                fontFamily: "'SF Mono', monospace",
                color: colors.warning,
              }}
            >
              "Hello"
            </motion.div>

            {phase >= 2 && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{
                  color: colors.danger,
                  fontSize: "12px",
                }}
              >
                "World" left behind! ⛔
              </motion.span>
            )}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: phase >= 2 ? 1 : 0 }}
          style={{
            padding: "10px 20px",
            borderRadius: "100px",
            background: `${colors.danger}15`,
            border: `1px solid ${colors.danger}40`,
            color: colors.danger,
            fontSize: "14px",
          }}
        >
          {">> stops at whitespace!"}
        </motion.div>
      </div>
    </div>
  );
};

// ============================================
// EXPORTS
// ============================================
export const AnimationStepsPart8 = [
  {
    title: "File Handling Intro",
    component: Scene79,
    contentText:
      "File Handling in C++ - Unit 5. Topic: Reading and Writing Files. Persistent data storage using file streams. Important for RTU exams - commonly asked questions.",
  },
  {
    title: "What Is a File?",
    component: Scene80,
    contentText:
      "What is a File? A file is data stored permanently on disk. Unlike variables (lost when program ends), files persist. Types: text files (.txt, .cpp) and binary files (.exe, .dat).",
  },
  {
    title: "Why Files Are Needed",
    component: Scene81,
    contentText:
      "Why File Handling? 1) Permanent storage - data survives program termination, 2) Large data handling - can't fit everything in RAM, 3) Data sharing between programs, 4) Configuration storage.",
  },
  {
    title: "Exam Question Focus",
    component: Scene82,
    contentText:
      "RTU Exam Focus: Common questions on file handling - opening modes, reading/writing, error handling, binary vs text files. Know ofstream, ifstream, fstream classes and their methods.",
  },
  {
    title: "Steps of File Handling",
    component: Scene83,
    contentText:
      "File Handling Steps: 1) Include <fstream> header, 2) Create file stream object, 3) Open file (or use constructor), 4) Read/Write operations, 5) Close file. Always close files!",
  },
  {
    title: "File Stream Classes",
    component: Scene84,
    contentText:
      "File Stream Classes: ofstream - output file stream (writing), ifstream - input file stream (reading), fstream - both read and write. All from <fstream> header.",
  },
  {
    title: "Include fstream Header",
    component: Scene85,
    contentText:
      "#include <fstream>: Required header for file operations. Provides ofstream, ifstream, fstream classes. Also brings ios flags for file modes.",
  },
  {
    title: "Create File (ofstream)",
    component: Scene86,
    contentText:
      'Creating Files with ofstream: ofstream outFile("data.txt"); OR ofstream outFile; outFile.open("data.txt"); Creates file if doesn\'t exist, overwrites if exists (default mode).',
  },
  {
    title: "Write Data to File",
    component: Scene87,
    contentText:
      'Writing to File: Use << operator just like cout. outFile << "Hello\\n"; outFile << 42 << endl; outFile << name << " " << age; Same syntax as console output!',
  },
  {
    title: "Close File",
    component: Scene88,
    contentText:
      "Closing Files: outFile.close(); Always close files when done! Flushes buffer, releases system resources. Destructor auto-closes, but explicit close is good practice.",
  },
  {
    title: "Full Write Program",
    component: Scene89,
    contentText:
      'Complete Write Example: #include <fstream> int main() { ofstream out("file.txt"); out << "Data"; out.close(); return 0; } Simple pattern for file writing.',
  },
  {
    title: "Open for Reading",
    component: Scene90,
    contentText:
      'Opening for Reading: ifstream inFile("data.txt"); OR ifstream inFile; inFile.open("data.txt"); Check if open successful: if(!inFile) { error handling }',
  },
  {
    title: "Read Data (Wrong Way)",
    component: Scene91,
    contentText:
      "Common Reading Mistake: inFile >> word; only reads until whitespace! For 'Hello World', only gets 'Hello'. Use getline(inFile, line) for full lines.",
  },
];

export default { AnimationStepsPart8 };
