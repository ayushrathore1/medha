"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { apiGet, apiPost } from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Sparkles, Play, ExternalLink, ThumbsUp, Eye, Clock, Star, TrendingUp, BookOpen, ChevronDown, Shield, Zap, Filter, Loader2, AlertCircle, Youtube, GraduationCap, Lightbulb, CheckCircle, Brain, FileText } from "lucide-react";
import Link from "next/link";

interface Video {
  videoId: string;
  title: string;
  thumbnail: string;
  channelTitle?: string;
  channelName?: string;
  duration?: string;
  viewCount: number;
  likeCount: number;
  isTrustedChannel?: boolean;
  explanation?: string;
  matchedTopics?: string[];
  aiScore?: number;
}

interface Article {
  title: string;
  snippet: string;
  link: string;
  explanation?: string;
  aiScore?: number;
}

interface SearchResults {
  youtube?: Video[];
  gfg?: Article[];
  studyTip?: string;
  topPick?: string;
  channelsUsed?: string[];
}

interface Subject {
  code: string;
  name: string;
  semester: number;
}

interface Unit {
  unitNumber: number;
  title: string;
  topics: string[];
}

const ScoreCircle = ({ score, size = 48 }: { score: number; size?: number }) => {
  const radius = (size - 6) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const getColor = () => {
    if (score >= 80) return "#4A9E47";
    if (score >= 60) return "#F59E0B";
    if (score >= 40) return "#f97316";
    return "#ef4444";
  };

  return (
    <div style={{ width: size, height: size, position: "relative" }}>
      <svg width={size} height={size} className="rotate-[-90deg]">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="var(--border)" strokeWidth="3" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={getColor()}
          strokeWidth="3"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-[stroke-dashoffset] duration-1000 ease-out"
        />
      </svg>
      <span
        style={{ color: getColor(), fontSize: size * 0.3 }}
        className="absolute inset-0 flex items-center justify-center font-bold"
      >
        {score}
      </span>
    </div>
  );
};

export default function MedhaRecommendationsPage() {
  const { isAuthenticated } = useAuth();
  const [topic, setTopic] = useState("");
  const [subject, setSubject] = useState("");
  const [unit, setUnit] = useState("");
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);
  const [trending, setTrending] = useState<string[]>([]);
  const [results, setResults] = useState<SearchResults | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [tab, setTab] = useState<"all" | "youtube" | "gfg">("all");
  const [syllabusConnected, setSyllabusConnected] = useState(false);

  useEffect(() => {
    const fetchInit = async () => {
      try {
        const [subRes, trendRes, sylRes] = await Promise.all([
          apiGet<{ subjects: Subject[]; source?: string }>("/api/recommendations/subjects").catch(() => ({ subjects: [] })),
          apiGet<{ topics: string[] }>("/api/recommendations/trending").catch(() => ({ topics: [] })),
          apiGet<{ semesters: any[] }>("/api/recommendations/syllabus").catch(() => ({ semesters: [] })),
        ]);
        setSubjects(subRes.subjects || []);
        setTrending(trendRes.topics || []);
        if (sylRes.semesters && sylRes.semesters.length > 0) {
          setSyllabusConnected(true);
        }
      } catch {}
    };
    fetchInit();
  }, []);

  useEffect(() => {
    if (!subject) {
      setUnits([]);
      setUnit("");
      return;
    }
    const fetchUnits = async () => {
      try {
        const res = await apiGet<{ units: Unit[] }>(`/api/recommendations/units/${encodeURIComponent(subject)}`);
        setUnits(res.units || []);
      } catch {
        setUnits([]);
      }
    };
    fetchUnits();
  }, [subject]);

  const handleSearch = async (searchTopic?: string) => {
    const q = (searchTopic || topic).trim();
    if (q.length < 2) return;
    setLoading(true);
    setError("");
    setResults(null);
    try {
      const res = await apiPost<{ data: SearchResults }>("/api/recommendations/search", {
        topic: q,
        subject,
        unit,
      });
      setResults(res.data);
      setTab("all");
    } catch (err: any) {
      setError(err.message || "Search failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearch();
  };

  const displayYT = results?.youtube || [];
  const displayGfg = results?.gfg || [];

  const formatNumber = (num?: number) => {
    if (!num) return "0";
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(1) + "K";
    return num.toString();
  };

  return (
    <div style={{ maxWidth: 900, margin: "32px auto", padding: "0 16px" }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-10"
      >
        <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[var(--secondary)] border border-[var(--border)] text-xs font-semibold text-[var(--primary)] mb-3 uppercase tracking-wider">
          <GraduationCap size={14} /> Smart Lecture Finder
        </div>
        {syllabusConnected && (
          <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-[10px] font-bold ml-2">
            <CheckCircle size={10} /> Syllabus Connected
          </div>
        )}
        <h1 className="text-3xl md:text-4xl font-black text-[var(--foreground)] tracking-tight mb-2">
          Find the Best Lectures<span className="text-[var(--primary)]">.</span>
        </h1>
        <p className="text-sm text-[var(--muted-foreground)] leading-relaxed max-w-lg mx-auto">
          AI-curated engineering lectures scored against your actual university syllabus.
        </p>
      </motion.div>

      {/* Selectors */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4"
      >
        {subjects.length > 0 && (
          <div className="relative">
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-[var(--card)] border border-[var(--border)] text-[var(--foreground)] text-xs font-semibold appearance-none outline-none cursor-pointer focus:border-[var(--primary)]"
            >
              <option value="">All Subjects</option>
              {subjects.map((s) => (
                <option key={s.code} value={s.name}>
                  {s.name} (Sem {s.semester})
                </option>
              ))}
            </select>
            <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] pointer-events-none" />
          </div>
        )}

        {units.length > 0 && (
          <div className="relative">
            <select
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-[var(--card)] border border-[var(--border)] text-[var(--foreground)] text-xs font-semibold appearance-none outline-none cursor-pointer focus:border-[var(--primary)]"
            >
              <option value="">All Units</option>
              {units.map((u) => (
                <option key={u.unitNumber} value={u.title}>
                  Unit {u.unitNumber}: {u.title}
                </option>
              ))}
            </select>
            <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] pointer-events-none" />
          </div>
        )}
      </motion.div>

      {/* Search Input */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="flex gap-2.5 mb-6"
      >
        <div className="relative flex-1">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)]" />
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search any engineering topic... e.g. SQL Joins, Binary Trees"
            className="w-full pl-11 pr-4 py-3 rounded-xl bg-[var(--card)] border border-[var(--border)] text-[var(--foreground)] text-sm outline-none transition-all focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/10"
          />
        </div>
        <button
          onClick={() => handleSearch()}
          disabled={loading || topic.trim().length < 2}
          className="px-5 py-3 rounded-xl bg-[var(--foreground)] text-[var(--card)] hover:opacity-90 disabled:opacity-50 text-sm font-bold flex items-center gap-1.5 cursor-pointer transition-all border-none"
        >
          {loading ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
          Search
        </button>
      </motion.div>

      {/* Chips */}
      {!results && !loading && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="mb-8">
          <p className="text-[10px] font-extrabold text-[var(--muted-foreground)] uppercase tracking-wider mb-2.5 flex items-center gap-1">
            <TrendingUp size={12} />
            {units.length > 0 ? "Topics from syllabus:" : "Trending topics:"}
          </p>
          <div className="flex gap-2 flex-wrap">
            {(units.length > 0 ? units.flatMap((u) => u.topics.slice(0, 2)) : trending).slice(0, 10).map((t) => (
              <button
                key={t}
                onClick={() => {
                  setTopic(t);
                  handleSearch(t);
                }}
                className="px-3.5 py-1 rounded-full bg-[var(--primary)]/10 hover:bg-[var(--primary)]/15 border border-[var(--primary)]/15 hover:border-[var(--primary)]/30 text-[var(--primary)] text-xs font-semibold cursor-pointer transition-all"
              >
                {t}
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Loading Steps */}
      {loading && (
        <div className="p-10 flex flex-col items-center gap-6 bg-[var(--card)] border border-[var(--border)] rounded-2xl">
          <Loader2 size={36} className="text-[var(--primary)] animate-spin" />
          <div className="flex flex-col gap-2 w-full max-w-xs">
            {[
              "Searching approved channels...",
              "Fetching YouTube results...",
              "Loading syllabus context...",
              "AI scoring relevance against syllabus...",
              "Ranking lectures...",
            ].map((text, i) => (
              <div key={i} className="flex items-center gap-2 text-xs font-semibold text-[var(--muted-foreground)]">
                <div className="w-1.5 h-1.5 rounded-full bg-[var(--primary)]" />
                {text}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-4 bg-red-500/5 border border-red-500/15 rounded-xl text-red-500 text-xs font-semibold flex items-center gap-2 mb-6"
        >
          <AlertCircle size={14} />
          {error}
        </motion.div>
      )}

      {/* Results */}
      {results && !loading && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          {results.studyTip && (
            <div className="p-5 rounded-2xl bg-[var(--secondary)] border border-[var(--border)] mb-6 flex items-start gap-3">
              <Lightbulb size={18} className="text-amber-500 flex-shrink-0 mt-0.5" />
              <div>
                <span className="text-[10px] font-bold text-[var(--primary)] uppercase tracking-wider">AI Study Tip</span>
                <p className="text-xs text-[var(--muted-foreground)] leading-relaxed mt-1 font-semibold">{results.studyTip}</p>
              </div>
            </div>
          )}

          <div className="flex justify-between items-center gap-4 mb-6 flex-wrap">
            <div className="flex gap-2 p-1 rounded-xl bg-[var(--secondary)] border border-[var(--border)]">
              {(["all", "youtube", "gfg"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    tab === t ? "bg-[var(--primary)] text-white shadow-sm" : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                  }`}
                >
                  {t === "all" ? "All" : t === "youtube" ? "YouTube" : "GeeksforGeeks"}
                </button>
              ))}
            </div>
          </div>

          {/* YouTube Section */}
          {(tab === "all" || tab === "youtube") && displayYT.length > 0 && (
            <div className="mb-8">
              {tab === "all" && (
                <h3 className="font-extrabold text-sm text-[var(--foreground)] flex items-center gap-2 mb-4">
                  <Youtube size={16} className="text-red-500" /> YouTube Video Lectures
                </h3>
              )}
              <div className="space-y-4">
                {displayYT.map((video, i) => {
                  const isTopPick = results.topPick === `YT_${i}` || (i === 0 && !results.topPick?.startsWith("GFG"));
                  return (
                    <motion.div
                      key={video.videoId}
                      whileHover={{ y: -2, border: "1px solid var(--primary)", boxShadow: "0 8px 20px rgba(0,0,0,0.04)" }}
                      onClick={() => window.open(`https://youtube.com/watch?v=${video.videoId}`, "_blank")}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col sm:flex-row gap-5 relative overflow-hidden ${
                        isTopPick ? "bg-[var(--primary)]/5 border-[var(--primary)]" : "bg-[var(--card)] border-[var(--border)]"
                      }`}
                    >
                      {isTopPick && (
                        <span className="absolute top-0 right-4 px-3 py-1 bg-gradient-to-r from-[var(--primary)] to-[#d46936] text-white font-extrabold text-[9px] uppercase tracking-wider rounded-b-lg flex items-center gap-1 shadow-sm">
                          <Star size={9} fill="white" /> Top Pick
                        </span>
                      )}

                      <div className="relative w-full sm:w-44 h-24 rounded-xl overflow-hidden bg-[var(--secondary)] flex-shrink-0">
                        <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover" />
                        {video.duration && (
                          <span className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-black/80 text-white text-[9px] font-black">{video.duration}</span>
                        )}
                        {video.isTrustedChannel && (
                          <span className="absolute top-2 left-2 px-2 py-0.5 bg-emerald-500 text-white rounded text-[8px] font-bold flex items-center gap-1">
                            <Shield size={9} /> Verified Channel
                          </span>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <h4 className="font-extrabold text-sm text-[var(--foreground)] leading-snug line-clamp-2 mb-2">{video.title}</h4>
                        <p className="text-[11px] text-[var(--muted-foreground)] font-semibold flex items-center gap-1 mb-2">
                          <Youtube size={12} className="text-red-500" /> {video.channelTitle || video.channelName}
                        </p>
                        <div className="flex gap-4 text-[10px] font-extrabold text-[var(--muted-foreground)] mb-3">
                          <span className="flex items-center gap-1">
                            <Eye size={12} /> {formatNumber(video.viewCount)} views
                          </span>
                          <span className="flex items-center gap-1">
                            <ThumbsUp size={12} /> {formatNumber(video.likeCount)} likes
                          </span>
                        </div>
                        {video.explanation && (
                          <p className="text-xs text-[var(--primary)] font-semibold italic flex items-center gap-1 mt-2">
                            <Sparkles size={11} /> {video.explanation}
                          </p>
                        )}
                      </div>

                      <div className="flex flex-col items-center justify-center flex-shrink-0 self-center border border-dashed border-[var(--border)] p-3.5 rounded-xl bg-[var(--secondary)]/35 min-w-[70px]">
                        <ScoreCircle score={video.aiScore || 0} />
                        <span className="text-[9px] font-extrabold text-[var(--muted-foreground)] uppercase tracking-wider mt-1.5">Relevance</span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          )}

          {/* GFG Section */}
          {(tab === "all" || tab === "gfg") && displayGfg.length > 0 && (
            <div>
              {tab === "all" && (
                <h3 className="font-extrabold text-sm text-[var(--foreground)] flex items-center gap-2 mb-4 mt-6">
                  <FileText size={16} className="text-[var(--primary)]" /> GeeksforGeeks Articles
                </h3>
              )}
              <div className="space-y-3">
                {displayGfg.map((article, i) => (
                  <motion.a
                    key={i}
                    href={article.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ y: -1, borderColor: "var(--primary)", boxShadow: "0 6px 15px rgba(0,0,0,0.03)" }}
                    className="p-4 rounded-xl bg-[var(--card)] border border-[var(--border)] hover:border-[var(--primary)]/50 transition-all flex items-center gap-4 text-decoration-none"
                  >
                    <div className="w-10 h-10 rounded-xl bg-[var(--primary)]/10 flex items-center justify-center text-[var(--primary)] border border-[var(--primary)]/10 flex-shrink-0">
                      <FileText size={18} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-extrabold text-xs text-[var(--foreground)] leading-snug line-clamp-1">{article.title}</h4>
                      <p className="text-[11px] text-[var(--muted-foreground)] truncate mt-0.5 leading-relaxed">{article.snippet}</p>
                      {article.explanation && (
                        <p className="text-[10px] text-[var(--primary)] font-semibold italic flex items-center gap-1 mt-1.5">
                          <Sparkles size={10} /> {article.explanation}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <ScoreCircle score={article.aiScore || 0} size={36} />
                      <ExternalLink size={14} className="text-[var(--muted-foreground)]" />
                    </div>
                  </motion.a>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* Welcome state */}
      {!results && !loading && !error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16 px-4 bg-[var(--card)] border border-[var(--border)] rounded-2xl max-w-xl mx-auto my-10"
        >
          <div className="w-16 h-16 rounded-full bg-[var(--secondary)] border border-[var(--border)] flex items-center justify-center mx-auto mb-5 shadow-sm">
            <GraduationCap size={32} className="text-[var(--primary)]" />
          </div>
          <p className="text-base font-bold text-[var(--foreground)] mb-1">Search for any engineering topic</p>
          <p className="text-xs text-[var(--muted-foreground)] mb-6 leading-relaxed">
            {syllabusConnected
              ? "Your syllabus is linked. Search results will be scored and customized to your specific syllabus."
              : "Link your college profile and syllabus to enable context-matched recommendations."}
          </p>
          {!syllabusConnected && (
            <Link
              href="/profile"
              className="inline-flex items-center gap-1.5 px-4.5 py-2 rounded-xl bg-[var(--primary)]/10 hover:bg-[var(--primary)]/15 border border-[var(--primary)]/20 text-[var(--primary)] text-xs font-bold transition-all text-decoration-none"
            >
              <BookOpen size={12} /> Configure Profile Syllabus
            </Link>
          )}
        </motion.div>
      )}
    </div>
  );
}
