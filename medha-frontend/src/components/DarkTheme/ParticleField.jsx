import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

// Floating Particles Background
const ParticleField = ({ count = 50 }) => {
  // Disable on mobile/touch devices for performance
  const [isMobile, setIsMobile] = useState(true); // Default to true to avoid flash
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(
        window.matchMedia('(max-width: 768px)').matches ||
        window.matchMedia('(pointer: coarse)').matches ||
        window.matchMedia('(prefers-reduced-motion: reduce)').matches
      );
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Don't render on mobile - too heavy
  if (isMobile) return null;

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {[...Array(count)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-blue-400/30 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, Math.random() * 20 - 10, 0],
            opacity: [0.3, 0.8, 0.3],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 3 + Math.random() * 4,
            repeat: Infinity,
            delay: Math.random() * 5,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

// Connecting Lines Between Particles
export const ConnectedParticles = ({ count = 30 }) => {
  const particles = [...Array(count)].map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: 2 + Math.random() * 3,
  }));

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      <svg className="w-full h-full opacity-20">
        {particles.map((p, i) => 
          particles.slice(i + 1, i + 4).map((p2, j) => (
            <motion.line
              key={`${i}-${j}`}
              x1={`${p.x}%`}
              y1={`${p.y}%`}
              x2={`${p2.x}%`}
              y2={`${p2.y}%`}
              stroke="rgba(59, 130, 246, 0.3)"
              strokeWidth="0.5"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: [0, 1, 0] }}
              transition={{
                duration: 8,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))
        )}
        {particles.map((p) => (
          <motion.circle
            key={p.id}
            cx={`${p.x}%`}
            cy={`${p.y}%`}
            r={p.size}
            fill="rgba(59, 130, 246, 0.5)"
            animate={{
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: p.id * 0.1,
            }}
          />
        ))}
      </svg>
    </div>
  );
};

// Glowing Orbs Background
export const GlowingOrbs = () => {
  const [isMobile, setIsMobile] = useState(true);
  
  useEffect(() => {
    setIsMobile(
      window.matchMedia('(max-width: 768px)').matches ||
      window.matchMedia('(pointer: coarse)').matches
    );
  }, []);

  if (isMobile) return null;

  const orbs = [
    { x: 20, y: 30, size: 300, color: "rgba(59, 130, 246, 0.15)", duration: 8 },
    { x: 70, y: 60, size: 250, color: "rgba(139, 92, 246, 0.15)", duration: 10 },
    { x: 40, y: 80, size: 200, color: "rgba(6, 182, 212, 0.12)", duration: 12 },
  ];

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {orbs.map((orb, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full blur-[100px]"
          style={{
            left: `${orb.x}%`,
            top: `${orb.y}%`,
            width: orb.size,
            height: orb.size,
            background: orb.color,
            transform: 'translate(-50%, -50%)',
          }}
          animate={{
            x: [0, 50, -30, 0],
            y: [0, -30, 50, 0],
            scale: [1, 1.2, 0.9, 1],
          }}
          transition={{
            duration: orb.duration,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

export default ParticleField;
