import React from "react";
import { Link, useParams } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import RevisionShell from "../components/Revision/RevisionShell";
import { getSubjectBySlug, semesterLabel } from "../data/subjectCatalog";

export default function SubjectTopics() {
  const { subjectSlug } = useParams();
  const subject = getSubjectBySlug(subjectSlug);

  if (!subject) {
    return (
      <RevisionShell title="Subject" showBack>
        <p className="text-[14px] text-[#5C5C5C]">This subject is not in the current catalog.</p>
      </RevisionShell>
    );
  }

  return (
    <RevisionShell title={subject.short} showBack>
      <p className="text-[12px] text-[#8A8A8A]">
        {semesterLabel(subject.semester)} · {subject.code}
      </p>
      <h1 className="mt-1 text-[26px] font-semibold leading-tight tracking-[-0.03em] text-[#1F1F1F]">
        {subject.name}
      </h1>
      <p className="mt-2 text-[14px] text-[#5C5C5C]">
        {subject.topicCount} topics in {subject.unitCount} units.
      </p>

      <div className="mt-6 border-t border-[#E5E5E5]">
        {subject.units.map((unit, index) => (
          <Link
            key={unit.slug}
            to={`/subjects/${subject.slug}/${unit.slug}`}
            className="flex items-center gap-3 border-b border-[#E5E5E5] py-4 no-underline"
          >
            <span className="w-6 shrink-0 text-[13px] tabular-nums text-[#8A8A8A]">
              {unit.unitNumber || index + 1}
            </span>
            <div className="min-w-0 flex-1">
              <h2 className="truncate text-[15px] font-medium text-[#1F1F1F]">{unit.title}</h2>
              <p className="text-[12px] text-[#8A8A8A]">{unit.resourceCount} resources</p>
            </div>
            <ChevronRight size={16} className="text-[#1F1F1F]" />
          </Link>
        ))}
      </div>
    </RevisionShell>
  );
}
