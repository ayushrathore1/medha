import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  GraduationCap,
  Copy,
  Check
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa6";
import { BASE_EASE, getSubjectBadgeStyle } from "./searchConstants";

export default function SearchResultPreview({ search }) {
  const {
    previewItem,
    setPreviewItem,
    copiedLink,
    handleWhatsAppShare,
    handleCopyLink,
    navigate,
  } = search;

  return (
    <>
        {/* ─── QUICK PREVIEW BOTTOM SHEET MODAL (MOBILE FIRST) ───── */}
        <AnimatePresence>
          {previewItem && (
            <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm">
              <motion.div
                initial={{ y: "100%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: "100%", opacity: 0 }}
                transition={{ duration: 0.5, ease: BASE_EASE }}
                className="w-full max-w-xl max-h-[85vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl p-5 sm:p-6 border shadow-2xl space-y-4"
                style={{
                  background: "var(--bg-tertiary)",
                  borderColor: "var(--border-default)",
                }}
              >
                <div className="w-10 h-1 rounded-full bg-[var(--border-default)] mx-auto -mt-1 mb-2 sm:hidden" />

                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span
                      className="px-2.5 py-1 rounded-md text-xs font-semibold"
                      style={getSubjectBadgeStyle(previewItem.subject || previewItem.title)}
                    >
                      {previewItem.subject || "Engineering resource"}
                    </span>
                    <span className="text-xs font-semibold text-[var(--text-secondary)]">
                      {previewItem.semester || "RTU"}
                    </span>
                  </div>
                  <button
                    onClick={() => setPreviewItem(null)}
                    className="p-1 rounded-full hover:bg-[var(--bg-secondary)] text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>

                <div>
                  <h3 className="text-base sm:text-lg font-bold text-[var(--text-primary)] leading-snug">
                    {previewItem.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-2 leading-relaxed" style={{ textWrap: "pretty" }}>
                    {previewItem.description || previewItem.snippet || "Full verified syllabus material and exam preparation guide."}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-default)] text-xs">
                  <div>
                    <span className="text-[10px] uppercase font-semibold text-[var(--text-tertiary)]">Resource type</span>
                    <p className="font-semibold text-[var(--text-primary)] mt-0.5 capitalize">
                      {previewItem.noteType || previewItem.category || "Study material"}
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-semibold text-[var(--text-tertiary)]">Contributor</span>
                    <p className="font-semibold text-[var(--text-primary)] mt-0.5 truncate">
                      {previewItem.author || previewItem.channelTitle || "Medha engineering faculty"}
                    </p>
                  </div>
                </div>

                <div className="space-y-2 pt-1">
                  <button
                    onClick={(e) => handleWhatsAppShare(previewItem, e)}
                    className="w-full py-2.5 px-3 rounded-lg text-xs sm:text-sm font-semibold bg-[#25D366] text-white hover:bg-green-600 transition-colors flex items-center justify-center gap-2 shadow-sm active:scale-[0.98]"
                  >
                    <FaWhatsapp size={15} />
                    <span>Share with classmates on WhatsApp</span>
                  </button>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => {
                        const target = previewItem.redirects?.subjectNotes || previewItem.redirects?.subjectYouTube || previewItem.redirects?.pyqAnalysis || "/notes";
                        setPreviewItem(null);
                        navigate(target);
                      }}
                      className="py-2 px-3 rounded-lg text-xs font-semibold bg-[var(--action-primary, #7DC67A)] text-white hover:opacity-90 transition-opacity flex items-center justify-center gap-1.5 shadow-sm active:scale-[0.98]"
                    >
                      <GraduationCap size={15} />
                      <span>Open subject hub</span>
                    </button>

                    <button
                      onClick={(e) => handleCopyLink(previewItem, e)}
                      className="py-2 px-3 rounded-lg text-xs font-semibold bg-[var(--bg-secondary)] border border-[var(--border-default)] text-[var(--text-primary)] hover:border-[#7DC67A] transition-colors flex items-center justify-center gap-1.5 active:scale-[0.98]"
                    >
                      {copiedLink ? <Check size={14} className="text-[#7DC67A]" /> : <Copy size={14} />}
                      <span>{copiedLink ? "Link copied" : "Copy link"}</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
    </>
  );
}
