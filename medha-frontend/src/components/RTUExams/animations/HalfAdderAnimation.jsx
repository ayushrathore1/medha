/**
 * Half Adder Animation
 * Step-by-step visualization of a half adder circuit
 * Digital Electronics - Combinational Circuits
 */
import React from 'react';
import { motion } from 'framer-motion';

// Animation metadata
export const metadata = {
  id: 'half-adder',
  title: 'Half Adder Circuit',
  description: 'Learn how a half adder adds two single-bit binary numbers',
  totalSteps: 6,
  subject: 'Digital Electronics',
  category: 'combinational-circuits',
  estimatedTime: '5 min'
};

// Color palette for consistency
const colors = {
  wire: '#6366f1',
  wireActive: '#22c55e',
  gate: '#1e293b',
  gateBorder: '#475569',
  text: '#f8fafc',
  textMuted: '#94a3b8',
  background: '#0f172a',
  accent: '#8b5cf6'
};

// Shared animation variants
const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const pulse = {
  animate: { 
    scale: [1, 1.05, 1],
    transition: { duration: 1, repeat: Infinity }
  }
};

// Step 1: Introduction
const Step1 = () => (
  <motion.div 
    className="flex flex-col items-center justify-center h-full p-8 text-center"
    {...fadeIn}
  >
    <motion.div 
      className="text-6xl mb-6"
      animate={{ rotate: [0, 10, -10, 0] }}
      transition={{ duration: 2, repeat: Infinity }}
    >
      ➕
    </motion.div>
    <h2 className="text-3xl font-bold text-white mb-4">What is a Half Adder?</h2>
    <p className="text-xl text-slate-300 max-w-2xl leading-relaxed">
      A <span className="text-indigo-400 font-semibold">Half Adder</span> is a combinational circuit 
      that adds two single-bit binary numbers (A and B) and produces two outputs:
    </p>
    <div className="flex gap-8 mt-8">
      <motion.div 
        className="bg-slate-800/50 border border-slate-700 rounded-xl p-6"
        whileHover={{ scale: 1.05, borderColor: '#22c55e' }}
      >
        <div className="text-2xl font-bold text-green-400">S</div>
        <div className="text-slate-400 mt-1">Sum</div>
      </motion.div>
      <motion.div 
        className="bg-slate-800/50 border border-slate-700 rounded-xl p-6"
        whileHover={{ scale: 1.05, borderColor: '#f59e0b' }}
      >
        <div className="text-2xl font-bold text-amber-400">C</div>
        <div className="text-slate-400 mt-1">Carry</div>
      </motion.div>
    </div>
  </motion.div>
);

// Step 2: Truth Table
const Step2 = () => (
  <motion.div 
    className="flex flex-col items-center justify-center h-full p-8"
    {...fadeIn}
  >
    <h2 className="text-2xl font-bold text-white mb-6">Truth Table</h2>
    <motion.table 
      className="border-collapse bg-slate-800/50 rounded-xl overflow-hidden"
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
    >
      <thead>
        <tr className="bg-indigo-600">
          <th className="px-8 py-4 text-white font-semibold">A</th>
          <th className="px-8 py-4 text-white font-semibold">B</th>
          <th className="px-8 py-4 text-white font-semibold border-l border-indigo-500">Sum (S)</th>
          <th className="px-8 py-4 text-white font-semibold">Carry (C)</th>
        </tr>
      </thead>
      <tbody>
        {[
          [0, 0, 0, 0],
          [0, 1, 1, 0],
          [1, 0, 1, 0],
          [1, 1, 0, 1]
        ].map((row, i) => (
          <motion.tr 
            key={i}
            className="border-t border-slate-700"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.15 }}
          >
            {row.map((cell, j) => (
              <td 
                key={j} 
                className={`px-8 py-4 text-center text-lg font-mono ${
                  j >= 2 ? 'bg-slate-900/50' : ''
                } ${cell === 1 ? 'text-green-400' : 'text-slate-400'}`}
              >
                {cell}
              </td>
            ))}
          </motion.tr>
        ))}
      </tbody>
    </motion.table>
    <motion.p 
      className="mt-6 text-slate-400 max-w-lg text-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.8 }}
    >
      Notice: Sum is 1 when inputs are <span className="text-indigo-400">different</span> (XOR), 
      Carry is 1 when <span className="text-amber-400">both inputs are 1</span> (AND)
    </motion.p>
  </motion.div>
);

// Step 3: XOR Gate Explanation
const Step3 = () => (
  <motion.div 
    className="flex flex-col items-center justify-center h-full p-8"
    {...fadeIn}
  >
    <h2 className="text-2xl font-bold text-white mb-6">XOR Gate → Sum Output</h2>
    <div className="flex items-center gap-8">
      {/* XOR Gate SVG */}
      <motion.svg 
        width="200" height="120" viewBox="0 0 200 120"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
      >
        {/* Input lines */}
        <motion.line x1="0" y1="40" x2="40" y2="40" stroke={colors.wire} strokeWidth="3" 
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5 }} />
        <motion.line x1="0" y1="80" x2="40" y2="80" stroke={colors.wire} strokeWidth="3"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5, delay: 0.2 }} />
        
        {/* XOR Gate body */}
        <motion.path
          d="M40,20 Q60,60 40,100 Q80,60 40,20"
          fill={colors.gate}
          stroke={colors.gateBorder}
          strokeWidth="2"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.4 }}
        />
        <motion.path
          d="M50,20 Q70,60 50,100 Q110,60 50,20"
          fill={colors.gate}
          stroke={colors.gateBorder}
          strokeWidth="2"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5 }}
        />
        
        {/* Output line */}
        <motion.line x1="110" y1="60" x2="200" y2="60" stroke={colors.wireActive} strokeWidth="3"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5, delay: 0.7 }} />
        
        {/* Labels */}
        <text x="5" y="35" fill={colors.text} fontSize="14" fontWeight="bold">A</text>
        <text x="5" y="85" fill={colors.text} fontSize="14" fontWeight="bold">B</text>
        <text x="180" y="55" fill={colors.wireActive} fontSize="14" fontWeight="bold">S</text>
      </motion.svg>

      <motion.div 
        className="bg-slate-800/50 border border-indigo-500/30 rounded-xl p-6 max-w-sm"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.8 }}
      >
        <div className="text-lg font-mono text-indigo-400 mb-2">S = A ⊕ B</div>
        <p className="text-slate-300">
          XOR outputs <span className="text-green-400">1</span> when inputs are different
        </p>
      </motion.div>
    </div>
  </motion.div>
);

// Step 4: AND Gate Explanation
const Step4 = () => (
  <motion.div 
    className="flex flex-col items-center justify-center h-full p-8"
    {...fadeIn}
  >
    <h2 className="text-2xl font-bold text-white mb-6">AND Gate → Carry Output</h2>
    <div className="flex items-center gap-8">
      {/* AND Gate SVG */}
      <motion.svg 
        width="200" height="120" viewBox="0 0 200 120"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
      >
        {/* Input lines */}
        <motion.line x1="0" y1="40" x2="50" y2="40" stroke={colors.wire} strokeWidth="3"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5 }} />
        <motion.line x1="0" y1="80" x2="50" y2="80" stroke={colors.wire} strokeWidth="3"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5, delay: 0.2 }} />
        
        {/* AND Gate body */}
        <motion.path
          d="M50,20 L50,100 L90,100 Q130,60 90,20 L50,20"
          fill={colors.gate}
          stroke={colors.gateBorder}
          strokeWidth="2"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.4 }}
        />
        
        {/* Output line */}
        <motion.line x1="120" y1="60" x2="200" y2="60" stroke="#f59e0b" strokeWidth="3"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5, delay: 0.6 }} />
        
        {/* Labels */}
        <text x="5" y="35" fill={colors.text} fontSize="14" fontWeight="bold">A</text>
        <text x="5" y="85" fill={colors.text} fontSize="14" fontWeight="bold">B</text>
        <text x="180" y="55" fill="#f59e0b" fontSize="14" fontWeight="bold">C</text>
      </motion.svg>

      <motion.div 
        className="bg-slate-800/50 border border-amber-500/30 rounded-xl p-6 max-w-sm"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.7 }}
      >
        <div className="text-lg font-mono text-amber-400 mb-2">C = A · B</div>
        <p className="text-slate-300">
          AND outputs <span className="text-green-400">1</span> only when both inputs are 1
        </p>
      </motion.div>
    </div>
  </motion.div>
);

// Step 5: Complete Circuit
const Step5 = () => (
  <motion.div 
    className="flex flex-col items-center justify-center h-full p-8"
    {...fadeIn}
  >
    <h2 className="text-2xl font-bold text-white mb-6">Complete Half Adder Circuit</h2>
    <motion.svg 
      width="400" height="200" viewBox="0 0 400 200"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Input A line */}
      <motion.line x1="20" y1="50" x2="100" y2="50" stroke={colors.wire} strokeWidth="3"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.3 }} />
      {/* Branch for A to both gates */}
      <motion.line x1="100" y1="50" x2="100" y2="130" stroke={colors.wire} strokeWidth="3"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.3, delay: 0.1 }} />
      <motion.line x1="100" y1="50" x2="150" y2="50" stroke={colors.wire} strokeWidth="3"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.3, delay: 0.15 }} />
      <motion.line x1="100" y1="130" x2="150" y2="130" stroke={colors.wire} strokeWidth="3"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.3, delay: 0.2 }} />

      {/* Input B line */}
      <motion.line x1="20" y1="90" x2="80" y2="90" stroke={colors.wire} strokeWidth="3"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.3, delay: 0.25 }} />
      {/* Branch for B to both gates */}
      <motion.line x1="80" y1="90" x2="80" y2="160" stroke={colors.wire} strokeWidth="3"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.3, delay: 0.3 }} />
      <motion.line x1="80" y1="70" x2="150" y2="70" stroke={colors.wire} strokeWidth="3"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.3, delay: 0.35 }} />
      <motion.line x1="80" y1="160" x2="150" y2="160" stroke={colors.wire} strokeWidth="3"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.3, delay: 0.4 }} />

      {/* XOR Gate */}
      <motion.rect x="150" y="35" width="60" height="50" rx="5" fill={colors.gate} stroke="#6366f1" strokeWidth="2"
        initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.5 }} />
      <motion.text x="170" y="67" fill="#6366f1" fontSize="14" fontWeight="bold"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>XOR</motion.text>

      {/* AND Gate */}
      <motion.rect x="150" y="115" width="60" height="60" rx="5" fill={colors.gate} stroke="#f59e0b" strokeWidth="2"
        initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.55 }} />
      <motion.text x="162" y="152" fill="#f59e0b" fontSize="14" fontWeight="bold"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.65 }}>AND</motion.text>

      {/* Output lines */}
      <motion.line x1="210" y1="60" x2="380" y2="60" stroke="#22c55e" strokeWidth="3"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5, delay: 0.7 }} />
      <motion.line x1="210" y1="145" x2="380" y2="145" stroke="#f59e0b" strokeWidth="3"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5, delay: 0.75 }} />

      {/* Labels */}
      <text x="30" y="45" fill={colors.text} fontSize="16" fontWeight="bold">A</text>
      <text x="30" y="95" fill={colors.text} fontSize="16" fontWeight="bold">B</text>
      <text x="350" y="55" fill="#22c55e" fontSize="16" fontWeight="bold">Sum</text>
      <text x="342" y="150" fill="#f59e0b" fontSize="16" fontWeight="bold">Carry</text>
    </motion.svg>

    <motion.div 
      className="mt-6 flex gap-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1 }}
    >
      <div className="bg-indigo-500/20 border border-indigo-500/30 rounded-lg px-4 py-2">
        <span className="text-indigo-400 font-mono">S = A ⊕ B</span>
      </div>
      <div className="bg-amber-500/20 border border-amber-500/30 rounded-lg px-4 py-2">
        <span className="text-amber-400 font-mono">C = A · B</span>
      </div>
    </motion.div>
  </motion.div>
);

// Step 6: Summary
const Step6 = () => (
  <motion.div 
    className="flex flex-col items-center justify-center h-full p-8 text-center"
    {...fadeIn}
  >
    <motion.div 
      className="text-5xl mb-6"
      animate={{ scale: [1, 1.2, 1] }}
      transition={{ duration: 1.5, repeat: Infinity }}
    >
      ✅
    </motion.div>
    <h2 className="text-3xl font-bold text-white mb-4">Summary</h2>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 max-w-3xl">
      <motion.div 
        className="bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 rounded-xl p-6 text-left"
        whileHover={{ scale: 1.02 }}
      >
        <h3 className="text-indigo-400 font-bold mb-2">Key Points</h3>
        <ul className="text-slate-300 space-y-2">
          <li>• Adds two 1-bit binary numbers</li>
          <li>• Uses XOR gate for Sum</li>
          <li>• Uses AND gate for Carry</li>
          <li>• Cannot handle carry input</li>
        </ul>
      </motion.div>

      <motion.div 
        className="bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30 rounded-xl p-6 text-left"
        whileHover={{ scale: 1.02 }}
      >
        <h3 className="text-amber-400 font-bold mb-2">Equations</h3>
        <div className="text-slate-300 space-y-2 font-mono">
          <div>Sum = A ⊕ B</div>
          <div>Carry = A · B</div>
          <div className="text-slate-500 text-sm mt-3">where ⊕ = XOR, · = AND</div>
        </div>
      </motion.div>
    </div>

    <motion.p 
      className="mt-8 text-slate-400"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
    >
      Next: Learn about <span className="text-indigo-400">Full Adder</span> which can handle carry input!
    </motion.p>
  </motion.div>
);

// Export all steps as an array
export const AnimationSteps = [Step1, Step2, Step3, Step4, Step5, Step6];

export default { metadata, AnimationSteps };
