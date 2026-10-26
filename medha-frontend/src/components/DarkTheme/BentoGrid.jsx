import React from "react";
import { motion } from "framer-motion";

const BentoGrid = ({ children, className = "" }) => {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 ${className}`}>
      {children}
    </div>
  );
};

export const BentoCard = ({ 
  children, 
  className = "", 
  colSpan = 1, 
  rowSpan = 1,
  gradient = "from-blue-500/10 to-violet-500/10",
  hoverGradient = "from-blue-500/20 to-violet-500/20"
}) => {
  const colSpanClass = {
    1: "md:col-span-1",
    2: "md:col-span-2",
    3: "md:col-span-3",
  };
  
  const rowSpanClass = {
    1: "md:row-span-1",
    2: "md:row-span-2",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
      className={`
        relative group overflow-hidden rounded-3xl
        ${colSpanClass[colSpan]} ${rowSpanClass[rowSpan]}
        bg-gradient-to-br ${gradient}
        border border-white/10
        backdrop-blur-sm
        p-6 md:p-8
        ${className}
      `}
    >
      {/* Hover gradient overlay */}
      <div 
        className={`
          absolute inset-0 opacity-0 group-hover:opacity-100
          bg-gradient-to-br ${hoverGradient}
          transition-opacity duration-500
        `}
      />
      
      {/* Shine effect */}
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.1) 45%, transparent 50%)',
          animation: 'shine 3s ease-in-out infinite',
        }}
      />
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>

      <style>{`
        @keyframes shine {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </motion.div>
  );
};

export const BentoCardIcon = ({ children, className = "" }) => (
  <div className={`w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center mb-4 ${className}`}>
    {children}
  </div>
);

export const BentoCardTitle = ({ children, className = "" }) => (
  <h3 className={`text-xl md:text-2xl font-bold text-white mb-2 ${className}`}>
    {children}
  </h3>
);

export const BentoCardDescription = ({ children, className = "" }) => (
  <p className={`text-slate-300 text-sm md:text-base leading-relaxed ${className}`}>
    {children}
  </p>
);

export default BentoGrid;
