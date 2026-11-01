import React, { useContext, useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Search, X } from "lucide-react";
import { AuthContext } from "../AuthContext";
import RevisionShell from "../components/Revision/RevisionShell";
import SubjectCard from "../components/Revision/SubjectCard";
import {
  SUBJECTS,
  getAcademicContext,
  getCatalogSemesters,
  subjectMatchesQuery,
} from "../data/subjectCatalog";

function updateParams(params, setParams, patch) {
  const next = new URLSearchParams(params);
  Object.entries(patch).forEach(([key, value]) => {
    if (!value || value === "all") next.delete(key);
    else next.set(key, value);
  });
  setParams(next, { replace: true });
}

export default function Subjects() {
  const { user } = useContext(AuthContext);
  const [params, setParams] = useSearchParams();
  const query = params.get("q") || "";
  const semester = params.get("sem") || "all";
  const [draft, setDraft] = useState(query);
  const academic = useMemo(() => getAcademicContext(user), [user]);
  const semesters = useMemo(() => getCatalogSemesters(), []);

  useEffect(() => setDraft(query), [query]);
  useEffect(() => {
    const timer = setTimeout(() => {
      if (draft === query) return;
      updateParams(params, setParams, { q: draft.trim() });
    }, 150);
    return () => clearTimeout(timer);
  }, [draft, params, query, setParams]);

  const filtered = useMemo(
    () =>
      SUBJECTS.filter((subject) => {
        const matchesQuery = subjectMatchesQuery(subject, draft);
        const matchesSem = semester === "all" || String(subject.semester) === semester;
        return matchesQuery && matchesSem;
      }),
    [draft, semester]
  );

  const heading =
    semester === "all"
      ? "All subjects"
      : `Semester ${["", "I", "II", "III", "IV", "V", "VI", "VII", "VIII"][Number(semester)] || semester}`;

  return (
    <RevisionShell>
      <h1 className="font-[family-name:var(--font-display)] text-[32px] font-extrabold tracking-[-0.04em] text-[#111]">
        Subjects
      </h1>

      <Link
        to="/dashboard#university"
        className="mt-3.5 flex items-center gap-3 rounded-[22px] bg-[#111] px-4 py-3.5 text-inherit no-underline"
      >
        <div className="min-w-0 flex-1">
          <p className="text-[12px] font-semibold uppercase tracking-[.12em] text-[var(--cyan-soft)]">
            {academic.hasContext
              ? [academic.curriculum || academic.university, academic.course, academic.branch].filter(Boolean).join(" · ")
              : "Choose your university"}
          </p>
          <p className="mt-1 text-[15px] font-semibold text-white">
            {academic.year && academic.semester
              ? `Year ${academic.year} · Semester ${["", "I", "II", "III", "IV", "V", "VI", "VII", "VIII"][academic.semester] || academic.semester}`
              : academic.university || "Set academic context to personalise this list"}
          </p>
        </div>
        <span className="shrink-0 text-[13px] font-semibold text-[var(--on-navy-2)]">Change</span>
      </Link>

      <form
        className="mt-4 flex h-[52px] items-center gap-3 rounded-full border border-[var(--line)] bg-white px-5 focus-within:border-[#111]"
        onSubmit={(e) => {
          e.preventDefault();
          updateParams(params, setParams, { q: draft.trim() });
        }}
      >
        <Search size={18} className="shrink-0 text-[var(--blue)]" aria-hidden />
        <input
          type="search"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Subject, code or topic"
          aria-label="Search subjects, codes or topics"
          className="h-full w-full border-0 bg-transparent text-[16px] text-[var(--navy)] shadow-none outline-none placeholder:text-[var(--muted)]"
        />
        {draft ? (
          <button
            type="button"
            onClick={() => {
              setDraft("");
              updateParams(params, setParams, { q: "" });
            }}
            className="grid h-11 w-11 place-items-center text-[var(--muted)]"
            aria-label="Clear search"
          >
            <X size={16} />
          </button>
        ) : null}
      </form>

      <div className="mt-3.5 flex gap-1.5 rounded-full bg-[var(--ice)] p-1" role="tablist" aria-label="Semester">
        {[{ value: "all", label: "All" }, ...semesters.map((sem) => ({ value: String(sem), label: `${sem}` }))].map((tab) => {
          const active = semester === tab.value;
          return (
            <button
              key={tab.value}
              type="button"
              role="tab"
              aria-pressed={active}
              onClick={() => updateParams(params, setParams, { sem: tab.value })}
              className={`h-10 min-w-0 flex-1 rounded-full text-[14px] ${
                active
                  ? "bg-[#111] font-bold text-white"
                  : "font-semibold text-[#5A5A5A]"
              }`}
            >
              {tab.label === "All" ? "All" : `Sem ${tab.label}`}
            </button>
          );
        })}
      </div>

      <div className="mt-5 flex items-end justify-between gap-3">
        <h2 className="font-[family-name:var(--font-display)] text-[18px] font-bold text-[var(--navy)]">{heading}</h2>
        <p className="text-[14px] text-[var(--muted)]">
          {filtered.length} {filtered.length === 1 ? "subject" : "subjects"}
        </p>
      </div>

      {filtered.length > 0 ? (
        <div className="mt-3 grid gap-3 md:grid-cols-2 min-[1100px]:grid-cols-3">
          {filtered.map((subject) => (
            <SubjectCard key={subject.code || subject.slug} subject={subject} />
          ))}
        </div>
      ) : (
        <div className="mt-3 rounded-[22px] border border-[var(--line)] bg-white px-5 py-10 text-center">
          <p className="font-medium text-[var(--navy)]">
            {draft ? `No subjects match “${draft}”. Try a subject code like 5CS4-05.` : "No syllabus available for this filter."}
          </p>
          {draft ? (
            <button
              type="button"
              onClick={() => {
                setDraft("");
                updateParams(params, setParams, { q: "" });
              }}
              className="mt-4 rounded-full bg-[var(--navy)] px-4 py-2.5 text-[14px] font-semibold text-white"
            >
              Clear search
            </button>
          ) : null}
        </div>
      )}
    </RevisionShell>
  );
}
