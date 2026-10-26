/**
 * ThemeSetupPrompt - Premium prompt for theme customization
 * Shows on first login to guide users to personalize their experience
 */
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaPalette, FaImage, FaArrowRight } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';

const ThemeSetupPrompt = () => {
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    // Check if user has seen this prompt before
    const hasSeenPrompt = localStorage.getItem('medha-theme-prompt-seen');
    const isLoggedIn = localStorage.getItem('token');
    
    // Show prompt only for logged-in users who haven't seen it
    if (isLoggedIn && !hasSeenPrompt) {
      // Delay to not interrupt initial page load
      const timer = setTimeout(() => setIsVisible(true), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    localStorage.setItem('medha-theme-prompt-seen', 'true');
  };

  const handleCustomize = () => {
    handleClose();
    navigate('/profile?tab=appearance');
  };

  const handleQuickTheme = (selectedTheme) => {
    setTheme(selectedTheme);
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[99999] flex items-center justify-center p-4"
        style={{ background: 'rgba(0, 0, 0, 0.7)', backdropFilter: 'blur(10px)' }}
        onClick={handleClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-md bg-[var(--bg-primary)] border border-[var(--border-default)] rounded-3xl shadow-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Decorative gradient top */}
          <div className="h-1.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />
          
          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-2 text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] rounded-full transition-colors"
          >
            <FaTimes size={18} />
          </button>

          {/* Content */}
          <div className="p-8 text-center">
            {/* Icon */}
            <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 flex items-center justify-center">
              <FaPalette className="text-purple-400" size={28} />
            </div>

            {/* Title */}
            <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-2">
              Make Medha Yours ✨
            </h2>
            <p className="text-[var(--text-secondary)] text-sm mb-8">
              Customize your learning experience with themes, wallpapers, and more.
            </p>

            {/* Quick Theme Selection */}
            <div className="mb-8">
              <p className="text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wider mb-4">
                Quick Theme Selection
              </p>
              <div className="grid grid-cols-4 gap-3">
                {[
                  { id: 'dark', label: 'Dark', color: '#1a1a1a', text: '#fff' },
                  { id: 'light', label: 'Light', color: '#ffffff', text: '#000' },
                  { id: 'midnight', label: 'Midnight', color: '#0f172a', text: '#818cf8' },
                  { id: 'forest', label: 'Forest', color: '#064e3b', text: '#34d399' },
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => handleQuickTheme(t.id)}
                    className={`p-3 rounded-xl border-2 transition-all ${
                      theme === t.id 
                        ? 'border-[var(--action-primary)] scale-105' 
                        : 'border-[var(--border-default)] hover:border-[var(--border-hover)]'
                    }`}
                    style={{ background: t.color }}
                  >
                    <div className="text-xs font-bold" style={{ color: t.text }}>
                      {t.label}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col gap-3">
              <button
                onClick={handleCustomize}
                className="w-full py-3 px-6 bg-gradient-to-r from-[var(--action-primary)] to-[var(--action-hover)] text-white font-semibold rounded-xl hover:shadow-lg hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
              >
                <FaImage size={14} />
                Customize Fully
                <FaArrowRight size={12} />
              </button>
              <button
                onClick={handleClose}
                className="w-full py-3 px-6 bg-[var(--bg-secondary)] text-[var(--text-secondary)] font-medium rounded-xl hover:bg-[var(--bg-tertiary)] transition-colors"
              >
                Maybe Later
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ThemeSetupPrompt;
