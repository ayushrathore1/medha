import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaArrowLeft,
  FaFileLines,
  FaFilePdf,
  FaDownload,
  FaEye,
  FaUser,
} from "react-icons/fa6";
import { FileText, Search } from "lucide-react";
import api from "../api/api";
import Button from "../components/Common/Button";
import Loader from "../components/Common/Loader";
import "../styles/responsive-pages.css";

const SubjectNotes = () => {
  const { subjectName } = useParams();
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get("search") || searchParams.get("type") || "";
  const navigate = useNavigate();
  const decodedName = decodeURIComponent(subjectName);

  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(initialQuery);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        // Try to fetch notes filtered by subject name
        const res = await api.get("/notes", {
          params: { subject: decodedName },
        });
        setNotes(res.data.notes || res.data || []);
      } catch (err) {
        console.error("Error fetching notes:", err);
        setNotes([]);
      } finally {
        setLoading(false);
      }
    };
    fetchNotes();
  }, [decodedName]);

  const filteredNotes = notes.filter(
    (note) =>
      !searchQuery ||
      note.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return <Loader fullScreen />;

  return (
    <div className="min-h-screen w-full px-3 py-6 sm:px-8 sm:py-8 bg-transparent">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <Button
              onClick={() => navigate(-1)}
              variant="ghost"
              className="bg-[var(--bg-secondary)] shadow-sm border border-[var(--border-default)] hover:bg-[var(--bg-tertiary)] text-[var(--text-secondary)]"
            >
              <FaArrowLeft className="mr-2" /> Back
            </Button>
          </div>

          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            {/* Subject badge */}
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                background: "rgba(139, 92, 246, 0.06)",
                border: "1.5px solid rgba(139, 92, 246, 0.12)",
                borderRadius: 100,
                padding: "6px 16px",
                marginBottom: 14,
                fontSize: 12,
                fontWeight: 700,
                color: "#8B5CF6",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
              }}
            >
              <FaFileLines size={14} />
              Notes & Resources
            </div>

            <h1
              className="text-3xl md:text-4xl font-black tracking-tight mb-3"
              style={{ color: "var(--text-primary)" }}
            >
              {decodedName}
            </h1>
            <p
              className="text-base md:text-lg font-medium"
              style={{ color: "var(--text-secondary)" }}
            >
              {filteredNotes.length} notes available
            </p>
          </motion.div>
        </div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{ maxWidth: 480, margin: "0 auto" }}
        >
          <div style={{ position: "relative" }}>
            <Search
              size={16}
              style={{
                position: "absolute",
                left: 14,
                top: "50%",
                transform: "translateY(-50%)",
                color: "var(--text-tertiary)",
              }}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search notes..."
              style={{
                width: "100%",
                padding: "12px 16px 12px 40px",
                borderRadius: 12,
                background: "var(--bg-tertiary)",
                border: "1.5px solid var(--border-default)",
                color: "var(--text-primary)",
                fontSize: 14,
                outline: "none",
                transition: "border-color 200ms, box-shadow 200ms",
                fontFamily: "inherit",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "var(--action-primary)";
                e.target.style.boxShadow =
                  "0 0 0 3px rgba(125,198,122,0.1)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "var(--border-default)";
                e.target.style.boxShadow = "none";
              }}
            />
          </div>
        </motion.div>

        {/* Notes Grid */}
        {filteredNotes.length > 0 ? (
          <div className="notes-grid">
            {filteredNotes.map((note, idx) => (
              <NoteCard key={note._id || idx} note={note} index={idx} />
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              textAlign: "center",
              padding: "60px 20px",
              color: "var(--text-tertiary)",
            }}
          >
            <FileText
              size={48}
              style={{ margin: "0 auto 16px", opacity: 0.3 }}
            />
            <p
              style={{
                fontSize: 16,
                fontWeight: 700,
                color: "var(--text-secondary)",
                marginBottom: 6,
              }}
            >
              No notes found
            </p>
            <p style={{ fontSize: 13 }}>
              {searchQuery
                ? `No notes matching "${searchQuery}" in ${decodedName}.`
                : `No notes available for "${decodedName}" yet. Be the first to upload!`}
            </p>
            <button
              onClick={() => navigate("/notes")}
              style={{
                marginTop: 20,
                padding: "10px 24px",
                borderRadius: 12,
                background: "var(--text-primary)",
                color: "#fff",
                fontSize: 13,
                fontWeight: 700,
                border: "none",
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              Go to Notes Community
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

/* ─── Note Card ─────────────────────────────────────────────── */
const NoteCard = ({ note, index }) => {
  const isPDF =
    note.fileUrl?.endsWith(".pdf") || note.type === "pdf";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.3 }}
      whileHover={{
        y: -3,
        boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
        borderColor: "rgba(139, 92, 246, 0.3)",
      }}
      style={{
        background: "var(--bg-tertiary)",
        border: "1.5px solid var(--border-default)",
        borderRadius: 16,
        padding: 18,
        cursor: "pointer",
        transition: "all 0.2s ease",
      }}
      onClick={() => {
        if (note.fileUrl) {
          window.open(note.fileUrl, "_blank");
        }
      }}
    >
      {/* Icon + type */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 12,
        }}
      >
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: 12,
            background: isPDF
              ? "rgba(239, 68, 68, 0.08)"
              : "rgba(139, 92, 246, 0.08)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {isPDF ? (
            <FaFilePdf size={18} style={{ color: "#ef4444" }} />
          ) : (
            <FaFileLines size={18} style={{ color: "#8B5CF6" }} />
          )}
        </div>
        {note.fileUrl && (
          <a
            href={note.fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            style={{
              padding: "4px 10px",
              borderRadius: 8,
              background: "rgba(125, 198, 122, 0.08)",
              border: "1px solid rgba(125, 198, 122, 0.15)",
              color: "var(--action-primary)",
              fontSize: 10,
              fontWeight: 700,
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: 4,
            }}
          >
            <FaDownload size={9} /> Download
          </a>
        )}
      </div>

      {/* Title */}
      <h3
        style={{
          fontSize: 14,
          fontWeight: 700,
          color: "var(--text-primary)",
          margin: 0,
          marginBottom: 6,
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
          lineHeight: 1.4,
        }}
      >
        {note.title || "Untitled Note"}
      </h3>

      {/* Description */}
      {note.description && (
        <p
          style={{
            fontSize: 12,
            color: "var(--text-tertiary)",
            margin: "0 0 10px",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            lineHeight: 1.4,
          }}
        >
          {note.description}
        </p>
      )}

      {/* Meta */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          fontSize: 11,
          color: "var(--text-tertiary)",
          fontWeight: 500,
        }}
      >
        {note.uploadedBy?.name && (
          <span
            style={{ display: "flex", alignItems: "center", gap: 3 }}
          >
            <FaUser size={9} /> {note.uploadedBy.name}
          </span>
        )}
        {note.views !== undefined && (
          <span
            style={{ display: "flex", alignItems: "center", gap: 3 }}
          >
            <FaEye size={9} /> {note.views}
          </span>
        )}
      </div>
    </motion.div>
  );
};

export default SubjectNotes;
