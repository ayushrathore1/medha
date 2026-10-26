/**
 * CinematicIntro.jsx - Premium "Apple Style" Intro
 */
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CinematicIntro = ({ title, onComplete }) => {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    // Stage 1: Logo Reveal
    // Stage 2: Title Fade In
    // Stage 3: Exit - increased by 1 second
    const t1 = setTimeout(() => setStage(1), 700);
    const t2 = setTimeout(() => setStage(2), 2500);
    const t3 = setTimeout(() => {
      if (onComplete) onComplete();
    }, 4800);

    const handleKey = () => {
      if (onComplete) onComplete();
    };
    window.addEventListener('keydown', handleKey);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      window.removeEventListener('keydown', handleKey);
    };
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-[100000] flex items-center justify-center bg-black"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="relative z-10 text-center flex flex-col items-center">
        {/* MEDHA LOGO ANIMATION */}
        <motion.div
           initial={{ scale: 0.8, opacity: 0 }}
           animate={{ scale: stage >= 1 ? 1 : 0.8, opacity: stage >= 1 ? 1 : 0 }}
           transition={{ duration: 0.8, ease: "easeOut" }}
           className="mb-4 flex items-center justify-center overflow-hidden"
           style={{ height: '100px' }}
        >
           <img 
             src="https://ik.imagekit.io/ayushrathore1/MEDHA%20Revision%20Logo%20(5)/4.svg?updatedAt=1767677218648"
             alt="Medha Logo"
             className="drop-shadow-[0_0_60px_rgba(59,130,246,0.5)]"
             style={{
               height: '280px',
               marginTop: '-90px',
               marginBottom: '-90px',
             }}
           />
        </motion.div>

        {/* PRESENTS + TITLE */}
        <AnimatePresence>
          {stage >= 1 && (
             <motion.div
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.1, duration: 0.6 }}
             >
                <div className="text-gray-500 text-xs font-bold tracking-[0.3em] uppercase mb-4">Presents</div>
             </motion.div>
          )}
        </AnimatePresence>
        
        <AnimatePresence>
          {stage >= 2 && (
             <motion.h1
               initial={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
               animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
               transition={{ duration: 0.8, ease: "easeOut" }}
               className="text-5xl md:text-7xl landscape:text-4xl font-bold tracking-tight leading-none"
               style={{
                 background: 'linear-gradient(to bottom, #ffffff, #9ca3af)',
                 WebkitBackgroundClip: 'text',
                 WebkitTextFillColor: 'transparent',
                 backgroundClip: 'text',
               }}
             >
               {title}
             </motion.h1>
          )}
        </AnimatePresence>
      </div>

      {/* Cinematic Particles */}
      <div className="absolute inset-0 pointer-events-none">
         <motion.div 
            animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.1, 1] }}
            transition={{ duration: 5, repeat: Infinity }}
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-900/10 blur-[100px] rounded-full"
         />
      </div>
    </motion.div>
  );
};

export default CinematicIntro;
