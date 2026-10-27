import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import RevisionShell from "../components/Revision/RevisionShell";
import SearchBar from "../components/Revision/SearchBar";
import ResourceBoard from "../components/Revision/ResourceBoard";
import { POPULAR_TOPICS, findTopicMatch, getRecentSearches, saveRecentSearch } from "../data/subjectCatalog";

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
        <div className="mt-8 space-y-8">
          <p className="text-[14px] text-[#5C5C5C]">Type a topic from the syllabus. We’ll pull notes, lectures, and GFG.</p>
          {recents.length > 0 && (
            <section>
              <h2 className="mb-3 text-[15px] font-semibold">Recent</h2>
              <div className="flex flex-wrap gap-2">
                {recents.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => commit(item)}
                    className="border border-[#E5E5E5] px-3 py-1.5 text-[13px]"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </section>
          )}
          <section>
            <h2 className="mb-3 text-[15px] font-semibold">Often searched</h2>
            <div className="flex flex-wrap gap-2">
              {POPULAR_TOPICS.map((topic) => (
                <button
                  key={topic.label}
                  type="button"
                  onClick={() => commit(topic.query)}
                  className="bg-[#1F1F1F] px-3 py-1.5 text-[13px] text-white"
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
            <div className="mb-6 border-b border-[#E5E5E5] pb-4">
              <p className="text-[12px] text-[#8A8A8A]">In the syllabus</p>
              <h2 className="mt-1 text-[18px] font-semibold text-[#1F1F1F]">{urlQuery}</h2>
              <p className="mt-1 text-[13px] text-[#5C5C5C]">
                {match.subject.name}
                {match.unit ? ` · ${match.unit.title}` : ""}
              </p>
              <Link
                to={match.unit ? `/subjects/${match.subject.slug}/${match.unit.slug}` : `/subjects/${match.subject.slug}`}
                className="mt-2 inline-block text-[13px] text-[#1F1F1F] underline underline-offset-2"
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
