import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Sparkles,
  X,
  BookOpen,
  ChevronRight,
  Filter,
  History,
  TrendingUp,
  ArrowRight,
  LayoutGrid,
  LayoutList,
  ArrowUp
} from "lucide-react";
import {
  FaYoutube,
  FaFileLines,
  FaChartBar
} from "react-icons/fa6";
import { BASE_EASE, TAGLINE_WORDS } from "../components/SearchEngine/searchConstants";
import SearchFilters from "../components/SearchEngine/SearchFilters";
import SearchResultGroups from "../components/SearchEngine/SearchResultGroups";
import SearchResultPreview from "../components/SearchEngine/SearchResultPreview";
import { useSearchEngine } from "../hooks/useSearchEngine";
import "../styles/responsive-pages.css";

export default function SearchEngine() {
  const search = useSearchEngine();
  const {
    query,
    setQuery,
    activeCategory,
    selectedSemester,
    viewMode,
    loading,
    suggestions,
    showSuggestions,
    setShowSuggestions,
    isFocused,
    setIsFocused,
    setShowFilterDrawer,
    isScrolled,
    inputRef,
    handleToggleViewMode,
    handleInputChange,
    handleSubmit,
    handleSelectQuery,
    handleCategoryChange,
    removeRecentSearch,
    clearAllRecent,
    popularSearches,
    recentSearches,
    totalResultsCount,
  } = search;

  return (
    <div className="min-h-screen w-full px-3 py-4 sm:px-6 sm:py-8 bg-transparent pb-28">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* ─── STICKY MOBILE TOPBAR (B7 Motion & B4 Surface) ─────── */}
        <AnimatePresence>
          {isScrolled && query.trim() && (
            <motion.div
              initial={{ y: -60, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -60, opacity: 0 }}
              transition={{ duration: 0.5, ease: BASE_EASE }}
              className="fixed top-0 left-0 right-0 z-50 px-3 py-2.5 backdrop-blur-md border-b shadow-sm flex items-center gap-2"
              style={{
                background: "rgba(var(--bg-primary-rgb, 242, 237, 228), 0.94)",
                borderColor: "var(--border-default)",
              }}
            >
              <button
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: "smooth" });
                  inputRef.current?.focus();
                }}
                className="p-2 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-default)] text-[var(--text-secondary)] shrink-0 active:scale-[0.98] transition-all"
                title="Search query"
              >
                <Search size={15} className="text-[#7DC67A]" />
              </button>

              <div
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: "smooth" });
                  inputRef.current?.focus();
                }}
                className="flex-1 flex items-center justify-between px-3 py-1.5 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-default)] cursor-pointer truncate"
              >
                <span className="text-xs font-semibold text-[var(--text-primary)] truncate">
                  {query}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#7DC67A]/15 text-[#7DC67A] shrink-0 ml-1">
                  {totalResultsCount}
                </span>
              </div>

              {/* View Switcher (List vs Grid) */}
              <button
                onClick={() => handleToggleViewMode(viewMode === "list" ? "grid" : "list")}
                className="p-2 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-default)] text-[var(--text-primary)] shrink-0 active:scale-[0.98] transition-all"
                title={viewMode === "list" ? "Switch to grid view" : "Switch to list view"}
              >
                {viewMode === "list" ? <LayoutGrid size={15} /> : <LayoutList size={15} />}
              </button>

              {/* Filter Sheet Trigger */}
              <button
                onClick={() => setShowFilterDrawer(true)}
                className="p-2 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-default)] text-[var(--text-primary)] relative shrink-0 active:scale-[0.98] transition-all"
                title="Filters"
              >
                <Filter size={15} />
                {(selectedSemester !== "all" || activeCategory !== "all") && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#7DC67A]" />
                )}
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ─── HERO SECTION (B5 Layout, Max 680px, Text Gradient) ── */}
        <div className={`text-center space-y-3 max-w-[680px] mx-auto transition-all ${query.trim() ? "pt-1" : "pt-4"}`}>
          {/* Tag Pill */}
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: BASE_EASE }}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-normal shadow-sm"
            style={{
              background: "rgba(125, 198, 122, 0.12)",
              color: "#7DC67A",
              border: "1px solid rgba(125, 198, 122, 0.3)",
            }}
          >
            <Sparkles size={13} />
            <span>India's biggest engineering notes platform</span>
          </motion.div>

          {/* Heading with B5 Text Gradient */}
          {!query.trim() && (
            <motion.h1
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5, ease: BASE_EASE }}
              className="text-2xl sm:text-4xl font-bold tracking-tight"
              style={{
                textWrap: "balance",
                background: "linear-gradient(to right, var(--text-primary) 0%, var(--text-secondary) 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent"
              }}
            >
              Search across notes, YouTube lectures and RTU exam papers
            </motion.h1>
          )}

          {!query.trim() && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.15, duration: 0.5, ease: BASE_EASE }}
              className="text-sm sm:text-base max-w-[600px] mx-auto px-2"
              style={{ color: "var(--text-secondary)", textWrap: "pretty" }}
            >
              Instant access to verified handwritten topper notes, chapter video lectures, syllabus units,
              and recent university question papers.
            </motion.p>
          )}

          {/* ─── SEARCH INPUT (B3 Nested Radius Formula) ───────── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.5, ease: BASE_EASE }}
            className="relative w-full mx-auto mt-2"
          >
            <form onSubmit={handleSubmit} className="relative z-20">
              <div
                className="flex items-center gap-2 rounded-2xl px-3.5 py-2.5 sm:px-4 sm:py-3 transition-all shadow-sm"
                style={{
                  background: "var(--bg-tertiary)",
                  border: isFocused ? "2px solid #7DC67A" : "1px solid var(--border-default)",
                  boxShadow: isFocused ? "0 0 20px rgba(125, 198, 122, 0.2)" : "var(--shadow-card)",
                }}
              >
                <Search
                  size={18}
                  className={`transition-colors shrink-0 ${loading ? "animate-spin text-[#7DC67A]" : "text-[var(--text-secondary)]"}`}
                />

                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={handleInputChange}
                  onFocus={() => {
                    setIsFocused(true);
                    if (suggestions.length > 0) setShowSuggestions(true);
                  }}
                  onBlur={() => {
                    setTimeout(() => {
                      setIsFocused(false);
                      setShowSuggestions(false);
                    }, 250);
                  }}
                  placeholder="Search Karnaugh map, normalization, binary search tree, PYQ 2024..."
                  className="w-full bg-transparent outline-none text-sm sm:text-base font-normal placeholder:text-[var(--text-tertiary)]"
                  style={{ color: "var(--text-primary)" }}
                  autoComplete="off"
                />

                {query && (
                  <button
                    type="button"
                    onClick={() => {
                      setQuery("");
                      inputRef.current?.focus();
                    }}
                    className="p-1 rounded-full hover:bg-[var(--bg-secondary)] transition-colors text-[var(--text-tertiary)] hover:text-[var(--text-primary)] shrink-0"
                  >
                    <X size={16} />
                  </button>
                )}

                <div className="hidden sm:flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-md bg-[var(--bg-secondary)] text-[var(--text-tertiary)] border border-[var(--border-default)] shrink-0">
                  <span>Press</span>
                  <kbd className="font-mono">/</kbd>
                </div>

                {/* Main Search CTA (B1 Button Padding 8px x 12px) */}
                <button
                  type="submit"
                  className="rounded-lg px-3 py-2 text-xs sm:text-sm font-semibold text-white bg-[#7DC67A] hover:bg-[#6ab367] transition-all active:scale-[0.98] shadow-sm shrink-0"
                >
                  Search
                </button>
              </div>
            </form>

            {/* ─── AUTOCOMPLETE SUGGESTIONS DROPDOWN ────────────── */}
            <AnimatePresence>
              {showSuggestions && suggestions.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.3, ease: BASE_EASE }}
                  className="absolute left-0 right-0 top-full mt-2 rounded-2xl shadow-xl z-50 overflow-hidden border"
                  style={{
                    background: "var(--bg-tertiary)",
                    borderColor: "var(--border-default)",
                  }}
                >
                  <div className="p-2 space-y-1 max-h-64 overflow-y-auto">
                    {suggestions.map((sug, idx) => (
                      <div
                        key={idx}
                        onMouseDown={() => handleSelectQuery(sug.term)}
                        className="flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-colors group"
                        style={{ background: "transparent" }}
                      >
                        <div className="flex items-center gap-2 truncate">
                          <Search size={14} className="text-[#7DC67A] shrink-0" />
                          <span className="text-xs sm:text-sm font-medium text-[var(--text-primary)] group-hover:text-[#7DC67A] transition-colors truncate">
                            {sug.term}
                          </span>
                          {sug.category && (
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[var(--bg-secondary)] text-[var(--text-tertiary)] shrink-0">
                              {sug.category}
                            </span>
                          )}
                        </div>
                        <ArrowRight size={13} className="text-[var(--text-tertiary)] group-hover:text-[#7DC67A] transition-colors shrink-0 ml-2" />
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* ─── POPULAR CHIPS ─────────────────────────────────── */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 pt-1 px-1">
            <span className="text-xs font-semibold flex items-center gap-1 mr-1 text-[var(--text-tertiary)]">
              <TrendingUp size={12} className="text-[#7DC67A]" /> Popular:
            </span>
            {popularSearches.slice(0, query.trim() ? 4 : 8).map((term, i) => (
              <button
                key={i}
                onClick={() => handleSelectQuery(term)}
                className="text-xs px-2.5 py-1 rounded-full font-medium transition-all hover:border-[#7DC67A] active:scale-[0.98]"
                style={{
                  background: "var(--bg-secondary)",
                  color: "var(--text-primary)",
                  border: "1px solid var(--border-default)",
                }}
              >
                {term}
              </button>
            ))}
          </div>

          {/* ─── RECENT SEARCHES ──────────────────────────────── */}
          {!query.trim() && recentSearches.length > 0 && (
            <div className="flex flex-wrap items-center justify-center gap-1.5 pt-1">
              <span className="text-xs font-semibold flex items-center gap-1 mr-1 text-[var(--text-tertiary)]">
                <History size={12} /> Recent:
              </span>
              {recentSearches.map((term, i) => (
                <div
                  key={i}
                  onClick={() => handleSelectQuery(term)}
                  className="group flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full font-medium transition-all hover:border-[#7DC67A] cursor-pointer"
                  style={{
                    background: "rgba(125, 198, 122, 0.08)",
                    color: "var(--text-secondary)",
                    border: "1px solid rgba(125, 198, 122, 0.25)",
                  }}
                >
                  <span>{term}</span>
                  <button
                    onClick={(e) => removeRecentSearch(term, e)}
                    className="opacity-60 hover:opacity-100 hover:text-red-500 transition-opacity ml-0.5"
                  >
                    <X size={11} />
                  </button>
                </div>
              ))}
              <button
                onClick={clearAllRecent}
                className="text-xs text-[var(--text-tertiary)] hover:underline ml-1"
              >
                Clear all
              </button>
            </div>
          )}
        </div>

        <SearchFilters search={search} />

        {/* ─── EMPTY STATE (BEFORE SEARCHING) ───────────────────── */}
        {!loading && !query.trim() && (
          <div className="space-y-6 pt-2">
            <div className="text-center mb-2">
              <h2 className="text-lg sm:text-xl font-bold text-[var(--text-primary)]" style={{ textWrap: "balance" }}>
                Explore structured academic resources
              </h2>
              <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1" style={{ textWrap: "pretty" }}>
                Curated by university toppers and faculties across all RTU engineering branches.
              </p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <div
                onClick={() => handleCategoryChange("notes")}
                className="p-4 rounded-2xl border transition-all hover:border-[#8B5CF6] cursor-pointer shadow-sm group active:scale-[0.98]"
                style={{
                  background: "var(--bg-tertiary)",
                  borderColor: "var(--border-default)",
                }}
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3 bg-purple-500/10 text-purple-600">
                  <FaFileLines size={20} />
                </div>
                <h3 className="font-bold text-sm sm:text-base text-[var(--text-primary)] group-hover:text-purple-600 transition-colors">
                  Notes and PDFs
                </h3>
                <p className="text-xs text-[var(--text-secondary)] mt-1 line-clamp-2 leading-relaxed">
                  Handwritten topper notes and revision summaries.
                </p>
                <div className="mt-3 flex items-center text-xs font-semibold text-purple-600 gap-1">
                  <span>Browse notes</span>
                  <ChevronRight size={13} />
                </div>
              </div>

              <div
                onClick={() => handleCategoryChange("youtube")}
                className="p-4 rounded-2xl border transition-all hover:border-red-500 cursor-pointer shadow-sm group active:scale-[0.98]"
                style={{
                  background: "var(--bg-tertiary)",
                  borderColor: "var(--border-default)",
                }}
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3 bg-red-500/10 text-red-500">
                  <FaYoutube size={20} />
                </div>
                <h3 className="font-bold text-sm sm:text-base text-[var(--text-primary)] group-hover:text-red-500 transition-colors">
                  YouTube lectures
                </h3>
                <p className="text-xs text-[var(--text-secondary)] mt-1 line-clamp-2 leading-relaxed">
                  Chapter curated lectures and complete playlists.
                </p>
                <div className="mt-3 flex items-center text-xs font-semibold text-red-500 gap-1">
                  <span>Watch videos</span>
                  <ChevronRight size={13} />
                </div>
              </div>

              <div
                onClick={() => handleCategoryChange("subjects")}
                className="p-4 rounded-2xl border transition-all hover:border-blue-500 cursor-pointer shadow-sm group active:scale-[0.98]"
                style={{
                  background: "var(--bg-tertiary)",
                  borderColor: "var(--border-default)",
                }}
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3 bg-blue-500/10 text-blue-500">
                  <BookOpen size={20} />
                </div>
                <h3 className="font-bold text-sm sm:text-base text-[var(--text-primary)] group-hover:text-blue-500 transition-colors">
                  Subjects and units
                </h3>
                <p className="text-xs text-[var(--text-secondary)] mt-1 line-clamp-2 leading-relaxed">
                  Semester 1 to 8 subjects, syllabus breakdowns and units.
                </p>
                <div className="mt-3 flex items-center text-xs font-semibold text-blue-500 gap-1">
                  <span>Explore units</span>
                  <ChevronRight size={13} />
                </div>
              </div>

              <div
                onClick={() => handleCategoryChange("pyq")}
                className="p-4 rounded-2xl border transition-all hover:border-emerald-500 cursor-pointer shadow-sm group active:scale-[0.98]"
                style={{
                  background: "var(--bg-tertiary)",
                  borderColor: "var(--border-default)",
                }}
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3 bg-emerald-500/10 text-emerald-500">
                  <FaChartBar size={20} />
                </div>
                <h3 className="font-bold text-sm sm:text-base text-[var(--text-primary)] group-hover:text-emerald-500 transition-colors">
                  PYQs and analysis
                </h3>
                <p className="text-xs text-[var(--text-secondary)] mt-1 line-clamp-2 leading-relaxed">
                  2022 to 2025 RTU past papers and AI solutions.
                </p>
                <div className="mt-3 flex items-center text-xs font-semibold text-emerald-500 gap-1">
                  <span>Analyze exams</span>
                  <ChevronRight size={13} />
                </div>
              </div>
            </div>

            {/* ─── MANDATORY TAGLINE REVEAL SECTION (B11) ────────── */}
            <div className="py-8 sm:py-12 max-w-[680px] mx-auto text-center px-4">
              <p 
                className="text-xl sm:text-2xl md:text-3xl font-semibold leading-relaxed tracking-tight"
                style={{ textWrap: "balance" }}
              >
                {TAGLINE_WORDS.map((word, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0.28 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true, margin: "-10% 0px -10% 0px" }}
                    transition={{
                      duration: 0.5,
                      delay: i * 0.03,
                      ease: BASE_EASE
                    }}
                    className="inline-block mr-1.5 transition-colors"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {word}
                  </motion.span>
                ))}
              </p>
            </div>
          </div>
        )}

        <SearchResultGroups search={search} />

        <SearchResultPreview search={search} />

        {/* ─── FLOATING BACK TO TOP BUTTON ──────────────────────── */}
        <AnimatePresence>
          {isScrolled && (
            <motion.button
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: BASE_EASE }}
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="fixed bottom-6 right-5 z-40 p-3 rounded-full bg-[#7DC67A] text-white shadow-lg hover:scale-105 active:scale-[0.98] transition-transform"
              title="Back to top"
            >
              <ArrowUp size={18} />
            </motion.button>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
