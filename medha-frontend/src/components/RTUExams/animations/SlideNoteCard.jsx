/**
 * SlideNoteCard - Premium note card for animation slides
 * Features: Glassmorphism, Medha logo background, font selector, image upload, download
 */
import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaTimes,
  FaFont,
  FaImage,
  FaDownload,
  FaPalette,
  FaTextHeight,
  FaSave,
  FaTrash,
} from "react-icons/fa";
import html2canvas from "html2canvas";

// Available fonts
const FONTS = [
  { name: "Inter", value: "'Inter', sans-serif" },
  { name: "Roboto", value: "'Roboto', sans-serif" },
  { name: "Georgia", value: "'Georgia', serif" },
  { name: "Fira Code", value: "'Fira Code', monospace" },
  { name: "Playfair", value: "'Playfair Display', serif" },
];

const FONT_SIZES = ["14px", "16px", "18px", "20px", "24px"];

const BG_COLORS = [
  { name: "Indigo", value: "rgba(99,102,241,0.15)" },
  { name: "Purple", value: "rgba(139,92,246,0.15)" },
  { name: "Emerald", value: "rgba(16,185,129,0.15)" },
  { name: "Amber", value: "rgba(245,158,11,0.15)" },
  { name: "Rose", value: "rgba(244,63,94,0.15)" },
  { name: "Slate", value: "rgba(71,85,105,0.2)" },
];

/**
 * SlideNoteCard Component
 * @param {boolean} isOpen - Whether the note card is visible
 * @param {function} onClose - Close handler
 * @param {object} note - Current note data
 * @param {function} onSave - Save handler (note data)
 * @param {function} onImageUpload - Image upload handler
 * @param {boolean} isEditable - Whether the note is editable (admin/team)
 * @param {number} stepNumber - Current slide step number
 */
const SlideNoteCard = ({
  isOpen,
  onClose,
  note = {},
  onSave,
  onImageUpload,
  isEditable = false,
  stepNumber = 1,
}) => {
  const [content, setContent] = useState(note.content || "");
  const [fontFamily, setFontFamily] = useState(note.fontFamily || "Inter");
  const [fontSize, setFontSize] = useState(note.fontSize || "16px");
  const [fontColor, setFontColor] = useState(note.fontColor || "#ffffff");
  const [backgroundColor, setBackgroundColor] = useState(
    note.backgroundColor || "rgba(99,102,241,0.15)"
  );
  const [imageUrl, setImageUrl] = useState(note.imageUrl || "");
  const [showFontMenu, setShowFontMenu] = useState(false);
  const [showColorMenu, setShowColorMenu] = useState(false);

  const cardRef = useRef(null);
  const fileInputRef = useRef(null);

  // Sync state when note prop changes
  React.useEffect(() => {
    setContent(note.content || "");
    setFontFamily(note.fontFamily || "Inter");
    setFontSize(note.fontSize || "16px");
    setFontColor(note.fontColor || "#ffffff");
    setBackgroundColor(note.backgroundColor || "rgba(99,102,241,0.15)");
    setImageUrl(note.imageUrl || "");
  }, [note, isOpen]);

  // Handle image upload
  const handleImageSelect = async (e) => {
    const file = e.target.files[0];
    if (file && onImageUpload) {
      const url = await onImageUpload(file);
      if (url) setImageUrl(url);
    }
  };

  // Download card as image
  const handleDownload = async () => {
    if (!cardRef.current) return;

    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: "#1e1b4b",
        scale: 2,
        useCORS: true,
      });

      const link = document.createElement("a");
      link.download = `medha-note-step-${stepNumber}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (error) {
      console.error("Error downloading card:", error);
    }
  };

  // Save changes
  const handleSave = () => {
    if (onSave) {
      onSave({
        content,
        fontFamily,
        fontSize,
        fontColor,
        backgroundColor,
        imageUrl,
      });
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ background: "rgba(0,0,0,0.8)", backdropFilter: "blur(8px)" }}
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-2xl"
        >
          {/* Toolbar (for editable mode) */}
          {isEditable && (
            <div className="flex items-center gap-2 mb-3 p-2 bg-[#1e1b4b]/80 rounded-xl backdrop-blur-sm border border-[var(--border-default)]">
              {/* Font Selector */}
              <div className="relative">
                <button
                  onClick={() => {
                    setShowFontMenu(!showFontMenu);
                    setShowColorMenu(false);
                  }}
                  className="p-2 rounded-lg hover:bg-white/10 text-white transition-all"
                  title="Font Family"
                >
                  <FaFont size={16} />
                </button>
                {showFontMenu && (
                  <div className="absolute top-full left-0 mt-1 bg-[#1e293b] border border-[var(--border-default)] rounded-lg shadow-xl z-10 py-1">
                    {FONTS.map((font) => (
                      <button
                        key={font.name}
                        onClick={() => {
                          setFontFamily(font.name);
                          setShowFontMenu(false);
                        }}
                        className={`block w-full text-left px-4 py-2 text-sm hover:bg-white/10 ${
                          fontFamily === font.name
                            ? "text-purple-400"
                            : "text-white"
                        }`}
                        style={{ fontFamily: font.value }}
                      >
                        {font.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Font Size */}
              <select
                value={fontSize}
                onChange={(e) => setFontSize(e.target.value)}
                className="p-2 rounded-lg bg-white/10 text-white text-sm border-none outline-none"
              >
                {FONT_SIZES.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>

              {/* Background Color */}
              <div className="relative">
                <button
                  onClick={() => {
                    setShowColorMenu(!showColorMenu);
                    setShowFontMenu(false);
                  }}
                  className="p-2 rounded-lg hover:bg-white/10 text-white transition-all"
                  title="Background Color"
                >
                  <FaPalette size={16} />
                </button>
                {showColorMenu && (
                  <div className="absolute top-full left-0 mt-1 bg-[#1e293b] border border-[var(--border-default)] rounded-lg shadow-xl z-10 p-2 flex gap-2">
                    {BG_COLORS.map((color) => (
                      <button
                        key={color.name}
                        onClick={() => {
                          setBackgroundColor(color.value);
                          setShowColorMenu(false);
                        }}
                        className={`w-8 h-8 rounded-lg border-2 ${
                          backgroundColor === color.value
                            ? "border-white"
                            : "border-transparent"
                        }`}
                        style={{ background: color.value }}
                        title={color.name}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Image Upload */}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="p-2 rounded-lg hover:bg-white/10 text-white transition-all"
                title="Upload Image"
              >
                <FaImage size={16} />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
              />

              <div className="flex-1" />

              {/* Download */}
              <button
                onClick={handleDownload}
                className="p-2 rounded-lg hover:bg-white/10 text-white transition-all"
                title="Download as PNG"
              >
                <FaDownload size={16} />
              </button>

              {/* Save */}
              <button
                onClick={handleSave}
                className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-semibold text-sm flex items-center gap-2"
              >
                <FaSave size={14} /> Save
              </button>
            </div>
          )}

          {/* Main Card */}
          <div
            ref={cardRef}
            className="relative rounded-2xl overflow-hidden"
            style={{
              background: backgroundColor,
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(255,255,255,0.1)",
              boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5)",
            }}
          >
            {/* Medha Logo Background (Faded) */}
            <div
              className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none"
              style={{
                background:
                  "radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 70%)",
              }}
            >
              <div className="text-[200px] font-black text-white select-none">
                M
              </div>
            </div>

            {/* Header */}
            <div className="relative p-5 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white"
                  style={{
                    background: "linear-gradient(135deg, #6366f1, #a855f7)",
                    boxShadow: "0 4px 15px rgba(139,92,246,0.4)",
                  }}
                >
                  {stepNumber}
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg">
                    Teacher's Note
                  </h3>
                  <p className="text-white/50 text-xs">Step {stepNumber}</p>
                </div>
              </div>

              {!isEditable && (
                <button
                  onClick={handleDownload}
                  className="p-2 rounded-lg hover:bg-white/10 text-white/70 hover:text-white transition-all"
                  title="Download as PNG"
                >
                  <FaDownload size={18} />
                </button>
              )}

              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-white/10 text-white/70 hover:text-white transition-all"
              >
                <FaTimes size={18} />
              </button>
            </div>

            {/* Content */}
            <div className="relative p-6 min-h-[200px]">
              {isEditable ? (
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Add your notes here..."
                  className="w-full h-full min-h-[150px] bg-transparent text-white resize-none outline-none"
                  style={{
                    fontFamily:
                      FONTS.find((f) => f.name === fontFamily)?.value ||
                      "'Inter', sans-serif",
                    fontSize: fontSize,
                    color: fontColor,
                    lineHeight: 1.7,
                  }}
                />
              ) : (
                <p
                  className="text-white whitespace-pre-wrap"
                  style={{
                    fontFamily:
                      FONTS.find((f) => f.name === fontFamily)?.value ||
                      "'Inter', sans-serif",
                    fontSize: fontSize,
                    color: fontColor,
                    lineHeight: 1.7,
                  }}
                >
                  {content || "No notes for this slide."}
                </p>
              )}

              {/* Uploaded Image */}
              {imageUrl && (
                <div className="mt-4 relative">
                  <img
                    src={imageUrl}
                    alt="Note illustration"
                    className="max-w-full rounded-xl border border-white/10"
                  />
                  {isEditable && (
                    <button
                      onClick={() => setImageUrl("")}
                      className="absolute top-2 right-2 p-2 bg-red-500/80 hover:bg-red-500 rounded-lg text-white"
                    >
                      <FaTrash size={12} />
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="relative px-6 py-4 border-t border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center"
                  style={{
                    background: "linear-gradient(135deg, #6366f1, #a855f7)",
                  }}
                >
                  <span className="text-[10px] font-black text-white">M</span>
                </div>
                <span className="text-white/40 text-xs">Medha Revision</span>
              </div>
              <span className="text-white/30 text-xs">
                {fontFamily} • {fontSize}
              </span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SlideNoteCard;
