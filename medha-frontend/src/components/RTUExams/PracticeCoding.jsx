/**
 * PracticeCoding Component
 * Coming Soon - Practice coding feature under development
 */
import React from "react";
import { motion } from "framer-motion";
import { FaCode, FaRocket, FaClock } from "react-icons/fa";

const PracticeCoding = () => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-2xl mx-auto"
      >
        {/* Animated Icon */}
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="mb-8"
        >
          <div className="w-32 h-32 mx-auto rounded-3xl bg-gradient-to-br from-purple-500 via-violet-500 to-indigo-600 flex items-center justify-center shadow-2xl shadow-purple-500/30">
            <FaCode className="text-white text-5xl" />
          </div>
        </motion.div>

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 mb-6"
        >
          <FaClock className="text-amber-400" />
          <span className="text-amber-300 font-semibold text-sm">
            Under Development
          </span>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-4xl md:text-5xl font-bold mb-4"
          style={{ color: "var(--text-primary)" }}
        >
          Practice Coding
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-violet-400 to-indigo-400">
            Coming Soon
          </span>
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-lg mb-8 leading-relaxed"
          style={{ color: "var(--text-secondary)" }}
        >
          We're building an amazing coding practice platform with RTU PYQ
          questions, real-time code execution, and AI-powered hints. Stay tuned!
        </motion.p>

        {/* Features Preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
        >
          {[
            {
              icon: "📝",
              title: "RTU PYQ Questions",
              desc: "2019-2025 papers",
            },
            {
              icon: "⚡",
              title: "Live Code Execution",
              desc: "Run C/C++ code",
            },
            {
              icon: "🤖",
              title: "AI Hints & Solutions",
              desc: "Smart assistance",
            },
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + index * 0.1 }}
              className="p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-default)] hover:border-purple-500/50 transition-all"
            >
              <div className="text-3xl mb-2">{feature.icon}</div>
              <h3 className="font-bold text-white mb-1">{feature.title}</h3>
              <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="flex items-center justify-center gap-2 text-purple-400"
        >
          <FaRocket className="animate-bounce" />
          <span className="font-medium">Launching Soon</span>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default PracticeCoding;
