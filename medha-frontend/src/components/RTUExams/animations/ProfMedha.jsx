/**
 * ProfMedha - Animated Teacher Character Component
 * A semi-realistic 2.5D teacher that points, gestures, and guides students
 */
import React from 'react';
import { motion } from 'framer-motion';

// Teacher poses and expressions
const POSES = {
  idle: 'idle',
  pointing: 'pointing',
  thinking: 'thinking',
  explaining: 'explaining',
  frustrated: 'frustrated',
  happy: 'happy',
  presenting: 'presenting',
  writing: 'writing',
};

/**
 * Prof. Medha - The animated teacher character
 * @param {string} pose - Current pose (idle, pointing, thinking, etc.)
 * @param {string} position - Position on screen (left, center, right)
 * @param {boolean} flipped - Mirror the character
 * @param {number} scale - Size multiplier
 * @param {React.ReactNode} speechBubble - Optional speech content
 */
const ProfMedha = ({ 
  pose = 'idle', 
  position = 'left',
  flipped = false,
  scale = 1,
  speechBubble = null,
  className = '',
}) => {
  // Position styles
  const positionStyles = {
    left: { left: '5%', bottom: '10%' },
    center: { left: '50%', bottom: '10%', transform: 'translateX(-50%)' },
    right: { right: '5%', bottom: '10%' },
  };

  // Arm animations based on pose
  const getArmAnimation = () => {
    switch (pose) {
      case 'pointing':
        return { rotate: -45, x: 20 };
      case 'explaining':
        return { rotate: [-20, -30, -20], transition: { duration: 1.5, repeat: Infinity } };
      case 'frustrated':
        return { rotate: 0, y: -10 };
      case 'presenting':
        return { rotate: -60, x: 30 };
      case 'writing':
        return { rotate: -30, x: 15 };
      default:
        return { rotate: 0 };
    }
  };

  // Head animations based on pose
  const getHeadAnimation = () => {
    switch (pose) {
      case 'thinking':
        return { rotate: [0, 5, 0], transition: { duration: 2, repeat: Infinity } };
      case 'frustrated':
        return { y: [0, -5, 0], transition: { duration: 0.3, repeat: 2 } };
      case 'happy':
        return { scale: [1, 1.05, 1], transition: { duration: 0.5 } };
      default:
        return {};
    }
  };

  // Colors
  const colors = {
    skin: '#e8beac',
    hair: '#2c1810',
    blazer: '#1e3a5f',
    shirt: '#f5f5f5',
    pants: '#2d2d2d',
    glasses: '#333',
    highlight: '#6366f1',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      style={{
        position: 'absolute',
        ...positionStyles[position],
        transform: `scale(${scale}) ${flipped ? 'scaleX(-1)' : ''}`,
        transformOrigin: 'bottom center',
        zIndex: 50,
      }}
      className={className}
    >
      {/* Speech Bubble */}
      {speechBubble && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          style={{
            position: 'absolute',
            bottom: '100%',
            left: flipped ? 'auto' : '50%',
            right: flipped ? '50%' : 'auto',
            transform: flipped ? 'translateX(50%)' : 'translateX(-50%)',
            marginBottom: '10px',
            background: 'white',
            borderRadius: '16px',
            padding: '12px 18px',
            maxWidth: '250px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
            fontSize: '14px',
            color: '#1e293b',
            fontWeight: 500,
            textAlign: 'center',
          }}
        >
          {speechBubble}
          {/* Speech bubble tail */}
          <div style={{
            position: 'absolute',
            bottom: '-8px',
            left: '50%',
            transform: 'translateX(-50%) rotate(45deg)',
            width: '16px',
            height: '16px',
            background: 'white',
          }} />
        </motion.div>
      )}

      {/* Character SVG */}
      <svg 
        width={120 * scale} 
        height={180 * scale} 
        viewBox="0 0 120 180"
        style={{ overflow: 'visible' }}
      >
        {/* Body/Blazer */}
        <motion.g>
          {/* Torso */}
          <path
            d="M35 75 Q30 85 32 120 L88 120 Q90 85 85 75 Q60 70 35 75"
            fill={colors.blazer}
          />
          {/* Shirt collar */}
          <path
            d="M50 75 L60 90 L70 75"
            fill={colors.shirt}
            stroke={colors.shirt}
            strokeWidth="2"
          />
          {/* Blazer lapels */}
          <path
            d="M48 75 L55 95 L50 95 L42 80"
            fill="#152a45"
          />
          <path
            d="M72 75 L65 95 L70 95 L78 80"
            fill="#152a45"
          />
        </motion.g>

        {/* Left Arm (pointing arm) */}
        <motion.g
          animate={getArmAnimation()}
          style={{ originX: '35px', originY: '85px' }}
        >
          <path
            d="M35 80 Q20 90 15 110 Q12 115 18 118 L25 115 Q28 105 40 95"
            fill={colors.blazer}
          />
          {/* Hand */}
          <ellipse cx="16" cy="116" rx="8" ry="6" fill={colors.skin} />
          {/* Pointing finger */}
          {(pose === 'pointing' || pose === 'presenting') && (
            <motion.line
              x1="10" y1="114"
              x2="-5" y2="108"
              stroke={colors.skin}
              strokeWidth="4"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
            />
          )}
        </motion.g>

        {/* Right Arm */}
        <motion.g>
          <path
            d="M85 80 Q100 90 105 110 Q108 115 102 118 L95 115 Q92 105 80 95"
            fill={colors.blazer}
          />
          <ellipse cx="104" cy="116" rx="8" ry="6" fill={colors.skin} />
        </motion.g>

        {/* Neck */}
        <rect x="52" y="65" width="16" height="15" fill={colors.skin} rx="3" />

        {/* Head */}
        <motion.g animate={getHeadAnimation()}>
          {/* Face */}
          <ellipse cx="60" cy="45" rx="28" ry="32" fill={colors.skin} />
          
          {/* Hair */}
          <path
            d="M32 40 Q30 20 45 12 Q60 5 75 12 Q90 20 88 40 Q85 35 75 32 Q60 28 45 32 Q35 35 32 40"
            fill={colors.hair}
          />
          {/* Messy hair detail */}
          <path
            d="M40 18 Q42 10 50 12"
            stroke={colors.hair}
            strokeWidth="3"
            fill="none"
          />
          <path
            d="M70 15 Q75 8 80 12"
            stroke={colors.hair}
            strokeWidth="3"
            fill="none"
          />

          {/* Eyebrows */}
          <motion.path
            d="M42 35 Q48 32 54 35"
            stroke="#1a0f0a"
            strokeWidth="2"
            fill="none"
            animate={pose === 'frustrated' ? { d: "M42 32 Q48 35 54 32" } : {}}
          />
          <motion.path
            d="M66 35 Q72 32 78 35"
            stroke="#1a0f0a"
            strokeWidth="2"
            fill="none"
            animate={pose === 'frustrated' ? { d: "M66 32 Q72 35 78 32" } : {}}
          />

          {/* Eyes */}
          <ellipse cx="48" cy="42" rx="5" ry="4" fill="white" />
          <ellipse cx="72" cy="42" rx="5" ry="4" fill="white" />
          <motion.circle 
            cx="48" cy="42" r="2.5" fill="#1a0f0a"
            animate={pose === 'thinking' ? { cx: 50 } : {}}
          />
          <motion.circle 
            cx="72" cy="42" r="2.5" fill="#1a0f0a"
            animate={pose === 'thinking' ? { cx: 74 } : {}}
          />

          {/* Glasses */}
          <rect x="40" y="38" width="18" height="12" rx="3" fill="none" stroke={colors.glasses} strokeWidth="1.5" />
          <rect x="62" y="38" width="18" height="12" rx="3" fill="none" stroke={colors.glasses} strokeWidth="1.5" />
          <line x1="58" y1="44" x2="62" y2="44" stroke={colors.glasses} strokeWidth="1.5" />

          {/* Nose */}
          <path d="M58 48 Q60 52 62 48" stroke="#d4a090" strokeWidth="1.5" fill="none" />

          {/* Mouth */}
          <motion.path
            d="M52 58 Q60 62 68 58"
            stroke="#c47d6d"
            strokeWidth="2"
            fill="none"
            animate={
              pose === 'happy' ? { d: "M50 56 Q60 66 70 56" } :
              pose === 'frustrated' ? { d: "M52 60 Q60 56 68 60" } :
              {}
            }
          />
        </motion.g>

        {/* Legs */}
        <rect x="40" y="120" width="18" height="55" fill={colors.pants} rx="5" />
        <rect x="62" y="120" width="18" height="55" fill={colors.pants} rx="5" />

        {/* Shoes */}
        <ellipse cx="49" cy="178" rx="12" ry="5" fill="#1a1a1a" />
        <ellipse cx="71" cy="178" rx="12" ry="5" fill="#1a1a1a" />

        {/* Laser pointer in hand (when presenting/pointing) */}
        {(pose === 'pointing' || pose === 'presenting') && (
          <motion.g
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <rect x="2" y="110" width="20" height="5" rx="2" fill="#333" transform="rotate(-15 12 112)" />
            <motion.circle
              cx="-5"
              cy="105"
              r="3"
              fill="#ef4444"
              animate={{ 
                opacity: [0.5, 1, 0.5],
                scale: [1, 1.2, 1],
              }}
              transition={{ duration: 0.5, repeat: Infinity }}
            />
          </motion.g>
        )}
      </svg>
    </motion.div>
  );
};

// Export poses for easy reference
ProfMedha.POSES = POSES;

export default ProfMedha;
