/**
 * CppTemplatesAnimationPart2 - Scenes 10-18 (Apple Dark Theme)
 * RTU OOP Unit 5: Specialization, STL & Advanced Concepts
 */
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { colors, containerStyle } from "./CppTemplatesTheme";
import { GlassCard, CodeBlock } from "./CppTemplatesAnimationPart1";

// SCENE 10: Compile-Time Polymorphism
const Scene10 = () => (
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
        COMPILE-TIME POLYMORPHISM
      </div>

      <GlassCard
        style={{
          padding: 0,
          overflow: "hidden",
          display: "flex",
          minWidth: "500px",
        }}
      >
        {/* Runtime Side */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            flex: 1,
            padding: "2rem",
            borderRight: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          <div
            style={{
              color: colors.danger,
              fontWeight: 700,
              fontSize: "12px",
              letterSpacing: "1px",
              marginBottom: "1rem",
            }}
          >
            RUNTIME POLYMORPHISM
          </div>
          <div
            style={{ color: colors.textSec, fontSize: "14px", lineHeight: 1.8 }}
          >
            <div>• virtual functions</div>
            <div>• V-Table lookup</div>
            <div>• Runtime overhead</div>
          </div>
        </motion.div>

        {/* Compile-Time Side */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          style={{
            flex: 1,
            padding: "2rem",
            background: `linear-gradient(135deg, ${colors.success}10, transparent)`,
          }}
        >
          <div
            style={{
              color: colors.success,
              fontWeight: 700,
              fontSize: "12px",
              letterSpacing: "1px",
              marginBottom: "1rem",
            }}
          >
            COMPILE-TIME POLYMORPHISM
          </div>
          <div
            style={{ color: colors.text, fontSize: "14px", lineHeight: 1.8 }}
          >
            <div>• templates</div>
            <div>• Direct call</div>
            <div style={{ color: colors.success, fontWeight: 600 }}>
              • Zero overhead
            </div>
          </div>
        </motion.div>
      </GlassCard>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1 }}
        style={{
          padding: "12px 24px",
          borderRadius: "100px",
          background: `${colors.success}20`,
          border: `1px solid ${colors.success}40`,
          color: colors.success,
          fontWeight: 600,
          fontSize: "14px",
        }}
      >
        Templates = Static Polymorphism
      </motion.div>
    </div>
  </div>
);

// SCENE 11: Full Specialization
const Scene11 = () => {
  const [showSpecialized, setShowSpecialized] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowSpecialized(true), 1200);
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
            color: colors.secondary,
            fontWeight: 700,
            fontSize: "13px",
            letterSpacing: "1px",
          }}
        >
          FULL SPECIALIZATION
        </div>

        <div style={{ display: "flex", gap: "2rem", alignItems: "flex-start" }}>
          {/* Generic */}
          <div>
            <div
              style={{
                color: colors.textSec,
                fontSize: "11px",
                fontWeight: 600,
                marginBottom: "8px",
                textAlign: "center",
              }}
            >
              GENERIC
            </div>
            <GlassCard style={{ opacity: showSpecialized ? 0.5 : 1 }}>
              <CodeBlock
                code={`template<typename T>
class Printer {
    void print(T val);
};`}
              />
            </GlassCard>
          </div>

          {/* Specialized */}
          {showSpecialized && (
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div
                style={{
                  color: colors.secondary,
                  fontSize: "11px",
                  fontWeight: 600,
                  marginBottom: "8px",
                  textAlign: "center",
                }}
              >
                SPECIALIZED
              </div>
              <GlassCard
                style={{
                  borderColor: `${colors.secondary}40`,
                  boxShadow: `0 0 40px ${colors.secondary}20`,
                }}
              >
                <CodeBlock
                  code={`template<>
class Printer<char*> {
    void print(char* val);
};`}
                />
              </GlassCard>
            </motion.div>
          )}
        </div>

        {showSpecialized && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ color: colors.textSec, fontSize: "14px" }}
          >
            Custom behavior for specific types
          </motion.div>
        )}
      </div>
    </div>
  );
};

// SCENE 12: Partial Specialization
const Scene12 = () => {
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
        <div
          style={{
            color: colors.accent,
            fontWeight: 700,
            fontSize: "13px",
            letterSpacing: "1px",
          }}
        >
          PARTIAL SPECIALIZATION
        </div>

        <div style={{ display: "flex", gap: "2rem" }}>
          {/* Generic Pair */}
          <div>
            <div
              style={{
                color: colors.textSec,
                fontSize: "11px",
                fontWeight: 600,
                marginBottom: "8px",
                textAlign: "center",
              }}
            >
              GENERIC
            </div>
            <GlassCard>
              <div
                style={{
                  fontFamily: "'SF Mono', monospace",
                  fontSize: "18px",
                  color: colors.text,
                }}
              >
                Pair{"<"}
                <span style={{ color: colors.typeInt }}>T</span>,{" "}
                <span style={{ color: colors.typeFloat }}>U</span>
                {">"}
              </div>
            </GlassCard>
          </div>

          {/* Partial Specialized */}
          {phase >= 1 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div
                style={{
                  color: colors.accent,
                  fontSize: "11px",
                  fontWeight: 600,
                  marginBottom: "8px",
                  textAlign: "center",
                }}
              >
                PARTIALLY SPECIALIZED
              </div>
              <GlassCard style={{ borderColor: `${colors.accent}40` }}>
                <div
                  style={{
                    fontFamily: "'SF Mono', monospace",
                    fontSize: "18px",
                    color: colors.text,
                  }}
                >
                  Pair{"<"}
                  <span style={{ color: colors.typeInt }}>T</span>,{" "}
                  <motion.span
                    initial={{ background: "transparent" }}
                    animate={{ background: `${colors.typeInt}30` }}
                    style={{
                      color: colors.typeInt,
                      padding: "2px 8px",
                      borderRadius: "6px",
                      border: `1px solid ${colors.typeInt}`,
                    }}
                  >
                    int
                  </motion.span>
                  {">"}
                </div>
              </GlassCard>
            </motion.div>
          )}
        </div>

        {phase >= 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              color: colors.textSec,
              fontSize: "14px",
            }}
          >
            <span
              style={{
                color: colors.typeInt,
                fontFamily: "'SF Mono', monospace",
              }}
            >
              int
            </span>
            snaps into second slot
          </motion.div>
        )}
      </div>
    </div>
  );
};

// SCENE 13: Non-Type Template Parameter
const Scene13 = () => {
  const [showBlocks, setShowBlocks] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowBlocks(true), 1500);
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
          NON-TYPE TEMPLATE PARAMETER
        </div>

        <GlassCard>
          <CodeBlock
            code={`template<int N>
class Array {
    int data[N];
};`}
          />
        </GlassCard>

        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <motion.div
            animate={{ x: showBlocks ? 0 : -50, opacity: showBlocks ? 1 : 0 }}
            style={{
              padding: "12px 24px",
              borderRadius: "12px",
              background: colors.primary,
              color: "white",
              fontWeight: 700,
              fontSize: "20px",
              fontFamily: "'SF Mono', monospace",
            }}
          >
            10
          </motion.div>

          <motion.span
            animate={{ opacity: showBlocks ? 1 : 0 }}
            style={{ fontSize: "20px", color: colors.textSec }}
          >
            →
          </motion.span>

          <motion.div
            animate={{ opacity: showBlocks ? 1 : 0 }}
            style={{
              fontFamily: "'SF Mono', monospace",
              color: colors.text,
              fontSize: "16px",
            }}
          >
            Array{"<"}
            <span style={{ color: colors.primary }}>10</span>
            {">"}
          </motion.div>
        </div>

        {showBlocks && (
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            style={{ display: "flex", gap: "4px" }}
          >
            {Array(10)
              .fill(0)
              .map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "6px",
                    background: `linear-gradient(135deg, ${colors.primary}30, ${colors.primary}10)`,
                    border: `1px solid ${colors.primary}40`,
                  }}
                />
              ))}
          </motion.div>
        )}

        {showBlocks && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ color: colors.textSec, fontSize: "13px" }}
          >
            Value known at compile time
          </motion.div>
        )}
      </div>
    </div>
  );
};

// SCENE 14: Constraints
const Scene14 = () => {
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
        <div
          style={{
            color: colors.secondary,
            fontWeight: 700,
            fontSize: "13px",
            letterSpacing: "1px",
          }}
        >
          TYPE CONSTRAINTS
        </div>

        <GlassCard>
          <CodeBlock
            code={`static_assert(is_arithmetic<T>::value,
    "T must be numeric type");`}
          />
        </GlassCard>

        <div style={{ display: "flex", gap: "3rem" }}>
          {/* Wrong Type */}
          {phase >= 1 && (
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "1rem",
              }}
            >
              <div
                style={{
                  padding: "12px 20px",
                  borderRadius: "12px",
                  background: "#1c1c1e",
                  border: `1px solid ${colors.danger}`,
                  fontFamily: "'SF Mono', monospace",
                  color: colors.danger,
                }}
              >
                string
              </div>
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.5 }}
                style={{ fontSize: "32px" }}
              >
                ❌
              </motion.div>
              <div
                style={{
                  color: colors.danger,
                  fontSize: "12px",
                  fontWeight: 600,
                }}
              >
                REJECTED
              </div>
            </motion.div>
          )}

          {/* Correct Type */}
          {phase >= 2 && (
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "1rem",
              }}
            >
              <div
                style={{
                  padding: "12px 20px",
                  borderRadius: "12px",
                  background: "#1c1c1e",
                  border: `1px solid ${colors.success}`,
                  fontFamily: "'SF Mono', monospace",
                  color: colors.success,
                }}
              >
                int
              </div>
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.5 }}
                style={{ fontSize: "32px" }}
              >
                ✅
              </motion.div>
              <div
                style={{
                  color: colors.success,
                  fontSize: "12px",
                  fontWeight: 600,
                }}
              >
                ACCEPTED
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

// SCENE 15: Overload Resolution
const Scene15 = () => {
  const [showArrow, setShowArrow] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowArrow(true), 1200);
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
          OVERLOAD RESOLUTION
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            position: "relative",
          }}
        >
          {/* Normal Function */}
          <GlassCard
            style={{
              borderColor: showArrow
                ? `${colors.success}60`
                : "rgba(255,255,255,0.12)",
              boxShadow: showArrow ? `0 0 30px ${colors.success}20` : "none",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <CodeBlock code={`void print(int x)`} />
              {showArrow && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  style={{
                    color: colors.success,
                    fontWeight: 600,
                    fontSize: "13px",
                  }}
                >
                  ← PREFERRED
                </motion.span>
              )}
            </div>
          </GlassCard>

          {/* Template */}
          <GlassCard style={{ opacity: showArrow ? 0.5 : 1 }}>
            <CodeBlock code={`template<typename T>\nvoid print(T x)`} />
          </GlassCard>

          {/* Call */}
          {showArrow && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                position: "absolute",
                left: -120,
                top: "50%",
                transform: "translateY(-50%)",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <div
                style={{
                  padding: "8px 16px",
                  borderRadius: "10px",
                  background: colors.primary,
                  color: "white",
                  fontFamily: "'SF Mono', monospace",
                  fontSize: "13px",
                  fontWeight: 600,
                }}
              >
                print(5)
              </div>
              <span style={{ color: colors.primary, fontSize: "20px" }}>→</span>
            </motion.div>
          )}
        </div>

        {showArrow && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ color: colors.textSec, fontSize: "14px" }}
          >
            Non-template functions preferred for exact matches
          </motion.div>
        )}
      </div>
    </div>
  );
};

// SCENE 16: STL Reveal
const Scene16 = () => {
  const stlItems = [
    { name: "vector<int>", color: colors.primary },
    { name: "map<string, int>", color: colors.secondary },
    { name: "set<double>", color: colors.accent },
    { name: "sort<T>", color: colors.success },
    { name: "queue<T>", color: colors.typeFloat },
    { name: "stack<T>", color: colors.typeInt },
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
            color: colors.text,
            fontWeight: 700,
            fontSize: "13px",
            letterSpacing: "1px",
          }}
        >
          STANDARD TEMPLATE LIBRARY
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "1.5rem",
          }}
        >
          {stlItems.map((item, i) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: i * 0.15 }}
              style={{
                padding: "1.5rem 2rem",
                borderRadius: "20px",
                background: `linear-gradient(135deg, ${item.color}15, transparent)`,
                border: `1px solid ${item.color}30`,
                textAlign: "center",
                boxShadow: `0 10px 30px ${item.color}10`,
              }}
            >
              <div
                style={{
                  fontFamily: "'SF Mono', monospace",
                  color: item.color,
                  fontSize: "15px",
                  fontWeight: 600,
                }}
              >
                {item.name}
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          style={{ color: colors.textSec, fontSize: "14px" }}
        >
          All built with templates
        </motion.div>
      </div>
    </div>
  );
};

// SCENE 17: Compile-Time Factorial
const Scene17 = () => {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const interval = setInterval(
      () => setPhase((p) => (p < 3 ? p + 1 : p)),
      1000
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
          COMPILE-TIME COMPUTATION
        </div>

        <GlassCard>
          <CodeBlock
            code={`template<int N>
struct Factorial {
    static const int value = 
        N * Factorial<N-1>::value;
};

template<>
struct Factorial<0> {
    static const int value = 1;
};`}
          />
        </GlassCard>

        <div style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
          {/* Compile Side */}
          <motion.div
            animate={{
              borderColor:
                phase >= 1 ? colors.success : "rgba(255,255,255,0.1)",
              boxShadow: phase >= 1 ? `0 0 30px ${colors.success}20` : "none",
            }}
            style={{
              padding: "1rem 1.5rem",
              borderRadius: "16px",
              background: "#1c1c1e",
              border: "1px solid rgba(255,255,255,0.1)",
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
              COMPILE TIME
            </div>
            {phase >= 1 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{
                  fontFamily: "'SF Mono', monospace",
                  color: colors.text,
                  fontSize: "14px",
                }}
              >
                5 × 4 × 3 × 2 × 1
              </motion.div>
            )}
          </motion.div>

          {phase >= 2 && (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{ fontSize: "24px", color: colors.success }}
            >
              →
            </motion.div>
          )}

          {/* Runtime Side */}
          {phase >= 2 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              style={{
                padding: "1rem 1.5rem",
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
                RUNTIME
              </div>
              <div
                style={{
                  fontFamily: "'SF Mono', monospace",
                  color: colors.success,
                  fontSize: "24px",
                  fontWeight: 700,
                }}
              >
                120
              </div>
            </motion.div>
          )}
        </div>

        {phase >= 3 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              padding: "10px 20px",
              borderRadius: "100px",
              background: `${colors.accent}20`,
              color: colors.accent,
              fontWeight: 600,
              fontSize: "13px",
            }}
          >
            Metaprogramming Magic ✨
          </motion.div>
        )}
      </div>
    </div>
  );
};

// SCENE 18: Template Pitfalls
const Scene18 = () => {
  const pitfalls = [
    {
      title: "Long Error Messages",
      desc: "Template errors can be verbose and cryptic",
    },
    { title: "Header-Only", desc: "Implementation must be in header files" },
    { title: "Code Bloat", desc: "Each instantiation creates new code" },
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
          ⚠️ TEMPLATE PITFALLS
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {pitfalls.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.3 }}
            >
              <GlassCard
                style={{
                  padding: "1.25rem 1.5rem",
                  minWidth: "380px",
                  borderColor: "rgba(255, 69, 58, 0.2)",
                }}
              >
                <div
                  style={{
                    color: colors.danger,
                    fontWeight: 700,
                    fontSize: "15px",
                    marginBottom: "4px",
                  }}
                >
                  {item.title}
                </div>
                <div style={{ color: colors.textSec, fontSize: "13px" }}>
                  {item.desc}
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          style={{ color: colors.textSec, fontSize: "14px" }}
        >
          Trade-offs to consider
        </motion.div>
      </div>
    </div>
  );
};

export const AnimationStepsPart2 = [
  { title: "Compile-Time Polymorphism", component: Scene10 },
  { title: "Full Specialization", component: Scene11 },
  { title: "Partial Specialization", component: Scene12 },
  { title: "Non-Type Parameters", component: Scene13 },
  { title: "Type Constraints", component: Scene14 },
  { title: "Overload Resolution", component: Scene15 },
  { title: "STL Reveal", component: Scene16 },
  { title: "Compile-Time Factorial", component: Scene17 },
  { title: "Template Pitfalls", component: Scene18 },
];

export default { AnimationStepsPart2 };
