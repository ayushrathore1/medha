/**
 * TemplatesOneShotPart3 - Scenes 19-26
 * OOPS Unit 5: Templates in C++ - One Shot Lecture
 * Covers: Static Assert, Headers Rule, Advantages, Disadvantages,
 *         Before vs After, Philosophy, Big Picture, Closing
 */
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { colors, containerStyle } from "./TemplatesUnit5Theme";
import { GlassCard, CodeBlock } from "./TemplatesOneShotPart1";

// ============================================
// SCENE 19: Static Assert Restriction
// ============================================
const Scene19 = () => {
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
            color: colors.danger,
            fontWeight: 700,
            fontSize: "13px",
            letterSpacing: "1.5px",
          }}
        >
          🛡️ RESTRICTING TEMPLATES
        </motion.div>

        {/* Gate/Barrier visualization */}
        <div style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
          {/* Types trying to pass */}
          <div
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            {/* int passes */}
            <motion.div
              initial={{ x: 0 }}
              animate={{
                x: phase >= 2 ? 180 : 0,
                opacity: phase >= 2 ? [1, 1, 0] : 1,
              }}
              transition={{ duration: 0.8 }}
              style={{
                padding: "12px 24px",
                borderRadius: "12px",
                background: `${colors.typeInt}20`,
                border: `2px solid ${colors.typeInt}`,
                fontFamily: "'SF Mono', monospace",
                fontSize: "16px",
                fontWeight: 600,
                color: colors.typeInt,
              }}
            >
              int
            </motion.div>

            {/* string blocked */}
            <motion.div
              initial={{ x: 0 }}
              animate={{
                x: phase >= 3 ? 80 : 0,
              }}
              transition={{ duration: 0.5 }}
              style={{
                padding: "12px 24px",
                borderRadius: "12px",
                background: `${colors.typeString}20`,
                border: `2px solid ${colors.typeString}`,
                fontFamily: "'SF Mono', monospace",
                fontSize: "16px",
                fontWeight: 600,
                color: colors.typeString,
                position: "relative",
              }}
            >
              string
              {phase >= 3 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  style={{
                    position: "absolute",
                    right: "-30px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    fontSize: "1.5rem",
                  }}
                >
                  ❌
                </motion.span>
              )}
            </motion.div>
          </div>

          {/* Barrier/Gate */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: phase >= 1 ? 1 : 0 }}
            style={{
              width: "8px",
              height: "150px",
              background: `linear-gradient(180deg, ${colors.danger}, ${colors.warning})`,
              borderRadius: "4px",
              boxShadow: `0 0 20px ${colors.danger}50`,
              position: "relative",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: "-30px",
                left: "50%",
                transform: "translateX(-50%)",
                whiteSpace: "nowrap",
                color: colors.danger,
                fontSize: "12px",
                fontWeight: 700,
              }}
            >
              static_assert
            </div>
          </motion.div>

          {/* Passed types */}
          <div style={{ minWidth: "100px" }}>
            {phase >= 2 && (
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
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
                int ✓
              </motion.div>
            )}
          </div>
        </div>

        {/* Message */}
        <GlassCard>
          <div
            style={{
              fontFamily: "'SF Mono', monospace",
              fontSize: "14px",
              color: colors.text,
              textAlign: "center",
            }}
          >
            <span style={{ color: colors.success }}>Only numbers allowed</span>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

// ============================================
// SCENE 20: Headers Rule
// ============================================
const Scene20 = () => {
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
          📁 WHERE TO PUT TEMPLATES
        </motion.div>

        <div style={{ display: "flex", gap: "2.5rem" }}>
          {/* .cpp file - BAD */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{
              opacity: phase >= 1 ? 0.4 : 1,
              y: 0,
              scale: phase >= 1 ? 0.95 : 1,
            }}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "1rem",
            }}
          >
            <div
              style={{
                width: "140px",
                height: "180px",
                background: "linear-gradient(180deg, #2c2c2e 0%, #1c1c1e 100%)",
                border: `2px solid ${phase >= 1 ? colors.danger : "rgba(255,255,255,0.15)"}`,
                borderRadius: "16px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
                position: "relative",
              }}
            >
              <div
                style={{
                  fontFamily: "'SF Mono', monospace",
                  fontSize: "14px",
                  color: colors.textSec,
                }}
              >
                template.cpp
              </div>
              <div style={{ fontSize: "2rem" }}>📄</div>

              {phase >= 1 && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  style={{
                    position: "absolute",
                    top: "-15px",
                    right: "-15px",
                    fontSize: "2rem",
                  }}
                >
                  ❌
                </motion.div>
              )}
            </div>
            <span
              style={{
                color: colors.danger,
                fontWeight: 600,
                fontSize: "14px",
              }}
            >
              Not visible to compiler!
            </span>
          </motion.div>

          {/* .h file - GOOD */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{
              opacity: 1,
              y: 0,
              scale: phase >= 2 ? 1.05 : 1,
            }}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "1rem",
            }}
          >
            <motion.div
              animate={{
                boxShadow: phase >= 2 ? `0 0 40px ${colors.success}40` : "none",
              }}
              style={{
                width: "140px",
                height: "180px",
                background:
                  phase >= 2
                    ? `linear-gradient(180deg, ${colors.success}15 0%, ${colors.success}05 100%)`
                    : "linear-gradient(180deg, #2c2c2e 0%, #1c1c1e 100%)",
                border: `2px solid ${phase >= 2 ? colors.success : "rgba(255,255,255,0.15)"}`,
                borderRadius: "16px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
                position: "relative",
              }}
            >
              <div
                style={{
                  fontFamily: "'SF Mono', monospace",
                  fontSize: "14px",
                  color: phase >= 2 ? colors.success : colors.textSec,
                  fontWeight: phase >= 2 ? 600 : 400,
                }}
              >
                template.h
              </div>
              <div style={{ fontSize: "2rem" }}>📋</div>

              {phase >= 2 && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  style={{
                    position: "absolute",
                    top: "-15px",
                    right: "-15px",
                    fontSize: "2rem",
                  }}
                >
                  ✅
                </motion.div>
              )}
            </motion.div>
            <span
              style={{
                color: colors.success,
                fontWeight: 600,
                fontSize: "14px",
              }}
            >
              Visible to all!
            </span>
          </motion.div>
        </div>

        {/* Rule */}
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
              <span style={{ color: colors.secondary, fontWeight: 600 }}>
                Rule:
              </span>{" "}
              Templates must be in header files
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// ============================================
// SCENE 21: Advantages Summary
// ============================================
const Scene21 = () => {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 500),
      setTimeout(() => setPhase(2), 1000),
      setTimeout(() => setPhase(3), 1500),
      setTimeout(() => setPhase(4), 2200),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  const advantages = [
    { text: "Less Code", icon: "📝", color: colors.primary },
    { text: "High Performance", icon: "⚡", color: colors.success },
    { text: "Reusable", icon: "♻️", color: colors.accent },
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
          ✨ TEMPLATE ADVANTAGES
        </motion.div>

        {/* Triangle formation */}
        <div
          style={{
            position: "relative",
            width: "350px",
            height: "280px",
          }}
        >
          {advantages.map((adv, i) => {
            // Triangle positions
            const positions = [
              { left: "50%", top: "0", transform: "translateX(-50%)" },
              { left: "0", bottom: "0" },
              { right: "0", bottom: "0" },
            ];

            return (
              <motion.div
                key={adv.text}
                initial={{ opacity: 0, scale: 0 }}
                animate={{
                  opacity: phase > i ? 1 : 0,
                  scale: phase > i ? 1 : 0,
                }}
                transition={{ type: "spring", stiffness: 200 }}
                style={{
                  position: "absolute",
                  ...positions[i],
                  padding: "20px 28px",
                  borderRadius: "20px",
                  background: `${adv.color}15`,
                  border: `2px solid ${adv.color}`,
                  boxShadow: phase >= 4 ? `0 10px 30px ${adv.color}30` : "none",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <span style={{ fontSize: "2rem" }}>{adv.icon}</span>
                <span
                  style={{
                    color: adv.color,
                    fontWeight: 700,
                    fontSize: "16px",
                  }}
                >
                  {adv.text}
                </span>
              </motion.div>
            );
          })}

          {/* Connecting lines */}
          {phase >= 4 && (
            <svg
              style={{
                position: "absolute",
                width: "100%",
                height: "100%",
                top: 0,
                left: 0,
                pointerEvents: "none",
              }}
            >
              <motion.path
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1 }}
                d="M 175 80 L 70 200 L 280 200 Z"
                fill="none"
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="2"
                strokeDasharray="5,5"
              />
            </svg>
          )}
        </div>
      </div>
    </div>
  );
};

// ============================================
// SCENE 22: Disadvantage - Error Messages
// ============================================
const Scene22 = () => {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 800),
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
            color: colors.danger,
            fontWeight: 700,
            fontSize: "13px",
            letterSpacing: "1.5px",
          }}
        >
          ⚠️ THE DARK SIDE
        </motion.div>

        {/* Giant error message */}
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{
            opacity: phase >= 1 ? 1 : 0,
            height: phase >= 2 ? "80px" : phase >= 1 ? "250px" : 0,
          }}
          transition={{ duration: 0.8 }}
          style={{
            width: "100%",
            maxWidth: "600px",
            background: `${colors.danger}10`,
            border: `2px solid ${colors.danger}40`,
            borderRadius: "16px",
            overflow: "hidden",
            position: "relative",
          }}
        >
          <div
            style={{
              padding: "1rem",
              fontFamily: "'SF Mono', monospace",
              fontSize: "11px",
              color: colors.danger,
              lineHeight: 1.5,
            }}
          >
            {phase >= 1 && phase < 2 && (
              <>
                error: no matching function for call to
                'add(std::vector&lt;int&gt;, std::vector&lt;int&gt;)'
                <br />
                note: candidate: 'template&lt;class T&gt; T add(T, T)'
                <br />
                note: template argument deduction/substitution failed:
                <br />
                note: deduced conflicting types for parameter 'T'
                ('std::vector&lt;int&gt;' and 'std::vector&lt;int&gt;')
                <br />
                In file included from /usr/include/c++/11/vector:67,
                <br />
                from main.cpp:1:
                <br />
                /usr/include/c++/11/bits/stl_vector.h:1187:5: note: candidate...
                <br />
                ... 47 more lines ...
              </>
            )}
            {phase >= 2 && (
              <div style={{ textAlign: "center", padding: "0.5rem" }}>
                Template errors can be... verbose 😅
              </div>
            )}
          </div>
        </motion.div>

        {/* Tip */}
        <AnimatePresence>
          {phase >= 2 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                padding: "14px 28px",
                borderRadius: "100px",
                background: `${colors.warning}15`,
                border: `1px solid ${colors.warning}40`,
                color: colors.warning,
                fontWeight: 600,
                fontSize: "14px",
              }}
            >
              💡 Read from the top, focus on the first error!
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// ============================================
// SCENE 23: Before vs After
// ============================================
const Scene23 = () => {
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
          🔄 BEFORE vs AFTER
        </motion.div>

        <div style={{ display: "flex", gap: "2rem", alignItems: "center" }}>
          {/* Before - Many functions */}
          <motion.div
            animate={{
              opacity: phase >= 3 ? 0.3 : 1,
              scale: phase >= 3 ? 0.9 : 1,
              x: phase >= 3 ? 50 : 0,
            }}
            transition={{ duration: 0.5 }}
          >
            <GlassCard glow={colors.danger}>
              <div
                style={{
                  marginBottom: "0.5rem",
                  color: colors.danger,
                  fontWeight: 600,
                  fontSize: "12px",
                }}
              >
                BEFORE
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.5rem",
                }}
              >
                {["int", "float", "double", "char"].map((type, i) => (
                  <motion.div
                    key={type}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: phase >= 1 ? 1 : 0, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    style={{
                      fontFamily: "'SF Mono', monospace",
                      fontSize: "12px",
                      color: colors.text,
                      padding: "6px 12px",
                      background: "rgba(255, 69, 58, 0.1)",
                      borderRadius: "6px",
                    }}
                  >
                    {type} add({type}, {type})
                  </motion.div>
                ))}
              </div>
            </GlassCard>
          </motion.div>

          {/* Arrow */}
          <motion.div
            animate={{
              scale: phase >= 2 ? [1, 1.3, 1] : 1,
              color: phase >= 2 ? colors.success : colors.textSec,
            }}
            transition={{ repeat: phase >= 2 ? 3 : 0 }}
            style={{ fontSize: "2rem" }}
          >
            →
          </motion.div>

          {/* After - One template */}
          <motion.div
            animate={{
              scale: phase >= 3 ? 1.1 : 1,
            }}
          >
            <GlassCard glow={colors.success}>
              <div
                style={{
                  marginBottom: "0.5rem",
                  color: colors.success,
                  fontWeight: 600,
                  fontSize: "12px",
                }}
              >
                AFTER
              </div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: phase >= 2 ? 1 : 0 }}
                style={{
                  fontFamily: "'SF Mono', monospace",
                  fontSize: "14px",
                  color: colors.text,
                  padding: "12px 16px",
                  background: `${colors.success}15`,
                  borderRadius: "8px",
                }}
              >
                <div style={{ color: colors.secondary }}>
                  template&lt;typename T&gt;
                </div>
                <div>
                  <span style={{ color: colors.primary }}>T</span> add(
                  <span style={{ color: colors.primary }}>T</span>,{" "}
                  <span style={{ color: colors.primary }}>T</span>)
                </div>
              </motion.div>
            </GlassCard>
          </motion.div>
        </div>

        {/* Collapse animation indicator */}
        <AnimatePresence>
          {phase >= 3 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{
                color: colors.success,
                fontWeight: 600,
                fontSize: "15px",
              }}
            >
              4 functions → 1 template! 🎉
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// ============================================
// SCENE 24: Philosophy
// ============================================
const Scene24 = () => {
  const [displayedText, setDisplayedText] = useState("");
  const fullText = "Write once. Generate many times.";

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (i <= fullText.length) {
        setDisplayedText(fullText.slice(0, i));
        i++;
      } else {
        clearInterval(interval);
      }
    }, 80);
    return () => clearInterval(interval);
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
            "radial-gradient(ellipse at center, rgba(191, 90, 242, 0.1) 0%, transparent 60%)",
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
            color: colors.accent,
            fontWeight: 700,
            fontSize: "13px",
            letterSpacing: "1.5px",
          }}
        >
          🧠 THE PHILOSOPHY
        </motion.div>

        <motion.div
          style={{
            fontSize: "2.5rem",
            fontWeight: 700,
            background: `linear-gradient(135deg, ${colors.text} 0%, ${colors.accent} 100%)`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            textAlign: "center",
            minHeight: "3rem",
          }}
        >
          {displayedText}
          {displayedText.length < fullText.length && (
            <motion.span
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 0.5, repeat: Infinity }}
              style={{ color: colors.accent }}
            >
              |
            </motion.span>
          )}
        </motion.div>

        <AnimatePresence>
          {displayedText.length === fullText.length && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              style={{
                color: colors.textSec,
                fontSize: "16px",
                fontStyle: "italic",
              }}
            >
              — The Template Way
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// ============================================
// SCENE 25: Big Picture
// ============================================
const Scene25 = () => {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPhase((p) => (p < 4 ? p + 1 : 0));
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  const types = ["int", "float", "string", "double"];

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
          🎯 THE BIG PICTURE
        </motion.div>

        {/* Formula visualization */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1.5rem",
          }}
        >
          {/* Logic mold */}
          <GlassCard glow={colors.primary}>
            <div
              style={{
                fontFamily: "'SF Mono', monospace",
                fontSize: "18px",
                color: colors.text,
                textAlign: "center",
              }}
            >
              <div style={{ color: colors.secondary, marginBottom: "0.5rem" }}>
                template&lt;T&gt;
              </div>
              <div>Logic</div>
            </div>
          </GlassCard>

          <span style={{ fontSize: "2rem", color: colors.textSec }}>+</span>

          {/* Swapping types */}
          <div style={{ position: "relative", width: "120px", height: "80px" }}>
            {types.map((type, i) => (
              <motion.div
                key={type}
                initial={{ opacity: 0, y: 20 }}
                animate={{
                  opacity: phase === i ? 1 : 0,
                  y: phase === i ? 0 : 20,
                }}
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "1rem",
                  borderRadius: "16px",
                  background: `${colors[`type${type.charAt(0).toUpperCase() + type.slice(1)}`] || colors.primary}20`,
                  border: `2px solid ${colors[`type${type.charAt(0).toUpperCase() + type.slice(1)}`] || colors.primary}`,
                  fontFamily: "'SF Mono', monospace",
                  fontSize: "20px",
                  fontWeight: 700,
                  color:
                    colors[
                      `type${type.charAt(0).toUpperCase() + type.slice(1)}`
                    ] || colors.primary,
                }}
              >
                {type}
              </motion.div>
            ))}
          </div>

          <span style={{ fontSize: "2rem", color: colors.textSec }}>=</span>

          {/* Generated code */}
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            <GlassCard glow={colors.success}>
              <div
                style={{
                  fontFamily: "'SF Mono', monospace",
                  fontSize: "16px",
                  color: colors.success,
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>
                  ⚡
                </div>
                Generated
                <br />
                Code
              </div>
            </GlassCard>
          </motion.div>
        </div>

        {/* Formula text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            padding: "14px 28px",
            borderRadius: "100px",
            background: "rgba(255,255,255,0.05)",
            color: colors.text,
            fontSize: "16px",
            fontWeight: 500,
          }}
        >
          <span style={{ color: colors.primary }}>Logic</span>
          {" + "}
          <span style={{ color: colors.secondary }}>Types</span>
          {" = "}
          <span style={{ color: colors.success }}>Generated Code</span>
        </motion.div>
      </div>
    </div>
  );
};

// ============================================
// SCENE 26: Closing Scene
// ============================================
const Scene26 = () => {
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
      {/* Background elements fading */}
      <motion.div
        animate={{ opacity: phase >= 2 ? 0.1 : 0.3 }}
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at center, rgba(10, 132, 255, 0.15) 0%, transparent 70%)",
        }}
      />

      {/* Floating remnants */}
      {["int", "float", "T", "template"].map((text, i) => (
        <motion.div
          key={text}
          initial={{ opacity: 0.2 }}
          animate={{
            opacity: phase >= 2 ? 0 : 0.15,
            y: [0, -10, 0],
          }}
          transition={{
            y: { duration: 3 + i, repeat: Infinity },
            opacity: { duration: 1 },
          }}
          style={{
            position: "absolute",
            left: `${15 + i * 20}%`,
            top: `${20 + (i % 2) * 50}%`,
            fontFamily: "'SF Mono', monospace",
            fontSize: "1.5rem",
            color: colors.textMuted,
          }}
        >
          {text}
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
            fontSize: "2.5rem",
            fontWeight: 700,
            background: `linear-gradient(180deg, #FFFFFF 0%, ${colors.primary} 100%)`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            textAlign: "center",
            margin: 0,
          }}
        >
          You now understand
          <br />
          Templates in C++
        </motion.h1>

        <AnimatePresence>
          {phase >= 1 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{
                display: "flex",
                gap: "1rem",
              }}
            >
              {["📝", "⚡", "♻️", "🎯"].map((emoji, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.15 }}
                  style={{ fontSize: "2rem" }}
                >
                  {emoji}
                </motion.span>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {phase >= 2 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{
                padding: "14px 28px",
                borderRadius: "100px",
                background: `linear-gradient(135deg, ${colors.primary}, ${colors.accent})`,
                color: "white",
                fontWeight: 600,
                fontSize: "15px",
                boxShadow: `0 10px 30px ${colors.primary}40`,
              }}
            >
              Master Generic Programming! 🚀
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
export const AnimationStepsPart3 = [
  {
    title: "Static Assert Restriction",
    component: Scene19,
    contentText:
      'static_assert with Templates: static_assert(sizeof(T) > 4, "Type too small"); Compile-time assertions to restrict template parameters. Fails compilation with custom message if condition is false.',
  },
  {
    title: "Headers Rule",
    component: Scene20,
    contentText:
      "Template Definition in Headers: Templates must be defined in header files, not .cpp files. Compiler needs to see the full template definition at instantiation point. Put template code in .h or .hpp files.",
  },
  {
    title: "Advantages Summary",
    component: Scene21,
    contentText:
      "Template Advantages: 1) Code Reusability - write once, use for any type, 2) Type Safety - errors caught at compile time, 3) No Runtime Overhead - as fast as hand-written code, 4) Generic Programming - STL is built on templates.",
  },
  {
    title: "Disadvantage: Error Messages",
    component: Scene22,
    contentText:
      "Template Disadvantages: 1) Complex Error Messages - hard to read compiler errors, 2) Code Bloat - each instantiation generates new code, 3) Longer Compile Times - template instantiation takes time, 4) Steep Learning Curve.",
  },
  {
    title: "Before vs After",
    component: Scene23,
    contentText:
      "Before vs After Templates: BEFORE - write int max, double max, string max separately. AFTER - template<typename T> T max(T a, T b) works for all. Massive reduction in code duplication.",
  },
  {
    title: "Philosophy",
    component: Scene24,
    contentText:
      "Template Philosophy: 'Write code that writes code.' Templates are meta-programming - your template code tells the compiler how to generate actual functions/classes. Think in terms of patterns, not specific types.",
  },
  {
    title: "Big Picture",
    component: Scene25,
    contentText:
      "Big Picture: Templates are foundation of C++ STL (vector, map, algorithm). Generic programming paradigm. Used in modern C++ extensively. Master templates = master modern C++.",
  },
  {
    title: "Closing",
    component: Scene26,
    contentText:
      "Templates Summary Complete: Function templates, class templates, specialization (full and partial), non-type parameters, compile-time polymorphism. Next: Exception Handling in C++.",
  },
];

export default { AnimationStepsPart3 };
