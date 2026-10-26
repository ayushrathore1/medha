// =============================================
// MEDHA — Framer Motion Animation Presets
// =============================================

export const fadeUp = {
  initial:     { y: 40, opacity: 0 },
  whileInView: { y: 0,  opacity: 1 },
  viewport:    { once: true, margin: '-60px' },
  transition:  { duration: 0.65, ease: [0.16, 1, 0.3, 1] }
};

export const fadeIn = {
  initial:     { opacity: 0 },
  whileInView: { opacity: 1 },
  viewport:    { once: true },
  transition:  { duration: 0.5, ease: 'easeOut' }
};

export const staggerParent = {
  initial: {},
  whileInView: { transition: { staggerChildren: 0.1 } },
  viewport:    { once: true, margin: '-60px' }
};

export const staggerChild = {
  initial:     { y: 40, opacity: 0 },
  whileInView: { y: 0,  opacity: 1 },
  transition:  { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
};

export const heroWord = (delay) => ({
  initial:    { y: 80, opacity: 0 },
  animate:    { y: 0,  opacity: 1 },
  transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1], delay }
});

export const heroCard = (delay) => ({
  initial:    { x: -40, y: 60, opacity: 0 },
  animate:    { x: 0,   y: 0,  opacity: 1 },
  transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1], delay }
});

export const cardHover = {
  whileHover: { scale: 1.025, y: -4 },
  transition: { type: 'spring', stiffness: 300, damping: 20 }
};
