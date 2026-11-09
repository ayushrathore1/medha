import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Search } from "lucide-react";
import RevisionShell from "../components/Revision/RevisionShell";
import CodeChip from "../components/Revision/CodeChip";
import Ridgeline from "../components/Revision/Ridgeline";
import {
  searchPath,
  semesterLabel,
  yearLabel,
} from "../data/subjectCatalog";
import { trackSearchOpened, trackSubjectOpened } from "../lib/studyActivity";
import { findMergedSubject, useMergedSubjects } from "../hooks/useMergedSubjects";
import "./SubjectTopics.css";

function highlight(text, query) {
  const value = String(text);
  const q = String(query || "").trim();
  if (!q) return value;
  const index = value.toLowerCase().indexOf(q.toLowerCase());
  if (index < 0) return value;
  return (
    <>
      {value.slice(0, index)}
      <mark>{value.slice(index, index + q.length)}</mark>
      {value.slice(index + q.length)}
    </>
  );
}

export default function SubjectTopics() {
  const { subjectSlug } = useParams();
  const { subjects, loading } = useMergedSubjects();
  const subject = findMergedSubject(subjects, subjectSlug);
  const [query, setQuery] = useState("");

  const siblings = useMemo(
    () =>
      subject
        ? subjects.filter(
            (item) =>
              item.semester === subject.semester &&
              item.slug !== subject.slug &&
              item.scheme === subject.scheme
          )
        : [],
    [subject, subjects]
  );

  const units = useMemo(() => {
    if (!subject) return [];
    const q = query.trim().toLowerCase();
    if (!q) return subject.units;
    return subject.units
      .map((unit) => ({
        ...unit,
        topics: (unit.topics || []).filter(
          (topic) => topic.toLowerCase().includes(q) || unit.title.toLowerCase().includes(q)
        ),
      }))
      .filter((unit) => unit.topics.length > 0 || unit.title.toLowerCase().includes(q));
  }, [query, subject]);

  const topicShown = useMemo(
    () => units.reduce((n, unit) => n + (unit.topics?.length || 0), 0),
    [units]
  );

  useEffect(() => {
    if (subject?.slug) trackSubjectOpened(subject);
  }, [subject]);

  if (loading) {
    return (
      <RevisionShell title="Subject" showBack desk>
        <p className="desk-sub">Loading syllabus…</p>
      </RevisionShell>
    );
  }

  if (!subject) {
    return (
      <RevisionShell title="Subject" showBack desk>
        <p className="desk-sub">Couldn’t load your syllabus.</p>
        <Link to="/subjects" className="desk-solid-btn mt-4 inline-flex">
          Try again
        </Link>
      </RevisionShell>
    );
  }

  const context = { code: subject.code, scheme: subject.scheme };

  return (
    <RevisionShell title={subject.short || subject.code} showBack desk>
      <div className="desk-page">
        <nav className="st-crumb" aria-label="Breadcrumb">
          <Link to="/subjects">Subjects</Link>
          <span> › </span>
          <Link to={`/subjects?sem=${subject.semester}`}>{semesterLabel(subject.semester)}</Link>
          <span> › </span>
          <span className="st-crumb-current">{subject.name}</span>
        </nav>

        <div className="st-page">
          <aside className="st-hero">
            <div className="st-hero-badges">
              <CodeChip code={subject.code} onNavy />
            </div>

            <h1 className="st-hero-title">{subject.name}</h1>
            <p className="st-hero-meta">
              {[subject.course, subject.branch].filter(Boolean).join(" · ")}
              {subject.course || subject.branch ? " / " : ""}
              {yearLabel(subject.semester)} · {semesterLabel(subject.semester)}
            </p>

            <div className="st-hero-stats">
              <div>
                <strong>{subject.unitCount}</strong>
                <span>units</span>
              </div>
              <div>
                <strong>{subject.topicCount}</strong>
                <span>topics</span>
              </div>
            </div>

            <div className="st-hero-search dash-search">
              <label className="dash-search-inner">
                <Search size={18} className="shrink-0 text-[#111]" aria-hidden />
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search this subject"
                  aria-label="Search this subject"
                />
              </label>
            </div>

            {siblings.length > 0 ? (
              <div className="st-siblings">
                <p className="st-siblings-label">Also in {semesterLabel(subject.semester)}</p>
                {siblings.map((item) => (
                  <Link key={item.slug} to={`/subjects/${item.slug}`} className="st-sibling">
                    <span className="st-sibling-code">{item.code}</span>
                    <span className="st-sibling-name">{item.name}</span>
                  </Link>
                ))}
              </div>
            ) : null}

            <Ridgeline height={72} className="opacity-80" />
          </aside>

          <section className="st-syllabus">
            <div className="st-syllabus-head">
              <h2>Syllabus</h2>
              <span>
                {units.length} unit{units.length === 1 ? "" : "s"} · {topicShown} topic
                {topicShown === 1 ? "" : "s"}
              </span>
            </div>

            {units.length === 0 ? (
              <p className="st-empty">No topics match “{query}”.</p>
            ) : (
              units.map((unit, index) => {
                const num = String(unit.unitNumber || index + 1).padStart(2, "0");
                const count = unit.topics?.length || 0;
                return (
                  <article key={unit.slug} className="st-unit">
                    <div className="st-unit-head">
                      <Link
                        to={`/subjects/${subject.slug}/${unit.slug}`}
                        className="st-unit-num"
                        aria-label={`Open unit ${num}`}
                      >
                        {num}
                      </Link>
                      <div className="st-unit-copy">
                        <h3>
                          <Link
                            to={`/subjects/${subject.slug}/${unit.slug}`}
                            className="text-inherit no-underline hover:text-[#1ba34a]"
                          >
                            {unit.title}
                          </Link>
                        </h3>
                        <p>
                          {count} topic{count === 1 ? "" : "s"}
                        </p>
                      </div>
                    </div>
                    <div className="st-topics">
                      {(unit.topics || []).map((topic) => (
                        <Link
                          key={topic}
                          to={searchPath(topic, { ...context, unit: unit.title })}
                          onClick={() => trackSearchOpened(topic, searchPath(topic, { ...context, unit: unit.title }))}
                          className="st-topic"
                        >
                          <span>{highlight(topic, query)}</span>
                        </Link>
                      ))}
                    </div>
                  </article>
                );
              })
            )}
          </section>
        </div>
      </div>
    </RevisionShell>
  );
}
