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

        <NotesFilters
          selectedSemester={selectedSemester}
          setSelectedSemester={setSelectedSemester}
          selectedSubject={selectedSubject}
          setSelectedSubject={setSelectedSubject}
          selectedType={selectedType}
          setSelectedType={setSelectedType}
          uniqueSubjects={uniqueSubjects}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onSearch={() => fetchPublicNotes(searchQuery)}
          activeFilters={activeFilters}
        />

        <NotesList
          loadingPublic={loadingPublic}
          filtered={filtered}
          selectedSemester={selectedSemester}
          selectedSubject={selectedSubject}
          onOpenNote={setViewNote}
          getOwnerName={getOwnerName}
          getSubjectName={getSubjectName}
        />
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
