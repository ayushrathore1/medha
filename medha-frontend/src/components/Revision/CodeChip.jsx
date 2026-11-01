import React from "react";

export default function CodeChip({ code, onNavy = false }) {
  if (!code) return null;
  return (
    <span
      className={`inline-flex items-center rounded-[14px] px-2.5 py-1 text-[12px] font-bold tracking-[.04em] ${
        onNavy ? "bg-white/12 text-white" : "bg-[var(--ice)] text-[var(--navy)]"
      }`}
    >
      {code}
    </span>
  );
}
