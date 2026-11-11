import React, { startTransition, useContext, useEffect, useMemo, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { AuthContext } from "../AuthContext";
import RevisionShell from "../components/Revision/RevisionShell";
import SearchBar from "../components/Revision/SearchBar";
import ResourceBoard from "../components/Revision/ResourceBoard";
import { useMergedSubjects } from "../hooks/useMergedSubjects";
import {
  POPULAR_TOPICS,
  findTopicMatch,
  findTopicMatches,
  getAcademicContext,
  clearRecentSearches,
  getRecentSearches,
  resolveSearchQuery,
  searchPath,
  semesterLabel,
} from "../data/subjectCatalog";
import { trackSearchOpened } from "../lib/studyActivity";
import { usePageSeo } from "../hooks/usePageSeo";
import { searchResultsJsonLd } from "../lib/seo";
import { subjectMatchesBranch } from "../data/branchScope";
import "./DashboardHome.css";
import "./RevisionSearch.css";

const POPULAR_TONES = [
  { bg: "#1BA34A", ink: "#fff" },
  { bg: "#FF8A1A", ink: "#161616" },
  { bg: "#2563EB", ink: "#fff" },
  { bg: "#7C3AED", ink: "#fff" },
  { bg: "#0D9488", ink: "#fff" },
  { bg: "#E30613", ink: "#fff" },
  { bg: "#F59E0B", ink: "#161616" },
  { bg: "#DB2777", ink: "#fff" },
];

const URL_SYNC_MS = 180;
const RECENT_SAVE_MS = 750;
const SEARCH_SCOPE_KEY = "medha_search_scope_v1";

function hitHeadline(match, fallbackQuery) {
  if (!match) return fallbackQuery;
  return match.topic || match.unit?.title || match.subject?.name || fallbackQuery;
}

function hitPath(match) {
  if (!match?.subject) return "/subjects";
  if (match.unit) return `/subjects/${match.subject.slug}/${match.unit.slug}`;
  return `/subjects/${match.subject.slug}`;
}

function readStoredScope() {
  try {
    const raw = localStorage.getItem(SEARCH_SCOPE_KEY);
    if (raw === "mine" || raw === "global") return raw;
  } catch {
    /* ignore */
  }
  return null;
}

function storeScope(scope) {
  try {
    localStorage.setItem(SEARCH_SCOPE_KEY, scope);
  } catch {
    /* ignore */
  }
}

function buildSearchParams({ q, scope }) {
  const next = {};
  if (q) next.q = q;
  if (scope) next.scope = scope;
  return next;
}

export default function RevisionSearch() {
  const { user } = useContext(AuthContext);
  const academic = useMemo(() => getAcademicContext(user), [user]);
  const hasMySem = Boolean(academic.semester);
  const mySemLabel = hasMySem ? semesterLabel(academic.semester) : "";

  const [params, setParams] = useSearchParams();
  const urlQuery = params.get("q") || "";
  const urlScope = params.get("scope");

  const defaultScope = hasMySem ? "mine" : "global";
  const initialScope =
    urlScope === "mine" || urlScope === "global"
      ? urlScope
      : readStoredScope() || defaultScope;

  const [query, setQuery] = useState(urlQuery);
  const [scope, setScope] = useState(hasMySem ? initialScope : "global");
  const liveQuery = String(query ?? "").trim();
  const hasQuery = liveQuery.length > 0;
  const skipNextUrlToState = useRef(false);
  const [recents, setRecents] = useState(() => getRecentSearches());
  const { subjects } = useMergedSubjects();

  const refreshRecents = () => setRecents(getRecentSearches());
  const clearHistory = () => {
    clearRecentSearches();
    setRecents([]);
  };

  // Guests / no profile semester can only use Global.
  useEffect(() => {
    if (!hasMySem && scope !== "global") setScope("global");
  }, [hasMySem, scope]);

  useEffect(() => {
    storeScope(scope);
  }, [scope]);

  const scopedSubjects = useMemo(() => {
    if (scope !== "mine" || !academic.semester) return subjects;
    const sem = String(academic.semester);
    const inSem = subjects.filter((s) => String(s.semester) === sem);
    const withBranch = inSem.filter((s) => subjectMatchesBranch(s, academic.branch));
    // If branch filter empties the list, keep the whole semester.
    return withBranch.length ? withBranch : inSem;
  }, [subjects, scope, academic.semester, academic.branch]);

  const match = useMemo(
    () => findTopicMatch(liveQuery, { subjects: scopedSubjects }),
    [liveQuery, scopedSubjects]
  );
  const altMatches = useMemo(() => {
    if (!liveQuery) return [];
    return findTopicMatches(liveQuery, { limit: 5, subjects: scopedSubjects }).filter((hit, idx) => {
      if (idx === 0) return false;
      return hit.score >= 70;
    });
  }, [liveQuery, scopedSubjects]);

  const globalFallback = useMemo(() => {
    if (!liveQuery || scope !== "mine" || match?.subject) return null;
    return findTopicMatch(liveQuery, { subjects });
  }, [liveQuery, scope, match, subjects]);

  const resourceQuery = useMemo(
    () => resolveSearchQuery(liveQuery, scopedSubjects.length ? scopedSubjects : subjects),
    [liveQuery, scopedSubjects, subjects]
  );

  const apiSemester = scope === "mine" && academic.semester ? String(academic.semester) : "all";

  // Browser back/forward / shared links → input + scope
  useEffect(() => {
    if (skipNextUrlToState.current) {
      skipNextUrlToState.current = false;
      return;
    }
    setQuery(urlQuery);
    if (urlScope === "mine" || urlScope === "global") {
      setScope(hasMySem ? urlScope : "global");
    }
  }, [urlQuery, urlScope, hasMySem]);

  // Input → ?q=&scope= (debounced)
  useEffect(() => {
    const currentQ = (params.get("q") || "").trim();
    const currentScope = params.get("scope") || "";
    const desiredScope = hasMySem ? scope : "global";
    if (liveQuery === currentQ && currentScope === desiredScope) return undefined;

    const handle = window.setTimeout(() => {
      skipNextUrlToState.current = true;
      startTransition(() => {
        setParams(buildSearchParams({ q: liveQuery, scope: desiredScope }), { replace: true });
      });
    }, URL_SYNC_MS);
    return () => window.clearTimeout(handle);
  }, [liveQuery, scope, hasMySem, params, setParams]);

  useEffect(() => {
    if (liveQuery.length < 2) return undefined;
    const handle = window.setTimeout(() => {
      trackSearchOpened(liveQuery);
      refreshRecents();
    }, RECENT_SAVE_MS);
    return () => window.clearTimeout(handle);
  }, [liveQuery]);

  const applyQuery = (value) => {
    const next = String(value ?? "").trim();
    const desiredScope = hasMySem ? scope : "global";
    setQuery(next);
    skipNextUrlToState.current = true;
    startTransition(() => {
      setParams(buildSearchParams({ q: next, scope: desiredScope }), { replace: true });
    });
    if (next.length >= 2) {
      trackSearchOpened(next);
      refreshRecents();
    }
  };

  const onClear = () => {
    const desiredScope = hasMySem ? scope : "global";
    setQuery("");
    skipNextUrlToState.current = true;
    startTransition(() => {
      setParams(buildSearchParams({ q: "", scope: desiredScope }), { replace: true });
    });
  };

  const setSearchScope = (nextScope) => {
    if (nextScope === "mine" && !hasMySem) return;
    setScope(nextScope);
    skipNextUrlToState.current = true;
    startTransition(() => {
      setParams(buildSearchParams({ q: liveQuery, scope: nextScope }), { replace: true });
    });
  };

  const seoPath = liveQuery ? searchPath(liveQuery) : "/search";
  const seoTitle = liveQuery
    ? `${liveQuery} — RTU topic notes & resources`
    : "Search RTU topics, notes & syllabus";
  const seoDescription = liveQuery
    ? `Study “${liveQuery}” on Medha Revision — RTU syllabus match, notes, YouTube and GeeksforGeeks resources for B.Tech exams.`
    : "Search any RTU subject topic on Medha Revision. Short forms like OS, DSA, DBMS work too.";

  const seoResults = useMemo(() => {
    const items = [];
    if (match?.subject) {
      items.push({
        name: hitHeadline(match, liveQuery),
        path: hitPath(match),
      });
    }
    for (const hit of altMatches) {
      if (!hit?.subject) continue;
      items.push({ name: hitHeadline(hit, liveQuery), path: hitPath(hit) });
    }
    return items;
  }, [match, altMatches, liveQuery]);

  usePageSeo({
    title: seoTitle,
    description: seoDescription,
    path: seoPath,
    jsonLd: liveQuery
      ? searchResultsJsonLd({ query: liveQuery, path: seoPath, results: seoResults })
      : null,
  });

  return (
    <RevisionShell title={liveQuery || "Search"} desk>
      <div className="desk-page search-desk">
        <header className="search-desk-top">
          <p className="desk-eyebrow">Library search</p>
          <h1 className="desk-title">{hasQuery ? "Results" : "Find a topic"}</h1>
          <p className="desk-sub">
            Short forms work too — OS, DSA, IPC, AOA. Choose My sem or Global below.
          </p>
        </header>

        <div className="search-scope" role="tablist" aria-label="Search scope">
          <button
            type="button"
            role="tab"
            aria-selected={scope === "mine"}
            className={`search-scope-btn${scope === "mine" ? " is-on" : ""}`}
            disabled={!hasMySem}
            onClick={() => setSearchScope("mine")}
            title={hasMySem ? `Limit to ${mySemLabel}` : "Set your semester in Profile first"}
          >
            My sem
            {hasMySem ? <span className="search-scope-meta">{mySemLabel}</span> : null}
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={scope === "global"}
            className={`search-scope-btn${scope === "global" ? " is-on" : ""}`}
            onClick={() => setSearchScope("global")}
          >
            Global
            <span className="search-scope-meta">All semesters</span>
          </button>
        </div>

        {!hasMySem ? (
          <p className="search-scope-hint">
            <Link to="/profile">Add your semester in Profile</Link> to use My sem search.
          </p>
        ) : null}

        <SearchBar
          value={query}
          onChange={setQuery}
          onClear={onClear}
          onSubmit={applyQuery}
          autoFocus={!urlQuery}
          showButton
          live
          placeholder={
            scope === "mine"
              ? `Search ${mySemLabel || "your semester"} — OS, IPC, topic…`
              : "Search all semesters — OS, DSA, IPC, topic…"
          }
        />

        {!hasQuery && (
          <div className="search-desk-sections">
            {recents.length > 0 && (
              <section className="desk-panel search-recent-panel">
                <div className="desk-panel-head">
                  <h2>Recent</h2>
                  <button type="button" className="search-clear-history" onClick={clearHistory}>
                    Clear history
                  </button>
                </div>
                <div className="search-recent-list">
                  {recents.map((item) => (
                    <button key={item} type="button" onClick={() => applyQuery(item)} className="search-recent-chip">
                      <span className="search-recent-label">{item}</span>
                    </button>
                  ))}
                </div>
              </section>
            )}

            <section className="desk-panel search-popular-panel">
              <div className="desk-panel-head">
                <h2>Often searched</h2>
              </div>
              <div className="search-popular-list">
                {POPULAR_TOPICS.map((topic, i) => {
                  const tone = POPULAR_TONES[i % POPULAR_TONES.length];
                  return (
                    <button
                      key={topic.label}
                      type="button"
                      onClick={() => applyQuery(topic.query)}
                      className="search-popular-chip"
                      style={{ background: tone.bg, color: tone.ink }}
                    >
                      {topic.label}
                    </button>
                  );
                })}
              </div>
            </section>
          </div>
        )}

        {hasQuery ? (
          <div className="search-desk-results">
            {match?.subject ? (
              <article className="search-syllabus-card">
                <div className="search-syllabus-card__top">
                  <p className="desk-eyebrow" style={{ marginBottom: 0 }}>
                    {scope === "mine" ? `In your ${mySemLabel}` : "In the syllabus"}
                  </p>
                  <span className="search-subject-pill" title={match.subject.name}>
                    {match.subject.short || match.subject.name}
                  </span>
                </div>
                <h2 className="search-hit-title">{hitHeadline(match, liveQuery)}</h2>
                <p className="search-hit-meta">
                  <span>{match.subject.name}</span>
                  {match.subject.semester ? (
                    <>
                      <span className="search-hit-dot">·</span>
                      <span>{semesterLabel(match.subject.semester)}</span>
                    </>
                  ) : null}
                  {match.unit ? <span className="search-hit-dot">·</span> : null}
                  {match.unit ? <span>{match.unit.title}</span> : null}
                </p>
                {match.topic && liveQuery.toLowerCase() !== match.topic.toLowerCase() ? (
                  <p className="search-hit-alias">
                    Matched from “{liveQuery}”
                    {match.expansions?.[0] ? ` → ${match.expansions[0]}` : ""}
                  </p>
                ) : null}
                <div className="search-syllabus-card__actions">
                  <Link to={hitPath(match)} className="desk-solid-btn">
                    Open {match.unit ? "unit" : "subject"}
                  </Link>
                  {resourceQuery && resourceQuery.toLowerCase() !== liveQuery.toLowerCase() ? (
                    <span className="search-hit-resolved">Searching resources for “{resourceQuery}”</span>
                  ) : null}
                </div>
                {altMatches.length > 0 ? (
                  <div className="search-alt-hits">
                    <p className="search-alt-label">Also related</p>
                    <div className="search-alt-list">
                      {altMatches.map((hit) => (
                        <Link
                          key={`${hit.subject.slug}-${hit.unit?.slug || "s"}-${hit.topic || "u"}`}
                          to={hitPath(hit)}
                          className="search-alt-chip"
                        >
                          <strong>{hitHeadline(hit, liveQuery)}</strong>
                          <span>
                            {hit.subject.short}
                            {hit.subject.semester ? ` · ${semesterLabel(hit.subject.semester)}` : ""}
                            {hit.unit ? ` · ${hit.unit.title}` : ""}
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : null}
              </article>
            ) : (
              <div className="search-syllabus-miss">
                <p className="desk-eyebrow" style={{ marginBottom: 6 }}>
                  Syllabus
                </p>
                <p className="search-miss-copy">
                  {scope === "mine"
                    ? `No match in your ${mySemLabel || "semester"} for “${liveQuery}”.`
                    : `No exact syllabus topic for “${liveQuery}”.`}{" "}
                  Showing library resources anyway.
                </p>
                {scope === "mine" && globalFallback?.subject ? (
                  <button
                    type="button"
                    className="search-miss-switch"
                    onClick={() => setSearchScope("global")}
                  >
                    Found in {semesterLabel(globalFallback.subject.semester)} ·{" "}
                    {hitHeadline(globalFallback, liveQuery)} — search Global
                  </button>
                ) : null}
              </div>
            )}
            <ResourceBoard
              key={`live-resource-board-${scope}-${apiSemester}`}
              query={resourceQuery || liveQuery}
              subject={match?.subject?.name}
              semester={apiSemester}
              extraTitles={match?.unit?.topics || []}
              emptyLabel={
                scope === "mine"
                  ? `Nothing in ${mySemLabel || "your semester"} yet. Try Global.`
                  : "Try another topic, or open Subjects."
              }
            />
          </div>
        ) : null}
      </div>
    </RevisionShell>
  );
}
