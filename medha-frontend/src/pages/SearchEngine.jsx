import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Sparkles,
  X,
  Play,
  FileText,
  BookOpen,
  HelpCircle,
  ExternalLink,
  ChevronRight,
  Filter,
  History,
  TrendingUp,
  SlidersHorizontal,
  Download,
  GraduationCap,
  Layers,
  ArrowRight,
  Eye,
  ThumbsUp,
  Clock,
  CheckCircle2,
  ListFilter,
  Share2,
  Copy,
  Check,
  LayoutGrid,
  LayoutList,
  ChevronDown,
  ArrowUp,
  Zap,
  FileDown
} from "lucide-react";
import {
  FaYoutube,
  FaFileLines,
  FaChartBar,
  FaBook,
  FaArrowUpRightFromSquare,
  FaArrowLeft,
  FaDownload,
  FaHeart,
  FaWhatsapp
} from "react-icons/fa6";
import api, {
  searchDatabase,
  fetchSearchSuggestions,
  fetchPopularSearches,
  logSearchQuery
} from "../api/api";
import Button from "../components/Common/Button";
import "../styles/responsive-pages.css";

// ─── ELAYA DESIGN SKILLS SYSTEM CONSTANTS ───────────────────────
// Motion Base Curve: cubic-bezier(0.22, 1, 0.36, 1) per B7
const BASE_EASE = [0.22, 1, 0.36, 1];

// High Speed In-Memory Client Cache for 0ms Instant Response
const clientSearchCache = new Map();
const CACHE_CAPACITY = 100;

function getClientCache(key) {
  const item = clientSearchCache.get(key);
  if (!item) return null;
  // 5 minute client-side TTL
  if (Date.now() - item.timestamp > 5 * 60 * 1000) {
    clientSearchCache.delete(key);
    return null;
  }
  return item;
}

function setClientCache(key, data, latency) {
  if (clientSearchCache.size >= CACHE_CAPACITY) {
    const oldestKey = clientSearchCache.keys().next().value;
    clientSearchCache.delete(oldestKey);
  }
  clientSearchCache.set(key, { data, timestamp: Date.now(), latency });
}

// Flat subject color mapping (no gradients, uniform full border per B4)
const SUBJECT_COLORS = {
  "Discrete Mathematics Structure": { bg: "#E8D2BF", text: "#C04A00", border: "rgba(192,74,0,0.3)" },
  "Database Management System": { bg: "#C8DDB8", text: "#2E7D32", border: "rgba(46,125,50,0.3)" },
  "Data Structures and Algorithms": { bg: "#D2D8D8", text: "#00695C", border: "rgba(0,105,92,0.3)" },
  "Theory Of Computation": { bg: "#E2D4ED", text: "#6A1B9A", border: "rgba(106,27,154,0.3)" },
  "Digital Electronics": { bg: "#FECDD3", text: "#BE123C", border: "rgba(190,18,60,0.3)" },
  "Object Oriented Programming": { bg: "#FDE68A", text: "#B45309", border: "rgba(180,83,9,0.3)" },
  "Software Engineering": { bg: "#BFDBFE", text: "#1D4ED8", border: "rgba(29,78,216,0.3)" },
  "Data Communication & Computer Networks": { bg: "#BBF7D0", text: "#15803D", border: "rgba(21,128,61,0.3)" },
  "Microprocessor & Interfaces": { bg: "#FED7AA", text: "#C2410C", border: "rgba(194,65,12,0.3)" },
  "Technical Communication": { bg: "#DDD6FE", text: "#5B21B6", border: "rgba(91,33,182,0.3)" },
};

const getSubjectBadgeStyle = (subjectName) => {
  if (!subjectName) return { bg: "rgba(125, 198, 122, 0.15)", text: "#7DC67A", border: "rgba(125, 198, 122, 0.35)" };
  const found = Object.keys(SUBJECT_COLORS).find(k =>
    subjectName.toLowerCase().includes(k.toLowerCase()) || k.toLowerCase().includes(subjectName.toLowerCase())
  );
  if (found) return SUBJECT_COLORS[found];
  return { bg: "rgba(139, 92, 246, 0.12)", text: "#8B5CF6", border: "rgba(139, 92, 246, 0.3)" };
};

const SEMESTERS = [
  { id: "all", label: "All semesters", short: "All" },
  { id: "1st", label: "Semester 1", short: "1st" },
  { id: "2nd", label: "Semester 2", short: "2nd" },
  { id: "3rd", label: "Semester 3", short: "3rd" },
  { id: "4th", label: "Semester 4", short: "4th" },
  { id: "5th", label: "Semester 5", short: "5th" },
  { id: "6th", label: "Semester 6", short: "6th" },
  { id: "7th", label: "Semester 7", short: "7th" },
  { id: "8th", label: "Semester 8", short: "8th" },
];

const CATEGORIES = [
  { id: "all", label: "All resources", short: "All", icon: Sparkles, color: "#7DC67A" },
  { id: "notes", label: "Notes and materials", short: "Notes", icon: FaFileLines, color: "#8B5CF6" },
  { id: "youtube", label: "YouTube lectures", short: "Videos", icon: FaYoutube, color: "#EF4444" },
  { id: "subjects", label: "Subjects and syllabus", short: "Syllabus", icon: FaBook, color: "#3B82F6" },
  { id: "pyq", label: "Previous year papers", short: "PYQs", icon: FaChartBar, color: "#10B981" },
];

const LOCAL_STORAGE_KEY = "medha_recent_searches_v2";
const VIEW_MODE_KEY = "medha_search_view_mode_v2";

// Tagline Reveal text per B11
const TAGLINE_WORDS = "Built for Rajasthan Technical University engineers. Every unit, note, and exam solution organized in one place.".split(" ");

export default function SearchEngine() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const urlQuery = searchParams.get("q") || "";
  const urlCategory = searchParams.get("category") || "all";
  const urlSemester = searchParams.get("semester") || "all";
  const urlSubject = searchParams.get("subject") || "all";

  const [query, setQuery] = useState(urlQuery);
  const [activeCategory, setActiveCategory] = useState(urlCategory);
  const [selectedSemester, setSelectedSemester] = useState(urlSemester);
  const [selectedSubject, setSelectedSubject] = useState(urlSubject);
  const [sortBy, setSortBy] = useState("relevance"); // "relevance" | "likes" | "newest"

  // View Mode: Mobile defaults to dense "list", desktop can toggle to "grid"
  const [viewMode, setViewMode] = useState(() => {
    const saved = localStorage.getItem(VIEW_MODE_KEY);
    if (saved === "list" || saved === "grid") return saved;
    return typeof window !== "undefined" && window.innerWidth < 768 ? "list" : "grid";
  });

  const [loading, setLoading] = useState(false);
  const [responseTime, setResponseTime] = useState(null); // in ms
  const [isCachedResult, setIsCachedResult] = useState(false);

  const [results, setResults] = useState({
    notes: [],
    youtube: [],
    subjects: [],
    pyq: []
  });
  const [counts, setCounts] = useState({ total: 0, notes: 0, youtube: 0, subjects: 0, pyq: 0 });
  const [topMatches, setTopMatches] = useState([]);
  const [popularSearches, setPopularSearches] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  // Mobile Bottom Sheet states
  const [previewItem, setPreviewItem] = useState(null);
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const inputRef = useRef(null);
  const searchAbortRef = useRef(null);
  const suggestionsAbortRef = useRef(null);
  const debounceTimerRef = useRef(null);

  // Throttled scroll listener with requestAnimationFrame per B7
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 180);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleToggleViewMode = (mode) => {
    setViewMode(mode);
    try {
      localStorage.setItem(VIEW_MODE_KEY, mode);
    } catch (e) {}
  };

  // Load recent searches from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        setRecentSearches(JSON.parse(stored).slice(0, 8));
      }
    } catch (e) {}

    // Load popular searches from backend
    fetchPopularSearches()
      .then(data => {
        if (data?.popular && Array.isArray(data.popular)) {
          setPopularSearches(data.popular);
        }
      })
      .catch(() => {
        setPopularSearches([
          "Karnaugh Map",
          "Normalization",
          "Binary Search Tree",
          "Turing Machine",
          "Three Way Handshake",
          "DFA Construction",
          "PYQ 2024",
          "Handwritten Notes"
        ]);
      });
  }, []);

  const saveRecentSearch = (searchTerm) => {
    if (!searchTerm || searchTerm.trim().length < 2) return;
    const cleanTerm = searchTerm.trim();
    setRecentSearches(prev => {
      const filtered = prev.filter(item => item.toLowerCase() !== cleanTerm.toLowerCase());
      const updated = [cleanTerm, ...filtered].slice(0, 8);
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  const removeRecentSearch = (term, e) => {
    e.stopPropagation();
    setRecentSearches(prev => {
      const updated = prev.filter(t => t !== term);
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  const clearAllRecent = () => {
    setRecentSearches([]);
    try {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    } catch (e) {}
  };

  // Execute High Speed Search with In-Memory Caching & AbortController
  const executeSearch = useCallback(async (
    searchQuery,
    category = activeCategory,
    semester = selectedSemester,
    subject = selectedSubject
  ) => {
    const trimmed = (searchQuery || "").trim();
    if (!trimmed) {
      setResults({ notes: [], youtube: [], subjects: [], pyq: [] });
      setCounts({ total: 0, notes: 0, youtube: 0, subjects: 0, pyq: 0 });
      setTopMatches([]);
      setLoading(false);
      setResponseTime(null);
      setIsCachedResult(false);
      return;
    }

    const cacheKey = `${trimmed.toLowerCase()}_${category}_${semester}_${subject}_${sortBy}`;
    const cached = getClientCache(cacheKey);

    // If result exists in client cache, serve in 0ms!
    if (cached) {
      setResults(cached.data.results || { notes: [], youtube: [], subjects: [], pyq: [] });
      setCounts(cached.data.counts || { total: 0, notes: 0, youtube: 0, subjects: 0, pyq: 0 });
      setTopMatches(cached.data.topMatches || []);
      setResponseTime(cached.latency || 0);
      setIsCachedResult(true);
      setLoading(false);
      setShowSuggestions(false);
      saveRecentSearch(trimmed);
      return;
    }

    if (searchAbortRef.current) {
      searchAbortRef.current.abort();
    }
    const abortCtrl = new AbortController();
    searchAbortRef.current = abortCtrl;

    setLoading(true);
    setShowSuggestions(false);
    setIsCachedResult(false);
    const startTime = performance.now();

    try {
      const response = await searchDatabase({
        q: trimmed,
        category,
        semester,
        subject,
        limit: 50
      }, abortCtrl.signal);

      const endTime = performance.now();
      const latency = Math.round(endTime - startTime);

      if (response && response.success) {
        setResults(response.results || { notes: [], youtube: [], subjects: [], pyq: [] });
        setCounts(response.counts || { total: 0, notes: 0, youtube: 0, subjects: 0, pyq: 0 });
        setTopMatches(response.topMatches || []);
        setResponseTime(latency);
        setClientCache(cacheKey, response, latency);
        saveRecentSearch(trimmed);
      }
    } catch (error) {
      if (error?.name !== "CanceledError" && error?.name !== "AbortError") {
        console.error("Search execution error:", error);
      }
    } finally {
      setLoading(false);
    }
  }, [activeCategory, selectedSemester, selectedSubject, sortBy]);

  const updateUrlParams = (newQuery, newCat = activeCategory, newSem = selectedSemester, newSub = selectedSubject) => {
    const params = new URLSearchParams();
    if (newQuery) params.set("q", newQuery);
    if (newCat && newCat !== "all") params.set("category", newCat);
    if (newSem && newSem !== "all") params.set("semester", newSem);
    if (newSub && newSub !== "all") params.set("subject", newSub);
    setSearchParams(params, { replace: true });
  };

  useEffect(() => {
    if (urlQuery) {
      setQuery(urlQuery);
      executeSearch(urlQuery, urlCategory, urlSemester, urlSubject);
    }
  }, [urlQuery, urlCategory, urlSemester, urlSubject]);

  const handleInputChange = (e) => {
    const val = e.target.value;
    setQuery(val);

    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    if (suggestionsAbortRef.current) suggestionsAbortRef.current.abort();

    if (val.trim().length >= 2) {
      debounceTimerRef.current = setTimeout(async () => {
        const abortCtrl = new AbortController();
        suggestionsAbortRef.current = abortCtrl;
        try {
          const res = await fetchSearchSuggestions(val.trim(), abortCtrl.signal);
          if (res?.suggestions) {
            setSuggestions(res.suggestions);
            setShowSuggestions(true);
          }
        } catch (e) {
          if (e?.name !== "CanceledError" && e?.name !== "AbortError") {
            setSuggestions([]);
          }
        }
      }, 120);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;
    setShowSuggestions(false);
    updateUrlParams(query, activeCategory, selectedSemester, selectedSubject);
    executeSearch(query, activeCategory, selectedSemester, selectedSubject);
  };

  const handleSelectQuery = (term) => {
    setQuery(term);
    setShowSuggestions(false);
    updateUrlParams(term, activeCategory, selectedSemester, selectedSubject);
    executeSearch(term, activeCategory, selectedSemester, selectedSubject);
    inputRef.current?.focus();
  };

  const handleCategoryChange = (catId) => {
    setActiveCategory(catId);
    updateUrlParams(query, catId, selectedSemester, selectedSubject);
    if (query.trim()) {
      executeSearch(query, catId, selectedSemester, selectedSubject);
    }
  };

  const handleSemesterChange = (semId) => {
    setSelectedSemester(semId);
    updateUrlParams(query, activeCategory, semId, selectedSubject);
    if (query.trim()) {
      executeSearch(query, activeCategory, semId, selectedSubject);
    }
  };

  // Keyboard shortcut: Pressing "/" or "Ctrl+K" focuses search
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.key === "/" || ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k")) && document.activeElement !== inputRef.current) {
        e.preventDefault();
        inputRef.current?.focus();
      } else if (e.key === "Escape") {
        setShowSuggestions(false);
        inputRef.current?.blur();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // WhatsApp One Tap Share for College Study Groups
  const handleWhatsAppShare = (item, e) => {
    e?.stopPropagation?.();
    const title = item.title || "Engineering study resource";
    const subject = item.subject || "RTU engineering";
    const sem = item.semester || "All semesters";
    const targetUrl = window.location.origin + (
      item.redirects?.subjectNotes ||
      item.redirects?.subjectYouTube ||
      item.redirects?.pyqAnalysis ||
      `/search?q=${encodeURIComponent(title)}`
    );

    const shareText = `📚 *${title}* (${sem})\n📖 Subject: *${subject}*\n\nVerified notes, chapter video lectures and RTU exam solutions on Medha:\n${targetUrl}\n\nShared for study group! 🚀`;

    if (navigator.share && /mobile|android|iphone/i.test(navigator.userAgent)) {
      navigator.share({
        title: title,
        text: shareText,
        url: targetUrl
      }).catch(() => {
        window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`, "_blank");
      });
    } else {
      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`, "_blank");
    }
  };

  const handleCopyLink = (item, e) => {
    e?.stopPropagation?.();
    const targetUrl = window.location.origin + (
      item.redirects?.subjectNotes ||
      item.redirects?.subjectYouTube ||
      item.redirects?.pyqAnalysis ||
      `/search?q=${encodeURIComponent(item.title || "")}`
    );
    navigator.clipboard.writeText(targetUrl).then(() => {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    });
  };

  // Filter & sort results
  const displayedNotes = useMemo(() => {
    let list = [...(results.notes || [])];
    if (sortBy === "likes") list.sort((a, b) => (b.likesCount || 0) - (a.likesCount || 0));
    return list;
  }, [results.notes, sortBy]);

  const displayedYoutube = results.youtube || [];
  const displayedSubjects = results.subjects || [];
  const displayedPyq = results.pyq || [];

  const totalResultsCount = activeCategory === "all" ? counts.total : counts[activeCategory] || 0;

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

        {/* ─── LOADING STATE (SKELETON PLACEHOLDERS - ZERO CLS) ──── */}
        {loading && (
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between text-xs font-semibold text-[var(--text-secondary)] mb-2 animate-pulse">
              <span>Searching verified engineering notes, syllabus and lectures...</span>
              <span className="text-[#7DC67A]">Fetching...</span>
            </div>

            {viewMode === "list" ? (
              <div className="space-y-2">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div
                    key={i}
                    className="p-3.5 rounded-2xl border animate-pulse flex items-center justify-between gap-3"
                    style={{
                      background: "var(--bg-tertiary)",
                      borderColor: "var(--border-default)",
                    }}
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-[var(--bg-secondary)] shrink-0" />
                      <div className="space-y-1.5 flex-1 min-w-0">
                        <div className="h-4 w-3/4 rounded bg-[var(--bg-secondary)]" />
                        <div className="h-3 w-1/2 rounded bg-[var(--bg-secondary)]" />
                      </div>
                    </div>
                    <div className="w-20 h-8 rounded-lg bg-[var(--bg-secondary)] shrink-0 hidden sm:block" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div
                    key={i}
                    className="p-4 rounded-2xl border animate-pulse space-y-3"
                    style={{
                      background: "var(--bg-tertiary)",
                      borderColor: "var(--border-default)",
                    }}
                  >
                    <div className="h-32 rounded-xl bg-[var(--bg-secondary)] w-full" />
                    <div className="h-4 w-3/4 rounded bg-[var(--bg-secondary)]" />
                    <div className="h-3 w-1/2 rounded bg-[var(--bg-secondary)]" />
                    <div className="h-8 rounded-lg bg-[var(--bg-secondary)] w-full" />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

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

        {/* ─── NO RESULTS FOUND ─────────────────────────────────── */}
        {!loading && query.trim() && totalResultsCount === 0 && (
          <div
            className="p-8 sm:p-10 text-center rounded-2xl border space-y-3 max-w-lg mx-auto shadow-sm"
            style={{
              background: "var(--bg-tertiary)",
              borderColor: "var(--border-default)",
            }}
          >
            <div className="w-12 h-12 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto">
              <HelpCircle size={24} />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-[var(--text-primary)]">
              No direct matches found for "{query}"
            </h3>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed" style={{ textWrap: "pretty" }}>
              Try searching with broader engineering keywords like <span className="font-semibold text-[var(--text-primary)]">"Discrete Mathematics"</span>, <span className="font-semibold text-[var(--text-primary)]">"DBMS"</span>, <span className="font-semibold text-[var(--text-primary)]">"Karnaugh Map"</span>, or switch to <span className="font-semibold text-[var(--text-primary)]">"All semesters"</span>.
            </p>
            <div className="pt-2 flex flex-wrap gap-2 justify-center">
              <button
                onClick={() => {
                  setSelectedSemester("all");
                  setActiveCategory("all");
                  executeSearch(query, "all", "all", "all");
                }}
                className="px-3 py-2 rounded-lg text-xs font-semibold border border-[var(--border-default)] bg-[var(--bg-secondary)] text-[var(--text-primary)] hover:border-[#7DC67A] transition-all"
              >
                Reset filters
              </button>
              <button
                onClick={() => navigate("/notes")}
                className="px-3 py-2 rounded-lg text-xs font-semibold bg-[#7DC67A] text-white hover:bg-[#6ab367] transition-all"
              >
                Browse all community notes
              </button>
            </div>
          </div>
        )}

        {/* ─── SEARCH RESULTS CONTENT ───────────────────────────── */}
        {!loading && query.trim() && totalResultsCount > 0 && (
          <div className="space-y-6">

            {/* ── TOP VERIFIED MATCHES (ALL MODE) ───────────────── */}
            {activeCategory === "all" && topMatches.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center gap-1.5">
                  <Sparkles size={14} className="text-[#7DC67A]" />
                  <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[var(--text-primary)]">
                    Top verified matches
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {topMatches.map((item, idx) => {
                    const badge = getSubjectBadgeStyle(item.subject);
                    const isYt = item.category === "youtube";
                    const isNote = item.category === "notes";
                    const isSubj = item.category === "subjects";
                    const isPyq = item.category === "pyq";

                    return (
                      <div
                        key={item.id || idx}
                        onClick={() => setPreviewItem(item)}
                        className="p-4 rounded-2xl border transition-all hover:border-[#7DC67A] relative overflow-hidden flex flex-col justify-between group cursor-pointer active:scale-[0.99]"
                        style={{
                          background: "var(--bg-tertiary)",
                          borderColor: idx === 0 ? "rgba(125, 198, 122, 0.5)" : "var(--border-default)",
                          boxShadow: idx === 0 ? "0 4px 16px rgba(125, 198, 122, 0.1)" : "var(--shadow-card)",
                        }}
                      >
                        <div>
                          <div className="flex items-center justify-between gap-2 mb-2">
                            <span
                              className="px-2 py-0.5 rounded text-[10px] font-semibold"
                              style={{
                                background: badge.bg,
                                color: badge.text,
                                border: `1px solid ${badge.border}`,
                              }}
                            >
                              {item.subject || "RTU subject"}
                            </span>
                            <span
                              className="text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1"
                              style={{
                                background: isYt
                                  ? "rgba(239, 68, 68, 0.1)"
                                  : isNote
                                  ? "rgba(139, 92, 246, 0.1)"
                                  : isSubj
                                  ? "rgba(59, 130, 246, 0.1)"
                                  : "rgba(16, 185, 129, 0.1)",
                                color: isYt ? "#EF4444" : isNote ? "#8B5CF6" : isSubj ? "#3B82F6" : "#10B981",
                              }}
                            >
                              {isYt && <FaYoutube size={10} />}
                              {isNote && <FaFileLines size={10} />}
                              {isSubj && <FaBook size={10} />}
                              {isPyq && <FaChartBar size={10} />}
                              <span>{isYt ? "Lecture" : isNote ? "Study note" : isSubj ? "Syllabus hub" : "PYQ paper"}</span>
                            </span>
                          </div>

                          <h3 className="text-sm sm:text-base font-bold text-[var(--text-primary)] group-hover:text-[#7DC67A] transition-colors leading-snug line-clamp-2">
                            {item.title}
                          </h3>
                          <p className="text-xs text-[var(--text-secondary)] mt-1 line-clamp-2 leading-relaxed" style={{ textWrap: "pretty" }}>
                            {item.description || item.snippet || `Verified study material for ${item.subject}`}
                          </p>
                        </div>

                        {/* Direct Action Bar */}
                        <div
                          className="mt-3 pt-2.5 border-t border-[var(--border-default)] flex items-center justify-between gap-1.5"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="flex items-center gap-1.5 flex-1 min-w-0">
                            {isYt && (
                              <button
                                onClick={() => navigate(item.redirects.subjectYouTube)}
                                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#EF4444] text-white hover:bg-red-600 transition-colors flex items-center gap-1 shadow-sm active:scale-[0.98]"
                              >
                                <FaYoutube size={11} />
                                <span>Watch lecture</span>
                              </button>
                            )}

                            {isNote && (
                              <button
                                onClick={() => navigate(item.redirects.subjectNotes)}
                                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#8B5CF6] text-white hover:bg-purple-600 transition-colors flex items-center gap-1 shadow-sm active:scale-[0.98]"
                              >
                                <FaFileLines size={11} />
                                <span>Open notes</span>
                              </button>
                            )}

                            {isSubj && (
                              <button
                                onClick={() => navigate(item.redirects.subjectNotes)}
                                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors flex items-center gap-1 shadow-sm active:scale-[0.98]"
                              >
                                <FaBook size={11} />
                                <span>Subject hub</span>
                              </button>
                            )}

                            {isPyq && (
                              <button
                                onClick={() => navigate(item.redirects.pyqAnalysis)}
                                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700 transition-colors flex items-center gap-1 shadow-sm active:scale-[0.98]"
                              >
                                <FaChartBar size={11} />
                                <span>View PYQ paper</span>
                              </button>
                            )}

                            {item.fileUrl && (
                              <a
                                href={item.fileUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="p-1.5 rounded-lg bg-[var(--bg-secondary)] hover:bg-[var(--border-default)] text-[var(--text-primary)] transition-colors active:scale-[0.98]"
                                title="Download PDF"
                              >
                                <Download size={13} />
                              </a>
                            )}
                          </div>

                          <button
                            onClick={(e) => handleWhatsAppShare(item, e)}
                            className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 transition-colors active:scale-[0.98] shrink-0"
                            title="Share on WhatsApp"
                          >
                            <FaWhatsapp size={14} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ─── NOTES AND STUDY MATERIAL RESULTS ──────────────── */}
            {(activeCategory === "all" || activeCategory === "notes") && displayedNotes.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-600">
                      <FaFileLines size={14} />
                    </div>
                    <h2 className="text-sm sm:text-base font-bold text-[var(--text-primary)]">
                      Notes and study materials ({displayedNotes.length})
                    </h2>
                  </div>
                  {activeCategory === "all" && displayedNotes.length > 4 && (
                    <button
                      onClick={() => handleCategoryChange("notes")}
                      className="text-xs font-semibold text-purple-600 hover:underline flex items-center gap-1"
                    >
                      <span>All {displayedNotes.length} notes</span>
                      <ChevronRight size={13} />
                    </button>
                  )}
                </div>

                {viewMode === "list" ? (
                  <div className="space-y-2">
                    {displayedNotes.map((note, idx) => {
                      const badge = getSubjectBadgeStyle(note.subject);
                      return (
                        <div
                          key={note.id || idx}
                          onClick={() => setPreviewItem({ ...note, category: "notes" })}
                          className="p-3 rounded-2xl border transition-all hover:border-[#8B5CF6] flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 cursor-pointer active:scale-[0.99]"
                          style={{
                            background: "var(--bg-tertiary)",
                            borderColor: "var(--border-default)",
                          }}
                        >
                          <div className="flex items-start gap-2.5 flex-1 min-w-0">
                            <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 bg-purple-500/10 text-purple-600">
                              <FaFileLines size={16} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-1.5 flex-wrap mb-1">
                                <span
                                  className="px-2 py-0.2 rounded text-[10px] font-semibold"
                                  style={{
                                    background: badge.bg,
                                    color: badge.text,
                                    border: `1px solid ${badge.border}`,
                                  }}
                                >
                                  {note.subject}
                                </span>
                                <span className="text-[10px] font-semibold text-[var(--text-tertiary)]">
                                  {note.semester}
                                </span>
                                <span className="text-[10px] font-medium px-1.5 py-0.2 rounded bg-[var(--bg-secondary)] text-[var(--text-secondary)]">
                                  {note.noteType || "Handwritten"}
                                </span>
                              </div>
                              <h3 className="font-semibold text-xs sm:text-sm text-[var(--text-primary)] hover:text-[#8B5CF6] transition-colors truncate">
                                {note.title}
                              </h3>
                              <p className="text-[11px] text-[var(--text-secondary)] truncate mt-0.5">
                                {note.snippet || `By ${note.author}`}
                              </p>
                            </div>
                          </div>

                          <div
                            className="flex items-center justify-end gap-1.5 shrink-0 pt-1 sm:pt-0 border-t sm:border-t-0 border-[var(--border-default)]"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button
                              onClick={() => navigate(note.redirects.subjectNotes)}
                              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#8B5CF6] text-white hover:bg-purple-600 transition-colors flex items-center gap-1 shadow-sm active:scale-[0.98]"
                            >
                              <span>Open notes</span>
                              <ChevronRight size={13} />
                            </button>

                            {note.redirects.fileDirect && (
                              <a
                                href={note.redirects.fileDirect}
                                target="_blank"
                                rel="noreferrer"
                                className="p-1.5 rounded-lg bg-[var(--bg-secondary)] hover:bg-[var(--border-default)] text-[var(--text-primary)] transition-colors active:scale-[0.98]"
                                title="Download PDF"
                              >
                                <Download size={13} />
                              </a>
                            )}

                            <button
                              onClick={(e) => handleWhatsAppShare(note, e)}
                              className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 transition-colors active:scale-[0.98]"
                              title="Share on WhatsApp"
                            >
                              <FaWhatsapp size={13} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                    {displayedNotes.map((note, idx) => {
                      const badge = getSubjectBadgeStyle(note.subject);
                      return (
                        <div
                          key={note.id || idx}
                          onClick={() => setPreviewItem({ ...note, category: "notes" })}
                          className="rounded-2xl border p-4 flex flex-col justify-between transition-all hover:border-[#8B5CF6] cursor-pointer group active:scale-[0.99]"
                          style={{
                            background: "var(--bg-tertiary)",
                            borderColor: "var(--border-default)",
                          }}
                        >
                          <div>
                            <div className="flex items-center justify-between gap-2 mb-2">
                              <span
                                className="px-2 py-0.5 rounded text-[10px] font-semibold"
                                style={{
                                  background: badge.bg,
                                  color: badge.text,
                                  border: `1px solid ${badge.border}`,
                                }}
                              >
                                {note.subject}
                              </span>
                              <span className="text-[10px] font-medium text-[var(--text-tertiary)]">
                                {note.semester}
                              </span>
                            </div>

                            <div className="inline-block px-1.5 py-0.2 rounded text-[10px] font-semibold bg-[var(--bg-secondary)] text-[var(--text-secondary)] mb-1.5">
                              {note.noteType}
                            </div>

                            <h3 className="font-bold text-sm text-[var(--text-primary)] group-hover:text-[#8B5CF6] transition-colors line-clamp-2">
                              {note.title}
                            </h3>

                            <p className="text-xs text-[var(--text-secondary)] mt-1.5 line-clamp-2 leading-relaxed" style={{ textWrap: "pretty" }}>
                              {note.snippet}
                            </p>
                          </div>

                          <div
                            className="mt-3 pt-2.5 border-t border-[var(--border-default)] flex items-center justify-between gap-1.5"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button
                              onClick={() => navigate(note.redirects.subjectNotes)}
                              className="flex-1 py-1.5 px-2.5 rounded-lg text-xs font-semibold bg-[#8B5CF6] text-white hover:bg-purple-600 transition-colors flex items-center justify-center gap-1 shadow-sm active:scale-[0.98]"
                            >
                              <FaFileLines size={11} />
                              <span>Subject notes</span>
                            </button>

                            {note.redirects.fileDirect && (
                              <a
                                href={note.redirects.fileDirect}
                                target="_blank"
                                rel="noreferrer"
                                className="p-1.5 rounded-lg bg-[var(--bg-secondary)] hover:bg-[var(--border-default)] text-[var(--text-primary)] transition-colors active:scale-[0.98]"
                                title="Download PDF"
                              >
                                <Download size={13} />
                              </a>
                            )}

                            <button
                              onClick={(e) => handleWhatsAppShare(note, e)}
                              className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 transition-colors active:scale-[0.98]"
                              title="Share on WhatsApp"
                            >
                              <FaWhatsapp size={13} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* ─── YOUTUBE VIDEO LECTURES RESULTS ────────────────── */}
            {(activeCategory === "all" || activeCategory === "youtube") && displayedYoutube.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-red-500/10 text-red-500">
                      <FaYoutube size={14} />
                    </div>
                    <h2 className="text-sm sm:text-base font-bold text-[var(--text-primary)]">
                      YouTube video lectures ({displayedYoutube.length})
                    </h2>
                  </div>
                  {activeCategory === "all" && displayedYoutube.length > 4 && (
                    <button
                      onClick={() => handleCategoryChange("youtube")}
                      className="text-xs font-semibold text-red-500 hover:underline flex items-center gap-1"
                    >
                      <span>All {displayedYoutube.length} videos</span>
                      <ChevronRight size={13} />
                    </button>
                  )}
                </div>

                {viewMode === "list" ? (
                  <div className="space-y-2">
                    {displayedYoutube.map((video, idx) => {
                      const badge = getSubjectBadgeStyle(video.subject);
                      return (
                        <div
                          key={video.id || idx}
                          onClick={() => setPreviewItem({ ...video, category: "youtube" })}
                          className="p-3 rounded-2xl border transition-all hover:border-red-500 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 cursor-pointer active:scale-[0.99]"
                          style={{
                            background: "var(--bg-tertiary)",
                            borderColor: "var(--border-default)",
                          }}
                        >
                          <div className="flex items-start gap-2.5 flex-1 min-w-0">
                            {/* Video Thumbnail (64px wide on mobile) */}
                            <div className="w-16 h-11 sm:w-20 sm:h-14 rounded-xl overflow-hidden bg-black/40 shrink-0 relative">
                              {video.thumbnailUrl ? (
                                <img
                                  src={video.thumbnailUrl}
                                  alt={video.title}
                                  className="w-full h-full object-cover"
                                  loading="lazy"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-zinc-900 text-red-500">
                                  <FaYoutube size={18} />
                                </div>
                              )}
                              <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                                <Play size={11} className="text-white fill-white" />
                              </div>
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-1.5 flex-wrap mb-1">
                                <span
                                  className="px-2 py-0.2 rounded text-[10px] font-semibold"
                                  style={{
                                    background: badge.bg,
                                    color: badge.text,
                                    border: `1px solid ${badge.border}`,
                                  }}
                                >
                                  {video.subject}
                                </span>
                                {video.unitNumber && (
                                  <span className="text-[10px] font-medium px-1.5 py-0.2 rounded bg-[var(--bg-secondary)] text-[var(--text-secondary)]">
                                    Unit {video.unitNumber}
                                  </span>
                                )}
                              </div>
                              <h3 className="font-semibold text-xs sm:text-sm text-[var(--text-primary)] hover:text-red-500 transition-colors truncate">
                                {video.title}
                              </h3>
                              <p className="text-[11px] text-[var(--text-secondary)] truncate mt-0.5">
                                {video.channelTitle} • {video.duration || "Lecture"}
                              </p>
                            </div>
                          </div>

                          <div
                            className="flex items-center justify-end gap-1.5 shrink-0 pt-1 sm:pt-0 border-t sm:border-t-0 border-[var(--border-default)]"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button
                              onClick={() => navigate(video.redirects.subjectYouTube)}
                              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-600 text-white hover:bg-red-700 transition-colors flex items-center gap-1 shadow-sm active:scale-[0.98]"
                            >
                              <FaYoutube size={11} />
                              <span>Lectures</span>
                            </button>

                            {video.redirects.watchDirect && (
                              <a
                                href={video.redirects.watchDirect}
                                target="_blank"
                                rel="noreferrer"
                                className="p-1.5 rounded-lg bg-[var(--bg-secondary)] hover:bg-[var(--border-default)] text-[var(--text-primary)] transition-colors active:scale-[0.98]"
                                title="Watch on YouTube"
                              >
                                <ExternalLink size={13} />
                              </a>
                            )}

                            <button
                              onClick={(e) => handleWhatsAppShare(video, e)}
                              className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 transition-colors active:scale-[0.98]"
                              title="Share on WhatsApp"
                            >
                              <FaWhatsapp size={13} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                    {displayedYoutube.map((video, idx) => {
                      const badge = getSubjectBadgeStyle(video.subject);
                      return (
                        <div
                          key={video.id || idx}
                          onClick={() => setPreviewItem({ ...video, category: "youtube" })}
                          className="rounded-2xl border overflow-hidden flex flex-col justify-between transition-all hover:border-red-500 cursor-pointer group active:scale-[0.99]"
                          style={{
                            background: "var(--bg-tertiary)",
                            borderColor: "var(--border-default)",
                          }}
                        >
                          <div className="relative aspect-video w-full bg-black/40 overflow-hidden">
                            {video.thumbnailUrl ? (
                              <img
                                src={video.thumbnailUrl}
                                alt={video.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                loading="lazy"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-zinc-900 text-zinc-600">
                                <FaYoutube size={30} />
                              </div>
                            )}

                            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <div className="w-10 h-10 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg">
                                <Play size={16} className="ml-0.5 fill-white" />
                              </div>
                            </div>

                            <div className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded text-[10px] font-bold bg-black/80 text-white backdrop-blur-sm">
                              {video.isPlaylist ? "Full playlist" : video.duration || "Video"}
                            </div>
                          </div>

                          <div className="p-3.5 space-y-1.5 flex-1 flex flex-col justify-between">
                            <div>
                              <div className="flex items-center gap-1.5 flex-wrap mb-1">
                                <span
                                  className="px-2 py-0.2 rounded text-[10px] font-semibold"
                                  style={{
                                    background: badge.bg,
                                    color: badge.text,
                                    border: `1px solid ${badge.border}`,
                                  }}
                                >
                                  {video.subject}
                                </span>
                                {video.unitNumber && (
                                  <span className="px-1.5 py-0.2 rounded text-[10px] font-medium bg-[var(--bg-secondary)] text-[var(--text-secondary)]">
                                    Unit {video.unitNumber}
                                  </span>
                                )}
                              </div>
                              <h3 className="font-bold text-xs sm:text-sm text-[var(--text-primary)] group-hover:text-red-500 transition-colors line-clamp-2">
                                {video.title}
                              </h3>
                            </div>
                            <span className="text-[11px] font-medium text-[var(--text-tertiary)]">{video.channelTitle}</span>
                          </div>

                          <div
                            className="px-3.5 pb-3.5 pt-1 flex items-center gap-2 border-t border-[var(--border-default)]"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button
                              onClick={() => navigate(video.redirects.subjectYouTube)}
                              className="flex-1 py-1.5 px-2.5 rounded-lg text-xs font-semibold bg-red-600 text-white hover:bg-red-700 transition-colors flex items-center justify-center gap-1 shadow-sm active:scale-[0.98]"
                            >
                              <FaYoutube size={11} />
                              <span>Lectures</span>
                            </button>

                            {video.redirects.watchDirect && (
                              <a
                                href={video.redirects.watchDirect}
                                target="_blank"
                                rel="noreferrer"
                                className="p-1.5 rounded-lg bg-[var(--bg-secondary)] hover:bg-[var(--border-default)] text-[var(--text-primary)] transition-colors active:scale-[0.98]"
                                title="Watch on YouTube"
                              >
                                <ExternalLink size={13} />
                              </a>
                            )}

                            <button
                              onClick={(e) => handleWhatsAppShare(video, e)}
                              className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 transition-colors active:scale-[0.98]"
                              title="Share on WhatsApp"
                            >
                              <FaWhatsapp size={13} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* ─── SUBJECTS AND UNITS HUB RESULTS ───────────────── */}
            {(activeCategory === "all" || activeCategory === "subjects") && displayedSubjects.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-500">
                      <BookOpen size={14} />
                    </div>
                    <h2 className="text-sm sm:text-base font-bold text-[var(--text-primary)]">
                      Subjects and syllabus units ({displayedSubjects.length})
                    </h2>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {displayedSubjects.map((subject, idx) => {
                    const badge = getSubjectBadgeStyle(subject.title);
                    return (
                      <div
                        key={subject.id || idx}
                        onClick={() => setPreviewItem({ ...subject, category: "subjects" })}
                        className="rounded-2xl border p-4 flex flex-col justify-between transition-all hover:border-blue-500 cursor-pointer group active:scale-[0.99]"
                        style={{
                          background: "var(--bg-tertiary)",
                          borderColor: "var(--border-default)",
                        }}
                      >
                        <div>
                          <div className="flex items-center justify-between gap-2 mb-1.5">
                            <span
                              className="px-2 py-0.5 rounded text-[10px] font-semibold"
                              style={{
                                background: badge.bg,
                                color: badge.text,
                                border: `1px solid ${badge.border}`,
                              }}
                            >
                              {subject.code || "RTU subject"}
                            </span>
                            <span className="text-[11px] font-semibold text-[var(--text-secondary)]">
                              {subject.semester}
                            </span>
                          </div>

                          <h3 className="text-sm sm:text-base font-bold text-[var(--text-primary)] group-hover:text-blue-500 transition-colors">
                            {subject.title}
                          </h3>
                          <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                            {subject.department} • {subject.totalUnits} Units
                          </p>

                          {subject.matchedUnits && subject.matchedUnits.length > 0 && (
                            <div className="mt-2.5 p-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-default)] space-y-1">
                              <span className="text-[10px] font-semibold text-[var(--text-primary)] flex items-center gap-1">
                                <CheckCircle2 size={12} className="text-[#7DC67A]" /> Matched chapters:
                              </span>
                              {subject.matchedUnits.slice(0, 2).map((u, ui) => (
                                <div key={ui} className="text-[11px] text-[var(--text-secondary)] flex items-center justify-between">
                                  <span className="truncate mr-2 font-medium">Unit {u.unitNumber}: {u.title}</span>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      navigate(`/rtu-exams/subject/${encodeURIComponent(subject.title)}/youtube?unit=${u.unitNumber}`);
                                    }}
                                    className="text-[10px] text-red-500 hover:underline font-semibold shrink-0"
                                  >
                                    Watch
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        <div
                          className="mt-3.5 pt-2.5 border-t border-[var(--border-default)] grid grid-cols-3 gap-1.5"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            onClick={() => navigate(subject.redirects.subjectYouTube)}
                            className="py-1.5 px-1 rounded-lg text-xs font-semibold bg-red-600/10 text-red-600 hover:bg-red-600 hover:text-white transition-colors flex items-center justify-center gap-1 active:scale-[0.98]"
                          >
                            <FaYoutube size={11} />
                            <span>Videos</span>
                          </button>
                          <button
                            onClick={() => navigate(subject.redirects.subjectNotes)}
                            className="py-1.5 px-1 rounded-lg text-xs font-semibold bg-purple-600/10 text-purple-600 hover:bg-purple-600 hover:text-white transition-colors flex items-center justify-center gap-1 active:scale-[0.98]"
                          >
                            <FaFileLines size={11} />
                            <span>Notes</span>
                          </button>
                          <button
                            onClick={() => navigate(subject.redirects.pyqAnalysis)}
                            className="py-1.5 px-1 rounded-lg text-xs font-semibold bg-emerald-600/10 text-emerald-600 hover:bg-emerald-600 hover:text-white transition-colors flex items-center justify-center gap-1 active:scale-[0.98]"
                          >
                            <FaChartBar size={11} />
                            <span>PYQs</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ─── PYQ PAPERS & QUESTIONS RESULTS ────────────────── */}
            {(activeCategory === "all" || activeCategory === "pyq") && displayedPyq.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-500">
                      <FaChartBar size={14} />
                    </div>
                    <h2 className="text-sm sm:text-base font-bold text-[var(--text-primary)]">
                      RTU previous year exam papers ({displayedPyq.length})
                    </h2>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {displayedPyq.map((pyq, idx) => {
                    const badge = getSubjectBadgeStyle(pyq.subject);
                    return (
                      <div
                        key={pyq.id || idx}
                        onClick={() => setPreviewItem({ ...pyq, category: "pyq" })}
                        className="rounded-2xl border p-4 flex flex-col justify-between transition-all hover:border-emerald-500 cursor-pointer group active:scale-[0.99]"
                        style={{
                          background: "var(--bg-tertiary)",
                          borderColor: "var(--border-default)",
                        }}
                      >
                        <div>
                          <div className="flex items-center justify-between gap-2 mb-1.5">
                            <span
                              className="px-2 py-0.5 rounded text-[10px] font-semibold"
                              style={{
                                background: badge.bg,
                                color: badge.text,
                                border: `1px solid ${badge.border}`,
                              }}
                            >
                              {pyq.subject}
                            </span>
                            <div className="flex items-center gap-1.5">
                              {pyq.year && (
                                <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-600">
                                  {pyq.year} paper
                                </span>
                              )}
                              {pyq.marks && (
                                <span className="px-1.5 py-0.2 rounded text-[10px] font-medium bg-[var(--bg-secondary)] text-[var(--text-secondary)]">
                                  {pyq.marks} marks
                                </span>
                              )}
                            </div>
                          </div>

                          <h3 className="font-semibold text-xs sm:text-sm text-[var(--text-primary)] group-hover:text-emerald-500 transition-colors">
                            {pyq.title}
                          </h3>

                          {pyq.snippet && (
                            <div className="mt-2 p-2 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-default)]">
                              <p className="text-[11px] text-[var(--text-primary)] leading-relaxed line-clamp-2">
                                "{pyq.snippet}"
                              </p>
                            </div>
                          )}
                        </div>

                        <div
                          className="mt-3 pt-2.5 border-t border-[var(--border-default)] flex items-center justify-between gap-1.5"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            onClick={() => navigate(pyq.redirects.pyqAnalysis)}
                            className="flex-1 py-1.5 px-2.5 rounded-lg text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700 transition-colors flex items-center justify-center gap-1 shadow-sm active:scale-[0.98]"
                          >
                            <FaChartBar size={11} />
                            <span>Exam analysis</span>
                          </button>

                          <button
                            onClick={(e) => handleWhatsAppShare(pyq, e)}
                            className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 transition-colors active:scale-[0.98]"
                            title="Share on WhatsApp"
                          >
                            <FaWhatsapp size={13} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ─── QUICK PREVIEW BOTTOM SHEET MODAL (MOBILE FIRST) ───── */}
        <AnimatePresence>
          {previewItem && (
            <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm">
              <motion.div
                initial={{ y: "100%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: "100%", opacity: 0 }}
                transition={{ duration: 0.5, ease: BASE_EASE }}
                className="w-full max-w-xl max-h-[85vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl p-5 sm:p-6 border shadow-2xl space-y-4"
                style={{
                  background: "var(--bg-tertiary)",
                  borderColor: "var(--border-default)",
                }}
              >
                <div className="w-10 h-1 rounded-full bg-[var(--border-default)] mx-auto -mt-1 mb-2 sm:hidden" />

                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span
                      className="px-2.5 py-1 rounded-md text-xs font-semibold"
                      style={getSubjectBadgeStyle(previewItem.subject || previewItem.title)}
                    >
                      {previewItem.subject || "Engineering resource"}
                    </span>
                    <span className="text-xs font-semibold text-[var(--text-secondary)]">
                      {previewItem.semester || "RTU"}
                    </span>
                  </div>
                  <button
                    onClick={() => setPreviewItem(null)}
                    className="p-1 rounded-full hover:bg-[var(--bg-secondary)] text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>

                <div>
                  <h3 className="text-base sm:text-lg font-bold text-[var(--text-primary)] leading-snug">
                    {previewItem.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-2 leading-relaxed" style={{ textWrap: "pretty" }}>
                    {previewItem.description || previewItem.snippet || "Full verified syllabus material and exam preparation guide."}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-default)] text-xs">
                  <div>
                    <span className="text-[10px] uppercase font-semibold text-[var(--text-tertiary)]">Resource type</span>
                    <p className="font-semibold text-[var(--text-primary)] mt-0.5 capitalize">
                      {previewItem.noteType || previewItem.category || "Study material"}
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-semibold text-[var(--text-tertiary)]">Contributor</span>
                    <p className="font-semibold text-[var(--text-primary)] mt-0.5 truncate">
                      {previewItem.author || previewItem.channelTitle || "Medha engineering faculty"}
                    </p>
                  </div>
                </div>

                <div className="space-y-2 pt-1">
                  <button
                    onClick={(e) => handleWhatsAppShare(previewItem, e)}
                    className="w-full py-2.5 px-3 rounded-lg text-xs sm:text-sm font-semibold bg-[#25D366] text-white hover:bg-green-600 transition-colors flex items-center justify-center gap-2 shadow-sm active:scale-[0.98]"
                  >
                    <FaWhatsapp size={15} />
                    <span>Share with classmates on WhatsApp</span>
                  </button>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => {
                        const target = previewItem.redirects?.subjectNotes || previewItem.redirects?.subjectYouTube || previewItem.redirects?.pyqAnalysis || "/notes";
                        setPreviewItem(null);
                        navigate(target);
                      }}
                      className="py-2 px-3 rounded-lg text-xs font-semibold bg-[var(--action-primary, #7DC67A)] text-white hover:opacity-90 transition-opacity flex items-center justify-center gap-1.5 shadow-sm active:scale-[0.98]"
                    >
                      <GraduationCap size={15} />
                      <span>Open subject hub</span>
                    </button>

                    <button
                      onClick={(e) => handleCopyLink(previewItem, e)}
                      className="py-2 px-3 rounded-lg text-xs font-semibold bg-[var(--bg-secondary)] border border-[var(--border-default)] text-[var(--text-primary)] hover:border-[#7DC67A] transition-colors flex items-center justify-center gap-1.5 active:scale-[0.98]"
                    >
                      {copiedLink ? <Check size={14} className="text-[#7DC67A]" /> : <Copy size={14} />}
                      <span>{copiedLink ? "Link copied" : "Copy link"}</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

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
