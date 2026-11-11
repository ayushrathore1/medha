import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import RevisionShell from "../components/Revision/RevisionShell";
import ResourceBoard from "../components/Revision/ResourceBoard";
import TopicChip from "../components/Revision/TopicChip";
import { searchPath } from "../data/subjectCatalog";
import { trackSearchOpened, trackUnitOpened } from "../lib/studyActivity";
import { findMergedSubject, findMergedUnit, useMergedSubjects } from "../hooks/useMergedSubjects";
import { usePageSeo } from "../hooks/usePageSeo";
import { learningResourceJsonLd } from "../lib/seo";

const TABS = [
  { id: "overview", label: "Overview" },
  { id: "topics", label: "Topics" },
  { id: "resources", label: "Resources" },
];

export default function TopicDetail() {
  const { subjectSlug, unitSlug } = useParams();
  const { subjects, loading } = useMergedSubjects();
  const subject = findMergedSubject(subjects, subjectSlug);
  const unit = findMergedUnit(subject, unitSlug);
  const [tab, setTab] = useState("overview");

  useEffect(() => {
    if (subject && unit) trackUnitOpened(subject, unit);
  }, [subject, unit]);

  usePageSeo(
    subject && unit
      ? {
          title: `${unit.title} | ${subject.name} — RTU topics`,
          description: `Revise ${unit.title} from ${subject.name} (${subject.code || "RTU"}) — topics, notes and resources on Medha Revision.`,
          path: `/subjects/${subject.slug}/${unit.slug}`,
          jsonLd: learningResourceJsonLd({
            name: `${unit.title} — ${subject.name}`,
            description: `Unit topics for ${unit.title} in ${subject.name}.`,
            path: `/subjects/${subject.slug}/${unit.slug}`,
            about: [subject.name, unit.title, ...(unit.topics || []).slice(0, 8)].filter(Boolean),
          }),
        }
      : {
          title: "Unit",
          path: `/subjects/${subjectSlug || ""}/${unitSlug || ""}`,
        }
  );

  if (loading) {
    return (
      <RevisionShell title="Unit" showBack desk>
        <p className="desk-sub">Loading syllabus…</p>
      </RevisionShell>
    );
  }

  if (!subject || !unit) {
    return (
      <RevisionShell title="Unit" showBack desk>
        <div className="desk-page">
          <p className="desk-sub">Couldn’t load this unit.</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {subject ? (
              <Link to={`/subjects/${subject.slug}`} className="desk-solid-btn">
                Back to subject
              </Link>
            ) : null}
            <Link to="/subjects" className="desk-ghost-btn">
              All subjects
            </Link>
          </div>
        </div>
      </RevisionShell>
    );
  }

  const topics = (unit.topics || []).map((t) => (typeof t === "string" ? t : t?.title)).filter(Boolean);
  const query = unit.title;
  const context = { code: subject.code, scheme: subject.scheme, unit: unit.title };

  return (
    <RevisionShell title={unit.title} showBack desk>
      <div className="desk-page">
        <p className="desk-eyebrow">
          <Link to={`/subjects/${subject.slug}`} className="no-underline text-inherit hover:text-[#1ba34a]">
            {subject.name}
          </Link>
          {" · "}Unit {String(unit.unitNumber || "").padStart(2, "0")}
        </p>
        <h1 className="desk-title" style={{ fontSize: "clamp(24px, 4vw, 34px)" }}>
          {unit.title}
        </h1>
        <p className="desk-sub">{topics.length} topics in this unit</p>

        <div className="desk-tabs mt-4" role="tablist">
          {TABS.map((item) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-pressed={tab === item.id}
              onClick={() => {
                setTab(item.id);
                if (item.id === "resources") trackSearchOpened(query, searchPath(query, context));
              }}
              className={`desk-tab${tab === item.id ? " is-on" : ""}`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {tab === "overview" && (
          <section className="desk-panel mt-4">
            <p className="desk-sub" style={{ margin: 0, maxWidth: "none" }}>
              {topics.length} syllabus points
              {unit.videoCount ? `, ${unit.videoCount} lectures` : ""}. Open Topics for the list, or Resources for notes
              and videos.
            </p>
            <button type="button" onClick={() => setTab("topics")} className="desk-ghost-btn mt-4">
              Read the topic list
            </button>
          </section>
        )}

        {tab === "topics" && (
          <section className="desk-panel mt-4">
            <div className="flex flex-wrap gap-2">
              {topics.map((topic) => (
                <TopicChip
                  key={topic}
                  to={searchPath(topic, context)}
                  onClick={() => trackSearchOpened(topic, searchPath(topic, context))}
                >
                  {topic}
                </TopicChip>
              ))}
            </div>
          </section>
        )}

        {tab === "resources" && (
          <div className="mt-4">
            <ResourceBoard query={query} subject={subject.name} extraTitles={topics} />
          </div>
        )}
      </div>
    </RevisionShell>
  );
}
