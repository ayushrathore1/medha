import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../Common/Button';

const StudyTimer = () => {
  const [time, setTime] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isHidden, setIsHidden] = useState(() => {
    return localStorage.getItem("medha_timer_hidden") === "true";
  });
  const countRef = useRef(null);

  // Listen for storage changes (from icon button clicks)
  useEffect(() => {
    const handleStorageChange = () => {
      setIsHidden(localStorage.getItem("medha_timer_hidden") === "true");
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleStart = () => {
    setIsActive(true);
    setIsPaused(false);
    countRef.current = setInterval(() => {
      setTime((time) => time + 1);
    }, 1000);
  };

  const handlePause = () => {
    clearInterval(countRef.current);
    setIsPaused(true);
  };

  const handleResume = () => {
    setIsPaused(false);
    countRef.current = setInterval(() => {
      setTime((time) => time + 1);
    }, 1000);
  };

  const handleReset = () => {
    clearInterval(countRef.current);
    setIsActive(false);
    setIsPaused(false);
    setTime(0);
  };

  const handleHide = () => {
    localStorage.setItem("medha_timer_hidden", "true");
    setIsHidden(true);
    window.dispatchEvent(new Event('storage'));
  };

  const formatTime = (seconds) => {
    const getSeconds = `0${(seconds % 60)}`.slice(-2);
    const minutes = `${Math.floor(seconds / 60)}`;
    const getMinutes = `0${minutes % 60}`.slice(-2);
    const getHours = `0${Math.floor(seconds / 3600)}`.slice(-2);

    return `${getHours} : ${getMinutes} : ${getSeconds}`;
  };

  if (isHidden) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: "auto" }}
        exit={{ opacity: 0, height: 0 }}
        className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden"
      >
        <div className="relative flex flex-col items-center justify-center p-6">
          <button
            onClick={handleHide}
            className="absolute top-3 right-3 px-2 py-1 text-xs font-medium text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            Hide
          </button>

          <h3 className="text-sm font-semibold text-slate-500 mb-3 uppercase tracking-wider">
            Study Session Timer
          </h3>
          
          <div className="text-3xl font-mono font-bold mb-6 tracking-wider text-slate-800">
            {formatTime(time)}
          </div>
          
          <div className="flex gap-3">
            {!isActive && !isPaused ? (
              <Button onClick={handleStart} variant="primary" className="px-6">
                Start Session
              </Button>
            ) : (
              <>
                {isPaused ? (
                  <Button onClick={handleResume} variant="primary" className="px-5">
                    Resume
                  </Button>
                ) : (
                  <Button onClick={handlePause} variant="secondary" className="px-5">
                    Pause
                  </Button>
                )}
                <Button onClick={handleReset} variant="danger" className="px-5" style={{ backgroundColor: "rgba(239, 68, 68, 0.1)", color: "#ef4444" }}>
                  Reset
                </Button>
              </>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default StudyTimer;


