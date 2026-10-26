import React from "react";
import { motion } from "framer-motion";

// Magnetic Button - follows cursor on hover
const MagneticButton = ({ children, className = "", strength = 0.3 }) => {
  const handleMouseMove = (e) => {
    const btn = e.currentTarget;
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    
    btn.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
  };

  const handleMouseLeave = (e) => {
    e.currentTarget.style.transform = 'translate(0, 0)';
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`transition-transform duration-200 ease-out ${className}`}
      whileTap={{ scale: 0.95 }}
    >
      {children}
    </motion.div>
  );
};

// Tilt Card - 3D tilt effect on hover
export const TiltCard = ({ children, className = "", maxTilt = 10 }) => {
  const handleMouseMove = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = ((y - centerY) / centerY) * -maxTilt;
    const rotateY = ((x - centerX) / centerX) * maxTilt;
    
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
  };

  const handleMouseLeave = (e) => {
    e.currentTarget.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`transition-transform duration-300 ease-out ${className}`}
      style={{ transformStyle: 'preserve-3d' }}
    >
      {children}
    </div>
  );
};

// Ripple Effect on Click
export const RippleButton = ({ children, className = "", onClick }) => {
  const createRipple = (e) => {
    const button = e.currentTarget;
    const circle = document.createElement("span");
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;
    
    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${e.clientX - button.getBoundingClientRect().left - radius}px`;
    circle.style.top = `${e.clientY - button.getBoundingClientRect().top - radius}px`;
    circle.classList.add("ripple");
    
    const existingRipple = button.querySelector(".ripple");
    if (existingRipple) existingRipple.remove();
    
    button.appendChild(circle);
    onClick && onClick(e);
  };

  return (
    <button
      onClick={createRipple}
      className={`relative overflow-hidden ${className}`}
    >
      {children}
      <style>{`
        .ripple {
          position: absolute;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.3);
          transform: scale(0);
          animation: ripple-animation 0.6s linear;
          pointer-events: none;
        }
        @keyframes ripple-animation {
          to {
            transform: scale(4);
            opacity: 0;
          }
        }
      `}</style>
    </button>
  );
};

// Hover Glow Card
export const HoverGlowCard = ({ children, className = "", glowColor = "rgba(59, 130, 246, 0.5)" }) => {
  return (
    <div className={`group relative ${className}`}>
      {/* Glow effect */}
      <div 
        className="absolute -inset-0.5 rounded-3xl opacity-0 group-hover:opacity-75 blur-xl transition-all duration-500"
        style={{ background: glowColor }}
      />
      {/* Card content */}
      <div className="relative bg-slate-900 border border-white/10 rounded-3xl overflow-hidden">
        {children}
      </div>
    </div>
  );
};

// Floating Animation Wrapper
export const FloatingElement = ({ children, className = "", duration = 3, distance = 10 }) => {
  return (
    <motion.div
      animate={{ 
        y: [0, -distance, 0],
      }}
      transition={{ 
        duration,
        repeat: Infinity,
        ease: "easeInOut"
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Pulse Ring Animation
export const PulseRing = ({ className = "", color = "rgba(59, 130, 246, 0.5)" }) => {
  return (
    <div className={`relative ${className}`}>
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="absolute inset-0 rounded-full"
          style={{
            border: `2px solid ${color}`,
            animation: `pulse-ring 2s ease-out infinite`,
            animationDelay: `${i * 0.4}s`,
          }}
        />
      ))}
      <style>{`
        @keyframes pulse-ring {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          100% {
            transform: scale(1.5);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default MagneticButton;
