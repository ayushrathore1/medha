import React, { useCallback, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FileImage, FileUp, X } from "lucide-react";
import { AuthContext } from "../../AuthContext";
import { loginPath } from "../Revision/revisionUtils";
import { FileUpload } from "@/components/extend/file-upload";
import { SUBJECTS, getSubjectBySlug } from "../../data/subjectCatalog";
import { useMergedSubjects } from "../../hooks/useMergedSubjects";
import api from "../../api/api";

const SEMESTERS = ["1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th"];
const MAX_BYTES = 25 * 1024 * 1024;
const NOTE_ACCEPT = [
  ".pdf",
  ".png",
  ".jpg",
  ".jpeg",
  "application/pdf",
  "image/png",
  "image/jpeg",
].join(",");
const NOTE_FILE_TYPES = [
  { label: "PDF", icon: FileUp },
  { label: "Image", icon: FileImage },
];

/**
 * Inline upload composer for Notes hub.
 * onDone() refreshes the library after a successful upload.
 */
export default function NotesUploadPanel({ open, onClose, onDone, preset = {} }) {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const { subjects: mergedSubjects } = useMergedSubjects();
  const subjectOptions = mergedSubjects.length ? mergedSubjects : SUBJECTS;

  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [subjectSlug, setSubjectSlug] = useState(preset.subjectSlug || "");
  const [unitTitle, setUnitTitle] = useState(preset.unitTitle || "");
  const [semester, setSemester] = useState(preset.semester || "");
  const [description, setDescription] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const subject =
    subjectOptions.find((s) => s.slug === subjectSlug) || getSubjectBySlug(subjectSlug);

  const reset = () => {
    setFile(null);
    setTitle("");
    setSubjectSlug(preset.subjectSlug || "");
    setUnitTitle(preset.unitTitle || "");
    setSemester(preset.semester || "");
    setDescription("");
    setIsPublic(true);
    setError("");
    setDone(false);
  };

  const handleClose = () => {
    reset();
    onClose?.();
  };

  const handleFilesAccepted = useCallback((files) => {
    const next = files?.[0] || null;
    if (!next) {
      setFile(null);
      return;
    }
    if (next.size > MAX_BYTES) {
      setFile(null);
      setError("File too large. Maximum size is 25MB.");
      return;
    }
    setError("");
    setFile(next);
    setTitle((prev) => prev || next.name.replace(/\.[^.]+$/, ""));
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate(loginPath("/notes?panel=upload"));
      return;
    }
    if (!file || !title.trim() || !subject) {
      setError("Add a file, a title, and a subject.");
      return;
    }
    if (file.size > MAX_BYTES) {
      setError("File too large. Maximum size is 25MB.");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("title", title.trim());
      formData.append("subjectTag", subject.name);
      formData.append("isPublic", isPublic ? "true" : "false");
      if (semester) formData.append("semester", semester);
      if (unitTitle) formData.append("noteType", unitTitle);
      if (description) formData.append("content", description);
      await api.post("/notes", formData);
      setDone(true);
      onDone?.();
    } catch (err) {
      setError(err.response?.data?.error || "Upload failed. Try a smaller PDF.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[80] flex items-end justify-center bg-black/45 p-0 sm:items-center sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label="Upload notes"
      onClick={handleClose}
    >
      <div
        className="flex max-h-[92dvh] w-full max-w-lg flex-col overflow-hidden rounded-t-2xl border border-[#e8e8e8] bg-white shadow-2xl sm:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex items-center gap-3 border-b border-[#eee] px-5 py-4">
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#7DC67A]">Contribute</p>
            <h2 className="truncate text-[18px] font-bold text-[#111]">Upload notes</h2>
          </div>
          <button
            type="button"
            className="grid h-9 w-9 place-items-center rounded-full border border-[#e5e5e5] text-[#555]"
            onClick={handleClose}
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </header>

        <div className="overflow-y-auto px-5 py-4">
          {done ? (
            <div className="py-6 text-center">
              <p className="text-[20px] font-bold text-[#111]">
                {isPublic ? "Upload complete" : "Private notes saved"}
              </p>
              <p className="mt-2 text-[14px] text-[#6b6b6b]">
                {isPublic
                  ? "We’ll email you when it’s live, or if we need a different file."
                  : "Only you can see these notes in Mine."}
              </p>
              <button type="button" className="desk-solid-btn mt-5" onClick={handleClose}>
                Back to library
              </button>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-4">
              <div className="rounded-xl border border-[#e8e8e8] bg-[#fafafa] p-3">
                <FileUpload
                  multiple={false}
                  accept={NOTE_ACCEPT}
                  acceptedFileTypes={NOTE_FILE_TYPES}
                  title="Drop notes or browse"
                  description="PDF or image · up to 25MB"
                  browseLabel="Browse files"
                  showBorderBeam
                  showFileList
                  onFilesAccepted={handleFilesAccepted}
                />
              </div>

              <label className="desk-field">
                <span>Title</span>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="DBMS notes, Unit 1"
                />
              </label>

              <label className="desk-field">
                <span>Subject</span>
                <select
                  value={subjectSlug}
                  onChange={(e) => {
                    setSubjectSlug(e.target.value);
                    setUnitTitle("");
                  }}
                >
                  <option value="">Select subject</option>
                  {subjectOptions.map((item) => (
                    <option key={`${item.semester}-${item.slug}`} value={item.slug}>
                      Sem {item.semester} · {item.name}
                    </option>
                  ))}
                </select>
              </label>

              <label className="desk-field">
                <span>Unit / topic</span>
                <select
                  value={unitTitle}
                  onChange={(e) => setUnitTitle(e.target.value)}
                  disabled={!subject}
                >
                  <option value="">Optional</option>
                  {subject?.units?.map((unit) => (
                    <option key={unit.slug || unit.title} value={unit.title}>
                      {unit.title}
                    </option>
                  ))}
                </select>
              </label>

              <label className="desk-field">
                <span>Semester</span>
                <select value={semester} onChange={(e) => setSemester(e.target.value)}>
                  <option value="">Optional</option>
                  {SEMESTERS.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </label>

              <label className="desk-field">
                <span>What’s inside</span>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="min-h-20"
                  placeholder="Handwritten unit 1, covers ER model and keys."
                />
              </label>

              <div className="desk-tabs">
                <button
                  type="button"
                  onClick={() => setIsPublic(true)}
                  className={`desk-tab${isPublic ? " is-on" : ""}`}
                >
                  Public
                </button>
                <button
                  type="button"
                  onClick={() => setIsPublic(false)}
                  className={`desk-tab${!isPublic ? " is-on" : ""}`}
                >
                  Private
                </button>
              </div>

              {error ? <p className="text-[14px] text-[#B42318]">{error}</p> : null}

              <button type="submit" disabled={submitting} className="desk-solid-btn w-full py-3.5">
                {submitting ? "Uploading…" : user ? "Upload notes" : "Sign in to upload"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
