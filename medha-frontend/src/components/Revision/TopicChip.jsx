import React from "react";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";

export default function TopicChip({
  children,
  to,
  onClick,
  highlighted = false,
  match,
}) {
  const className = `inline-flex max-w-full items-center gap-2 rounded-full px-4 py-[11px] text-left text-[15px] font-medium transition duration-200 ${
    highlighted
      ? "bg-[#111] text-white"
      : "border border-[var(--line)] bg-white text-[#111] hover:border-[#111] hover:bg-[var(--ice)]"
  }`;

  const content = (
    <>
      <span className="min-w-0">
        {match ? highlight(children, match) : children}
      </span>
      {highlighted ? <Search size={14} className="shrink-0 text-[var(--cyan)]" aria-hidden /> : null}
    </>
  );

  if (to) {
    return (
      <Link to={to} onClick={onClick} className={`${className} no-underline`}>
        {content}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} className={className}>
      {content}
    </button>
  );
}

function highlight(text, query) {
  const value = String(text);
  const q = String(query || "").trim();
  if (!q) return value;
  const index = value.toLowerCase().indexOf(q.toLowerCase());
  if (index < 0) return value;
  return (
    <>
      {value.slice(0, index)}
      <mark className="bg-[var(--cyan-soft)] text-inherit">{value.slice(index, index + q.length)}</mark>
      {value.slice(index + q.length)}
    </>
  );
}
