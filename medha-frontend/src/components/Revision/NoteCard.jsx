import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../AuthContext";
import { formatDate, formatFileMeta, loginPath } from "./revisionUtils";

export default function NoteCard({ note }) {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const fileLabel = formatFileMeta(note);
  const author = note.author || note.owner?.name || "Student";
  const noteId = note.id || note._id;

  const goPreview = () => {
    if (!user) {
      navigate(loginPath(`/note/${noteId}`));
      return;
    }
    navigate(`/note/${noteId}`, { state: { note } });
  };

  return (
    <article className="border-b border-[#E5E5E5] py-4">
      <p className="text-[12px] text-[#8A8A8A]">
        {fileLabel}
        {note.subject ? ` · ${note.subject}` : ""}
        {note.downloadCount ? ` · ${note.downloadCount} downloads` : ""}
      </p>
      <h3 className="mt-1 text-[15px] font-medium leading-snug text-[#1F1F1F]">{note.title}</h3>
      <p className="mt-1 text-[13px] text-[#5C5C5C]">
        {author}
        {note.createdAt ? ` · ${formatDate(note.createdAt)}` : ""}
      </p>
      <div className="mt-3 flex gap-3 text-[13px]">
        <button type="button" onClick={goPreview} className="text-[#1F1F1F] underline underline-offset-2">
          {user ? "View notes" : "Sign in to view"}
        </button>
      </div>
    </article>
  );
}
