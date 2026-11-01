import React from "react";
import { ArrowRight } from "lucide-react";

export default function ArrowButton({ className = "" }) {
  return (
    <span
      className={`grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#111] text-[var(--cyan-soft)] transition-transform duration-200 group-hover:translate-x-0.5 ${className}`}
      aria-hidden
    >
      <ArrowRight size={18} strokeWidth={2.4} />
    </span>
  );
}
