import React from "react";
import SubjectCard from "./SubjectCard";

const SubjectList = ({ subjects, onSelect, onDelete }) => {
  if (!subjects.length) {
    return (
      <div className="bg-[#18163a]/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-violet-400/15 text-center py-10 px-8 font-bold text-lg bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">
        No subjects added. Click “Add Subject” to begin!
      </div>
    );
  }

  return (
    <div className="grid gap-5">
      {subjects.map((subject, idx) => (
        <SubjectCard
          key={subject._id || subject.name || idx}
          subject={subject}
          onSelect={() => onSelect && onSelect(subject, idx)}
          onDelete={onDelete ? () => onDelete(subject, idx) : undefined}
        />
      ))}
    </div>
  );
};

export default SubjectList;
