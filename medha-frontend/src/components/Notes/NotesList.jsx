import React from "react";
import { motion } from "framer-motion";
import NoteCard from "./NoteCard";

export default function NotesList({
  loadingPublic,
  filtered,
  selectedSemester,
  selectedSubject,
  onOpenNote,
  getOwnerName,
  getSubjectName,
}) {
  return (
    <>
      <p style={{ fontSize: 13, color: "#9A9A9A", marginTop: 16, marginBottom: 20 }}>
        Showing {filtered.length} note{filtered.length !== 1 ? "s" : ""}
        {selectedSemester !== "All" ? ` for ${selectedSemester} Semester` : ""}
        {selectedSubject !== "All" ? ` · ${selectedSubject}` : ""}
      </p>

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
          <p style={{ fontSize: 14, color: "#9A9A9A", marginTop: 4 }}>
            Be the first to share your study materials!
          </p>
        </div>
      ) : (
        <div
          className="notes-grid"
          style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20 }}
        >
          {filtered.map((note) => (
            <NoteCard
              key={note._id}
              note={note}
              onClick={() => onOpenNote(note)}
              getOwnerName={getOwnerName}
              getSubjectName={getSubjectName}
            />
          ))}
        </div>
      )}
    </>
  );
}
