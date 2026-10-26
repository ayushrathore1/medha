/**
 * ConstStaticPart1 - Scenes 1-13
 * OOPS Unit 4: const and static Members in C++ - One Shot Lecture
 * Covers: Opening, Class/Object, const intro, const data, initializer list, const function
 */
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { colors, containerStyle } from "./ConstStaticUnit4Theme";

// ============================================
// SHARED COMPONENTS
// ============================================

export const GlassCard = ({ children, style = {}, glow = null }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    style={{
      background: "rgba(28, 28, 30, 0.65)",
      backdropFilter: "blur(25px) saturate(180%)",
      WebkitBackdropFilter: "blur(25px) saturate(180%)",
      border: `1px solid ${glow ? `${glow}40` : "rgba(255, 255, 255, 0.12)"}`,
      borderRadius: "24px",
      padding: "2rem",
      boxShadow: glow
        ? `0 8px 32px ${glow}30`
        : "0 8px 32px rgba(0, 0, 0, 0.4)",
      ...style,
    }}
  >
    {children}
  </motion.div>
);

// Syntax highlighting for C++ code using React elements
const SyntaxHighlight = ({ code }) => {
  const keywords = ['int', 'float', 'double', 'char', 'void', 'bool', 'class', 'struct', 'public', 'private', 'protected', 'static', 'const', 'virtual', 'override', 'return', 'if', 'else', 'for', 'while', 'do', 'switch', 'case', 'break', 'continue', 'new', 'delete', 'this', 'nullptr', 'true', 'false', 'using', 'namespace', 'std', 'template', 'typename', 'operator', 'friend', 'inline', 'explicit', 'throw', 'try', 'catch', 'endl', 'cout', 'cin'];
  
  const colors = {
    keyword: '#569CD6',    // Blue
    string: '#CE9178',      // Orange
    comment: '#6A9955',     // Green
    preprocessor: '#C586C0', // Purple
    number: '#B5CEA8',      // Light green
    function: '#DCDCAA',    // Yellow
    className: '#4EC9B0',   // Teal
    default: '#D4D4D4',     // Light gray
  };

  // Process code line by line
  const lines = code.split('\n');
  
  return lines.map((line, lineIdx) => {
    const elements = [];
    let i = 0;
    
    while (i < line.length) {
      // Check for comments
      if (line.slice(i, i + 2) === '//') {
        elements.push(<span key={`${lineIdx}-${i}`} style={{ color: colors.comment }}>{line.slice(i)}</span>);
        break;
      }
      
      // Check for preprocessor
      if (line[i] === '#') {
        const match = line.slice(i).match(/^#\w+/);
        if (match) {
          elements.push(<span key={`${lineIdx}-${i}`} style={{ color: colors.preprocessor }}>{match[0]}</span>);
          i += match[0].length;
          continue;
        }
      }
      
      // Check for strings
      if (line[i] === '"') {
        let end = i + 1;
        while (end < line.length && (line[end] !== '"' || line[end - 1] === '\\')) end++;
        elements.push(<span key={`${lineIdx}-${i}`} style={{ color: colors.string }}>{line.slice(i, end + 1)}</span>);
        i = end + 1;
        continue;
      }
      
      // Check for numbers
      if (/\d/.test(line[i])) {
        const match = line.slice(i).match(/^\d+\.?\d*/);
        if (match) {
          elements.push(<span key={`${lineIdx}-${i}`} style={{ color: colors.number }}>{match[0]}</span>);
          i += match[0].length;
          continue;
        }
      }
      
      // Check for words (keywords, identifiers)
      if (/[a-zA-Z_]/.test(line[i])) {
        const match = line.slice(i).match(/^[a-zA-Z_]\w*/);
        if (match) {
          const word = match[0];
          const isKeyword = keywords.includes(word);
          const isFollowedByParen = line[i + word.length] === '(';
          const isClassName = i > 0 && line.slice(0, i).trim().endsWith('class');
          
          let color = colors.default;
          if (isKeyword) color = colors.keyword;
          else if (isClassName) color = colors.className;
          else if (isFollowedByParen) color = colors.function;
          
          elements.push(<span key={`${lineIdx}-${i}`} style={{ color }}>{word}</span>);
          i += word.length;
          continue;
        }
      }
      
      // Default: single character
      elements.push(<span key={`${lineIdx}-${i}`} style={{ color: colors.default }}>{line[i]}</span>);
      i++;
    }
    
    return (
      <div key={lineIdx} style={{ minHeight: '1.5em' }}>
        {elements.length > 0 ? elements : '\u00A0'}
      </div>
    );
  });
};

export const CodeBlock = ({ code, fontSize = "11px" }) => {
  return (
    <motion.pre
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{
        fontFamily: "'Fira Code', 'SF Mono', 'Menlo', 'Monaco', 'Courier New', monospace",
        fontSize: fontSize,
        lineHeight: 1.5,
        margin: 0,
        whiteSpace: "pre",
        overflowX: "auto",
        background: "rgba(30, 30, 30, 0.95)",
        padding: "12px 16px",
        borderRadius: "8px",
        border: "1px solid rgba(255,255,255,0.1)",
        maxHeight: "400px",
        overflowY: "auto",
      }}
    >
      <SyntaxHighlight code={code} />
    </motion.pre>
  );
};

// Terminal component for showing output
export const Terminal = ({ output, title = "Output" }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.3 }}
    style={{
      background: "linear-gradient(180deg, #1a1a1a 0%, #0d0d0d 100%)",
      borderRadius: "10px",
      overflow: "hidden",
      border: "1px solid rgba(255,255,255,0.1)",
      marginTop: "12px",
    }}
  >
    {/* Terminal Header */}
    <div style={{
      background: "rgba(60, 60, 60, 0.8)",
      padding: "6px 12px",
      display: "flex",
      alignItems: "center",
      gap: "8px",
      borderBottom: "1px solid rgba(255,255,255,0.05)",
    }}>
      <div style={{ display: "flex", gap: "6px" }}>
        <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#FF5F56" }} />
        <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#FFBD2E" }} />
        <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#27CA40" }} />
      </div>
      <span style={{ fontSize: "10px", color: "#888", marginLeft: "8px", fontFamily: "monospace" }}>{title}</span>
    </div>
    {/* Terminal Body */}
    <div style={{
      padding: "12px 16px",
      fontFamily: "'SF Mono', 'Menlo', monospace",
      fontSize: "12px",
      color: "#4AF626",
      lineHeight: 1.6,
    }}>
      <span style={{ color: "#888" }}>$ </span>
      <span style={{ color: "#fff" }}>./a.out</span>
      <div style={{ marginTop: "8px", color: "#4AF626" }}>{output}</div>
    </div>
  </motion.div>
);


// ============================================
// SCENE 1: Title Slide - const & static Members
// ============================================
const Scene1 = () => {
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
            "radial-gradient(ellipse at center, rgba(191, 90, 242, 0.15) 0%, transparent 70%)",
        }}
      />

      {/* Floating symbols */}
      {phase >= 3 && (
        <>
          {["🔒", "🔗", "📋", "🛡️"].map((emoji, i) => (
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
            background: "rgba(191, 90, 242, 0.15)",
            marginBottom: "1.5rem",
            color: colors.primary,
            fontSize: "13px",
            fontWeight: 600,
            letterSpacing: "1.5px",
            border: `1px solid ${colors.primary}30`,
          }}
        >
          RTU OOP UNIT 4 — PART 1
        </motion.div>

        {/* Title - Letter by letter typing */}
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            fontSize: "3.5rem",
            fontWeight: 700,
            letterSpacing: "-0.03em",
            background: `linear-gradient(180deg, #FFFFFF 0%, ${colors.primary} 100%)`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            margin: 0,
          }}
        >
          {"const & static Members".split("").map((char, i) => (
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
                color: colors.secondary,
                fontSize: "1.4rem",
                marginTop: "1.2rem",
                fontWeight: 500,
              }}
            >
              Protecting & Sharing Data in Classes
            </motion.p>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};


// ============================================
// SCENE 2: What is a Class and Object
// ============================================
const Scene2 = () => {
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
          gap: "2.5rem",
        }}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            color: colors.classColor,
            fontWeight: 700,
            fontSize: "13px",
            letterSpacing: "1.5px",
          }}
        >
          📐 CLASS VS OBJECT
        </motion.div>

        <div style={{ display: "flex", gap: "4rem", alignItems: "center" }}>
          {/* Blueprint (Class) */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: phase >= 1 ? 1 : 0, x: 0 }}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "1rem",
            }}
          >
            <div
              style={{
                width: "120px",
                height: "150px",
                background: `linear-gradient(135deg, ${colors.classColor}30, ${colors.classColor}10)`,
                border: `2px dashed ${colors.classColor}`,
                borderRadius: "16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "3rem",
              }}
            >
              📋
            </div>
            <span
              style={{
                color: colors.classColor,
                fontWeight: 600,
                fontSize: "1.2rem",
              }}
            >
              Class (Blueprint)
            </span>
          </motion.div>

          {/* Arrow */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: phase >= 2 ? 1 : 0, x: [0, 10, 0] }}
            transition={{ x: { duration: 1, repeat: Infinity } }}
            style={{ fontSize: "2rem", color: colors.textSec }}
          >
            →
          </motion.div>

          {/* Houses (Objects) */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: phase >= 2 ? 1 : 0, x: 0 }}
            style={{
              display: "flex",
              gap: "1rem",
            }}
          >
            {["🏠", "🏠", "🏠"].map((house, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0 }}
                animate={{ scale: phase >= 2 ? 1 : 0 }}
                transition={{ delay: i * 0.2 }}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <div
                  style={{
                    width: "80px",
                    height: "100px",
                    background: `${colors.objectColor}15`,
                    border: `2px solid ${colors.objectColor}`,
                    borderRadius: "12px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "2.5rem",
                  }}
                >
                  {house}
                </div>
                <span style={{ color: colors.objectColor, fontSize: "12px" }}>
                  obj{i + 1}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Concept */}
        <AnimatePresence>
          {phase >= 3 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                padding: "16px 28px",
                borderRadius: "16px",
                background: "#1c1c1e",
                border: "1px solid rgba(255,255,255,0.1)",
                color: colors.text,
                fontWeight: 500,
              }}
            >
              Each object gets its own rooms (data members) 📦
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// ============================================
// SCENE 3: Introducing const
// ============================================
const Scene3 = () => {
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
      {/* Purple glow for const */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: phase >= 2 ? 1 : 0 }}
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at center, rgba(191, 90, 242, 0.2) 0%, transparent 70%)",
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
            color: colors.constColor,
            fontWeight: 700,
            fontSize: "13px",
            letterSpacing: "1.5px",
          }}
        >
          🔒 INTRODUCING const
        </motion.div>

        {/* Room with lock animation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: phase >= 1 ? 1 : 0 }}
          style={{
            position: "relative",
            width: "200px",
            height: "200px",
            background: `${colors.constColor}15`,
            border: `3px solid ${colors.constColor}`,
            borderRadius: "24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span style={{ fontSize: "4rem" }}>🚪</span>

          {/* Lock appearing */}
          <AnimatePresence>
            {phase >= 2 && (
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{
                  position: "absolute",
                  top: "-20px",
                  right: "-20px",
                  fontSize: "3rem",
                  filter: `drop-shadow(0 0 20px ${colors.constColor})`,
                }}
              >
                🔒
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* const = cannot change */}
        <AnimatePresence>
          {phase >= 3 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                padding: "20px 40px",
                borderRadius: "20px",
                background: `linear-gradient(135deg, ${colors.constColor}, ${colors.primary})`,
                color: "white",
                fontWeight: 700,
                fontSize: "1.5rem",
                fontFamily: "'SF Mono', monospace",
                boxShadow: `0 10px 40px ${colors.constColor}50`,
              }}
            >
              const = cannot change
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// ============================================
// SCENE 4: Const Data Member Concept
// ============================================
const Scene4 = () => {
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
            color: colors.constColor,
            fontWeight: 700,
            fontSize: "13px",
            letterSpacing: "1.5px",
          }}
        >
          🪨 CONST DATA MEMBER
        </motion.div>

        {/* Student card with Roll No in stone */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: phase >= 1 ? 1 : 0, scale: 1 }}
        >
          <GlassCard glow={colors.objectColor}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "1.5rem",
              }}
            >
              <div
                style={{
                  fontSize: "3rem",
                }}
              >
                👨‍🎓
              </div>
              <div
                style={{
                  fontFamily: "'SF Mono', monospace",
                  fontSize: "1.2rem",
                  fontWeight: 600,
                  color: colors.text,
                }}
              >
                Student Object
              </div>

              {/* Roll No in stone */}
              <motion.div
                animate={{
                  boxShadow:
                    phase >= 1
                      ? `0 0 30px ${colors.constColor}50`
                      : "none",
                }}
                style={{
                  padding: "16px 32px",
                  borderRadius: "12px",
                  background: `linear-gradient(180deg, #6b6b6b 0%, #4a4a4a 100%)`,
                  border: `2px solid ${colors.constColor}`,
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                }}
              >
                <span style={{ fontSize: "1.5rem" }}>🪨</span>
                <div>
                  <div style={{ color: colors.constColor, fontSize: "12px", fontWeight: 600 }}>
                    const int
                  </div>
                  <div
                    style={{
                      color: colors.text,
                      fontSize: "1.3rem",
                      fontWeight: 700,
                      fontFamily: "'SF Mono', monospace",
                    }}
                  >
                    rollNo = 101
                  </div>
                </div>
              </motion.div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Message */}
        <AnimatePresence>
          {phase >= 2 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                padding: "14px 28px",
                borderRadius: "100px",
                background: `${colors.constColor}15`,
                border: `1px solid ${colors.constColor}40`,
                color: colors.constColor,
                fontWeight: 600,
                fontSize: "15px",
              }}
            >
              🔒 Once set, cannot be changed!
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// ============================================
// SCENE 5: Why Normal Assignment Fails
// ============================================
const Scene5 = () => {
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
          ❌ WHY NORMAL ASSIGNMENT FAILS
        </motion.div>

        {/* Stone with hammer animation */}
        <div style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
          {/* Hammer trying to write */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{
              opacity: phase >= 1 ? 1 : 0,
              rotate: phase >= 2 ? [0, -30, 0] : 0,
              x: phase >= 2 ? [0, 20, 0] : 0,
            }}
            transition={{
              rotate: { duration: 0.3 },
              x: { duration: 0.3 },
            }}
            style={{ fontSize: "4rem" }}
          >
            🔨
          </motion.div>

          {/* Stone (const) */}
          <motion.div
            animate={{
              x: phase >= 2 ? [0, 5, -5, 0] : 0,
            }}
            transition={{ duration: 0.3 }}
            style={{
              padding: "24px 40px",
              borderRadius: "16px",
              background: `linear-gradient(180deg, #6b6b6b 0%, #4a4a4a 100%)`,
              border: `3px solid ${colors.constColor}`,
              position: "relative",
            }}
          >
            <span
              style={{
                fontSize: "1.5rem",
                color: colors.text,
                fontFamily: "'SF Mono', monospace",
                fontWeight: 600,
              }}
            >
              rollNo
            </span>
            <span style={{ position: "absolute", top: "-15px", right: "-15px", fontSize: "2rem" }}>
              🪨
            </span>
          </motion.div>
        </div>

        {/* Break effect */}
        <AnimatePresence>
          {phase >= 2 && (
            <motion.div
              initial={{ opacity: 0, scale: 1.5 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{ fontSize: "3rem" }}
            >
              💥❌
            </motion.div>
          )}
        </AnimatePresence>

        {/* Code showing error */}
        <AnimatePresence>
          {phase >= 3 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <GlassCard glow={colors.danger}>
                <div
                  style={{
                    fontFamily: "'SF Mono', monospace",
                    fontSize: "18px",
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                  }}
                >
                  <span style={{ color: colors.text }}>rollNo = r;</span>
                  <span style={{ color: colors.danger, fontWeight: 700 }}>
                    // ❌ ERROR!
                  </span>
                </div>
              </GlassCard>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// ============================================
// SCENE 6: Initializer List Appears
// ============================================
const Scene6 = () => {
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
      {/* Success glow */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: phase >= 3 ? 1 : 0 }}
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at center, rgba(48, 209, 88, 0.15) 0%, transparent 70%)",
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
            color: colors.success,
            fontWeight: 700,
            fontSize: "13px",
            letterSpacing: "1.5px",
          }}
        >
          ✨ THE SOLUTION: INITIALIZER LIST
        </motion.div>

        {/* Timeline visualization */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: phase >= 1 ? 1 : 0 }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1rem",
          }}
        >
          {/* Before construction */}
          <motion.div
            animate={{
              boxShadow: phase >= 2 ? `0 0 20px ${colors.success}` : "none",
            }}
            style={{
              padding: "16px 24px",
              borderRadius: "16px",
              background: `${colors.success}20`,
              border: `2px solid ${colors.success}`,
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>📝</div>
            <div style={{ color: colors.success, fontWeight: 600, fontSize: "14px" }}>
              Initialize HERE
            </div>
            <div style={{ color: colors.textSec, fontSize: "12px" }}>
              (Before object builds)
            </div>
          </motion.div>

          {/* Arrow */}
          <motion.div
            animate={{ x: [0, 5, 0] }}
            transition={{ duration: 1, repeat: Infinity }}
            style={{ fontSize: "1.5rem", color: colors.textSec }}
          >
            →
          </motion.div>

          {/* Object construction */}
          <div
            style={{
              padding: "16px 24px",
              borderRadius: "16px",
              background: "#1c1c1e",
              border: "1px solid rgba(255,255,255,0.1)",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>🏗️</div>
            <div style={{ color: colors.textSec, fontWeight: 600, fontSize: "14px" }}>
              Object Builds
            </div>
          </div>

          {/* Arrow */}
          <motion.div
            animate={{ x: [0, 5, 0] }}
            transition={{ duration: 1, repeat: Infinity, delay: 0.3 }}
            style={{ fontSize: "1.5rem", color: colors.textSec }}
          >
            →
          </motion.div>

          {/* Object ready */}
          <div
            style={{
              padding: "16px 24px",
              borderRadius: "16px",
              background: "#1c1c1e",
              border: "1px solid rgba(255,255,255,0.1)",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>✅</div>
            <div style={{ color: colors.textSec, fontWeight: 600, fontSize: "14px" }}>
              Object Ready
            </div>
          </div>
        </motion.div>

        {/* Code syntax */}
        <AnimatePresence>
          {phase >= 3 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <GlassCard glow={colors.success}>
                <div
                  style={{
                    fontFamily: "'SF Mono', monospace",
                    fontSize: "18px",
                    color: colors.text,
                  }}
                >
                  <span style={{ color: colors.function }}>Student</span>
                  <span>(</span>
                  <span style={{ color: colors.keyword }}>int</span>
                  <span> r) </span>
                  <span style={{ color: colors.success, fontWeight: 700 }}>: rollNo(r)</span>
                  <span> {"{}"}</span>
                </div>
              </GlassCard>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// ============================================
// SCENE 7: First Full Program
// ============================================
const Scene7 = () => {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 500),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  const code = `#include <iostream>
using namespace std;

class Student {
    const int rollNo;
    int marks;

public:
    Student(int r, int m) : rollNo(r), marks(m) {}

    void display() {
        cout << "Roll No: " << rollNo << endl;
        cout << "Marks: " << marks << endl;
    }
};

int main() {
    Student s1(101, 90);
    s1.display();
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
            color: colors.primary,
            fontWeight: 700,
            fontSize: "13px",
            letterSpacing: "1.5px",
          }}
        >
          📝 FIRST FULL PROGRAM
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: phase >= 1 ? 1 : 0, y: 0 }}
        >
          <GlassCard style={{ maxWidth: "600px" }}>
            <CodeBlock code={code} />
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
};

// ============================================
// SCENE 8: Memory View
// ============================================
const Scene8 = () => {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 600),
      setTimeout(() => setPhase(2), 1500),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  const StudentObject = ({ name, rollNo, marks, delay }) => (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
      style={{
        padding: "1.5rem",
        borderRadius: "20px",
        background: "rgba(28, 28, 30, 0.8)",
        border: `2px solid ${colors.objectColor}`,
        minWidth: "180px",
      }}
    >
      <div
        style={{
          color: colors.objectColor,
          fontWeight: 700,
          fontSize: "1.1rem",
          marginBottom: "1rem",
          textAlign: "center",
        }}
      >
        {name}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        <div
          style={{
            padding: "8px 12px",
            borderRadius: "8px",
            background: `${colors.constColor}20`,
            border: `1px solid ${colors.constColor}`,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span style={{ color: colors.constColor, fontSize: "13px" }}>rollNo</span>
          <span style={{ color: colors.text, fontWeight: 600 }}>{rollNo}</span>
        </div>
        <div
          style={{
            padding: "8px 12px",
            borderRadius: "8px",
            background: "rgba(255,255,255,0.05)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span style={{ color: colors.textSec, fontSize: "13px" }}>marks</span>
          <span style={{ color: colors.text, fontWeight: 600 }}>{marks}</span>
        </div>
      </div>
    </motion.div>
  );

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
          💾 MEMORY VIEW
        </motion.div>

        <div style={{ display: "flex", gap: "2rem" }}>
          {phase >= 1 && <StudentObject name="s1" rollNo="101" marks="90" delay={0} />}
          {phase >= 2 && <StudentObject name="s2" rollNo="102" marks="85" delay={0.3} />}
        </div>

        <AnimatePresence>
          {phase >= 2 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                padding: "14px 28px",
                borderRadius: "100px",
                background: "#1c1c1e",
                border: "1px solid rgba(255,255,255,0.1)",
                color: colors.text,
                fontWeight: 500,
              }}
            >
              Each object has its own <span style={{ color: colors.constColor }}>rollNo</span> and{" "}
              <span style={{ color: colors.textSec }}>marks</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// ============================================
// SCENE 9: Introducing const Function
// ============================================
const Scene9 = () => {
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
            color: colors.constColor,
            fontWeight: 700,
            fontSize: "13px",
            letterSpacing: "1.5px",
          }}
        >
          🛡️ CONST MEMBER FUNCTION
        </motion.div>

        {/* Function with badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: phase >= 1 ? 1 : 0, scale: 1 }}
          style={{ position: "relative" }}
        >
          <GlassCard glow={colors.function}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                padding: "1rem",
              }}
            >
              <span style={{ fontSize: "3rem" }}>⚙️</span>
              <div>
                <div
                  style={{
                    color: colors.function,
                    fontWeight: 700,
                    fontSize: "1.3rem",
                    fontFamily: "'SF Mono', monospace",
                  }}
                >
                  getLength()
                </div>
                <div style={{ color: colors.textSec, fontSize: "14px" }}>
                  Member Function
                </div>
              </div>
            </div>
          </GlassCard>

          {/* Badge */}
          <AnimatePresence>
            {phase >= 1 && (
              <motion.div
                initial={{ opacity: 0, scale: 0, rotate: -20 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                style={{
                  position: "absolute",
                  top: "-25px",
                  right: "-25px",
                  padding: "12px 20px",
                  borderRadius: "100px",
                  background: colors.danger,
                  color: "white",
                  fontWeight: 700,
                  fontSize: "14px",
                  boxShadow: `0 5px 20px ${colors.danger}50`,
                }}
              >
                🛑 Do Not Touch
              </motion.div>
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
                background: `${colors.constColor}15`,
                border: `1px solid ${colors.constColor}40`,
                color: colors.text,
                fontWeight: 500,
                textAlign: "center",
              }}
            >
              This function <span style={{ color: colors.success }}>promises</span> not to change any
              data
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// ============================================
// SCENE 10: Syntax Highlight
// ============================================
const Scene10 = () => {
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
            color: colors.accent,
            fontWeight: 700,
            fontSize: "13px",
            letterSpacing: "1.5px",
          }}
        >
          🔍 SYNTAX ZOOM
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: phase >= 1 ? 1 : 0, scale: 1 }}
        >
          <GlassCard>
            <div
              style={{
                fontFamily: "'SF Mono', monospace",
                fontSize: "2rem",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              <span style={{ color: colors.keyword }}>int</span>
              <span style={{ color: colors.function }}>getRoll</span>
              <span style={{ color: colors.text }}>()</span>
              <motion.span
                animate={{
                  color: phase >= 2 ? colors.constColor : colors.text,
                  textShadow: phase >= 2 ? `0 0 20px ${colors.constColor}` : "none",
                  scale: phase >= 2 ? 1.1 : 1,
                }}
                style={{
                  fontWeight: 700,
                  padding: "4px 12px",
                  borderRadius: "8px",
                  background: phase >= 2 ? `${colors.constColor}20` : "transparent",
                }}
              >
                const
              </motion.span>
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
                alignItems: "center",
                gap: "1rem",
              }}
            >
              <div
                style={{
                  width: "40px",
                  height: "3px",
                  background: colors.constColor,
                }}
              />
              <span style={{ color: colors.text, fontWeight: 500 }}>
                <span style={{ color: colors.constColor, fontWeight: 700 }}>const</span> keyword at
                the END of the function signature
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// ============================================
// SCENE 11: Const Object Appears
// ============================================
const Scene11 = () => {
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
      {/* Ice glow */}
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
            color: colors.secondary,
            fontWeight: 700,
            fontSize: "13px",
            letterSpacing: "1.5px",
          }}
        >
          🧊 CONST OBJECT
        </motion.div>

        {/* Object in glass box */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: phase >= 1 ? 1 : 0, scale: 1 }}
          style={{
            position: "relative",
            padding: "3rem",
            borderRadius: "24px",
            background: "rgba(100, 210, 255, 0.1)",
            border: `3px solid ${colors.secondary}`,
            boxShadow: `
              0 0 60px rgba(100, 210, 255, 0.3),
              inset 0 0 60px rgba(100, 210, 255, 0.1)
            `,
          }}
        >
          <div style={{ fontSize: "4rem", textAlign: "center" }}>📦</div>
          <div
            style={{
              color: colors.text,
              fontWeight: 600,
              textAlign: "center",
              marginTop: "1rem",
              fontFamily: "'SF Mono', monospace",
            }}
          >
            const Box b1(10);
          </div>

          {/* Ice emoji */}
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{
              position: "absolute",
              top: "-20px",
              right: "-20px",
              fontSize: "2.5rem",
            }}
          >
            🧊
          </motion.div>
        </motion.div>

        {/* Rule */}
        <AnimatePresence>
          {phase >= 2 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                padding: "16px 28px",
                borderRadius: "16px",
                background: `${colors.secondary}15`,
                border: `1px solid ${colors.secondary}40`,
                color: colors.text,
                fontWeight: 500,
              }}
            >
              Const object can <span style={{ color: colors.success }}>ONLY</span> call{" "}
              <span style={{ color: colors.constColor, fontWeight: 700 }}>const</span> functions
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// ============================================
// SCENE 12: Const Function Program
// ============================================
const Scene12 = () => {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [setTimeout(() => setPhase(1), 500)];
    return () => timers.forEach(clearTimeout);
  }, []);

  const code = `#include <iostream>
using namespace std;

class Box {
    int length;

public:
    Box(int l) { length = l; }

    int getLength() const {
        return length;
    }

    void setLength(int l) {
        length = l;
    }
};

int main() {
    const Box b1(10);
    cout << b1.getLength();
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
            color: colors.primary,
            fontWeight: 700,
            fontSize: "13px",
            letterSpacing: "1.5px",
          }}
        >
          📝 CONST FUNCTION PROGRAM
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
// SCENE 13: Wrong Call Crossed Out
// ============================================
const Scene13 = () => {
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
      {/* Danger glow */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: phase >= 2 ? 1 : 0 }}
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at center, rgba(255, 69, 58, 0.15) 0%, transparent 70%)",
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
          ❌ WRONG CALL
        </motion.div>

        {/* Code with cross */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: phase >= 1 ? 1 : 0, scale: 1 }}
          style={{ position: "relative" }}
        >
          <GlassCard glow={phase >= 2 ? colors.danger : null}>
            <div
              style={{
                fontFamily: "'SF Mono', monospace",
                fontSize: "1.3rem",
                color: colors.text,
              }}
            >
              b1.setLength(20);
            </div>
          </GlassCard>

          {/* Cross line */}
          <AnimatePresence>
            {phase >= 2 && (
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "-10%",
                  right: "-10%",
                  height: "4px",
                  background: colors.danger,
                  transformOrigin: "left",
                }}
              />
            )}
          </AnimatePresence>
        </motion.div>

        {/* Error message */}
        <AnimatePresence>
          {phase >= 3 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                padding: "16px 28px",
                borderRadius: "16px",
                background: colors.danger,
                color: "white",
                fontWeight: 700,
                fontSize: "16px",
              }}
            >
              ❌ ERROR: Cannot call non-const function on const object!
            </motion.div>
          )}
        </AnimatePresence>

        {/* Explanation */}
        <AnimatePresence>
          {phase >= 3 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              style={{
                color: colors.textSec,
                fontSize: "14px",
                textAlign: "center",
              }}
            >
              <span style={{ color: colors.constColor }}>const</span> Box b1 →{" "}
              <span style={{ color: colors.success }}>getLength() const ✓</span> |{" "}
              <span style={{ color: colors.danger }}>setLength() ✗</span>
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
export const AnimationStepsPart1 = [
  {
    title: "const & static Members",
    component: Scene1,
    contentText:
      "Welcome to RTU OOP Unit 4 Part 1! In this section, we'll master const and static members - essential tools for protecting and sharing data in C++ classes.",
  },
  {
    title: "What is Class and Object",
    component: Scene2,
    contentText:
      "A class is like a blueprint. Objects are the actual houses built from it. Each object normally has its own copy of all data members.",
  },
  {
    title: "Introducing const",
    component: Scene3,
    contentText:
      "const is a keyword in C++ that means 'cannot change'. Once a const value is set, it stays locked forever. Think of it as putting data in stone.",
  },
  {
    title: "Const Data Member Concept",
    component: Scene4,
    contentText:
      "A const data member like 'const int rollNo' is engraved in stone. Once initialized, it can never be modified throughout the object's lifetime.",
  },
  {
    title: "Why Normal Assignment Fails",
    component: Scene5,
    contentText:
      "You cannot use normal assignment like 'rollNo = r;' in the constructor body for const members. The const member is already set by then. It's like trying to carve on already-set concrete!",
  },
  {
    title: "Initializer List Solution",
    component: Scene6,
    contentText:
      "The initializer list 'Student(int r) : rollNo(r) {}' initializes const members BEFORE the object is fully constructed. This is the only way to set const data members.",
  },
  {
    title: "First Full Program",
    component: Scene7,
    contentText:
      "Complete Student class with const rollNo initialized via initializer list. The rollNo is set once during construction and can never be changed.",
  },
  {
    title: "Memory View",
    component: Scene8,
    contentText:
      "Each Student object (s1, s2) has its own separate rollNo and marks in memory. The const rollNo in each is independent but unchangeable.",
  },
  {
    title: "Introducing const Function",
    component: Scene9,
    contentText:
      "A const member function promises NOT to modify any data members of the object. It wears a 'Do Not Touch' badge - it can only read, never write.",
  },
  {
    title: "Syntax Highlight",
    component: Scene10,
    contentText:
      "The const keyword goes at the END of the function signature: 'int getRoll() const'. This tells the compiler this function won't modify the object.",
  },
  {
    title: "Const Object",
    component: Scene11,
    contentText:
      "A const object like 'const Box b1(10)' is frozen in ice. It can ONLY call const member functions. Non-const functions are forbidden!",
  },
  {
    title: "Const Function Program",
    component: Scene12,
    contentText:
      "Box class with getLength() const (can be called by const objects) and setLength() (cannot be called by const objects). const Box b1 can only use getLength().",
  },
  {
    title: "Wrong Call Error",
    component: Scene13,
    contentText:
      "Calling b1.setLength(20) on a const object b1 causes a compilation ERROR! A const object cannot call non-const member functions.",
  },
];

export default { AnimationStepsPart1 };
