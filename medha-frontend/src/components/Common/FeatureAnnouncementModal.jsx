import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaChevronRight, FaChevronLeft } from 'react-icons/fa';
import Card from './Card';
import Button from './Button';

const slides = [
  {
    title: "Messaging Live",
    description: "Connect directly with admins. Have questions or feedback? Messaging is now fully operational!",
    image: "https://ik.imagekit.io/ayushrathore1/Medha/messages_ss",
  },
  {
    title: "AI Solutions for RTU Exams",
    description: "Stuck on a past year paper? Just click 'Medha, Solve it' on the RTU Exams page for instant detailed solutions.",
    image: "https://ik.imagekit.io/ayushrathore1/Medha/exam_question_solution",
  },
];

const FeatureAnnouncementModal = ({ isOpen, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showGotIt, setShowGotIt] = useState(false);

  // Auto-scroll logic
  useEffect(() => {
    if (!isOpen) return;
    
    // Reset button state when opening or changing slides
    if (currentIndex !== slides.length - 1) {
        setShowGotIt(false);
    } else {
        // If it's the last slide, wait 2.5 seconds before showing the button
        const timer = setTimeout(() => {
            setShowGotIt(true);
        }, 2500);
        return () => clearTimeout(timer);
    }

    const interval = setInterval(() => {
        // Stop auto-scrolling if we are at the last slide to let user read and see the button
        if (currentIndex === slides.length - 1) return;
        setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 4000); 

    return () => clearInterval(interval);
  }, [isOpen, currentIndex]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="w-full max-w-2xl"
        >
          <Card className="relative overflow-hidden border-2 shadow-2xl p-0" style={{ borderColor: "var(--accent-secondary)" }}>
            {/* Close Button */}
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-black/20 hover:bg-black/40 text-white transition-colors z-20"
              aria-label="Close"
            >
              <FaTimes />
            </button>

            <div className="flex flex-col h-[500px]" style={{ backgroundColor: "var(--bg-card)" }}>
              {/* Carousel Content */}
              <div className="relative flex-1 overflow-hidden" style={{ backgroundColor: "var(--bg-secondary)" }}>
                <AnimatePresence mode='wait'>
                  <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.5 }}
                    className="absolute inset-0 flex flex-col"
                  >
                    {/* Image Area */}
                    <div className="h-3/5 w-full relative bg-gray-100 dark:bg-gray-800">
                       <img 
                        src={slides[currentIndex].image} 
                        alt={slides[currentIndex].title}
                        className="w-full h-full object-cover object-top"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-secondary)] to-transparent opacity-90"></div>
                    </div>

                    {/* Text Area */}
                    <div className="h-2/5 p-8 flex flex-col justify-center items-center text-center" style={{ backgroundColor: "var(--bg-secondary)" }}>
                      <h2 className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-[var(--action-primary)] to-[var(--accent-primary)] bg-clip-text text-transparent mb-3">
                        {slides[currentIndex].title}
                      </h2>
                      <p className="max-w-lg" style={{ color: "var(--text-secondary)" }}>
                        {slides[currentIndex].description}
                      </p>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Footer / Controls */}
              <div className="p-6 border-t flex flex-col gap-4 h-[100px] justify-center" style={{ backgroundColor: "var(--bg-primary)", borderColor: "var(--border-color)" }}>
                {/* Dots */}
                <div className="flex justify-center gap-2">
                  {slides.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentIndex(idx)}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        idx === currentIndex ? "w-8" : "w-2 opacity-50 hover:opacity-100"
                      }`}
                      style={{ 
                        backgroundColor: idx === currentIndex ? "var(--action-primary)" : "var(--text-secondary)" 
                      }}
                    />
                  ))}
                </div>

                <div className="flex justify-center h-[40px]">
                  <AnimatePresence>
                    {showGotIt && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                        >
                            <Button onClick={onClose} variant="primary" size="large" className="px-12 py-2">
                                Got it!
                            </Button>
                        </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default FeatureAnnouncementModal;
