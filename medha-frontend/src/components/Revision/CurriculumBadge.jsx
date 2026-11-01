import React from "react";

export default function CurriculumBadge({ label, onNavy = false }) {
  if (!label) return null;
  return (
    <span
      className={`inline-flex max-w-full items-center rounded-full border px-2.5 py-1 text-[12px] font-bold tracking-[.04em] ${
        onNavy ? "border-[var(--cyan-soft)] text-[var(--cyan-soft)]" : "border-[#111] text-[#111]"
      }`}
    >
      <span className="truncate">{label}</span>
    </span>
  );
}
