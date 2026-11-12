import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Download, Eye } from "lucide-react";
import RevisionShell from "../components/Revision/RevisionShell";
import DeskFilterSelect from "../components/Revision/DeskFilterSelect";
import InAppPdfViewer from "../components/Common/InAppPdfViewer";
import { openPastPaperPdfBlob } from "../lib/pdfDelivery";
import { trackPaperOpened } from "../lib/studyActivity";
import { apiUrl } from "../config/api";
import { usePageSeo } from "../hooks/usePageSeo";
import { learningResourceJsonLd } from "../lib/seo";

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
  const yearFilter = params.get("year") || "";

  const [meta, setMeta] = useState(null);
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activePDF, setActivePDF] = useState(null);
  const [openingId, setOpeningId] = useState(null);
  const [viewError, setViewError] = useState("");
  const deepLinkedPaperRef = useRef(null);

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
    { id: "IT", label: "IT" },
    { id: "ECE", label: "ECE" },
    { id: "EE", label: "EE" },
  ];

  const seoPath = useMemo(() => {
    const q = new URLSearchParams();
    q.set("branch", branch);
    q.set("sem", String(semester));
    if (subjectFilter) q.set("subject", subjectFilter);
    if (yearFilter) q.set("year", yearFilter);
    return `/past-papers?${q.toString()}`;
  }, [branch, semester, subjectFilter, yearFilter]);

  const seoTitle = useMemo(() => {
    const bits = [
      subjectFilter || null,
      yearFilter ? `${yearFilter}` : null,
      `RTU ${branch}`,
      `Sem ${semester}`,
      "Previous Year Paper",
    ].filter(Boolean);
    return bits.join(" · ");
  }, [branch, semester, subjectFilter, yearFilter]);

  const seoDescription = useMemo(() => {
    if (subjectFilter && yearFilter) {
      return `Download and view the RTU ${branch} ${subjectFilter} previous year question paper for ${yearFilter} (Semester ${semester}) on Medha Revision.`;
    }
    if (subjectFilter) {
      return `RTU ${branch} ${subjectFilter} previous year question papers for Semester ${semester} — view hosted PYQs on Medha Revision.`;
    }
    return `RTU ${branch} previous year question papers for Semester ${semester}. Browse subject-wise PYQs from the last five years on Medha Revision.`;
  }, [branch, semester, subjectFilter, yearFilter]);

  usePageSeo({
    title: seoTitle,
    description: seoDescription,
    path: seoPath,
    jsonLd: learningResourceJsonLd({
      name: seoTitle,
      description: seoDescription,
      path: seoPath,
      about: [subjectFilter || "RTU past papers", branch, `Semester ${semester}`, yearFilter].filter(Boolean),
    }),
  });

  useEffect(() => {
    if (!yearFilter) return;
    const el = document.querySelector(`[data-paper-year="${CSS.escape(String(yearFilter))}"]`);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [yearFilter, subjects, loading]);

  const openPaperViewer = useCallback(
    async (paper, { syncUrl = true } = {}) => {
      if (!paper?.id) return;
      setOpeningId(paper.id);
      setViewError("");
      try {
        const data = await openPastPaperPdfBlob(paper.id);
        const sharePath = `/past-papers?branch=${encodeURIComponent(
          paper.branch || branch
        )}&sem=${paper.semester || semester}&subject=${encodeURIComponent(
          paper.subjectName || ""
        )}&year=${encodeURIComponent(paper.year || "")}&paper=${paper.id}`;
        trackPaperOpened(paper, sharePath);
        setActivePDF({
          pdfUrl: data.fileUrl,
          title: `${paper.subjectName} · ${paper.year}`,
          revoke: data.revoke,
          sharePath,
        });
        if (syncUrl) {
          updateParams(params, setParams, {
            branch: paper.branch || branch,
            sem: paper.semester || semester,
            subject: paper.subjectName || subjectFilter || "",
            year: paper.year || yearFilter || "",
            paper: paper.id,
          });
        }
      } catch (err) {
        setViewError(err.message || "Could not open paper");
      } finally {
        setOpeningId(null);
      }
    },
    [branch, semester, subjectFilter, params, setParams]
  );

  // Deep-link: /past-papers?paper=<id> opens that PDF in the viewer
  useEffect(() => {
    const paperId = params.get("paper");
    if (!paperId || loading) return;
    if (deepLinkedPaperRef.current === paperId) return;
    deepLinkedPaperRef.current = paperId;
    const match = papers.find((p) => String(p.id) === String(paperId));
    if (match) {
      openPaperViewer(match, { syncUrl: false });
      return;
    }
    // Paper may be outside current semester filter — still open by id
    (async () => {
      try {
        const data = await openPastPaperPdfBlob(paperId);
        const sharePath = `/past-papers?paper=${paperId}`;
        trackPaperOpened({ id: paperId, subjectName: "Past paper" }, sharePath);
        setActivePDF({
          pdfUrl: data.fileUrl,
          title: "Past paper",
          revoke: data.revoke,
          sharePath,
        });
      } catch {
        deepLinkedPaperRef.current = null;
      }
    })();
  }, [params, papers, loading, openPaperViewer]);

  return (
    <RevisionShell title="Past papers" desk showBack>
      <div className="desk-page">
        <header className="mb-4">
          <p className="desk-eyebrow">RTU archive</p>
          <h1 className="desk-title">Past papers</h1>
          <p className="desk-sub">
            CSE, AI / AIDS, IT, ECE, and EE · semesters 1–8 · last five years.
            View hosted PDFs in Medha; empty slots show Soon until we seed them.
          </p>
        </header>

        <div className="desk-panel mb-4">
          <div className="desk-filter-grid">
            <DeskFilterSelect
              label="Branch"
              value={branch}
              onValueChange={(v) =>
                updateParams(params, setParams, { branch: v, subject: "" })
              }
              options={branches.map((b) => ({ value: b.id, label: b.label }))}
            />
            <DeskFilterSelect
              label="Semester"
              value={String(semester)}
              onValueChange={(v) =>
                updateParams(params, setParams, { sem: v, subject: "" })
              }
              options={Array.from({ length: 8 }, (_, i) => i + 1).map((sem) => {
                const count =
                  meta?.semesters?.find((s) => s.semester === sem)?.paperCount || 0;
                return {
                  value: String(sem),
                  label: `Semester ${sem}`,
                  meta: count
                    ? `${count} ${count === 1 ? "paper" : "papers"}`
                    : undefined,
                };
              })}
            />
          </div>
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

        {viewError ? (
          <p className="mt-3 text-[13px] font-medium text-[#b91c1c]">{viewError}</p>
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
                        const downloadHref = apiUrl(
                          `/api/past-papers/${paper.id}/file?attachment=1`
                        );
                        const isOpening = openingId === paper.id;
                        const yearActive = String(yearFilter) === String(year);
                        return (
                          <div
                            key={year}
                            data-paper-year={year}
                            className={`flex min-h-12 items-center gap-2 rounded-xl border px-3 py-2 ${
                              yearActive
                                ? "border-[#111] bg-white shadow-[0_0_0_2px_rgba(17,17,17,0.08)]"
                                : "border-[#e8e8e8] bg-[#f7f7f4]"
                            }`}
                          >
                            <span className="min-w-[3rem] text-[13px] font-semibold text-[#111]">
                              {year}
                            </span>
                            <div className="ml-auto flex items-center gap-1.5">
                              <button
                                type="button"
                                className="inline-flex min-h-9 items-center gap-1.5 rounded-full bg-[#111] px-3 text-[12px] font-semibold text-white disabled:opacity-60"
                                disabled={isOpening}
                                onClick={() => openPaperViewer(paper)}
                              >
                                <Eye size={14} aria-hidden="true" />
                                {isOpening ? "Opening…" : "View paper"}
                              </button>
                              <a
                                className="inline-flex min-h-9 items-center gap-1.5 rounded-full border border-[#111] bg-white px-3 text-[12px] font-semibold text-[#111] no-underline"
                                href={downloadHref}
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
                          data-paper-year={year}
                          className={`flex min-h-12 items-center justify-between gap-2 rounded-xl border border-dashed px-3 py-2 text-[13px] font-semibold text-[#9a9a9a] ${
                            String(yearFilter) === String(year)
                              ? "border-[#111] bg-white"
                              : "border-[#e0e0e0]"
                          }`}
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

      <InAppPdfViewer
        isOpen={!!activePDF}
        onClose={() => {
          activePDF?.revoke?.();
          setActivePDF(null);
          deepLinkedPaperRef.current = null;
          updateParams(params, setParams, { paper: "" });
        }}
        pdfUrl={activePDF?.pdfUrl}
        title={activePDF?.title}
        revokeOnClose={activePDF?.revoke}
        sharePath={activePDF?.sharePath}
        shareTitle={activePDF?.title}
      />
    </RevisionShell>
  );
}
