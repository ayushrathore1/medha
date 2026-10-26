import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import {
  FaArrowLeft,
  FaYoutube,
  FaPlay,
  FaArrowRight,
  FaFilePdf,
  FaFileLines,
  FaChartBar,
  FaWandMagicSparkles,
  FaChevronDown,
  FaBook,
} from "react-icons/fa6";
import { Sparkles } from "lucide-react";
import api from "../api/api";
import Button from "../components/Common/Button";
import Loader from "../components/Common/Loader";
import SYLLABUS_DATA from "../data/syllabusData";
import { FaCloudArrowUp } from "react-icons/fa6";
import "../styles/responsive-pages.css";

// 4th semester subjects (hardcoded — no backend data yet)
const SEM_4_SUBJECTS = [
  { name: "Discrete Mathematics Structure" },
  { name: "Technical Communication" },
  { name: "Microprocessor & Interfaces" },
  { name: "Database Management System" },
  { name: "Theory Of Computation" },
  { name: "Data Communication & Computer Networks" },
];

/* ─────────────────────────────────────────────────────────────
   Main Page
   ───────────────────────────────────────────────────────────── */
const SemesterSubjects = () => {
  const { semId } = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const semNum = parseInt(semId, 10);

  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const expandedSubjects = new Set(
    (searchParams.get("open") || "").split(",").filter(Boolean).map(decodeURIComponent)
  );

  const toggleSubject = (name) => {
    const next = new Set(expandedSubjects);
    if (next.has(name)) {
      next.delete(name);
    } else {
      next.add(name);
    }
    const openParam = [...next].map(encodeURIComponent).join(",");
    setSearchParams(openParam ? { open: openParam } : {}, { replace: true });
  };

  useEffect(() => {
    const fetchSubjects = async () => {
      setLoading(true);
      try {
        if (semNum === 3) {
          const token = localStorage.getItem("token");
          const headers = { Authorization: `Bearer ${token}` };
          const baseUrl = import.meta.env.VITE_BACKEND_URL;
          const res = await axios.get(`${baseUrl}/api/rtu/3rd-sem`, { headers });
          setSubjects(res.data.topics || []);
        } else if (semNum === 4) {
          setSubjects(SEM_4_SUBJECTS);
        } else {
          setSubjects([]);
        }
      } catch (err) {
        console.error("Error fetching subjects:", err);
        setSubjects([]);
      } finally {
        setLoading(false);
      }
    };
    fetchSubjects();
  }, [semNum]);

  const semLabel =
    semNum === 1 ? "1st" : semNum === 2 ? "2nd" : semNum === 3 ? "3rd" : `${semNum}th`;

  if (loading) return <Loader fullScreen />;

  return (
    <div className="min-h-screen w-full px-3 py-6 sm:px-8 sm:py-8 bg-transparent">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center gap-3 mb-4 sm:mb-6">
            <Button
              onClick={() => navigate("/dashboard")}
              variant="ghost"
              className="bg-[var(--bg-secondary)] shadow-sm border border-[var(--border-default)] hover:bg-[var(--bg-tertiary)] text-[var(--text-secondary)]"
            >
              <FaArrowLeft className="mr-2" /> Back
            </Button>
          </div>

          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-2xl sm:text-3xl md:text-5xl font-black text-[var(--text-primary)] tracking-tight mb-2 sm:mb-3">
              {semLabel} Semester
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-[var(--text-secondary)] font-medium">
              {subjects.length} subjects · Click any to explore resources
            </p>
          </motion.div>
        </div>

        {/* Subject Cards */}
        {subjects.length > 0 ? (
          <LayoutGroup>
            <motion.div
              layout
              style={{ display: "flex", flexDirection: "column", gap: 16 }}
            >
              <SubjectGrid
                subjects={subjects}
                expandedSubjects={expandedSubjects}
                onToggle={toggleSubject}
              />
            </motion.div>
          </LayoutGroup>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              textAlign: "center",
              padding: "60px 20px",
              background: "var(--bg-tertiary)",
              borderRadius: 20,
              border: "1.5px solid var(--border-default)",
            }}
          >
            <FaBook size={36} style={{ color: "var(--text-tertiary)", opacity: 0.4, marginBottom: 12 }} />
            <p style={{ fontSize: 16, fontWeight: 700, color: "var(--text-secondary)", marginBottom: 6 }}>
              Coming Soon
            </p>
            <p style={{ fontSize: 13, color: "var(--text-tertiary)" }}>
              {semLabel} Semester content is being prepared. Stay tuned!
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

/* ─── Subject Grid ─── */
const SubjectGrid = ({ subjects, expandedSubjects, onToggle }) => {
  const items = [];
  let currentRow = [];

  subjects.forEach((subject) => {
    const isExpanded = expandedSubjects.has(subject.name);
    if (isExpanded) {
      if (currentRow.length > 0) {
        items.push({ type: "row", subjects: [...currentRow] });
        currentRow = [];
      }
      items.push({ type: "expanded", subject });
    } else {
      currentRow.push(subject);
      if (currentRow.length === 3) {
        items.push({ type: "row", subjects: [...currentRow] });
        currentRow = [];
      }
    }
  });

  if (currentRow.length > 0) {
    items.push({ type: "row", subjects: [...currentRow] });
  }

  return (
    <>
      {items.map((item) => {
        if (item.type === "row") {
          return (
            <motion.div
              key={`row-${item.subjects.map((s) => s.name).join("-")}`}
              layout
              transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
              className="subject-grid-row"
              data-cols={Math.min(item.subjects.length, 3)}
            >
              {item.subjects.map((subject, si) => (
                <SubjectCard
                  key={subject.name}
                  subject={subject}
                  index={si}
                  onClick={() => onToggle(subject.name)}
                  isExpanded={false}
                />
              ))}
            </motion.div>
          );
        }

        return (
          <motion.div
            key={`expanded-${item.subject.name}`}
            layout
            transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <SubjectCard
              subject={item.subject}
              index={0}
              onClick={() => onToggle(item.subject.name)}
              isExpanded={true}
            />
          </motion.div>
        );
      })}
    </>
  );
};

/* ─── Subject Card ─── */
const SubjectCard = ({ subject, index, onClick, isExpanded }) => {
  return (
    <motion.div
      layout
      transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
      onClick={onClick}
      style={{
        background: isExpanded
          ? "linear-gradient(135deg, rgba(125,198,122,0.06), rgba(125,198,122,0.02))"
          : "var(--bg-tertiary)",
        border: isExpanded
          ? "2px solid rgba(125, 198, 122, 0.35)"
          : "1.5px solid var(--border-default)",
        borderRadius: 20,
        cursor: "pointer",
        overflow: "hidden",
        transition: "border-color 0.25s, background 0.25s",
      }}
    >
      {/* Header */}
      <motion.div
        layout="position"
        className={`subject-card-header ${isExpanded ? "expanded" : ""}`}
      >
        <div
          className="subject-icon-box"
          style={{
            background: isExpanded
              ? "linear-gradient(135deg, #7DC67A, #4A9E47)"
              : "rgba(125, 198, 122, 0.1)",
          }}
        >
          <FaBook
            size={22}
            style={{
              color: isExpanded ? "#fff" : "var(--action-primary)",
              transition: "color 0.3s",
            }}
          />
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <h3
            className={`subject-title ${isExpanded ? "expanded" : "collapsed"}`}
            style={{
              color: isExpanded ? "var(--action-primary)" : "var(--text-primary)",
            }}
          >
            {subject.name}
          </h3>
        </div>

        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          style={{ flexShrink: 0 }}
        >
          <FaChevronDown size={16} style={{ color: "var(--text-tertiary)" }} />
        </motion.div>
      </motion.div>

      {/* Expanded — resource cards */}
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
            style={{ overflow: "hidden" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="resource-cards-grid">
              <YTPreviewCard subjectName={subject.name} />
              <NotesPreviewCard subjectName={subject.name} />
              <PYQPreviewCard subjectName={subject.name} />
              <AIPreviewCard subjectName={subject.name} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

/* ─── Resource Card Wrapper ─── */
const ResourceCard = ({ icon: Icon, iconColor, iconBg, title, children, actionLabel, onAction, onCardClick }) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    whileHover={{ y: -3, boxShadow: "0 8px 24px rgba(0,0,0,0.06)", borderColor: `${iconColor}40` }}
    onClick={onCardClick}
    className="resource-card"
  >
    <div className="resource-card-header">
      <div className="resource-card-title">
        <div className="resource-icon-box" style={{ background: iconBg }}>
          <Icon size={17} style={{ color: iconColor }} />
        </div>
        <span style={{ fontSize: 15, fontWeight: 700, color: "var(--text-primary)" }}>
          {title}
        </span>
      </div>
      {actionLabel && (
        <button
          onClick={(e) => { e.stopPropagation(); onAction?.(); }}
          className="view-all-btn"
          style={{ background: iconBg, color: iconColor, border: `1px solid ${iconColor}20` }}
        >
          {actionLabel} <FaArrowRight size={9} />
        </button>
      )}
    </div>
    <div style={{ flex: 1 }}>{children}</div>
  </motion.div>
);

/* ─── YT Preview Card ─── */
const YTPreviewCard = ({ subjectName }) => {
  const navigate = useNavigate();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    // Check for pre-assigned playlist videos first
    const syllabusUnits = SYLLABUS_DATA[subjectName] || [];
    const hardcodedVideos = syllabusUnits.flatMap((u) => u.videos || []);

    if (hardcodedVideos.length > 0) {
      // Use first 3 videos from the hardcoded playlist data
      if (!cancelled) setVideos(hardcodedVideos.slice(0, 3));
      if (!cancelled) setLoading(false);
      return () => { cancelled = true; };
    }

    // No hardcoded videos — skip AI search, show coming soon
    if (!cancelled) setVideos([]);
    if (!cancelled) setLoading(false);
    return () => { cancelled = true; };
  }, [subjectName]);

  const handleCardClick = () => {
    navigate(`/rtu-exams/subject/${encodeURIComponent(subjectName)}/youtube`);
  };

  return (
    <ResourceCard
      icon={FaYoutube}
      iconColor="#FF0000"
      iconBg="rgba(255,0,0,0.08)"
      title="YouTube Lectures"
      actionLabel="View All"
      onAction={handleCardClick}
      onCardClick={handleCardClick}
    >
      {loading ? (
        <div className="yt-thumb-row">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="yt-thumb shimmer-block"
              style={{ background: "var(--bg-secondary)" }}
            />
          ))}
        </div>
      ) : videos.length > 0 ? (
        <div className="yt-thumb-row">
          {videos.map((v, i) => (
            <a
              key={v.videoId || i}
              href={`https://youtube.com/watch?v=${v.videoId}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="yt-thumb"
            >
              <img
                src={v.thumbnail}
                alt=""
                style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.9 }}
                draggable={false}
              />
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "rgba(0,0,0,0.2)",
                }}
              >
                <FaPlay size={14} style={{ color: "#fff", opacity: 0.9 }} />
              </div>
              {v.duration && (
                <span
                  style={{
                    position: "absolute",
                    bottom: 4,
                    right: 4,
                    background: "rgba(0,0,0,0.75)",
                    color: "#fff",
                    padding: "1px 5px",
                    borderRadius: 4,
                    fontSize: 9,
                    fontWeight: 600,
                  }}
                >
                  {v.duration}
                </span>
              )}
            </a>
          ))}
        </div>
      ) : (
        <div className="resource-empty" style={{ background: "var(--bg-secondary)", color: "var(--text-tertiary)", fontSize: 12, fontWeight: 600, gap: 6 }}>
          <FaYoutube size={14} style={{ opacity: 0.5 }} />
          Coming Soon
        </div>
      )}
    </ResourceCard>
  );
};

/* ─── Notes Preview Card ─── */
const NotesPreviewCard = ({ subjectName }) => {
  const navigate = useNavigate();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const doFetch = async () => {
      try {
        const res = await api.get("/notes", { params: { subject: subjectName } });
        if (!cancelled) setNotes((res.data.notes || res.data || []).slice(0, 3));
      } catch {
        if (!cancelled) setNotes([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    doFetch();
    return () => { cancelled = true; };
  }, [subjectName]);

  const handleCardClick = () => {
    navigate(`/rtu-exams/subject/${encodeURIComponent(subjectName)}/notes`);
  };

  return (
    <ResourceCard
      icon={FaFileLines}
      iconColor="#8B5CF6"
      iconBg="rgba(139,92,246,0.08)"
      title="Notes"
      actionLabel="View All"
      onAction={handleCardClick}
      onCardClick={handleCardClick}
    >
      {loading ? (
        <div className="notes-preview-row">
          {[1, 2, 3].map((i) => (
            <div key={i} className="note-icon-wrapper shimmer-block" style={{ background: "var(--bg-secondary)" }} />
          ))}
        </div>
      ) : notes.length > 0 ? (
        <div className="notes-preview-row">
          {notes.map((note, i) => (
            <div
              key={note._id || i}
              style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, width: 60 }}
            >
              <div
                className="note-icon-wrapper"
                style={{
                  background: note.fileUrl?.endsWith(".pdf") ? "rgba(239, 68, 68, 0.08)" : "rgba(139, 92, 246, 0.08)",
                  border: "1px solid var(--border-default)",
                }}
              >
                {note.fileUrl?.endsWith(".pdf") ? (
                  <FaFilePdf size={18} style={{ color: "#ef4444" }} />
                ) : (
                  <FaFileLines size={18} style={{ color: "#8B5CF6" }} />
                )}
              </div>
              <span style={{ fontSize: 9, fontWeight: 500, color: "var(--text-tertiary)", textAlign: "center", lineHeight: 1.2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 60 }}>
                {note.title?.slice(0, 12) || "Note"}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div
          onClick={(e) => { e.stopPropagation(); navigate("/notes"); }}
          className="resource-empty"
          style={{
            background: "rgba(139, 92, 246, 0.05)",
            border: "1.5px dashed rgba(139, 92, 246, 0.2)",
            borderRadius: 12,
            color: "#8B5CF6",
            fontSize: 12,
            fontWeight: 700,
            gap: 6,
            cursor: "pointer",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(139,92,246,0.1)"; e.currentTarget.style.borderColor = "rgba(139,92,246,0.35)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(139,92,246,0.05)"; e.currentTarget.style.borderColor = "rgba(139,92,246,0.2)"; }}
        >
          <FaCloudArrowUp size={16} />
          Upload Notes
        </div>
      )}
    </ResourceCard>
  );
};

/* ─── PYQ Preview Card ─── */
const PYQPreviewCard = ({ subjectName }) => {
  const navigate = useNavigate();
  const [years, setYears] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const doFetch = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };
        const baseUrl = import.meta.env.VITE_BACKEND_URL;
        const res = await axios.get(
          `${baseUrl}/api/rtu/subjects/${encodeURIComponent(subjectName)}/years`,
          { headers }
        );
        if (!cancelled && res.data.success) setYears(res.data.years || []);
      } catch {
        if (!cancelled) setYears([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    doFetch();
    return () => { cancelled = true; };
  }, [subjectName]);

  const handleCardClick = () => navigate(`/exams?subject=${encodeURIComponent(subjectName)}`);
  const handleYearClick = (e, year) => {
    e.stopPropagation();
    navigate(`/exams?subject=${encodeURIComponent(subjectName)}&year=${year}`);
  };

  return (
    <ResourceCard
      icon={FaChartBar}
      iconColor="#7DC67A"
      iconBg="rgba(125,198,122,0.08)"
      title="PYQ Analysis"
      actionLabel="View All"
      onAction={handleCardClick}
      onCardClick={handleCardClick}
    >
      {loading ? (
        <div className="resource-empty shimmer-block" style={{ background: "var(--bg-secondary)" }} />
      ) : years.length > 0 ? (
        <div className="pyq-years-wrap">
          {years.map((year) => (
            <button
              key={year}
              onClick={(e) => handleYearClick(e, year)}
              style={{
                padding: "10px 18px",
                borderRadius: 12,
                background: "rgba(125, 198, 122, 0.08)",
                border: "1.5px solid rgba(125, 198, 122, 0.2)",
                fontSize: 13,
                fontWeight: 700,
                color: "var(--action-primary)",
                cursor: "pointer",
                fontFamily: "inherit",
                transition: "all 0.15s",
              }}
            >
              {year}
            </button>
          ))}
          <div style={{ padding: "10px 14px", borderRadius: 12, background: "var(--bg-secondary)", fontSize: 11, fontWeight: 600, color: "var(--text-tertiary)", display: "flex", alignItems: "center", gap: 5 }}>
            <FaChartBar size={11} />
            {years.length} year{years.length !== 1 ? "s" : ""} analyzed
          </div>
        </div>
      ) : (
        <div className="resource-empty" style={{ background: "var(--bg-secondary)", color: "var(--text-tertiary)", fontSize: 12, fontWeight: 500 }}>
          No analysis data yet
        </div>
      )}
    </ResourceCard>
  );
};

/* ─── AI Preview Card ─── */
const AIPreviewCard = ({ subjectName }) => {
  const navigate = useNavigate();
  const handleCardClick = () => navigate(`/recommendations?subject=${encodeURIComponent(subjectName)}`);

  return (
    <ResourceCard
      icon={FaWandMagicSparkles}
      iconColor="#F59E0B"
      iconBg="rgba(245,158,11,0.08)"
      title="AI Recommendations"
      actionLabel="Explore"
      onAction={handleCardClick}
      onCardClick={handleCardClick}
    >
      <div className="resource-empty" style={{
        background: "linear-gradient(135deg, rgba(245,158,11,0.06), rgba(139,92,246,0.06))",
        border: "1px solid rgba(245,158,11,0.1)",
        borderRadius: 12,
        gap: 8,
        color: "var(--text-secondary)",
        fontSize: 13,
        fontWeight: 600,
      }}>
        <Sparkles size={16} style={{ color: "#F59E0B" }} />
        AI-curated lectures & articles
      </div>
    </ResourceCard>
  );
};

export default SemesterSubjects;
