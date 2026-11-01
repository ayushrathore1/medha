import React from "react";
import CurriculumBadge from "./CurriculumBadge";

export default function SchemeTag({ label, onNavy = false }) {
  return <CurriculumBadge label={label} onNavy={onNavy} />;
}

export function SchemeTags({ tags = [], onNavy = false }) {
  if (!tags.length) return null;
  return (
    <span className="inline-flex flex-wrap gap-1">
      {tags.map((tag) => (
        <CurriculumBadge key={tag.id} label={tag.label} onNavy={onNavy} />
      ))}
    </span>
  );
}
