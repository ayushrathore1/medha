import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FaYoutube, FaPlay, FaArrowRight } from "react-icons/fa6";
import { Loader2 } from "lucide-react";
import api from "../../api/api";

/**
 * SubjectPreviewCard — Shows a subject with real YouTube lecture thumbnails.
 * On hover, displays a "View All Lectures" overlay button.
 * The card itself is NOT clickable (only the hover button).
 */
const SubjectPreviewCard = ({ subjectName, index = 0, onTabClick }) => {
  const navigate = useNavigate();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hovered, setHovered] = useState(false);
  const encodedName = encodeURIComponent(subjectName);

  useEffect(() => {
    let cancelled = false;
    const fetchPreview = async () => {
      try {
        // Search using subject name to get a few preview videos
        const res = await api.post("/recommendations/search", {
          topic: subjectName,
          subject: subjectName,
        });
        if (!cancelled) {
          const yt = res.data?.data?.youtube || [];
          setVideos(yt.slice(0, 3)); // Max 3 thumbnails
        }
      } catch {
        if (!cancelled) setVideos([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchPreview();
    return () => { cancelled = true; };
  }, [subjectName]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.35 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative",
        background: "var(--bg-tertiary)",
        border: "1.5px solid var(--border-default)",
        borderRadius: 20,
        overflow: "hidden",
        transition: "border-color 0.2s, box-shadow 0.2s",
        ...(hovered
          ? {
              borderColor: "rgba(125, 198, 122, 0.4)",
              boxShadow: "0 12px 36px rgba(0,0,0,0.08)",
            }
          : {}),
      }}
    >
      {/* Subject Header */}
      <div style={{ padding: "18px 20px 14px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: "rgba(125, 198, 122, 0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <FaYoutube size={16} style={{ color: "#FF0000" }} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h3
              style={{
                fontSize: 15,
                fontWeight: 700,
                color: "var(--text-primary)",
                margin: 0,
                lineHeight: 1.3,
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {subjectName}
            </h3>
          </div>
        </div>
      </div>

      {/* Video Thumbnails Preview */}
      <div style={{ padding: "0 16px 16px" }}>
        {loading ? (
          <div
            style={{
              display: "flex",
              gap: 8,
              height: 72,
            }}
          >
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                style={{
                  flex: 1,
                  borderRadius: 10,
                  background: "linear-gradient(135deg, var(--bg-secondary), var(--border-default))",
                  animation: "shimmer 1.5s ease-in-out infinite",
                  animationDelay: `${i * 0.2}s`,
                }}
              />
            ))}
          </div>
        ) : videos.length > 0 ? (
          <div style={{ display: "flex", gap: 8 }}>
            {videos.map((video, i) => (
              <div
                key={video.videoId || i}
                style={{
                  flex: 1,
                  height: 72,
                  borderRadius: 10,
                  overflow: "hidden",
                  position: "relative",
                  background: "#1a1a2e",
                }}
              >
                <img
                  src={video.thumbnail}
                  alt=""
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    opacity: 0.85,
                  }}
                  draggable={false}
                />
                {/* Play icon overlay */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "rgba(0,0,0,0.15)",
                  }}
                >
                  <FaPlay size={12} style={{ color: "#fff", opacity: 0.7 }} />
                </div>
                {video.duration && (
                  <span
                    style={{
                      position: "absolute",
                      bottom: 3,
                      right: 3,
                      background: "rgba(0,0,0,0.75)",
                      color: "#fff",
                      padding: "1px 4px",
                      borderRadius: 3,
                      fontSize: 9,
                      fontWeight: 600,
                    }}
                  >
                    {video.duration}
                  </span>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div
            style={{
              height: 72,
              borderRadius: 10,
              background: "var(--bg-secondary)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
              color: "var(--text-tertiary)",
              fontSize: 12,
              fontWeight: 500,
            }}
          >
            <FaYoutube size={14} style={{ opacity: 0.4 }} />
            No preview available
          </div>
        )}
      </div>

      {/* Hover Overlay — "View All Lectures" */}
      <motion.div
        initial={false}
        animate={{
          opacity: hovered ? 1 : 0,
          pointerEvents: hovered ? "auto" : "none",
        }}
        transition={{ duration: 0.2 }}
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(26, 26, 46, 0.65)",
          backdropFilter: "blur(4px)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 12,
          borderRadius: 20,
          zIndex: 10,
        }}
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate(`/rtu-exams/subject/${encodedName}/youtube`)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "12px 28px",
            borderRadius: 14,
            background: "linear-gradient(135deg, #7DC67A, #4A9E47)",
            color: "#fff",
            fontSize: 14,
            fontWeight: 700,
            border: "none",
            cursor: "pointer",
            fontFamily: "inherit",
            boxShadow: "0 4px 20px rgba(125, 198, 122, 0.4)",
          }}
        >
          View All Lectures <FaArrowRight size={13} />
        </motion.button>

        {/* Quick action buttons row */}
        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={() => {
              if (onTabClick) onTabClick(subjectName, "pyq");
            }}
            style={{
              padding: "7px 16px",
              borderRadius: 10,
              background: "rgba(255,255,255,0.12)",
              color: "#fff",
              fontSize: 11,
              fontWeight: 600,
              border: "1px solid rgba(255,255,255,0.15)",
              cursor: "pointer",
              fontFamily: "inherit",
              transition: "background 0.15s",
            }}
            onMouseEnter={(e) => (e.target.style.background = "rgba(255,255,255,0.2)")}
            onMouseLeave={(e) => (e.target.style.background = "rgba(255,255,255,0.12)")}
          >
            PYQ Analysis
          </button>
          <button
            onClick={() => navigate(`/rtu-exams/subject/${encodedName}/notes`)}
            style={{
              padding: "7px 16px",
              borderRadius: 10,
              background: "rgba(255,255,255,0.12)",
              color: "#fff",
              fontSize: 11,
              fontWeight: 600,
              border: "1px solid rgba(255,255,255,0.15)",
              cursor: "pointer",
              fontFamily: "inherit",
              transition: "background 0.15s",
            }}
            onMouseEnter={(e) => (e.target.style.background = "rgba(255,255,255,0.2)")}
            onMouseLeave={(e) => (e.target.style.background = "rgba(255,255,255,0.12)")}
          >
            Notes
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default SubjectPreviewCard;
