import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { fadeUp } from "../lib/motionPresets";
import { SUBJECTS, semesterLabel } from "../data/subjectCatalog";
import SubjectCardArt from "./SubjectCardArt";

const COLORS = [
  { bg: "#1BA34A", ink: "#FFFFFF" },
  { bg: "#FF8A1A", ink: "#161616" },
  { bg: "#2563EB", ink: "#FFFFFF" },
  { bg: "#E30613", ink: "#FFFFFF" },
  { bg: "#C6D93B", ink: "#161616" },
  { bg: "#7C3AED", ink: "#FFFFFF" },
  { bg: "#0D9488", ink: "#FFFFFF" },
  { bg: "#FACC15", ink: "#161616" },
];

const SubjectsSection = () => {
  const semesters = useMemo(
    () => ["All", ...[...new Set(SUBJECTS.map((subject) => String(subject.semester)))].sort()],
    []
  );
  const [tab, setTab] = useState("All");
  const filtered = SUBJECTS.filter((subject) => tab === "All" || String(subject.semester) === tab).slice(0, 8);

  return (
    <section className="wama-section">
      <div className="wama-section-inner">
        <motion.div {...fadeUp} className="wama-section-heading">
          <p className="wama-kicker">The syllabus, in front</p>
          <h2>Subjects from every semester.</h2>
        </motion.div>

        <motion.div {...fadeUp} className="wama-tabs">
          {semesters.map((value) => (
            <button
              key={value}
              type="button"
              className={`wama-tab${tab === value ? " is-on" : ""}`}
              onClick={() => setTab(value)}
            >
              {value === "All" ? "All" : semesterLabel(value)}
            </button>
          ))}
        </motion.div>

        <div className="wama-subject-grid">
          {filtered.map((subject, index) => {
            const tone = COLORS[index % COLORS.length];
            return (
              <motion.div
                key={subject.slug}
                initial={{ y: 24, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.45, delay: index * 0.05 }}
              >
                <Link
                  to={`/subjects/${subject.slug}`}
                  className={`wama-color-card wama-subject-tile${tone.ink === "#FFFFFF" ? " wama-ink-light" : ""}`}
                  style={{ background: tone.bg, color: tone.ink }}
                >
                  <strong>{subject.short}</strong>
                  <SubjectCardArt code={subject.short} />
                  <span>{subject.name}</span>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default SubjectsSection;
