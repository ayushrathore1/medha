import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaChevronDown, FaPlay, FaYoutube } from "react-icons/fa6";
import { Loader2 } from "lucide-react";
import "../../styles/responsive-pages.css";

const ChapterAccordion = ({
  unitNumber,
  title,
  topics = [],
  videos = [],
  loading = false,
  playlistUrl,
  pyqImportance,
  onExpand,
  isExpanded: controlledIsExpanded,
}) => {
  const [internalExpanded, setInternalExpanded] = useState(false);
  const isExpanded =
    controlledIsExpanded !== undefined ? controlledIsExpanded : internalExpanded;

  const handleToggle = () => {
    const next = !isExpanded;
    if (controlledIsExpanded === undefined) {
      setInternalExpanded(next);
    }
    if (next && onExpand) {
      onExpand();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: (unitNumber - 1) * 0.05, duration: 0.3 }}
      style={{
        background: "var(--bg-tertiary)",
        border: "1.5px solid var(--border-default)",
        borderRadius: 16,
        overflow: "hidden",
        transition: "border-color 0.2s",
        ...(isExpanded
          ? { borderColor: "rgba(125, 198, 122, 0.4)" }
          : {}),
      }}
    >
      {/* Header */}
      <button onClick={handleToggle} className="chapter-header">
        {/* Unit badge */}
        <div
          className="chapter-unit-badge"
          style={{
            background: isExpanded
              ? "linear-gradient(135deg, #7DC67A, #4A9E47)"
              : "rgba(125, 198, 122, 0.1)",
          }}
        >
          <span
            style={{
              fontSize: 14,
              fontWeight: 800,
              color: isExpanded ? "#fff" : "var(--action-primary)",
            }}
          >
            {unitNumber}
          </span>
        </div>

        {/* Title & topic count */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <h3
              style={{
                fontSize: 15,
                fontWeight: 700,
                color: "var(--text-primary)",
                margin: 0,
                lineHeight: 1.4,
              }}
            >
              {title}
            </h3>
            {pyqImportance && (
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 4,
                  padding: "2px 8px",
                  borderRadius: 6,
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: "0.02em",
                  background:
                    pyqImportance.label === "Highest"
                      ? "rgba(239, 68, 68, 0.1)"
                      : pyqImportance.label === "High"
                        ? "rgba(245, 158, 11, 0.1)"
                        : "rgba(59, 130, 246, 0.1)",
                  color:
                    pyqImportance.label === "Highest"
                      ? "#dc2626"
                      : pyqImportance.label === "High"
                        ? "#d97706"
                        : "#2563eb",
                  border: `1px solid ${
                    pyqImportance.label === "Highest"
                      ? "rgba(239, 68, 68, 0.2)"
                      : pyqImportance.label === "High"
                        ? "rgba(245, 158, 11, 0.2)"
                        : "rgba(59, 130, 246, 0.2)"
                  }`,
                  whiteSpace: "nowrap",
                }}
              >
                🔥 {pyqImportance.label} · ~{Math.round(pyqImportance.avgMarks)} marks avg
              </span>
            )}
          </div>
          <p
            style={{
              fontSize: 12,
              fontWeight: 500,
              color: "var(--text-tertiary)",
              margin: "2px 0 0",
            }}
          >
            {topics.length} topics
            {videos.length > 0 && ` · ${videos.length} videos`}
          </p>
        </div>

        {/* Playlist link */}
        {playlistUrl && (
          <a
            href={playlistUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 4,
              padding: "5px 12px",
              borderRadius: 8,
              background: "rgba(255, 0, 0, 0.08)",
              color: "#FF0000",
              fontSize: 11,
              fontWeight: 700,
              textDecoration: "none",
              border: "1px solid rgba(255, 0, 0, 0.15)",
              whiteSpace: "nowrap",
            }}
          >
            <FaYoutube size={12} /> Playlist
          </a>
        )}

        {/* Chevron */}
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.25 }}
          style={{ flexShrink: 0 }}
        >
          <FaChevronDown
            size={13}
            style={{ color: "var(--text-tertiary)" }}
          />
        </motion.div>
      </button>

      {/* Expandable content */}
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
            style={{ overflow: "hidden" }}
          >
            <div className="chapter-content">
              {/* PYQ Importance breakdown */}
              {pyqImportance && (
                <div
                  style={{
                    marginTop: 14,
                    marginBottom: 16,
                    padding: "12px 14px",
                    borderRadius: 12,
                    background:
                      pyqImportance.label === "Highest"
                        ? "rgba(239, 68, 68, 0.04)"
                        : pyqImportance.label === "High"
                          ? "rgba(245, 158, 11, 0.04)"
                          : "rgba(59, 130, 246, 0.04)",
                    border: `1px solid ${
                      pyqImportance.label === "Highest"
                        ? "rgba(239, 68, 68, 0.12)"
                        : pyqImportance.label === "High"
                          ? "rgba(245, 158, 11, 0.12)"
                          : "rgba(59, 130, 246, 0.12)"
                    }`,
                  }}
                >
                  <p
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: "var(--text-tertiary)",
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                      marginBottom: 8,
                    }}
                  >
                    📊 PYQ Analysis ({pyqImportance.yearsAnalyzed.join(", ")})
                  </p>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                    <div style={{ flex: 1, minWidth: 120 }}>
                      <div
                        style={{
                          height: 6,
                          borderRadius: 3,
                          background: "var(--bg-secondary)",
                          overflow: "hidden",
                          marginBottom: 6,
                        }}
                      >
                        <div
                          style={{
                            height: "100%",
                            width: `${Math.min(pyqImportance.percentage * 2.5, 100)}%`,
                            borderRadius: 3,
                            background:
                              pyqImportance.label === "Highest"
                                ? "linear-gradient(90deg, #ef4444, #f87171)"
                                : pyqImportance.label === "High"
                                  ? "linear-gradient(90deg, #f59e0b, #fbbf24)"
                                  : "linear-gradient(90deg, #3b82f6, #60a5fa)",
                            transition: "width 0.5s ease",
                          }}
                        />
                      </div>
                      <p style={{ fontSize: 11, color: "var(--text-secondary)", fontWeight: 600, margin: 0 }}>
                        Avg <strong>{pyqImportance.avgMarks}</strong> marks / 98 ({pyqImportance.percentage}%)
                      </p>
                    </div>
                    <div style={{ display: "flex", gap: 6 }}>
                      {pyqImportance.yearsAnalyzed.map((yr) => (
                        <span
                          key={yr}
                          style={{
                            padding: "2px 7px",
                            borderRadius: 5,
                            fontSize: 10,
                            fontWeight: 600,
                            background: "var(--bg-secondary)",
                            color: "var(--text-secondary)",
                          }}
                        >
                          '{String(yr).slice(2)}: {pyqImportance.breakdown[yr]}m
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Topics list */}
              <div style={{ marginTop: 14, marginBottom: 16 }}>
                <p
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: "var(--text-tertiary)",
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    marginBottom: 8,
                  }}
                >
                  Syllabus Topics
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {topics.map((topic, i) => (
                    <span
                      key={i}
                      className="topic-tag"
                      style={{
                        background: "rgba(125, 198, 122, 0.08)",
                        border: "1px solid rgba(125, 198, 122, 0.15)",
                        color: "var(--text-secondary)",
                      }}
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </div>

              {/* Videos list */}
              {loading ? (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                    padding: "24px 0",
                    color: "var(--text-tertiary)",
                    fontSize: 13,
                    fontWeight: 500,
                  }}
                >
                  <Loader2
                    size={18}
                    style={{ animation: "spin 1s linear infinite" }}
                  />
                  Searching for videos…
                </div>
              ) : videos.length > 0 ? (
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <p
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: "var(--text-tertiary)",
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                      marginBottom: 4,
                    }}
                  >
                    Video Lectures
                  </p>
                  {videos.map((video, i) => (
                    <VideoItem key={video.videoId || i} video={video} />
                  ))}
                </div>
              ) : (
                <div
                  style={{
                    textAlign: "center",
                    padding: "16px 0",
                    color: "var(--text-tertiary)",
                    fontSize: 12,
                    fontWeight: 500,
                  }}
                >
                  Click "Find Lectures" below to search for videos on this
                  unit.
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

/* ─── Inline Video Item ─────────────────────────────────────── */
const VideoItem = ({ video }) => {
  const formatNumber = (num) => {
    if (!num) return "0";
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(1) + "K";
    return num.toString();
  };

  return (
    <motion.a
      href={`https://youtube.com/watch?v=${video.videoId}`}
      target="_blank"
      rel="noopener noreferrer"
      whileHover={{
        y: -2,
        boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
        borderColor: "rgba(255, 0, 0, 0.25)",
      }}
      className="video-item"
    >
      {/* Thumbnail */}
      <div className="video-item-thumb">
        {video.thumbnail ? (
          <img
            src={video.thumbnail}
            alt={video.title}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(255,0,0,0.08)",
            }}
          >
            <FaPlay size={16} style={{ color: "#FF0000", opacity: 0.6 }} />
          </div>
        )}
        {video.duration && (
          <span
            style={{
              position: "absolute",
              bottom: 4,
              right: 4,
              background: "rgba(0,0,0,0.75)",
              color: "#fff",
              padding: "1px 5px",
              borderRadius: 4,
              fontSize: 10,
              fontWeight: 600,
            }}
          >
            {video.duration}
          </span>
        )}
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <h4
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: "var(--text-primary)",
            margin: 0,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            lineHeight: 1.4,
          }}
        >
          {video.title}
        </h4>
        <p
          style={{
            fontSize: 11,
            color: "var(--text-tertiary)",
            margin: "3px 0 0",
            display: "flex",
            alignItems: "center",
            gap: 4,
          }}
        >
          <FaYoutube size={10} style={{ color: "#FF0000" }} />
          {video.channelTitle || video.channelName || "YouTube"}
        </p>
        {(video.viewCount || video.likeCount) && (
          <p
            style={{
              fontSize: 10,
              color: "var(--text-tertiary)",
              margin: "2px 0 0",
            }}
          >
            {video.viewCount && `${formatNumber(video.viewCount)} views`}
            {video.viewCount && video.likeCount && " · "}
            {video.likeCount && `${formatNumber(video.likeCount)} likes`}
          </p>
        )}
      </div>
    </motion.a>
  );
};

export default ChapterAccordion;
