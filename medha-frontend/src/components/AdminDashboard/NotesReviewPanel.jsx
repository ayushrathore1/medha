import React, { useCallback, useEffect, useState } from "react";
import api from "../../api/api";

export default function NotesReviewPanel({ admin }) {
  const { activeTab, isFullAdmin } = admin;
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [forms, setForms] = useState({});

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/notes/review/queue");
      setNotes(res.data.notes || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load review queue");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (activeTab === "notes-review") load();
  }, [activeTab, load]);

  if (activeTab !== "notes-review") return null;

  const setField = (id, key, value) => {
    setForms((prev) => ({
      ...prev,
      [id]: { subjectTag: "", semester: "", noteType: "notes", ...(prev[id] || {}), [key]: value },
    }));
  };

  const review = async (noteId, action) => {
    const form = forms[noteId] || {};
    try {
      await api.post(`/notes/review/${noteId}`, {
        action,
        subjectTag: form.subjectTag || undefined,
        semester: form.semester || undefined,
        noteType: form.noteType || undefined,
        reason: form.reason || undefined,
      });
      await load();
    } catch (err) {
      setError(err.response?.data?.message || "Review failed");
    }
  };

  return (
    <section className="admin-dash-panel">
      <div className="panel-head">
        <div>
          <h2>Notes review</h2>
          <p>
            Public uploads that passed automated checks. Categorize into the right subject, then publish.
            {isFullAdmin ? "" : " Team members can publish or reject."}
          </p>
        </div>
        <button type="button" className="admin-btn admin-btn-ghost" onClick={load}>
          Refresh
        </button>
      </div>

      {error ? <div className="admin-alert admin-alert-error">{error}</div> : null}
      {loading ? <div className="admin-alert admin-alert-info">Loading queue…</div> : null}

      {!loading && notes.length === 0 ? (
        <p className="text-sm text-[var(--ad-muted)]">No notes waiting for team review.</p>
      ) : null}

      <div className="space-y-3">
        {notes.map((note) => {
          const form = forms[note._id] || {
            subjectTag: note.subjectTag || "",
            semester: note.semester || "",
            noteType: note.noteType || note.moderationLabel || "notes",
          };
          return (
            <div key={note._id} className="admin-list-row cursor-default flex-col items-stretch gap-3 sm:flex-row sm:items-start">
              <div className="min-w-0 flex-1">
                <p className="font-bold text-[var(--ad-ink)]">{note.title}</p>
                <p className="mt-1 text-xs text-[var(--ad-muted)]">
                  {note.owner?.name || "Student"} · {note.originalName || "file"} ·{" "}
                  {note.moderationLabel || "notes"}
                  {typeof note.moderationConfidence === "number"
                    ? ` · confidence ${(note.moderationConfidence * 100).toFixed(0)}%`
                    : ""}
                </p>
                {note.verificationReason ? (
                  <p className="mt-2 text-sm text-[var(--ad-muted)]">{note.verificationReason}</p>
                ) : null}
                {note.fileUrl ? (
                  <a
                    href={note.fileUrl.startsWith("http") ? note.fileUrl : `${import.meta.env.VITE_BACKEND_URL}${note.fileUrl}`}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-2 inline-block text-sm font-semibold text-[var(--ad-aura)] underline"
                  >
                    Open file
                  </a>
                ) : null}
              </div>
              <div className="grid w-full gap-2 sm:w-[260px]">
                <input
                  className="admin-input"
                  placeholder="Subject tag"
                  value={form.subjectTag}
                  onChange={(e) => setField(note._id, "subjectTag", e.target.value)}
                />
                <input
                  className="admin-input"
                  placeholder="Semester (e.g. 5th)"
                  value={form.semester}
                  onChange={(e) => setField(note._id, "semester", e.target.value)}
                />
                <input
                  className="admin-input"
                  placeholder="Type (notes/pyq/slides)"
                  value={form.noteType}
                  onChange={(e) => setField(note._id, "noteType", e.target.value)}
                />
                <div className="flex gap-2">
                  <button type="button" className="admin-btn admin-btn-ink flex-1" onClick={() => review(note._id, "publish")}>
                    Publish
                  </button>
                  <button type="button" className="admin-btn admin-btn-ghost flex-1" onClick={() => review(note._id, "reject")}>
                    Reject
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
