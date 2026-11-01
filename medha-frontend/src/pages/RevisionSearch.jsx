import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import RevisionShell from "../components/Revision/RevisionShell";
import SearchBar from "../components/Revision/SearchBar";
import ResourceBoard from "../components/Revision/ResourceBoard";
import { POPULAR_TOPICS, findTopicMatch, getRecentSearches, saveRecentSearch, tagsForText } from "../data/subjectCatalog";
import { SchemeTags } from "../components/Revision/SchemeTag";

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
    <RevisionShell title={urlQuery || "Search"}>
      <SearchBar value={query} onChange={setQuery} onSubmit={commit} autoFocus={!urlQuery} />

      {!urlQuery && (
        <div className="mt-8 space-y-10">
          <p className="max-w-[52ch] text-[15px] leading-relaxed text-[#5A5A5A]">
            Type a topic from the syllabus. We’ll pull notes, lectures, and GFG.
          </p>
          {recents.length > 0 && (
            <section>
              <h2 className="mb-3.5 font-[family-name:var(--font-display)] text-[13px] font-semibold uppercase tracking-[.12em] text-[#5A5A5A]">
                Recent
              </h2>
              <div className="flex flex-wrap gap-2">
                {recents.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => commit(item)}
                    className="rounded-full border border-[var(--line)] bg-white px-4 py-2 text-left text-[13px] text-[#111] transition-colors hover:border-[#111]"
                  >
                    <span className="mb-1 block">
                      <SchemeTags tags={tagsForText(item)} />
                    </span>
                    {item}
                  </button>
                ))}
              </div>
            </section>
          )}
          <section>
            <h2 className="mb-3.5 font-[family-name:var(--font-display)] text-[13px] font-semibold uppercase tracking-[.12em] text-[#5A5A5A]">
              Often searched
            </h2>
            <div className="flex flex-wrap gap-2">
              {POPULAR_TOPICS.map((topic) => (
                <button
                  key={topic.label}
                  type="button"
                  onClick={() => commit(topic.query)}
                  className="rounded-full bg-[#111] px-4 py-2 text-[13px] font-medium text-white transition-opacity hover:opacity-85"
                >
                  {topic.label}
                </button>
              ))}
            </div>
          </section>
        </div>
      )}

      {urlQuery && (
        <div className="mt-6">
          {match?.subject && (
            <div className="mb-6 border-b border-[var(--line)] pb-5">
              <div className="mb-2">
                <SchemeTags tags={tagsForText(urlQuery, match.subject.scheme)} />
              </div>
              <p className="text-[12px] font-semibold uppercase tracking-[.12em] text-[#5A5A5A]">In the syllabus</p>
              <h2 className="mt-1 font-[family-name:var(--font-display)] text-[22px] font-extrabold tracking-[-0.03em] text-[#111]">
                {urlQuery}
              </h2>
              <p className="mt-1 text-[14px] text-[#5A5A5A]">
                {match.subject.name}
                {match.unit ? ` · ${match.unit.title}` : ""}
              </p>
              <Link
                to={match.unit ? `/subjects/${match.subject.slug}/${match.unit.slug}` : `/subjects/${match.subject.slug}`}
                className="mt-3 inline-block border-b-2 border-[var(--cyan-soft)] pb-0.5 text-[13px] font-medium text-[#111] no-underline"
              >
                Open unit
              </Link>
            </div>
          )}
          <ResourceBoard query={urlQuery} extraTitles={match?.unit?.topics || []} />
        </div>
      )}
    </RevisionShell>
  );
}
