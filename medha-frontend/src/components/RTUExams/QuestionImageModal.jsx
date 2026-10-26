import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaXmark, FaImage } from "react-icons/fa6";

/**
 * QuestionImageModal - Modal for viewing question images at full size
 */
const QuestionImageModal = ({ isOpen, imageUrl, questionCode, onClose }) => {
  if (!isOpen || !imageUrl) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={handleBackdropClick}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative rounded-2xl shadow-2xl max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
            style={{ backgroundColor: "var(--bg-secondary)" }}
          >
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b bg-gradient-to-r from-[var(--action-primary)]/10 to-[var(--bg-secondary)]" style={{ borderColor: "var(--border-default)" }}>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg" style={{ backgroundColor: "var(--action-primary)", color: "#fff", opacity: 0.9 }}>
                  <FaImage />
                </div>
                <div>
                  <h3 className="font-bold" style={{ color: "var(--text-primary)" }}>Question Image</h3>
                  <p className="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>{questionCode}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={onClose}
                  className="p-2 rounded-full transition-colors hover:bg-[var(--bg-tertiary)]"
                  style={{ color: "var(--text-tertiary)" }}
                  title="Close"
                >
                  <FaXmark size={20} />
                </button>
              </div>
            </div>

            {/* Image Container */}
            <div className="flex-1 overflow-auto p-4 flex items-center justify-center" style={{ backgroundColor: "var(--bg-tertiary)" }}>
              <img
                src={imageUrl}
                alt={`Question ${questionCode}`}
                className="max-w-full max-h-[70vh] object-contain rounded-lg shadow-lg border"
                style={{ borderColor: "var(--border-default)" }}
                loading="lazy"
              />
            </div>

            {/* Footer */}
            <div className="p-3 border-t text-center" style={{ backgroundColor: "var(--bg-primary)", borderColor: "var(--border-default)" }}>
              <p className="text-xs font-medium" style={{ color: "var(--text-tertiary)" }}>
                Click outside or press Escape to close
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default QuestionImageModal;
