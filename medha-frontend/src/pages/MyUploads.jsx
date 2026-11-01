import React, { useContext, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthContext";
import RevisionShell from "../components/Revision/RevisionShell";
import { formatDate, loginPath } from "../components/Revision/revisionUtils";
import api from "../api/api";

const FILTERS = [
  { id: "all", label: "All" },
  { id: "approved", label: "Live" },
  { id: "rejected", label: "Rejected" },
];

function statusOf(note) {
  if (note.verificationStatus === "rejected") return "rejected";
  if (note.verificationStatus === "approved" || note.isPublic) return "approved";
  return "pending";
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
    <RevisionShell title="Your uploads" showBack>
      <p className="text-[14px] text-[#5C5C5C]">
        Aura {user?.auraPoints ?? 0} · {downloads} downloads across your notes.
      </p>

      <div className="mt-5 flex flex-wrap gap-2 text-[13px]">
        {FILTERS.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setFilter(item.id)}
            className={`rounded-full px-4 py-1.5 ${
              filter === item.id ? "bg-[#111] font-semibold text-white" : "border border-[#E8E8E8] text-[#5A5A5A]"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="mt-2 border-t border-[#E5E5E5]">
        {loading && <div className="h-16 animate-pulse bg-[#F4F4F4]" />}
        {!loading && visible.length === 0 && (
          <div className="py-10">
            <p className="text-[15px] font-medium">Nothing here yet.</p>
            <Link to="/upload" className="mt-2 inline-block text-[13px] text-[#1F1F1F] underline underline-offset-2">
              Share notes
            </Link>
          </div>
        )}
        {visible.map((note) => {
          const status = statusOf(note);
          return (
            <Link
              key={note._id}
              to={`/note/${note._id}`}
              state={{ note }}
              className="block border-b border-[#E5E5E5] py-4 no-underline"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h2 className="text-[15px] font-medium text-[#1F1F1F]">{note.title}</h2>
                  <p className="mt-1 text-[12px] text-[#8A8A8A]">
                    {note.subjectTag || note.subject?.name || "General"}
                    {note.createdAt ? ` · ${formatDate(note.createdAt)}` : ""}
                    {note.downloadCount ? ` · ${note.downloadCount} downloads` : ""}
                  </p>
                </div>
                <span className="shrink-0 text-[12px] text-[#8A8A8A]">
                  {status === "approved" ? "Live" : status === "rejected" ? "Rejected" : "Checking"}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </RevisionShell>
  );
}
