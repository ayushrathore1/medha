import React, { useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileImage, FileUp } from "lucide-react";
import { FileUpload } from "@/components/extend/file-upload";
import {
  MAX_NOTE_UPLOAD_BYTES,
  SEMESTERS,
  UPLOAD_TYPES,
  labelStyle,
  inputStyle,
  inputFocus,
  inputBlur,
} from "./notesConstants";

const NOTE_ACCEPT = [
  ".pdf",
  ".png",
  ".jpg",
  ".jpeg",
  ".gif",
  "application/pdf",
  "image/png",
  "image/jpeg",
  "image/gif",
].join(",");
const NOTE_FILE_TYPES = [
  { label: "PDF", icon: FileUp },
  { label: "Image", icon: FileImage },
];

export default function UploadWizard({ isOpen, onClose, onUpload, uploading }) {
  const [step, setStep] = useState(1);
  const [title, setTitle] = useState("");
  const [semester, setSemester] = useState("");
  const [subject, setSubject] = useState("");
  const [noteType, setNoteType] = useState("");
  const [file, setFile] = useState(null);
  const [description, setDescription] = useState("");
  const [rights, setRights] = useState(false);
  const [edu, setEdu] = useState(false);
  const [fileError, setFileError] = useState("");

  const acceptFile = useCallback((nextFile) => {
    if (!nextFile) return;
    if (nextFile.size > MAX_NOTE_UPLOAD_BYTES) {
      setFileError("File too large. Maximum size is 25MB.");
      setFile(null);
      return;
    }
    setFileError("");
    setFile(nextFile);
  }, []);

  const handleFilesAccepted = useCallback(
    (files) => {
      acceptFile(files?.[0]);
    },
    [acceptFile]
  );

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!title || !file) return;
    onUpload({ title, semester, subject: subject || noteType, file, description, noteType });
    // Reset
    setStep(1);
    setTitle("");
    setSemester("");
    setSubject("");
    setNoteType("");
    setFile(null);
    setFileError("");
    setDescription("");
    setRights(false);
    setEdu(false);
  };

  const stepLabels = ["What", "Upload", "Finish"];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="notes-upload-overlay"
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(31,31,31,0.6)",
        backdropFilter: "blur(4px)",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
      }}
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="notes-upload-card"
        style={{
          maxWidth: 560,
          width: "100%",
          background: "white",
          borderRadius: 20,
          padding: 32,
          maxHeight: "95vh",
          overflowY: "auto",
        }}
      >
        {/* Step indicator */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0, marginBottom: 32 }}>
          {stepLabels.map((l, i) => {
            const num = i + 1;
            const done = step > num;
            const active = step === num;
            return (
              <React.Fragment key={num}>
                {i > 0 && (
                  <div style={{ width: 40, height: 2, background: done ? "#7DC67A" : "#E5E5E5", margin: "0 4px" }} />
                )}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: "50%",
                      background: done ? "#7DC67A" : active ? "#1F1F1F" : "white",
                      border: `2px solid ${done ? "#7DC67A" : active ? "#1F1F1F" : "#E5E5E5"}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 12,
                      fontWeight: 700,
                      color: done || active ? "white" : "#9A9A9A",
                    }}
                  >
                    {done ? "✓" : num}
                  </div>
                  <span style={{ fontSize: 10, color: active ? "#1F1F1F" : "#9A9A9A", fontWeight: 600 }}>{l}</span>
                </div>
              </React.Fragment>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="s1" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h3 style={{ fontSize: 22, fontWeight: 800, color: "#1F1F1F", marginBottom: 4 }}>What are you sharing?</h3>
              <p style={{ fontSize: 14, color: "#6B6B6B", marginBottom: 24 }}>This helps students find your note faster.</p>

              {/* Title */}
              <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>NOTE TITLE</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. OOPs Unit 3 — Inheritance Notes"
                  style={inputStyle}
                  onFocus={inputFocus}
                  onBlur={inputBlur}
                />
                <span style={{ fontSize: 11, color: "#9A9A9A", marginTop: 4, display: "block" }}>Be specific — include subject + topic</span>
              </div>

              {/* Semester */}
              <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>SEMESTER</label>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 6 }}>
                  {["1st","2nd","3rd","4th","5th","6th","7th","8th"].map(s => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSemester(s)}
                      style={{
                        padding: "10px 0",
                        borderRadius: 10,
                        fontSize: 13,
                        fontWeight: 600,
                        textAlign: "center",
                        background: semester === s ? "#1F1F1F" : "white",
                        color: semester === s ? "white" : "#6B6B6B",
                        border: `1.5px solid ${semester === s ? "#1F1F1F" : "#E5E5E5"}`,
                        cursor: "pointer",
                        transition: "all 150ms",
                      }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Subject */}
              <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>SUBJECT</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. OOPs, DBMS, DSA..."
                  style={inputStyle}
                  onFocus={inputFocus}
                  onBlur={inputBlur}
                />
              </div>

              {/* Note type */}
              <div style={{ marginBottom: 20 }}>
                <label style={labelStyle}>TYPE</label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {UPLOAD_TYPES.map(t => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setNoteType(t)}
                      style={{
                        padding: "8px 14px",
                        borderRadius: 10,
                        fontSize: 13,
                        fontWeight: 600,
                        background: noteType === t ? "#F0FAF0" : "white",
                        color: noteType === t ? "#4A9E47" : "#6B6B6B",
                        border: `1.5px solid ${noteType === t ? "#7DC67A" : "#E5E5E5"}`,
                        cursor: "pointer",
                        transition: "all 150ms",
                      }}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={() => { if (title) setStep(2); }}
                style={{
                  width: "100%",
                  padding: 14,
                  background: title ? "#1F1F1F" : "#9A9A9A",
                  color: "white",
                  borderRadius: 12,
                  border: "none",
                  fontSize: 15,
                  fontWeight: 700,
                  cursor: title ? "pointer" : "not-allowed",
                }}
              >
                Next →
              </button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="s2" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 30 }}>
              <h3 style={{ fontSize: 22, fontWeight: 800, color: "#1F1F1F", marginBottom: 4 }}>Upload your file</h3>
              <p style={{ fontSize: 14, color: "#6B6B6B", marginBottom: 24 }}>Drag & drop or click to browse.</p>

              <div className="mb-5 rounded-xl border border-[#E5E5E5] bg-white p-3">
                <FileUpload
                  multiple={false}
                  accept={NOTE_ACCEPT}
                  acceptedFileTypes={NOTE_FILE_TYPES}
                  title="Drop notes or browse"
                  description="PDF, JPG, PNG · Max 25 MB"
                  browseLabel="Browse files"
                  showBorderBeam
                  showFileList
                  onFilesAccepted={handleFilesAccepted}
                />
                {fileError ? (
                  <p className="mt-2 text-center text-[12px] font-medium text-[#DC2626]">{fileError}</p>
                ) : null}
              </div>

              <div style={{ display: "flex", gap: 8 }}>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  style={{
                    padding: "12px 24px",
                    background: "white",
                    color: "#6B6B6B",
                    borderRadius: 10,
                    border: "1.5px solid #E5E5E5",
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  ← Back
                </button>
                <button
                  type="button"
                  onClick={() => { if (file) setStep(3); }}
                  style={{
                    flex: 1,
                    padding: 14,
                    background: file ? "#1F1F1F" : "#9A9A9A",
                    color: "white",
                    borderRadius: 12,
                    border: "none",
                    fontSize: 15,
                    fontWeight: 700,
                    cursor: file ? "pointer" : "not-allowed",
                  }}
                >
                  Next →
                </button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="s3" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 30 }}>
              <h3 style={{ fontSize: 22, fontWeight: 800, color: "#1F1F1F", marginBottom: 4 }}>Almost done!</h3>
              <p style={{ fontSize: 14, color: "#6B6B6B", marginBottom: 24 }}>Add some context and share.</p>

              {/* Preview */}
              <div
                style={{
                  background: "#F6F6F6",
                  borderRadius: 12,
                  padding: 16,
                  marginBottom: 16,
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                }}
              >
                <div
                  style={{
                    width: 48,
                    height: 56,
                    background: "white",
                    borderRadius: 6,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 20,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                  }}
                >
                  📄
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#1F1F1F" }}>{title}</div>
                  <div style={{ fontSize: 12, color: "#9A9A9A" }}>
                    {file?.name} · {file ? `${(file.size / 1024 / 1024).toFixed(1)} MB` : ""}
                  </div>
                </div>
              </div>

              {/* Description */}
              <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>ADD CONTEXT (OPTIONAL)</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. This covers Unit 3 and 4 of OOPs. Includes examples."
                  rows={3}
                  style={{ ...inputStyle, resize: "vertical" }}
                  onFocus={inputFocus}
                  onBlur={inputBlur}
                />
              </div>

              {/* Checkboxes */}
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#6B6B6B", cursor: "pointer", marginBottom: 8 }}>
                  <input type="checkbox" checked={rights} onChange={(e) => setRights(e.target.checked)} />
                  I have the right to share this material
                </label>
                <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#6B6B6B", cursor: "pointer" }}>
                  <input type="checkbox" checked={edu} onChange={(e) => setEdu(e.target.checked)} />
                  This is for educational purposes only
                </label>
              </div>

              <div style={{ display: "flex", gap: 8 }}>
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  style={{
                    padding: "12px 24px",
                    background: "white",
                    color: "#6B6B6B",
                    borderRadius: 10,
                    border: "1.5px solid #E5E5E5",
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  ← Back
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={uploading || !rights || !edu}
                  style={{
                    flex: 1,
                    padding: 14,
                    background: rights && edu && !uploading ? "#7DC67A" : "#9A9A9A",
                    color: "#1F1F1F",
                    borderRadius: 12,
                    border: "none",
                    fontSize: 15,
                    fontWeight: 700,
                    cursor: rights && edu ? "pointer" : "not-allowed",
                  }}
                >
                  {uploading ? "Uploading..." : "Share with community →"}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
