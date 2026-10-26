/**
 * FileHandlingPart2 - Scenes 92-104 (Continuing from Part 8)
 * OOPS Unit 5: File Handling in C++ - One Shot Lecture
 * Covers: getline, Full Read Program, Check File Open, Exam Answer,
 *         Data Flow, Common Mistake, Keywords Summary, Streams Connection,
 *         Practical Use, Before vs After, Mental Model, Final Summary, Closing
 */
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { colors, containerStyle } from "./TemplatesUnit5Theme";
import { GlassCard, CodeBlock } from "./TemplatesOneShotPart1";

// ============================================
// SCENE 92: Read Full Line (getline)
// ============================================
const Scene92 = () => {
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
            color: colors.success,
            fontWeight: 700,
            fontSize: "13px",
            letterSpacing: "1.5px",
          }}
        >
          ✅ CORRECT WAY TO READ
        </motion.div>

        <GlassCard glow={colors.success}>
          <code
            style={{
              fontFamily: "'SF Mono', monospace",
              fontSize: "18px",
              color: colors.text,
            }}
          >
            <span style={{ color: colors.success }}>getline</span>
            (fin, line);
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

          <motion.span
            animate={{ x: phase >= 1 ? [0, 10, 0] : 0 }}
            transition={{ duration: 0.5, repeat: phase >= 1 ? 2 : 0 }}
            style={{ color: colors.success, fontSize: "1.5rem" }}
          >
            →→→
          </motion.span>

          {/* Full sentence comes out */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: phase >= 1 ? 1 : 0, scale: 1 }}
            style={{
              padding: "12px 20px",
              borderRadius: "12px",
              background: `${colors.success}20`,
              border: `2px solid ${colors.success}`,
              fontFamily: "'SF Mono', monospace",
              color: colors.success,
              fontWeight: 600,
            }}
          >
            "Hello World" ✓
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: phase >= 2 ? 1 : 0 }}
          style={{
            padding: "10px 20px",
            borderRadius: "100px",
            background: `${colors.success}15`,
            border: `1px solid ${colors.success}40`,
            color: colors.success,
            fontSize: "14px",
          }}
        >
          getline reads the entire line! 📖
        </motion.div>
      </div>
    </div>
  );
};

// ============================================
// SCENE 93: Full Read Program
// ============================================
const Scene93 = () => {
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
            color: colors.primary,
            fontWeight: 700,
            fontSize: "13px",
            letterSpacing: "1.5px",
          }}
        >
          📝 COMPLETE READ PROGRAM
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
                  phase === 1 ? "rgba(10, 132, 255, 0.2)" : "transparent",
              }}
              style={{ padding: "4px 8px", borderRadius: "4px" }}
            >
              <span style={{ color: colors.primary }}>ifstream</span>
              {" fin("}
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
              <span style={{ color: colors.success }}>getline</span>(fin, line);
            </motion.div>
            <motion.div
              animate={{
                backgroundColor:
                  phase === 3 ? "rgba(255, 159, 10, 0.2)" : "transparent",
              }}
              style={{ padding: "4px 8px", borderRadius: "4px" }}
            >
              fin.<span style={{ color: colors.warning }}>close</span>();
            </motion.div>
          </div>
        </GlassCard>

        {/* Step indicator */}
        <div style={{ display: "flex", gap: "1rem" }}>
          {["Open", "Read", "Close"].map((step, i) => (
            <motion.div
              key={step}
              animate={{
                scale: phase === i + 1 ? 1.1 : 1,
                backgroundColor:
                  phase > i ? colors.primary : "rgba(255,255,255,0.05)",
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
// SCENE 94: Check File Open
// ============================================
const Scene94 = () => {
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
          🔍 CHECK FILE OPEN
        </motion.div>

        <GlassCard>
          <div
            style={{
              fontFamily: "'SF Mono', monospace",
              fontSize: "15px",
              lineHeight: 1.8,
            }}
          >
            <div>
              <span style={{ color: colors.keyword }}>if</span>
              (!fin)
            </div>
            <div style={{ paddingLeft: "1rem" }}>
              cout {"<<"}
              <span style={{ color: colors.typeString }}>
                "File not opened"
              </span>
              ;
            </div>
          </div>
        </GlassCard>

        {/* Broken file visualization */}
        <AnimatePresence>
          {phase >= 1 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "2rem",
              }}
            >
              <motion.div
                animate={{ rotate: [0, -5, 5, 0] }}
                transition={{ duration: 0.5, repeat: 2 }}
                style={{
                  fontSize: "4rem",
                  filter: "grayscale(100%)",
                  opacity: 0.5,
                }}
              >
                📄
              </motion.div>
              <div
                style={{
                  padding: "12px 20px",
                  borderRadius: "12px",
                  background: `${colors.danger}20`,
                  border: `2px solid ${colors.danger}`,
                  color: colors.danger,
                  fontWeight: 600,
                }}
              >
                ❌ File not found!
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: phase >= 1 ? 1 : 0 }}
          style={{
            color: colors.textSec,
            fontSize: "14px",
            fontStyle: "italic",
          }}
        >
          Always check if file opened successfully!
        </motion.div>
      </div>
    </div>
  );
};

// ============================================
// SCENE 95: Final Exam Answer Block
// ============================================
const Scene95 = () => {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPhase((p) => (p < 4 ? p + 1 : p));
    }, 800);
    return () => clearInterval(interval);
  }, []);

  const points = [
    "File = Permanent Storage",
    "1. Open",
    "2. Read/Write",
    "3. Close",
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
            color: colors.success,
            fontWeight: 700,
            fontSize: "13px",
            letterSpacing: "1.5px",
          }}
        >
          📝 EXAM ANSWER FORMAT
        </motion.div>

        <GlassCard glow={colors.success}>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}
          >
            {points.map((point, i) => (
              <motion.div
                key={point}
                initial={{ opacity: 0, x: -20 }}
                animate={{
                  opacity: phase > i ? 1 : 0.3,
                  x: 0,
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  padding: "8px 12px",
                  borderRadius: "8px",
                  background: phase > i ? `${colors.success}15` : "transparent",
                }}
              >
                <motion.span
                  animate={{
                    scale: phase === i + 1 ? [1, 1.3, 1] : 1,
                  }}
                  style={{
                    color: phase > i ? colors.success : colors.textSec,
                    fontSize: "1.2rem",
                  }}
                >
                  {phase > i ? "✔" : "○"}
                </motion.span>
                <span
                  style={{
                    color: phase > i ? colors.text : colors.textSec,
                    fontWeight: i === 0 ? 700 : 400,
                    fontSize: "15px",
                  }}
                >
                  {point}
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
// SCENE 96: Data Flow Diagram
// ============================================
const Scene96 = () => {
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setDirection((d) => (d + 1) % 2);
    }, 2000);
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
          🔄 DATA FLOW
        </motion.div>

        <div style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
          {/* Program */}
          <motion.div
            animate={{
              boxShadow:
                direction === 0
                  ? `0 0 30px ${colors.success}50`
                  : `0 0 30px ${colors.primary}50`,
            }}
            style={{
              padding: "24px 32px",
              borderRadius: "20px",
              background: `${colors.accent}20`,
              border: `2px solid ${colors.accent}`,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <span style={{ fontSize: "2.5rem" }}>💻</span>
            <span
              style={{
                color: colors.accent,
                fontWeight: 700,
                fontSize: "16px",
              }}
            >
              Program
            </span>
          </motion.div>

          {/* Bidirectional arrows */}
          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
          >
            <motion.div
              animate={{
                x: direction === 0 ? [0, 20, 0] : 0,
                opacity: direction === 0 ? 1 : 0.3,
              }}
              style={{
                color: colors.success,
                fontSize: "1.5rem",
                fontWeight: 700,
              }}
            >
              →→→
            </motion.div>
            <motion.div
              animate={{
                x: direction === 1 ? [0, -20, 0] : 0,
                opacity: direction === 1 ? 1 : 0.3,
              }}
              style={{
                color: colors.primary,
                fontSize: "1.5rem",
                fontWeight: 700,
              }}
            >
              ←←←
            </motion.div>
          </div>

          {/* File */}
          <motion.div
            animate={{
              boxShadow:
                direction === 1
                  ? `0 0 30px ${colors.primary}50`
                  : `0 0 30px ${colors.success}50`,
            }}
            style={{
              padding: "24px 32px",
              borderRadius: "20px",
              background: `${colors.secondary}20`,
              border: `2px solid ${colors.secondary}`,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <span style={{ fontSize: "2.5rem" }}>📁</span>
            <span
              style={{
                color: colors.secondary,
                fontWeight: 700,
                fontSize: "16px",
              }}
            >
              File
            </span>
          </motion.div>
        </div>

        <div style={{ display: "flex", gap: "2rem" }}>
          <span
            style={{ color: direction === 0 ? colors.success : colors.textSec }}
          >
            ✍️ Write (ofstream)
          </span>
          <span
            style={{ color: direction === 1 ? colors.primary : colors.textSec }}
          >
            📖 Read (ifstream)
          </span>
        </div>
      </div>
    </div>
  );
};

// ============================================
// SCENE 97: Common Mistake
// ============================================
const Scene97 = () => {
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
            color: colors.danger,
            fontWeight: 700,
            fontSize: "13px",
            letterSpacing: "1.5px",
          }}
        >
          ⚠️ COMMON MISTAKE
        </motion.div>

        <GlassCard glow={colors.danger}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>❌</div>
            <div
              style={{
                color: colors.danger,
                fontWeight: 600,
                fontSize: "16px",
              }}
            >
              Forgot to close file!
            </div>
          </div>
        </GlassCard>

        {/* Half-open file */}
        <motion.div
          animate={{
            rotate: phase >= 1 ? [0, -5, 5, 0] : 0,
          }}
          transition={{ duration: 0.5, repeat: Infinity }}
          style={{
            position: "relative",
            fontSize: "4rem",
          }}
        >
          📂
          {phase >= 1 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{
                position: "absolute",
                top: "-10px",
                right: "-20px",
                padding: "4px 8px",
                borderRadius: "100px",
                background: colors.danger,
                color: "white",
                fontSize: "12px",
                fontWeight: 700,
              }}
            >
              ⚠️
            </motion.div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: phase >= 1 ? 1 : 0 }}
          style={{
            padding: "12px 24px",
            borderRadius: "100px",
            background: `${colors.warning}15`,
            border: `1px solid ${colors.warning}40`,
            color: colors.warning,
            fontSize: "14px",
          }}
        >
          Always call .close() when done! 🔒
        </motion.div>
      </div>
    </div>
  );
};

// ============================================
// SCENE 98: Summary of Keywords
// ============================================
const Scene98 = () => {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPhase((p) => (p < 5 ? p + 1 : p));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  const keywords = [
    { text: "ofstream", color: colors.success },
    { text: "ifstream", color: colors.primary },
    { text: "open", color: colors.secondary },
    { text: "close", color: colors.warning },
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
          🧰 FILE HANDLING TOOLKIT
        </motion.div>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "1rem",
            justifyContent: "center",
            maxWidth: "400px",
          }}
        >
          {keywords.map((kw, i) => (
            <motion.div
              key={kw.text}
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: phase > i ? 1 : 0,
                scale: phase > i ? 1 : 0,
              }}
              transition={{ type: "spring", stiffness: 200 }}
              style={{
                padding: "14px 24px",
                borderRadius: "100px",
                background: `${kw.color}20`,
                border: `2px solid ${kw.color}`,
                fontFamily: "'SF Mono', monospace",
                fontSize: "16px",
                fontWeight: 700,
                color: kw.color,
              }}
            >
              {kw.text}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ============================================
// SCENE 99: How It Connects to Streams
// ============================================
const Scene99 = () => {
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
            color: colors.primary,
            fontWeight: 700,
            fontSize: "13px",
            letterSpacing: "1.5px",
          }}
        >
          🔗 FILES ARE STREAMS
        </motion.div>

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
          File = <span style={{ color: colors.primary }}>Stream of Data</span>
        </motion.div>

        {/* Connection visualization */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: phase >= 1 ? 1 : 0 }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1.5rem",
          }}
        >
          <motion.div
            animate={{
              boxShadow: `0 0 30px ${colors.secondary}40`,
            }}
            style={{
              fontSize: "3rem",
            }}
          >
            📁
          </motion.div>

          <motion.div
            animate={{
              scaleX: [1, 1.2, 1],
            }}
            transition={{ duration: 1, repeat: Infinity }}
            style={{
              width: "100px",
              height: "20px",
              background: `linear-gradient(90deg, ${colors.secondary}, ${colors.primary})`,
              borderRadius: "10px",
            }}
          />

          <motion.div
            animate={{
              boxShadow: `0 0 30px ${colors.primary}40`,
            }}
            style={{
              fontSize: "3rem",
            }}
          >
            🌊
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: phase >= 1 ? 1 : 0 }}
          style={{
            color: colors.textSec,
            fontSize: "14px",
            fontStyle: "italic",
          }}
        >
          Same stream concept, just connected to file!
        </motion.div>
      </div>
    </div>
  );
};

// ============================================
// SCENE 100: Practical Use
// ============================================
const Scene100 = () => {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPhase((p) => (p < 4 ? p + 1 : p));
    }, 700);
    return () => clearInterval(interval);
  }, []);

  const uses = [
    { text: "Marks", icon: "📊" },
    { text: "Records", icon: "📋" },
    { text: "Reports", icon: "📈" },
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
            color: colors.success,
            fontWeight: 700,
            fontSize: "13px",
            letterSpacing: "1.5px",
          }}
        >
          💼 PRACTICAL USES
        </motion.div>

        <div style={{ display: "flex", gap: "2rem", alignItems: "center" }}>
          {/* Uses */}
          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}
          >
            {uses.map((use, i) => (
              <motion.div
                key={use.text}
                initial={{ opacity: 0, x: -30 }}
                animate={{
                  opacity: phase > i ? 1 : 0,
                  x: phase > i ? 0 : -30,
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  padding: "12px 20px",
                  borderRadius: "12px",
                  background: `${colors.success}15`,
                  border: `1px solid ${colors.success}30`,
                }}
              >
                <span style={{ fontSize: "1.5rem" }}>{use.icon}</span>
                <span style={{ color: colors.text, fontWeight: 600 }}>
                  {use.text}
                </span>
              </motion.div>
            ))}
          </div>

          {/* Arrow */}
          <motion.span
            animate={{ x: phase >= 4 ? [0, 10, 0] : 0 }}
            transition={{ duration: 0.5, repeat: Infinity }}
            style={{ fontSize: "2rem", color: colors.textSec }}
          >
            →
          </motion.span>

          {/* File */}
          <motion.div
            animate={{
              scale: phase >= 4 ? [1, 1.05, 1] : 1,
              boxShadow: phase >= 4 ? `0 0 30px ${colors.secondary}50` : "none",
            }}
            transition={{ duration: 1, repeat: Infinity }}
            style={{
              fontSize: "4rem",
            }}
          >
            📁
          </motion.div>
        </div>
      </div>
    </div>
  );
};

// ============================================
// SCENE 101: Before vs After
// ============================================
const Scene101 = () => {
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
          🔄 BEFORE vs AFTER
        </motion.div>

        <div style={{ display: "flex", gap: "3rem" }}>
          {/* Without File */}
          <motion.div
            animate={{ opacity: phase >= 1 ? 0.4 : 1 }}
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
                  💨
                </div>
                <div style={{ color: colors.danger, fontWeight: 600 }}>
                  Without File
                </div>
              </div>
            </GlassCard>
            <motion.div
              animate={{
                opacity: [1, 0.5, 0],
              }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{
                padding: "8px 16px",
                borderRadius: "8px",
                background: `${colors.danger}20`,
                color: colors.danger,
                fontSize: "14px",
              }}
            >
              Data Lost ❌
            </motion.div>
          </motion.div>

          {/* With File */}
          <motion.div
            animate={{ scale: phase >= 1 ? 1.05 : 1 }}
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
                <div style={{ color: colors.success, fontWeight: 600 }}>
                  With File
                </div>
              </div>
            </GlassCard>
            <motion.div
              animate={{
                boxShadow: [
                  `0 0 0px ${colors.success}`,
                  `0 0 20px ${colors.success}`,
                  `0 0 0px ${colors.success}`,
                ],
              }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{
                padding: "8px 16px",
                borderRadius: "8px",
                background: `${colors.success}20`,
                color: colors.success,
                fontSize: "14px",
              }}
            >
              Data Saved ✓
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

// ============================================
// SCENE 102: Student Mental Model
// ============================================
const Scene102 = () => {
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
            color: colors.accent,
            fontWeight: 700,
            fontSize: "13px",
            letterSpacing: "1.5px",
          }}
        >
          🧠 SIMPLE WAY TO THINK
        </motion.div>

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
          File = <span style={{ color: colors.secondary }}>Notebook</span> of
          Program
        </motion.div>

        {/* Visualization */}
        <div style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
          <motion.div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <span style={{ fontSize: "3rem" }}>💻</span>
            <span style={{ color: colors.textSec, fontSize: "12px" }}>
              Program
            </span>
          </motion.div>

          {phase >= 1 && (
            <motion.div
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              <motion.span
                animate={{ x: [0, 10, 0] }}
                transition={{ duration: 1, repeat: Infinity }}
                style={{ color: colors.textSec, fontSize: "1.5rem" }}
              >
                ✍️→
              </motion.span>
            </motion.div>
          )}

          <motion.div
            animate={{
              rotateY: phase >= 1 ? [0, 10, 0] : 0,
            }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <span style={{ fontSize: "3rem" }}>📓</span>
            <span
              style={{
                color: colors.secondary,
                fontSize: "12px",
                fontWeight: 600,
              }}
            >
              File (Notebook)
            </span>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

// ============================================
// SCENE 103: Final Summary
// ============================================
const Scene103 = () => {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPhase((p) => (p + 1) % 4);
    }, 1200);
    return () => clearInterval(interval);
  }, []);

  const steps = [
    { text: "Open", icon: "📂", color: colors.primary },
    { text: "Write/Read", icon: "📝", color: colors.success },
    { text: "Close", icon: "🔒", color: colors.warning },
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
          🔄 THE COMPLETE CYCLE
        </motion.div>

        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          {steps.map((step, i) => (
            <React.Fragment key={step.text}>
              <motion.div
                animate={{
                  scale: phase === i + 1 ? 1.15 : 1,
                  boxShadow:
                    phase === i + 1 ? `0 10px 30px ${step.color}50` : "none",
                }}
                style={{
                  padding: "20px",
                  borderRadius: "20px",
                  background: `${step.color}20`,
                  border: `2px solid ${step.color}`,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <span style={{ fontSize: "2rem" }}>{step.icon}</span>
                <span
                  style={{
                    color: step.color,
                    fontWeight: 700,
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
                    color: phase === i + 1 ? step.color : colors.textSec,
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
          Simple 3-step process! 🎯
        </motion.div>
      </div>
    </div>
  );
};

// ============================================
// SCENE 104: File Handling Closing
// ============================================
const Scene104 = () => {
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
            "radial-gradient(ellipse at center, rgba(255, 159, 10, 0.1) 0%, transparent 70%)",
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
            background: `linear-gradient(180deg, #FFFFFF 0%, ${colors.secondary} 100%)`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            margin: 0,
          }}
        >
          You now understand
          <br />
          File Handling in C++
        </motion.h1>

        {/* File locking animation */}
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
                animate={{
                  scale: phase >= 2 ? [1, 0.95, 1] : 1,
                }}
                style={{ fontSize: "4rem" }}
              >
                📁
              </motion.div>
              {phase >= 2 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  style={{ fontSize: "2rem" }}
                >
                  🔒
                </motion.div>
              )}
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
                background: `linear-gradient(135deg, ${colors.secondary}, ${colors.success})`,
                color: "white",
                fontWeight: 600,
                fontSize: "16px",
                boxShadow: `0 10px 30px ${colors.secondary}40`,
              }}
            >
              Unit 5 Complete! 🎉
            </motion.div>
          )}
        </AnimatePresence>

        {/* All Unit 5 topics */}
        <AnimatePresence>
          {phase >= 2 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{
                display: "flex",
                gap: "0.75rem",
                flexWrap: "wrap",
                justifyContent: "center",
                marginTop: "1rem",
              }}
            >
              {["✓ Templates", "✓ Exceptions", "✓ Streams", "✓ Files"].map(
                (topic, i) => (
                  <motion.div
                    key={topic}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.15 }}
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
                )
              )}
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
export const AnimationStepsPart9 = [
  {
    title: "Read Full Line (getline)",
    component: Scene92,
    contentText:
      "Reading Full Lines: string line; while(getline(inFile, line)) { process line; } getline reads entire line including spaces, returns false at EOF. Correct way to read text files.",
  },
  {
    title: "Full Read Program",
    component: Scene93,
    contentText:
      'Complete Read Example: #include <fstream> #include <string> int main() { ifstream in("file.txt"); string line; while(getline(in, line)) cout << line << endl; in.close(); }',
  },
  {
    title: "Check File Open",
    component: Scene94,
    contentText:
      'Error Checking: Always verify file opened successfully! if(!inFile.is_open()) { cerr << "Cannot open file!"; return 1; } Or: if(inFile.fail()) or if(!inFile)',
  },
  {
    title: "Exam Answer Format",
    component: Scene95,
    contentText:
      "RTU Exam Answer Format: 1) Include header <fstream>, 2) Create appropriate stream object, 3) Open with error check, 4) Loop for read/write, 5) Close file. Show complete program.",
  },
  {
    title: "Data Flow Diagram",
    component: Scene96,
    contentText:
      "File I/O Data Flow: Program -> ofstream -> Buffer -> Disk File. Disk File -> Buffer -> ifstream -> Program. Stream acts as intermediary between program memory and file.",
  },
  {
    title: "Common Mistake",
    component: Scene97,
    contentText:
      "Common Mistakes: 1) Forgetting <fstream> include, 2) Not checking if file opened, 3) Using >> for full lines (use getline), 4) Not closing files, 5) Opening non-existent file for reading.",
  },
  {
    title: "Keywords Summary",
    component: Scene98,
    contentText:
      "File Handling Keywords: ifstream (input), ofstream (output), fstream (both), open(), close(), getline(), eof(), fail(), is_open(), ios::app, ios::binary, ios::in, ios::out",
  },
  {
    title: "Files Are Streams",
    component: Scene99,
    contentText:
      "Files ARE Streams: Same << >> operators work with files as with cin/cout. ifstream inherits from istream, ofstream from ostream. Polymorphism in action!",
  },
  {
    title: "Practical Uses",
    component: Scene100,
    contentText:
      "Real World Uses: Configuration files, log files, data persistence, saving game state, database exports, report generation, reading CSV/JSON files, backup systems.",
  },
  {
    title: "Before vs After",
    component: Scene101,
    contentText:
      "Before vs After Files: WITHOUT files - data lost when program ends. WITH files - data persists forever. Files enable data persistence across program executions.",
  },
  {
    title: "Mental Model",
    component: Scene102,
    contentText:
      "Mental Model: Think of file streams as pipes connecting your program to files on disk. ofstream = outgoing pipe (write), ifstream = incoming pipe (read). Open pipe, transfer data, close pipe.",
  },
  {
    title: "Final Summary",
    component: Scene103,
    contentText:
      "File Handling Summary: #include <fstream>, create stream object, open file, check success, read/write using <</>>/getline, close file. Same operators as console I/O!",
  },
  {
    title: "File Handling Closing",
    component: Scene104,
    contentText:
      "Unit 5 Complete! Covered: Templates (generic programming), Exception Handling (try-catch-throw), Stream Classes (cin/cout), File Handling (ifstream/ofstream). You're ready for RTU exams!",
  },
];

export default { AnimationStepsPart9 };
