import React, { useCallback, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FileImage, FileUp } from "lucide-react";
import { AuthContext } from "../AuthContext";
import RevisionShell from "../components/Revision/RevisionShell";
import { loginPath } from "../components/Revision/revisionUtils";
import { FileUpload } from "@/components/extend/file-upload";
import { SUBJECTS, getSubjectBySlug } from "../data/subjectCatalog";
import { useMergedSubjects } from "../hooks/useMergedSubjects";
import api from "../api/api";

const SEMESTERS = ["3rd", "4th", "5th", "6th"];
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

export default function UploadNotes() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const { subjects: mergedSubjects } = useMergedSubjects();
  const subjectOptions = mergedSubjects.length ? mergedSubjects : SUBJECTS;

  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [subjectSlug, setSubjectSlug] = useState("");
  const [topic, setTopic] = useState("");
  const [semester, setSemester] = useState("");
  const [description, setDescription] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const subject = subjectOptions.find((s) => s.slug === subjectSlug) || getSubjectBySlug(subjectSlug);

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
      navigate(loginPath("/upload"));
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
      if (topic) formData.append("noteType", topic);
      if (description) formData.append("content", description);
      await api.post("/notes", formData);
      setDone(true);
    } catch (err) {
      setError(err.response?.data?.error || "Upload failed. Try a smaller PDF.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <RevisionShell title="Upload" desk>
      <div className="desk-page">
        <header className="mb-4">
          <p className="desk-eyebrow">Share with Medha</p>
          <h1 className="desk-title">Upload notes</h1>
          <p className="desk-sub">
            PDF or a scan of class notes, up to 25MB. Public notes can be shared with your campus; private stays in your library.
          </p>
        </header>

        {user ? (
          <div className="desk-banner desk-banner--violet mb-4">
            <div>
              <strong>Your uploads</strong>
              <span>Review what you’ve shared and what’s still in review</span>
            </div>
            <button type="button" className="desk-ghost-btn" onClick={() => navigate("/uploads")}>
              Open library
            </button>
          </div>
        ) : (
          <div className="desk-banner desk-banner--orange mb-4">
            <div>
              <strong>Sign in to upload</strong>
              <span>You can fill the form now — uploading needs an account.</span>
            </div>
            <button type="button" className="desk-solid-btn" onClick={() => navigate(loginPath("/upload"))}>
              Sign in
            </button>
          </div>
        )}

        <section className="desk-panel">
          {done ? (
            <div className="py-2">
              <p className="desk-title" style={{ fontSize: 24 }}>
                {isPublic ? "Upload complete" : "Private notes saved"}
              </p>
              <p className="desk-sub">
                {isPublic
                  ? "Your file is uploaded. We’ll email you when it’s live for everyone, or if we need a different file."
                  : "Only you can see these notes. No public review runs on private uploads."}
              </p>
              <button type="button" onClick={() => navigate("/uploads")} className="desk-solid-btn mt-5">
                See your uploads
              </button>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-5">
              <div className="rounded-xl border border-[#e8e8e8] bg-white p-3 sm:p-4">
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
                <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="DBMS notes, Unit 1" />
              </label>

              <label className="desk-field">
                <span>Subject</span>
                <select
                  value={subjectSlug}
                  onChange={(e) => {
                    setSubjectSlug(e.target.value);
                    setTopic("");
                  }}
                >
                  <option value="">Select subject</option>
                  {subjectOptions.map((item) => (
                    <option key={`${item.semester}-${item.slug}`} value={item.slug}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </label>

              <label className="desk-field">
                <span>Unit</span>
                <select value={topic} onChange={(e) => setTopic(e.target.value)} disabled={!subject}>
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
                  className="min-h-24"
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
              <p className="text-[12px] text-[#8A8A8A]">
                {isPublic
                  ? "Shared with students after upload completes successfully."
                  : "Only visible in your library. You can make it public later from Your uploads."}
              </p>

              {error ? <p className="text-[14px] text-[#B42318]">{error}</p> : null}

              <button type="submit" disabled={submitting} className="desk-solid-btn w-full py-3.5">
                {submitting ? "Uploading…" : "Upload notes"}
              </button>
            </form>
          )}
        </section>
      </div>
    </RevisionShell>
  );
}
