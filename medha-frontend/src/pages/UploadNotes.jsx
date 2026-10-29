import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthContext";
import RevisionShell from "../components/Revision/RevisionShell";
import { loginPath } from "../components/Revision/revisionUtils";
import { SUBJECTS, getSubjectBySlug } from "../data/subjectCatalog";
import api from "../api/api";

const SEMESTERS = ["3rd", "4th", "5th", "6th"];
const FIELD =
  "w-full border-b border-[#E5E5E5] bg-transparent py-2 text-[15px] text-[#1F1F1F] shadow-none outline-none focus:border-[#1F1F1F] disabled:opacity-50";

export default function UploadNotes() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [subjectSlug, setSubjectSlug] = useState("");
  const [topic, setTopic] = useState("");
  const [semester, setSemester] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const subject = getSubjectBySlug(subjectSlug);

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
    if (file.size > 25 * 1024 * 1024) {
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
      formData.append("isPublic", "true");
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
    <RevisionShell title="Share notes">
      {user && (
        <div className="mb-6 flex items-baseline justify-between text-[13px]">
          <p className="text-[#5C5C5C]">Aura {user.auraPoints ?? 0} · earned when people download your notes</p>
          <button type="button" onClick={() => navigate("/uploads")} className="text-[#1F1F1F] underline underline-offset-2">
            Your uploads
          </button>
        </div>
      )}

      {!user && (
        <p className="mb-6 text-[14px] text-[#5C5C5C]">
          You can fill the form. Uploading needs an account.{" "}
          <button type="button" className="text-[#1F1F1F] underline underline-offset-2" onClick={() => navigate(loginPath("/upload"))}>
            Sign in
          </button>
        </p>
      )}

      {done ? (
        <div className="py-6">
          <p className="text-[22px] font-semibold tracking-[-0.03em]">These notes are live.</p>
          <p className="mt-2 text-[14px] leading-6 text-[#5C5C5C]">
            We checked the file and accepted it as study material. You earn Aura each time another student downloads it.
          </p>
          <button
            type="button"
            onClick={() => navigate("/uploads")}
            className="mt-6 bg-[#1F1F1F] px-4 py-2.5 text-[13px] text-white"
          >
            See your uploads
          </button>
        </div>
      ) : (
        <form onSubmit={submit} className="space-y-6">
          <p className="text-[14px] leading-6 text-[#5C5C5C]">
            PDF or a scan of class notes. We read the file before it goes live. Comics, memes, and anything that isn’t course material is rejected.
          </p>

          <label className="block cursor-pointer border border-dashed border-[#E5E5E5] px-4 py-8 text-center">
            <input
              type="file"
              accept="application/pdf,image/*"
              className="hidden"
              onChange={(e) => {
                const next = e.target.files?.[0];
                setFile(next || null);
                if (next && !title) setTitle(next.name.replace(/\.[^.]+$/, ""));
              }}
            />
            <p className="text-[15px] font-medium">{file ? file.name : "Choose a PDF or image"}</p>
            <p className="mt-1 text-[12px] text-[#8A8A8A]">Up to 25MB.</p>
          </label>

          <Field label="Title">
            <input value={title} onChange={(e) => setTitle(e.target.value)} className={FIELD} placeholder="DBMS notes, Unit 1" />
          </Field>

          <Field label="Subject">
            <select value={subjectSlug} onChange={(e) => { setSubjectSlug(e.target.value); setTopic(""); }} className={FIELD}>
              <option value="">Select subject</option>
              {SUBJECTS.map((item) => (
                <option key={item.slug} value={item.slug}>{item.name}</option>
              ))}
            </select>
          </Field>

          <Field label="Unit">
            <select value={topic} onChange={(e) => setTopic(e.target.value)} className={FIELD} disabled={!subject}>
              <option value="">Optional</option>
              {subject?.units.map((unit) => (
                <option key={unit.slug} value={unit.title}>{unit.title}</option>
              ))}
            </select>
          </Field>

          <Field label="Semester">
            <select value={semester} onChange={(e) => setSemester(e.target.value)} className={FIELD}>
              <option value="">Optional</option>
              {SEMESTERS.map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>
          </Field>

          <Field label="What’s inside">
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} className={`${FIELD} min-h-20`} placeholder="Handwritten unit 1, covers ER model and keys." />
          </Field>

          {error && <p className="text-[14px] text-[#B42318]">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-[#1F1F1F] px-4 py-3 text-[14px] text-white disabled:opacity-50"
          >
            {submitting ? "Checking the file…" : "Upload notes"}
          </button>
        </form>
      )}
    </RevisionShell>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="mb-1 block text-[12px] text-[#8A8A8A]">{label}</span>
      {children}
    </label>
  );
}
