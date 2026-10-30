import React from "react";
import { motion } from "framer-motion";
import { formatDate, getSubjectColor } from "./notesConstants";

export default function NoteCard({ note, onClick, getOwnerName, getSubjectName }) {
  const subjectName = getSubjectName(note);
  const sc = getSubjectColor(subjectName);
  const fileType = note.fileUrl?.endsWith(".pdf") ? "PDF" : note.type || "PDF";

  return (
    <motion.div
      whileHover={{ y: -3, boxShadow: "0 8px 24px rgba(0,0,0,0.1)" }}
      style={{
        background: "white",
        borderRadius: 16,
        border: "1.5px solid #E5E5E5",
        overflow: "hidden",
        cursor: "pointer",
        transition: "all 200ms",
      }}
      onClick={onClick}
    >
      {/* Colored thumbnail */}
      <div
        style={{
          height: 120,
          position: "relative",
          background: sc.bg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Big letter watermark */}
        <div
          style={{
            fontSize: 64,
            fontWeight: 900,
            color: "rgba(31,31,31,0.08)",
            lineHeight: 1,
            userSelect: "none",
          }}
        >
          {subjectName.slice(0, 2).toUpperCase()}
        </div>

        {/* File type badge */}
        <div
          style={{
            position: "absolute",
            top: 10,
            left: 10,
            background: fileType === "PDF" ? "#EF4444" : "#1F1F1F",
            color: "white",
            fontSize: 10,
            fontWeight: 700,
            padding: "3px 8px",
            borderRadius: 6,
            letterSpacing: "0.04em",
          }}
        >
          {fileType}
        </div>

        {/* Semester badge if present */}
        {note.semester && (
          <div
            style={{
              position: "absolute",
              top: 10,
              right: 10,
              background: "rgba(31,31,31,0.6)",
              backdropFilter: "blur(8px)",
              color: "white",
              fontSize: 10,
              fontWeight: 600,
              padding: "3px 8px",
              borderRadius: 6,
            }}
          >
            Sem {note.semester}
          </div>
        )}

        {/* Document icon */}
        <div
          style={{
            position: "absolute",
            width: 44,
            height: 54,
            background: "white",
            borderRadius: "0 8px 4px 4px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 18,
          }}
        >
          {fileType === "PDF" ? "📄" : "📝"}
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: "14px 16px" }}>
        {/* Subject tag pill */}
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
            marginBottom: 8,
          }}
        >
          {subjectName}
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: 14,
            fontWeight: 600,
            color: "#1F1F1F",
            lineHeight: 1.4,
            marginBottom: 8,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {note.title}
        </div>

        {/* Footer */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: 12,
            color: "#9A9A9A",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <div
              style={{
                width: 18,
                height: 18,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #7DC67A, #4A9E47)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 9,
                fontWeight: 700,
                color: "white",
              }}
            >
              {(getOwnerName(note) || "U").slice(0, 1).toUpperCase()}
            </div>
            <span>{getOwnerName(note)}</span>
          </div>
          <span>{formatDate(note.createdAt || note.uploadedAt)}</span>
        </div>
      </div>
    </motion.div>
  );
}

