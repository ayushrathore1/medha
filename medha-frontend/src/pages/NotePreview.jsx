import React, { useContext, useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../AuthContext";
import RevisionShell from "../components/Revision/RevisionShell";
import { formatDate, formatFileMeta, loginPath } from "../components/Revision/revisionUtils";
import { requestNoteDownload } from "../components/Revision/noteDownload";
import api from "../api/api";
import "./NotePreview.css";

function subjectLabel(note) {
  if (!note) return "Notes";
  if (typeof note.subject === "object" && note.subject) {
    return note.subject.name || note.subject.code || "Notes";
  }
  return note.subject || note.subjectTag || "Notes";
}

export default function NotePreview() {
  const { noteId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const passed = location.state?.note || null;
  const [note, setNote] = useState(passed);
  const [loading, setLoading] = useState(!passed);
  const [fileUrl, setFileUrl] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await api.get(`/notes/${noteId}`);
        if (!cancelled) setNote(res.data?.note || res.data);
      } catch {
        if (!cancelled && !passed) setNote(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [noteId, passed]);

  const handleDownload = async () => {
    if (!user) {
      navigate(loginPath(`/note/${noteId}`));
      return;
    }
    setBusy(true);
    try {
      const data = await requestNoteDownload(noteId);
      if (data.fileUrl) {
        setFileUrl(data.fileUrl);
        window.open(data.fileUrl, "_blank", "noopener,noreferrer");
        setNote((prev) => (prev ? { ...prev, downloadCount: data.downloadCount } : prev));
      }
    } catch (err) {
      console.warn(err);
    } finally {
      setBusy(false);
    }
  };

  const previewUrl = fileUrl;
  const fileKind = formatFileMeta(note);
  const isPdf = /pdf/i.test(note?.fileType || note?.fileUrl || previewUrl || "");
  const author = note?.author || note?.owner?.name || "Student";
  const downloads = Number(note?.downloadCount) || 0;

  const chips = useMemo(() => {
    if (!note) return [];
    const list = [{ label: fileKind, tone: "ink" }];
    list.push({ label: subjectLabel(note) });
    if (note.semester) list.push({ label: `${String(note.semester).replace(/[^0-9]/g, "") || note.semester} sem` });
    if (downloads) list.push({ label: `${downloads} download${downloads === 1 ? "" : "s"}` });
    if (note.verificationStatus === "approved") list.push({ label: "Verified", tone: "ok" });
    return list;
  }, [note, fileKind, downloads]);

  return (
    <RevisionShell title="Note" showBack desk>
      <div className="desk-page note-desk">
        {loading ? (
          <div className="note-desk-skeleton" aria-hidden>
            <div className="note-desk-skeleton-line" style={{ width: "30%" }} />
            <div className="note-desk-skeleton-line is-title" />
            <div className="note-desk-skeleton-line" style={{ width: "45%" }} />
            <div className="note-desk-skeleton-line is-block" />
          </div>
        ) : !note ? (
          <div className="note-desk-miss">
            <p className="desk-eyebrow" style={{ marginBottom: 6 }}>
              Library
            </p>
            <h1 className="desk-title" style={{ fontSize: 24 }}>
              Note unavailable
            </h1>
            <p className="desk-sub">This note may be private, removed, or still in review.</p>
            <div className="note-desk-actions">
              <Link to="/search" className="desk-solid-btn">
                Back to search
              </Link>
              <Link to="/subjects" className="desk-ghost-btn">
                Browse subjects
              </Link>
            </div>
          </div>
        ) : (
          <>
            <header className="mb-1">
              <p className="desk-eyebrow">Shared notes</p>
              <h1 className="desk-title" style={{ fontSize: "clamp(26px, 4vw, 34px)" }}>
                {note.title}
              </h1>
              <p className="desk-sub" style={{ marginTop: 10 }}>
                {author}
                {note.createdAt ? ` · ${formatDate(note.createdAt)}` : ""}
              </p>
            </header>

            <div className="note-desk-meta" aria-label="Note details">
              {chips.map((chip) => (
                <span
                  key={`${chip.label}-${chip.tone || "default"}`}
                  className={`note-desk-chip${chip.tone === "ink" ? " note-desk-chip--ink" : ""}${
                    chip.tone === "ok" ? " note-desk-chip--ok" : ""
                  }`}
                >
                  {chip.label}
                </span>
              ))}
            </div>

            <div className="note-desk-actions">
              <button type="button" className="desk-solid-btn" onClick={handleDownload} disabled={busy}>
                {busy ? "Opening…" : user ? "Download" : "Sign in to download"}
              </button>
              {previewUrl ? (
                <a
                  href={previewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="desk-ghost-btn"
                >
                  Open in new tab
                </a>
              ) : null}
            </div>

            <section className="note-desk-preview" aria-label="Note preview">
              {previewUrl && isPdf ? (
                <iframe title={note.title} src={previewUrl} />
              ) : (
                <div className="note-desk-empty">
                  <div className="note-desk-empty-mark">{fileKind}</div>
                  <p className="note-desk-empty-title">
                    {user ? "Ready when you are" : "Sign in to open this note"}
                  </p>
                  <p className="note-desk-empty-copy">
                    {user
                      ? "Download to read the full file. Aura goes to the student who uploaded it."
                      : "Sign in to download. Aura goes to the student who uploaded it."}
                  </p>
                  <button type="button" className="desk-solid-btn" onClick={handleDownload} disabled={busy}>
                    {busy ? "Opening…" : user ? "Download to preview" : "Sign in to download"}
                  </button>
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </RevisionShell>
  );
}
