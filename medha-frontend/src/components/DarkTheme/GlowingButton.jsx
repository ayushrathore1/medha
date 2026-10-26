import React from "react";
import { motion } from "framer-motion";

const GlowingButton = ({ 
  children, 
  onClick, 
  className = "", 
  variant = "primary",
  size = "lg"
}) => {
  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-10 py-5 text-lg",
    xl: "px-12 py-6 text-xl"
  };

  const variants = {
    primary: {
      bg: "bg-gradient-to-r from-blue-600 to-violet-600",
      glow: "from-blue-500 via-violet-500 to-blue-500",
      shadow: "shadow-blue-500/25"
    },
    secondary: {
      bg: "bg-gradient-to-r from-slate-700 to-slate-800",
      glow: "from-slate-400 via-slate-300 to-slate-400",
      shadow: "shadow-slate-500/25"
    },
    accent: {
      bg: "bg-gradient-to-r from-emerald-600 to-cyan-600",
      glow: "from-emerald-500 via-cyan-500 to-emerald-500",
      shadow: "shadow-emerald-500/25"
    }
  };

  const v = variants[variant];

  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.98 }}
      className={`
        relative group overflow-hidden rounded-2xl font-bold
        ${sizes[size]}
        ${v.bg}
        ${v.shadow}
        shadow-lg
        text-white
        ${className}
      `}
    >
      {/* Animated border gradient */}
      <span 
        className={`
          absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100
          transition-opacity duration-500
        `}
        style={{
          background: `linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)`,
          animation: 'shimmer 2s infinite',
        }}
      />
      
      {/* Glow effect on hover */}
      <span 
        className={`
          absolute -inset-1 rounded-2xl blur-xl opacity-0 group-hover:opacity-50
          bg-gradient-to-r ${v.glow}
          transition-opacity duration-500 -z-10
        `}
      />
      
      {/* Content */}
      <span className="relative z-10 flex items-center justify-center gap-3">
        {children}
      </span>

      <style>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </motion.button>
  );
};

export default GlowingButton;
