import React from "react";
import { motion } from "framer-motion";
import { SEMESTERS, NOTE_TYPES, chipStyle, labelStyle } from "./notesConstants";

export default function NotesFilters({
  selectedSemester,
  setSelectedSemester,
  selectedSubject,
  setSelectedSubject,
  selectedType,
  setSelectedType,
  uniqueSubjects,
  searchQuery,
  setSearchQuery,
  onSearch,
  activeFilters,
}) {
  return (
    <>
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
        <div style={{ marginBottom: 16 }}>
          <label style={labelStyle}>SEMESTER</label>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {SEMESTERS.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSelectedSemester(s)}
                style={chipStyle(selectedSemester === s)}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {uniqueSubjects.length > 1 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            style={{ marginBottom: 16 }}
          >
            <label style={labelStyle}>SUBJECT</label>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {uniqueSubjects.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSelectedSubject(s)}
                  style={chipStyle(selectedSubject === s)}
                >
                  {s}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        <div style={{ marginBottom: 16 }}>
          <label style={labelStyle}>TYPE</label>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {NOTE_TYPES.map((t) => (
              <button
                key={t.key}
                type="button"
                onClick={() => setSelectedType(t.key)}
                style={chipStyle(selectedType === t.key)}
              >
                {t.icon} {t.label}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", gap: 0, marginTop: 12 }}>
          <div style={{ position: "relative", flex: 1 }}>
            <span
              style={{
                position: "absolute",
                left: 16,
                top: "50%",
                transform: "translateY(-50%)",
                fontSize: 16,
                color: "#9A9A9A",
              }}
            >
              🔍
            </span>
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
            onClick={onSearch}
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

      {activeFilters.length > 0 && (
        <div
          style={{
            display: "flex",
            gap: 6,
            marginTop: 12,
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <span style={{ fontSize: 12, color: "#9A9A9A" }}>Filtered by:</span>
          {activeFilters.map((f) => (
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
                style={{
                  marginLeft: 2,
                  color: "#4A9E47",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: 14,
                  lineHeight: 1,
                }}
              >
                ×
              </button>
            </div>
          ))}
          <button
            onClick={() => {
              setSelectedSemester("All");
              setSelectedSubject("All");
              setSelectedType("all");
            }}
            style={{
              fontSize: 12,
              color: "#9A9A9A",
              textDecoration: "underline",
              background: "none",
              border: "none",
              cursor: "pointer",
            }}
          >
            Clear all
          </button>
        </div>
      )}
    </>
  );
}
