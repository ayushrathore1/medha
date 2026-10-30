import React from "react";
import {
  Sparkles,
  Play,
  HelpCircle,
  ExternalLink,
  ChevronRight,
  Download,
  BookOpen,
  CheckCircle2
} from "lucide-react";
import {
  FaYoutube,
  FaFileLines,
  FaChartBar,
  FaBook,
  FaWhatsapp
} from "react-icons/fa6";
import { getSubjectBadgeStyle } from "./searchConstants";

export default function SearchResultGroups({ search }) {
  const {
    query,
    activeCategory,
    setActiveCategory,
    setSelectedSemester,
    viewMode,
    loading,
    topMatches,
    setPreviewItem,
    handleCategoryChange,
    handleWhatsAppShare,
    executeSearch,
    displayedNotes,
    displayedYoutube,
    displayedSubjects,
    displayedPyq,
    totalResultsCount,
    navigate,
  } = search;

  return (
    <>
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
    </>
  );
}
