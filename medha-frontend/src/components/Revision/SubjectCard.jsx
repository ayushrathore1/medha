import React from "react";
import { Link } from "react-router-dom";
import { semesterLabel } from "../../data/subjectCatalog";

export default function SubjectCard({ subject, compact = false }) {
  return (
    <Link
      to={`/subjects/${subject.slug}`}
      className="block border-b border-[#E5E5E5] py-4 no-underline last:border-b-0"
    >
      <div className="flex items-baseline justify-between gap-4">
        <div className="min-w-0">
          <p className="text-[12px] text-[#8A8A8A]">
            {semesterLabel(subject.semester)} · {subject.code}
          </p>
          <h2 className={`mt-1 font-semibold leading-snug text-[#1F1F1F] ${compact ? "text-[16px]" : "text-[17px]"}`}>
            {subject.name}
          </h2>
          <p className="mt-1 text-[13px] text-[#5C5C5C]">
            {compact ? `${subject.topicCount} topics` : `${subject.topicCount} topics, ${subject.unitCount} units`}
          </p>
        </div>
        <span className="shrink-0 text-[12px] text-[#8A8A8A]">{subject.short}</span>
      </div>
    </Link>
  );
}
