import React, { useMemo, useState } from "react";
import RevisionShell from "../components/Revision/RevisionShell";
import SubjectCard from "../components/Revision/SubjectCard";
import { SUBJECTS } from "../data/subjectCatalog";

export default function Subjects() {
  const [query, setQuery] = useState("");
  const [semester, setSemester] = useState("all");

  const filtered = useMemo(() => {
    return SUBJECTS.filter((subject) => {
      const matchesQuery = !query || subject.name.toLowerCase().includes(query.toLowerCase()) || subject.short.toLowerCase().includes(query.toLowerCase());
      const matchesSem = semester === "all" || String(subject.semester) === semester;
      return matchesQuery && matchesSem;
    });
  }, [query, semester]);

  return (
    <RevisionShell title="Subjects">
      <p className="mb-5 text-[14px] text-[#5C5C5C]">
        Third and fourth semester, listed as they appear in the RTU syllabus.
      </p>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Filter by name"
        className="w-full border-b border-[#E5E5E5] bg-transparent py-2 text-[15px] shadow-none outline-none focus:border-[#1F1F1F]"
      />
      <div className="mt-4 flex gap-4 text-[13px]">
        {["all", "3", "4"].map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => setSemester(value)}
            className={`pb-1 ${
              semester === value ? "border-b border-[#1F1F1F] font-medium text-[#1F1F1F]" : "text-[#8A8A8A]"
            }`}
          >
            {value === "all" ? "All" : value === "3" ? "3rd sem" : "4th sem"}
          </button>
        ))}
      </div>

      <div className="mt-2 border-t border-[#E5E5E5]">
        {filtered.map((subject) => (
          <SubjectCard key={subject.slug} subject={subject} />
        ))}
        {filtered.length === 0 && (
          <p className="py-8 text-[14px] text-[#5C5C5C]">No subject by that name.</p>
        )}
      </div>
    </RevisionShell>
  );
}
