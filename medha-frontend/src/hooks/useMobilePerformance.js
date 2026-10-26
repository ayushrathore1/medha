import { useState, useEffect } from 'react';

/**
 * Hook to detect mobile devices and performance preferences
 * Used to disable heavy animations and effects on low-powered devices
 */
export const useMobilePerformance = () => {
  const [state, setState] = useState({
    isMobile: false,
    isTouchDevice: false,
    prefersReducedMotion: false,
  });

  useEffect(() => {
    // Check for touch device (mobile/tablet)
    const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;
    
    // Check for mobile screen size
    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    setState({
      isMobile,
      isTouchDevice,
      prefersReducedMotion,
    });

    // Listen for screen size changes
    const mobileQuery = window.matchMedia('(max-width: 768px)');
    const handleChange = (e) => {
      setState(prev => ({ ...prev, isMobile: e.matches }));
    };
    
    mobileQuery.addEventListener('change', handleChange);
    return () => mobileQuery.removeEventListener('change', handleChange);
  }, []);

  return {
    ...state,
    // Derived helpers
    shouldReduceAnimations: state.isMobile || state.prefersReducedMotion,
    shouldDisableCursor: state.isTouchDevice,
    shouldUseSimplifiedBackgrounds: state.isMobile,
  };
};

export default useMobilePerformance;
