/**
 * OperatorOverloadingLecturePart2.jsx - Scenes 10-17
 * Comparison, Subscript, Rules, Mistakes, Summary
 */
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { colors, containerStyle } from "./VirtualFunctionsTheme";
import { GlassCard, CodeBlock } from "./OperatorOverloadingLecture";

// ============================================
// SCENE 10: Why Return ostream&?
// ============================================
const Scene10 = () => {
  const codeGood = `ostream& operator<<(ostream& out, const Box& b) {
    out << b.weight;
    return out;  // Return for chaining!
}

cout << "Weight: " << myBox << endl;  // ✓ Works!`;
  const codeBad = `void operator<<(ostream& out, const Box& b) {
    out << b.weight;
    // No return!
}

cout << myBox << anotherBox;  // ❌ Chain breaks!`;
  const [phase, setPhase] = useState(0);
  useEffect(() => { const t = [setTimeout(() => setPhase(1), 800)]; return () => t.forEach(clearTimeout); }, []);
  return (
    <div style={containerStyle}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: colors.accent, fontWeight: 700, fontSize: "13px", letterSpacing: "1.5px", marginBottom: "1rem" }}>🔄 WHY RETURN ostream&amp;?</motion.div>
      <div style={{ display: "flex", gap: "1.5rem" }}>
        <div>
          <div style={{ color: colors.success, fontSize: "11px", fontWeight: 600, marginBottom: "0.3rem" }}>✓ With Return:</div>
          <GlassCard glow={colors.success} style={{ maxWidth: "380px" }}><CodeBlock code={codeGood} fontSize="9px" /></GlassCard>
        </div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 1 ? 1 : 0 }}>
          <div style={{ color: colors.danger, fontSize: "11px", fontWeight: 600, marginBottom: "0.3rem" }}>❌ Without Return:</div>
          <GlassCard glow={colors.danger} style={{ maxWidth: "380px" }}><CodeBlock code={codeBad} fontSize="9px" /></GlassCard>
        </motion.div>
      </div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 1 ? 1 : 0 }} style={{ marginTop: "1rem", padding: "10px 20px", borderRadius: "100px", background: `${colors.accent}15`, border: `1px solid ${colors.accent}40`, textAlign: "center" }}>
        <span style={{ color: colors.text }}>Return enables </span><span style={{ color: colors.accent, fontWeight: 700 }}>chaining: cout &lt;&lt; a &lt;&lt; b &lt;&lt; c</span>
      </motion.div>
    </div>
  );
};

// ============================================
// SCENE 11: Comparison Operators
// ============================================
const Scene11 = () => {
  const code = `class Student {
    int id;
    string name;
public:
    // Equality operator
    bool operator==(const Student& other) const {
        return this->id == other.id;
    }
    
    // Less than (for sorting)
    bool operator<(const Student& other) const {
        return this->id < other.id;
    }
};

// STL Integration:
vector<Student> students;
sort(students.begin(), students.end());
// Uses operator< internally!

auto it = find(students.begin(), students.end(), target);
// Uses operator== internally!`;
  return (
    <div style={containerStyle}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: colors.primary, fontWeight: 700, fontSize: "13px", letterSpacing: "1.5px", marginBottom: "1rem" }}>⚖️ COMPARISON OPERATORS</motion.div>
      <div style={{ display: "flex", gap: "2rem", alignItems: "flex-start" }}>
        <GlassCard style={{ maxWidth: "420px" }}><CodeBlock code={code} fontSize="9px" /></GlassCard>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
          <div style={{ padding: "12px 20px", borderRadius: "12px", background: `${colors.success}15`, border: `1px solid ${colors.success}` }}>
            <div style={{ fontFamily: "monospace", color: colors.success, fontWeight: 600 }}>operator==</div>
            <div style={{ color: colors.textSec, fontSize: "10px" }}>STL find() uses this</div>
          </div>
          <div style={{ padding: "12px 20px", borderRadius: "12px", background: `${colors.primary}15`, border: `1px solid ${colors.primary}` }}>
            <div style={{ fontFamily: "monospace", color: colors.primary, fontWeight: 600 }}>operator&lt;</div>
            <div style={{ color: colors.textSec, fontSize: "10px" }}>STL sort() uses this</div>
          </div>
          <motion.div animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 2, repeat: Infinity }} style={{ padding: "12px 20px", borderRadius: "12px", background: `${colors.accent}20`, border: `2px solid ${colors.accent}`, textAlign: "center" }}>
            <div style={{ color: colors.accent, fontWeight: 700, fontSize: "12px" }}>🔧 STL Integration!</div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

// ============================================
// SCENE 12: Subscript Operator []
// ============================================
const Scene12 = () => {
  const code = `class GradeBook {
    int grades[100];
public:
    // Subscript operator
    int& operator[](int index) {
        return grades[index];
    }
};

// Usage:
GradeBook book;
book[0] = 95;       // Write (left side)
int g = book[0];    // Read (right side)`;
  const [phase, setPhase] = useState(0);
  useEffect(() => { const t = [setTimeout(() => setPhase(1), 800)]; return () => t.forEach(clearTimeout); }, []);
  return (
    <div style={containerStyle}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: colors.warning, fontWeight: 700, fontSize: "13px", letterSpacing: "1.5px", marginBottom: "1rem" }}>📚 SUBSCRIPT OPERATOR [ ]</motion.div>
      <div style={{ display: "flex", gap: "2rem", alignItems: "flex-start" }}>
        <GlassCard style={{ maxWidth: "350px" }}><CodeBlock code={code} /></GlassCard>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 1 ? 1 : 0 }} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            {[0, 1, 2, 3, 4].map(i => (
              <motion.div key={i} animate={{ backgroundColor: i === 0 ? [`${colors.success}30`, `${colors.success}60`, `${colors.success}30`] : `${colors.text}10` }} transition={{ duration: 1.5, repeat: Infinity }} style={{ width: "36px", height: "36px", borderRadius: "8px", border: `1px solid ${i === 0 ? colors.success : colors.text}30`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "monospace", color: i === 0 ? colors.success : colors.textSec, fontSize: "12px" }}>
                {i === 0 ? "95" : "-"}
              </motion.div>
            ))}
          </div>
          <div style={{ padding: "12px 20px", borderRadius: "12px", background: `${colors.warning}15`, border: `1px solid ${colors.warning}` }}>
            <div style={{ color: colors.warning, fontWeight: 600, fontSize: "12px" }}>Why int&amp; (reference)?</div>
            <div style={{ color: colors.textSec, fontSize: "10px" }}>Allows both read AND write</div>
          </div>
          <div style={{ display: "flex", gap: "1rem" }}>
            <div style={{ padding: "8px 12px", borderRadius: "8px", background: `${colors.success}15`, fontSize: "11px" }}><span style={{ color: colors.success }}>✓</span> book[0] = 95</div>
            <div style={{ padding: "8px 12px", borderRadius: "8px", background: `${colors.success}15`, fontSize: "11px" }}><span style={{ color: colors.success }}>✓</span> g = book[0]</div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

// ============================================
// SCENE 13: Rules & Restrictions
// ============================================
const Scene13 = () => {
  const [phase, setPhase] = useState(0);
  useEffect(() => { const t = [setTimeout(() => setPhase(1), 400), setTimeout(() => setPhase(2), 800), setTimeout(() => setPhase(3), 1200), setTimeout(() => setPhase(4), 1600)]; return () => t.forEach(clearTimeout); }, []);
  const forbidden = [
    { text: "Cannot create NEW operators", code: "operator**" },
    { text: "Cannot change precedence", code: "* always before +" },
    { text: "Cannot change arity", code: "+ is binary, ++ is unary" },
    { text: "Cannot redefine built-ins", code: "int + int" },
  ];
  return (
    <div style={containerStyle}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: colors.danger, fontWeight: 700, fontSize: "13px", letterSpacing: "1.5px", marginBottom: "1.5rem" }}>📜 RULES &amp; RESTRICTIONS</motion.div>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
        {forbidden.map((r, i) => (
          <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: phase > i ? 1 : 0, x: 0 }} style={{ padding: "12px 20px", borderRadius: "12px", background: `${colors.danger}10`, border: `1px solid ${colors.danger}30`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span style={{ color: colors.danger }}>❌</span>
              <span style={{ color: colors.text, fontSize: "12px" }}>{r.text}</span>
            </div>
            <span style={{ fontFamily: "monospace", fontSize: "10px", color: colors.danger, background: `${colors.danger}15`, padding: "2px 8px", borderRadius: "4px" }}>{r.code}</span>
          </motion.div>
        ))}
      </div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 4 ? 1 : 0 }} style={{ marginTop: "1rem", padding: "12px 20px", borderRadius: "12px", background: `${colors.success}10`, border: `1px solid ${colors.success}30`, display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <span style={{ color: colors.success }}>✓</span>
        <span style={{ color: colors.text, fontSize: "12px" }}>At least ONE operand must be user-defined type</span>
      </motion.div>
    </div>
  );
};

// ============================================
// SCENE 14: Common Mistakes
// ============================================
const Scene14 = () => {
  const codeWrong1 = `// ❌ Forgetting const
bool operator==(Student& other) {
    return id == other.id;
}

if (s1 == Student(101)) { }
// Temporary can't bind!`;
  const codeRight1 = `// ✓ With const
bool operator==(const Student& o) const {
    return id == o.id;
}`;
  const codeWrong2 = `// ❌ Wrong return type
void operator+(const Box& other) {
    Box temp(weight + other.weight);
    // Value disappears!
}`;
  const [phase, setPhase] = useState(0);
  useEffect(() => { const t = [setTimeout(() => setPhase(1), 800)]; return () => t.forEach(clearTimeout); }, []);
  return (
    <div style={containerStyle}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: colors.warning, fontWeight: 700, fontSize: "13px", letterSpacing: "1.5px", marginBottom: "1rem" }}>🐛 COMMON MISTAKES</motion.div>
      <div style={{ display: "flex", gap: "1.5rem" }}>
        <div>
          <div style={{ color: colors.danger, fontSize: "11px", fontWeight: 600, marginBottom: "0.3rem" }}>Mistake 1: Forgetting const</div>
          <GlassCard glow={colors.danger} style={{ maxWidth: "280px" }}><CodeBlock code={codeWrong1} fontSize="8px" /></GlassCard>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 1 ? 1 : 0 }} style={{ marginTop: "0.5rem" }}>
            <GlassCard glow={colors.success} style={{ maxWidth: "280px" }}><CodeBlock code={codeRight1} fontSize="8px" /></GlassCard>
          </motion.div>
        </div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 1 ? 1 : 0 }}>
          <div style={{ color: colors.danger, fontSize: "11px", fontWeight: 600, marginBottom: "0.3rem" }}>Mistake 2: Wrong return type</div>
          <GlassCard glow={colors.danger} style={{ maxWidth: "300px" }}><CodeBlock code={codeWrong2} fontSize="8px" /></GlassCard>
          <div style={{ marginTop: "0.5rem", padding: "10px 16px", borderRadius: "10px", background: `${colors.danger}15`, border: `1px solid ${colors.danger}` }}>
            <div style={{ color: colors.danger, fontSize: "11px" }}>Value disappears into void!</div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

// ============================================
// SCENE 15: Design Principle - Least Astonishment
// ============================================
const Scene15 = () => {
  const [phase, setPhase] = useState(0);
  useEffect(() => { const t = [setTimeout(() => setPhase(1), 800)]; return () => t.forEach(clearTimeout); }, []);
  return (
    <div style={containerStyle}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: colors.accent, fontWeight: 700, fontSize: "13px", letterSpacing: "1.5px", marginBottom: "1.5rem" }}>💡 DESIGN PRINCIPLE</motion.div>
      <div style={{ display: "flex", gap: "2rem" }}>
        <div>
          <div style={{ color: colors.success, fontSize: "12px", fontWeight: 600, marginBottom: "0.5rem" }}>✓ INTUITIVE:</div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {["Complex c3 = c1 + c2;", "Matrix m3 = m1 * m2;", "String s3 = s1 + s2;"].map((code, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} style={{ padding: "8px 16px", borderRadius: "8px", background: `${colors.success}15`, fontFamily: "monospace", fontSize: "11px", color: colors.success }}>
                {code}
              </motion.div>
            ))}
          </div>
        </div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 1 ? 1 : 0 }}>
          <div style={{ color: colors.danger, fontSize: "12px", fontWeight: 600, marginBottom: "0.5rem" }}>❌ CONFUSING:</div>
          <div style={{ padding: "12px 16px", borderRadius: "12px", background: `${colors.danger}15`, border: `1px solid ${colors.danger}`, marginBottom: "0.5rem" }}>
            <div style={{ fontFamily: "monospace", fontSize: "11px", color: colors.danger }}>Employee e3 = e1 + e2;</div>
            <div style={{ color: colors.textSec, fontSize: "10px", marginTop: "0.3rem" }}>Add salaries? Merge teams? 🤔</div>
          </div>
          <div style={{ padding: "8px 16px", borderRadius: "8px", background: `${colors.success}15`, fontFamily: "monospace", fontSize: "11px", color: colors.success }}>
            e1.mergeWith(e2) ✓ Clear!
          </div>
        </motion.div>
      </div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: phase >= 1 ? 1 : 0, y: 0 }} style={{ marginTop: "1.5rem", padding: "12px 24px", borderRadius: "100px", background: `${colors.accent}15`, border: `1px solid ${colors.accent}40`, textAlign: "center" }}>
        <span style={{ color: colors.accent, fontWeight: 700 }}>"Operators should do what users EXPECT!"</span>
      </motion.div>
    </div>
  );
};

// ============================================
// SCENE 16: Summary - Mind Map
// ============================================
const Scene16 = () => {
  const [phase, setPhase] = useState(0);
  useEffect(() => { const t = [setTimeout(() => setPhase(1), 400), setTimeout(() => setPhase(2), 800), setTimeout(() => setPhase(3), 1200), setTimeout(() => setPhase(4), 1600), setTimeout(() => setPhase(5), 2000)]; return () => t.forEach(clearTimeout); }, []);
  const takeaways = [
    { icon: "🔧", text: "Not Magic - Just special functions" },
    { icon: "✌️", text: "Two Ways - Member or Friend" },
    { icon: "🎯", text: "Goal - Intuitive, readable code" },
    { icon: "📜", text: "Rules - Follow language restrictions" },
    { icon: "😊", text: "Design - Principle of least astonishment" },
  ];
  return (
    <div style={containerStyle}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: colors.success, fontWeight: 700, fontSize: "13px", letterSpacing: "1.5px", marginBottom: "1.5rem" }}>📊 SUMMARY</motion.div>
      <div style={{ display: "flex", gap: "2rem" }}>
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} style={{ padding: "24px", borderRadius: "50%", background: `${colors.accent}20`, border: `3px solid ${colors.accent}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ color: colors.accent, fontWeight: 700, textAlign: "center", fontSize: "14px" }}>Operator<br/>Overloading</span>
        </motion.div>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
          {takeaways.map((t, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: 30 }} animate={{ opacity: phase > i ? 1 : 0, x: 0 }} style={{ padding: "10px 16px", borderRadius: "10px", background: `${colors.success}10`, display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span>{t.icon}</span>
              <span style={{ color: colors.text, fontSize: "12px" }}>{t.text}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ============================================
// SCENE 17: Teaser - Functors
// ============================================
const Scene17 = () => {
  const code = `class MyFunctor {
public:
    int operator()(int x) {
        return x * x;
    }
};

MyFunctor obj;
int result = obj(10);  // Calls operator()
                       // result = 100`;
  const [phase, setPhase] = useState(0);
  useEffect(() => { const t = [setTimeout(() => setPhase(1), 800)]; return () => t.forEach(clearTimeout); }, []);
  return (
    <div style={containerStyle}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: colors.virtualColor, fontWeight: 700, fontSize: "13px", letterSpacing: "1.5px", marginBottom: "1.5rem" }}>🎁 TEASER: FUNCTION CALL OPERATOR</motion.div>
      <div style={{ display: "flex", gap: "2rem", alignItems: "center" }}>
        <GlassCard glow={colors.virtualColor} style={{ maxWidth: "350px" }}><CodeBlock code={code} /></GlassCard>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 1 ? 1 : 0 }} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" }}>
          <motion.div animate={{ scale: [1, 1.2, 1], rotate: [0, 360, 360] }} transition={{ duration: 3, repeat: Infinity }} style={{ fontSize: "4rem" }}>✨</motion.div>
          <div style={{ padding: "16px 24px", borderRadius: "16px", background: `${colors.virtualColor}20`, border: `2px solid ${colors.virtualColor}`, textAlign: "center" }}>
            <div style={{ color: colors.virtualColor, fontWeight: 700 }}>FUNCTORS</div>
            <div style={{ color: colors.textSec, fontSize: "11px", marginTop: "0.3rem" }}>Objects that behave like functions!</div>
          </div>
        </motion.div>
      </div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 1 ? 1 : 0 }} style={{ marginTop: "1.5rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}>
        <span style={{ color: colors.textSec }}>Coming Next...</span>
        <motion.span animate={{ x: [0, 10, 0] }} transition={{ duration: 1, repeat: Infinity }} style={{ fontSize: "1.5rem" }}>➡️</motion.span>
      </motion.div>
    </div>
  );
};

// Export Part 2 scenes
export const OperatorScenesPart2 = [
  { title: "Why Return ostream&?", component: Scene10, contentText: "Return enables chaining: cout << a << b << c. Without return, chain breaks!" },
  { title: "Comparison Operators", component: Scene11, contentText: "operator== for find(), operator< for sort(). STL integration makes your class work with algorithms!" },
  { title: "Subscript Operator []", component: Scene12, contentText: "int& operator[] returns reference - enables both read (g = book[0]) AND write (book[0] = 95)." },
  { title: "Rules & Restrictions", component: Scene13, contentText: "Can't create new operators, change precedence, change arity, or redefine built-ins. One operand must be user-defined." },
  { title: "Common Mistakes", component: Scene14, contentText: "Forgetting const (temporary can't bind), wrong return type (value disappears into void)." },
  { title: "Design Principle", component: Scene15, contentText: "Operators should do what users EXPECT. Complex+Complex is intuitive, Employee+Employee is confusing." },
  { title: "Summary", component: Scene16, contentText: "Not magic, just functions. Two ways: Member or Friend. Follow rules, design intuitively." },
  { title: "Teaser: Functors", component: Scene17, contentText: "operator() makes objects callable like functions. MyFunctor obj; obj(10) = 100. Coming next!" },
];
