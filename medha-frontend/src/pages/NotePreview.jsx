import React, { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../AuthContext";
import RevisionShell from "../components/Revision/RevisionShell";
import { formatDate, formatFileMeta, loginPath } from "../components/Revision/revisionUtils";
import { requestNoteDownload } from "../components/Revision/noteDownload";
import api from "../api/api";

export default function NotePreview() {
  const { noteId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const passed = location.state?.note || null;
  const [note, setNote] = useState(passed);
  const [loading, setLoading] = useState(!passed);
  const [fileUrl, setFileUrl] = useState("");

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
    try {
      const data = await requestNoteDownload(noteId);
      if (data.fileUrl) {
        setFileUrl(data.fileUrl);
        window.open(data.fileUrl, "_blank", "noopener,noreferrer");
        setNote((prev) => prev ? { ...prev, downloadCount: data.downloadCount } : prev);
      }
    } catch (err) {
      setNote((prev) => prev);
      console.warn(err);
    }
  };

  const previewUrl = fileUrl;

  return (
    <RevisionShell title="Note" showBack>
      {loading ? (
        <div className="h-48 animate-pulse bg-[#F4F4F4]" />
      ) : !note ? (
        <p className="text-[14px] text-[#5C5C5C]">This note is not available.</p>
      ) : (
        <div>
          <p className="text-[12px] text-[#8A8A8A]">
            {formatFileMeta(note)} · {note.subject || note.subjectTag || "Notes"}
            {note.downloadCount ? ` · ${note.downloadCount} downloads` : ""}
          </p>
          <h1 className="mt-1 break-words text-[24px] font-semibold leading-tight tracking-[-0.03em] text-[#1F1F1F]">
            {note.title}
          </h1>
          <p className="mt-2 text-[13px] text-[#5C5C5C]">
            {note.author || note.owner?.name || "Student"}
            {note.createdAt ? ` · ${formatDate(note.createdAt)}` : ""}
          </p>
          {note.verificationStatus === "approved" && (
            <p className="mt-2 text-[12px] text-[#5C5C5C]">Checked as study material.</p>
          )}

          <button
            type="button"
            onClick={handleDownload}
            className="mt-6 rounded-full bg-[#111] px-5 py-2.5 text-[13px] font-semibold text-white"
          >
            {user ? "Download" : "Sign in to download"}
          </button>

          <div className="mt-8 min-h-[320px] overflow-hidden rounded-[22px] border border-[#E8E8E8]">
            {previewUrl && /pdf/i.test(note.fileType || note.fileUrl || previewUrl) ? (
              <iframe title={note.title} src={previewUrl} className="h-[70vh] w-full" />
            ) : (
              <div className="flex h-[280px] flex-col items-center justify-center px-6 text-center">
                <p className="text-[14px] text-[#5C5C5C]">
                  {user
                    ? "Download the file to read it."
                    : "Sign in to download. Aura goes to the student who uploaded it."}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </RevisionShell>
  );
}
