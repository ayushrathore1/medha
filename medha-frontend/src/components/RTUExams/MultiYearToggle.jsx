import React from "react";
import { motion } from "framer-motion";
import { FaCalendarDays, FaCheck } from "react-icons/fa6";
import Loader from "../Common/Loader";

/**
 * MultiYearToggle — Pill-based multi-select year toggle bar
 * Users can toggle years on/off to see combined analysis.
 */
const MultiYearToggle = ({ years, selectedYears, onToggleYear, loading }) => {
  if (loading) {
    return <div className="flex justify-center py-6"><Loader /></div>;
  }

  if (!years || years.length === 0) {
    return (
      <div className="text-center py-12 px-8">
        <div className="flex justify-center mb-4 text-[var(--text-tertiary)] text-4xl">
          <FaCalendarDays />
        </div>
        <p className="text-lg font-bold text-[var(--text-secondary)]">
          No exam papers available for this subject yet.
        </p>
        <p className="text-[var(--text-tertiary)]">Check back later.</p>
      </div>
    );
  }

  const allSelected = selectedYears.length === years.length;

  return (
    <div className="w-full max-w-3xl mx-auto mb-6">
      <div className="flex flex-wrap items-center justify-center gap-3">
        {/* Select All pill */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            if (allSelected) {
              // Deselect all except first
              onToggleYear(years[0], true);
            } else {
              // Select all
              onToggleYear("all");
            }
          }}
          style={{
            padding: "8px 18px",
            borderRadius: 100,
            fontSize: 13,
            fontWeight: 700,
            border: allSelected
              ? "2px solid var(--action-primary)"
              : "2px solid var(--border-default)",
            background: allSelected
              ? "rgba(125,198,122,0.12)"
              : "var(--bg-secondary)",
            color: allSelected
              ? "var(--action-primary)"
              : "var(--text-tertiary)",
            cursor: "pointer",
            fontFamily: "inherit",
            transition: "all 0.2s ease",
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          {allSelected && <FaCheck size={10} />}
          All Years
        </motion.button>

        {/* Divider */}
        <div
          style={{
            width: 1,
            height: 28,
            background: "var(--border-default)",
          }}
        />

        {/* Individual year pills */}
        {years.map((year, index) => {
          const isActive = selectedYears.includes(year);
          return (
            <motion.button
              key={year}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              onClick={() => onToggleYear(year)}
              style={{
                padding: "8px 22px",
                borderRadius: 100,
                fontSize: 15,
                fontWeight: 800,
                border: isActive
                  ? "2px solid var(--action-primary)"
                  : "2px solid var(--border-default)",
                background: isActive
                  ? "linear-gradient(135deg, rgba(125,198,122,0.15), rgba(125,198,122,0.05))"
                  : "var(--bg-secondary)",
                color: isActive
                  ? "var(--action-primary)"
                  : "var(--text-tertiary)",
                cursor: "pointer",
                fontFamily: "inherit",
                transition: "all 0.2s ease",
                position: "relative",
                boxShadow: isActive
                  ? "0 4px 16px rgba(125,198,122,0.15)"
                  : "none",
              }}
            >
              {year}
              {isActive && (
                <motion.div
                  layoutId="yearIndicator"
                  style={{
                    position: "absolute",
                    bottom: -2,
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: "var(--action-primary)",
                  }}
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

export default MultiYearToggle;
