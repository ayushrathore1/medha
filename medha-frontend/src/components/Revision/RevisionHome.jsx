import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, FileText, HelpCircle, PlayCircle, Search, Sparkles } from "lucide-react";
import {
  SUBJECTS,
  UNIVERSITY_OPTIONS,
  catalogStats,
  getSharedTitlePairs,
  getSubjectByCode,
  getUniversityOption,
  saveRecentSearch,
  searchPath,
} from "../../data/subjectCatalog";
import CodeChip from "./CodeChip";
import Ridgeline from "./Ridgeline";
import TopicChip from "./TopicChip";

const RESULT_ROWS = [
  { icon: FileText, title: "Notes & PDFs", caption: "Shared by students" },
  { icon: PlayCircle, title: "Video explanations", caption: "From YouTube" },
  { icon: HelpCircle, title: "Previous-year questions", caption: "Matched to the topic" },
  { icon: Sparkles, title: "Plain-language explanation", caption: "AI-assisted, tied to your syllabus" },
];

export default function RevisionHome({ user }) {
  const navigate = useNavigate();
  const [query, setQuery] = useState("Quick Sort");
  const [university, setUniversity] = useState(() => localStorage.getItem("medha-university") || "");
  const [other, setOther] = useState(() => localStorage.getItem("medha-custom-university") || "");
  const [subjectCode, setSubjectCode] = useState("");
  const [activeUnit, setActiveUnit] = useState(1);

  const option = getUniversityOption(university);
  const featured = useMemo(() => {
    if (subjectCode) return getSubjectByCode(subjectCode);
    if (option) {
      return SUBJECTS.find((subject) => subject.scheme === option.scheme && subject.semester === option.semester) || null;
    }
    return SUBJECTS.find((subject) => subject.scheme === "rtu" && subject.semester === 5) || SUBJECTS[0];
  }, [option, subjectCode]);

  const catalog = useMemo(() => {
    if (option) {
      return SUBJECTS.filter((subject) => subject.scheme === option.scheme && subject.semester === option.semester);
    }
    return SUBJECTS.filter((subject) => subject.scheme === "rtu" && subject.semester === 5);
  }, [option]);

  const stats = catalogStats(catalog);
  const pairs = useMemo(() => getSharedTitlePairs(), []);
  const pair = pairs[0] || [];
  const unit = featured?.units[activeUnit] || featured?.units[0];
  const roman = ["", "I", "II", "III", "IV", "V", "VI", "VII", "VIII"][featured?.semester] || featured?.semester;

  useEffect(() => {
    if (university) {
      localStorage.setItem("medha-university", university);
      localStorage.setItem("medha-custom-university", other);
    }
  }, [other, university]);

  useEffect(() => {
    if (!option) return;
    const stored = localStorage.getItem(option.storageKey);
    const match = catalog.find((subject) => subject.code === stored) || catalog[0];
    setSubjectCode(match?.code || "");
    setActiveUnit(match?.units[1] ? 1 : 0);
  }, [catalog, option]);

  useEffect(() => {
    if (option && subjectCode) localStorage.setItem(option.storageKey, subjectCode);
  }, [option, subjectCode]);

  const submitSearch = (text = query) => {
    const term = String(text || "").trim() || "Quick Sort";
    saveRecentSearch(term);
    navigate(searchPath(term, { code: featured?.code, scheme: featured?.scheme, unit: unit?.title }));
  };

  return (
    <div className="space-y-0">
      <section className="flex flex-wrap items-center gap-12 pb-14 pt-4">
        <div className="flex min-w-[min(100%,520px)] flex-[1_1_520px] flex-col justify-center gap-7">
          <p className="flex items-center gap-2 text-[13px] font-semibold uppercase tracking-[.12em] text-[#5A5A5A]">
            <span className="h-2 w-2 rounded-full bg-[var(--cyan)]" aria-hidden />
            University-aware study search
          </p>
          <h1 className="max-w-[16ch] font-[family-name:var(--font-display)] text-[clamp(46px,6.4vw,92px)] font-extrabold leading-[0.98] tracking-[-0.045em] text-[#111]">
            Your syllabus,
            <br />
            <span style={{ background: "linear-gradient(transparent 64%, var(--cyan-soft) 64%)" }} className="text-[#111]">
              searchable.
            </span>
          </h1>
          <p className="max-w-[520px] text-[20px] leading-[1.55] text-[#5A5A5A]">
            Pick your university. Tap any unit or topic. Medha brings the notes, videos and previous-year questions to you, in one place.
          </p>
          <div className="flex flex-wrap items-center gap-5">
            <Link
              to={featured ? `/subjects?sem=${featured.semester}` : "/subjects"}
              className="inline-flex items-center gap-2 rounded-full bg-[#111] px-7 py-[18px] text-[16px] font-semibold text-white no-underline"
            >
              Open my syllabus
              <ArrowRight size={18} className="text-[var(--cyan-soft)]" />
            </Link>
            <a href="#syllabus-index" className="border-b-2 border-[var(--cyan-soft)] pb-0.5 text-[15px] font-medium text-[#111] no-underline">
              See how it works
            </a>
          </div>
          <p className="text-[14px] text-[var(--muted)]">Pick your curriculum, then jump into units and topics.</p>
        </div>

        <div className="relative min-h-[620px] min-w-[min(100%,440px)] flex-[1_1_440px] overflow-hidden rounded-[36px] bg-[#111] p-7 shadow-[0_40px_80px_-40px_rgba(0,0,0,0.35)]">
          <div className="relative z-10">
            <div id="university" className="mb-4 scroll-mt-28">
              <label htmlFor="medha-university" className="sr-only">
                University
              </label>
              <select
                id="medha-university"
                value={university}
                onChange={(e) => setUniversity(e.target.value)}
                className="w-full rounded-2xl border-0 bg-white/10 px-3 py-3 text-[14px] text-white outline-none"
              >
                <option value="">Select your university</option>
                {UNIVERSITY_OPTIONS.map((item) => (
                  <option key={item.key} value={item.key}>
                    {item.label}
                  </option>
                ))}
                <option value="Other">Other university</option>
              </select>
              {university === "Other" ? (
                <input
                  value={other}
                  onChange={(e) => setOther(e.target.value)}
                  placeholder="University name"
                  className="mt-2 w-full rounded-2xl border-0 bg-white/10 px-3 py-3 text-[14px] text-white outline-none"
                />
              ) : null}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                submitSearch();
              }}
              className="flex items-center gap-2 rounded-full bg-white p-2 pl-[18px]"
            >
              <Search size={18} className="shrink-0 text-[#111]" aria-hidden />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                aria-label="Search a topic"
                className="min-w-0 flex-1 border-0 bg-transparent font-[family-name:var(--font-display)] text-[20px] font-bold text-[#111] outline-none"
              />
              <button
                type="submit"
                className="rounded-full bg-[var(--cyan-soft)] px-5 py-2.5 text-[14px] font-bold text-[#111]"
              >
                Search
              </button>
            </form>

            {featured ? (
              <div className="mt-3 flex flex-wrap gap-2">
                {[
                  `${featured.branch} · Sem ${roman}`,
                  featured.name,
                  unit ? `Unit ${String(unit.unitNumber || 1).padStart(2, "0")}` : null,
                ]
                  .filter(Boolean)
                  .map((item, index, list) => (
                    <span
                      key={item}
                      className={`rounded-full px-3 py-1 text-[12px] font-semibold text-white ${
                        index === list.length - 1 ? "bg-[rgba(198,217,59,0.28)]" : "bg-white/10"
                      }`}
                    >
                      {item}
                    </span>
                  ))}
              </div>
            ) : null}

            <div className="mt-6 space-y-3">
              {RESULT_ROWS.map((row) => {
                const Icon = row.icon;
                return (
                  <div key={row.title} className="flex items-center gap-3 rounded-[18px] bg-white/8 px-[18px] py-4">
                    <Icon size={22} className="shrink-0 text-[var(--cyan)]" strokeWidth={2} />
                    <div>
                      <p className="font-[family-name:var(--font-display)] text-[16px] font-bold text-white">{row.title}</p>
                      <p className="text-[13px] text-[var(--on-navy-2)]">{row.caption}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <Ridgeline height={190} />
        </div>
      </section>

      <section className="grid grid-cols-1 border-y border-[var(--line)] py-7 sm:grid-cols-3">
        {[
          { n: stats.subjects, label: `subjects in Semester ${roman || "V"}` },
          { n: stats.units, label: "units mapped from the syllabus" },
          { n: stats.topics, label: "topics ready to search" },
        ].map((item) => (
          <div key={item.label} className="px-2 py-3">
            <p className="font-[family-name:var(--font-display)] text-[44px] font-extrabold leading-none text-[var(--navy)]">
              {item.n}
            </p>
            <p className="mt-2 text-[15px] text-[var(--slate-2)]">{item.label}</p>
          </div>
        ))}
      </section>

      {featured ? (
        <section id="syllabus-index" className="-mx-5 mt-16 scroll-mt-24 rounded-t-[48px] bg-[var(--navy)] px-5 py-24 md:-mx-6 md:px-6">
          <div className="mx-auto flex max-w-[1240px] flex-wrap gap-10">
            <div className="min-w-[min(100%,520px)] flex-[1_1_520px]">
              <p className="text-[13px] font-semibold uppercase tracking-[.12em] text-[var(--cyan)]">
                {featured.code} · {featured.branch} · Sem {roman}
              </p>
              <h2 className="mt-4 font-[family-name:var(--font-display)] text-[clamp(36px,4.6vw,60px)] font-extrabold leading-[1.02] tracking-[-0.04em] text-white">
                The syllabus
                <br />
                is the map.
              </h2>
              <div className="mt-8">
                {featured.units.map((item, index) => {
                  const current = (featured.units[activeUnit] || featured.units[0])?.slug === item.slug;
                  return (
                    <button
                      key={item.slug}
                      type="button"
                      onClick={() => setActiveUnit(index)}
                      className="flex w-full items-center gap-3 border-b border-white/16 py-[22px] text-left"
                    >
                      <span className="w-7 font-[family-name:var(--font-display)] text-[15px] font-bold text-[var(--cyan)]">
                        {String(item.unitNumber || index + 1).padStart(2, "0")}
                      </span>
                      <span className="min-w-0 flex-1 font-[family-name:var(--font-display)] text-[24px] font-bold tracking-[-0.02em] text-white">
                        {item.title}
                      </span>
                      {current ? <ArrowRight size={18} className="text-[var(--cyan)]" /> : null}
                    </button>
                  );
                })}
              </div>
            </div>

            {unit ? (
              <div className="flex min-w-[min(100%,400px)] flex-[1_1_400px] items-end">
                <div className="w-full rounded-[32px] bg-[var(--cloud)] p-8">
                  <p className="text-[13px] font-semibold uppercase tracking-[.12em] text-[var(--blue)]">
                    Unit {String(unit.unitNumber || 1).padStart(2, "0")}
                  </p>
                  <h3 className="mt-2 font-[family-name:var(--font-display)] text-[26px] font-extrabold tracking-[-0.03em] text-[var(--navy)]">
                    {unit.title}
                  </h3>
                  <div className="mt-5 flex flex-wrap gap-2.5">
                    {(unit.topics || []).map((topic, index) => (
                      <TopicChip
                        key={topic}
                        to={searchPath(topic, { code: featured.code, scheme: featured.scheme, unit: unit.title })}
                        onClick={() => saveRecentSearch(topic)}
                        highlighted={index === 0}
                      >
                        {topic}
                      </TopicChip>
                    ))}
                  </div>
                  <hr className="my-6 border-[var(--line)]" />
                  <p className="text-[15px] text-[var(--slate-2)]">
                    Tap a topic and search opens with your university, subject and unit already set.
                  </p>
                </div>
              </div>
            ) : null}
          </div>
        </section>
      ) : null}

      {pair.length > 1 ? (
        <section className="px-0 py-28">
          <p className="text-[13px] font-semibold uppercase tracking-[.12em] text-[var(--blue)]">Curriculum clarity</p>
          <h2 className="mt-3 max-w-[16ch] font-[family-name:var(--font-display)] text-[clamp(36px,4.6vw,60px)] font-extrabold leading-[1.02] tracking-[-0.04em] text-[var(--navy)]">
            Same name. Different syllabus.
          </h2>
          <p className="mt-5 max-w-[560px] text-[19px] leading-relaxed text-[var(--slate-2)]">
            {pair[0].name} is taught under two codes with two sets of topics. Medha keeps them apart, so you only ever study what your exam covers.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-5">
            <CompareCard subject={pair.find((item) => item.scheme === "rtu") || pair[0]} />
            <span
              className="grid h-14 w-14 place-items-center rounded-full bg-[#111] font-[family-name:var(--font-display)] text-[22px] font-extrabold text-[var(--cyan-soft)]"
              aria-label="is not the same as"
            >
              ≠
            </span>
            <CompareCard subject={pair.find((item) => item.scheme === "arya") || pair[1]} navy />
          </div>
        </section>
      ) : null}

      <section className="border-t border-[var(--line)] py-16">
        <h2 className="font-[family-name:var(--font-display)] text-[clamp(36px,4.6vw,60px)] font-extrabold leading-[1.02] tracking-[-0.04em] text-[var(--navy)]">
          Less switching.
          <br />
          <span className="text-[#5A5A5A]">More studying.</span>
        </h2>
        <Link
          to="/subjects"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#111] px-7 py-[18px] text-[16px] font-semibold text-white no-underline"
        >
          Open my syllabus
          <ArrowRight size={18} className="text-[var(--cyan)]" />
        </Link>
        <p className="mt-6 text-[14px] text-[var(--muted)]">
          {user?.name ? `Signed in as ${user.name}.` : "Medha Revision · syllabus-first study search"}
        </p>
      </section>
    </div>
  );
}

function CompareCard({ subject, navy = false }) {
  if (!subject) return null;
  return (
    <Link
      to={`/subjects/${subject.slug}`}
      className={`min-w-[240px] flex-1 rounded-[28px] p-8 no-underline ${
        navy ? "bg-[var(--navy)] text-white" : "border border-[var(--line)] bg-white"
      }`}
    >
      <div className="flex flex-wrap gap-2">
        <CodeChip code={subject.code} onNavy={navy} />
      </div>
      <h3 className={`mt-5 font-[family-name:var(--font-display)] text-[22px] font-extrabold tracking-[-0.03em] ${navy ? "text-white" : "text-[var(--navy)]"}`}>
        {subject.name}
      </h3>
      <p className={`mt-3 text-[15px] ${navy ? "text-[var(--on-navy-2)]" : "text-[var(--slate-2)]"}`}>
        {subject.unitCount} units / {subject.topicCount} topics
      </p>
    </Link>
  );
}
