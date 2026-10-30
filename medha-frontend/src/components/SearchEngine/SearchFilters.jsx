import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Filter,
  SlidersHorizontal,
  LayoutGrid,
  LayoutList,
  Zap,
  X
} from "lucide-react";
import { BASE_EASE, SEMESTERS, CATEGORIES } from "./searchConstants";

export default function SearchFilters({ search }) {
  const {
    query,
    activeCategory,
    setActiveCategory,
    selectedSemester,
    setSelectedSemester,
    sortBy,
    setSortBy,
    viewMode,
    responseTime,
    isCachedResult,
    counts,
    showFilterDrawer,
    setShowFilterDrawer,
    handleToggleViewMode,
    handleCategoryChange,
    handleSemesterChange,
    executeSearch,
    totalResultsCount,
  } = search;

  return (
    <>
        {/* ─── CATEGORY & FILTER TABS ───────────────────────────── */}
        <div className="space-y-2 pt-1">
          {/* Horizontally scrollable Category Tabs */}
          <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1 scrollbar-none snap-x">
            <div className="flex items-center gap-1.5 shrink-0">
              {CATEGORIES.map(cat => {
                const Icon = cat.icon;
                const isActive = activeCategory === cat.id;
                const count = cat.id === "all" ? counts.total : counts[cat.id] || 0;

                return (
                  <button
                    key={cat.id}
                    onClick={() => handleCategoryChange(cat.id)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap active:scale-[0.98] shrink-0"
                    style={{
                      background: isActive ? "var(--text-primary)" : "var(--bg-tertiary)",
                      color: isActive ? "var(--bg-primary)" : "var(--text-secondary)",
                      border: isActive ? "1px solid var(--text-primary)" : "1px solid var(--border-default)",
                      boxShadow: isActive ? "0 2px 8px rgba(0,0,0,0.12)" : "none",
                    }}
                  >
                    <Icon size={14} style={{ color: isActive ? "var(--bg-primary)" : cat.color }} />
                    <span>{cat.short}</span>
                    {query.trim() && (
                      <span
                        className="px-1.5 py-0.2 rounded-full text-[10px] font-bold"
                        style={{
                          background: isActive ? "rgba(255,255,255,0.25)" : "var(--bg-secondary)",
                          color: isActive ? "white" : "var(--text-primary)",
                        }}
                      >
                        {count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* View Switcher & Filter Modal Trigger */}
            <div className="flex items-center gap-1.5 shrink-0 ml-auto">
              <div className="flex items-center p-0.5 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border-default)]">
                <button
                  onClick={() => handleToggleViewMode("list")}
                  className={`p-1.5 rounded-lg transition-colors ${viewMode === "list" ? "bg-[var(--text-primary)] text-[var(--bg-primary)] shadow-sm" : "text-[var(--text-secondary)]"}`}
                  title="List view"
                >
                  <LayoutList size={15} />
                </button>
                <button
                  onClick={() => handleToggleViewMode("grid")}
                  className={`p-1.5 rounded-lg transition-colors ${viewMode === "grid" ? "bg-[var(--text-primary)] text-[var(--bg-primary)] shadow-sm" : "text-[var(--text-secondary)]"}`}
                  title="Grid view"
                >
                  <LayoutGrid size={15} />
                </button>
              </div>

              <button
                onClick={() => setShowFilterDrawer(true)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-[var(--bg-tertiary)] border border-[var(--border-default)] text-[var(--text-primary)] hover:border-[#7DC67A] transition-colors active:scale-[0.98]"
              >
                <SlidersHorizontal size={14} className="text-[#7DC67A]" />
                <span className="hidden sm:inline">Filters</span>
                {(selectedSemester !== "all" || sortBy !== "relevance") && (
                  <span className="w-2 h-2 rounded-full bg-[#7DC67A]" />
                )}
              </button>
            </div>
          </div>

          {/* Semester Quick Pills & Response Latency Pill */}
          <div className="flex items-center justify-between gap-2 overflow-x-auto py-0.5 scrollbar-none">
            <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none shrink-0">
              <span className="text-xs font-semibold text-[var(--text-tertiary)] flex items-center gap-1 shrink-0 mr-0.5">
                <Filter size={11} /> Semester:
              </span>
              {SEMESTERS.map(sem => {
                const isActive = selectedSemester === sem.id;
                return (
                  <button
                    key={sem.id}
                    onClick={() => handleSemesterChange(sem.id)}
                    className="px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-all shrink-0 active:scale-[0.98]"
                    style={{
                      background: isActive ? "#7DC67A" : "var(--bg-secondary)",
                      color: isActive ? "#ffffff" : "var(--text-secondary)",
                      border: isActive ? "1px solid #7DC67A" : "1px solid var(--border-default)",
                    }}
                  >
                    {sem.short}
                  </button>
                );
              })}
            </div>

            {query.trim() && (
              <div className="flex items-center gap-2 shrink-0 ml-auto text-xs font-semibold text-[var(--text-secondary)]">
                {responseTime !== null && (
                  <span
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 text-[10px] font-bold"
                  >
                    <Zap size={11} className="fill-emerald-600" />
                    <span>{isCachedResult ? "0ms (cached)" : `${responseTime}ms`}</span>
                  </span>
                )}
                <span className="hidden sm:inline">
                  Found <span className="text-[#7DC67A] font-bold">{totalResultsCount}</span> results
                </span>
              </div>
            )}
          </div>
        </div>

        {/* ─── MOBILE FILTER DRAWER BOTTOM SHEET ─────────────────── */}
        <AnimatePresence>
          {showFilterDrawer && (
            <div className="fixed inset-0 z-50 flex items-end justify-center p-0 bg-black/60 backdrop-blur-sm">
              <motion.div
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ duration: 0.5, ease: BASE_EASE }}
                className="w-full max-h-[85vh] overflow-y-auto rounded-t-3xl p-5 border-t shadow-2xl space-y-4"
                style={{
                  background: "var(--bg-tertiary)",
                  borderColor: "var(--border-default)",
                }}
              >
                <div className="w-10 h-1 rounded-full bg-[var(--border-default)] mx-auto -mt-1 mb-2" />

                <div className="flex items-center justify-between pb-2 border-b border-[var(--border-default)]">
                  <div className="flex items-center gap-2">
                    <SlidersHorizontal size={16} className="text-[#7DC67A]" />
                    <h3 className="font-bold text-base text-[var(--text-primary)]">Search filters</h3>
                  </div>
                  <button
                    onClick={() => setShowFilterDrawer(false)}
                    className="p-1 rounded-full text-[var(--text-tertiary)] hover:text-[var(--text-primary)]"
                  >
                    <X size={18} />
                  </button>
                </div>

                <div className="space-y-1.5">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-tertiary)]">Category</span>
                  <div className="grid grid-cols-2 gap-2">
                    {CATEGORIES.map(cat => (
                      <button
                        key={cat.id}
                        onClick={() => handleCategoryChange(cat.id)}
                        className={`p-2.5 rounded-lg text-xs font-semibold text-left transition-all border ${activeCategory === cat.id ? "bg-[#7DC67A] text-white border-[#7DC67A]" : "bg-[var(--bg-secondary)] border-[var(--border-default)] text-[var(--text-primary)]"}`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-tertiary)]">Semester</span>
                  <div className="grid grid-cols-3 gap-1.5">
                    {SEMESTERS.map(sem => (
                      <button
                        key={sem.id}
                        onClick={() => handleSemesterChange(sem.id)}
                        className={`py-2 px-1 rounded-lg text-xs font-semibold transition-all border ${selectedSemester === sem.id ? "bg-[#7DC67A] text-white border-[#7DC67A]" : "bg-[var(--bg-secondary)] border-[var(--border-default)] text-[var(--text-secondary)]"}`}
                      >
                        {sem.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-tertiary)]">Sort order</span>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: "relevance", label: "Relevance" },
                      { id: "likes", label: "Most liked" },
                      { id: "newest", label: "Latest" }
                    ].map(sort => (
                      <button
                        key={sort.id}
                        onClick={() => setSortBy(sort.id)}
                        className={`py-2 px-1 rounded-lg text-xs font-semibold transition-all border ${sortBy === sort.id ? "bg-[var(--text-primary)] text-[var(--bg-primary)] border-[var(--text-primary)]" : "bg-[var(--bg-secondary)] border-[var(--border-default)] text-[var(--text-secondary)]"}`}
                      >
                        {sort.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-2 flex gap-2">
                  <button
                    onClick={() => {
                      setSelectedSemester("all");
                      setActiveCategory("all");
                      setSortBy("relevance");
                      setShowFilterDrawer(false);
                      if (query.trim()) executeSearch(query, "all", "all", "all");
                    }}
                    className="flex-1 py-2.5 rounded-lg text-xs font-semibold bg-[var(--bg-secondary)] text-[var(--text-secondary)] border border-[var(--border-default)]"
                  >
                    Reset all
                  </button>
                  <button
                    onClick={() => setShowFilterDrawer(false)}
                    className="flex-1 py-2.5 rounded-lg text-xs font-semibold bg-[#7DC67A] text-white shadow-sm"
                  >
                    Apply filters
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
    </>
  );
}
