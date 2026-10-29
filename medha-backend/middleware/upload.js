// Multer integration for local disk uploads.
// Files are saved locally first, then content-checked before any PDF/OCR/cloud work.
require("dotenv").config();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const {
  matchDeclaredType,
  validateFileIdentity,
  getMaxFileSize,
  getMaxFiles,
  formatMaxSize,
} = require("../utils/fileSignature");

const DEFAULT_UPLOAD_DIR = path.join(__dirname, "..", "uploads", "notes");

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function getUploadDir(overrideDir) {
  const dir = overrideDir || process.env.NOTE_UPLOAD_DIR || DEFAULT_UPLOAD_DIR;
  ensureDir(dir);
  return dir;
}

function removeUploadedFile(fileOrPath) {
  const filePath = typeof fileOrPath === "string" ? fileOrPath : fileOrPath?.path;
  if (!filePath) return;
  fs.unlink(filePath, (err) => {
    if (err && err.code !== "ENOENT") {
      console.warn("[Upload] Failed to remove temp file:", err.message);
    }
  });
}

function removeRequestUploads(req) {
  if (req?.file) removeUploadedFile(req.file);
  if (Array.isArray(req?.files)) {
    req.files.forEach(removeUploadedFile);
  }
}

function fileFilter(req, file, cb) {
  const declared = matchDeclaredType({
    originalname: file.originalname,
    mimetype: file.mimetype,
  });

  if (!declared.ok) {
    const error = new Error(declared.reason);
    error.code = "INVALID_FILE_TYPE";
    error.status = 400;
    error.statusCode = 400;
    return cb(error);
  }

  cb(null, true);
}

function buildStorage(destDir) {
  return multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, destDir);
    },
    filename: (req, file, cb) => {
      const baseName = file.originalname
        .replace(/\.[^/.]+$/, "")
        .replace(/[^a-zA-Z0-9_-]/g, "_")
        .replace(/_+/g, "_")
        .replace(/^_|_$/g, "")
        .trim();

      const ext = path.extname(file.originalname).toLowerCase();
      const safeFilename = `${Date.now()}-${baseName || "file"}${ext}`;
      cb(null, safeFilename);
    },
  });
}

function mapUploadError(err) {
  if (!err) return null;

  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return {
        status: 413,
        message: `File too large. Maximum size is ${formatMaxSize()}.`,
      };
    }
    if (err.code === "LIMIT_FILE_COUNT" || err.code === "LIMIT_UNEXPECTED_FILE") {
      return {
        status: 400,
        message: "Only one file can be uploaded.",
      };
    }
    return { status: 400, message: err.message || "Invalid upload." };
  }

  if (err.code === "INVALID_FILE_TYPE" || err.code === "INVALID_FILE_CONTENT") {
    return { status: 400, message: err.message };
  }

  return null;
}

function handleUploadError(err, req, res, next) {
  const mapped = mapUploadError(err);
  if (!mapped) return next(err);

  removeRequestUploads(req);
  if (res.headersSent) return next(err);

  return res.status(mapped.status).json({
    success: false,
    error: mapped.message,
    message: mapped.message,
  });
}

function validateUploadedFile(req, res, next) {
  if (!req.file) return next();

  try {
    const fd = fs.openSync(req.file.path, "r");
    const header = Buffer.alloc(16);
    const bytesRead = fs.readSync(fd, header, 0, 16, 0);
    fs.closeSync(fd);

    const result = validateFileIdentity({
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      header: header.subarray(0, bytesRead),
    });

    if (!result.ok) {
      removeUploadedFile(req.file);
      req.file = undefined;
      return res.status(400).json({
        success: false,
        error: result.reason,
        message: result.reason,
      });
    }

    req.file.detectedType = result.type;
    return next();
  } catch (err) {
    removeUploadedFile(req.file);
    req.file = undefined;
    err.code = err.code || "INVALID_FILE_CONTENT";
    err.status = 400;
    return next(err);
  }
}

function createUpload(options = {}) {
  const destDir = getUploadDir(options.destDir);
  const fileSize = options.fileSize ?? getMaxFileSize();
  const files = options.files ?? getMaxFiles();

  return multer({
    storage: buildStorage(destDir),
    fileFilter,
    limits: {
      fileSize,
      files,
    },
  });
}

const upload = createUpload();
upload.validateFile = validateUploadedFile;
upload.handleError = handleUploadError;
upload.handleUploadError = handleUploadError;
upload.create = createUpload;
upload.removeUploadedFile = removeUploadedFile;
upload.removeRequestUploads = removeRequestUploads;
upload.mapUploadError = mapUploadError;
upload.UPLOAD_DIR = DEFAULT_UPLOAD_DIR;

module.exports = upload;
