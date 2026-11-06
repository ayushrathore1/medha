const fs = require("fs");
const Note = require("../models/Note");
const User = require("../models/User");
const { compressPdfIfNeeded } = require("./pdfCompressor");
const { uploadToCloudinary, CLOUDINARY_MAX_BYTES } = require("./cloudinaryUpload");
const { extractPdfText, moderateNote } = require("./noteModerator");
const { sendNotePipelineEmail } = require("./noteEmails");
const { queueStats } = require("./groqQueue");

const MAX_ATTEMPTS = Number(process.env.NOTE_SCAN_MAX_ATTEMPTS || 8);
const POLL_MS = Number(process.env.NOTE_SCAN_POLL_MS || 8000);
const LOCK_MS = 2 * 60 * 1000;

let timer = null;
let ticking = false;

function backoffMs(attempts) {
  return Math.min(30 * 60 * 1000, 15 * 1000 * 2 ** Math.max(0, attempts - 1));
}

async function claimNextNote() {
  const now = new Date();
  return Note.findOneAndUpdate(
    {
      isPublic: true,
      verificationStatus: "pending",
      scanAttempts: { $lt: MAX_ATTEMPTS },
      $and: [
        { $or: [{ nextScanAt: null }, { nextScanAt: { $lte: now } }] },
        { $or: [{ scanLockUntil: null }, { scanLockUntil: { $lte: now } }] },
      ],
    },
    {
      $set: {
        pipelineStage: "scanning",
        scanLockUntil: new Date(Date.now() + LOCK_MS),
      },
      $inc: { scanAttempts: 1 },
    },
    { sort: { createdAt: 1 }, new: true }
  ).select("+localFilePath");
}

async function ensureCloudinary(note) {
  const localPath = note.localFilePath;
  const isRemote = note.fileUrl && /^https?:\/\//i.test(note.fileUrl);
  if (isRemote && note.cloudinaryPublicId) return note;

  if (!localPath || !fs.existsSync(localPath)) {
    // Already remote without publicId, or local missing — continue with metadata scan
    return note;
  }

  note.pipelineStage = "compressing";
  await note.save();

  const compressed = await compressPdfIfNeeded(localPath, note.originalName || "file.pdf");
  note.compressedBytes = compressed.bytes;

  if (compressed.bytes <= CLOUDINARY_MAX_BYTES) {
    note.pipelineStage = "uploading";
    await note.save();
    try {
      const uploaded = await uploadToCloudinary(compressed.path, note.originalName || "file.pdf");
      note.fileUrl = uploaded.url;
      note.cloudinaryPublicId = uploaded.publicId;
    } catch (err) {
      console.warn("[NoteScan] Cloudinary failed, keeping local URL:", err.message);
    }
  }

  if (compressed.cleanup && compressed.cleanup !== localPath) {
    fs.unlink(compressed.cleanup, () => {});
  }

  return note;
}

async function processNote(note) {
  // Edge: made private after enqueue — abort quietly
  if (!note.isPublic) {
    note.pipelineStage = "none";
    note.scanLockUntil = null;
    note.verificationStatus = "approved";
    note.verificationReason = "Private note — no public review required.";
    await note.save();
    return;
  }

  await ensureCloudinary(note);

  let extracted = note.extractedText || "";
  const localPath = note.localFilePath;
  const isPdf =
    /pdf/i.test(note.fileType || "") || /\.pdf$/i.test(note.originalName || "");

  if (!extracted && localPath && fs.existsSync(localPath) && isPdf) {
    extracted = await extractPdfText(localPath);
    note.extractedText = extracted;
  }

  note.pipelineStage = "scanning";
  await note.save();

  let verdict;
  try {
    verdict = await moderateNote({
      title: note.title,
      subject: note.subjectTag || "",
      description: note.content || "",
      filename: note.originalName || "",
      extractedText: extracted,
    });
  } catch (err) {
    note.pipelineStage = "queued";
    note.nextScanAt = new Date(Date.now() + backoffMs(note.scanAttempts));
    note.scanLockUntil = null;
    note.verificationReason = "Automated review will retry shortly.";
    await note.save();
    console.warn("[NoteScan] moderate error:", err.message);
    return;
  }

  if (verdict.deferred) {
    note.pipelineStage = "queued";
    note.nextScanAt = new Date(Date.now() + backoffMs(note.scanAttempts));
    note.scanLockUntil = null;
    note.verificationReason = verdict.reason;
    await note.save();
    return;
  }

  note.moderationLabel = verdict.label || "";
  note.moderationCriteria = verdict.criteria || {};
  note.moderationConfidence = verdict.confidence ?? null;
  note.verificationReason = verdict.reason || "";
  note.scanLockUntil = null;

  if (verdict.allowed) {
    // Soft-pass low-confidence / empty docs still go to team, not public yet
    note.verificationStatus = "awaiting_team";
    note.pipelineStage = "awaiting_team";
    if (verdict.criteria?.suggestedSubject && !note.subjectTag) {
      note.subjectTag = String(verdict.criteria.suggestedSubject).slice(0, 120);
    }
    if (verdict.criteria?.suggestedSemester && !note.semester) {
      note.semester = String(verdict.criteria.suggestedSemester).slice(0, 40);
    }
    await note.save();
    console.log(`[NoteScan] Note ${note._id} awaiting team categorization`);
    return;
  }

  note.verificationStatus = "rejected";
  note.pipelineStage = "failed";
  note.isPublic = false; // keep out of public feeds; owner can still see
  await note.save();

  if (!note.emailsSent?.rejected) {
    const owner = await User.findById(note.owner).select("name email");
    if (owner?.email) {
      const mail = await sendNotePipelineEmail({
        to: owner.email,
        name: owner.name,
        title: note.title,
        variant: "rejected",
        reason: verdict.reason,
      });
      if (mail.sent) {
        note.emailsSent = { ...(note.emailsSent || {}), rejected: true };
        await note.save();
      }
    }
  }

  if (localPath && fs.existsSync(localPath) && note.cloudinaryPublicId) {
    fs.unlink(localPath, () => {});
    note.localFilePath = null;
    await note.save();
  }
}

async function tick() {
  if (ticking) return;
  ticking = true;
  try {
    const stats = queueStats();
    if (stats.tokensUsedToday >= stats.dailyBudget) {
      return;
    }
    const note = await claimNextNote();
    if (!note) return;
    await processNote(note);
  } catch (err) {
    console.error("[NoteScan] tick failed:", err.message);
  } finally {
    ticking = false;
  }
}

function startNoteScanWorker() {
  if (timer || process.env.NODE_ENV === "test") return;
  timer = setInterval(tick, POLL_MS);
  // first pass soon after boot
  setTimeout(tick, 3000);
  console.log(`📝 Note scan worker started (poll ${POLL_MS}ms, gap ${statsGap()})`);
}

function statsGap() {
  try {
    return queueStats().gapMs;
  } catch {
    return "?";
  }
}

function stopNoteScanWorker() {
  if (timer) clearInterval(timer);
  timer = null;
}

/** Enqueue a specific note for (re)scan — used after public upload / visibility toggle */
async function enqueueNoteScan(noteId, { immediate = false } = {}) {
  await Note.findByIdAndUpdate(noteId, {
    $set: {
      verificationStatus: "pending",
      pipelineStage: "queued",
      nextScanAt: immediate ? new Date() : new Date(Date.now() + 500),
      scanLockUntil: null,
    },
  });
  if (immediate) setTimeout(tick, 50);
}

module.exports = {
  startNoteScanWorker,
  stopNoteScanWorker,
  enqueueNoteScan,
  tick,
  processNote,
};
