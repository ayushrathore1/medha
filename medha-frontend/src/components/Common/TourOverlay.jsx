import React, { useState, useEffect, useLayoutEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTour } from '../../context/TourContext';
import { ChevronRight, X } from 'lucide-react';

const TourOverlay = () => {
  const { isTourActive, currentStep, tourSteps, nextStep, skipTour, isTourEnabled } = useTour();
  const [highlightRect, setHighlightRect] = useState(null);

  // Early return if tour feature is disabled
  if (!isTourEnabled) return null;

  const step = tourSteps[currentStep];

  const findElement = useCallback(() => {
    if (!step?.target) return null;
    return document.querySelector(step.target);
  }, [step?.target]);

  useEffect(() => {
    if (!isTourActive || !step) return;

    let attempts = 0;
    const maxAttempts = 30;

    const tryFind = () => {
      // If targeting explore-folders, make sure the Explore tab is clicked first
      if (step.target === '[data-tour="explore-folders"]') {
        const exploreTab = document.querySelector('[data-tour="explore-tab"]');
        if (exploreTab && !exploreTab.classList.contains('bg-indigo-600')) {
          exploreTab.click();
          setTimeout(tryFind, 500);
          return;
        }
      }

      // RTU Exams: Auto-navigate through views
      if (step.target === '[data-tour="rtu-subjects"]') {
        // Click semester card if subjects view isn't visible
        const semesterCard = document.querySelector('[data-tour="rtu-semester"]');
        const subjectsView = document.querySelector('[data-tour="rtu-subjects"]');
        if (semesterCard && !subjectsView) {
          semesterCard.click();
          setTimeout(tryFind, 600);
          return;
        }
      }

      if (step.target === '[data-tour="rtu-years"]') {
        // Click first subject card if years view isn't visible
        const yearsView = document.querySelector('[data-tour="rtu-years"]');
        if (!yearsView) {
          const subjectsView = document.querySelector('[data-tour="rtu-subjects"]');
          if (subjectsView) {
            const firstSubjectCard = subjectsView.querySelector('.cursor-pointer');
            if (firstSubjectCard) {
              firstSubjectCard.click();
              setTimeout(tryFind, 600);
              return;
            }
          }
        }
      }

      if (step.target === '[data-tour="rtu-weightage"]') {
        // Click first year card if weightage view isn't visible
        const weightageView = document.querySelector('[data-tour="rtu-weightage"]');
        if (!weightageView) {
          const yearsView = document.querySelector('[data-tour="rtu-years"]');
          if (yearsView) {
            const firstYearCard = yearsView.querySelector('.cursor-pointer');
            if (firstYearCard) {
              firstYearCard.click();
              setTimeout(tryFind, 600);
              return;
            }
          }
        }
      }

      const element = findElement();
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setTimeout(() => {
          const rect = element.getBoundingClientRect();
          setHighlightRect({
            top: rect.top,
            left: rect.left,
            width: rect.width,
            height: rect.height,
          });
        }, 350);
      } else if (attempts < maxAttempts) {
        attempts++;
        setTimeout(tryFind, 200);
      } else {
        // Fallback: center of screen
        setHighlightRect({
          top: window.innerHeight / 2 - 50,
          left: window.innerWidth / 2 - 100,
          width: 200,
          height: 100,
        });
      }
    };

    tryFind();

    const handleResize = () => {
      const element = findElement();
      if (element) {
        const rect = element.getBoundingClientRect();
        setHighlightRect({
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height,
        });
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [isTourActive, currentStep, step?.target, findElement]);

  // Disable body scroll and block interactions while tour is active
  useEffect(() => {
    if (isTourActive) {
      // Disable body scroll
      document.body.style.overflow = 'hidden';
      
      // Block all wheel/touch scroll attempts
      const blockScroll = (e) => {
        // Allow scrolling only within the tooltip
        if (e.target.closest('.tour-tooltip')) return;
        e.preventDefault();
      };
      
      window.addEventListener('wheel', blockScroll, { passive: false });
      window.addEventListener('touchmove', blockScroll, { passive: false });
      
      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('wheel', blockScroll);
        window.removeEventListener('touchmove', blockScroll);
      };
    }
  }, [isTourActive]);

  if (!isTourActive || !step) return null;

  // Default rect for initial render before element is found
  const rect = highlightRect || {
    top: window.innerHeight / 2 - 50,
    left: window.innerWidth / 2 - 100,
    width: 200,
    height: 100,
  };

  // Calculate tooltip position safely
  const tooltipWidth = 340;
  const tooltipHeight = 280;
  const padding = 24;

  let tooltipTop = rect.top + rect.height + padding;
  let tooltipLeft = rect.left + rect.width / 2 - tooltipWidth / 2;
  let arrowOnTop = true;

  // Adjust if off bottom
  if (tooltipTop + tooltipHeight > window.innerHeight - padding) {
    tooltipTop = rect.top - tooltipHeight - padding;
    arrowOnTop = false;
  }

  // Adjust if off top
  if (tooltipTop < padding) {
    tooltipTop = padding;
    arrowOnTop = true;
  }

  // Sanitize horizontal
  tooltipLeft = Math.min(Math.max(padding, tooltipLeft), window.innerWidth - tooltipWidth - padding);

  return (
    <div className="fixed inset-0 z-[9999] pointer-events-none">
      {/* SVG Mask for spotlight effect */}
      <svg className="absolute inset-0 w-full h-full">
        <defs>
          <mask id="spotlight-mask">
            <rect x="0" y="0" width="100%" height="100%" fill="white" />
            <motion.rect
              initial={false}
              animate={{
                x: rect.left - 16,
                y: rect.top - 16,
                width: rect.width + 32,
                height: rect.height + 32,
              }}
              transition={{ type: 'spring', damping: 22, stiffness: 180 }}
              rx="20"
              fill="black"
            />
          </mask>
        </defs>
        <rect
          x="0"
          y="0"
          width="100%"
          height="100%"
          fill="rgba(0, 0, 0, 0.75)"
          mask="url(#spotlight-mask)"
          className="pointer-events-auto"
        />
      </svg>

      {/* Tooltip - Always visible when tour is active */}
      <motion.div
        key={currentStep}
        initial={{ opacity: 0, y: 20 }}
        animate={{ 
          opacity: 1, 
          y: 0,
          top: tooltipTop,
          left: tooltipLeft
        }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300, delay: 0.1 }}
        className="tour-tooltip fixed w-[340px] bg-white rounded-3xl shadow-2xl p-6 pointer-events-auto border border-slate-200"
        style={{ 
          zIndex: 10000,
        }}
      >
        {/* Step Indicator */}
        <div className="flex justify-between items-center mb-4">
          <span className="text-xs font-bold text-indigo-600 bg-indigo-100 px-3 py-1.5 rounded-full uppercase tracking-wider">
            Step {currentStep + 1} of {tourSteps.length}
          </span>
          <button 
            onClick={skipTour}
            className="text-slate-400 hover:text-red-500 p-2 rounded-lg hover:bg-red-50 transition-colors"
            title="End Tutorial"
          >
            <X size={20} />
          </button>
        </div>

        <h3 className="text-xl font-black text-slate-900 mb-3">{step.title}</h3>
        <p className="text-slate-600 text-sm leading-relaxed mb-6">
          {step.content}
        </p>

        <div className="flex items-center gap-3">
          <button
            onClick={nextStep}
            className="flex-1 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-bold py-3 px-5 rounded-xl shadow-lg shadow-indigo-300 transition-all flex items-center justify-center gap-2 group"
          >
            {currentStep === tourSteps.length - 1 ? 'Finish Tour' : 'Next'}
            <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>
          <button
            onClick={skipTour}
            className="px-5 py-3 text-slate-500 font-bold text-sm hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-all border border-slate-200"
          >
            Skip
          </button>
        </div>

        {/* Pointer arrow */}
        <div 
          className={`absolute left-1/2 -translate-x-1/2 w-5 h-5 bg-white rotate-45 border-slate-200 ${
            arrowOnTop
              ? '-top-2.5 border-t border-l'
              : '-bottom-2.5 border-b border-r'
          }`}
        />
      </motion.div>
    </div>
  );
};

export default TourOverlay;
