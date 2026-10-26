/**
 * ExceptionHandlingPart2 - Scenes 40-52 (Continuing from Part 4)
 * OOPS Unit 5: Exception Handling in C++ - One Shot Lecture
 * Covers: User Defined Exception, Standard Classes, bad_alloc, Rethrow,
 *         Best Practices, Input Validation, Destructors, Catch by Reference,
 *         Unhandled Exception, Benefits, Concept Summary, Closing
 */
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { colors, containerStyle } from "./TemplatesUnit5Theme";
import { GlassCard, CodeBlock } from "./TemplatesOneShotPart1";

// ============================================
// SCENE 40: User Defined Exception
// ============================================
const Scene40 = () => {
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
          🎨 CREATE YOUR OWN EXCEPTION
        </motion.div>

        {/* Code */}
        <GlassCard glow={colors.accent}>
          <div
            style={{
              fontFamily: "'SF Mono', monospace",
              fontSize: "15px",
              lineHeight: 1.8,
            }}
          >
            <div>
              <span style={{ color: colors.keyword }}>class</span>
              <span style={{ color: colors.accent, fontWeight: 700 }}>
                {" "}
                MyException
              </span>
              <span style={{ color: colors.textSec }}> {"{}"};</span>
            </div>
            <motion.div
              animate={{
                backgroundColor:
                  phase >= 1 ? "rgba(191, 90, 242, 0.15)" : "transparent",
              }}
              style={{
                padding: "4px 8px",
                borderRadius: "4px",
                marginTop: "8px",
              }}
            >
              <span style={{ color: colors.warning }}>throw</span>
              <span style={{ color: colors.accent }}> MyException</span>
              <span style={{ color: colors.text }}>();</span>
            </motion.div>
          </div>
        </GlassCard>

        {/* Custom exception object flying */}
        <AnimatePresence>
          {phase >= 2 && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.8 }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
                x: [0, 20, 0],
              }}
              transition={{
                x: { duration: 1.5, repeat: Infinity },
              }}
              style={{
                padding: "16px 28px",
                borderRadius: "16px",
                background: `linear-gradient(135deg, ${colors.danger}, ${colors.accent})`,
                color: "white",
                fontWeight: 700,
                fontSize: "15px",
                boxShadow: `0 10px 30px ${colors.danger}40`,
              }}
            >
              ⚡ MyException
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// ============================================
// SCENE 41: Standard Exception Classes
// ============================================
const Scene41 = () => {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPhase((p) => (p < 4 ? p + 1 : p));
    }, 700);
    return () => clearInterval(interval);
  }, []);

  const exceptions = [
    { name: "bad_alloc", desc: "Memory allocation failed" },
    { name: "out_of_range", desc: "Index out of bounds" },
    { name: "runtime_error", desc: "General runtime issue" },
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
            color: colors.primary,
            fontWeight: 700,
            fontSize: "13px",
            letterSpacing: "1.5px",
          }}
        >
          🌳 STANDARD EXCEPTION HIERARCHY
        </motion.div>

        {/* Tree diagram */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "1rem",
          }}
        >
          {/* Root */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: phase >= 1 ? 1 : 0, scale: 1 }}
            style={{
              padding: "14px 28px",
              borderRadius: "16px",
              background: `${colors.primary}20`,
              border: `2px solid ${colors.primary}`,
              fontFamily: "'SF Mono', monospace",
              fontSize: "16px",
              fontWeight: 700,
              color: colors.primary,
            }}
          >
            std::exception
          </motion.div>

          {/* Branches */}
          <div style={{ display: "flex", gap: "0.5rem" }}>
            {exceptions.map((exc, i) => (
              <motion.div
                key={exc.name}
                initial={{ opacity: 0, y: -20 }}
                animate={{
                  opacity: phase > i + 1 ? 1 : 0,
                  y: 0,
                }}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                {/* Connector */}
                <div
                  style={{
                    width: "2px",
                    height: "20px",
                    background: colors.textSec,
                  }}
                />
                <div
                  style={{
                    padding: "10px 16px",
                    borderRadius: "12px",
                    background: `${colors.warning}15`,
                    border: `1px solid ${colors.warning}40`,
                    fontFamily: "'SF Mono', monospace",
                    fontSize: "13px",
                    color: colors.warning,
                    textAlign: "center",
                  }}
                >
                  {exc.name}
                  <div
                    style={{
                      fontSize: "10px",
                      color: colors.textSec,
                      marginTop: "4px",
                    }}
                  >
                    {exc.desc}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: phase >= 4 ? 1 : 0 }}
          style={{
            color: colors.textSec,
            fontSize: "14px",
            fontStyle: "italic",
          }}
        >
          Use #include {"<stdexcept>"} to access these
        </motion.div>
      </div>
    </div>
  );
};

// ============================================
// SCENE 42: Memory Allocation Failure (bad_alloc)
// ============================================
const Scene42 = () => {
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
          💾 MEMORY ALLOCATION FAILURE
        </motion.div>

        {/* Code */}
        <GlassCard>
          <code
            style={{
              fontFamily: "'SF Mono', monospace",
              fontSize: "16px",
              color: colors.text,
            }}
          >
            <span style={{ color: colors.keyword }}>new</span>
            <span style={{ color: colors.typeInt }}> int</span>
            [100000000000];
          </code>
        </GlassCard>

        {/* Memory bar */}
        <div
          style={{
            width: "300px",
            height: "40px",
            borderRadius: "12px",
            border: "2px solid rgba(255,255,255,0.2)",
            overflow: "hidden",
            position: "relative",
          }}
        >
          <motion.div
            initial={{ width: "0%" }}
            animate={{
              width: phase >= 1 ? "100%" : "0%",
              backgroundColor: phase >= 2 ? colors.danger : colors.primary,
            }}
            transition={{ duration: 1.5 }}
            style={{
              height: "100%",
              borderRadius: "10px",
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontWeight: 600,
              fontSize: "14px",
            }}
          >
            {phase >= 2 ? "OUT OF MEMORY!" : "Allocating..."}
          </div>
        </div>

        {/* Exception pops out */}
        <AnimatePresence>
          {phase >= 3 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              style={{
                padding: "14px 28px",
                borderRadius: "16px",
                background: `linear-gradient(135deg, ${colors.danger}, ${colors.warning})`,
                color: "white",
                fontWeight: 700,
                fontSize: "15px",
                fontFamily: "'SF Mono', monospace",
                boxShadow: `0 10px 30px ${colors.danger}50`,
              }}
            >
              ⚡ std::bad_alloc
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// ============================================
// SCENE 43: Rethrow Exception
// ============================================
const Scene43 = () => {
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
            color: colors.warning,
            fontWeight: 700,
            fontSize: "13px",
            letterSpacing: "1.5px",
          }}
        >
          🔄 RETHROW EXCEPTION
        </motion.div>

        {/* Code */}
        <GlassCard glow={colors.warning}>
          <div
            style={{
              fontFamily: "'SF Mono', monospace",
              fontSize: "15px",
              lineHeight: 1.8,
            }}
          >
            <div style={{ color: colors.success }}>catch(...) {"{"}</div>
            <div style={{ paddingLeft: "1rem", color: colors.textSec }}>
              // Log the error
            </div>
            <motion.div
              animate={{
                backgroundColor:
                  phase >= 1 ? "rgba(255, 159, 10, 0.2)" : "transparent",
              }}
              style={{
                paddingLeft: "1rem",
                padding: "4px",
                borderRadius: "4px",
              }}
            >
              <span style={{ color: colors.warning, fontWeight: 700 }}>
                throw;
              </span>
              <span style={{ color: colors.textSec }}> // Rethrow!</span>
            </motion.div>
            <div style={{ color: colors.success }}>{"}"}</div>
          </div>
        </GlassCard>

        {/* Animation: Exception caught then thrown again */}
        <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
          <motion.div
            animate={{
              opacity: phase >= 1 ? 1 : 0.5,
              scale: phase >= 2 ? 0.9 : 1,
            }}
            style={{
              padding: "12px 20px",
              borderRadius: "12px",
              background: `${colors.success}20`,
              border: `2px solid ${colors.success}`,
              color: colors.success,
              fontWeight: 600,
            }}
          >
            Caught! 🎣
          </motion.div>

          <AnimatePresence>
            {phase >= 2 && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                style={{ color: colors.textSec, fontSize: "1.5rem" }}
              >
                →
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {phase >= 3 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{
                  opacity: 1,
                  y: [0, -10, 0],
                }}
                transition={{
                  y: { duration: 1, repeat: Infinity },
                }}
                style={{
                  padding: "12px 20px",
                  borderRadius: "12px",
                  background: `${colors.warning}20`,
                  border: `2px solid ${colors.warning}`,
                  color: colors.warning,
                  fontWeight: 600,
                }}
              >
                ⬆️ Thrown again!
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

// ============================================
// SCENE 44: Do Not Use for Normal Flow
// ============================================
const Scene44 = () => {
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
          ⚠️ BEST PRACTICE
        </motion.div>

        <div style={{ display: "flex", gap: "2rem" }}>
          {/* Wrong way */}
          <motion.div
            animate={{ opacity: phase >= 1 ? 0.4 : 1 }}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "0.75rem",
            }}
          >
            <GlassCard glow={colors.danger}>
              <div
                style={{
                  color: colors.danger,
                  fontWeight: 600,
                  marginBottom: "0.5rem",
                }}
              >
                ❌ WRONG
              </div>
              <div
                style={{
                  fontFamily: "'SF Mono', monospace",
                  fontSize: "13px",
                  color: colors.textSec,
                }}
              >
                Using exceptions
                <br />
                for normal logic
              </div>
            </GlassCard>
            <span style={{ color: colors.danger, fontSize: "13px" }}>
              e.g., checking if input exists
            </span>
          </motion.div>

          {/* Right way */}
          <motion.div
            animate={{ scale: phase >= 1 ? 1.05 : 1 }}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "0.75rem",
            }}
          >
            <GlassCard glow={colors.success}>
              <div
                style={{
                  color: colors.success,
                  fontWeight: 600,
                  marginBottom: "0.5rem",
                }}
              >
                ✓ CORRECT
              </div>
              <div
                style={{
                  fontFamily: "'SF Mono', monospace",
                  fontSize: "13px",
                  color: colors.text,
                }}
              >
                Using exceptions
                <br />
                for abnormal cases
              </div>
            </GlassCard>
            <span style={{ color: colors.success, fontSize: "13px" }}>
              e.g., file not found, memory fail
            </span>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          style={{
            padding: "12px 24px",
            borderRadius: "100px",
            background: "rgba(255,255,255,0.05)",
            color: colors.textSec,
            fontSize: "14px",
          }}
        >
          Exceptions ≠ if-else replacement
        </motion.div>
      </div>
    </div>
  );
};

// ============================================
// SCENE 45: Practical Example - Input Validation
// ============================================
const Scene45 = () => {
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
            color: colors.success,
            fontWeight: 700,
            fontSize: "13px",
            letterSpacing: "1.5px",
          }}
        >
          ✅ PRACTICAL EXAMPLE
        </motion.div>

        {/* Code */}
        <GlassCard>
          <div
            style={{
              fontFamily: "'SF Mono', monospace",
              fontSize: "15px",
              lineHeight: 1.8,
            }}
          >
            <span style={{ color: colors.keyword }}>if</span>
            <span style={{ color: colors.text }}>(x {"<="} 0) </span>
            <span style={{ color: colors.warning }}>throw</span>
            <span style={{ color: colors.typeString }}> "Invalid"</span>;
          </div>
        </GlassCard>

        {/* Visualization */}
        <div style={{ display: "flex", gap: "2rem", alignItems: "center" }}>
          {/* Negative number */}
          <motion.div
            initial={{ x: 0 }}
            animate={{
              x: phase >= 2 ? 80 : 0,
            }}
            transition={{ duration: 0.5 }}
            style={{
              padding: "16px 24px",
              borderRadius: "16px",
              background: `${colors.danger}20`,
              border: `2px solid ${colors.danger}`,
              fontFamily: "'SF Mono', monospace",
              fontSize: "1.5rem",
              fontWeight: 700,
              color: colors.danger,
            }}
          >
            -5
          </motion.div>

          {/* Barrier */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: phase >= 1 ? 1 : 0 }}
            style={{
              width: "8px",
              height: "80px",
              background: `linear-gradient(180deg, ${colors.danger}, ${colors.warning})`,
              borderRadius: "4px",
              boxShadow: phase >= 2 ? `0 0 20px ${colors.danger}50` : "none",
            }}
          />

          {/* Exception */}
          <AnimatePresence>
            {phase >= 3 && (
              <motion.div
                initial={{ opacity: 0, x: 20, scale: 0.8 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                style={{
                  padding: "12px 20px",
                  borderRadius: "100px",
                  background: colors.warning,
                  color: "#000",
                  fontWeight: 700,
                  fontSize: "14px",
                }}
              >
                ⚡ "Invalid"
              </motion.div>
            )}
          </AnimatePresence>
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
          Only positive numbers allowed!
        </motion.div>
      </div>
    </div>
  );
};

// ============================================
// SCENE 46: Destructors & Safety
// ============================================
const Scene46 = () => {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 800),
      setTimeout(() => setPhase(2), 1600),
      setTimeout(() => setPhase(3), 2400),
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
          🧹 AUTOMATIC CLEANUP
        </motion.div>

        {/* Timeline */}
        <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
          {/* Object created */}
          <motion.div
            animate={{ opacity: phase >= 1 ? 1 : 0.3 }}
            style={{
              padding: "14px 20px",
              borderRadius: "16px",
              background: `${colors.primary}20`,
              border: `2px solid ${colors.primary}`,
              color: colors.primary,
              fontWeight: 600,
              fontSize: "14px",
            }}
          >
            📦 Object created
          </motion.div>

          <motion.span
            animate={{ color: phase >= 2 ? colors.warning : colors.textSec }}
            style={{ fontSize: "1.5rem" }}
          >
            →
          </motion.span>

          {/* Exception */}
          <motion.div
            animate={{
              opacity: phase >= 2 ? 1 : 0.3,
              scale: phase >= 2 ? [1, 1.1, 1] : 1,
            }}
            style={{
              padding: "14px 20px",
              borderRadius: "16px",
              background: `${colors.warning}20`,
              border: `2px solid ${colors.warning}`,
              color: colors.warning,
              fontWeight: 600,
              fontSize: "14px",
            }}
          >
            ⚡ Exception!
          </motion.div>

          <motion.span
            animate={{ color: phase >= 3 ? colors.success : colors.textSec }}
            style={{ fontSize: "1.5rem" }}
          >
            →
          </motion.span>

          {/* Destructor called */}
          <motion.div
            animate={{
              opacity: phase >= 3 ? 1 : 0.3,
            }}
            style={{
              padding: "14px 20px",
              borderRadius: "16px",
              background: `${colors.success}20`,
              border: `2px solid ${colors.success}`,
              color: colors.success,
              fontWeight: 600,
              fontSize: "14px",
            }}
          >
            ~Destructor() ✓
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: phase >= 3 ? 1 : 0 }}
          style={{
            padding: "14px 28px",
            borderRadius: "100px",
            background: `${colors.success}15`,
            border: `1px solid ${colors.success}40`,
            color: colors.success,
            fontWeight: 600,
            fontSize: "14px",
          }}
        >
          Objects are cleaned up automatically! 🎉
        </motion.div>
      </div>
    </div>
  );
};

// ============================================
// SCENE 47: Catch by Reference
// ============================================
const Scene47 = () => {
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
          ⚡ EFFICIENCY TIP
        </motion.div>

        {/* Code */}
        <GlassCard glow={colors.success}>
          <div
            style={{
              fontFamily: "'SF Mono', monospace",
              fontSize: "16px",
            }}
          >
            <span style={{ color: colors.success }}>catch</span>
            <span style={{ color: colors.text }}>(</span>
            <span style={{ color: colors.keyword }}>const</span>
            <span style={{ color: colors.accent }}> exception</span>
            <span style={{ color: colors.primary, fontWeight: 700 }}>&</span>
            <span style={{ color: colors.text }}> e)</span>
          </div>
        </GlassCard>

        {/* Visualization */}
        <div style={{ display: "flex", gap: "3rem" }}>
          {/* Without reference */}
          <motion.div
            animate={{ opacity: phase >= 1 ? 0.4 : 1 }}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <div style={{ display: "flex", gap: "1rem" }}>
              <div
                style={{
                  width: "60px",
                  height: "60px",
                  borderRadius: "12px",
                  background: `${colors.danger}30`,
                  border: `2px solid ${colors.danger}`,
                }}
              />
              <div
                style={{
                  width: "60px",
                  height: "60px",
                  borderRadius: "12px",
                  background: `${colors.danger}30`,
                  border: `2px dashed ${colors.danger}`,
                }}
              />
            </div>
            <span style={{ color: colors.danger, fontSize: "12px" }}>
              By value = Copy made ❌
            </span>
          </motion.div>

          {/* With reference */}
          <motion.div
            animate={{ scale: phase >= 1 ? 1.05 : 1 }}
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
                borderRadius: "12px",
                background: `${colors.success}30`,
                border: `2px solid ${colors.success}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.5rem",
              }}
            >
              &
            </div>
            <span style={{ color: colors.success, fontSize: "12px" }}>
              By reference = No copy ✓
            </span>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

// ============================================
// SCENE 48: What If Nobody Catches?
// ============================================
const Scene48 = () => {
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
      <motion.div
        animate={{
          backgroundColor: phase >= 2 ? "rgba(0,0,0,0.7)" : "transparent",
        }}
        transition={{ duration: 1 }}
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
          gap: "2.5rem",
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
          😱 WORST CASE SCENARIO
        </motion.div>

        {/* Exception flying up */}
        <motion.div
          animate={{
            y: phase >= 1 ? -100 : 0,
            opacity: phase >= 2 ? 0 : 1,
          }}
          transition={{ duration: 1.5 }}
          style={{
            padding: "14px 24px",
            borderRadius: "100px",
            background: colors.danger,
            color: "white",
            fontWeight: 700,
            fontSize: "15px",
          }}
        >
          ⚡ Unhandled Exception
        </motion.div>

        {/* terminate() */}
        <AnimatePresence>
          {phase >= 2 && (
            <motion.div
              initial={{ opacity: 0, scale: 2 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{
                fontFamily: "'SF Mono', monospace",
                fontSize: "2rem",
                fontWeight: 800,
                color: colors.danger,
                textShadow: `0 0 30px ${colors.danger}`,
              }}
            >
              terminate()
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          animate={{ opacity: phase >= 2 ? 1 : 0 }}
          style={{
            color: colors.textSec,
            fontSize: "14px",
          }}
        >
          Program is forcefully terminated 💀
        </motion.div>
      </div>
    </div>
  );
};

// ============================================
// SCENE 49: Benefits Summary
// ============================================
const Scene49 = () => {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPhase((p) => (p < 4 ? p + 1 : p));
    }, 600);
    return () => clearInterval(interval);
  }, []);

  const benefits = [
    { text: "No Crash", icon: "🛡️", color: colors.success },
    { text: "Clean Code", icon: "✨", color: colors.primary },
    { text: "Safe Programs", icon: "🔒", color: colors.accent },
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
          🏆 WHY EXCEPTION HANDLING?
        </motion.div>

        {/* Shield shape */}
        <div
          style={{
            position: "relative",
            width: "300px",
            height: "280px",
          }}
        >
          {/* Shield background */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: phase >= 4 ? 1 : 0, scale: 1 }}
            style={{
              position: "absolute",
              inset: 0,
              background: `linear-gradient(180deg, ${colors.success}20, transparent)`,
              clipPath:
                "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
            }}
          />

          {benefits.map((benefit, i) => {
            const positions = [
              { left: "50%", top: "15%", transform: "translateX(-50%)" },
              { left: "15%", top: "55%" },
              { right: "15%", top: "55%" },
            ];

            return (
              <motion.div
                key={benefit.text}
                initial={{ opacity: 0, scale: 0 }}
                animate={{
                  opacity: phase > i ? 1 : 0,
                  scale: phase > i ? 1 : 0,
                }}
                transition={{ type: "spring", stiffness: 200 }}
                style={{
                  position: "absolute",
                  ...positions[i],
                  padding: "16px 24px",
                  borderRadius: "16px",
                  background: `${benefit.color}15`,
                  border: `2px solid ${benefit.color}`,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <span style={{ fontSize: "1.5rem" }}>{benefit.icon}</span>
                <span style={{ color: benefit.color, fontWeight: 700 }}>
                  {benefit.text}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// ============================================
// SCENE 50: Concept Summary Flow
// ============================================
const Scene50 = () => {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPhase((p) => (p < 5 ? p + 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const steps = [
    { text: "try", color: colors.primary },
    { text: "throw", color: colors.warning },
    { text: "catch", color: colors.success },
    { text: "continue", color: colors.accent },
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
          🔄 THE COMPLETE FLOW
        </motion.div>

        {/* Flowchart */}
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          {steps.map((step, i) => (
            <React.Fragment key={step.text}>
              <motion.div
                animate={{
                  scale: phase === i + 1 ? 1.15 : 1,
                  boxShadow:
                    phase === i + 1 ? `0 0 30px ${step.color}50` : "none",
                }}
                style={{
                  padding: "16px 28px",
                  borderRadius: "16px",
                  background: `${step.color}20`,
                  border: `2px solid ${step.color}`,
                  fontFamily: "'SF Mono', monospace",
                  fontSize: "18px",
                  fontWeight: 700,
                  color: step.color,
                }}
              >
                {step.text}
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
          Smooth, controlled error handling!
        </motion.div>
      </div>
    </div>
  );
};

// ============================================
// SCENE 51: Exception Handling Closing
// ============================================
const Scene51 = () => {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 800),
      setTimeout(() => setPhase(2), 2000),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  const errorIcons = ["💥", "⚠️", "❌", "🛑"];

  return (
    <div style={containerStyle}>
      {/* Fading error icons */}
      {errorIcons.map((icon, i) => (
        <motion.div
          key={icon}
          initial={{ opacity: 0.4 }}
          animate={{
            opacity: phase >= 2 ? 0 : 0.3,
            scale: phase >= 2 ? 0.5 : 1,
          }}
          style={{
            position: "absolute",
            left: `${20 + i * 18}%`,
            top: `${30 + (i % 2) * 35}%`,
            fontSize: "2rem",
          }}
        >
          {icon}
        </motion.div>
      ))}

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
            background: `linear-gradient(180deg, #FFFFFF 0%, ${colors.success} 100%)`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            textAlign: "center",
            margin: 0,
          }}
        >
          Your programs can now
          <br />
          handle errors safely!
        </motion.h1>

        <AnimatePresence>
          {phase >= 2 && (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{
                fontSize: "4rem",
              }}
            >
              ✅
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {phase >= 2 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                padding: "14px 28px",
                borderRadius: "100px",
                background: `linear-gradient(135deg, ${colors.success}, ${colors.primary})`,
                color: "white",
                fontWeight: 600,
                fontSize: "15px",
                boxShadow: `0 10px 30px ${colors.success}40`,
              }}
            >
              Exception Handling Mastered! 🎉
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// ============================================
// SCENE 52: Transition to Stream Classes (if needed)
// ============================================
const Scene52 = () => {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setPhase(1), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div style={containerStyle}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at center, rgba(10, 132, 255, 0.1) 0%, transparent 70%)",
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
            color: colors.textSec,
            fontWeight: 600,
            fontSize: "14px",
            letterSpacing: "1px",
          }}
        >
          UNIT 5 PROGRESS
        </motion.div>

        {/* Progress indicators */}
        <div style={{ display: "flex", gap: "1rem" }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{
              padding: "12px 20px",
              borderRadius: "100px",
              background: `${colors.success}20`,
              border: `2px solid ${colors.success}`,
              color: colors.success,
              fontWeight: 600,
              fontSize: "14px",
            }}
          >
            ✓ Templates
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            style={{
              padding: "12px 20px",
              borderRadius: "100px",
              background: `${colors.success}20`,
              border: `2px solid ${colors.success}`,
              color: colors.success,
              fontWeight: 600,
              fontSize: "14px",
            }}
          >
            ✓ Exception Handling
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: phase >= 1 ? 1 : 0.5, scale: 1 }}
            transition={{ delay: 0.4 }}
            style={{
              padding: "12px 20px",
              borderRadius: "100px",
              background:
                phase >= 1 ? `${colors.primary}20` : "rgba(255,255,255,0.05)",
              border: `2px solid ${phase >= 1 ? colors.primary : colors.textSec}`,
              color: phase >= 1 ? colors.primary : colors.textSec,
              fontWeight: 600,
              fontSize: "14px",
            }}
          >
            → Stream Classes
          </motion.div>
        </div>

        <AnimatePresence>
          {phase >= 1 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                color: colors.primary,
                fontSize: "16px",
                fontWeight: 500,
              }}
            >
              Up next: File I/O & Streams! 📂
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
export const AnimationStepsPart5 = [
  {
    title: "User Defined Exception",
    component: Scene40,
    contentText:
      "User Defined Exception: Create custom exception class - class MyException {}; Then throw MyException(); You can create your own exception types for specific error cases in your application.",
  },
  {
    title: "Standard Exception Classes",
    component: Scene41,
    contentText:
      "C++ Standard Exception Classes from <exception> header: std::exception (base class), std::runtime_error, std::logic_error, std::invalid_argument, std::out_of_range. Use these built-in classes for common errors.",
  },
  {
    title: "Memory Allocation Failure",
    component: Scene42,
    contentText:
      "Memory Allocation Failure - bad_alloc: When 'new' fails to allocate memory, it throws std::bad_alloc. Example: try { int* arr = new int[999999999999]; } catch(std::bad_alloc& e) { cout << e.what(); }",
  },
  {
    title: "Rethrow Exception",
    component: Scene43,
    contentText:
      "Rethrowing Exceptions: Use 'throw;' without arguments to rethrow the caught exception. catch(exception& e) { log(e); throw; } This passes the exception up the call stack after partial handling.",
  },
  {
    title: "Best Practices",
    component: Scene44,
    contentText:
      "Exception Handling Best Practices: 1) Catch by reference (catch(exception& e)), 2) Catch specific exceptions before general ones, 3) Don't use exceptions for normal flow control, 4) Always provide meaningful error messages.",
  },
  {
    title: "Input Validation Example",
    component: Scene45,
    contentText:
      'Input Validation with Exceptions: void setAge(int age) { if(age < 0 || age > 150) throw invalid_argument("Invalid age"); this->age = age; } Use exceptions to validate input parameters.',
  },
  {
    title: "Destructors & Safety",
    component: Scene46,
    contentText:
      "Destructors and Exception Safety: During stack unwinding, destructors are called automatically. Resource Acquisition Is Initialization (RAII) pattern ensures cleanup. Smart pointers (unique_ptr, shared_ptr) help manage resources safely.",
  },
  {
    title: "Catch by Reference",
    component: Scene47,
    contentText:
      "Catch by Reference vs Value: catch(exception e) - makes copy, loses polymorphism. catch(exception& e) - no copy, preserves polymorphism. Always catch by reference for efficiency and correctness.",
  },
  {
    title: "Unhandled Exception",
    component: Scene48,
    contentText:
      "Unhandled Exceptions: If no catch block matches the thrown exception, std::terminate() is called. The program crashes. Always provide catch(...) as a safety net for unexpected exceptions.",
  },
  {
    title: "Benefits Summary",
    component: Scene49,
    contentText:
      "Benefits of Exception Handling: 1) Separates error handling code from normal code, 2) Propagates errors up call stack, 3) Groups error types, 4) Enables graceful degradation, 5) Cleaner code structure.",
  },
  {
    title: "Concept Summary Flow",
    component: Scene50,
    contentText:
      "Exception Handling Flow Summary: try { risky code } -> if error: throw exception -> catch(type) { handle } -> continue program. Uncaught exceptions cause terminate(). Stack unwinding cleans up.",
  },
  {
    title: "Exception Handling Closing",
    component: Scene51,
    contentText:
      "Key Takeaways: try-catch-throw are the three pillars. Match exception types in catch. Use standard exceptions when possible. Catch by reference. RAII for resource safety. Exceptions make code robust and maintainable.",
  },
  {
    title: "Unit 5 Progress",
    component: Scene52,
    contentText:
      "Unit 5 Progress: Exception Handling section complete! You've learned try-catch blocks, throwing exceptions, standard exception classes, best practices, and RAII. Next up: More Unit 5 topics.",
  },
];

export default { AnimationStepsPart5 };
