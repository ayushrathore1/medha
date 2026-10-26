"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Check, Play, BookOpen, ChevronDown, X, List, Image as ImageIcon, Flame, ArrowUpRight, Lock, Sparkles } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { apiPut } from "@/lib/api";

// ─── UTILS ───
export const getBarGradient = (percentage: number) => {
  if (percentage >= 25) return "linear-gradient(90deg, #ef4444, #f97316)";
  if (percentage >= 15) return "linear-gradient(90deg, #f97316, #f59e0b)";
  return "linear-gradient(90deg, #7DC67A, #4A9E47)";
};

const getYouTubeEmbedUrl = (url: string | undefined) => {
  if (!url) return null;
  const match = url.match(/[?&]list=([^&]+)/);
  if (match && match[1]) {
    return `https://www.youtube.com/embed/videoseries?list=${match[1]}`;
  }
  return null;
};

// ─── MULTI-YEAR TOGGLE ───
interface MultiYearToggleProps {
  years: number[];
  selectedYears: number[];
  onToggleYear: (year: number | "all", soloMode?: boolean) => void;
  loading: boolean;
}

export const MultiYearToggle: React.FC<MultiYearToggleProps> = ({ years, selectedYears, onToggleYear, loading }) => {
  if (loading) {
    return (
      <div className="flex justify-center py-6">
        <div className="w-8 h-8 border-4 border-[var(--border)] border-t-[var(--primary)] rounded-full animate-spin" />
      </div>
    );
  }

  if (!years || years.length === 0) {
    return (
      <div className="text-center py-12 px-8 bg-[var(--card)] border border-[var(--border)] rounded-2xl">
        <Calendar className="mx-auto text-[var(--muted-foreground)] mb-4" size={40} />
        <p className="text-lg font-bold text-[var(--foreground)]">No exam papers available for this subject yet.</p>
        <p className="text-xs text-[var(--muted-foreground)]">Check back later.</p>
      </div>
    );
  }

  const allSelected = selectedYears.length === years.length;

  return (
    <div className="w-full max-w-3xl mx-auto mb-6">
      <div className="flex flex-wrap items-center justify-center gap-3">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            if (allSelected) {
              onToggleYear(years[0], true);
            } else {
              onToggleYear("all");
            }
          }}
          className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            allSelected
              ? "bg-[var(--primary)]/10 text-[var(--primary)] border-2 border-[var(--primary)] font-extrabold shadow-sm"
              : "bg-[var(--secondary)] text-[var(--muted-foreground)] border-2 border-[var(--border)]"
          }`}
        >
          {allSelected && <Check size={12} />}
          All Years
        </motion.button>

        <div className="w-[1px] h-7 bg-[var(--border)]" />

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
              className={`px-5 py-2 rounded-full text-sm font-bold transition-all cursor-pointer relative ${
                isActive
                  ? "bg-[var(--primary)]/10 text-[var(--primary)] border-2 border-[var(--primary)] font-extrabold shadow-md"
                  : "bg-[var(--secondary)] text-[var(--muted-foreground)] border-2 border-[var(--border)]"
              }`}
            >
              {year}
              {isActive && (
                <motion.div
                  layoutId="yearIndicator"
                  className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[var(--primary)]"
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

// ─── QUESTION AI LINKS ───
interface QuestionAILinksProps {
  question: {
    qCode: string;
    chatgptLink?: string | null;
    claudeLink?: string | null;
  };
  subjectName: string;
  year: number | null;
  isAdmin: boolean;
  onLinksUpdated?: () => void;
}

export const QuestionAILinks: React.FC<QuestionAILinksProps> = ({ question, subjectName, year, isAdmin, onLinksUpdated }) => {
  const { isAuthenticated } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editChatgptLink, setEditChatgptLink] = useState(question.chatgptLink || "");
  const [editClaudeLink, setEditClaudeLink] = useState(question.claudeLink || "");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      const trimmedChatgptLink = editChatgptLink?.trim() || null;
      const trimmedClaudeLink = editClaudeLink?.trim() || null;

      await apiPut(
        `/api/rtu/subjects/${encodeURIComponent(subjectName)}/years/${year}/questions/${encodeURIComponent(question.qCode)}/ai-links`,
        {
          chatgptLink: trimmedChatgptLink,
          claudeLink: trimmedClaudeLink,
        }
      );

      setIsEditing(false);
      onLinksUpdated && onLinksUpdated();
    } catch (error) {
      console.error("Error saving AI links:", error);
      alert("Failed to save links. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (isAdmin && isEditing) {
    return (
      <div className="flex flex-col gap-2 mt-3 p-3 rounded-lg bg-[var(--secondary)] border border-[var(--border)]">
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-bold text-[var(--muted-foreground)] uppercase">ChatGPT Link</label>
          <input
            type="url"
            value={editChatgptLink}
            onChange={(e) => setEditChatgptLink(e.target.value)}
            placeholder="https://chatgpt.com/share/..."
            className="px-2 py-1.5 text-xs bg-[var(--card)] border border-[var(--border)] rounded text-[var(--foreground)] outline-none"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-bold text-[var(--muted-foreground)] uppercase">Claude Link</label>
          <input
            type="url"
            value={editClaudeLink}
            onChange={(e) => setEditClaudeLink(e.target.value)}
            placeholder="https://claude.ai/share/..."
            className="px-2 py-1.5 text-xs bg-[var(--card)] border border-[var(--border)] rounded text-[var(--foreground)] outline-none"
          />
        </div>
        <div className="flex gap-2 justify-end mt-1">
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-3 py-1 bg-[var(--primary)] text-white text-xs font-bold rounded hover:opacity-90 disabled:opacity-50 cursor-pointer"
          >
            {saving ? "Saving..." : "Save"}
          </button>
          <button
            onClick={() => setIsEditing(false)}
            className="px-3 py-1 bg-[var(--card)] text-[var(--muted-foreground)] text-xs font-bold rounded border border-[var(--border)] hover:bg-[var(--secondary)] cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-2 mt-2">
      <button
        onClick={(e) => {
          e.stopPropagation();
          if (question.chatgptLink) {
            window.open(question.chatgptLink, "_blank", "noopener,noreferrer");
          }
        }}
        disabled={!question.chatgptLink}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold text-white transition-all shadow-sm ${
          question.chatgptLink
            ? "bg-gradient-to-r from-[#74AA9C] to-[#5a9485] hover:shadow-md cursor-pointer hover:opacity-95"
            : "bg-gray-400 opacity-40 cursor-not-allowed"
        }`}
      >
        ChatGPT
        {question.chatgptLink && (isAuthenticated ? <ArrowUpRight size={10} /> : <Lock size={10} className="text-yellow-300" />)}
      </button>

      <button
        onClick={(e) => {
          e.stopPropagation();
          if (question.claudeLink) {
            window.open(question.claudeLink, "_blank", "noopener,noreferrer");
          }
        }}
        disabled={!question.claudeLink}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold text-white transition-all shadow-sm ${
          question.claudeLink
            ? "bg-gradient-to-r from-[#d97757] to-[#c15f3c] hover:shadow-md cursor-pointer hover:opacity-95"
            : "bg-gray-400 opacity-40 cursor-not-allowed"
        }`}
      >
        Claude
        {question.claudeLink && (isAuthenticated ? <ArrowUpRight size={10} /> : <Lock size={10} className="text-yellow-300" />)}
      </button>

      {isAdmin && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsEditing(true);
          }}
          className="px-3 py-1 rounded bg-[var(--card)] hover:bg-[var(--secondary)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] border border-[var(--border)] text-xs font-bold transition-all cursor-pointer"
        >
          ✏️ Edit Links
        </button>
      )}
    </div>
  );
};

// ─── AI PREDICTION PANEL ───
const priorityConfig: Record<string, { color: string; bg: string; border: string }> = {
  high: { color: "#ef4444", bg: "rgba(239,68,68,0.08)", border: "rgba(239,68,68,0.2)" },
  medium: { color: "#f59e0b", bg: "rgba(245,158,11,0.08)", border: "rgba(245,158,11,0.2)" },
  low: { color: "#22c55e", bg: "rgba(34,197,94,0.08)", border: "rgba(34,197,94,0.2)" },
};

interface AIPredictionPanelProps {
  predictions?: Array<{ topic: string; reason: string; priority: string; confidence: number }>;
  yearsAnalyzed?: number[];
  loading: boolean;
  error?: string | null;
  onClose: () => void;
  onRetry?: () => void;
  cached?: boolean;
}

export const AIPredictionPanel: React.FC<AIPredictionPanelProps> = ({ predictions, yearsAnalyzed, loading, error, onClose, onRetry, cached }) => {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="relative p-6 mb-6 rounded-2xl bg-[var(--card)] border-2 border-[var(--primary)]/20 overflow-hidden shadow-sm"
      >
        <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-[var(--primary)]/5 blur-2xl pointer-events-none" />

        <div className="flex justify-between items-start mb-4 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[var(--primary)] to-[#d46936] flex items-center justify-center shadow-md shadow-[var(--primary)]/20">
              <Sparkles size={20} className="text-white animate-pulse" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-[var(--foreground)]">AI Topic Prediction</h3>
              <p className="text-[11px] text-[var(--muted-foreground)]">
                {loading
                  ? "Analyzing PYQ data..."
                  : yearsAnalyzed
                  ? `Based on ${yearsAnalyzed.join(", ")} papers${cached ? " · Cached" : ""}`
                  : "Powered by Gemini Flash"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-[var(--secondary)] hover:bg-[var(--border)] border border-[var(--border)] text-[var(--muted-foreground)] flex items-center justify-center transition-all cursor-pointer"
          >
            <X size={14} />
          </button>
        </div>

        {loading && (
          <div className="text-center py-8 relative z-10 flex flex-col items-center">
            <Sparkles size={28} className="text-[var(--primary)] animate-spin mb-3" />
            <p className="text-sm font-semibold text-[var(--foreground)]">Analyzing patterns across multiple years...</p>
            <p className="text-xs text-[var(--muted-foreground)] mt-1">This may take a few seconds</p>
          </div>
        )}

        {error && !loading && (
          <div className="text-center py-6 px-4 bg-red-500/5 rounded-xl border border-red-500/20 relative z-10">
            <p className="text-sm font-semibold text-red-500 mb-3">{error}</p>
            {onRetry && (
              <button
                onClick={onRetry}
                className="px-4 py-1.5 bg-[var(--primary)] text-white rounded-full text-xs font-bold hover:opacity-90 cursor-pointer"
              >
                Try Again
              </button>
            )}
          </div>
        )}

        {!loading && !error && predictions && predictions.length > 0 && (
          <div className="flex flex-col gap-2.5 relative z-10 mt-4">
            {predictions.map((pred, idx) => {
              const pConfig = priorityConfig[pred.priority] || priorityConfig.medium;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05, duration: 0.3 }}
                  className="flex items-center gap-3.5 p-3.5 rounded-xl border transition-all"
                  style={{
                    background: pConfig.bg,
                    borderColor: pConfig.border,
                  }}
                >
                  <div
                    className="w-8 h-8 rounded-lg font-black text-sm flex items-center justify-center flex-shrink-0"
                    style={{ background: `${pConfig.color}15`, color: pConfig.color }}
                  >
                    {idx + 1}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="font-extrabold text-sm text-[var(--foreground)] truncate">{pred.topic}</h4>
                    <p className="text-[11px] text-[var(--muted-foreground)] mt-0.5 leading-relaxed">{pred.reason}</p>
                  </div>

                  <div className="flex flex-col items-end gap-1 flex-shrink-0">
                    <span className="font-black text-base" style={{ color: pConfig.color }}>
                      {pred.confidence}%
                    </span>
                    <span
                      className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider"
                      style={{ color: pConfig.color, background: `${pConfig.color}15` }}
                    >
                      {pred.priority}
                    </span>
                  </div>
                </motion.div>
              );
            })}

            <div className="p-3 bg-[var(--primary)]/5 rounded-xl border border-[var(--primary)]/10 text-[11px] text-[var(--muted-foreground)] mt-2 leading-relaxed">
              <strong>📋 Note:</strong> Predictions are based on frequency and weightage patterns from {yearsAnalyzed?.length || 0} years of PYQ data. Use this as a study guide, not a guarantee.
            </div>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

// ─── UNIT WEIGHTAGE BAR ───
interface Question {
  qCode: string;
  text: string;
  marks: number;
  topic?: string;
  imageUrl?: string;
  chatgptLink?: string | null;
  claudeLink?: string | null;
}

interface UnitWeightageBarProps {
  unitSerial: number;
  unitName: string;
  totalMarks: number;
  weightagePercentage: number;
  weightageRatio: string;
  youtubePlaylistUrl?: string;
  questions?: Question[];
  index?: number;
  subjectName?: string;
  year?: number | null;
  isAdmin?: boolean;
  onQuestionsUpdated?: () => void;
  onLinksUpdated?: () => void;
}

export const UnitWeightageBar: React.FC<UnitWeightageBarProps> = ({
  unitSerial,
  unitName,
  totalMarks,
  weightagePercentage,
  weightageRatio,
  youtubePlaylistUrl,
  questions = [],
  index = 0,
  subjectName = "",
  year = null,
  isAdmin = false,
  onQuestionsUpdated,
  onLinksUpdated,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [activePlaylistIndex, setActivePlaylistIndex] = useState(0);

  const barWidth = Math.min(weightagePercentage, 100);

  const playlists = useMemo(() => {
    if (!youtubePlaylistUrl) return [];
    return youtubePlaylistUrl
      .split(" | ")
      .map((entry, idx) => {
        const [url, channelName] = entry.trim().split("::");
        return {
          url: url?.trim(),
          embedUrl: getYouTubeEmbedUrl(url?.trim()),
          label: channelName?.trim() || `Playlist ${idx + 1}`,
        };
      })
      .filter((p) => p.embedUrl);
  }, [youtubePlaylistUrl]);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, delay: index * 0.1 }}
        className={`p-5 mb-4 rounded-2xl bg-[var(--card)] border border-[var(--border)] shadow-sm hover:shadow-md hover:border-[var(--primary)]/50 transition-all ${
          questions.length > 0 ? "cursor-pointer" : ""
        }`}
        onClick={() => questions.length > 0 && setIsExpanded(!isExpanded)}
      >
        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-start gap-4">
            <div className="flex-1">
              <h4 className="text-[15px] font-extrabold text-[var(--foreground)] mb-1.5 leading-tight">
                Unit {unitSerial} <span className="text-[var(--border)] font-light mx-1.5">|</span> {unitName}
              </h4>

              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-bold text-[var(--primary)] bg-[var(--primary)]/10 px-2.5 py-0.5 rounded-full border border-[var(--primary)]/20">
                  {totalMarks} Marks • {weightagePercentage.toFixed(1)}%
                </span>

                {playlists.length > 0 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActivePlaylistIndex(0);
                      setShowVideoModal(true);
                    }}
                    className="flex items-center gap-1 px-2.5 py-0.5 text-[11px] font-bold text-white bg-red-600 hover:bg-red-700 rounded-full transition-all shadow-sm border-none cursor-pointer"
                  >
                    <Play size={10} fill="white" /> Watch lectures
                  </button>
                )}
              </div>
            </div>

            {questions.length > 0 && (
              <ChevronDown
                size={16}
                className={`text-[var(--muted-foreground)] transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`}
              />
            )}
          </div>

          <div className="w-full h-2 bg-[var(--secondary)] rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${barWidth}%` }}
              transition={{ duration: 0.8, delay: index * 0.1 + 0.2, ease: "easeOut" }}
              className="h-full rounded-full"
              style={{ background: getBarGradient(weightagePercentage) }}
            />
          </div>
        </div>

        <AnimatePresence>
          {isExpanded && questions.length > 0 && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="mt-4 pt-4 border-t border-[var(--border)] space-y-3" onClick={(e) => e.stopPropagation()}>
                <h5 className="text-[10px] font-bold text-[var(--muted-foreground)] uppercase tracking-wider flex items-center gap-1.5 mb-2">
                  <BookOpen size={12} /> Questions from {year} paper
                </h5>

                {questions.map((q, idx) => (
                  <div
                    key={idx}
                    className="bg-[var(--secondary)] p-4 rounded-xl border border-[var(--border)] hover:border-[var(--primary)]/40 transition-colors"
                  >
                    <div className="flex justify-between items-center mb-2.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[var(--primary)] text-xs bg-[var(--card)] px-2 py-0.5 rounded border border-[var(--primary)]/20 shadow-sm">
                          {q.qCode}
                        </span>
                        {q.topic && (
                          <span className="text-[10px] font-bold text-[var(--primary)] bg-[var(--primary)]/10 px-2 py-0.5 rounded border border-[var(--primary)]/20">
                            📌 {q.topic}
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] font-bold text-[var(--muted-foreground)] bg-[var(--card)] px-2 py-0.5 rounded border border-[var(--border)]">
                        {q.marks} Marks
                      </span>
                    </div>

                    <div
                      className="text-sm font-medium text-[var(--foreground)] leading-relaxed mb-3"
                      dangerouslySetInnerHTML={{ __html: q.text }}
                    />

                    <QuestionAILinks
                      question={q}
                      subjectName={subjectName}
                      year={year}
                      isAdmin={isAdmin}
                      onLinksUpdated={onLinksUpdated}
                    />
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Video Playlist Modal */}
      <AnimatePresence>
        {showVideoModal && playlists.length > 0 && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setShowVideoModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-slate-900 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden border border-slate-700"
            >
              <div className="flex justify-between items-center p-4 bg-red-700">
                <div>
                  <h3 className="font-bold text-white text-base">Video Lectures</h3>
                  <p className="text-xs text-white/90 font-medium">
                    {subjectName} • Unit {unitSerial}: {unitName}
                  </p>
                </div>
                <button
                  onClick={() => setShowVideoModal(false)}
                  className="p-1.5 text-white/85 hover:text-white bg-white/10 hover:bg-white/20 rounded-full border-none cursor-pointer transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {playlists.length > 1 && (
                <div className="flex gap-2 p-2 bg-slate-800 border-b border-slate-700">
                  {playlists.map((playlist, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActivePlaylistIndex(idx)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold border-none cursor-pointer transition-all ${
                        activePlaylistIndex === idx ? "bg-red-600 text-white shadow-md" : "bg-slate-700 text-slate-300 hover:bg-slate-650"
                      }`}
                    >
                      <List size={11} className="inline mr-1" />
                      {playlist.label}
                    </button>
                  ))}
                </div>
              )}

              <div className="w-full h-[50vh] bg-black">
                <iframe
                  src={playlists[activePlaylistIndex]?.embedUrl || ""}
                  title={`${subjectName} - Unit ${unitSerial} Lectures`}
                  className="w-full h-full border-none"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>

              <div className="p-3 bg-slate-800 border-t border-slate-700 text-center space-y-1 text-xs text-slate-400">
                <p className="font-bold text-white">
                  ❤️ Credits: <span className="text-red-400">{playlists[activePlaylistIndex]?.label}</span>
                </p>
                <p className="text-[10px] text-yellow-400 font-semibold">💡 Click the playlist icon (≡) on top-right of the video to view the full video list</p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
