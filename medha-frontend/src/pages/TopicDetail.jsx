import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import RevisionShell from "../components/Revision/RevisionShell";
import ResourceBoard from "../components/Revision/ResourceBoard";
import CodeChip from "../components/Revision/CodeChip";
import CurriculumBadge from "../components/Revision/CurriculumBadge";
import TopicChip from "../components/Revision/TopicChip";
import { SCHEME, getUnitBySlug, saveRecentSearch, searchPath, topicIsShared } from "../data/subjectCatalog";

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
        <p className="text-[15px] text-[var(--slate-2)]">Couldn’t load your syllabus.</p>
        <Link to="/subjects" className="mt-4 inline-flex rounded-full bg-[var(--navy)] px-4 py-2.5 text-[14px] font-semibold text-white no-underline">
          Try again
        </Link>
      </RevisionShell>
    );
  }

  const query = unit.title;
  const context = { code: subject.code, scheme: subject.scheme, unit: unit.title };

  return (
    <RevisionShell title={unit.title} showBack>
      <div className="mb-3 flex flex-wrap gap-2">
        <CodeChip code={subject.code} />
        <CurriculumBadge label={SCHEME[subject.scheme]?.label} />
      </div>
      <p className="text-[14px] text-[var(--muted)]">
        {subject.name} · Unit {String(unit.unitNumber).padStart(2, "0")}
      </p>
      <h1 className="mt-1 font-[family-name:var(--font-display)] text-[clamp(26px,4vw,44px)] font-extrabold leading-none tracking-[-0.045em] text-[var(--navy)]">
        {unit.title}
      </h1>

      <div className="mt-5 flex flex-wrap gap-2 text-[14px]">
        {TABS.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => {
              setTab(item.id);
              if (item.id === "resources") saveRecentSearch(query);
            }}
            className={`rounded-full px-4 py-1.5 ${
              tab === item.id ? "bg-[#111] font-semibold text-white" : "border border-[var(--line)] text-[#5A5A5A]"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {tab === "overview" && (
        <section className="mt-5">
          <p className="text-[15px] leading-6 text-[var(--slate-2)]">
            {unit.topicCount} syllabus points
            {unit.videoCount ? `, ${unit.videoCount} lectures` : ""}. Use Topics for the list, or Resources for notes and videos.
          </p>
          <button type="button" onClick={() => setTab("topics")} className="mt-4 text-[14px] font-medium text-[var(--blue)]">
            Read the topic list
          </button>
        </section>
      )}

      {tab === "topics" && (
        <section className="mt-4 flex flex-wrap gap-2.5">
          {unit.topics.map((topic) => (
            <TopicChip
              key={topic}
              to={searchPath(topic, context)}
              onClick={() => saveRecentSearch(topic)}
              sharedWithAutonomous={topicIsShared(topic)}
            >
              {topic}
            </TopicChip>
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
