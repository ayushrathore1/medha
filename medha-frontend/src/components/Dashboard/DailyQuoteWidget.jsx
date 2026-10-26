import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { FaQuoteLeft, FaQuoteRight } from "react-icons/fa6";

const DailyQuoteWidget = () => {
  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isHidden, setIsHidden] = useState(() => {
    return localStorage.getItem("medha_quote_hidden") === "true";
  });

  useEffect(() => {
    fetchQuote();
  }, []);

  const fetchQuote = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/dashboard/quote`
      );
      setQuote(res.data);
    } catch (error) {
      console.error("Error fetching daily quote:", error);
      setQuote({
        quote: "The beautiful thing about learning is that no one can take it away from you.",
        author: "B.B. King",
        source: null,
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleVisibility = () => {
    const newState = !isHidden;
    setIsHidden(newState);
    localStorage.setItem("medha_quote_hidden", newState.toString());
  };

  if (loading) {
    return (
      <div className="w-full py-4 flex justify-center">
        <div className="animate-pulse flex items-center gap-3">
          <div className="w-6 h-6 bg-slate-200 rounded"></div>
          <div className="h-4 bg-slate-200 rounded w-64"></div>
        </div>
      </div>
    );
  }

  if (!quote) return null;

  // Show compact button when hidden
  if (isHidden) {
    return (
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        onClick={toggleVisibility}
        className="w-full mb-4 py-2 px-4 flex items-center justify-center gap-2 bg-[var(--action-primary)]/10 hover:bg-[var(--action-primary)]/20 text-[var(--action-primary)] rounded-xl border border-[var(--action-primary)]/20 transition-colors text-sm font-medium"
      >
        <FaQuoteRight size={12} />
        Show Daily Quote
      </motion.button>
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10, height: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full mb-6"
      >
        <div className="relative px-6 py-5 bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-default)] shadow-sm overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[var(--action-primary)]/10 to-[var(--accent-secondary)]/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-[var(--accent-secondary)]/10 to-[var(--action-primary)]/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2"></div>
          
          <button
            onClick={toggleVisibility}
            className="absolute top-3 right-3 px-2 py-1 text-xs font-medium text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] rounded-lg transition-colors z-10"
          >
            Hide
          </button>
          
          <div className="relative flex items-start gap-4 pr-6">
            <div className="flex-shrink-0 p-3 bg-gradient-to-br from-[var(--gradient-start)] to-[var(--gradient-end)] rounded-xl shadow-lg shadow-[var(--action-primary)]/20">
              <FaQuoteLeft className="text-white text-lg" />
            </div>
            
            <div className="flex-1 min-w-0">
              <p className="text-[var(--text-primary)] font-medium text-base md:text-lg leading-relaxed italic">
                "{quote.quote}"
              </p>
              <div className="mt-2 flex items-center gap-2">
                <span className="text-sm font-bold text-[var(--action-primary)]">
                  — {quote.author}
                </span>
                {quote.source && (
                  <span className="text-xs text-[var(--text-tertiary)] font-medium">
                    ({quote.source})
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default DailyQuoteWidget;


