import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Skeleton } from "@/components/UI/skeleton";
import "./Loader.css";

const motivationalQuotes = [
  "Stay focused, you're one step closer!",
  "Learning is a journey, enjoy the ride.",
  "Every expert was once a beginner.",
  "Believe you can and you're halfway there.",
  "Small progress is still progress.",
  "Your potential is endless.",
];

const LETTER_COLORS = [
  "#1BA34A",
  "#C6D93B",
  "#FF8A1A",
  "#E30613",
  "#22D3EE",
  "#D946EF",
  "#34D399",
  "#FACC15",
  "#7C3AED",
  "#FB7185",
  "#60A5FA",
  "#A3E635",
  "#38BDF8",
];

const LetterRow = ({ text, start = 0 }) => (
  <span className="medha-loader-row">
    {[...text].map((character, index) => (
      <span
        key={`${text}-${index}`}
        className="medha-loader-letter"
        style={{
          "--i": start + index,
          "--c": LETTER_COLORS[(start + index) % LETTER_COLORS.length],
        }}
      >
        {character}
      </span>
    ))}
  </span>
);

const Loader = ({ fullScreen = false }) => {
  const [quoteIndex, setQuoteIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % motivationalQuotes.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`medha-loader${fullScreen ? " is-full" : ""}`} role="status" aria-live="polite">
      <div className="medha-loader-mark" aria-hidden="true">
        <span className="medha-loader-orb medha-loader-orb-a" />
        <span className="medha-loader-orb medha-loader-orb-b" />
        <span className="medha-loader-orb medha-loader-orb-c" />
        <span className="medha-loader-orbit" />
        <span className="medha-loader-name">
          <LetterRow text="Medha" />
          <LetterRow text="Revision" start={5} />
        </span>
      </div>

      <p className="medha-loader-by">
        By{" "}
        <span className="medha-loader-ck">
          <span className="medha-loader-campus">campus</span>
          <span className="medha-loader-kart">kart</span>
          <span className="medha-loader-dot" />
        </span>
      </p>

      <div className="medha-loader-bar" aria-hidden="true">
        <span />
      </div>

      <div className="medha-loader-quote">
        <AnimatePresence mode="wait">
          <motion.p
            key={quoteIndex}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.4 }}
          >
            {motivationalQuotes[quoteIndex]}
          </motion.p>
        </AnimatePresence>
      </div>
      <span className="sr-only">Loading Medha Revision</span>
    </div>
  );
};

const ContentSkeleton = ({ rows = 3, className = "" }) => (
  <div className={`space-y-4 ${className}`}>
    <Skeleton className="h-8 w-3/4 bg-muted" />
    {[...Array(rows)].map((_, i) => (
      <Skeleton key={i} className="h-4 w-full bg-muted" />
    ))}
    <Skeleton className="h-4 w-1/2 bg-muted" />
  </div>
);

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
