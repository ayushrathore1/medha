import React, { useContext, useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { AuthContext } from "../AuthContext";
import RevisionShell from "../components/Revision/RevisionShell";
import SearchBar from "../components/Revision/SearchBar";
import {
  getAcademicContext,
  semesterLabel,
  subjectMatchesQuery,
} from "../data/subjectCatalog";
import { useMergedSubjects } from "../hooks/useMergedSubjects";

const ACCENTS = ["#1BA34A", "#FF8A1A", "#2563EB", "#E30613", "#7C3AED", "#0D9488", "#F59E0B", "#DB2777"];

function updateParams(params, setParams, patch) {
  const next = new URLSearchParams(params);
  Object.entries(patch).forEach(([key, value]) => {
    if (value === "" || value == null) next.delete(key);
    else next.set(key, value);
  });
  setParams(next, { replace: true });
}

function normalizeBranch(value) {
  return String(value || "")
    .trim()
    .toUpperCase()
    .replace(/\s+/g, " ");
}

/** Shared / missing branch counts for every branch in that semester. */
function isCommonBranch(branch) {
  const b = normalizeBranch(branch);
  return !b || b === "COMMON" || b === "ALL" || b === "GENERAL" || b === "SHARED";
}

function subjectMatchesBranch(subject, branch) {
  if (!branch) return true;
  if (isCommonBranch(subject.branch)) return true;
  const sb = normalizeBranch(subject.branch);
  const ub = normalizeBranch(branch);
  return sb === ub || sb.includes(ub) || ub.includes(sb);
}

function groupByBranch(list, preferredBranch = "") {
  const map = new Map();
  for (const subject of list) {
    const key = isCommonBranch(subject.branch) ? "Common" : normalizeBranch(subject.branch);
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(subject);
  }
  const preferred = normalizeBranch(preferredBranch);
  return [...map.entries()]
    .sort(([a], [b]) => {
      if (a === preferred) return -1;
      if (b === preferred) return 1;
      if (a === "Common") return -1;
      if (b === "Common") return 1;
      return a.localeCompare(b);
    })
    .map(([branch, subjects]) => ({ branch, subjects }));
}

function SubjectGrid({ list, startIndex = 0 }) {
  return (
    <div className="desk-subject-grid">
      {list.map((subject, i) => (
        <Link
          key={`${subject.semester}-${subject.branch || ""}-${subject.slug || subject.code || i}`}
          to={`/subjects/${subject.slug}`}
          className="desk-subject-card"
          style={{ "--accent": ACCENTS[(startIndex + i) % ACCENTS.length] }}
        >
          <strong className="desk-subject-name">{subject.name}</strong>
          <span className="desk-subject-meta">
            {subject.unitCount || subject.units?.length || 0} units
            {subject.topicCount ? ` · ${subject.topicCount} topics` : ""}
          </span>
        </Link>
      ))}
    </div>
  );
}

function BranchSections({ list, preferredBranch, startIndex = 0 }) {
  const groups = groupByBranch(list, preferredBranch);
  if (groups.length <= 1) {
    return <SubjectGrid list={list} startIndex={startIndex} />;
  }
  let offset = startIndex;
  return (
    <div className="space-y-5">
      {groups.map((group) => {
        const block = (
          <div key={group.branch}>
            <p className="mb-2 text-[12px] font-bold uppercase tracking-[0.08em] text-[#6b6b6b]">
              {group.branch}
              <span className="ml-2 font-semibold normal-case tracking-normal text-[#8a8a8a]">
                {group.subjects.length}
              </span>
            </p>
            <SubjectGrid list={group.subjects} startIndex={offset} />
          </div>
        );
        offset += group.subjects.length;
        return block;
      })}
    </div>
  );
}

export default function Subjects() {
  const { user } = useContext(AuthContext);
  const [params, setParams] = useSearchParams();
  const query = params.get("q") || "";
  const [draft, setDraft] = useState(query);
  const loggedIn = Boolean(user);
  const academic = useMemo(() => getAcademicContext(user), [user]);
  // Personal "Mine" only for signed-in users with a real semester
  const profileSem = loggedIn && academic.semester ? String(academic.semester) : "";
  const profileBranch = loggedIn ? academic.branch || "" : "";
  const { subjects, semesters, loading: curriculumLoading } = useMergedSubjects();

  // Logged-in + profile → Mine default; guests → All
  const semester = params.get("sem") || (profileSem || "all");

  useEffect(() => setDraft(query), [query]);
  useEffect(() => {
    const timer = setTimeout(() => {
      if (draft === query) return;
      updateParams(params, setParams, { q: draft.trim() });
    }, 150);
    return () => clearTimeout(timer);
  }, [draft, params, query, setParams]);

  const matched = useMemo(
    () => subjects.filter((subject) => subjectMatchesQuery(subject, draft, subjects)),
    [draft, subjects]
  );

  const mine = useMemo(() => {
    if (!profileSem) return [];
    return matched.filter(
      (subject) =>
        String(subject.semester) === profileSem && subjectMatchesBranch(subject, profileBranch)
    );
  }, [matched, profileSem, profileBranch]);

  const other = useMemo(() => {
    if (!profileSem) return matched;
    return matched.filter(
      (subject) =>
        !(
          String(subject.semester) === profileSem &&
          subjectMatchesBranch(subject, profileBranch)
        )
    );
  }, [matched, profileSem, profileBranch]);

  const filtered = useMemo(() => {
    if (semester === "all") return matched;
    return matched.filter((subject) => String(subject.semester) === semester);
  }, [matched, semester]);

  const bannerLine = [academic.course, academic.branch].filter(Boolean).join(" · ");
  const bannerSub =
    academic.year && academic.semester
      ? `Year ${academic.year} · Sem ${semesterLabel(academic.semester)}`
      : academic.semester
        ? `Sem ${semesterLabel(academic.semester)}`
        : "Set year & branch on your profile";

  const viewingMine = semester !== "all" && profileSem && semester === profileSem;
  const showAllSplit = semester === "all";

  return (
    <RevisionShell title="Subjects" desk>
      <div className="desk-page">
        <header className="mb-4">
          <p className="desk-eyebrow">Syllabus map</p>
          <h1 className="desk-title">Subjects</h1>
          <p className="desk-sub">
            {loggedIn
              ? "Your semester & branch first — then the rest of the map."
              : "Browse the full syllabus map. Sign in to see your semester first."}
          </p>
        </header>

        {loggedIn ? (
          <Link to="/profile" className="desk-banner desk-banner--green mb-4">
            <div>
              <strong>{bannerLine || "Set your course"}</strong>
              <span>{bannerSub}</span>
            </div>
            <span className="desk-banner-action">Change</span>
          </Link>
        ) : (
          <Link to="/login?next=%2Fsubjects" className="desk-banner desk-banner--blue mb-4">
            <div>
              <strong>Sign in for your semester</strong>
              <span>Mine filters subjects to your branch and year after you log in.</span>
            </div>
            <span className="desk-banner-action">Login</span>
          </Link>
        )}

        <SearchBar
          value={draft}
          onChange={setDraft}
          onSubmit={(value) => updateParams(params, setParams, { q: String(value || "").trim() })}
          placeholder="Subject or topic…"
          showButton={false}
        />

        <div className="desk-tabs mt-4" role="tablist" aria-label="Semester">
          {[
            ...(profileSem ? [{ value: profileSem, label: "Mine" }] : []),
            { value: "all", label: "All" },
            ...semesters
              .filter((sem) => String(sem) !== profileSem)
              .map((sem) => ({ value: String(sem), label: `Sem ${sem}` })),
          ].map((tab) => {
            const active = semester === tab.value;
            return (
              <button
                key={tab.value}
                type="button"
                role="tab"
                aria-pressed={active}
                onClick={() => updateParams(params, setParams, { sem: tab.value })}
                className={`desk-tab${active ? " is-on" : ""}`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {showAllSplit ? (
          <>
            {profileSem ? (
              <div className="desk-panel mt-4">
                <div className="desk-panel-head">
                  <h2>Mine</h2>
                  <span className="text-[13px] font-semibold text-[#6b6b6b]">
                    {[profileBranch, `Sem ${semesterLabel(profileSem)}`].filter(Boolean).join(" · ")} ·{" "}
                    {mine.length}
                  </span>
                </div>
                {curriculumLoading ? <p className="text-[14px] text-[#6b6b6b]">Loading…</p> : null}
                {mine.length > 0 ? (
                  <SubjectGrid list={mine} />
                ) : !curriculumLoading ? (
                  <p className="text-[14px] text-[#6b6b6b]">
                    No subjects for your semester{profileBranch ? ` · ${profileBranch}` : ""} yet.
                  </p>
                ) : null}
              </div>
            ) : null}

            <div className="desk-panel mt-4">
              <div className="desk-panel-head">
                <h2>{profileSem ? "Other" : "All subjects"}</h2>
                <span className="text-[13px] font-semibold text-[#6b6b6b]">{other.length}</span>
              </div>
              {other.length > 0 ? (
                <BranchSections list={other} preferredBranch={profileBranch} startIndex={mine.length} />
              ) : (
                <p className="text-[14px] text-[#6b6b6b]">Nothing else in the map.</p>
              )}
            </div>
          </>
        ) : (
          <div className="desk-panel mt-4">
            <div className="desk-panel-head">
              <h2>
                {viewingMine
                  ? "Mine"
                  : draft.trim()
                    ? "Results"
                    : `Sem ${semesterLabel(semester)}`}
              </h2>
              <span className="text-[13px] font-semibold text-[#6b6b6b]">
                {viewingMine
                  ? [profileBranch, `${mine.length} subjects`].filter(Boolean).join(" · ")
                  : `${filtered.length} ${filtered.length === 1 ? "subject" : "subjects"}`}
              </span>
            </div>

            {curriculumLoading ? <p className="text-[14px] text-[#6b6b6b]">Loading curriculum…</p> : null}

            {viewingMine ? (
              mine.length > 0 ? (
                <SubjectGrid list={mine} />
              ) : !curriculumLoading ? (
                <p className="py-4 text-center text-[14px] text-[#6b6b6b]">
                  No subjects for Sem {semesterLabel(profileSem)}
                  {profileBranch ? ` · ${profileBranch}` : ""}.
                </p>
              ) : null
            ) : filtered.length > 0 ? (
              <BranchSections list={filtered} preferredBranch={profileBranch} />
            ) : !curriculumLoading ? (
              <div className="py-6 text-center">
                <p className="font-medium text-[#111]">
                  {draft ? `No subjects match “${draft}”.` : "No syllabus available for this filter."}
                </p>
                {draft ? (
                  <button
                    type="button"
                    onClick={() => {
                      setDraft("");
                      updateParams(params, setParams, { q: "" });
                    }}
                    className="desk-solid-btn mt-4"
                  >
                    Clear search
                  </button>
                ) : null}
              </div>
            ) : null}
          </div>
        )}
      </div>
    </RevisionShell>
  );
}
