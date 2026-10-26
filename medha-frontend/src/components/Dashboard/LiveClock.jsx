import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const LiveClock = () => {
  const [time, setTime] = useState(new Date());
  const [isHidden, setIsHidden] = useState(() => {
    return localStorage.getItem("medha_clock_hidden") === "true";
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Listen for storage changes (from icon button clicks)
  useEffect(() => {
    const handleStorageChange = () => {
      setIsHidden(localStorage.getItem("medha_clock_hidden") === "true");
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleHide = () => {
    localStorage.setItem("medha_clock_hidden", "true");
    setIsHidden(true);
    window.dispatchEvent(new Event('storage'));
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

          <h3 className="text-sm font-semibold text-slate-500 mb-2 uppercase tracking-wider">
            Current Time (IST)
          </h3>
          <div className="text-3xl font-bold tracking-wider text-indigo-600">
            {time.toLocaleTimeString('en-IN', { 
              timeZone: 'Asia/Kolkata',
              hour12: true,
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit'
            })}
          </div>
          <div className="text-sm mt-2 text-slate-500">
            {time.toLocaleDateString('en-IN', { 
              timeZone: 'Asia/Kolkata',
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default LiveClock;


