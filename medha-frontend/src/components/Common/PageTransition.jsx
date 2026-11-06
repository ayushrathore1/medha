import React from "react";
import { motion, useReducedMotion } from "framer-motion";

const pageVariants = {
  initial: { opacity: 0, y: 10 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -6 },
};

/** Soft transition for auth/legal pages. Primary tab routes should skip this. */
const PageTransition = ({ children, className = "", enabled = true }) => {
  const reduceMotion = useReducedMotion();

  if (!enabled || reduceMotion) {
    return <div className={`w-full h-full ${className}`}>{children}</div>;
  }

  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
      className={`w-full h-full ${className}`}
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;
