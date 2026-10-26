"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { apiGet } from "@/lib/api";
import { motion } from "framer-motion";
import { ArrowLeft, FileText, Search, Download, Eye, User, FileDown, BookOpen } from "lucide-react";

interface Note {
  _id: string;
  title: string;
  description?: string;
  fileUrl?: string;
  type?: string;
  uploadedBy?: {
    name: string;
  };
  views?: number;
}

export default function SubjectNotesPage() {
  const { subjectName } = useParams();
  const router = useRouter();
  const decodedName = decodeURIComponent(subjectName as string);

  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const res = await apiGet<{ notes: Note[] }>(`/api/notes?subject=${encodeURIComponent(decodedName)}`);
        setNotes(res.notes || []);
      } catch (err) {
        console.error("Error fetching subject notes:", err);
        setNotes([]);
      } finally {
        setLoading(false);
      }
    };
    fetchNotes();
  }, [decodedName]);

  const filteredNotes = notes.filter(
    (note) =>
      !searchQuery ||
      note.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-10 h-10 border-4 border-[var(--border)] border-t-[var(--primary)] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full px-4 py-8 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[var(--card)] border border-[var(--border)] hover:bg-[var(--secondary)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] font-semibold text-sm transition-all mb-6 cursor-pointer"
        >
          <ArrowLeft size={16} /> Back
        </button>

        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[var(--primary)]/10 text-[var(--primary)] text-xs font-bold uppercase tracking-wider mb-3">
            <FileText size={14} /> Notes & Resources
          </div>

          <h1 className="text-3xl md:text-4xl font-black text-[var(--foreground)] tracking-tight mb-2">{decodedName}</h1>
          <p className="text-sm text-[var(--muted-foreground)] font-medium">
            {filteredNotes.length} reference note{filteredNotes.length !== 1 ? "s" : ""} available
          </p>
        </motion.div>
      </div>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="max-w-md mx-auto mb-10"
      >
        <div className="relative">
          <Search
            size={16}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)]"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search notes..."
            className="w-full pl-11 pr-4 py-3 rounded-xl bg-[var(--card)] border border-[var(--border)] text-[var(--foreground)] text-sm outline-none transition-all focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/10"
          />
        </div>
      </motion.div>

      {/* Notes Grid */}
      {filteredNotes.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredNotes.map((note, idx) => {
            const isPDF = note.fileUrl?.endsWith(".pdf") || note.type === "pdf";

            return (
              <motion.div
                key={note._id || idx}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.04, duration: 0.3 }}
                whileHover={{
                  y: -3,
                  boxShadow: "0 10px 25px rgba(0,0,0,0.04)",
                  borderColor: "var(--primary)",
                }}
                className="p-5 rounded-2xl bg-[var(--card)] border border-[var(--border)] cursor-pointer transition-all flex flex-col justify-between"
                onClick={() => note.fileUrl && window.open(note.fileUrl, "_blank")}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        isPDF ? "bg-red-500/10 text-red-500" : "bg-[var(--primary)]/10 text-[var(--primary)]"
                      }`}
                    >
                      <FileText size={18} />
                    </div>

                    {note.fileUrl && (
                      <a
                        href={note.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="px-3 py-1 rounded-lg bg-[var(--primary)]/10 hover:bg-[var(--primary)]/20 border border-[var(--primary)]/15 text-[var(--primary)] text-[10px] font-bold flex items-center gap-1 text-decoration-none transition-all cursor-pointer"
                      >
                        <Download size={10} /> Download
                      </a>
                    )}
                  </div>

                  <h3 className="font-extrabold text-sm text-[var(--foreground)] leading-snug line-clamp-2 mb-2">
                    {note.title || "Untitled Note"}
                  </h3>

                  {note.description && (
                    <p className="text-xs text-[var(--muted-foreground)] leading-relaxed line-clamp-2 mb-4">
                      {note.description}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-3 text-[10px] font-bold text-[var(--muted-foreground)] pt-3 border-t border-[var(--border)]">
                  {note.uploadedBy?.name && (
                    <span className="flex items-center gap-1">
                      <User size={11} /> {note.uploadedBy.name}
                    </span>
                  )}
                  {note.views !== undefined && (
                    <span className="flex items-center gap-1 ml-auto">
                      <Eye size={11} /> {note.views}
                    </span>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16 px-4 bg-[var(--card)] border border-[var(--border)] rounded-2xl max-w-xl mx-auto"
        >
          <FileDown className="mx-auto text-[var(--muted-foreground)] mb-4 opacity-50" size={48} />
          <p className="text-base font-bold text-[var(--foreground)] mb-1">No notes found</p>
          <p className="text-xs text-[var(--muted-foreground)] mb-6">
            {searchQuery
              ? `No notes matching "${searchQuery}" in ${decodedName}.`
              : `No notes available for "${decodedName}" yet. Be the first to upload!`}
          </p>
          <button
            onClick={() => router.push("/notes")}
            className="px-5 py-2 rounded-xl bg-[var(--primary)] text-white text-xs font-bold hover:opacity-90 cursor-pointer"
          >
            Go to Notes Community
          </button>
        </motion.div>
      )}
    </div>
  );
}
