import React from "react";
import { Link } from "react-router-dom";
import ArrowButton from "./ArrowButton";
import CodeChip from "./CodeChip";

export default function SubjectCard({ subject }) {
  return (
    <Link
      to={`/subjects/${subject.slug}`}
      className="group flex items-center gap-3 rounded-[22px] border border-[var(--line)] bg-white p-4 text-inherit no-underline transition duration-200 hover:border-[var(--wama-green)] active:scale-[0.99]"
      aria-label={`Open ${subject.name}, ${subject.code}`}
    >
      <div className="min-w-0 flex-1 space-y-2.5">
        <div className="flex flex-wrap items-center gap-2">
          <CodeChip code={subject.code} />
        </div>
        <h2 className="line-clamp-2 font-[family-name:var(--font-display)] text-[19px] font-extrabold leading-[1.15] tracking-[-0.02em] text-[var(--navy)]">
          {subject.name}
        </h2>
        <p className="text-[14px] text-[var(--slate-2)]">
          {subject.unitCount} units · {subject.topicCount} topics
        </p>
      </div>
      <ArrowButton />
    </Link>
  );
}
