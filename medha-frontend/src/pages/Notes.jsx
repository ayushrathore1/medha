import React, { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useAuthGuard from "../hooks/useAuthGuard";
import { useTour } from "../context/TourContext";
import {
  API_BASE,
  MAX_NOTE_UPLOAD_BYTES,
  NOTE_TYPES,
} from "../components/Notes/notesConstants";
import NotePreviewModal from "../components/Notes/NotePreviewModal";
import UploadWizard from "../components/Notes/UploadWizard";
import NotesFilters from "../components/Notes/NotesFilters";
import NotesList from "../components/Notes/NotesList";

const Notes = () => {
  const { isGuestMode } = useTour();
  const { isAuthenticated, requireAuth } = useAuthGuard();

  const [publicNotes, setPublicNotes] = useState([]);
  const [notesCursor, setNotesCursor] = useState(null);
  const [notesHasMore, setNotesHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
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

  const fetchPublicNotes = useCallback(async (search = "", { cursor, append } = {}) => {
    if (append) setLoadingMore(true);
    else setLoadingPublic(true);
    try {
      const params = new URLSearchParams({ limit: "20" });
      if (search) params.set("search", search);
      if (cursor) params.set("cursor", cursor);
      const res = await fetch(`${API_BASE}/api/notes/public?${params.toString()}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const data = await res.json();
      if (res.ok) {
        const nextNotes = data.notes || [];
        setPublicNotes((prev) => (append ? [...prev, ...nextNotes] : nextNotes));
        setNotesCursor(data.pagination?.nextCursor || null);
        setNotesHasMore(Boolean(data.pagination?.hasMore));
      }
    } catch {
      console.error("Error fetching public notes");
    }
    setLoadingPublic(false);
    setLoadingMore(false);
  }, [token]);

  useEffect(() => {
    fetchPublicNotes(searchQuery);
  }, [searchQuery, fetchPublicNotes]);

  const handleUpload = async ({ title, semester, subject, file, description, noteType }) => {
    if (file?.size > MAX_NOTE_UPLOAD_BYTES) {
      setErrorMsg("File too large. Maximum size is 25MB.");
      return;
    }
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
        setErrorMsg(data.error || data.message || "Failed to upload file.");
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
        background: "#FFFFFF",
        minHeight: "100vh",
        fontFamily: "ui-sans-serif, system-ui, sans-serif",
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
          .notes-modal-sidebar { border-left: none !important; border-top: 1px solid #E5E5E5 !important; padding: 16px !important; }
          .notes-upload-overlay { padding: 8px !important; }
          .notes-upload-card { border-radius: 16px !important; padding: 20px !important; max-height: 95vh !important; }
        }
        @media (min-width: 641px) and (max-width: 768px) {
          .notes-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .notes-modal-body-grid { grid-template-columns: 1fr !important; }
          .notes-modal-sidebar { border-left: none !important; border-top: 1px solid #E5E5E5 !important; }
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
          backgroundImage: "radial-gradient(circle, rgba(31,31,31,0.12) 1px, transparent 1px)",
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
            <h1 className="notes-header-title" style={{ fontSize: 36, fontWeight: 800, color: "#1F1F1F", letterSpacing: "-0.03em", margin: 0 }}>
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
              background: "#1F1F1F",
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
            border: "1px solid #E5E5E5",
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
                  border: "1.5px solid #E5E5E5",
                  borderRight: "none",
                  borderRadius: "10px 0 0 10px",
                  fontSize: 15,
                  background: "#F6F6F6",
                  color: "#1F1F1F",
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
                border: "3px solid #E5E5E5",
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
          <>
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
          {notesHasMore && (
            <div style={{ textAlign: "center", marginTop: 28 }}>
              <button
                type="button"
                onClick={() => fetchPublicNotes(searchQuery, { cursor: notesCursor, append: true })}
                disabled={loadingMore}
                style={{
                  padding: "12px 24px",
                  background: "white",
                  color: "#1F1F1F",
                  border: "1.5px solid #E5E5E5",
                  borderRadius: 10,
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: loadingMore ? "default" : "pointer",
                }}
              >
                {loadingMore ? "Loading..." : "Load more notes"}
              </button>
            </div>
          )}
          </>
        )}
      </div>

      {/* ── MODALS ── */}
      <AnimatePresence>
        {viewNote && (
          <NotePreviewModal
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
