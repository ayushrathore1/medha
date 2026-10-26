/**
 * CppTemplatesAnimationPart3 - Scenes 19-26 (Apple Dark Theme)
 * RTU OOP Unit 5: Big Picture, Philosophy & Closing
 */
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { colors, containerStyle } from "./CppTemplatesTheme";
import { GlassCard, CodeBlock } from "./CppTemplatesAnimationPart1";

// SCENE 19: Big Picture
const Scene19 = () => {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const interval = setInterval(
      () => setPhase((p) => (p < 3 ? p + 1 : p)),
      600
    );
    return () => clearInterval(interval);
  }, []);

  const concepts = [
    { text: "Reuse", color: colors.primary, x: 0, y: -80 },
    { text: "Performance", color: colors.success, x: -70, y: 50 },
    { text: "Abstraction", color: colors.accent, x: 70, y: 50 },
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
            color: colors.secondary,
            fontWeight: 700,
            fontSize: "13px",
            letterSpacing: "1px",
          }}
        >
          THE BIG PICTURE
        </div>

        <div style={{ position: "relative", width: "300px", height: "200px" }}>
          {/* Triangle Lines */}
          {phase >= 3 && (
            <svg
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
              }}
            >
              <motion.path
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.3 }}
                transition={{ duration: 1 }}
                d="M 150 30 L 80 160 L 220 160 Z"
                fill="none"
                stroke={colors.primary}
                strokeWidth="2"
              />
            </svg>
          )}

          {/* Concepts */}
          {concepts.map(
            (concept, i) =>
              phase > i && (
                <motion.div
                  key={concept.text}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  style={{
                    position: "absolute",
                    left: "50%",
                    top: "50%",
                    transform: `translate(calc(-50% + ${concept.x}px), calc(-50% + ${concept.y}px))`,
                    padding: "16px 28px",
                    borderRadius: "16px",
                    background: `${concept.color}15`,
                    border: `1px solid ${concept.color}40`,
                    color: concept.color,
                    fontWeight: 700,
                    fontSize: "16px",
                  }}
                >
                  {concept.text}
                </motion.div>
              )
          )}
        </div>

        {phase >= 3 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              color: colors.text,
              fontSize: "18px",
              fontWeight: 600,
              textAlign: "center",
            }}
          >
            Templates unite all three
          </motion.div>
        )}
      </div>
    </div>
  );
};

// SCENE 20: Generic Programming
const Scene20 = () => {
  const types = ["int", "float", "string", "double"];
  const [currentType, setCurrentType] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentType((t) => (t + 1) % types.length);
    }, 1200);
    return () => clearInterval(interval);
  }, [types.length]);

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
          GENERIC PROGRAMMING
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
          {/* Algorithm */}
          <GlassCard style={{ minWidth: "150px", textAlign: "center" }}>
            <div
              style={{
                color: colors.textSec,
                fontSize: "11px",
                fontWeight: 600,
                marginBottom: "8px",
              }}
            >
              ALGORITHM
            </div>
            <div
              style={{
                color: colors.text,
                fontFamily: "'SF Mono', monospace",
                fontSize: "16px",
              }}
            >
              sort{"<T>"}()
            </div>
          </GlassCard>

          <span style={{ color: colors.textSec, fontSize: "24px" }}>+</span>

          {/* Swapping Type */}
          <motion.div
            key={currentType}
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20 }}
            style={{
              padding: "1.5rem 2rem",
              borderRadius: "16px",
              background: `${colors.typeInt}15`,
              border: `1px solid ${colors.typeInt}40`,
              minWidth: "100px",
              textAlign: "center",
            }}
          >
            <div
              style={{
                color: colors.textSec,
                fontSize: "11px",
                fontWeight: 600,
                marginBottom: "8px",
              }}
            >
              TYPE
            </div>
            <div
              style={{
                color: colors.typeInt,
                fontFamily: "'SF Mono', monospace",
                fontSize: "18px",
                fontWeight: 700,
              }}
            >
              {types[currentType]}
            </div>
          </motion.div>

          <span style={{ color: colors.textSec, fontSize: "24px" }}>=</span>

          {/* Generated */}
          <motion.div
            key={`gen-${currentType}`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{
              padding: "1.5rem 2rem",
              borderRadius: "16px",
              background: `${colors.success}15`,
              border: `1px solid ${colors.success}40`,
            }}
          >
            <div
              style={{
                color: colors.textSec,
                fontSize: "11px",
                fontWeight: 600,
                marginBottom: "8px",
              }}
            >
              GENERATED
            </div>
            <div
              style={{
                color: colors.success,
                fontFamily: "'SF Mono', monospace",
                fontSize: "14px",
                fontWeight: 600,
              }}
            >
              sort({types[currentType]}[])
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

// SCENE 21: Why C++ Is Powerful
const Scene21 = () => {
  const [showBridge, setShowBridge] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowBridge(true), 1000);
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
            color: colors.accent,
            fontWeight: 700,
            fontSize: "13px",
            letterSpacing: "1px",
          }}
        >
          WHY C++ IS POWERFUL
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "2rem",
            position: "relative",
          }}
        >
          {/* Low Level */}
          <GlassCard style={{ minWidth: "160px", textAlign: "center" }}>
            <div
              style={{
                color: colors.danger,
                fontSize: "24px",
                marginBottom: "8px",
              }}
            >
              ⚙️
            </div>
            <div
              style={{ color: colors.text, fontWeight: 700, fontSize: "16px" }}
            >
              Low Level
            </div>
            <div
              style={{
                color: colors.textSec,
                fontSize: "12px",
                marginTop: "4px",
              }}
            >
              Memory, Pointers
            </div>
          </GlassCard>

          {/* Bridge */}
          {showBridge && (
            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              style={{
                padding: "12px 24px",
                borderRadius: "12px",
                background: `linear-gradient(90deg, ${colors.danger}30, ${colors.accent}30, ${colors.primary}30)`,
                border: "1px solid rgba(255,255,255,0.2)",
              }}
            >
              <div
                style={{
                  color: colors.text,
                  fontWeight: 700,
                  fontSize: "14px",
                  textAlign: "center",
                }}
              >
                Templates
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  marginTop: "4px",
                }}
              >
                <span style={{ color: colors.textSec }}>←</span>
                <span style={{ color: colors.secondary, fontSize: "12px" }}>
                  Bridge
                </span>
                <span style={{ color: colors.textSec }}>→</span>
              </div>
            </motion.div>
          )}

          {/* High Level */}
          <GlassCard style={{ minWidth: "160px", textAlign: "center" }}>
            <div
              style={{
                color: colors.primary,
                fontSize: "24px",
                marginBottom: "8px",
              }}
            >
              🎨
            </div>
            <div
              style={{ color: colors.text, fontWeight: 700, fontSize: "16px" }}
            >
              High Level
            </div>
            <div
              style={{
                color: colors.textSec,
                fontSize: "12px",
                marginTop: "4px",
              }}
            >
              Abstraction, STL
            </div>
          </GlassCard>
        </div>

        {showBridge && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            style={{ color: colors.textSec, fontSize: "14px" }}
          >
            Best of both worlds
          </motion.div>
        )}
      </div>
    </div>
  );
};

// SCENE 22: Before vs After
const Scene22 = () => {
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setCollapsed(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  const functions = ["int", "float", "double", "long"];

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
          BEFORE VS AFTER
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "3rem" }}>
          {/* Before */}
          <div style={{ position: "relative" }}>
            <div
              style={{
                color: colors.danger,
                fontSize: "11px",
                fontWeight: 600,
                marginBottom: "12px",
                textAlign: "center",
              }}
            >
              BEFORE
            </div>
            <motion.div
              animate={{
                opacity: collapsed ? 0.3 : 1,
                scale: collapsed ? 0.8 : 1,
                x: collapsed ? 100 : 0,
              }}
              style={{ display: "flex", flexDirection: "column", gap: "8px" }}
            >
              {functions.map((fn, i) => (
                <motion.div
                  key={fn}
                  animate={{
                    y: collapsed ? i * -20 : 0,
                    opacity: collapsed ? (i === 0 ? 1 : 0) : 1,
                  }}
                  style={{
                    padding: "10px 16px",
                    borderRadius: "10px",
                    background: "#1c1c1e",
                    border: "1px solid rgba(255, 69, 58, 0.2)",
                    fontFamily: "'SF Mono', monospace",
                    fontSize: "13px",
                    color: colors.text,
                  }}
                >
                  {fn} add({fn}, {fn})
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Arrow */}
          {collapsed && (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{ fontSize: "32px", color: colors.success }}
            >
              →
            </motion.div>
          )}

          {/* After */}
          {collapsed && (
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div
                style={{
                  color: colors.success,
                  fontSize: "11px",
                  fontWeight: 600,
                  marginBottom: "12px",
                  textAlign: "center",
                }}
              >
                AFTER
              </div>
              <GlassCard
                style={{
                  borderColor: `${colors.success}40`,
                  boxShadow: `0 0 40px ${colors.success}15`,
                }}
              >
                <CodeBlock
                  code={`template<typename T>
T add(T a, T b)`}
                />
              </GlassCard>
            </motion.div>
          )}
        </div>

        {collapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              padding: "10px 20px",
              borderRadius: "100px",
              background: `${colors.success}15`,
              color: colors.success,
              fontWeight: 600,
              fontSize: "14px",
            }}
          >
            4 functions → 1 template
          </motion.div>
        )}
      </div>
    </div>
  );
};

// SCENE 23: Philosophy
const Scene23 = () => {
  const [displayed, setDisplayed] = useState("");
  const text = "Write once. Generate many times.";

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (i <= text.length) {
        setDisplayed(text.slice(0, i));
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
            "radial-gradient(ellipse at center, rgba(191, 90, 242, 0.08) 0%, transparent 60%)",
        }}
      />

      <div style={{ textAlign: "center", zIndex: 10 }}>
        <motion.h1
          style={{
            fontSize: "3.5rem",
            fontWeight: 700,
            letterSpacing: "-0.02em",
            color: colors.text,
            margin: 0,
            lineHeight: 1.2,
          }}
        >
          {displayed}
          {displayed.length < text.length && (
            <motion.span
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 0.8, repeat: Infinity }}
              style={{ color: colors.accent }}
            >
              |
            </motion.span>
          )}
        </motion.h1>

        {displayed.length === text.length && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            style={{
              color: colors.textSec,
              fontSize: "1.25rem",
              marginTop: "1.5rem",
            }}
          >
            The philosophy of templates
          </motion.p>
        )}
      </div>
    </div>
  );
};

// SCENE 24: How STL Uses Templates
const Scene24 = () => {
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
            color: colors.secondary,
            fontWeight: 700,
            fontSize: "13px",
            letterSpacing: "1px",
          }}
        >
          HOW STL USES TEMPLATES
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
          {/* Template Mold */}
          <GlassCard style={{ position: "relative", overflow: "visible" }}>
            <div
              style={{
                fontFamily: "'SF Mono', monospace",
                fontSize: "20px",
                color: colors.text,
                textAlign: "center",
              }}
            >
              vector{"<"}
              <span style={{ color: colors.primary }}>T</span>
              {">"}
            </div>

            {/* Slot */}
            {phase >= 1 && (
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{
                  position: "absolute",
                  top: -20,
                  right: -20,
                  width: "50px",
                  height: "50px",
                  borderRadius: "12px",
                  background: `${colors.primary}20`,
                  border: `2px dashed ${colors.primary}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {phase >= 2 && (
                  <motion.span
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{
                      color: colors.typeInt,
                      fontFamily: "'SF Mono', monospace",
                      fontWeight: 700,
                      fontSize: "14px",
                    }}
                  >
                    int
                  </motion.span>
                )}
              </motion.div>
            )}
          </GlassCard>

          {phase >= 2 && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{ fontSize: "24px", color: colors.success }}
            >
              =
            </motion.span>
          )}

          {phase >= 3 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <GlassCard
                style={{
                  borderColor: `${colors.success}40`,
                  boxShadow: `0 0 30px ${colors.success}15`,
                }}
              >
                <div
                  style={{
                    fontFamily: "'SF Mono', monospace",
                    fontSize: "20px",
                    color: colors.success,
                  }}
                >
                  vector{"<"}int{">"}
                </div>
              </GlassCard>
            </motion.div>
          )}
        </div>

        {phase >= 3 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ color: colors.textSec, fontSize: "14px" }}
          >
            Type drops into the template mold
          </motion.div>
        )}
      </div>
    </div>
  );
};

// SCENE 25: Concept Map
const Scene25 = () => {
  const [activeIndex, setActiveIndex] = useState(-1);

  const concepts = [
    { name: "Basics", color: colors.primary },
    { name: "Class", color: colors.secondary },
    { name: "Specialization", color: colors.accent },
    { name: "STL", color: colors.success },
    { name: "Metaprogramming", color: colors.typeFloat },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((i) => (i < concepts.length - 1 ? i + 1 : i));
    }, 600);
    return () => clearInterval(interval);
  }, [concepts.length]);

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
            color: colors.text,
            fontWeight: 700,
            fontSize: "13px",
            letterSpacing: "1px",
          }}
        >
          CONCEPT MAP
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          {concepts.map((concept, i) => (
            <React.Fragment key={concept.name}>
              <motion.div
                initial={{ opacity: 0.3, scale: 0.9 }}
                animate={{
                  opacity: i <= activeIndex ? 1 : 0.3,
                  scale: i <= activeIndex ? 1 : 0.9,
                  boxShadow:
                    i === activeIndex ? `0 0 30px ${concept.color}40` : "none",
                }}
                style={{
                  padding: "14px 24px",
                  borderRadius: "14px",
                  background:
                    i <= activeIndex ? `${concept.color}20` : "#1c1c1e",
                  border: `1px solid ${i <= activeIndex ? concept.color : "rgba(255,255,255,0.1)"}`,
                  color: i <= activeIndex ? concept.color : colors.textSec,
                  fontWeight: 600,
                  fontSize: "14px",
                }}
              >
                {concept.name}
              </motion.div>

              {i < concepts.length - 1 && (
                <motion.span
                  animate={{
                    opacity: i < activeIndex ? 1 : 0.3,
                    color: i < activeIndex ? colors.text : colors.textSec,
                  }}
                  style={{ fontSize: "18px" }}
                >
                  →
                </motion.span>
              )}
            </React.Fragment>
          ))}
        </div>

        {activeIndex === concepts.length - 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ color: colors.success, fontWeight: 600, fontSize: "15px" }}
          >
            ✓ Complete Learning Path
          </motion.div>
        )}
      </div>
    </div>
  );
};

// SCENE 26: Closing
const Scene26 = () => {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setFadeOut(true), 4000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div style={containerStyle}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: fadeOut ? 0.3 : 1 }}
        transition={{ duration: 2 }}
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at center, rgba(48, 209, 88, 0.1) 0%, transparent 60%)",
        }}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        style={{ textAlign: "center", zIndex: 10, maxWidth: "700px" }}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", delay: 0.3 }}
          style={{
            width: "100px",
            height: "100px",
            borderRadius: "50%",
            background: `linear-gradient(135deg, ${colors.success}, #28a745)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 2rem",
            boxShadow: `0 20px 60px ${colors.success}40`,
          }}
        >
          <span style={{ fontSize: "48px" }}>✓</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          style={{
            fontSize: "2.5rem",
            fontWeight: 700,
            letterSpacing: "-0.02em",
            color: colors.text,
            margin: 0,
            lineHeight: 1.4,
          }}
        >
          You now understand how
          <br />
          <span style={{ color: colors.primary }}>the compiler thinks.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: fadeOut ? 0.5 : 1 }}
          transition={{ delay: 1 }}
          style={{
            color: colors.textSec,
            fontSize: "1.2rem",
            marginTop: "1.5rem",
            lineHeight: 1.6,
          }}
        >
          Templates are the foundation of modern C++
        </motion.p>
      </motion.div>
    </div>
  );
};

export const AnimationStepsPart3 = [
  { title: "Big Picture", component: Scene19 },
  { title: "Generic Programming", component: Scene20 },
  { title: "C++ Power", component: Scene21 },
  { title: "Before vs After", component: Scene22 },
  { title: "Philosophy", component: Scene23 },
  { title: "STL Templates", component: Scene24 },
  { title: "Concept Map", component: Scene25 },
  { title: "Closing", component: Scene26 },
];

export default { AnimationStepsPart3 };
