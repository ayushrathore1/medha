import React, { useState } from "react";

const SubjectAddForm = ({ onAdd }) => {
  const [subject, setSubject] = useState("");
  const [error, setError] = useState("");

  const handleAdd = (e) => {
    e.preventDefault();
    if (!subject.trim()) {
      setError("Subject name cannot be empty.");
      return;
    }
    onAdd(subject.trim());
    setSubject("");
    setError("");
  };

  return (
    <form className="flex gap-4 items-center mb-8" onSubmit={handleAdd}>
      <input
        className="bg-white/10 backdrop-blur-xl border border-violet-400/20 rounded-xl px-4 py-3 w-72 font-medium text-white placeholder-violet-300 focus:border-violet-400 focus:ring-2 focus:ring-violet-400 focus:outline-none transition-all duration-150 shadow"
        type="text"
        placeholder="Add new subject (e.g., DSA, DBMS)"
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
      />
      <button
        className="bg-gradient-to-r from-violet-600 to-blue-600 text-white px-6 py-3 rounded-xl hover:scale-[1.06] font-bold shadow-xl transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-violet-400"
        type="submit"
      >
        Add Subject
      </button>
      {error && (
        <span className="ml-3 text-red-400 text-base font-bold">{error}</span>
      )}
    </form>
  );
};

export default SubjectAddForm;
