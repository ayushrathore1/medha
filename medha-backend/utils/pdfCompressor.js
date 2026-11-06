/**
 * Lightweight PDF / image preparation before Cloudinary upload.
 * - PDFs: rewrite with pdf-lib (drops unused objects, can shrink some files)
 * - Images: leave as-is (Cloudinary handles image delivery)
 * Never throws for the caller — returns original path on failure.
 */
const fs = require("fs");
const path = require("path");
const os = require("os");

async function compressPdfIfNeeded(localFilePath, originalName = "file.pdf") {
  try {
    const ext = path.extname(originalName || localFilePath).toLowerCase();
    if (ext !== ".pdf" && !/\.pdf$/i.test(localFilePath)) {
      return { path: localFilePath, compressed: false, bytes: fs.statSync(localFilePath).size };
    }

    const before = fs.statSync(localFilePath).size;
    // Skip tiny PDFs — rewrite cost > gain
    if (before < 200 * 1024) {
      return { path: localFilePath, compressed: false, bytes: before };
    }

    const { PDFDocument } = require("pdf-lib");
    const bytes = fs.readFileSync(localFilePath);
    const src = await PDFDocument.load(bytes, { ignoreEncryption: true });
    const out = await PDFDocument.create();
    const pages = await out.copyPages(src, src.getPageIndices());
    pages.forEach((p) => out.addPage(p));
    const saved = await out.save({ useObjectStreams: true });

    if (saved.length >= before * 0.98) {
      return { path: localFilePath, compressed: false, bytes: before };
    }

    const tmp = path.join(
      os.tmpdir(),
      `medha-pdf-${Date.now()}-${Math.random().toString(36).slice(2)}.pdf`
    );
    fs.writeFileSync(tmp, saved);
    console.log(
      `[PDF] Compressed ${(before / 1024 / 1024).toFixed(2)}MB → ${(saved.length / 1024 / 1024).toFixed(2)}MB`
    );
    return { path: tmp, compressed: true, bytes: saved.length, cleanup: tmp };
  } catch (err) {
    console.warn("[PDF] Compress skipped:", err.message);
    const bytes = fs.existsSync(localFilePath) ? fs.statSync(localFilePath).size : 0;
    return { path: localFilePath, compressed: false, bytes, error: err.message };
  }
}

module.exports = { compressPdfIfNeeded };
