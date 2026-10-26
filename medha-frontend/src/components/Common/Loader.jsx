import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Skeleton } from "@/components/UI/skeleton";

const motivationalQuotes = [
  "Stay focused, you're one step closer!",
  "Learning is a journey, enjoy the ride.",
  "Every expert was once a beginner.",
  "Believe you can and you're halfway there.",
  "Small progress is still progress.",
  "Your potential is endless.",
];

const Loader = ({ fullScreen = false }) => {
  const [quoteIndex, setQuoteIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % motivationalQuotes.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const containerClasses = fullScreen
    ? "fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm"
    : "flex flex-col items-center justify-center py-12";

  const letterVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        repeat: Infinity,
        repeatType: "reverse",
        repeatDelay: 2,
        duration: 0.6,
      },
    }),
  };

  const word = "MEDHA";

  return (
    <div className={containerClasses}>
      {/* Logo Animation */}
      <div className="flex space-x-1 mb-8">
        {word.split("").map((char, i) => (
          <motion.span
            key={i}
            custom={i}
            variants={letterVariants}
            initial="hidden"
            animate="visible"
            className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[var(--action-primary)] to-[var(--accent-secondary)]"
          >
            {char}
          </motion.span>
        ))}
      </div>

      {/* Motivational Quote */}
      <div className="h-8 relative w-full max-w-md text-center px-4">
        <AnimatePresence mode="wait">
          <motion.p
            key={quoteIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5 }}
            className="text-muted-foreground font-medium italic text-sm md:text-base absolute w-full left-0"
          >
            "{motivationalQuotes[quoteIndex]}"
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
};

/**
 * ContentSkeleton: A shadcn Skeleton-based placeholder for page content loading.
 * Use this for card/list loading states.
 */
const ContentSkeleton = ({ rows = 3, className = "" }) => (
  <div className={`space-y-4 ${className}`}>
    <Skeleton className="h-8 w-3/4 bg-muted" />
    {[...Array(rows)].map((_, i) => (
      <Skeleton key={i} className="h-4 w-full bg-muted" />
    ))}
    <Skeleton className="h-4 w-1/2 bg-muted" />
  </div>
);

/**
 * CardSkeleton: A card-shaped loading placeholder.
 */
const CardSkeleton = ({ className = "" }) => (
  <div className={`glass-card p-6 rounded-xl space-y-4 ${className}`}>
    <Skeleton className="h-6 w-1/2 bg-muted" />
    <Skeleton className="h-4 w-full bg-muted" />
    <Skeleton className="h-4 w-3/4 bg-muted" />
    <div className="flex gap-3 pt-2">
      <Skeleton className="h-10 w-24 bg-muted rounded-lg" />
      <Skeleton className="h-10 w-24 bg-muted rounded-lg" />
    </div>
  </div>
);

export default Loader;
export { ContentSkeleton, CardSkeleton };
