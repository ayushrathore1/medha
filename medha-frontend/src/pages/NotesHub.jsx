import React, { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Download, Eye, Plus, Share2 } from "lucide-react";
import { AuthContext } from "../AuthContext";
import RevisionShell from "../components/Revision/RevisionShell";
import SearchBar from "../components/Revision/SearchBar";
import NotesUploadPanel from "../components/Notes/NotesUploadPanel";
import { formatDate, loginPath } from "../components/Revision/revisionUtils";
import { requestNoteDownload } from "../components/Revision/noteDownload";
import InAppPdfViewer from "../components/Common/InAppPdfViewer";
import DeskFilterSelect from "../components/Revision/DeskFilterSelect";
import { SUBJECTS } from "../data/subjectCatalog";
import { findCatalogSubject, subjectMatchesBranch } from "../data/branchScope";
import { trackNoteOpened } from "../lib/studyActivity";
import { useMergedSubjects } from "../hooks/useMergedSubjects";
import { API_BASE } from "../config/api";
import api from "../api/api";
import "./DashboardHome.css";

/**
 * Notes hub IA
 * ------------
 * Route: /notes  (tab label "Notes"; /upload and /uploads redirect here)
 *
 * Scope
 *   campus → approved public notes (browse without auth)
 *   mine   → current user's uploads (auth)
 *
 * Facets (URL-synced)
 *   branch · sem · subject · type · q · panel=upload
 *
 * Actions
 *   Open → /note/:id desk preview
 *   View → signed download + in-app PDF viewer
 *   Upload → NotesUploadPanel composer
 */

const BRANCHES = [
  { id: "all", label: "All branches" },
  { id: "CSE", label: "CSE" },
  { id: "AIDS", label: "AI / AIDS" },
  { id: "IT", label: "IT" },
  { id: "ECE", label: "ECE" },
];

const SEMESTERS = ["all", "1", "2", "3", "4", "5", "6", "7", "8"];

const TYPES = [
  { id: "all", label: "All types" },
  { id: "pyq", label: "PYQ" },
  { id: "handwritten", label: "Handwritten" },
  { id: "typed", label: "Typed" },
  { id: "diagrams", label: "Diagrams" },
];

function updateParams(params, setParams, patch) {
  const next = new URLSearchParams(params);
  Object.entries(patch).forEach(([key, value]) => {
    if (value === "" || value == null || value === "all") next.delete(key);
    else next.set(key, String(value));
  });
  setParams(next, { replace: true });
}

function noteSubject(note) {
  if (note.subjectTag) return note.subjectTag;
  if (typeof note.subject === "object" && note.subject?.name) return note.subject.name;
  if (typeof note.subject === "string") return note.subject;
  return "General";
}

function noteId(note) {
  return note.id || note._id;
}

function semesterLabel(raw) {
  if (!raw) return "";
  const n = String(raw).replace(/[^0-9]/g, "");
  if (!n) return String(raw);
  const map = { 1: "1st", 2: "2nd", 3: "3rd" };
  return map[n] || `${n}th`;
}

function matchesType(note, typeId) {
  if (typeId === "all") return true;
  const blob = `${note.noteType || ""} ${note.type || ""} ${note.title || ""}`.toLowerCase();
  if (typeId === "pyq") return /pyq|paper|previous/.test(blob);
  if (typeId === "handwritten") return /hand|written|scan/.test(blob);
  if (typeId === "typed") return /typed|doc|digital/.test(blob);
  if (typeId === "diagrams") return /diagram|figure|chart/.test(blob);
  return true;
}

function matchesSemester(note, sem) {
  if (sem === "all") return true;
  const n = String(note.semester || "").replace(/[^0-9]/g, "");
  return n === String(sem);
}

export default function NotesHub() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const { subjects: mergedSubjects } = useMergedSubjects();
  const catalog = mergedSubjects.length ? mergedSubjects : SUBJECTS;

  const scope = params.get("scope") === "mine" ? "mine" : "campus";
  const profileBranch = String(user?.branch || "")
    .trim()
    .toUpperCase();
  const defaultBranch =
    profileBranch === "AIDS" ||
    profileBranch === "AI" ||
    profileBranch === "IT" ||
    profileBranch === "CSE" ||
    profileBranch === "ECE"
      ? profileBranch === "AI"
        ? "AIDS"
        : profileBranch
      : "CSE";
  const rawBranch = (params.get("branch") || defaultBranch).toUpperCase();
  const branch = rawBranch === "ALL" ? "all" : rawBranch;
  const sem = params.get("sem") || "all";
  const subjectFilter = params.get("subject") || "all";
  const type = params.get("type") || "all";
  const q = params.get("q") || "";
  const panelOpen = params.get("panel") === "upload";

  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchDraft, setSearchDraft] = useState(q);
  const [activePDF, setActivePDF] = useState(null);
  const [openingId, setOpeningId] = useState(null);
  const [downloadingId, setDownloadingId] = useState(null);
  const [shareFlashId, setShareFlashId] = useState(null);

  useEffect(() => {
    setSearchDraft(q);
  }, [q]);

  const subjectsForBranch = useMemo(() => {
    let list = catalog;
    if (branch !== "all") {
      // Sem 5 cores (AOA/CG/CD/OS) stay visible for CSE · AIDS · IT
      list = list.filter((s) => subjectMatchesBranch(s, branch));
    }
    if (sem !== "all") {
      list = list.filter((s) => String(s.semester) === String(sem));
    }
    return list;
  }, [catalog, branch, sem]);

  const subjectNames = useMemo(
    () => ["all", ...Array.from(new Set(subjectsForBranch.map((s) => s.name))).sort()],
    [subjectsForBranch]
  );

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      if (scope === "mine") {
        if (!user) {
          setNotes([]);
          return;
        }
        const res = await api.get("/notes");
        setNotes(res.data.notes || []);
      } else {
        const qs = new URLSearchParams({ limit: "48" });
        if (q) qs.set("search", q);
        if (sem !== "all") qs.set("semester", semesterLabel(sem));
        if (type !== "all") qs.set("noteType", type);
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_BASE}/api/notes/public?${qs}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to load notes");
        setNotes(data.notes || []);
      }
    } catch (err) {
      setError(err.message || "Could not load notes");
      setNotes([]);
    } finally {
      setLoading(false);
    }
  }, [scope, user, q, sem, type]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (scope === "mine" && !user) {
      navigate(loginPath("/notes?scope=mine"), { replace: true });
    }
  }, [scope, user, navigate]);

  const visible = useMemo(() => {
    return notes.filter((note) => {
      if (scope !== "mine") {
        if (!matchesSemester(note, sem)) return false;
        if (!matchesType(note, type)) return false;
        if (subjectFilter !== "all" && noteSubject(note) !== subjectFilter) return false;
        if (branch !== "all") {
          const name = noteSubject(note);
          const hit = findCatalogSubject(catalog, name);
          // Shared Sem 5 notes (AOA/CG/CD/OS) stay visible for CSE · AIDS · IT
          if (hit && !subjectMatchesBranch(hit, branch)) return false;
        }
      }
      if (q && scope === "mine") {
        const hay = `${note.title || ""} ${noteSubject(note)} ${note.noteType || ""}`.toLowerCase();
        if (!hay.includes(q.toLowerCase())) return false;
      }
      return true;
    });
  }, [notes, sem, type, subjectFilter, branch, catalog, q, scope]);

  const openUpload = () => {
    if (!user) {
      navigate(loginPath("/notes?panel=upload"));
      return;
    }
    updateParams(params, setParams, { panel: "upload" });
  };

  const closeUpload = () => updateParams(params, setParams, { panel: "" });

  const openPdf = async (note) => {
    if (!user) {
      navigate(loginPath(`/note/${noteId(note)}`));
      return;
    }
    const id = noteId(note);
    trackNoteOpened(note);
    setOpeningId(id);
    try {
      const data = await requestNoteDownload(id);
      if (data.fileUrl) {
        setActivePDF({
          pdfUrl: data.fileUrl,
          title: note.title || "Notes",
          revoke: data.revoke,
          sharePath: `/note/${id}`,
        });
      } else {
        navigate(`/note/${id}`, { state: { note } });
      }
    } catch {
      navigate(`/note/${id}`, { state: { note } });
    } finally {
      setOpeningId(null);
    }
  };

  const downloadPdf = async (note) => {
    if (!user) {
      navigate(loginPath(`/note/${noteId(note)}`));
      return;
    }
    const id = noteId(note);
    setDownloadingId(id);
    try {
      const data = await requestNoteDownload(id, { attachment: true });
      const a = document.createElement("a");
      a.href = data.fileUrl;
      a.download = `${String(note.title || "notes").replace(/[^\w.\- ]+/g, "_")}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      // Keep blob alive briefly so the download can start
      window.setTimeout(() => data.revoke?.(), 60_000);
    } catch (err) {
      console.warn(err);
    } finally {
      setDownloadingId(null);
    }
  };

  const shareNote = async (note) => {
    const id = noteId(note);
    const url = `${window.location.origin}/note/${id}`;
    const payload = {
      title: note.title || "Medha notes",
      text: note.title || "Open these notes on Medha",
      url,
    };
    try {
      if (navigator.share) {
        await navigator.share(payload);
      } else if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
      } else {
        window.prompt("Copy this Medha link:", url);
      }
      setShareFlashId(id);
      window.setTimeout(() => setShareFlashId(null), 1800);
    } catch (err) {
      if (err?.name === "AbortError") return;
      try {
        await navigator.clipboard?.writeText(url);
        setShareFlashId(id);
        window.setTimeout(() => setShareFlashId(null), 1800);
      } catch {
        /* ignore */
      }
    }
  };

  const applySearch = (e) => {
    e?.preventDefault?.();
    updateParams(params, setParams, { q: searchDraft.trim() });
  };

  return (
    <RevisionShell title="Notes" desk>
      <div className="desk-page">
        <header className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="desk-eyebrow">Shared library</p>
            <h1 className="desk-title">Notes</h1>
            <p className="desk-sub">
              Browse by branch, semester, subject, and type — then open, download, or contribute.
            </p>
          </div>
          <button type="button" className="desk-solid-btn inline-flex items-center gap-2" onClick={openUpload}>
            <Plus size={16} aria-hidden />
            Upload
          </button>
        </header>

        {/* Scope */}
        <div className="desk-tabs mb-3" role="tablist" aria-label="Library scope">
          {[
            { id: "campus", label: "Campus" },
            { id: "mine", label: "Mine" },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-pressed={scope === tab.id}
              className={`desk-tab${scope === tab.id ? " is-on" : ""}`}
              onClick={() => updateParams(params, setParams, { scope: tab.id === "campus" ? "" : "mine" })}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search — same pill control as Search / Subjects */}
        <div className="mb-3">
          <SearchBar
            value={searchDraft}
            onChange={setSearchDraft}
            onSubmit={() => applySearch()}
            onClear={() => {
              setSearchDraft("");
              updateParams(params, setParams, { q: "" });
            }}
            placeholder="Search title, subject, or topic"
            showButton
          />
        </div>

        {scope !== "mine" ? (
          <div className="desk-panel mb-4">
            <div className="desk-filter-grid">
              <DeskFilterSelect
                label="Branch"
                value={branch}
                onValueChange={(v) => updateParams(params, setParams, { branch: v, subject: "" })}
                options={BRANCHES.map((b) => ({ value: b.id, label: b.label }))}
              />
              <DeskFilterSelect
                label="Semester"
                value={sem}
                onValueChange={(v) => updateParams(params, setParams, { sem: v, subject: "" })}
                options={SEMESTERS.map((s) => ({
                  value: s,
                  label: s === "all" ? "All semesters" : `Semester ${s}`,
                }))}
              />
              <DeskFilterSelect
                label="Subject"
                value={subjectNames.includes(subjectFilter) ? subjectFilter : "all"}
                onValueChange={(v) => updateParams(params, setParams, { subject: v })}
                options={subjectNames.map((name) => ({
                  value: name,
                  label: name === "all" ? "All subjects" : name,
                }))}
                span
              />
              <DeskFilterSelect
                label="Type"
                value={type}
                onValueChange={(v) => updateParams(params, setParams, { type: v })}
                options={TYPES.map((t) => ({ value: t.id, label: t.label }))}
                span
              />
            </div>
          </div>
        ) : null}

        {error ? (
          <div className="desk-panel mb-4">
            <p className="m-0 text-[14px] text-[#b91c1c]">{error}</p>
            <button type="button" className="desk-tab is-on mt-3" onClick={load}>
              Retry
            </button>
          </div>
        ) : null}

        <section className="desk-panel">
          <div className="desk-panel-head">
            <h2>{scope === "mine" ? "Your uploads" : "Campus notes"}</h2>
            <span className="text-[13px] font-semibold text-[#6b6b6b]">
              {loading ? "…" : `${visible.length} shown`}
            </span>
          </div>

          {loading ? (
            <div className="space-y-2 py-2">
              {[0, 1, 2].map((i) => (
                <div key={i} className="h-16 animate-pulse rounded-xl bg-[#f4f4f4]" />
              ))}
            </div>
          ) : null}

          {!loading && visible.length === 0 ? (
            <div className="py-10 text-center">
              <p className="text-[15px] font-medium text-[#111]">No notes match these filters</p>
              <p className="mt-1 text-[13px] text-[#6b6b6b]">
                Widen the semester/subject, or upload the first set for this slot.
              </p>
              <button type="button" className="desk-solid-btn mt-4" onClick={openUpload}>
                Upload notes
              </button>
            </div>
          ) : null}

          {!loading && visible.length > 0 ? (
            <ul className="divide-y divide-[#eee]">
              {visible.map((note) => {
                const id = noteId(note);
                const subject = noteSubject(note);
                const opening = openingId === id;
                const downloading = downloadingId === id;
                const shared = shareFlashId === id;
                return (
                  <li key={id} className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center">
                    <div className="min-w-0 flex-1">
                      <p className="text-[12px] font-semibold text-[#8a8a8a]">
                        {subject}
                        {note.semester ? ` · ${semesterLabel(note.semester)}` : ""}
                        {note.noteType ? ` · ${note.noteType}` : ""}
                      </p>
                      <h3 className="mt-0.5 text-[15px] font-semibold leading-snug text-[#111]">
                        {note.title || "Untitled notes"}
                      </h3>
                      <p className="mt-1 text-[13px] text-[#6b6b6b]">
                        {note.owner?.name || note.author || (scope === "mine" ? "You" : "Student")}
                        {note.createdAt ? ` · ${formatDate(note.createdAt)}` : ""}
                        {note.downloadCount
                          ? ` · ${note.downloadCount} download${note.downloadCount === 1 ? "" : "s"}`
                          : ""}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <button
                        type="button"
                        disabled={opening}
                        onClick={() => openPdf(note)}
                        className="inline-flex min-h-9 items-center gap-1.5 rounded-full border border-[#111] bg-white px-3 text-[12px] font-semibold text-[#111] disabled:opacity-60"
                      >
                        <Eye size={14} aria-hidden />
                        {opening ? "Opening…" : "Open"}
                      </button>
                      <button
                        type="button"
                        disabled={downloading}
                        onClick={() => downloadPdf(note)}
                        className="inline-flex min-h-9 items-center gap-1.5 rounded-full bg-[#111] px-3 text-[12px] font-semibold text-white disabled:opacity-60"
                      >
                        <Download size={14} aria-hidden />
                        {downloading ? "…" : "Download"}
                      </button>
                      <button
                        type="button"
                        onClick={() => shareNote(note)}
                        className="inline-flex min-h-9 items-center gap-1.5 rounded-full border border-[#e5e5e5] bg-[#f7f7f4] px-3 text-[12px] font-semibold text-[#111]"
                        aria-label="Share note link"
                        title="Share"
                      >
                        <Share2 size={14} aria-hidden />
                        {shared ? "Copied" : "Share"}
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : null}
        </section>

        {scope === "mine" ? (
          <p className="mt-4 text-[12px] text-[#8a8a8a]">
            Private notes stay in Mine. Public uploads appear on Campus after review.
          </p>
        ) : (
          <p className="mt-4 text-[12px] text-[#8a8a8a]">
            Campus shows verified public notes.{" "}
            <button type="button" className="font-semibold text-[#2563EB]" onClick={openUpload}>
              Contribute yours
            </button>
          </p>
        )}
      </div>

      <NotesUploadPanel
        open={panelOpen}
        onClose={closeUpload}
        onDone={load}
        preset={{
          semester: sem !== "all" ? semesterLabel(sem) : "",
          subjectSlug:
            subjectFilter !== "all"
              ? catalog.find((s) => s.name === subjectFilter)?.slug || ""
              : "",
        }}
      />

      <InAppPdfViewer
        isOpen={!!activePDF}
        onClose={() => {
          activePDF?.revoke?.();
          setActivePDF(null);
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
