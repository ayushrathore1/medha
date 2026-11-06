import React, { useContext, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthContext";
import RevisionShell from "../components/Revision/RevisionShell";
import { formatDate, loginPath } from "../components/Revision/revisionUtils";
import api from "../api/api";

const FILTERS = [
  { id: "all", label: "All" },
  { id: "approved", label: "Live / private" },
  { id: "pending", label: "Processing" },
  { id: "rejected", label: "Rejected" },
];

function statusOf(note) {
  if (note.verificationStatus === "rejected") return "rejected";
  if (note.verificationStatus === "pending" || note.verificationStatus === "awaiting_team") {
    return "pending";
  }
  if (note.verificationStatus === "approved") return "approved";
  return "pending";
}

function statusLabel(note) {
  if (!note.isPublic && note.verificationStatus === "approved") return "Private";
  if (note.verificationStatus === "awaiting_team") return "Almost ready";
  if (note.verificationStatus === "pending") return "Uploading";
  if (note.verificationStatus === "rejected") return "Not published";
  if (note.verificationStatus === "approved" && note.isPublic) return "Live";
  return "Saved";
}

function statusTone(note) {
  if (note.verificationStatus === "rejected") return "warn";
  if (note.verificationStatus === "pending" || note.verificationStatus === "awaiting_team") return "busy";
  if (!note.isPublic) return "quiet";
  return "ok";
}

export default function MyUploads() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    if (!user) {
      navigate(loginPath("/uploads"), { replace: true });
      return;
    }
    api
      .get("/notes")
      .then((res) => setNotes(res.data.notes || []))
      .catch(() => setNotes([]))
      .finally(() => setLoading(false));
  }, [user, navigate]);

  const visible = useMemo(
    () => notes.filter((note) => filter === "all" || statusOf(note) === filter),
    [notes, filter]
  );

  const downloads = notes.reduce((sum, note) => sum + (note.downloadCount || 0), 0);

  return (
    <RevisionShell title="Your uploads" showBack desk>
      <div className="desk-page">
        <header className="mb-4">
          <p className="desk-eyebrow">Your library</p>
          <h1 className="desk-title">Uploads</h1>
          <p className="desk-sub">
            {downloads} downloads across your notes.
          </p>
        </header>

        <div className="desk-tabs mb-4">
          {FILTERS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setFilter(item.id)}
              className={`desk-tab${filter === item.id ? " is-on" : ""}`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <section className="desk-panel">
          {loading ? <div className="h-16 animate-pulse rounded-xl bg-[#F4F4F4]" /> : null}
          {!loading && visible.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-[15px] font-medium">Nothing here yet.</p>
              <Link to="/upload" className="desk-solid-btn mt-4 inline-flex">
                Share notes
              </Link>
            </div>
          ) : null}
          <ul className="dash-list">
            {visible.map((note) => (
              <li key={note._id}>
                <Link to={`/note/${note._id}`} state={{ note }} className="dash-list-row">
                  <span className={`dash-status dash-status--${statusTone(note)}`}>{statusLabel(note)}</span>
                  <div className="dash-list-copy">
                    <strong>{note.title}</strong>
                    <span>
                      {[
                        typeof note.subject === "object" ? note.subject?.name : note.subjectTag || note.subject,
                        note.createdAt ? formatDate(note.createdAt) : null,
                        note.downloadCount ? `${note.downloadCount} downloads` : null,
                      ]
                        .filter(Boolean)
                        .join(" · ")}
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </RevisionShell>
  );
}
