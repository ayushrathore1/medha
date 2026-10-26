import React from "react";
import { motion } from "framer-motion";
import Card from "../Common/Card";
import Loader from "../Common/Loader";
import { FaCalendarDays } from "react-icons/fa6";

/**
 * YearSelector - Displays available years as selectable cards
 * @param {Object} props
 * @param {number[]} props.years - Array of available years
 * @param {number|null} props.selectedYear - Currently selected year
 * @param {function} props.onYearSelect - Callback when a year is selected
 * @param {boolean} props.loading - Loading state
 */
const YearSelector = ({ years, selectedYear, onYearSelect, loading }) => {
  if (loading) {
    return <div className="flex justify-center py-20 px-8"><Loader /></div>;
  }

  if (!years || years.length === 0) {
    return (
      <div className="text-center py-20 px-8">
        <div className="flex justify-center mb-4 text-[var(--text-tertiary)] text-4xl">
          <FaCalendarDays />
        </div>
        <p className="text-lg font-bold text-[var(--text-secondary)]">
          No exam papers available for this subject yet.
        </p>
        <p className="text-[var(--text-tertiary)]">Check back later or contact admin.</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <h3 className="text-xl font-bold text-[var(--text-primary)] mb-6 text-center">
        Select Exam Year
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {years.map((year, index) => (
          <motion.div
            key={year}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card
              onClick={() => onYearSelect(year)}
              className={`cursor-pointer flex flex-col items-center justify-center p-6 gap-3 transition-all hover:border-[var(--action-primary)]/50 hover:shadow-lg ${selectedYear === year ? 'border-[var(--action-primary)] ring-2 ring-[var(--action-primary)]/20 bg-[var(--action-primary)]/10' : 'bg-[var(--bg-secondary)] border-[var(--border-default)]'}`}
            >
              <div className={`p-3 rounded-full ${selectedYear === year ? 'bg-[var(--action-primary)]/20 text-[var(--action-primary)]' : 'bg-[var(--bg-tertiary)] text-[var(--text-tertiary)] group-hover:bg-[var(--action-primary)]/10 group-hover:text-[var(--action-primary)]'}`}>
                <FaCalendarDays size={24} />
              </div>
              <div className="text-3xl font-black text-[var(--text-primary)]">
                {year}
              </div>
              <span className="text-xs font-bold text-[var(--text-tertiary)] uppercase tracking-wider">
                RTU Paper
              </span>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default YearSelector;
