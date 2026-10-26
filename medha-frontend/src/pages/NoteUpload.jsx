import React, { useState } from "react";
import FileUpload from "../components/Upload/FileUpload";
import FilePreview from "../components/Upload/FilePreview";
import OcrTextEditor from "../components/Ocr/OcrTextEditor";
import TextNoteForm from "../components/Notes/TextNoteForm";

const NoteUpload = () => {
  const [file, setFile] = useState(null);
  const [extractedText, setExtractedText] = useState("");
  const [step, setStep] = useState(1);
  const [subjectId, setSubjectId] = useState("");

  const handleFileSelect = (selectedFile) => {
    setFile(selectedFile);
    setStep(2);
    setExtractedText("");
  };

  const handleOcrExtracted = (text) => {
    setExtractedText(text);
    setStep(3);
  };

  const handleSaveNote = async () => {
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      if (file) formData.append("file", file);
      formData.append("content", extractedText);
      formData.append("subject", subjectId);
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/notes`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) {
        alert("Failed to save note: " + (data.message || "Unknown error"));
        return;
      }
      alert("Note saved successfully!");
      setFile(null);
      setExtractedText("");
      setStep(1);
    } catch {
      alert("Server error while saving note.");
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-20 pb-14 flex flex-col items-center font-inter relative overflow-hidden">
      {/* Glass ambient blobs */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute -top-16 left-5 w-80 h-60 bg-gradient-to-tr from-violet-400/25 to-blue-400/10 rounded-full blur-2xl opacity-25 animate-blob"></div>
        <div className="absolute bottom-0 right-1/3 w-72 h-44 bg-gradient-to-r from-blue-400/20 to-purple-400/14 rounded-full blur-2xl opacity-20 animate-blob animation-delay-2000"></div>
        <style>{`
          @keyframes blob { 0% { transform: scale(1) translate(0,0);} 33% { transform: scale(1.1) translate(18px,-16px);} 66% { transform: scale(0.94) translate(-12px,15px);} 100% { transform: scale(1) translate(0,0);} }
          .animate-blob { animation: blob 12s infinite; }
          .animation-delay-2000 { animation-delay: 2s; }
        `}</style>
      </div>
      <div className="max-w-xl w-full z-10">
        <div className="bg-[#18163a]/90 backdrop-blur-2xl border border-violet-400/15 shadow-2xl p-10 rounded-3xl mt-12">
          <h1 className="text-3xl font-extrabold text-center mb-4 bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">
            Upload & OCR Your Notes
          </h1>
          <p className="mb-7 text-lg text-violet-300 text-center">
            Upload a clear image or PDF of your handwritten notes.
            <br />
            <span className="text-blue-300 font-bold">
              The AI will read, digitize, and help you revise!
            </span>
          </p>
          {/* SUBJECT SELECTOR */}
          <div className="mb-6">
            <input
              type="text"
              className="w-full bg-[#18163a]/80 border border-violet-400/20 rounded-xl px-4 py-3 font-medium text-white placeholder-violet-300 focus:border-violet-400 focus:ring-2 focus:ring-violet-400 focus:outline-none transition-all duration-150"
              value={subjectId}
              onChange={(e) => setSubjectId(e.target.value)}
              placeholder="Enter or select subject"
              required
            />
          </div>
          {/* TEXT NOTE FORM */}
          <div className="mb-8">
            <TextNoteForm
              subjectId={subjectId}
              token={localStorage.getItem("token")}
              onNoteCreated={() => {
                alert("Text note saved!");
                // Optionally trigger reload here.
              }}
            />
          </div>
          {/* FILE UPLOAD SECTION */}
          {step === 1 && (
            <div className="mb-8">
              <FileUpload
                onFileSelect={handleFileSelect}
                accept="image/*,application/pdf"
              />
              <div className="text-blue-300 text-center mt-3 text-sm">
                Supported: Image or PDF.
              </div>
            </div>
          )}
          {file && step >= 2 && (
            <div>
              <FilePreview file={file} />
              {step === 2 && (
                <div className="mt-8">
                  <OcrTextEditor file={file} onExtracted={handleOcrExtracted} />
                </div>
              )}
            </div>
          )}
          {step === 3 && (
            <div className="bg-[#18163a]/80 border border-violet-400/15 p-6 mt-7 rounded-2xl shadow-lg flex flex-col gap-4">
              <h2 className="text-xl font-bold bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent mb-2">
                Edit & Save Note
              </h2>
              <textarea
                className="w-full min-h-[140px] border border-violet-400/25 rounded-xl p-3 text-white bg-[#18163a]/80 font-medium placeholder-violet-300 focus:border-violet-400 focus:ring-2 focus:ring-violet-400 focus:outline-none transition-all duration-150"
                value={extractedText}
                onChange={(e) => setExtractedText(e.target.value)}
                placeholder="Extracted text will appear here."
              />
              <div className="flex gap-4 mt-4">
                <button
                  className="bg-gradient-to-r from-violet-600 to-blue-600 text-white font-bold px-7 py-2.5 rounded-xl shadow-xl hover:scale-[1.05] transition-all focus:outline-none focus:ring-2 focus:ring-violet-400"
                  onClick={handleSaveNote}
                  disabled={!extractedText.trim() || !subjectId}
                >
                  Save Note
                </button>
                <button
                  className="bg-gradient-to-r from-violet-400/15 to-blue-400/10 text-violet-200 border border-violet-400/20 rounded-xl px-5 py-2.5 font-medium hover:bg-violet-400/20 transition shadow focus:outline-none"
                  onClick={() => setStep(1)}
                >
                  Start New Upload
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NoteUpload;
