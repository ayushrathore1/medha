import React, { useContext, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthContext";
import RevisionShell from "../components/Revision/RevisionShell";
import SearchBar from "../components/Revision/SearchBar";
import SubjectCard from "../components/Revision/SubjectCard";
import { POPULAR_TOPICS, SUBJECTS, getRecentSearches, saveRecentSearch } from "../data/subjectCatalog";

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const recents = useMemo(() => getRecentSearches(), []);
  const featured = SUBJECTS.slice(0, 6);

  const goSearch = (value) => {
    const next = (value || query).trim();
    if (!next) {
      navigate("/search");
      return;
    }
    saveRecentSearch(next);
    navigate(`/search?q=${encodeURIComponent(next)}`);
  };

  const firstName = user?.name?.split(" ")[0];

  return (
    <RevisionShell>
      <section>
        <p className="text-[13px] text-[#5C5C5C]">
          {firstName ? `Hi ${firstName}.` : "RTU CSE / AIDS"}
        </p>
        <h1 className="mt-1 max-w-md text-[28px] font-semibold leading-[1.2] tracking-[-0.03em] text-[#1F1F1F]">
          Notes for the unit you have tomorrow.
        </h1>
        <p className="mt-3 max-w-md text-[14px] leading-6 text-[#5C5C5C]">
          Search a topic. Open the notes, lectures, and GFG pages that match. Sign in only to download or share.
        </p>
        <div className="mt-5">
          <SearchBar value={query} onChange={setQuery} onSubmit={goSearch} />
        </div>
      </section>

      <section className="mt-8">
        <div className="mb-3 flex items-baseline justify-between">
          <h2 className="text-[15px] font-semibold text-[#1F1F1F]">Often searched</h2>
          <Link to="/subjects" className="text-[13px] text-[#5C5C5C] no-underline">
            All subjects
          </Link>
        </div>
        <div className="flex flex-wrap gap-2">
          {POPULAR_TOPICS.map((topic) => (
            <button
              key={topic.label}
              type="button"
              onClick={() => goSearch(topic.query)}
              className="border border-[#E5E5E5] bg-white px-3 py-1.5 text-[13px] text-[#1F1F1F]"
            >
              {topic.label}
            </button>
          ))}
        </div>
      </section>

      {recents.length > 0 && (
        <section className="mt-8">
          <h2 className="mb-3 text-[15px] font-semibold text-[#1F1F1F]">Continue</h2>
          <div className="flex flex-wrap gap-2">
            {recents.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => goSearch(item)}
                className="bg-[#1F1F1F] px-3 py-1.5 text-[13px] text-white"
              >
                {item}
              </button>
            ))}
          </div>
        </section>
      )}

      <section className="mt-10">
        <div className="mb-1 flex items-baseline justify-between">
          <h2 className="text-[15px] font-semibold text-[#1F1F1F]">Subjects</h2>
          <Link to="/subjects" className="text-[13px] text-[#5C5C5C] no-underline">
            See all
          </Link>
        </div>
        <div className="border-t border-[#E5E5E5]">
          {featured.map((subject) => (
            <SubjectCard key={subject.slug} subject={subject} compact />
          ))}
        </div>
      </section>
    </RevisionShell>
  );
}
