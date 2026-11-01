import React from "react";

export default function SectionMark({ icon: Icon, children }) {
  return (
    <span className="wama-mark">
      <svg
        className="wama-mark-draw"
        viewBox="0 0 140 100"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.35"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="70" cy="50" r="38" opacity="0.16" />
        <circle cx="70" cy="50" r="28" strokeDasharray="3 5" opacity="0.28" />
        {children}
      </svg>
      {Icon ? <Icon className="wama-mark-icon" strokeWidth={1.65} /> : null}
    </span>
  );
}
