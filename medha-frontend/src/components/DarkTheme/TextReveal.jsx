import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const TextReveal = ({ 
  text, 
  className = "",
  delay = 0,
  staggerChildren = 0.03,
  once = true
}) => {
  const words = text.split(" ");

  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { 
        staggerChildren: staggerChildren, 
        delayChildren: delay 
      },
    }),
  };

  const child = {
    hidden: {
      opacity: 0,
      y: 20,
      filter: "blur(10px)",
    },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
  };

  return (
    <motion.span
      className={`inline-flex flex-wrap ${className}`}
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once }}
    >
      {words.map((word, index) => (
        <motion.span
          key={index}
          variants={child}
          className="mr-[0.25em] inline-block"
        >
          {word}
        </motion.span>
      ))}
    </motion.span>
  );
};

// Gradient Sweep Text Reveal
export const GradientTextReveal = ({ 
  text, 
  className = "",
  gradient = "from-blue-400 via-violet-400 to-blue-400"
}) => {
  return (
    <span className={`relative inline-block ${className}`}>
      <span className="opacity-30">{text}</span>
      <motion.span
        className={`absolute inset-0 bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}
        initial={{ clipPath: "inset(0 100% 0 0)" }}
        whileInView={{ clipPath: "inset(0 0% 0 0)" }}
        viewport={{ once: true }}
        transition={{ duration: 1.5, ease: "easeOut", delay: 0.3 }}
      >
        {text}
      </motion.span>
    </span>
  );
};

// Typewriter Effect
export const TypewriterText = ({ 
  text, 
  className = "",
  speed = 50,
  delay = 0
}) => {
  const [displayedText, setDisplayedText] = useState("");
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const startTimeout = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(startTimeout);
  }, [delay]);

  useEffect(() => {
    if (!started) return;
    
    if (displayedText.length < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(text.slice(0, displayedText.length + 1));
      }, speed);
      return () => clearTimeout(timeout);
    }
  }, [displayedText, text, speed, started]);

  return (
    <span className={className}>
      {displayedText}
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
        className="inline-block w-[3px] h-[1em] bg-current ml-1 align-middle"
      />
    </span>
  );
};

export default TextReveal;
