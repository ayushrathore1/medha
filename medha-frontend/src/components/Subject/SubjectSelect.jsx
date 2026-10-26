import React from "react";

const SubjectSelect = ({ subjects, selectedSubject, onSelectSubject, className = "" }) => {
  return (
    <select
      value={selectedSubject || ""}
      onChange={(e) => onSelectSubject && onSelectSubject(e.target.value)}
      className={`px-5 py-3 rounded-xl border-2 font-medium transition-all focus:outline-none focus:ring-2 ${className}`}
      style={{
        backgroundColor: "var(--bg-primary)",
        borderColor: "var(--accent-secondary)",
        color: "var(--text-primary)",
      }}
    >
      <option value="">All Subjects</option>
      {Array.isArray(subjects) && subjects.map((subject) => (
        <option key={subject._id || subject.id || subject} value={subject._id || subject.id || subject}>
          {subject.name || subject}
        </option>
      ))}
    </select>
  );
};

export default SubjectSelect;
