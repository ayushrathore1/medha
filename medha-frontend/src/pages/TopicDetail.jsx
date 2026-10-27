import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import RevisionShell from "../components/Revision/RevisionShell";
import ResourceBoard from "../components/Revision/ResourceBoard";
import { getUnitBySlug, saveRecentSearch } from "../data/subjectCatalog";

const TABS = [
  { id: "overview", label: "Overview" },
  { id: "topics", label: "Topics" },
  { id: "resources", label: "Resources" },
];

export default function TopicDetail() {
  const { subjectSlug, unitSlug } = useParams();
  const { subject, unit } = getUnitBySlug(subjectSlug, unitSlug);
  const [tab, setTab] = useState("overview");

  if (!subject || !unit) {
    return (
      <RevisionShell title="Unit" showBack>
        <p className="text-[14px] text-[#5C5C5C]">This unit is not in the catalog.</p>
      </RevisionShell>
    );
  }

  const query = unit.title;

  return (
    <RevisionShell title={unit.title} showBack>
      <p className="text-[12px] text-[#8A8A8A]">
        {subject.name} · Unit {unit.unitNumber}
      </p>
      <h1 className="mt-1 break-words text-[24px] font-semibold leading-tight tracking-[-0.03em] text-[#1F1F1F]">
        {unit.title}
      </h1>

      <div className="mt-5 flex gap-4 border-b border-[#E5E5E5] text-[13px]">
        {TABS.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => {
              setTab(item.id);
              if (item.id === "resources") saveRecentSearch(query);
            }}
            className={`pb-2 ${
              tab === item.id ? "border-b border-[#1F1F1F] font-medium text-[#1F1F1F]" : "text-[#8A8A8A]"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {tab === "overview" && (
        <section className="mt-5">
          <p className="text-[14px] leading-6 text-[#5C5C5C]">
            {unit.topicCount} syllabus points
            {unit.videoCount ? `, ${unit.videoCount} lectures` : ""}. Use Topics for the list, or Resources for notes and videos.
          </p>
          <button type="button" onClick={() => setTab("topics")} className="mt-4 text-[13px] text-[#1F1F1F] underline underline-offset-2">
            Read the topic list
          </button>
        </section>
      )}

      {tab === "topics" && (
        <section className="mt-2">
          {unit.topics.map((topic) => (
            <Link
              key={topic}
              to={`/search?q=${encodeURIComponent(topic)}`}
              onClick={() => saveRecentSearch(topic)}
              className="flex items-center justify-between gap-3 border-b border-[#E5E5E5] py-3.5 no-underline"
            >
              <span className="min-w-0 flex-1 text-[14px] text-[#1F1F1F]">{topic}</span>
              <ChevronRight size={16} className="text-[#1F1F1F]" />
            </Link>
          ))}
        </section>
      )}

      {tab === "resources" && (
        <div className="mt-5">
          <ResourceBoard query={query} subject={subject.name} extraTitles={unit.topics} />
        </div>
      )}
    </RevisionShell>
  );
}
