/**
 * ConstStaticPart2 - Scenes 14-26
 * OOPS Unit 4: const and static Members in C++ - One Shot Lecture
 * Covers: static data, static function, final program, memory diagram, summary
 */
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { colors, containerStyle } from "./ConstStaticUnit4Theme";
import { GlassCard, CodeBlock } from "./ConstStaticPart1";

// ============================================
// SCENE 14: Introducing static
// ============================================
const Scene14 = () => {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 600),
      setTimeout(() => setPhase(2), 1800),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div style={containerStyle}>
      {/* Cyan glow for static */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: phase >= 1 ? 1 : 0 }}
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at center, rgba(100, 210, 255, 0.15) 0%, transparent 70%)",
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
            color: colors.staticColor,
            fontWeight: 700,
            fontSize: "13px",
            letterSpacing: "1.5px",
          }}
        >
          🔗 INTRODUCING STATIC
        </motion.div>

        {/* Multiple objects pointing to one shared board */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: phase >= 1 ? 1 : 0 }}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "2rem",
          }}
        >
          {/* Objects row */}
          <div style={{ display: "flex", gap: "1.5rem" }}>
            {["s1", "s2", "s3"].map((obj, i) => (
              <motion.div
                key={obj}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.2 }}
                style={{
                  padding: "16px 24px",
                  borderRadius: "16px",
                  background: `${colors.objectColor}15`,
                  border: `2px solid ${colors.objectColor}`,
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: "2rem" }}>📦</div>
                <div style={{ color: colors.objectColor, fontWeight: 600, marginTop: "0.5rem" }}>
                  {obj}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Arrows pointing down */}
          <div style={{ display: "flex", gap: "3rem" }}>
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{ y: [0, 5, 0] }}
                transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                style={{ fontSize: "1.5rem", color: colors.staticColor }}
              >
                ↓
              </motion.div>
            ))}
          </div>

          {/* Shared board */}
          <motion.div
            animate={{
              boxShadow: phase >= 2 ? `0 0 40px ${colors.staticColor}50` : "none",
            }}
            style={{
              padding: "24px 60px",
              borderRadius: "20px",
              background: `linear-gradient(135deg, ${colors.staticColor}30, ${colors.staticColor}10)`,
              border: `3px solid ${colors.staticColor}`,
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>📋</div>
            <div style={{ color: colors.staticColor, fontWeight: 700, fontSize: "1.2rem" }}>
              ONE SHARED DATA
            </div>
          </motion.div>
        </motion.div>

        {/* Message */}
        <AnimatePresence>
          {phase >= 2 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                padding: "16px 28px",
                borderRadius: "100px",
                background: `${colors.staticColor}15`,
                border: `1px solid ${colors.staticColor}40`,
                color: colors.text,
                fontWeight: 500,
              }}
            >
              <span style={{ color: colors.staticColor, fontWeight: 700 }}>static</span> = One
              variable shared by ALL objects
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// ============================================
// SCENE 15: Static Data Member Diagram
// ============================================
const Scene15 = () => {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 600),
      setTimeout(() => setPhase(2), 1500),
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
            color: colors.staticColor,
            fontWeight: 700,
            fontSize: "13px",
            letterSpacing: "1.5px",
          }}
        >
          📊 STATIC DATA MEMBER DIAGRAM
        </motion.div>

        <div style={{ display: "flex", alignItems: "center", gap: "3rem" }}>
          {/* Objects column */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {["s1", "s2", "s3"].map((obj, i) => (
              <motion.div
                key={obj}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: phase >= 1 ? 1 : 0, x: 0 }}
                transition={{ delay: i * 0.2 }}
                style={{
                  padding: "12px 24px",
                  borderRadius: "12px",
                  background: `${colors.objectColor}15`,
                  border: `2px solid ${colors.objectColor}`,
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                }}
              >
                <span style={{ fontSize: "1.5rem" }}>📦</span>
                <span style={{ color: colors.objectColor, fontWeight: 600 }}>{obj}</span>
              </motion.div>
            ))}
          </div>

          {/* Connection lines */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: phase >= 2 ? 1 : 0 }}
                transition={{ delay: i * 0.1 }}
                style={{
                  width: "80px",
                  height: "3px",
                  background: colors.staticColor,
                  margin: "12px 0",
                  transformOrigin: "left",
                }}
              />
            ))}
          </div>

          {/* Shared count box */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: phase >= 2 ? 1 : 0, scale: 1 }}
            style={{
              padding: "24px 32px",
              borderRadius: "20px",
              background: `linear-gradient(135deg, ${colors.staticColor}30, ${colors.staticColor}10)`,
              border: `3px solid ${colors.staticColor}`,
              textAlign: "center",
              boxShadow: `0 0 30px ${colors.staticColor}30`,
            }}
          >
            <div style={{ color: colors.staticColor, fontSize: "14px", fontWeight: 600 }}>
              static int
            </div>
            <div
              style={{
                color: colors.text,
                fontSize: "1.8rem",
                fontWeight: 700,
                fontFamily: "'SF Mono', monospace",
                marginTop: "0.5rem",
              }}
            >
              count = 3
            </div>
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
          All three objects share the SAME count variable
        </motion.div>
      </div>
    </div>
  );
};

// ============================================
// SCENE 16: Static Counter Program
// ============================================
const Scene16 = () => {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [setTimeout(() => setPhase(1), 500)];
    return () => timers.forEach(clearTimeout);
  }, []);

  const code = `#include <iostream>
using namespace std;

class Student {
    static int count;

public:
    Student() {
        count++;
    }

    void showCount() {
        cout << "Count = " << count << endl;
    }
};

int Student::count = 0;

int main() {
    Student s1, s2, s3;
    s1.showCount();
}`;

  return (
    <div style={containerStyle}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "1.5rem",
        }}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            color: colors.staticColor,
            fontWeight: 700,
            fontSize: "13px",
            letterSpacing: "1.5px",
          }}
        >
          📝 STATIC COUNTER PROGRAM
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: phase >= 1 ? 1 : 0, y: 0 }}
        >
          <GlassCard style={{ maxWidth: "550px" }}>
            <CodeBlock code={code} />
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
};

// ============================================
// SCENE 17: Definition Outside Class Highlight
// ============================================
const Scene17 = () => {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 600),
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
          ⚠️ IMPORTANT: DEFINITION OUTSIDE CLASS
        </motion.div>

        {/* Code with big red circle */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: phase >= 1 ? 1 : 0, scale: 1 }}
          style={{ position: "relative" }}
        >
          <GlassCard glow={colors.danger}>
            <div
              style={{
                fontFamily: "'SF Mono', monospace",
                fontSize: "1.5rem",
                color: colors.text,
                padding: "1rem",
              }}
            >
              <span style={{ color: colors.keyword }}>int</span>{" "}
              <span style={{ color: colors.function }}>Student</span>
              <span style={{ color: colors.operator }}>::</span>
              <span style={{ color: colors.staticColor }}>count</span>
              <span> = </span>
              <span style={{ color: colors.accent }}>0</span>
              <span>;</span>
            </div>
          </GlassCard>

          {/* Big red circle */}
          <AnimatePresence>
            {phase >= 2 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{
                  position: "absolute",
                  top: "-30px",
                  right: "-30px",
                  width: "80px",
                  height: "80px",
                  borderRadius: "50%",
                  border: `5px solid ${colors.danger}`,
                  boxShadow: `0 0 30px ${colors.danger}50`,
                }}
              />
            )}
          </AnimatePresence>
        </motion.div>

        {/* Explanation */}
        <AnimatePresence>
          {phase >= 2 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                padding: "16px 28px",
                borderRadius: "16px",
                background: `${colors.danger}15`,
                border: `1px solid ${colors.danger}40`,
                color: colors.text,
                fontWeight: 500,
                textAlign: "center",
              }}
            >
              Static data must be defined <span style={{ color: colors.danger, fontWeight: 700 }}>OUTSIDE</span> the
              class!
              <br />
              <span style={{ color: colors.textSec, fontSize: "14px" }}>
                (otherwise you get a linker error)
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// ============================================
// SCENE 18: Introducing Static Function
// ============================================
const Scene18 = () => {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 600),
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
            color: colors.staticColor,
            fontWeight: 700,
            fontSize: "13px",
            letterSpacing: "1.5px",
          }}
        >
          ☁️ STATIC MEMBER FUNCTION
        </motion.div>

        {/* Function floating above objects */}
        <div style={{ position: "relative", height: "250px", width: "400px" }}>
          {/* Objects at bottom */}
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: "50%",
              transform: "translateX(-50%)",
              display: "flex",
              gap: "1rem",
            }}
          >
            {["📦", "📦", "📦"].map((obj, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: phase >= 1 ? 0.5 : 0 }}
                style={{
                  fontSize: "2.5rem",
                }}
              >
                {obj}
              </motion.div>
            ))}
          </div>

          {/* Function floating above */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{
              opacity: phase >= 1 ? 1 : 0,
              y: phase >= 1 ? 0 : 30,
            }}
            style={{
              position: "absolute",
              top: 0,
              left: "50%",
              transform: "translateX(-50%)",
            }}
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              style={{
                padding: "20px 40px",
                borderRadius: "20px",
                background: `linear-gradient(135deg, ${colors.staticColor}40, ${colors.staticColor}20)`,
                border: `3px solid ${colors.staticColor}`,
                boxShadow: `0 10px 40px ${colors.staticColor}30`,
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>☁️</div>
              <div
                style={{
                  color: colors.staticColor,
                  fontWeight: 700,
                  fontSize: "1.2rem",
                  fontFamily: "'SF Mono', monospace",
                }}
              >
                static getCount()
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Message */}
        <AnimatePresence>
          {phase >= 2 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                padding: "16px 28px",
                borderRadius: "16px",
                background: `${colors.staticColor}15`,
                border: `1px solid ${colors.staticColor}40`,
                color: colors.text,
                fontWeight: 500,
              }}
            >
              Belongs to <span style={{ color: colors.classColor, fontWeight: 700 }}>class</span>,
              not <span style={{ color: colors.objectColor }}>object</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// ============================================
// SCENE 19: Static Function Rules
// ============================================
const Scene19 = () => {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 600),
      setTimeout(() => setPhase(2), 1200),
      setTimeout(() => setPhase(3), 1800),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  const rules = [
    { icon: "❌", text: "No this pointer", color: colors.danger },
    { icon: "❌", text: "Cannot access non-static data", color: colors.danger },
    { icon: "✅", text: "Can only access static members", color: colors.success },
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
          📜 STATIC FUNCTION RULES
        </motion.div>

        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {rules.map((rule, i) => (
            <motion.div
              key={rule.text}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: phase > i ? 1 : 0, x: 0 }}
              transition={{ duration: 0.4 }}
              style={{
                padding: "16px 28px",
                borderRadius: "16px",
                background: `${rule.color}15`,
                border: `2px solid ${rule.color}`,
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                minWidth: "350px",
              }}
            >
              <span style={{ fontSize: "1.5rem" }}>{rule.icon}</span>
              <span
                style={{
                  color: rule.color,
                  fontWeight: 600,
                  fontSize: "16px",
                }}
              >
                {rule.text}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ============================================
// SCENE 20: Static Function Program
// ============================================
const Scene20 = () => {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [setTimeout(() => setPhase(1), 500)];
    return () => timers.forEach(clearTimeout);
  }, []);

  const code = `#include <iostream>
using namespace std;

class Student {
    static int count;

public:
    Student() { count++; }

    static int getCount() {
        return count;
    }
};

int Student::count = 0;

int main() {
    Student s1, s2;
    cout << Student::getCount();
}`;

  return (
    <div style={containerStyle}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "1.5rem",
        }}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            color: colors.staticColor,
            fontWeight: 700,
            fontSize: "13px",
            letterSpacing: "1.5px",
          }}
        >
          📝 STATIC FUNCTION PROGRAM
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: phase >= 1 ? 1 : 0, y: 0 }}
        >
          <GlassCard style={{ maxWidth: "500px" }}>
            <CodeBlock code={code} />
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
};

// ============================================
// SCENE 21: Call Using Class Name Highlight
// ============================================
const Scene21 = () => {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 600),
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
          ✨ CALL USING CLASS NAME
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: phase >= 1 ? 1 : 0, scale: 1 }}
        >
          <GlassCard glow={colors.success}>
            <div
              style={{
                fontFamily: "'SF Mono', monospace",
                fontSize: "1.8rem",
                color: colors.text,
                padding: "1rem",
              }}
            >
              <motion.span
                animate={{
                  color: phase >= 2 ? colors.classColor : colors.text,
                  textShadow: phase >= 2 ? `0 0 15px ${colors.classColor}` : "none",
                }}
                style={{ fontWeight: 700 }}
              >
                Student
              </motion.span>
              <motion.span
                animate={{
                  color: phase >= 2 ? colors.staticColor : colors.text,
                }}
              >
                ::
              </motion.span>
              <motion.span
                animate={{
                  color: phase >= 2 ? colors.function : colors.text,
                }}
              >
                getCount()
              </motion.span>
              <span>;</span>
            </div>
          </GlassCard>
        </motion.div>

        <AnimatePresence>
          {phase >= 2 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                display: "flex",
                gap: "2rem",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  padding: "12px 20px",
                  borderRadius: "12px",
                  background: `${colors.classColor}20`,
                  border: `1px solid ${colors.classColor}`,
                  color: colors.classColor,
                  fontWeight: 600,
                }}
              >
                ClassName
              </div>
              <span style={{ color: colors.textSec, fontSize: "1.2rem" }}>::</span>
              <div
                style={{
                  padding: "12px 20px",
                  borderRadius: "12px",
                  background: `${colors.function}20`,
                  border: `1px solid ${colors.function}`,
                  color: colors.function,
                  fontWeight: 600,
                }}
              >
                staticFunction()
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// ============================================
// SCENE 22: All Four Concepts Together
// ============================================
const Scene22 = () => {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 500),
      setTimeout(() => setPhase(2), 1000),
      setTimeout(() => setPhase(3), 1500),
      setTimeout(() => setPhase(4), 2000),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  const pillars = [
    { name: "const data", icon: "🔒", color: colors.constColor },
    { name: "const function", icon: "🛡️", color: colors.constColor },
    { name: "static data", icon: "📋", color: colors.staticColor },
    { name: "static function", icon: "☁️", color: colors.staticColor },
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
          🏛️ FOUR PILLARS OF CLASS DESIGN
        </motion.div>

        <div style={{ display: "flex", gap: "1.5rem" }}>
          {pillars.map((pillar, i) => (
            <motion.div
              key={pillar.name}
              initial={{ opacity: 0, y: 50 }}
              animate={{
                opacity: phase > i ? 1 : 0,
                y: 0,
              }}
              transition={{ type: "spring", stiffness: 100 }}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "1rem",
              }}
            >
              {/* Pillar */}
              <motion.div
                animate={{
                  boxShadow: phase >= 4 ? `0 10px 30px ${pillar.color}40` : "none",
                }}
                style={{
                  width: "100px",
                  height: "150px",
                  background: `linear-gradient(180deg, ${pillar.color}30, ${pillar.color}10)`,
                  border: `3px solid ${pillar.color}`,
                  borderRadius: "12px 12px 0 0",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem",
                }}
              >
                <span style={{ fontSize: "2rem" }}>{pillar.icon}</span>
              </motion.div>
              <span
                style={{
                  color: pillar.color,
                  fontWeight: 600,
                  fontSize: "13px",
                  textAlign: "center",
                }}
              >
                {pillar.name}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ============================================
// SCENE 23: Final Mega Program
// ============================================
const Scene23 = () => {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [setTimeout(() => setPhase(1), 500)];
    return () => timers.forEach(clearTimeout);
  }, []);

  const code = `#include <iostream>
using namespace std;

class BankAccount {
    const int accountNumber;     // const data member
    int balance;

    static int totalAccounts;    // static data member

public:
    BankAccount(int acc, int bal) : accountNumber(acc), balance(bal) {
        totalAccounts++;
    }

    int getAccountNumber() const {   // const member function
        return accountNumber;
    }

    void deposit(int amount) {
        balance += amount;
    }

    static int getTotalAccounts() {  // static member function
        return totalAccounts;
    }
};

int BankAccount::totalAccounts = 0;

int main() {
    BankAccount a1(101, 5000);
    BankAccount a2(102, 8000);

    cout << "Total accounts: " << BankAccount::getTotalAccounts() << endl;
    cout << "Account number of a1: " << a1.getAccountNumber() << endl;
    return 0;
}`;

  return (
    <div style={containerStyle}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "1rem",
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
          🏆 FINAL MEGA PROGRAM
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: phase >= 1 ? 1 : 0, y: 0 }}
        >
          <GlassCard style={{ maxWidth: "700px", padding: "1.5rem" }}>
            <CodeBlock code={code} />
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
};

// ============================================
// SCENE 24: Memory Diagram of Final Program
// ============================================
const Scene24 = () => {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 600),
      setTimeout(() => setPhase(2), 1500),
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
          💾 MEMORY DIAGRAM
        </motion.div>

        <div style={{ display: "flex", alignItems: "flex-start", gap: "3rem" }}>
          {/* Two account objects */}
          <div style={{ display: "flex", gap: "1.5rem" }}>
            {[
              { name: "a1", acc: "101", bal: "5000" },
              { name: "a2", acc: "102", bal: "8000" },
            ].map((obj, i) => (
              <motion.div
                key={obj.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: phase >= 1 ? 1 : 0, y: 0 }}
                transition={{ delay: i * 0.2 }}
                style={{
                  padding: "1.5rem",
                  borderRadius: "20px",
                  background: "rgba(28, 28, 30, 0.8)",
                  border: `2px solid ${colors.objectColor}`,
                }}
              >
                <div
                  style={{
                    color: colors.objectColor,
                    fontWeight: 700,
                    textAlign: "center",
                    marginBottom: "1rem",
                  }}
                >
                  {obj.name}
                </div>
                <div
                  style={{
                    padding: "8px 12px",
                    borderRadius: "8px",
                    background: `${colors.constColor}20`,
                    border: `1px solid ${colors.constColor}`,
                    marginBottom: "0.5rem",
                  }}
                >
                  <span style={{ color: colors.constColor, fontSize: "12px" }}>
                    accountNumber: {obj.acc}
                  </span>
                </div>
                <div
                  style={{
                    padding: "8px 12px",
                    borderRadius: "8px",
                    background: "rgba(255,255,255,0.05)",
                  }}
                >
                  <span style={{ color: colors.textSec, fontSize: "12px" }}>
                    balance: {obj.bal}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Shared static */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: phase >= 2 ? 1 : 0, scale: 1 }}
            style={{
              padding: "1.5rem 2rem",
              borderRadius: "20px",
              background: `linear-gradient(135deg, ${colors.staticColor}30, ${colors.staticColor}10)`,
              border: `3px solid ${colors.staticColor}`,
              textAlign: "center",
              boxShadow: `0 0 30px ${colors.staticColor}30`,
            }}
          >
            <div style={{ color: colors.staticColor, fontSize: "12px", fontWeight: 600 }}>
              static int
            </div>
            <div
              style={{
                color: colors.text,
                fontSize: "1.3rem",
                fontWeight: 700,
                fontFamily: "'SF Mono', monospace",
              }}
            >
              totalAccounts = 2
            </div>
            <div style={{ color: colors.textSec, fontSize: "11px", marginTop: "0.5rem" }}>
              SHARED
            </div>
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
          Each object has its own <span style={{ color: colors.constColor }}>accountNumber</span> |{" "}
          All share <span style={{ color: colors.staticColor }}>totalAccounts</span>
        </motion.div>
      </div>
    </div>
  );
};

// ============================================
// SCENE 25: Exam Focus Slide
// ============================================
const Scene25 = () => {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 400),
      setTimeout(() => setPhase(2), 800),
      setTimeout(() => setPhase(3), 1200),
      setTimeout(() => setPhase(4), 1600),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  const points = [
    { left: "const data", right: "initializer list", color: colors.constColor },
    { left: "const function", right: "safe read", color: colors.constColor },
    { left: "static data", right: "define outside", color: colors.staticColor },
    { left: "static function", right: "call by class", color: colors.staticColor },
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
          📚 EXAM FOCUS
        </motion.div>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {points.map((point, i) => (
            <motion.div
              key={point.left}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: phase > i ? 1 : 0, x: 0 }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1.5rem",
                padding: "12px 24px",
                borderRadius: "12px",
                background: "rgba(28, 28, 30, 0.8)",
                border: `1px solid ${point.color}40`,
              }}
            >
              <span
                style={{
                  color: point.color,
                  fontWeight: 700,
                  fontFamily: "'SF Mono', monospace",
                  minWidth: "140px",
                }}
              >
                {point.left}
              </span>
              <span style={{ color: colors.textSec }}>→</span>
              <span style={{ color: colors.text, fontWeight: 500 }}>{point.right}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ============================================
// SCENE 26: Grand Summary
// ============================================
const Scene26 = () => {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 600),
      setTimeout(() => setPhase(2), 1800),
      setTimeout(() => setPhase(3), 2800),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div style={containerStyle}>
      {/* Building glow */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: phase >= 3 ? 1 : 0 }}
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at center, rgba(255, 214, 10, 0.1) 0%, transparent 70%)",
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
          🏛️ GRAND SUMMARY
        </motion.div>

        {/* Four pillars forming a building */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: phase >= 1 ? 1 : 0 }}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {/* Roof */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: phase >= 2 ? 1 : 0 }}
            style={{
              width: "360px",
              height: "20px",
              background: `linear-gradient(90deg, ${colors.constColor}, ${colors.staticColor})`,
              borderRadius: "10px 10px 0 0",
              marginBottom: "0.5rem",
            }}
          />

          {/* Pillars */}
          <div style={{ display: "flex", gap: "1rem" }}>
            {[
              { name: "const\ndata", color: colors.constColor },
              { name: "const\nfunc", color: colors.constColor },
              { name: "static\ndata", color: colors.staticColor },
              { name: "static\nfunc", color: colors.staticColor },
            ].map((pillar, i) => (
              <motion.div
                key={i}
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ delay: i * 0.1 }}
                style={{
                  width: "70px",
                  height: "120px",
                  background: `${pillar.color}30`,
                  border: `2px solid ${pillar.color}`,
                  borderRadius: "4px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transformOrigin: "bottom",
                }}
              >
                <span
                  style={{
                    color: pillar.color,
                    fontSize: "11px",
                    fontWeight: 600,
                    textAlign: "center",
                    whiteSpace: "pre-line",
                  }}
                >
                  {pillar.name}
                </span>
              </motion.div>
            ))}
          </div>

          {/* Base */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: phase >= 2 ? 1 : 0 }}
            style={{
              width: "380px",
              height: "15px",
              background: "#3a3a3c",
              marginTop: "0.5rem",
              borderRadius: "0 0 10px 10px",
            }}
          />
        </motion.div>

        {/* Final message */}
        <AnimatePresence>
          {phase >= 3 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                padding: "20px 40px",
                borderRadius: "20px",
                background: "linear-gradient(135deg, rgba(191, 90, 242, 0.2), rgba(100, 210, 255, 0.2))",
                border: "1px solid rgba(255,255,255,0.2)",
                textAlign: "center",
              }}
            >
              <p
                style={{
                  color: colors.text,
                  fontSize: "1.2rem",
                  fontWeight: 500,
                  margin: 0,
                }}
              >
                <span style={{ color: colors.constColor, fontWeight: 700 }}>const</span> protects
                data.{" "}
                <span style={{ color: colors.staticColor, fontWeight: 700 }}>static</span> shares
                data.
              </p>
              <p
                style={{
                  color: colors.accent,
                  fontSize: "1rem",
                  fontWeight: 600,
                  margin: "0.5rem 0 0 0",
                }}
              >
                Master both, master class design! 🏆
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// ============================================
// EXPORT ANIMATION STEPS
// ============================================
export const AnimationStepsPart2 = [
  {
    title: "Introducing static",
    component: Scene14,
    contentText:
      "static keyword means 'shared by all objects'. Unlike normal data members, a static member belongs to the class itself, not individual objects.",
  },
  {
    title: "Static Data Member Diagram",
    component: Scene15,
    contentText:
      "All objects (s1, s2, s3) are connected to ONE shared 'count' variable. When any object modifies it, all see the change.",
  },
  {
    title: "Static Counter Program",
    component: Scene16,
    contentText:
      "Student class with static count. Each time a Student object is created, count increments. All objects share the same count value.",
  },
  {
    title: "Definition Outside Class",
    component: Scene17,
    contentText:
      "IMPORTANT: Static data members must be defined OUTSIDE the class using 'int Student::count = 0;'. This allocates actual memory for the static variable.",
  },
  {
    title: "Introducing Static Function",
    component: Scene18,
    contentText:
      "A static member function belongs to the class, not any object. It floats above all objects and can be called without creating an object.",
  },
  {
    title: "Static Function Rules",
    component: Scene19,
    contentText:
      "Static functions have restrictions: No 'this' pointer (no object context), cannot access non-static data directly, can only access static members.",
  },
  {
    title: "Static Function Program",
    component: Scene20,
    contentText:
      "Student class with static getCount() function. Returns the static count value. Can be called using class name without an object.",
  },
  {
    title: "Call Using Class Name",
    component: Scene21,
    contentText:
      "Static functions are called using ClassName::functionName() syntax. Example: Student::getCount(). No object needed!",
  },
  {
    title: "All Four Concepts Together",
    component: Scene22,
    contentText:
      "The four pillars of class design: const data (unchangeable), const function (read-only), static data (shared), static function (class-level).",
  },
  {
    title: "Final Mega Program",
    component: Scene23,
    contentText:
      "BankAccount class combining all four concepts: const accountNumber, regular balance, static totalAccounts, const getAccountNumber(), and static getTotalAccounts().",
  },
  {
    title: "Memory Diagram",
    component: Scene24,
    contentText:
      "Each account object has its own accountNumber and balance. But totalAccounts is shared by all objects - only one copy exists.",
  },
  {
    title: "Exam Focus",
    component: Scene25,
    contentText:
      "Quick exam reference: const data → initializer list, const function → safe read, static data → define outside, static function → call by class.",
  },
  {
    title: "Grand Summary",
    component: Scene26,
    contentText:
      "const protects data from modification. static shares data across all objects. Together they form the pillars of robust class design in C++.",
  },
];

export default { AnimationStepsPart2 };
