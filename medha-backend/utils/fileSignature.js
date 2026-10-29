const path = require("path");

const DEFAULT_MAX_FILE_SIZE = 25 * 1024 * 1024; // 25 MB
const DEFAULT_MAX_FILES = 1;

const JPEG_MIMES = ["image/jpeg", "image/jpg", "image/pjpeg"];
const PNG_MIMES = ["image/png"];
const GIF_MIMES = ["image/gif"];
const PDF_MIMES = ["application/pdf"];

const TYPE_BY_EXT = {
  ".jpg": { type: "jpeg", mimes: JPEG_MIMES },
  ".jpeg": { type: "jpeg", mimes: JPEG_MIMES },
  ".png": { type: "png", mimes: PNG_MIMES },
  ".gif": { type: "gif", mimes: GIF_MIMES },
  ".pdf": { type: "pdf", mimes: PDF_MIMES },
};

function startsWith(buffer, bytes) {
  if (!buffer || buffer.length < bytes.length) return false;
  for (let i = 0; i < bytes.length; i += 1) {
    if (buffer[i] !== bytes[i]) return false;
  }
  return true;
}

function detectTypeFromHeader(header) {
  if (!header || header.length === 0) return null;
  if (startsWith(header, [0x25, 0x50, 0x44, 0x46])) return "pdf"; // %PDF
  if (startsWith(header, [0xff, 0xd8, 0xff])) return "jpeg";
  if (startsWith(header, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) return "png";
  if (startsWith(header, [0x47, 0x49, 0x46, 0x38, 0x37, 0x61])) return "gif"; // GIF87a
  if (startsWith(header, [0x47, 0x49, 0x46, 0x38, 0x39, 0x61])) return "gif"; // GIF89a
  return null;
}

function normalizeMime(mimetype = "") {
  return String(mimetype).toLowerCase().split(";")[0].trim();
}

function getExtension(originalname = "") {
  return path.extname(originalname || "").toLowerCase();
}

function getMaxFileSize() {
  const parsed = parseInt(process.env.NOTE_UPLOAD_MAX_BYTES, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : DEFAULT_MAX_FILE_SIZE;
}

function getMaxFiles() {
  const parsed = parseInt(process.env.NOTE_UPLOAD_MAX_FILES, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : DEFAULT_MAX_FILES;
}

function formatMaxSize(bytes = getMaxFileSize()) {
  const mb = bytes / (1024 * 1024);
  return Number.isInteger(mb) ? `${mb}MB` : `${mb.toFixed(1)}MB`;
}

/**
 * Declare whether the client-supplied name and MIME are an allowed pair.
 * Does not inspect file contents.
 */
function matchDeclaredType({ originalname, mimetype }) {
  const ext = getExtension(originalname);
  const mime = normalizeMime(mimetype);
  const declared = TYPE_BY_EXT[ext];

  if (!declared) {
    return {
      ok: false,
      reason: "Only image or PDF files are allowed (jpeg, jpg, png, gif, pdf).",
    };
  }

  if (!declared.mimes.includes(mime)) {
    return {
      ok: false,
      reason: "File extension and MIME type do not match.",
    };
  }

  return { ok: true, type: declared.type, ext, mime };
}

/**
 * Require extension, MIME type, and magic bytes to describe the same file type.
 */
function validateFileIdentity({ originalname, mimetype, header }) {
  const declared = matchDeclaredType({ originalname, mimetype });
  if (!declared.ok) return declared;

  const detected = detectTypeFromHeader(header);
  if (!detected) {
    return {
      ok: false,
      reason: "File content does not match a supported image or PDF type.",
    };
  }

  if (detected !== declared.type) {
    return {
      ok: false,
      reason: "File content does not match the declared type.",
    };
  }

  return { ok: true, type: detected, ext: declared.ext, mime: declared.mime };
}

module.exports = {
  DEFAULT_MAX_FILE_SIZE,
  DEFAULT_MAX_FILES,
  TYPE_BY_EXT,
  detectTypeFromHeader,
  matchDeclaredType,
  validateFileIdentity,
  getMaxFileSize,
  getMaxFiles,
  formatMaxSize,
  getExtension,
  normalizeMime,
};
