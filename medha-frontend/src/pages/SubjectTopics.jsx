import React, { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Search } from "lucide-react";
import RevisionShell from "../components/Revision/RevisionShell";
import CodeChip from "../components/Revision/CodeChip";
import CurriculumBadge from "../components/Revision/CurriculumBadge";
import Ridgeline from "../components/Revision/Ridgeline";
import TopicChip from "../components/Revision/TopicChip";
import {
  SCHEME,
  SUBJECTS,
  saveRecentSearch,
  searchPath,
  semesterLabel,
  topicIsShared,
  yearLabel,
} from "../data/subjectCatalog";

export default function SubjectTopics() {
  const { subjectSlug } = useParams();
  const subject = SUBJECTS.find((item) => item.slug === subjectSlug) || null;
  const [query, setQuery] = useState("");

  const siblings = useMemo(
    () =>
      subject
        ? SUBJECTS.filter((item) => item.semester === subject.semester && item.slug !== subject.slug && item.scheme === subject.scheme)
        : [],
    [subject]
  );

  const hasShared = useMemo(
    () => subject?.units.some((unit) => (unit.topics || []).some((topic) => topicIsShared(topic))) || false,
    [subject]
  );

  const units = useMemo(() => {
    if (!subject) return [];
    const q = query.trim().toLowerCase();
    if (!q) return subject.units;
    return subject.units
      .map((unit) => ({
        ...unit,
        topics: (unit.topics || []).filter((topic) => topic.toLowerCase().includes(q) || unit.title.toLowerCase().includes(q)),
      }))
      .filter((unit) => unit.topics.length > 0 || unit.title.toLowerCase().includes(q));
  }, [query, subject]);

  if (!subject) {
    return (
      <RevisionShell title="Subject" showBack>
        <p className="text-[15px] text-[var(--slate-2)]">Couldn’t load your syllabus.</p>
        <Link to="/subjects" className="mt-4 inline-flex rounded-full bg-[var(--navy)] px-4 py-2.5 text-[14px] font-semibold text-white no-underline">
          Try again
        </Link>
      </RevisionShell>
    );
  }

  const curriculum = SCHEME[subject.scheme]?.label;
  const context = { code: subject.code, scheme: subject.scheme };

  return (
    <RevisionShell title={subject.short} showBack>
      <nav className="mb-6 text-[14px] text-[var(--muted)]" aria-label="Breadcrumb">
        <Link to="/subjects" className="text-[var(--muted)] no-underline hover:text-[var(--blue)]">
          Subjects
        </Link>
        <span> › </span>
        <Link to={`/subjects?sem=${subject.semester}`} className="text-[var(--muted)] no-underline hover:text-[var(--blue)]">
          {semesterLabel(subject.semester)}
        </Link>
        <span> › </span>
        <span className="font-semibold text-[var(--navy)]">{subject.name}</span>
      </nav>

      <div className="flex flex-col gap-8 md:h-[calc(100dvh-10rem)] md:flex-row md:items-start md:gap-10">
        <aside className="relative flex min-w-[280px] flex-[0_1_360px] flex-col overflow-hidden rounded-[28px] bg-[var(--navy)] p-5 text-white md:max-h-full md:max-w-[380px] md:p-6">
          <div className="relative z-10 mb-3 flex flex-wrap gap-2">
            <CodeChip code={subject.code} onNavy />
            <CurriculumBadge label={curriculum} onNavy />
          </div>
          <h1 className="relative z-10 font-[family-name:var(--font-display)] text-[clamp(26px,3vw,34px)] font-extrabold leading-[1.05] tracking-[-0.045em] text-white">
            {subject.name}
          </h1>
          <p className="relative z-10 mt-2 text-[14px] text-[var(--on-navy-2)]">
            {[subject.course, subject.branch].filter(Boolean).join(" · ")}
            {subject.course || subject.branch ? " / " : ""}
            {yearLabel(subject.semester)} · {semesterLabel(subject.semester)}
          </p>

          <div className="relative z-10 mt-4 grid grid-cols-2 gap-3 border-y border-white/16 py-3">
            <div>
              <p className="font-[family-name:var(--font-display)] text-[28px] font-extrabold leading-none">{subject.unitCount}</p>
              <p className="mt-1 text-[13px] text-[var(--on-navy-2)]">units</p>
            </div>
            <div>
              <p className="font-[family-name:var(--font-display)] text-[28px] font-extrabold leading-none">{subject.topicCount}</p>
              <p className="mt-1 text-[13px] text-[var(--on-navy-2)]">topics</p>
            </div>
          </div>

          <label className="relative z-10 mt-4 flex h-11 items-center gap-2 rounded-full bg-white px-4">
            <Search size={16} className="text-[var(--blue)]" aria-hidden />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search this subject"
              aria-label="Search this subject"
              className="w-full border-0 bg-transparent text-[16px] text-[var(--navy)] outline-none"
            />
          </label>

          {hasShared ? (
            <p className="relative z-10 mt-3 flex items-center gap-2 text-[13px] text-[var(--on-navy-2)]">
              <span className="h-2 w-2 rounded-full bg-[var(--cyan)]" aria-hidden />
              Also covered in {subject.scheme === "arya" ? SCHEME.rtu.label : SCHEME.arya.label}
            </p>
          ) : null}

          {siblings.length > 0 ? (
            <div className="relative z-10 mt-4 min-h-0 flex-1 overflow-y-auto pb-10 pr-1">
              <p className="text-[12px] font-semibold uppercase tracking-[.12em] text-[var(--cyan)]">
                Also in {semesterLabel(subject.semester)}
              </p>
              <div className="mt-2">
                {siblings.map((item) => (
                  <Link
                    key={item.slug}
                    to={`/subjects/${item.slug}`}
                    className="flex items-center gap-3 border-b border-white/12 py-2 text-inherit no-underline last:border-0"
                  >
                    <span className="w-[72px] shrink-0 text-[12px] font-bold text-[var(--cyan)]">{item.code}</span>
                    <span className="text-[14px] font-medium text-white">{item.name}</span>
                  </Link>
                ))}
              </div>
            </div>
          ) : null}

          <Ridgeline height={72} className="opacity-80" />
        </aside>

        <section className="min-w-0 flex-1 md:h-full md:overflow-y-auto md:pr-1">
          {units.length === 0 ? (
            <p className="text-[15px] text-[var(--slate-2)]">No topics match “{query}”.</p>
          ) : (
            units.map((unit, index) => (
              <article
                key={unit.slug}
                className="flex flex-wrap gap-7 border-t border-[var(--line)] py-9"
              >
                <p className="w-[76px] shrink-0 font-[family-name:var(--font-display)] text-[56px] font-extrabold leading-[0.9] tracking-[-0.05em] text-[var(--numeral)]">
                  {String(unit.unitNumber || index + 1).padStart(2, "0")}
                </p>
                <div className="min-w-0 flex-1">
                  <h2 className="font-[family-name:var(--font-display)] text-[26px] font-extrabold leading-[1.15] tracking-[-0.03em] text-[var(--navy)]">
                    {unit.title}
                  </h2>
                  <div className="mt-4 flex flex-wrap gap-2.5">
                    {(unit.topics || []).map((topic) => (
                      <TopicChip
                        key={topic}
                        to={searchPath(topic, { ...context, unit: unit.title })}
                        onClick={() => saveRecentSearch(topic)}
                        sharedWithAutonomous={topicIsShared(topic)}
                        match={query}
                      >
                        {topic}
                      </TopicChip>
                    ))}
                  </div>
                </div>
              </article>
            ))
          )}
        </section>
      </div>
    </RevisionShell>
  );
}
