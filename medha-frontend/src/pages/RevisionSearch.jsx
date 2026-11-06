import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import RevisionShell from "../components/Revision/RevisionShell";
import SearchBar from "../components/Revision/SearchBar";
import ResourceBoard from "../components/Revision/ResourceBoard";
import { POPULAR_TOPICS, findTopicMatch, getRecentSearches, saveRecentSearch } from "../data/subjectCatalog";
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

export default function RevisionSearch() {
  const [params, setParams] = useSearchParams();
  const urlQuery = params.get("q") || "";
  const [query, setQuery] = useState(urlQuery);
  const recents = getRecentSearches();
  const match = findTopicMatch(urlQuery);

  useEffect(() => {
    setQuery(urlQuery);
  }, [urlQuery]);

  const commit = (value) => {
    const next = (value ?? query).trim();
    setParams(next ? { q: next } : {}, { replace: true });
    if (next) saveRecentSearch(next);
  };

  return (
    <RevisionShell title={urlQuery || "Search"} desk>
      <div className="desk-page search-desk">
        <header className="search-desk-top">
          <p className="desk-eyebrow">Library search</p>
          <h1 className="desk-title">{urlQuery ? "Results" : "Find a topic"}</h1>
          <p className="desk-sub">
            Type a topic from the syllabus. We’ll pull notes, lectures, and GFG into one place.
          </p>
        </header>

        <SearchBar value={query} onChange={setQuery} onSubmit={commit} autoFocus={!urlQuery} />

        {!urlQuery && (
          <div className="search-desk-sections">
            {recents.length > 0 && (
              <section className="desk-panel search-recent-panel">
                <div className="desk-panel-head">
                  <h2>Recent</h2>
                </div>
                <div className="search-recent-list">
                  {recents.map((item) => (
                    <button key={item} type="button" onClick={() => commit(item)} className="search-recent-chip">
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
                      onClick={() => commit(topic.query)}
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

        {urlQuery && (
          <div className="search-desk-results">
            {match?.subject && (
              <div className="desk-panel search-syllabus-hit">
                <p className="desk-eyebrow" style={{ marginBottom: 6 }}>
                  In the syllabus
                </p>
                <h2 className="search-hit-title">{urlQuery}</h2>
                <p className="desk-sub" style={{ marginTop: 6 }}>
                  {match.subject.name}
                  {match.unit ? ` · ${match.unit.title}` : ""}
                </p>
                <Link
                  to={match.unit ? `/subjects/${match.subject.slug}/${match.unit.slug}` : `/subjects/${match.subject.slug}`}
                  className="desk-solid-btn"
                  style={{ marginTop: 14, width: "fit-content" }}
                >
                  Open unit
                </Link>
              </div>
            )}
            <ResourceBoard query={urlQuery} extraTitles={match?.unit?.topics || []} />
          </div>
        )}
      </div>
    </RevisionShell>
  );
}
