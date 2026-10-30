import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  searchDatabase,
  fetchSearchSuggestions,
  fetchPopularSearches
} from "../api/api";
import {
  LOCAL_STORAGE_KEY,
  VIEW_MODE_KEY
} from "../components/SearchEngine/searchConstants";
import { getClientCache, setClientCache } from "../components/SearchEngine/searchCache";

export function useSearchEngine() {
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

  return {
    query,
    setQuery,
    activeCategory,
    setActiveCategory,
    selectedSemester,
    setSelectedSemester,
    selectedSubject,
    sortBy,
    setSortBy,
    viewMode,
    loading,
    responseTime,
    isCachedResult,
    results,
    counts,
    topMatches,
    popularSearches,
    recentSearches,
    suggestions,
    showSuggestions,
    setShowSuggestions,
    isFocused,
    setIsFocused,
    previewItem,
    setPreviewItem,
    showFilterDrawer,
    setShowFilterDrawer,
    copiedLink,
    isScrolled,
    inputRef,
    handleToggleViewMode,
    handleInputChange,
    handleSubmit,
    handleSelectQuery,
    handleCategoryChange,
    handleSemesterChange,
    handleWhatsAppShare,
    handleCopyLink,
    removeRecentSearch,
    clearAllRecent,
    executeSearch,
    displayedNotes,
    displayedYoutube,
    displayedSubjects,
    displayedPyq,
    totalResultsCount,
    navigate,
  };
}
