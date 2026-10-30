import React from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { formatDate, getSubjectColor, resolveFileUrl } from "./notesConstants";

export default function NotePreviewModal({ note, onClose, getOwnerName, getSubjectName }) {
  if (!note) return null;
  const subjectName = getSubjectName(note);
  const sc = getSubjectColor(subjectName);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="notes-modal-overlay"
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(31,31,31,0.6)",
          backdropFilter: "blur(4px)",
          zIndex: 9999,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 24,
        }}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="notes-modal-container"
          style={{
            maxWidth: 900,
            width: "90vw",
            background: "white",
            borderRadius: 20,
            overflow: "hidden",
            maxHeight: "90vh",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Header */}
          <div
            className="notes-modal-header"
            style={{
              padding: "20px 24px",
              borderBottom: "1px solid #E5E5E5",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              gap: 8,
            }}
          >
            <div>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 4,
                  background: sc.tagBg,
                  border: `1px solid ${sc.tagBorder}`,
                  borderRadius: 999,
                  padding: "2px 8px",
                  fontSize: 11,
                  fontWeight: 600,
                  color: sc.tagColor,
                }}
              >
                {subjectName}
              </div>
              <div
                className="notes-modal-title-text"
                style={{
                  fontSize: 20,
                  fontWeight: 700,
                  color: "#1F1F1F",
                  marginTop: 6,
                  wordBreak: "break-word",
                }}
              >
                {note.title}
              </div>
              <div
                style={{
                  fontSize: 13,
                  color: "#9A9A9A",
                  marginTop: 4,
                }}
              >
                by {getOwnerName(note)} · {formatDate(note.createdAt || note.uploadedAt)}
                {note.semester && ` · Sem ${note.semester}`} · {subjectName}
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              {note.fileUrl && (
                <a
                  href={resolveFileUrl(note.fileUrl)}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 4,
                    background: "#7DC67A",
                    color: "white",
                    borderRadius: 8,
                    padding: "8px 16px",
                    fontSize: 13,
                    fontWeight: 600,
                    textDecoration: "none",
                    transition: "background 200ms",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#4A9E47")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "#7DC67A")}
                >
                  ⬇ Download
                </a>
              )}
              <button
                onClick={onClose}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                  fontSize: 18,
                  color: "#9A9A9A",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "background 150ms",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#F6F6F6")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                ×
              </button>
            </div>
          </div>

          {/* Body — PDF viewer + sidebar */}
          <div
            className="notes-modal-body-grid"
            style={{
              flex: 1,
              overflow: "hidden",
              display: "grid",
              gridTemplateColumns: "1fr 280px",
              minHeight: 400,
            }}
          >
            {/* Download-focused view (preview disabled for quality) */}
            <div style={{ overflow: "auto", display: "flex", alignItems: "center", justifyContent: "center" }}>
              {note.fileUrl ? (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 20,
                    padding: 40,
                    textAlign: "center",
                    height: "100%",
                    minHeight: 400,
                  }}
                >
                  {/* Big document icon */}
                  <div
                    style={{
                      width: 100,
                      height: 120,
                      background: "white",
                      borderRadius: "4px 16px 8px 8px",
                      boxShadow: "0 8px 32px rgba(0,0,0,0.10)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 48,
                      border: "2px solid #E5E5E5",
                    }}
                  >
                    📄
                  </div>

                  <div>
                    <div style={{ fontSize: 18, fontWeight: 700, color: "#1F1F1F", marginBottom: 6 }}>
                      {note.originalName || note.title}
                    </div>
                    <div style={{ fontSize: 13, color: "#9A9A9A" }}>
                      Download to view in full quality
                    </div>
                  </div>

                  <a
                    href={resolveFileUrl(note.fileUrl)}
                    target="_blank"
                    rel="noopener noreferrer"
                    download
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 8,
                      background: "linear-gradient(135deg, #7DC67A, #4A9E47)",
                      color: "white",
                      borderRadius: 14,
                      padding: "14px 32px",
                      fontSize: 16,
                      fontWeight: 700,
                      textDecoration: "none",
                      boxShadow: "0 4px 16px rgba(125,198,122,0.3)",
                      transition: "transform 200ms, box-shadow 200ms",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-2px)";
                      e.currentTarget.style.boxShadow = "0 6px 24px rgba(125,198,122,0.4)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "0 4px 16px rgba(125,198,122,0.3)";
                    }}
                  >
                    ⬇ Download {note.fileType === "application/pdf" ? "PDF" : "File"}
                  </a>
                </div>
              ) : (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "100%",
                    fontSize: 15,
                    color: "#9A9A9A",
                  }}
                >
                  {note.content || "No preview available"}
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div
              className="notes-modal-sidebar"
              style={{
                padding: 20,
                borderLeft: "1px solid #E5E5E5",
                overflowY: "auto",
              }}
            >
              {/* About */}
              <div
                style={{
                  background: "#F6F6F6",
                  borderRadius: 12,
                  padding: 16,
                  marginBottom: 16,
                }}
              >
                <div style={{ fontSize: 12, fontWeight: 700, color: "#9A9A9A", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10 }}>
                  About this note
                </div>
                <div style={{ fontSize: 13, color: "#6B6B6B", lineHeight: 2 }}>
                  📄 {note.pages || "—"} pages<br />
                  📁 {note.fileSize || "—"}<br />
                  👁 {note.views || 0} views
                </div>
              </div>

              {/* AI Summary placeholder (premium) */}
              <div
                style={{
                  background: "#1F1F1F",
                  borderRadius: 12,
                  padding: 16,
                  marginBottom: 16,
                }}
              >
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: "#7DC67A",
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    marginBottom: 10,
                  }}
                >
                  ✦ AI Summary
                </div>
                <p
                  style={{
                    fontSize: 13,
                    color: "rgba(255,255,255,0.7)",
                    lineHeight: 1.6,
                    marginBottom: 12,
                  }}
                >
                  Unlock AI summaries of any note
                </p>
                <Link
                  to="/premium"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 4,
                    background: "#F59E0B",
                    color: "#1F1F1F",
                    borderRadius: 8,
                    padding: "8px 16px",
                    fontSize: 13,
                    fontWeight: 600,
                    textDecoration: "none",
                  }}
                >
                  Join Premium →
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
