import React from "react";

const SubjectCard = ({ subject, onSelect, onDelete }) => (
  <div className="flex justify-between items-center bg-[#18163a]/80 backdrop-blur-xl border border-violet-400/15 rounded-2xl px-6 py-4 mb-5 shadow-2xl">
    <span className="font-inter font-semibold text-white text-lg">
      {subject.name}
    </span>
    <div className="flex gap-3">
      <button
        className="bg-gradient-to-r from-violet-600 to-blue-600 text-white px-5 py-2 rounded-xl font-bold shadow-lg hover:scale-[1.07] transition duration-150 focus:outline-none focus:ring-2 focus:ring-violet-400"
        onClick={onSelect}
      >
        Select
      </button>
      {onDelete && (
        <button
          className="bg-gradient-to-r from-red-600 to-pink-500 text-white px-4 py-2 rounded-xl font-bold shadow-lg hover:scale-[1.07] transition duration-150 focus:outline-none focus:ring-2 focus:ring-red-500"
          onClick={onDelete}
        >
          Delete
        </button>
      )}
    </div>
  </div>
);

export default SubjectCard;
