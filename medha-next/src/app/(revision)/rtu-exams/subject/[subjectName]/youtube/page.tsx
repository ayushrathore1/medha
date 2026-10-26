"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { apiGet, apiPost } from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Youtube, Search, Sparkles, ChevronDown, Play, List } from "lucide-react";
import SYLLABUS_DATA from "@/data/syllabusData";

interface Video {
  videoId: string;
  title: string;
  thumbnail: string;
  channelTitle?: string;
  channelName?: string;
  duration?: string;
  viewCount?: number;
  likeCount?: number;
}

interface Unit {
  unitNumber: number;
  title: string;
  topics: string[];
  youtubePlaylistUrl?: string;
  pyqImportance?: {
    label: string;
    avgMarks: number;
    percentage: number;
    yearsAnalyzed: number[];
    breakdown: Record<number, number>;
  };
}

export default function SubjectYouTubePage() {
  const { subjectName } = useParams();
  const router = useRouter();
  const decodedName = decodeURIComponent(subjectName as string);

  const [units, setUnits] = useState<Unit[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedUnit, setExpandedUnit] = useState<number | null>(null);
  const [unitVideos, setUnitVideos] = useState<Record<number, Video[]>>({});
  const [unitLoading, setUnitLoading] = useState<Record<number, boolean>>({});
  const [searchingAll, setSearchingAll] = useState(false);

  const hasHardcodedData = ((SYLLABUS_DATA as any)[decodedName] || []).some(
    (u: any) => u.videos && u.videos.length > 0
  );

  useEffect(() => {
    const fetchUnits = async () => {
      try {
        const res = await apiGet<{ units: Unit[] }>(
          `/api/recommendations/units/${encodeURIComponent(decodedName)}`
        );
        if (res.units && res.units.length > 0) {
          setUnits(res.units);
        } else {
          const fallbackUnits = (SYLLABUS_DATA as any)[decodedName] || [];
          setUnits(fallbackUnits);
          const preloaded: Record<number, Video[]> = {};
          fallbackUnits.forEach((u: any) => {
            if (u.videos && u.videos.length > 0) {
              preloaded[u.unitNumber] = u.videos;
            }
          });
          if (Object.keys(preloaded).length > 0) {
            setUnitVideos(preloaded);
          }
        }
      } catch (err) {
        console.error("Error fetching units:", err);
        const fallbackUnits = (SYLLABUS_DATA as any)[decodedName] || [];
        setUnits(fallbackUnits);
        const preloaded: Record<number, Video[]> = {};
        fallbackUnits.forEach((u: any) => {
          if (u.videos && u.videos.length > 0) {
            preloaded[u.unitNumber] = u.videos;
          }
        });
        if (Object.keys(preloaded).length > 0) {
          setUnitVideos(preloaded);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchUnits();
  }, [decodedName]);

  const searchUnitVideos = useCallback(
    async (unitNumber: number, unitTitle: string) => {
      if (unitVideos[unitNumber]?.length > 0) return;
      if (!hasHardcodedData) return;

      setUnitLoading((prev) => ({ ...prev, [unitNumber]: true }));
      try {
        const res = await apiPost<{ data?: { youtube: Video[] } }>("/api/recommendations/search", {
          topic: unitTitle,
          subject: decodedName,
          unit: unitTitle,
        });
        const videos = res.data?.youtube || [];
        setUnitVideos((prev) => ({ ...prev, [unitNumber]: videos }));
      } catch (err) {
        console.error(`Error searching videos for unit ${unitNumber}:`, err);
        setUnitVideos((prev) => ({ ...prev, [unitNumber]: [] }));
      } finally {
        setUnitLoading((prev) => ({ ...prev, [unitNumber]: false }));
      }
    },
    [decodedName, unitVideos, hasHardcodedData]
  );

  const handleFindAll = async () => {
    setSearchingAll(true);
    for (const unit of units) {
      if (!unitVideos[unit.unitNumber]?.length) {
        await searchUnitVideos(unit.unitNumber, unit.title);
      }
    }
    setSearchingAll(false);
  };

  const handleExpand = (unitNumber: number, unitTitle: string) => {
    setExpandedUnit((prev) => (prev === unitNumber ? null : unitNumber));
    searchUnitVideos(unitNumber, unitTitle);
  };

  const formatNumber = (num?: number) => {
    if (!num) return "0";
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(1) + "K";
    return num.toString();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-10 h-10 border-4 border-[var(--border)] border-t-[var(--primary)] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full px-4 py-8 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[var(--card)] border border-[var(--border)] hover:bg-[var(--secondary)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] font-semibold text-sm transition-all mb-6 cursor-pointer"
        >
          <ArrowLeft size={16} /> Back
        </button>

        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-red-500/10 text-red-500 text-xs font-bold uppercase tracking-wider mb-3">
            <Youtube size={14} /> YouTube Lectures
          </div>

          <h1 className="text-3xl md:text-4xl font-black text-[var(--foreground)] tracking-tight mb-2">{decodedName}</h1>
          <p className="text-sm text-[var(--muted-foreground)] font-medium">
            {units.length} chapters • Click any chapter to explore video lectures
          </p>

          {units.length > 0 && hasHardcodedData && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-6"
            >
              <button
                onClick={handleFindAll}
                disabled={searchingAll}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[var(--foreground)] text-[var(--card)] hover:opacity-90 disabled:opacity-50 text-xs font-extrabold cursor-pointer transition-all border-none"
              >
                {searchingAll ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-[var(--card)] border-t-transparent rounded-full animate-spin" />
                    Searching all chapters…
                  </>
                ) : (
                  <>
                    <Sparkles size={14} />
                    Find All Lectures (AI Search)
                  </>
                )}
              </button>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Chapters list */}
      {units.length > 0 ? (
        <div className="space-y-4">
          {units.map((unit) => {
            const isExpanded = expandedUnit === unit.unitNumber;
            const videos = unitVideos[unit.unitNumber] || [];
            const isUnitLoading = unitLoading[unit.unitNumber] || false;

            return (
              <motion.div
                key={unit.unitNumber}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-2xl bg-[var(--card)] border border-[var(--border)] transition-all ${
                  isExpanded ? "border-[var(--primary)]/50" : ""
                }`}
              >
                <div
                  onClick={() => handleExpand(unit.unitNumber, unit.title)}
                  className="flex items-center gap-4 cursor-pointer select-none"
                >
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm ${
                      isExpanded ? "bg-[var(--primary)] text-white" : "bg-[var(--primary)]/10 text-[var(--primary)]"
                    }`}
                  >
                    {unit.unitNumber}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-extrabold text-sm text-[var(--foreground)] truncate leading-snug">{unit.title}</h3>
                    <p className="text-[11px] text-[var(--muted-foreground)] font-semibold mt-0.5">
                      {unit.topics?.length || 0} topics {videos.length > 0 && ` · ${videos.length} videos`}
                    </p>
                  </div>

                  {unit.youtubePlaylistUrl && (
                    <a
                      href={unit.youtubePlaylistUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="px-3 py-1 bg-red-500/10 hover:bg-red-500/15 border border-red-500/20 text-red-500 rounded-lg text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-all"
                    >
                      <Youtube size={12} /> Playlist
                    </a>
                  )}

                  <ChevronDown
                    size={14}
                    className={`text-[var(--muted-foreground)] transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`}
                  />
                </div>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-4 pt-4 border-t border-[var(--border)] space-y-4">
                        {/* Topics list */}
                        <div>
                          <p className="text-[9px] font-extrabold text-[var(--muted-foreground)] uppercase tracking-wider mb-2">Topics covered</p>
                          <div className="flex flex-wrap gap-1.5">
                            {unit.topics.map((t, i) => (
                              <span
                                key={i}
                                className="px-2 py-0.5 rounded-md bg-[var(--primary)]/10 text-[var(--primary)] text-[10px] font-bold border border-[var(--primary)]/15"
                              >
                                {t}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Videos list */}
                        {isUnitLoading ? (
                          <div className="flex justify-center items-center py-6 gap-2 text-xs font-bold text-[var(--muted-foreground)]">
                            <div className="w-4 h-4 border-2 border-[var(--border)] border-t-[var(--primary)] rounded-full animate-spin" />
                            Sourcing YouTube lectures...
                          </div>
                        ) : videos.length > 0 ? (
                          <div className="space-y-2">
                            <p className="text-[9px] font-extrabold text-[var(--muted-foreground)] uppercase tracking-wider mb-2">Video lectures</p>
                            {videos.map((video, i) => (
                              <a
                                key={video.videoId || i}
                                href={`https://youtube.com/watch?v=${video.videoId}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex gap-4 p-3 rounded-xl bg-[var(--secondary)] border border-[var(--border)] hover:border-red-500/40 transition-all text-decoration-none group"
                              >
                                <div className="relative w-28 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-[var(--border)]">
                                  <img
                                    src={video.thumbnail}
                                    alt={video.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                  />
                                  {video.duration && (
                                    <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/85 text-white text-[9px] font-black">{video.duration}</span>
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h4 className="font-extrabold text-xs text-[var(--foreground)] leading-snug line-clamp-2">{video.title}</h4>
                                  <div className="flex items-center gap-1.5 mt-1.5 text-[10px] font-bold text-[var(--muted-foreground)]">
                                    <Youtube size={11} className="text-red-500" />
                                    <span>{video.channelTitle || video.channelName || "YouTube"}</span>
                                    {(video.viewCount || video.likeCount) && (
                                      <>
                                        <span>·</span>
                                        <span>{formatNumber(video.viewCount)} views</span>
                                      </>
                                    )}
                                  </div>
                                </div>
                              </a>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-6 text-xs font-semibold text-[var(--muted-foreground)] bg-[var(--secondary)] rounded-xl border border-[var(--border)]">
                            No preloaded lecture videos. Click anywhere on this chapter header to run an AI search.
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 px-4 bg-[var(--card)] border border-[var(--border)] rounded-2xl max-w-xl mx-auto">
          <Search className="mx-auto text-[var(--muted-foreground)] mb-4 opacity-50" size={48} />
          <p className="text-base font-bold text-[var(--foreground)] mb-1">No syllabus data found</p>
          <p className="text-xs text-[var(--muted-foreground)]">Syllabus details for this subject are not available yet.</p>
        </div>
      )}
    </div>
  );
}
