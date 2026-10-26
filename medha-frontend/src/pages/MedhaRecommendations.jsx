import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Sparkles,
  Play,
  ExternalLink,
  ThumbsUp,
  Eye,
  Clock,
  Star,
  TrendingUp,
  BookOpen,
  ChevronDown,
  Shield,
  Zap,
  Filter,
  Loader2,
  AlertCircle,
  Youtube,
  GraduationCap,
  Lightbulb,
  CheckCircle,
  Brain,
  FileText,
} from "lucide-react";
import { Link } from "react-router-dom";
import api from "../api/api";

// ─── Design Tokens (matches app theme) ──────────────────────
const T = {
  bg: "#F2EDE4",
  bgCard: "white",
  bgTertiary: "#F9F6F1",
  text: "#1A1A2E",
  textSecondary: "#6B6B6B",
  textMuted: "#9A9A9A",
  border: "#E8E4DC",
  accent: "#7DC67A",
  accentDark: "#4A9E47",
  accentSecondary: "#A78BFA",
  amber: "#F59E0B",
  font: "'DM Sans', 'Inter', sans-serif",
};

// ─── Score Circle SVG ───────────────────────────────────────
const ScoreCircle = ({ score, size = 48 }) => {
  const radius = (size - 6) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const getColor = () => {
    if (score >= 80) return T.accentDark;
    if (score >= 60) return T.amber;
    if (score >= 40) return "#f97316";
    return "#ef4444";
  };

  return (
    <div style={{ width: size, height: size, position: "relative" }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={T.border} strokeWidth="3" />
        <circle
          cx={size / 2} cy={size / 2} r={radius} fill="none"
          stroke={getColor()} strokeWidth="3"
          strokeDasharray={circumference} strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 1s ease-out" }}
        />
      </svg>
      <span style={{
        position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: size * 0.3, fontWeight: 700, color: getColor(),
      }}>
        {score}
      </span>
    </div>
  );
};

// ─── Video Card ─────────────────────────────────────────────
const VideoCard = ({ video, index, isTopPick }) => {
  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(1) + "K";
    return num?.toString() || "0";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      className="rec-video-card"
      style={{
        background: isTopPick
          ? "linear-gradient(135deg, rgba(125,198,122,0.08), rgba(74,158,71,0.04))"
          : T.bgCard,
        border: isTopPick
          ? `1.5px solid ${T.accent}`
          : `1.5px solid ${T.border}`,
        borderRadius: 16,
        padding: 16,
        display: "flex",
        gap: 16,
        position: "relative",
        transition: "all 0.2s ease",
        cursor: "pointer",
      }}
      whileHover={{ y: -2, boxShadow: "0 8px 24px rgba(0,0,0,0.08)" }}
      onClick={() => window.open(`https://youtube.com/watch?v=${video.videoId}`, "_blank")}
    >
      {isTopPick && (
        <div style={{
          position: "absolute", top: -10, right: 16,
          background: `linear-gradient(135deg, ${T.accent}, ${T.accentDark})`,
          color: "#fff", padding: "3px 12px", borderRadius: 100,
          fontSize: 11, fontWeight: 700, display: "flex", alignItems: "center", gap: 4,
          boxShadow: "0 2px 8px rgba(125,198,122,0.3)",
        }}>
          <Star size={12} /> TOP PICK
        </div>
      )}

      {/* Thumbnail */}
      <div className="rec-video-thumb" style={{ flexShrink: 0, width: 180, position: "relative" }}>
        <img
          src={video.thumbnail} alt={video.title}
          style={{ width: "100%", height: 100, objectFit: "cover", borderRadius: 10 }}
        />
        {video.duration && (
          <span style={{
            position: "absolute", bottom: 6, right: 6,
            background: "rgba(0,0,0,0.75)", color: "#fff",
            padding: "2px 6px", borderRadius: 4, fontSize: 11, fontWeight: 600,
          }}>
            {video.duration}
          </span>
        )}
        {video.isTrustedChannel && (
          <span style={{
            position: "absolute", top: 6, left: 6,
            background: `rgba(74,158,71,0.9)`, color: "#fff",
            padding: "2px 6px", borderRadius: 4, fontSize: 10, fontWeight: 700,
            display: "flex", alignItems: "center", gap: 3,
          }}>
            <Shield size={10} /> Verified
          </span>
        )}
      </div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <h4 style={{
          fontSize: 14, fontWeight: 600, color: T.text, marginBottom: 4,
          display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical",
          overflow: "hidden", lineHeight: 1.4,
        }}>
          {video.title}
        </h4>
        <p style={{ fontSize: 12, color: T.textMuted, marginBottom: 6, display: "flex", alignItems: "center", gap: 4 }}>
          <Youtube size={12} /> {video.channelTitle || video.channelName}
        </p>
        <div style={{ display: "flex", gap: 12, fontSize: 11, color: T.textMuted, marginBottom: 8 }}>
          <span style={{ display: "flex", alignItems: "center", gap: 3 }}>
            <Eye size={11} /> {formatNumber(video.viewCount)}
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: 3 }}>
            <ThumbsUp size={11} /> {formatNumber(video.likeCount)}
          </span>
        </div>

        {video.explanation && (
          <p style={{ fontSize: 11, color: T.accentDark, fontStyle: "italic", marginBottom: 6, lineHeight: 1.4 }}>
            <Sparkles size={11} style={{ display: "inline", marginRight: 4 }} />
            {video.explanation}
          </p>
        )}

        {video.matchedTopics?.length > 0 && (
          <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
            {video.matchedTopics.slice(0, 3).map((t, i) => (
              <span key={i} style={{
                background: "rgba(125,198,122,0.12)", color: T.accentDark,
                padding: "2px 8px", borderRadius: 100, fontSize: 10, fontWeight: 600,
                border: `1px solid rgba(125,198,122,0.2)`,
              }}>
                {t}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Score */}
      <div className="rec-score-col" style={{ flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 4 }}>
        <ScoreCircle score={video.aiScore || 0} />
        <span style={{ fontSize: 9, color: T.textMuted, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}>
          Relevance
        </span>
      </div>
    </motion.div>
  );
};

// ─── GFG Card ───────────────────────────────────────────────
const GfgCard = ({ article, index }) => (
  <motion.a
    href={article.link} target="_blank" rel="noopener noreferrer"
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.08 }}
    style={{
      display: "flex", gap: 12, padding: 14,
      background: T.bgCard, border: `1.5px solid ${T.border}`,
      borderRadius: 14, textDecoration: "none",
      transition: "all 0.2s ease", alignItems: "center",
    }}
    whileHover={{ borderColor: T.accent, y: -1, boxShadow: "0 4px 16px rgba(0,0,0,0.06)" }}
  >
    <div style={{
      width: 40, height: 40, borderRadius: 10,
      background: `linear-gradient(135deg, ${T.accent}, ${T.accentDark})`,
      display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
    }}>
      <FileText size={18} color="#fff" />
    </div>
    <div style={{ flex: 1, minWidth: 0 }}>
      <h4 style={{
        fontSize: 13, fontWeight: 600, color: T.text, marginBottom: 3,
        overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
      }}>
        {article.title}
      </h4>
      <p style={{
        fontSize: 11, color: T.textMuted,
        display: "-webkit-box", WebkitLineClamp: 1, WebkitBoxOrient: "vertical", overflow: "hidden",
      }}>
        {article.snippet}
      </p>
      {article.explanation && (
        <p style={{ fontSize: 10, color: T.accentDark, fontStyle: "italic", marginTop: 3 }}>
          <Sparkles size={10} style={{ display: "inline", marginRight: 3 }} />
          {article.explanation}
        </p>
      )}
    </div>
    <div style={{ flexShrink: 0, display: "flex", alignItems: "center", gap: 8 }}>
      <ScoreCircle score={article.aiScore || 0} size={36} />
      <ExternalLink size={14} color={T.textMuted} />
    </div>
  </motion.a>
);

// ─── Loading Steps ──────────────────────────────────────────
const LoadingSteps = () => {
  const [step, setStep] = useState(0);
  const steps = [
    { icon: Search, text: "Searching approved channels…", color: "#3b82f6" },
    { icon: Youtube, text: "Fetching YouTube results…", color: "#ef4444" },
    { icon: BookOpen, text: "Loading syllabus context…", color: T.amber },
    { icon: Brain, text: "AI scoring against syllabus…", color: T.accentSecondary },
    { icon: Sparkles, text: "Ranking & preparing results…", color: T.accentDark },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setStep((s) => (s < steps.length - 1 ? s + 1 : s));
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div style={{ padding: "40px 20px", display: "flex", flexDirection: "column", alignItems: "center", gap: 24 }}>
      <Loader2 size={40} style={{ color: T.accent, animation: "spin 1s linear infinite" }} />
      <div style={{ display: "flex", flexDirection: "column", gap: 12, width: "100%", maxWidth: 320 }}>
        {steps.map((s, i) => {
          const Icon = s.icon;
          const isActive = i === step;
          const isDone = i < step;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0.3 }}
              animate={{ opacity: isDone || isActive ? 1 : 0.3, x: isActive ? 8 : 0 }}
              style={{
                display: "flex", alignItems: "center", gap: 10,
                fontSize: 13, fontWeight: isActive ? 600 : 400,
                color: isDone ? T.accentDark : isActive ? s.color : T.textMuted,
              }}
            >
              {isDone ? <CheckCircle size={16} color={T.accentDark} /> : (
                <Icon size={16} style={isActive ? { animation: "pulse 1.5s ease-in-out infinite" } : {}} />
              )}
              {s.text}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

// ─── Main Page Component ────────────────────────────────────
export default function MedhaRecommendations() {
  const [topic, setTopic] = useState("");
  const [subject, setSubject] = useState("");
  const [unit, setUnit] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [units, setUnits] = useState([]);
  const [trending, setTrending] = useState([]);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [tab, setTab] = useState("all");
  const [syllabusConnected, setSyllabusConnected] = useState(false);
  const [syllabusSource, setSyllabusSource] = useState("global");
  const inputRef = useRef(null);

  useEffect(() => {
    const fetchInit = async () => {
      try {
        const [subRes, trendRes, sylRes] = await Promise.all([
          api.get("/recommendations/subjects").catch(() => ({ data: { subjects: [] } })),
          api.get("/recommendations/trending").catch(() => ({ data: { topics: [] } })),
          api.get("/recommendations/syllabus").catch(() => ({ data: { semesters: [] } })),
        ]);
        setSubjects(subRes.data.subjects || []);
        setTrending(trendRes.data.topics || []);
        setSyllabusSource(subRes.data.source || "global");
        const sems = sylRes.data.semesters || [];
        if (sems.length > 0) {
          setSyllabusConnected(true);
        }
      } catch { /* silent */ }
    };
    fetchInit();
  }, []);

  useEffect(() => {
    if (!subject) { setUnits([]); setUnit(""); return; }
    const fetchUnits = async () => {
      try {
        const res = await api.get(`/recommendations/units/${encodeURIComponent(subject)}`);
        setUnits(res.data.units || []);
      } catch { setUnits([]); }
    };
    fetchUnits();
  }, [subject]);

  const handleSearch = async (searchTopic) => {
    const q = (searchTopic || topic).trim();
    if (q.length < 2) return;
    setLoading(true); setError(""); setResults(null);
    try {
      const res = await api.post("/recommendations/search", { topic: q, subject, unit });
      setResults(res.data.data); setTab("all");
    } catch (err) {
      setError(err.response?.data?.message || "Search failed. Please try again.");
    } finally { setLoading(false); }
  };

  const handleKeyDown = (e) => { if (e.key === "Enter") handleSearch(); };
  const displayYT = results?.youtube || [];
  const displayGfg = results?.gfg || [];

  // Shared styles
  const selectStyle = {
    width: "100%", padding: "12px 16px", borderRadius: 12,
    background: T.bgTertiary, border: `1.5px solid ${T.border}`,
    color: T.text, fontSize: 13, appearance: "none",
    cursor: "pointer", outline: "none", fontFamily: T.font,
    transition: "border-color 200ms",
  };

  const chipStyle = (active) => ({
    padding: "7px 16px", borderRadius: 10, fontSize: 12, fontWeight: 600,
    background: active ? T.text : T.bgCard,
    color: active ? "white" : T.textSecondary,
    border: `1.5px solid ${active ? T.text : T.border}`,
    cursor: "pointer", transition: "all 150ms", fontFamily: T.font,
  });

  return (
    <div style={{ minHeight: "100vh", fontFamily: T.font }}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
        @media (max-width: 640px) {
          .rec-video-card { flex-direction: column !important; }
          .rec-video-thumb { width: 100% !important; height: 180px !important; }
          .rec-video-thumb img { height: 180px !important; }
          .rec-header-title { font-size: 24px !important; }
          .rec-container { padding: 0 4px !important; }
          .rec-search-row { flex-direction: column !important; }
          .rec-search-row button { width: 100% !important; }
          .rec-selectors { grid-template-columns: 1fr !important; }
          .rec-tab-row { flex-direction: column !important; align-items: flex-start !important; gap: 8px !important; }
          .rec-tab-chips { flex-wrap: wrap !important; }
          .rec-score-col { flex-direction: row !important; gap: 8px !important; }
        }
        @media (max-width: 768px) {
          .rec-selectors { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <div className="rec-container" style={{ maxWidth: 900, margin: "0 auto", padding: "0 8px" }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ textAlign: "center", marginBottom: 32 }}
        >
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            background: T.bgTertiary, border: `1.5px solid ${T.border}`,
            borderRadius: 100, padding: "6px 16px", marginBottom: 16,
            fontSize: 12, fontWeight: 600, color: T.accent,
            textTransform: "uppercase", letterSpacing: "0.08em",
          }}>
            <GraduationCap size={14} />
            Smart Lecture Finder
          </div>
          {syllabusConnected && (
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 5,
              background: "rgba(125,198,122,0.1)", border: `1px solid rgba(125,198,122,0.3)`,
              borderRadius: 100, padding: "5px 14px", marginBottom: 16, marginLeft: 8,
              fontSize: 11, fontWeight: 700, color: T.accentDark,
            }}>
              <CheckCircle size={12} />
              Syllabus Connected
            </div>
          )}
          <h1 className="rec-header-title" style={{
            fontSize: 32, fontWeight: 800, color: T.text,
            letterSpacing: "-0.03em", marginBottom: 8,
          }}>
            Find the Best Lectures<span style={{ color: T.accent }}>.</span>
          </h1>
          <p style={{ color: T.textSecondary, fontSize: 15, lineHeight: 1.5, maxWidth: 480, margin: "0 auto" }}>
            AI-curated lectures from approved channels, scored against your syllabus
          </p>
        </motion.div>

        {/* Subject & Unit Selectors */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rec-selectors"
          style={{
            display: "grid",
            gridTemplateColumns: subjects.length > 0 ? "1fr 1fr" : "1fr",
            gap: 12, marginBottom: 16,
          }}
        >
          {subjects.length > 0 && (
            <div style={{ position: "relative" }}>
              <select value={subject} onChange={(e) => setSubject(e.target.value)} style={selectStyle}>
                <option value="">All Subjects</option>
                {subjects.map((s) => (
                  <option key={s.code} value={s.name}>{s.name} (Sem {s.semester})</option>
                ))}
              </select>
              <ChevronDown size={14} style={{
                position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)",
                color: T.textMuted, pointerEvents: "none",
              }} />
            </div>
          )}

          {units.length > 0 && (
            <div style={{ position: "relative" }}>
              <select value={unit} onChange={(e) => setUnit(e.target.value)} style={selectStyle}>
                <option value="">All Units</option>
                {units.map((u) => (
                  <option key={u.unitNumber} value={u.title}>Unit {u.unitNumber}: {u.title}</option>
                ))}
              </select>
              <ChevronDown size={14} style={{
                position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)",
                color: T.textMuted, pointerEvents: "none",
              }} />
            </div>
          )}
        </motion.div>

        {/* Search Box */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="rec-search-row"
          style={{ display: "flex", gap: 10, marginBottom: 16 }}
        >
          <div style={{ flex: 1, position: "relative" }}>
            <Search size={16} style={{
              position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: T.textMuted,
            }} />
            <input
              ref={inputRef} type="text" value={topic}
              onChange={(e) => setTopic(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search any topic — e.g. 'SQL Joins', 'Binary Trees', 'ER Model'"
              style={{
                width: "100%", padding: "14px 16px 14px 40px", borderRadius: 12,
                background: T.bgTertiary, border: `1.5px solid ${T.border}`,
                color: T.text, fontSize: 14, outline: "none",
                transition: "border-color 200ms, box-shadow 200ms", fontFamily: T.font,
              }}
              onFocus={(e) => { e.target.style.borderColor = T.accent; e.target.style.boxShadow = "0 0 0 3px rgba(125,198,122,0.1)"; e.target.style.background = "white"; }}
              onBlur={(e) => { e.target.style.borderColor = T.border; e.target.style.boxShadow = "none"; e.target.style.background = T.bgTertiary; }}
            />
          </div>
          <button
            onClick={() => handleSearch()}
            disabled={loading || topic.trim().length < 2}
            style={{
              padding: "12px 24px", borderRadius: 12,
              background: loading || topic.trim().length < 2 ? T.border : T.text,
              color: "#fff", fontSize: 14, fontWeight: 600, border: "none",
              cursor: loading || topic.trim().length < 2 ? "not-allowed" : "pointer",
              display: "flex", alignItems: "center", gap: 6,
              transition: "all 0.2s ease", fontFamily: T.font,
              opacity: loading || topic.trim().length < 2 ? 0.5 : 1,
            }}
          >
            {loading ? <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} /> : <Sparkles size={16} />}
            Search
          </button>
        </motion.div>

        {/* Topic chips */}
        {!results && !loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} style={{ marginBottom: 24 }}>
            <p style={{ fontSize: 12, color: T.textMuted, marginBottom: 8, display: "flex", alignItems: "center", gap: 4, fontWeight: 600 }}>
              <TrendingUp size={12} />
              {units.length > 0 ? "Topics from syllabus:" : "Trending searches:"}
            </p>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {(units.length > 0
                ? units.flatMap((u) => u.topics.slice(0, 2))
                : trending
              )
                .slice(0, 12)
                .map((t) => (
                  <button
                    key={t}
                    onClick={() => { setTopic(t); handleSearch(t); }}
                    style={{
                      padding: "6px 14px", borderRadius: 100,
                      background: "rgba(125,198,122,0.08)", border: `1px solid rgba(125,198,122,0.2)`,
                      color: T.accentDark, fontSize: 12, fontWeight: 500,
                      cursor: "pointer", transition: "all 0.2s ease", fontFamily: T.font,
                    }}
                    onMouseEnter={(e) => { e.target.style.background = "rgba(125,198,122,0.15)"; e.target.style.borderColor = "rgba(125,198,122,0.4)"; }}
                    onMouseLeave={(e) => { e.target.style.background = "rgba(125,198,122,0.08)"; e.target.style.borderColor = "rgba(125,198,122,0.2)"; }}
                  >
                    {t}
                  </button>
                ))}
            </div>
          </motion.div>
        )}

        {/* Loading */}
        {loading && <LoadingSteps />}

        {/* Error */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              padding: 16, borderRadius: 14,
              background: "rgba(239,68,68,0.06)", border: "1.5px solid rgba(239,68,68,0.2)",
              display: "flex", alignItems: "center", gap: 10,
              color: "#dc2626", fontSize: 13, marginBottom: 16,
            }}
          >
            <AlertCircle size={16} />
            {error}
          </motion.div>
        )}

        {/* Results */}
        {results && !loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {/* Study tip */}
            {results.studyTip && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  padding: "14px 18px", borderRadius: 14,
                  background: T.bgTertiary,
                  border: `1.5px solid ${T.border}`,
                  marginBottom: 20,
                  display: "flex", alignItems: "flex-start", gap: 10,
                }}
              >
                <Lightbulb size={18} style={{ color: T.amber, flexShrink: 0, marginTop: 1 }} />
                <div>
                  <span style={{
                    fontSize: 11, fontWeight: 700, color: T.accent,
                    textTransform: "uppercase", letterSpacing: "0.5px",
                  }}>
                    AI Study Tip
                  </span>
                  <p style={{ fontSize: 13, color: T.textSecondary, marginTop: 4, lineHeight: 1.5 }}>
                    {results.studyTip}
                  </p>
                </div>
              </motion.div>
            )}

            {/* Tab filter + result count */}
            <div className="rec-tab-row" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, gap: 8, flexWrap: "wrap" }}>
              <div className="rec-tab-chips" style={{ display: "flex", gap: 8 }}>
                {[
                  { key: "all", label: "All", count: displayYT.length + displayGfg.length },
                  { key: "youtube", label: "YouTube", count: displayYT.length },
                  { key: "gfg", label: "GFG", count: displayGfg.length },
                ].map((t) => (
                  <button key={t.key} onClick={() => setTab(t.key)} style={chipStyle(tab === t.key)}>
                    {t.label}{" "}
                    <span style={{ opacity: 0.6, fontSize: 11 }}>({t.count})</span>
                  </button>
                ))}
              </div>
              {results.channelsUsed?.length > 0 && (
                <span style={{ fontSize: 11, color: T.textMuted, fontWeight: 500 }}>
                  {results.channelsUsed.length} channels searched
                </span>
              )}
            </div>

            {/* YouTube results */}
            {(tab === "all" || tab === "youtube") && displayYT.length > 0 && (
              <div style={{ marginBottom: 24 }}>
                {tab === "all" && (
                  <h3 style={{
                    fontSize: 14, fontWeight: 700, color: T.text,
                    marginBottom: 12, display: "flex", alignItems: "center", gap: 6,
                  }}>
                    <Youtube size={16} color="#ef4444" /> YouTube Lectures
                  </h3>
                )}
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {displayYT.map((video, i) => (
                    <VideoCard
                      key={video.videoId} video={video} index={i}
                      isTopPick={results.topPick === `YT_${i}` || (i === 0 && !results.topPick?.startsWith("GFG"))}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* GFG results */}
            {(tab === "all" || tab === "gfg") && displayGfg.length > 0 && (
              <div style={{ marginBottom: 24 }}>
                {tab === "all" && (
                  <h3 style={{
                    fontSize: 14, fontWeight: 700, color: T.text,
                    marginBottom: 12, display: "flex", alignItems: "center", gap: 6,
                  }}>
                    <BookOpen size={16} color={T.accentDark} /> GeeksforGeeks Articles
                  </h3>
                )}
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {displayGfg.map((article, i) => (
                    <GfgCard key={i} article={article} index={i} />
                  ))}
                </div>
              </div>
            )}

            {/* Empty state */}
            {displayYT.length === 0 && displayGfg.length === 0 && (
              <div style={{ textAlign: "center", padding: "48px 20px", color: T.textMuted }}>
                <Search size={40} style={{ marginBottom: 12, opacity: 0.3 }} />
                <p style={{ fontSize: 14 }}>No results found. Try a different topic or subject.</p>
              </div>
            )}
          </motion.div>
        )}

        {/* Initial empty state */}
        {!results && !loading && !error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            style={{ textAlign: "center", padding: "60px 20px", color: T.textSecondary }}
          >
            <div style={{
              width: 80, height: 80, borderRadius: "50%",
              background: T.bgTertiary, border: `1.5px solid ${T.border}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 16px",
            }}>
              <GraduationCap size={36} style={{ color: T.accent }} />
            </div>
            <p style={{ fontSize: 16, fontWeight: 700, color: T.text, marginBottom: 6 }}>
              Search for any engineering topic
            </p>
            <p style={{ fontSize: 13, color: T.textMuted, marginBottom: 16 }}>
              {syllabusConnected
                ? "Your syllabus is connected — results will be scored against your actual syllabus"
                : "Select a subject to get syllabus-matched results, or search directly"
              }
            </p>
            {!syllabusConnected && (
              <Link to="/profile" style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                padding: "8px 20px", borderRadius: 10,
                background: "rgba(125,198,122,0.1)", border: `1px solid rgba(125,198,122,0.25)`,
                color: T.accentDark, fontSize: 12, fontWeight: 600,
                textDecoration: "none", transition: "all 0.2s",
              }}>
                <BookOpen size={14} />
                Upload your syllabus in Profile for accurate matching
              </Link>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
