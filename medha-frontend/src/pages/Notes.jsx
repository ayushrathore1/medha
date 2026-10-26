import React, { useEffect, useState, useRef, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import useAuthGuard from "../hooks/useAuthGuard";
import { useTour } from "../context/TourContext";

const API_BASE = `${import.meta.env.VITE_BACKEND_URL}`;

/* ── Resolve file URLs (local disk vs Cloudinary) ── */
const resolveFileUrl = (url) => {
  if (!url) return "";
  // Cloudinary URLs are already absolute
  if (url.startsWith("http")) return url;
  // Local file paths need the backend base URL prepended
  return `${API_BASE}${url}`;
};

/* ── Subject Color Map ──────────────────────────────────────── */
const SUBJECT_MAP = {
  OOPs:  { bg:"#E8D2BF", tagBg:"#FFF3E8", tagColor:"#C04A00", tagBorder:"rgba(192,74,0,0.2)" },
  DBMS:  { bg:"#C8DDB8", tagBg:"#F0FAF0", tagColor:"#4A9E47", tagBorder:"rgba(74,158,71,0.2)" },
  DSA:   { bg:"#D2D8D8", tagBg:"#F0F4F4", tagColor:"#3D7A8A", tagBorder:"rgba(61,122,138,0.2)" },
  CN:    { bg:"#E2D4ED", tagBg:"#F5F0FF", tagColor:"#6D28D9", tagBorder:"rgba(109,40,217,0.2)" },
  OS:    { bg:"#FDE68A", tagBg:"#FFFBEB", tagColor:"#B45309", tagBorder:"rgba(180,83,9,0.2)" },
  Math:  { bg:"#BFDBFE", tagBg:"#EFF6FF", tagColor:"#1D4ED8", tagBorder:"rgba(29,78,216,0.2)" },
  COA:   { bg:"#FECDD3", tagBg:"#FFF1F2", tagColor:"#BE123C", tagBorder:"rgba(190,18,60,0.2)" },
  EVS:   { bg:"#BBF7D0", tagBg:"#F0FDF4", tagColor:"#166534", tagBorder:"rgba(22,101,52,0.2)" },
};

const getSubjectColor = (name) => {
  if (!name) return SUBJECT_MAP.OOPs;
  const key = Object.keys(SUBJECT_MAP).find(k => name.toLowerCase().includes(k.toLowerCase()));
  if (key) return SUBJECT_MAP[key];
  // Generate from hash
  const colors = Object.values(SUBJECT_MAP);
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
};

const SEMESTERS = ["All","1st","2nd","3rd","4th","5th","6th","7th","8th"];
const NOTE_TYPES = [
  { key:"all", label:"All Notes", icon:"📚" },
  { key:"pyq", label:"PYQ Papers", icon:"📄" },
  { key:"handwritten", label:"Handwritten", icon:"📝" },
  { key:"typed", label:"Typed", icon:"💻" },
  { key:"diagrams", label:"Diagrams", icon:"📊" },
];
const UPLOAD_TYPES = ["📄 PYQ Paper","📝 Handwritten Notes","💻 Typed Notes","📊 Diagrams"];

/* ── helpers ── */
const formatDate = (d) => {
  if (!d) return "";
  const date = new Date(d);
  const now = new Date();
  const diff = Math.floor((now - date) / (1000 * 60 * 60 * 24));
  if (diff === 0) return "Today";
  if (diff === 1) return "Yesterday";
  if (diff < 7) return `${diff}d ago`;
  return date.toLocaleDateString("en-IN", { day:"numeric", month:"short" });
};

/* ── shared styles ── */
const chipStyle = (active) => ({
  padding: "8px 16px",
  borderRadius: 10,
  fontSize: 13,
  fontWeight: 600,
  background: active ? "#1A1A2E" : "white",
  color: active ? "white" : "#6B6B6B",
  border: `1.5px solid ${active ? "#1A1A2E" : "#E8E4DC"}`,
  cursor: "pointer",
  transition: "all 150ms",
  fontFamily: "inherit",
});

const labelStyle = {
  fontSize: 11,
  fontWeight: 700,
  color: "#7DC67A",
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  marginBottom: 8,
  display: "block",
};

const inputStyle = {
  width: "100%",
  padding: "14px 16px",
  border: "1.5px solid #E8E4DC",
  borderRadius: 12,
  fontSize: 15,
  color: "#1A1A2E",
  background: "#F9F6F1",
  outline: "none",
  transition: "border-color 200ms, box-shadow 200ms",
  fontFamily: "'DM Sans', sans-serif",
};

const inputFocus = (e) => {
  e.target.style.borderColor = "#7DC67A";
  e.target.style.boxShadow = "0 0 0 3px rgba(125,198,122,0.1)";
  e.target.style.background = "white";
};
const inputBlur = (e) => {
  e.target.style.borderColor = "#E8E4DC";
  e.target.style.boxShadow = "none";
  e.target.style.background = "#F9F6F1";
};

/* ── NoteCard component ──────────────────────────────────────── */
const NoteCard = ({ note, onClick, getOwnerName, getSubjectName }) => {
  const subjectName = getSubjectName(note);
  const sc = getSubjectColor(subjectName);
  const fileType = note.fileUrl?.endsWith(".pdf") ? "PDF" : note.type || "PDF";

  return (
    <motion.div
      whileHover={{ y: -3, boxShadow: "0 8px 24px rgba(0,0,0,0.1)" }}
      style={{
        background: "white",
        borderRadius: 16,
        border: "1.5px solid #E8E4DC",
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
            color: "rgba(26,26,46,0.08)",
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
            background: fileType === "PDF" ? "#EF4444" : "#1A1A2E",
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
              background: "rgba(26,26,46,0.6)",
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
            color: "#1A1A2E",
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
};

/* ── NoteModal component ─────────────────────────────────────── */
const NoteDetailModal = ({ note, onClose, getOwnerName, getSubjectName }) => {
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
          background: "rgba(26,26,46,0.6)",
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
              borderBottom: "1px solid #E8E4DC",
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
                  color: "#1A1A2E",
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
                onMouseEnter={(e) => (e.currentTarget.style.background = "#F9F6F1")}
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
                      border: "2px solid #E8E4DC",
                    }}
                  >
                    📄
                  </div>

                  <div>
                    <div style={{ fontSize: 18, fontWeight: 700, color: "#1A1A2E", marginBottom: 6 }}>
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
                borderLeft: "1px solid #E8E4DC",
                overflowY: "auto",
              }}
            >
              {/* About */}
              <div
                style={{
                  background: "#F9F6F1",
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
                  background: "#1A1A2E",
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
                    color: "#1A1A2E",
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
};

/* ── Upload Wizard Modal ─────────────────────────────────────── */
const UploadWizard = ({ isOpen, onClose, onUpload, uploading }) => {
  const [step, setStep] = useState(1);
  const [title, setTitle] = useState("");
  const [semester, setSemester] = useState("");
  const [subject, setSubject] = useState("");
  const [noteType, setNoteType] = useState("");
  const [file, setFile] = useState(null);
  const [description, setDescription] = useState("");
  const [rights, setRights] = useState(false);
  const [edu, setEdu] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef(null);

  if (!isOpen) return null;

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files[0]) setFile(e.dataTransfer.files[0]);
  };

  const handleSubmit = () => {
    if (!title || !file) return;
    onUpload({ title, semester, subject: subject || noteType, file, description, noteType });
    // Reset
    setStep(1);
    setTitle("");
    setSemester("");
    setSubject("");
    setNoteType("");
    setFile(null);
    setDescription("");
    setRights(false);
    setEdu(false);
  };

  const stepLabels = ["What", "Upload", "Finish"];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="notes-upload-overlay"
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(26,26,46,0.6)",
        backdropFilter: "blur(4px)",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
      }}
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="notes-upload-card"
        style={{
          maxWidth: 560,
          width: "100%",
          background: "white",
          borderRadius: 20,
          padding: 32,
          maxHeight: "95vh",
          overflowY: "auto",
        }}
      >
        {/* Step indicator */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0, marginBottom: 32 }}>
          {stepLabels.map((l, i) => {
            const num = i + 1;
            const done = step > num;
            const active = step === num;
            return (
              <React.Fragment key={num}>
                {i > 0 && (
                  <div style={{ width: 40, height: 2, background: done ? "#7DC67A" : "#E8E4DC", margin: "0 4px" }} />
                )}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: "50%",
                      background: done ? "#7DC67A" : active ? "#1A1A2E" : "white",
                      border: `2px solid ${done ? "#7DC67A" : active ? "#1A1A2E" : "#E8E4DC"}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 12,
                      fontWeight: 700,
                      color: done || active ? "white" : "#9A9A9A",
                    }}
                  >
                    {done ? "✓" : num}
                  </div>
                  <span style={{ fontSize: 10, color: active ? "#1A1A2E" : "#9A9A9A", fontWeight: 600 }}>{l}</span>
                </div>
              </React.Fragment>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="s1" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h3 style={{ fontSize: 22, fontWeight: 800, color: "#1A1A2E", marginBottom: 4 }}>What are you sharing?</h3>
              <p style={{ fontSize: 14, color: "#6B6B6B", marginBottom: 24 }}>This helps students find your note faster.</p>

              {/* Title */}
              <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>NOTE TITLE</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. OOPs Unit 3 — Inheritance Notes"
                  style={inputStyle}
                  onFocus={inputFocus}
                  onBlur={inputBlur}
                />
                <span style={{ fontSize: 11, color: "#9A9A9A", marginTop: 4, display: "block" }}>Be specific — include subject + topic</span>
              </div>

              {/* Semester */}
              <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>SEMESTER</label>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 6 }}>
                  {["1st","2nd","3rd","4th","5th","6th","7th","8th"].map(s => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSemester(s)}
                      style={{
                        padding: "10px 0",
                        borderRadius: 10,
                        fontSize: 13,
                        fontWeight: 600,
                        textAlign: "center",
                        background: semester === s ? "#1A1A2E" : "white",
                        color: semester === s ? "white" : "#6B6B6B",
                        border: `1.5px solid ${semester === s ? "#1A1A2E" : "#E8E4DC"}`,
                        cursor: "pointer",
                        transition: "all 150ms",
                      }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Subject */}
              <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>SUBJECT</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. OOPs, DBMS, DSA..."
                  style={inputStyle}
                  onFocus={inputFocus}
                  onBlur={inputBlur}
                />
              </div>

              {/* Note type */}
              <div style={{ marginBottom: 20 }}>
                <label style={labelStyle}>TYPE</label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {UPLOAD_TYPES.map(t => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setNoteType(t)}
                      style={{
                        padding: "8px 14px",
                        borderRadius: 10,
                        fontSize: 13,
                        fontWeight: 600,
                        background: noteType === t ? "#F0FAF0" : "white",
                        color: noteType === t ? "#4A9E47" : "#6B6B6B",
                        border: `1.5px solid ${noteType === t ? "#7DC67A" : "#E8E4DC"}`,
                        cursor: "pointer",
                        transition: "all 150ms",
                      }}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={() => { if (title) setStep(2); }}
                style={{
                  width: "100%",
                  padding: 14,
                  background: title ? "#1A1A2E" : "#9A9A9A",
                  color: "white",
                  borderRadius: 12,
                  border: "none",
                  fontSize: 15,
                  fontWeight: 700,
                  cursor: title ? "pointer" : "not-allowed",
                }}
              >
                Next →
              </button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="s2" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 30 }}>
              <h3 style={{ fontSize: 22, fontWeight: 800, color: "#1A1A2E", marginBottom: 4 }}>Upload your file</h3>
              <p style={{ fontSize: 14, color: "#6B6B6B", marginBottom: 24 }}>Drag & drop or click to browse.</p>

              {/* Drop zone */}
              <div
                onClick={() => fileRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                style={{
                  border: `2px dashed ${dragOver ? "#7DC67A" : "#E8E4DC"}`,
                  borderRadius: 16,
                  padding: "48px 32px",
                  textAlign: "center",
                  background: dragOver ? "#F0FAF0" : "#F9F6F1",
                  transition: "all 200ms",
                  cursor: "pointer",
                  marginBottom: 20,
                }}
              >
                <div
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: "50%",
                    background: "white",
                    border: "2px solid #E8E4DC",
                    margin: "0 auto 16px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 24,
                  }}
                >
                  ⬆
                </div>
                <div style={{ fontSize: 16, fontWeight: 600, color: "#1A1A2E", marginBottom: 6 }}>
                  {file ? file.name : "Drop your file here"}
                </div>
                <div style={{ fontSize: 13, color: "#9A9A9A", marginBottom: 16 }}>
                  {file ? `${(file.size / 1024 / 1024).toFixed(1)} MB` : "or click to browse"}
                </div>
                {!file && (
                  <span
                    style={{
                      display: "inline-block",
                      background: "#1A1A2E",
                      color: "white",
                      borderRadius: 10,
                      padding: "10px 24px",
                      fontSize: 14,
                      fontWeight: 600,
                    }}
                  >
                    Browse Files
                  </span>
                )}
                <div style={{ fontSize: 12, color: "#9A9A9A", marginTop: 12 }}>
                  PDF, JPG, PNG · No size limit
                </div>
                <input
                  ref={fileRef}
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png,.gif"
                  onChange={(e) => setFile(e.target.files[0])}
                  style={{ display: "none" }}
                />
              </div>

              <div style={{ display: "flex", gap: 8 }}>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  style={{
                    padding: "12px 24px",
                    background: "white",
                    color: "#6B6B6B",
                    borderRadius: 10,
                    border: "1.5px solid #E8E4DC",
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  ← Back
                </button>
                <button
                  type="button"
                  onClick={() => { if (file) setStep(3); }}
                  style={{
                    flex: 1,
                    padding: 14,
                    background: file ? "#1A1A2E" : "#9A9A9A",
                    color: "white",
                    borderRadius: 12,
                    border: "none",
                    fontSize: 15,
                    fontWeight: 700,
                    cursor: file ? "pointer" : "not-allowed",
                  }}
                >
                  Next →
                </button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="s3" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 30 }}>
              <h3 style={{ fontSize: 22, fontWeight: 800, color: "#1A1A2E", marginBottom: 4 }}>Almost done!</h3>
              <p style={{ fontSize: 14, color: "#6B6B6B", marginBottom: 24 }}>Add some context and share.</p>

              {/* Preview */}
              <div
                style={{
                  background: "#F9F6F1",
                  borderRadius: 12,
                  padding: 16,
                  marginBottom: 16,
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                }}
              >
                <div
                  style={{
                    width: 48,
                    height: 56,
                    background: "white",
                    borderRadius: 6,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 20,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                  }}
                >
                  📄
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#1A1A2E" }}>{title}</div>
                  <div style={{ fontSize: 12, color: "#9A9A9A" }}>
                    {file?.name} · {file ? `${(file.size / 1024 / 1024).toFixed(1)} MB` : ""}
                  </div>
                </div>
              </div>

              {/* Description */}
              <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>ADD CONTEXT (OPTIONAL)</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. This covers Unit 3 and 4 of OOPs. Includes examples."
                  rows={3}
                  style={{ ...inputStyle, resize: "vertical" }}
                  onFocus={inputFocus}
                  onBlur={inputBlur}
                />
              </div>

              {/* Checkboxes */}
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#6B6B6B", cursor: "pointer", marginBottom: 8 }}>
                  <input type="checkbox" checked={rights} onChange={(e) => setRights(e.target.checked)} />
                  I have the right to share this material
                </label>
                <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#6B6B6B", cursor: "pointer" }}>
                  <input type="checkbox" checked={edu} onChange={(e) => setEdu(e.target.checked)} />
                  This is for educational purposes only
                </label>
              </div>

              <div style={{ display: "flex", gap: 8 }}>
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  style={{
                    padding: "12px 24px",
                    background: "white",
                    color: "#6B6B6B",
                    borderRadius: 10,
                    border: "1.5px solid #E8E4DC",
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  ← Back
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={uploading || !rights || !edu}
                  style={{
                    flex: 1,
                    padding: 14,
                    background: rights && edu && !uploading ? "#7DC67A" : "#9A9A9A",
                    color: "#1A1A2E",
                    borderRadius: 12,
                    border: "none",
                    fontSize: 15,
                    fontWeight: 700,
                    cursor: rights && edu ? "pointer" : "not-allowed",
                  }}
                >
                  {uploading ? "Uploading..." : "Share with community →"}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

/* ════════════════════════════════════════════════════════════════
   MAIN NOTES COMMUNITY PAGE
   ════════════════════════════════════════════════════════════════ */
const Notes = () => {
  const { isGuestMode } = useTour();
  const { isAuthenticated, requireAuth } = useAuthGuard();
  const navigate = useNavigate();

  const [publicNotes, setPublicNotes] = useState([]);
  const [loadingPublic, setLoadingPublic] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [viewNote, setViewNote] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("All");
  const [selectedSubject, setSelectedSubject] = useState("All");
  const [selectedType, setSelectedType] = useState("all");
  const [showUpload, setShowUpload] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showAuraAnimation, setShowAuraAnimation] = useState(false);
  const token = localStorage.getItem("token");

  const getOwnerName = (note) => {
    if (note.owner?.name) return note.owner.name;
    if (note.owner?.email) return note.owner.email.split("@")[0];
    return "Unknown";
  };

  const getSubjectName = (note) => {
    if (note.subjectTag) return note.subjectTag;
    if (note.subject?.name) return note.subject.name;
    return "General";
  };

  const fetchPublicNotes = useCallback(async (search = "") => {
    setLoadingPublic(true);
    try {
      const url = search
        ? `${API_BASE}/api/notes/public?search=${encodeURIComponent(search)}`
        : `${API_BASE}/api/notes/public`;
      const res = await fetch(url, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const data = await res.json();
      if (res.ok) setPublicNotes(data.notes || []);
    } catch {
      console.error("Error fetching public notes");
    }
    setLoadingPublic(false);
  }, [token]);

  useEffect(() => {
    fetchPublicNotes(searchQuery);
  }, [searchQuery, fetchPublicNotes]);

  const handleUpload = async ({ title, semester, subject, file, description, noteType }) => {
    setUploading(true);
    setErrorMsg("");
    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);
    formData.append("subjectTag", subject || "General");
    formData.append("isPublic", true);
    if (semester) formData.append("semester", semester);
    if (description) formData.append("description", description);
    if (noteType) formData.append("noteType", noteType);

    try {
      const res = await fetch(`${API_BASE}/api/notes`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        setShowUpload(false);
        fetchPublicNotes(searchQuery);
        setShowAuraAnimation(true);
        setTimeout(() => setShowAuraAnimation(false), 3000);
      } else {
        setErrorMsg(data.error || "Failed to upload file.");
      }
    } catch {
      setErrorMsg("Server error uploading file.");
    }
    setUploading(false);
  };

  // Compute filtered notes
  const filtered = publicNotes.filter(note => {
    if (selectedSemester !== "All" && note.semester && note.semester !== selectedSemester.replace(/[a-z]/g, "")) return false;
    if (selectedSubject !== "All" && getSubjectName(note) !== selectedSubject) return false;
    return true;
  });

  // Get unique subjects from notes
  const uniqueSubjects = ["All", ...new Set(publicNotes.map(n => getSubjectName(n)))].slice(0, 10);

  // Active filters for strip
  const activeFilters = [];
  if (selectedSemester !== "All") activeFilters.push({ key: "semester", label: selectedSemester + " Sem" });
  if (selectedSubject !== "All") activeFilters.push({ key: "subject", label: selectedSubject });
  if (selectedType !== "all") activeFilters.push({ key: "type", label: NOTE_TYPES.find(t => t.key === selectedType)?.label });

  return (
    <div
      style={{
        background: "#F2EDE4",
        minHeight: "100vh",
        fontFamily: "'DM Sans', sans-serif",
        position: "relative",
      }}
    >
      <style>{`
        .btn-shine { position: relative; overflow: hidden; }
        .btn-shine::after {
          content:''; position:absolute; top:-50%; left:-100%;
          width:50%; height:200%;
          background:linear-gradient(90deg,transparent,rgba(255,255,255,0.18),transparent);
          transform:skewX(-20deg); transition:left 400ms ease;
        }
        .btn-shine:hover::after { left:160%; }
        @media (max-width: 640px) {
          .notes-grid { grid-template-columns: 1fr !important; }
          .notes-header-title { font-size: 26px !important; }
          .notes-main-container { padding: 16px 12px !important; }
          .notes-filter-bar { padding: 14px !important; }
          .notes-modal-overlay { padding: 8px !important; }
          .notes-modal-container { width: 100vw !important; border-radius: 12px !important; max-height: 95vh !important; }
          .notes-modal-header { padding: 14px 16px !important; }
          .notes-modal-title-text { font-size: 16px !important; }
          .notes-modal-body-grid { grid-template-columns: 1fr !important; min-height: 300px !important; }
          .notes-modal-sidebar { border-left: none !important; border-top: 1px solid #E8E4DC !important; padding: 16px !important; }
          .notes-upload-overlay { padding: 8px !important; }
          .notes-upload-card { border-radius: 16px !important; padding: 20px !important; max-height: 95vh !important; }
        }
        @media (min-width: 641px) and (max-width: 768px) {
          .notes-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .notes-modal-body-grid { grid-template-columns: 1fr !important; }
          .notes-modal-sidebar { border-left: none !important; border-top: 1px solid #E8E4DC !important; }
        }
        @media (min-width: 769px) and (max-width: 1024px) {
          .notes-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>

      {/* Dot grid bg */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          backgroundImage: "radial-gradient(circle, rgba(26,26,46,0.12) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
          opacity: 0.3,
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* AURA++ Animation */}
      <AnimatePresence>
        {showAuraAnimation && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.5, y: -100 }}
            transition={{ duration: 0.5 }}
            style={{ position: "fixed", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50, pointerEvents: "none" }}
          >
            <motion.div
              animate={{ textShadow: ["0 0 20px rgba(251,191,36,0.8)", "0 0 60px rgba(251,191,36,1)", "0 0 20px rgba(251,191,36,0.8)"] }}
              transition={{ duration: 1, repeat: Infinity }}
              style={{ fontSize: 72, fontWeight: 900, background: "linear-gradient(135deg,#fcd34d,#f59e0b,#fbbf24)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
            >
              AURA++
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="notes-main-container" style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 24px", position: "relative", zIndex: 1 }}>
        {/* ── HEADER ── */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16 }}>
          <div>
            <h1 className="notes-header-title" style={{ fontSize: 36, fontWeight: 800, color: "#1A1A2E", letterSpacing: "-0.03em", margin: 0 }}>
              Notes Community
            </h1>
            <p style={{ fontSize: 15, color: "#6B6B6B", marginTop: 4 }}>
              Study materials uploaded by students, for students.
            </p>
          </div>
          <button
            className="btn-shine"
            onClick={() => {
              if (isAuthenticated || isGuestMode) {
                setShowUpload(true);
              } else {
                requireAuth(() => setShowUpload(true), "Uploading Notes");
              }
            }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "12px 20px",
              background: "#1A1A2E",
              color: "white",
              borderRadius: 12,
              border: "none",
              fontSize: 15,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            + Share Your Notes
          </button>
        </div>

        {/* Disclaimer */}
        <div
          style={{
            background: "#FFF8ED",
            border: "1px solid rgba(245,158,11,0.3)",
            borderRadius: 10,
            padding: "10px 16px",
            display: "flex",
            alignItems: "center",
            gap: 8,
            fontSize: 13,
            color: "#92400E",
            marginTop: 16,
          }}
        >
          <span>⚠</span>
          Notes are uploaded by students. MEDHA doesn't own this content. For educational use only.
        </div>

        {/* Error */}
        {errorMsg && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 8,
              background: "rgba(239,68,68,0.06)",
              border: "1px solid rgba(239,68,68,0.15)",
              borderRadius: 10,
              padding: "10px 16px",
              fontSize: 13,
              color: "#EF4444",
              marginTop: 12,
            }}
          >
            <span>⚠ {errorMsg}</span>
            <button onClick={() => setErrorMsg("")} style={{ background: "none", border: "none", color: "#EF4444", cursor: "pointer", fontWeight: 700 }}>×</button>
          </div>
        )}

        {/* ── SMART FIND BAR ── */}
        <div
          className="notes-filter-bar"
          style={{
            background: "white",
            borderRadius: 16,
            border: "1px solid #E8E4DC",
            padding: 20,
            marginTop: 24,
            boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
          }}
        >
          {/* Semester row */}
          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>SEMESTER</label>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {SEMESTERS.map(s => (
                <button key={s} type="button" onClick={() => setSelectedSemester(s)} style={chipStyle(selectedSemester === s)}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Subject row */}
          {uniqueSubjects.length > 1 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              style={{ marginBottom: 16 }}
            >
              <label style={labelStyle}>SUBJECT</label>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {uniqueSubjects.map(s => (
                  <button key={s} type="button" onClick={() => setSelectedSubject(s)} style={chipStyle(selectedSubject === s)}>
                    {s}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Type row */}
          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>TYPE</label>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {NOTE_TYPES.map(t => (
                <button key={t.key} type="button" onClick={() => setSelectedType(t.key)} style={chipStyle(selectedType === t.key)}>
                  {t.icon} {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Search */}
          <div style={{ display: "flex", gap: 0, marginTop: 12 }}>
            <div style={{ position: "relative", flex: 1 }}>
              <span style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", fontSize: 16, color: "#9A9A9A" }}>🔍</span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by topic, chapter, author..."
                style={{
                  width: "100%",
                  padding: "12px 16px 12px 44px",
                  border: "1.5px solid #E8E4DC",
                  borderRight: "none",
                  borderRadius: "10px 0 0 10px",
                  fontSize: 15,
                  background: "#F9F6F1",
                  color: "#1A1A2E",
                  outline: "none",
                  fontFamily: "inherit",
                }}
              />
            </div>
            <button
              onClick={() => fetchPublicNotes(searchQuery)}
              style={{
                padding: "12px 24px",
                background: "#7DC67A",
                color: "white",
                border: "none",
                borderRadius: "0 10px 10px 0",
                fontSize: 15,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Search
            </button>
          </div>
        </div>

        {/* Active filters strip */}
        {activeFilters.length > 0 && (
          <div style={{ display: "flex", gap: 6, marginTop: 12, flexWrap: "wrap", alignItems: "center" }}>
            <span style={{ fontSize: 12, color: "#9A9A9A" }}>Filtered by:</span>
            {activeFilters.map(f => (
              <div
                key={f.key}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                  background: "#F0FAF0",
                  border: "1px solid rgba(125,198,122,0.3)",
                  borderRadius: 999,
                  padding: "3px 10px",
                  fontSize: 12,
                  color: "#4A9E47",
                  fontWeight: 500,
                }}
              >
                {f.label}
                <button
                  onClick={() => {
                    if (f.key === "semester") setSelectedSemester("All");
                    if (f.key === "subject") setSelectedSubject("All");
                    if (f.key === "type") setSelectedType("all");
                  }}
                  style={{ marginLeft: 2, color: "#4A9E47", background: "none", border: "none", cursor: "pointer", fontSize: 14, lineHeight: 1 }}
                >
                  ×
                </button>
              </div>
            ))}
            <button
              onClick={() => { setSelectedSemester("All"); setSelectedSubject("All"); setSelectedType("all"); }}
              style={{ fontSize: 12, color: "#9A9A9A", textDecoration: "underline", background: "none", border: "none", cursor: "pointer" }}
            >
              Clear all
            </button>
          </div>
        )}

        {/* Results count */}
        <p style={{ fontSize: 13, color: "#9A9A9A", marginTop: 16, marginBottom: 20 }}>
          Showing {filtered.length} note{filtered.length !== 1 ? "s" : ""}
          {selectedSemester !== "All" ? ` for ${selectedSemester} Semester` : ""}
          {selectedSubject !== "All" ? ` · ${selectedSubject}` : ""}
        </p>

        {/* ── NOTES GRID ── */}
        {loadingPublic ? (
          <div style={{ textAlign: "center", padding: "80px 0" }}>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              style={{
                width: 40,
                height: 40,
                border: "3px solid #E8E4DC",
                borderTopColor: "#7DC67A",
                borderRadius: "50%",
                margin: "0 auto",
              }}
            />
            <p style={{ fontSize: 14, color: "#9A9A9A", marginTop: 16 }}>Loading notes...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 0" }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>📚</div>
            <p style={{ fontSize: 18, fontWeight: 700, color: "#9A9A9A" }}>No notes found.</p>
            <p style={{ fontSize: 14, color: "#9A9A9A", marginTop: 4 }}>Be the first to share your study materials!</p>
          </div>
        ) : (
          <div className="notes-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20 }}>
            {filtered.map(note => (
              <NoteCard
                key={note._id}
                note={note}
                onClick={() => setViewNote(note)}
                getOwnerName={getOwnerName}
                getSubjectName={getSubjectName}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── MODALS ── */}
      <AnimatePresence>
        {viewNote && (
          <NoteDetailModal
            note={viewNote}
            onClose={() => setViewNote(null)}
            getOwnerName={getOwnerName}
            getSubjectName={getSubjectName}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showUpload && (
          <UploadWizard
            isOpen={showUpload}
            onClose={() => setShowUpload(false)}
            onUpload={handleUpload}
            uploading={uploading}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Notes;
