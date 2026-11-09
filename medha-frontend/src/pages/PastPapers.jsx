import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Download, Eye } from "lucide-react";
import RevisionShell from "../components/Revision/RevisionShell";
import { apiUrl } from "../config/api";

function updateParams(params, setParams, patch) {
  const next = new URLSearchParams(params);
  Object.entries(patch).forEach(([key, value]) => {
    if (value === "" || value == null) next.delete(key);
    else next.set(key, String(value));
  });
  setParams(next, { replace: true });
}

function paperKey(subjectName, year, examType = "main") {
  return `${subjectName}::${year}::${examType}`;
}

export default function PastPapers() {
  const [params, setParams] = useSearchParams();
  const branch = (params.get("branch") || "CSE").toUpperCase();
  const semester = Number(params.get("sem") || 3);
  const subjectFilter = params.get("subject") || "";

  const [meta, setMeta] = useState(null);
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [metaRes, listRes] = await Promise.all([
        fetch(apiUrl(`/api/past-papers/meta?branch=${encodeURIComponent(branch)}`)),
        fetch(
          apiUrl(
            `/api/past-papers?branch=${encodeURIComponent(branch)}&semester=${semester}`
          )
        ),
      ]);
      const metaJson = await metaRes.json();
      const listJson = await listRes.json();
      if (!metaRes.ok || !metaJson.success) {
        throw new Error(metaJson.message || "Failed to load catalog");
      }
      if (!listRes.ok || !listJson.success) {
        throw new Error(listJson.message || "Failed to load papers");
      }
      setMeta(metaJson);
      setPapers(listJson.papers || []);
    } catch (err) {
      setError(err.message || "Network error");
      setMeta(null);
      setPapers([]);
    } finally {
      setLoading(false);
    }
  }, [branch, semester]);

  useEffect(() => {
    load();
  }, [load]);

  const paperMap = useMemo(() => {
    const map = new Map();
    for (const paper of papers) {
      map.set(paperKey(paper.subjectName, paper.year, paper.examType), paper);
    }
    return map;
  }, [papers]);

  const semesterMeta = useMemo(() => {
    const list = meta?.semesters || [];
    return list.find((s) => s.semester === semester) || null;
  }, [meta, semester]);

  const subjects = useMemo(() => {
    const list = semesterMeta?.subjects || [];
    if (!subjectFilter) return list;
    return list.filter((s) => s.subjectName === subjectFilter);
  }, [semesterMeta, subjectFilter]);

  const targetYears = meta?.targetYears || [];
  const branches = meta?.branches || [
    { id: "CSE", label: "CSE" },
    { id: "AIDS", label: "AI / AIDS" },
  ];

  return (
    <RevisionShell title="Past papers" desk showBack>
      <div className="desk-page">
        <header className="mb-4">
          <p className="desk-eyebrow">RTU archive</p>
          <h1 className="desk-title">Past papers</h1>
          <p className="desk-sub">
            CSE and AI / AIDS · semesters 1–8 · last five years. Download hosted
            PDFs when available; empty slots show Soon until we seed them.
          </p>
        </header>

        <div className="desk-tabs" role="tablist" aria-label="Branch">
          {branches.map((b) => {
            const active = branch === b.id;
            return (
              <button
                key={b.id}
                type="button"
                role="tab"
                aria-pressed={active}
                className={`desk-tab${active ? " is-on" : ""}`}
                onClick={() =>
                  updateParams(params, setParams, {
                    branch: b.id,
                    subject: "",
                  })
                }
              >
                {b.label}
              </button>
            );
          })}
        </div>

        <div className="desk-tabs mt-3" role="tablist" aria-label="Semester">
          {Array.from({ length: 8 }, (_, i) => i + 1).map((sem) => {
            const active = semester === sem;
            const count =
              meta?.semesters?.find((s) => s.semester === sem)?.paperCount || 0;
            return (
              <button
                key={sem}
                type="button"
                role="tab"
                aria-pressed={active}
                className={`desk-tab${active ? " is-on" : ""}`}
                onClick={() =>
                  updateParams(params, setParams, {
                    sem,
                    subject: "",
                  })
                }
              >
                Sem {sem}
                {count ? (
                  <span className="ml-1 text-[11px] opacity-70">{count}</span>
                ) : null}
              </button>
            );
          })}
        </div>

        {subjectFilter ? (
          <button
            type="button"
            className="mt-3 text-[13px] font-semibold text-[#2563EB]"
            onClick={() => updateParams(params, setParams, { subject: "" })}
          >
            ← All subjects in Sem {semester}
          </button>
        ) : null}

        {loading ? (
          <p className="mt-6 text-[14px] text-[#6b6b6b]">Loading archive…</p>
        ) : null}

        {error ? (
          <div className="desk-panel mt-4">
            <p className="m-0 text-[14px] text-[#b91c1c]">{error}</p>
            <p className="mt-2 mb-0 text-[13px] text-[#6b6b6b]">
              Start the API locally, or check{" "}
              <code className="text-[12px]">VITE_BACKEND_URL</code>. The browse
              shell still works once the backend is up — papers appear after you
              seed PDFs.
            </p>
            <button
              type="button"
              className="desk-tab is-on mt-3"
              onClick={load}
            >
              Retry
            </button>
          </div>
        ) : null}

        {!loading && !error && subjects.length === 0 ? (
          <div className="desk-panel mt-4">
            <h2 className="m-0 text-[16px] font-bold">Coming soon</h2>
            <p className="mt-2 mb-0 text-[14px] text-[#5a5a5a]">
              No subject map for this semester yet. Seed papers or expand{" "}
              <code className="text-[12px]">pastPaperCatalog</code>.
            </p>
          </div>
        ) : null}

        {!loading && !error
          ? subjects.map((subject) => (
              <section key={subject.slug || subject.subjectName} className="desk-panel mt-4">
                <div className="desk-panel-head">
                  <div>
                    <h2>{subject.subjectName}</h2>
                    {subject.subjectCode ? (
                      <p className="m-0 mt-1 text-[12px] font-semibold text-[#6b6b6b]">
                        {subject.subjectCode}
                      </p>
                    ) : null}
                  </div>
                  <span className="text-[13px] font-semibold text-[#6b6b6b]">
                    {subject.paperCount || 0} hosted
                  </span>
                </div>

                {!subjectFilter ? (
                  <button
                    type="button"
                    className="mb-3 text-[12px] font-semibold text-[#2563EB]"
                    onClick={() =>
                      updateParams(params, setParams, {
                        subject: subject.subjectName,
                      })
                    }
                  >
                    Focus subject
                  </button>
                ) : null}

                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  {Array.from(
                    new Set([
                      ...(subject.availableYears || []),
                      ...targetYears,
                      ...papers
                        .filter((p) => p.subjectName === subject.subjectName)
                        .map((p) => p.year),
                    ])
                  )
                    .sort((a, b) => b - a)
                    .map((year) => {
                      const paper = paperMap.get(
                        paperKey(subject.subjectName, year, "main")
                      );
                      if (paper?.fileUrl || paper?.id) {
                        const viewHref = apiUrl(
                          `/api/past-papers/${paper.id}/download`
                        );
                        const downloadHref = apiUrl(
                          `/api/past-papers/${paper.id}/download?attachment=1`
                        );
                        return (
                          <div
                            key={year}
                            className="flex min-h-12 items-center gap-2 rounded-xl border border-[#e8e8e8] bg-[#f7f7f4] px-3 py-2"
                          >
                            <span className="min-w-[3rem] text-[13px] font-semibold text-[#111]">
                              {year}
                            </span>
                            <div className="ml-auto flex items-center gap-1.5">
                              <a
                                className="inline-flex min-h-9 items-center gap-1.5 rounded-full bg-[#111] px-3 text-[12px] font-semibold text-white no-underline"
                                href={viewHref}
                                target="_blank"
                                rel="noreferrer"
                              >
                                <Eye size={14} aria-hidden="true" />
                                View
                              </a>
                              <a
                                className="inline-flex min-h-9 items-center gap-1.5 rounded-full border border-[#111] bg-white px-3 text-[12px] font-semibold text-[#111] no-underline"
                                href={downloadHref}
                                target="_blank"
                                rel="noreferrer"
                              >
                                <Download size={14} aria-hidden="true" />
                                Download
                              </a>
                            </div>
                          </div>
                        );
                      }
                      return (
                        <div
                          key={year}
                          className="flex min-h-12 items-center justify-between gap-2 rounded-xl border border-dashed border-[#e0e0e0] px-3 py-2 text-[13px] font-semibold text-[#9a9a9a]"
                          title="Paper not seeded yet"
                        >
                          <span>{year}</span>
                          <span className="text-[11px] uppercase tracking-wide">Soon</span>
                        </div>
                      );
                    })}
                </div>
              </section>
            ))
          : null}

        <p className="mt-6 text-[12px] leading-relaxed text-[#8a8a8a]">
          Source attribution: Rajasthan Technical University (RTU). Medha hosts
          cleaned copies for revision; original authorship remains with RTU.{" "}
          <Link to="/subjects" className="font-semibold text-[#2563EB]">
            Browse subjects
          </Link>
        </p>
      </div>
    </RevisionShell>
  );
}
