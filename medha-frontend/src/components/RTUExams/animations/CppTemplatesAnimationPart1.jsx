/**
 * CppTemplatesAnimationPart1 - Scenes 1-9 (Apple Dark Theme)
 * RTU OOP Unit 5: Generic Programming & Code Reuse
 */
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { colors, containerStyle } from "./CppTemplatesTheme";

export const GlassCard = ({ children, style = {} }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    style={{
      background: "rgba(28, 28, 30, 0.65)",
      backdropFilter: "blur(25px) saturate(180%)",
      WebkitBackdropFilter: "blur(25px) saturate(180%)",
      border: "1px solid rgba(255, 255, 255, 0.12)",
      borderRadius: "24px",
      padding: "2rem",
      boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4)",
      ...style,
    }}
  >
    {children}
  </motion.div>
);

export const CodeBlock = ({ code, typing = false, delay = 0 }) => {
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
        }, 25);
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
        lineHeight: 1.6,
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

// SCENE 1: Title & Scope
const Scene1 = () => {
  const [showSubtitle, setShowSubtitle] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowSubtitle(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div style={containerStyle}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at center, rgba(10, 132, 255, 0.1) 0%, transparent 70%)",
        }}
      />

      <motion.div style={{ textAlign: "center", zIndex: 10 }}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            display: "inline-block",
            padding: "8px 20px",
            borderRadius: "100px",
            background: "rgba(255,255,255,0.08)",
            marginBottom: "1.5rem",
            color: colors.textSec,
            fontSize: "13px",
            fontWeight: 600,
            letterSpacing: "1px",
          }}
        >
          RTU OOP UNIT 5
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
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
          C++ Templates
        </motion.h1>

        {showSubtitle && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              color: colors.primary,
              fontSize: "1.5rem",
              marginTop: "1rem",
              fontWeight: 500,
            }}
          >
            Generic Programming & Code Reuse
          </motion.p>
        )}
      </motion.div>
    </div>
  );
};

// SCENE 2: Code Duplication Problem
const Scene2 = () => {
  const [visibleCount, setVisibleCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisibleCount((c) => (c < 4 ? c + 1 : c));
    }, 600);
    return () => clearInterval(interval);
  }, []);

  const functions = [
    { type: "int", color: colors.typeInt },
    { type: "float", color: colors.typeFloat },
    { type: "double", color: colors.typeDouble },
    { type: "long long", color: colors.accent },
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
        <div
          style={{
            color: colors.danger,
            fontWeight: 700,
            fontSize: "13px",
            letterSpacing: "1px",
          }}
        >
          THE PROBLEM: CODE DUPLICATION
        </div>

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
              initial={{ opacity: 0, x: -30 }}
              animate={{
                opacity: 1,
                x: 0,
                y: visibleCount === 4 ? i * -8 : 0,
              }}
              transition={{ duration: 0.4 }}
              style={{ position: "relative", zIndex: 4 - i }}
            >
              <GlassCard
                style={{
                  padding: "1rem 1.5rem",
                  borderColor:
                    visibleCount === 4
                      ? "rgba(255, 69, 58, 0.3)"
                      : "rgba(255,255,255,0.12)",
                  background:
                    visibleCount === 4
                      ? "rgba(255, 69, 58, 0.08)"
                      : "rgba(28, 28, 30, 0.65)",
                }}
              >
                <CodeBlock
                  code={`${fn.type} add(${fn.type} a, ${fn.type} b) { return a + b; }`}
                />
              </GlassCard>
            </motion.div>
          ))}
        </div>

        {visibleCount === 4 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{
              color: colors.danger,
              background: "rgba(255, 69, 58, 0.1)",
              padding: "12px 24px",
              borderRadius: "100px",
              fontWeight: 600,
              fontSize: "14px",
            }}
          >
            ⚠️ Same logic, different types
          </motion.div>
        )}
      </div>
    </div>
  );
};

// SCENE 3: The Idea of Placeholder
const Scene3 = () => {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 400),
      setTimeout(() => setPhase(2), 1000),
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
        <div
          style={{
            color: colors.success,
            fontWeight: 700,
            fontSize: "13px",
            letterSpacing: "1px",
          }}
        >
          THE SOLUTION: TYPE PLACEHOLDER
        </div>

        {/* T Badge - Positioned above code block */}
        {phase >= 1 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            style={{
              background: `linear-gradient(135deg, ${colors.primary}, ${colors.accent})`,
              padding: "10px 24px",
              borderRadius: "12px",
              color: "white",
              fontWeight: 700,
              fontSize: "20px",
              boxShadow: `0 10px 30px rgba(10, 132, 255, 0.4)`,
              marginBottom: "1rem",
            }}
          >
            T
          </motion.div>
        )}

        <GlassCard
          style={{
            opacity: phase >= 2 ? 0.8 : 1,
            borderColor:
              phase >= 1 ? "rgba(48, 209, 88, 0.3)" : "rgba(255,255,255,0.12)",
          }}
        >
          <CodeBlock code={`T add(T a, T b) { return a + b; }`} />
        </GlassCard>

        {phase >= 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              background: "#1c1c1e",
              padding: "12px 24px",
              borderRadius: "16px",
            }}
          >
            <span
              style={{
                fontSize: "24px",
                color: colors.primary,
                fontWeight: 700,
                fontFamily: "'SF Mono', monospace",
              }}
            >
              T
            </span>
            <span style={{ color: colors.textSec }}>=</span>
            <span style={{ color: colors.text, fontWeight: 500 }}>
              Type Placeholder
            </span>
          </motion.div>
        )}

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
            Blueprint that works with any type
          </motion.div>
        )}
      </div>
    </div>
  );
};

// SCENE 4: Template Syntax
const Scene4 = () => {
  const [highlights, setHighlights] = useState([]);

  useEffect(() => {
    const timers = [
      setTimeout(() => setHighlights(["template"]), 800),
      setTimeout(() => setHighlights(["template", "typename"]), 1600),
      setTimeout(() => setHighlights(["template", "typename", "T"]), 2400),
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
        <div
          style={{
            color: colors.primary,
            fontWeight: 700,
            fontSize: "13px",
            letterSpacing: "1px",
          }}
        >
          TEMPLATE SYNTAX
        </div>

        <GlassCard>
          <div
            style={{
              fontFamily: "'SF Mono', monospace",
              fontSize: "18px",
              lineHeight: 2,
            }}
          >
            <motion.span
              animate={{
                color: highlights.includes("template")
                  ? colors.secondary
                  : colors.text,
                textShadow: highlights.includes("template")
                  ? `0 0 20px ${colors.secondary}`
                  : "none",
              }}
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
            >
              typename{" "}
            </motion.span>
            <motion.span
              animate={{
                color: highlights.includes("T") ? colors.primary : colors.text,
                textShadow: highlights.includes("T")
                  ? `0 0 15px ${colors.primary}`
                  : "none",
              }}
            >
              T
            </motion.span>
            <span style={{ color: colors.textSec }}>{">"}</span>
            <br />
            <motion.span
              animate={{
                color: highlights.includes("T") ? colors.primary : colors.text,
              }}
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
              animate={{ opacity: highlights.length > i ? 1 : 0.3, y: 0 }}
              transition={{ delay: 0.5 + i * 0.2 }}
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
                }}
              >
                {item.word}
              </div>
              <div
                style={{
                  color: colors.textSec,
                  fontSize: "12px",
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

// SCENE 5: Template Instantiation
const Scene5 = () => {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const interval = setInterval(
      () => setPhase((p) => (p < 4 ? p + 1 : p)),
      800
    );
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
              letterSpacing: "1px",
              marginBottom: "12px",
            }}
          >
            TEMPLATE
          </div>
          <GlassCard style={{ minWidth: "200px" }}>
            <CodeBlock code={`template<typename T>\nT add(T a, T b)`} />
          </GlassCard>
        </div>

        {/* Compiler */}
        <motion.div
          animate={{
            borderColor: phase > 0 ? colors.primary : "rgba(255,255,255,0.1)",
            boxShadow: phase > 0 ? `0 0 40px ${colors.primary}30` : "none",
          }}
          style={{
            width: "100px",
            height: "100px",
            borderRadius: "24px",
            background: "linear-gradient(135deg, #2c2c2e, #1c1c1e)",
            border: "2px solid rgba(255,255,255,0.1)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <motion.div
            animate={{ rotate: phase > 0 ? 360 : 0 }}
            transition={{ duration: 1 }}
          >
            ⚡️
          </motion.div>
          <div
            style={{
              fontSize: "10px",
              color: colors.textSec,
              marginTop: "8px",
              fontWeight: 600,
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
              letterSpacing: "1px",
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
                  initial={{ opacity: 0, x: 20, scale: 0.9 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  style={{
                    fontFamily: "'SF Mono', monospace",
                    color: t.color,
                    background: "#1c1c1e",
                    padding: "10px 16px",
                    borderRadius: "12px",
                    border: `1px solid ${t.color}30`,
                    fontSize: "13px",
                    fontWeight: 600,
                  }}
                >
                  {t.type} add({t.type}, {t.type})
                </motion.div>
              )
          )}
        </div>
      </div>
    </div>
  );
};

// SCENE 6: Compile Time vs Run Time
const Scene6 = () => {
  const [showBadge, setShowBadge] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowBadge(true), 2000);
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
        <div style={{ display: "flex", gap: "2rem" }}>
          {/* Compile Time */}
          <GlassCard
            style={{ minWidth: "280px", borderColor: "rgba(48, 209, 88, 0.3)" }}
          >
            <div
              style={{
                color: colors.success,
                fontWeight: 700,
                fontSize: "13px",
                letterSpacing: "1px",
                marginBottom: "1.5rem",
              }}
            >
              COMPILE TIME
            </div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
              }}
            >
              {["Template parsing", "Type substitution", "Code generation"].map(
                (item, i) => (
                  <motion.div
                    key={item}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.8 + i * 0.3 }}
                    style={{
                      color: colors.text,
                      fontSize: "14px",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <span style={{ color: colors.success }}>✓</span> {item}
                  </motion.div>
                )
              )}
            </motion.div>
          </GlassCard>

          {/* Run Time */}
          <GlassCard style={{ minWidth: "280px", opacity: 0.6 }}>
            <div
              style={{
                color: colors.textSec,
                fontWeight: 700,
                fontSize: "13px",
                letterSpacing: "1px",
                marginBottom: "1.5rem",
              }}
            >
              RUN TIME
            </div>
            <div style={{ color: colors.textSec, fontSize: "14px" }}>
              No template overhead
              <br />
              Direct function calls
              <br />
              Maximum performance
            </div>
          </GlassCard>
        </div>

        {showBadge && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            style={{
              background: `linear-gradient(135deg, ${colors.success}, #28a745)`,
              padding: "14px 28px",
              borderRadius: "100px",
              color: "white",
              fontWeight: 700,
              fontSize: "15px",
              boxShadow: `0 10px 30px rgba(48, 209, 88, 0.4)`,
            }}
          >
            🚀 Zero Runtime Overhead
          </motion.div>
        )}
      </div>
    </div>
  );
};

// SCENE 7: Explicit vs Implicit Call
const Scene7 = () => {
  const [showLabels, setShowLabels] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowLabels(true), 1000);
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
        <div
          style={{
            color: colors.primary,
            fontWeight: 700,
            fontSize: "13px",
            letterSpacing: "1px",
          }}
        >
          CALLING TEMPLATES
        </div>

        <div
          style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
        >
          {/* Explicit */}
          <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
            <GlassCard style={{ minWidth: "250px" }}>
              <CodeBlock code={`add<int>(3, 4)`} />
            </GlassCard>
            {showLabels && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                style={{
                  padding: "8px 20px",
                  borderRadius: "100px",
                  background: colors.secondary,
                  color: "#000",
                  fontWeight: 600,
                  fontSize: "13px",
                }}
              >
                Explicit
              </motion.div>
            )}
          </div>

          {/* Implicit */}
          <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
            <GlassCard style={{ minWidth: "250px" }}>
              <CodeBlock code={`add(3, 4)`} />
            </GlassCard>
            {showLabels && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                style={{
                  padding: "8px 20px",
                  borderRadius: "100px",
                  background: colors.accent,
                  color: "white",
                  fontWeight: 600,
                  fontSize: "13px",
                }}
              >
                Type Deduction
              </motion.div>
            )}
          </div>
        </div>

        {showLabels && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            style={{
              color: colors.textSec,
              fontSize: "14px",
              textAlign: "center",
            }}
          >
            Compiler deduces type from arguments
          </motion.div>
        )}
      </div>
    </div>
  );
};

// SCENE 8: Multiple Type Parameters
const Scene8 = () => {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const interval = setInterval(
      () => setPhase((p) => (p < 3 ? p + 1 : p)),
      800
    );
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
        <div
          style={{
            color: colors.accent,
            fontWeight: 700,
            fontSize: "13px",
            letterSpacing: "1px",
          }}
        >
          MULTIPLE TYPE PARAMETERS
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            marginBottom: "1rem",
          }}
        >
          {phase >= 1 && (
            <motion.div
              initial={{ opacity: 0, y: -30, scale: 0 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              style={{
                padding: "12px 24px",
                borderRadius: "12px",
                background: `linear-gradient(135deg, ${colors.typeInt}30, transparent)`,
                border: `1px solid ${colors.typeInt}`,
                color: colors.typeInt,
                fontWeight: 700,
                fontSize: "20px",
                fontFamily: "'SF Mono', monospace",
              }}
            >
              T
            </motion.div>
          )}
          {phase >= 2 && (
            <motion.div
              initial={{ opacity: 0, y: -30, scale: 0 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              style={{
                padding: "12px 24px",
                borderRadius: "12px",
                background: `linear-gradient(135deg, ${colors.typeFloat}30, transparent)`,
                border: `1px solid ${colors.typeFloat}`,
                color: colors.typeFloat,
                fontWeight: 700,
                fontSize: "20px",
                fontFamily: "'SF Mono', monospace",
              }}
            >
              U
            </motion.div>
          )}
        </div>

        <GlassCard
          style={{
            borderColor:
              phase >= 3 ? "rgba(191, 90, 242, 0.3)" : "rgba(255,255,255,0.12)",
          }}
        >
          <CodeBlock
            code={`template<typename T, typename U>
auto add(T a, U b) {
    return a + b;
}`}
          />
        </GlassCard>

        {phase >= 3 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ display: "flex", alignItems: "center", gap: "1rem" }}
          >
            <div
              style={{
                padding: "8px 16px",
                background: `${colors.typeInt}20`,
                color: colors.typeInt,
                borderRadius: "10px",
                fontFamily: "'SF Mono', monospace",
                fontWeight: 600,
              }}
            >
              T = int
            </div>
            <span style={{ color: colors.textSec }}>+</span>
            <div
              style={{
                padding: "8px 16px",
                background: `${colors.typeFloat}20`,
                color: colors.typeFloat,
                borderRadius: "10px",
                fontFamily: "'SF Mono', monospace",
                fontWeight: 600,
              }}
            >
              U = double
            </div>
            <span style={{ color: colors.textSec }}>=</span>
            <div
              style={{
                padding: "8px 16px",
                background: `${colors.success}20`,
                color: colors.success,
                borderRadius: "10px",
                fontWeight: 600,
              }}
            >
              Works!
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

// SCENE 9: Class Template
const Scene9 = () => {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const interval = setInterval(
      () => setPhase((p) => (p < 4 ? p + 1 : p)),
      700
    );
    return () => clearInterval(interval);
  }, []);

  const boxes = [
    { type: "int", value: "42", color: colors.typeInt },
    { type: "float", value: "3.14", color: colors.typeFloat },
    { type: "string", value: '"Hi"', color: colors.typeString },
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
        <div
          style={{
            color: colors.secondary,
            fontWeight: 700,
            fontSize: "13px",
            letterSpacing: "1px",
          }}
        >
          CLASS TEMPLATES
        </div>

        <GlassCard>
          <CodeBlock
            code={`template<typename T>
class Box {
    T value;
public:
    Box(T v) : value(v) {}
};`}
          />
        </GlassCard>

        {phase >= 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ display: "flex", alignItems: "center", gap: "1rem" }}
          >
            <div
              style={{
                padding: "16px 28px",
                borderRadius: "16px",
                background:
                  "linear-gradient(135deg, rgba(255,255,255,0.1), transparent)",
                border: "1px solid rgba(255,255,255,0.2)",
                fontFamily: "'SF Mono', monospace",
                fontSize: "18px",
                color: colors.text,
                fontWeight: 600,
              }}
            >
              Box{"<T>"}
            </div>

            <motion.div
              animate={{ x: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              <span style={{ fontSize: "24px", color: colors.textSec }}>→</span>
            </motion.div>

            <div style={{ display: "flex", gap: "1rem" }}>
              {boxes.map(
                (box, i) =>
                  phase > i + 1 && (
                    <motion.div
                      key={box.type}
                      initial={{ opacity: 0, scale: 0, rotate: -10 }}
                      animate={{ opacity: 1, scale: 1, rotate: 0 }}
                      style={{
                        width: "100px",
                        height: "100px",
                        borderRadius: "20px",
                        background: `linear-gradient(135deg, ${box.color}20, transparent)`,
                        border: `1px solid ${box.color}40`,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        boxShadow: `0 10px 30px ${box.color}20`,
                      }}
                    >
                      <div
                        style={{
                          color: box.color,
                          fontSize: "11px",
                          fontWeight: 600,
                          marginBottom: "4px",
                        }}
                      >
                        Box{"<"}
                        {box.type}
                        {">"}
                      </div>
                      <div
                        style={{
                          color: colors.text,
                          fontFamily: "'SF Mono', monospace",
                          fontSize: "16px",
                          fontWeight: 600,
                        }}
                      >
                        {box.value}
                      </div>
                    </motion.div>
                  )
              )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export const AnimationStepsPart1 = [
  { title: "Title & Scope", component: Scene1 },
  { title: "Code Duplication", component: Scene2 },
  { title: "Type Placeholder", component: Scene3 },
  { title: "Template Syntax", component: Scene4 },
  { title: "Instantiation", component: Scene5 },
  { title: "Compile vs Runtime", component: Scene6 },
  { title: "Explicit vs Implicit", component: Scene7 },
  { title: "Multiple Parameters", component: Scene8 },
  { title: "Class Templates", component: Scene9 },
];

export default {
  AnimationStepsPart1,
  colors,
  containerStyle,
  GlassCard,
  CodeBlock,
};
