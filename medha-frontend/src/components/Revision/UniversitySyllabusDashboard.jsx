import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen, GraduationCap, Search, Sparkles, University } from "lucide-react";
import SearchBar from "./SearchBar";
import { getRecentSearches, saveRecentSearch, tagsForText } from "../../data/subjectCatalog";
import { SchemeTags } from "./SchemeTag";
import { ARYA_SEM3_STATS, ARYA_SEM3_SUBJECTS } from "../../data/aryaSem3Syllabus";
import { RTU_SEM5_STATS, RTU_SEM5_SUBJECTS } from "../../data/rtuSem5Syllabus";

const RTU = "Rajasthan Technical University, Kota";
const ARYA = "Rajasthan Technical University, Kota (Arya Autonomous)";

const SCHEMES = {
  [RTU]: {
    kicker: "RTU • CSE • Semester V",
    subtitle: "III Year • V Semester • B.Tech. Computer Science and Engineering",
    statLabel: "semester V papers",
    subjects: RTU_SEM5_SUBJECTS,
    stats: RTU_SEM5_STATS,
    storageKey: "medha-rtu-sem5-subject",
    scheme: "rtu",
  },
  [ARYA]: {
    kicker: "RTU • Arya Autonomous • Semester III",
    subtitle: "II Year • III Semester • B.Tech. Computer Science and Engineering",
    statLabel: "semester III papers",
    subjects: ARYA_SEM3_SUBJECTS,
    stats: ARYA_SEM3_STATS,
    storageKey: "medha-arya-sem3-subject",
    scheme: "arya",
  },
};

const UNIT_TONES = [
  { badge: "bg-emerald-100 text-emerald-800", bar: "from-emerald-400 to-teal-400", card: "border-emerald-100 hover:border-emerald-200" },
  { badge: "bg-violet-100 text-violet-800", bar: "from-violet-400 to-fuchsia-400", card: "border-violet-100 hover:border-violet-200" },
  { badge: "bg-sky-100 text-sky-800", bar: "from-sky-400 to-cyan-400", card: "border-sky-100 hover:border-sky-200" },
  { badge: "bg-amber-100 text-amber-800", bar: "from-amber-400 to-orange-400", card: "border-amber-100 hover:border-amber-200" },
  { badge: "bg-rose-100 text-rose-800", bar: "from-rose-400 to-pink-400", card: "border-rose-100 hover:border-rose-200" },
  { badge: "bg-indigo-100 text-indigo-800", bar: "from-indigo-400 to-blue-400", card: "border-indigo-100 hover:border-indigo-200" },
];

export default function UniversitySyllabusDashboard({ user }) {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [university, setUniversity] = useState(() => localStorage.getItem("medha-university") || "");
  const [other, setOther] = useState(() => localStorage.getItem("medha-custom-university") || "");
  const [showError, setShowError] = useState(false);
  const [subjectCode, setSubjectCode] = useState("");
  const recents = getRecentSearches().slice(0, 8);
  const name = university === "Other" ? other.trim() : university;
  const scheme = SCHEMES[university];
  const selected = scheme?.subjects.find((s) => s.code === subjectCode) || scheme?.subjects[0];

  useEffect(() => {
    if (university) {
      localStorage.setItem("medha-university", university);
      localStorage.setItem("medha-custom-university", other);
    }
  }, [university, other]);
  useEffect(() => {
    if (!scheme) return;
    const stored = localStorage.getItem(scheme.storageKey);
    const next = scheme.subjects.some((s) => s.code === stored) ? stored : scheme.subjects[0].code;
    setSubjectCode(next);
  }, [university, scheme]);
  useEffect(() => {
    if (scheme && selected) localStorage.setItem(scheme.storageKey, selected.code);
  }, [scheme, selected]);

  const search = (text = query) => {
    if (!name) {
      setShowError(true);
      document.getElementById("medha-university")?.focus();
      return;
    }
    const term = String(text || "").trim();
    if (!term) {
      navigate("/search");
      return;
    }
    const fullQuery = term + " " + name;
    saveRecentSearch(fullQuery);
    navigate("/search?q=" + encodeURIComponent(fullQuery));
  };

  const topic = (t, u) => {
    setQuery(t);
    search(t + " | " + u);
  };

  return (
    <div className="space-y-6 pb-6 lg:space-y-8">
      <section className="relative overflow-hidden rounded-3xl border border-white/80 bg-[linear-gradient(135deg,#86e3a8_0%,#c4b5fd_48%,#7dd3fc_100%)] px-5 py-6 shadow-[0_24px_60px_-36px_rgba(47,143,76,0.45)] sm:px-8 sm:py-8">
        <div className="pointer-events-none absolute inset-0 bg-white/35" />
        <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-violet-300/40 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 left-24 h-40 w-40 rounded-full bg-emerald-300/40 blur-3xl" />
        <div className="relative grid gap-6 lg:grid-cols-[1.2fr_.8fr] lg:items-end">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1 text-[11px] font-bold uppercase tracking-[.16em] text-emerald-700">
              <GraduationCap size={15} /> Your syllabus, organised
            </div>
            <p className="text-[14px] font-medium text-slate-600">
              {user?.name ? "Welcome back, " + user.name.split(" ")[0] + "." : "Your university syllabus, one topic at a time."}
            </p>
            <h1 className="mt-2 max-w-2xl font-[Manrope,sans-serif] text-[32px] font-bold leading-[1.12] tracking-[-.045em] text-slate-900 sm:text-[42px]">
              Find exactly what you need to study.
            </h1>
            <p className="mt-3 max-w-2xl text-[15px] leading-7 text-slate-600">
              Choose your university, then tap any unit or topic to search matching notes and learning resources.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-2xl bg-white/75 px-4 py-3 shadow-sm">
              <p className="text-[11px] font-semibold uppercase tracking-[.12em] text-emerald-700">Subjects</p>
              <p className="mt-1 text-2xl font-bold text-slate-900">{scheme ? scheme.stats.subjects : "—"}</p>
              <p className="text-xs text-slate-500">{scheme ? scheme.statLabel : "choose university"}</p>
            </div>
            <div className="rounded-2xl bg-white/75 px-4 py-3 shadow-sm">
              <p className="text-[11px] font-semibold uppercase tracking-[.12em] text-sky-700">Units</p>
              <p className="mt-1 text-2xl font-bold text-slate-900">{scheme ? scheme.stats.units : "—"}</p>
              <p className="text-xs text-slate-500">mapped from syllabus</p>
            </div>
            <div className="rounded-2xl bg-white/75 px-4 py-3 shadow-sm">
              <p className="text-[11px] font-semibold uppercase tracking-[.12em] text-violet-700">Topics</p>
              <p className="mt-1 text-2xl font-bold text-slate-900">{scheme ? scheme.stats.topics : "—"}</p>
              <p className="text-xs text-slate-500">ready to search</p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-3xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-5 shadow-[0_16px_40px_-28px_rgba(47,143,76,0.55)] sm:p-6">
          <label htmlFor="medha-university" className="mb-3 flex items-center gap-2 text-[13px] font-semibold text-slate-900">
            <span className="grid h-8 w-8 place-items-center rounded-xl bg-emerald-50 text-emerald-700">
              <University size={16} />
            </span>
            University <span className="text-red-500">*</span>
          </label>
          <select
            id="medha-university"
            required
            value={university}
            onChange={(e) => {
              setUniversity(e.target.value);
              setShowError(false);
            }}
            className="w-full rounded-2xl border border-emerald-100 bg-emerald-50/40 px-3 py-3 text-sm text-slate-900 outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
          >
            <option value="">Select your university (required)</option>
            <option value={RTU}>Rajasthan Technical University, Kota (RTU)</option>
            <option value={ARYA}>RTU — Arya Autonomous (II Year / III Sem)</option>
            <option value="Other">Other university</option>
          </select>
          {university === "Other" && (
            <input
              required
              value={other}
              onChange={(e) => setOther(e.target.value)}
              placeholder="Enter your university name"
              className="mt-3 w-full rounded-2xl border border-emerald-100 px-3 py-3 text-sm outline-none focus:border-emerald-400"
            />
          )}
          {showError && <p className="mt-2 text-xs font-medium text-red-700">Select or enter your university before searching.</p>}
          {name && (
            <p className="mt-3 text-xs text-slate-500">
              Searches include <strong className="text-slate-800">{name}</strong>.
            </p>
          )}
        </div>

        <div className="rounded-3xl border border-violet-200 bg-gradient-to-br from-violet-50 to-white p-5 shadow-[0_16px_40px_-28px_rgba(124,58,237,0.4)] sm:p-6">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[.14em] text-violet-600">Search resources</p>
              <h2 className="mt-1 text-[17px] font-bold text-slate-900">Search any topic</h2>
            </div>
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-violet-50 text-violet-600">
              <Search size={18} />
            </span>
          </div>
          <SearchBar
            value={query}
            onChange={setQuery}
            onSubmit={search}
            placeholder="e.g. Master theorem, Quick Sort…"
            variant="filled"
          />
        </div>
      </section>

      {recents.length > 0 && (
        <section className="rounded-3xl border border-sky-100 bg-white/80 p-5 sm:p-6">
          <div className="mb-3 flex items-center gap-2 text-slate-900">
            <Sparkles size={16} className="text-sky-500" />
            <h2 className="text-[15px] font-bold">Recently searched</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {recents.map((x) => (
              <button
                key={x}
                onClick={() => search(x)}
                className="rounded-full border border-sky-100 bg-sky-50 px-3 py-2 text-left text-xs font-medium text-sky-800 hover:bg-sky-100"
              >
                <span className="mb-1 block">
                  <SchemeTags tags={tagsForText(x, scheme?.scheme, name)} />
                </span>
                {x}
              </button>
            ))}
          </div>
        </section>
      )}

      <section className="overflow-hidden rounded-3xl border border-white bg-white/90 shadow-[0_20px_50px_-36px_rgba(15,23,42,0.35)]">
        <div className="border-b border-slate-100 bg-[linear-gradient(90deg,#ECFDF3,#F5F3FF)] p-5 sm:p-6">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-white text-emerald-700 shadow-sm">
              <BookOpen size={19} />
            </div>
            <div>
              <div className="mb-1.5">
                <SchemeTags tags={scheme ? tagsForText(selected?.name || scheme.kicker, scheme.scheme, name) : name ? tagsForText(name, null, name) : []} />
              </div>
              <p className="text-[10px] font-bold uppercase tracking-[.16em] text-emerald-700">
                {scheme ? scheme.kicker : name ? "University syllabus" : "Choose university first"}
              </p>
              <h2 className="mt-1 text-[18px] font-bold text-slate-900">
                {scheme && selected
                  ? /\d/.test(selected.code)
                    ? selected.code + ": " + selected.name
                    : selected.name
                  : name
                    ? "Syllabus for " + name
                    : "University-wise syllabus"}
              </h2>
              {scheme && <p className="mt-1 text-xs text-slate-500">{scheme.subtitle}</p>}
            </div>
          </div>
        </div>

        {!name ? (
          <div className="p-10 text-center text-sm text-slate-500">Select your university to view its syllabus.</div>
        ) : scheme && selected ? (
          <>
            <div className="grid gap-3 border-b border-slate-100 bg-slate-50/70 p-4 sm:grid-cols-2 sm:p-5 lg:grid-cols-3">
              {scheme.subjects.map((subject, i) => {
                const tone = UNIT_TONES[i % UNIT_TONES.length];
                const active = subject.code === selected.code;
                return (
                  <button
                    key={subject.code}
                    type="button"
                    onClick={() => setSubjectCode(subject.code)}
                    className={`rounded-2xl border px-4 py-3 text-left transition ${
                      active ? "border-emerald-300 bg-white shadow-sm ring-2 ring-emerald-100" : "border-transparent bg-white/70 hover:border-slate-200 hover:bg-white"
                    }`}
                  >
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold ${tone.badge}`}>
                        {/\d/.test(subject.code) ? subject.code : subject.short}
                      </span>
                      <SchemeTags tags={tagsForText(subject.name, scheme.scheme, name)} />
                    </div>
                    <p className="mt-2 text-sm font-bold text-slate-900">{subject.name}</p>
                    <p className="mt-1 text-[11px] text-slate-500">
                      {subject.units.length} units · {subject.units.reduce((n, u) => n + u.topics.length, 0)} topics
                    </p>
                  </button>
                );
              })}
            </div>
            <div className="grid gap-4 p-4 sm:p-6 lg:grid-cols-2">
              {selected.units.map((u) => {
                const tone = UNIT_TONES[(u.unitNumber - 1) % UNIT_TONES.length];
                return (
                  <article key={selected.code + u.unitNumber} className={`overflow-hidden rounded-2xl border bg-white p-4 transition ${tone.card}`}>
                    <div className={`mb-3 h-1.5 w-16 rounded-full bg-gradient-to-r ${tone.bar}`} />
                    <div className="flex gap-3">
                      <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl text-xs font-bold ${tone.badge}`}>
                        {String(u.unitNumber).padStart(2, "0")}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="mb-1.5">
                          <SchemeTags tags={tagsForText(u.title, scheme.scheme, name)} />
                        </div>
                        <button
                          onClick={() => topic(u.title, selected.name + " | " + u.title)}
                          className="text-left text-sm font-bold leading-5 text-slate-900 hover:text-emerald-700 hover:underline"
                        >
                          {u.title}
                        </button>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {u.topics.map((t) => (
                            <button
                              key={t}
                              onClick={() => topic(t, selected.name + " | " + u.title)}
                              className="rounded-lg border border-slate-100 bg-slate-50 px-2.5 py-1.5 text-left text-[12px] leading-5 text-slate-600 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-800"
                            >
                              <span className="mb-1 block">
                                <SchemeTags tags={tagsForText(t, scheme.scheme, name)} />
                              </span>
                              {t}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </>
        ) : (
          <div className="p-6">
            <p className="text-sm font-semibold text-slate-800">We need the official syllabus for {name} to show the correct units.</p>
            <p className="mt-2 text-[13px] leading-6 text-slate-500">
              We won't display RTU topics as if they belong to another university. You can search for its official syllabus while its
              unit-by-unit content is added.
            </p>
            <button
              onClick={() => search("official syllabus " + name)}
              className="mt-4 rounded-full bg-emerald-700 px-4 py-2.5 text-xs font-bold text-white hover:bg-emerald-800"
            >
              Search this university's syllabus ↗
            </button>
          </div>
        )}
      </section>

      <p className="px-1 text-[11px] leading-5 text-slate-400">
        Content-only syllabus view. No hours or marks columns. Verify the current official syllabus before exam preparation.
      </p>
    </div>
  );
}
