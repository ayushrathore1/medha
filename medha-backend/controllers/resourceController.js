const CuratedResource = require("../models/CuratedResource");
const Note = require("../models/Note");
const { seedCuratedResources } = require("../utils/seedCuratedResources");

function publicResource(doc) {
  return {
    id: doc._id.toString(),
    type: doc.kind,
    kind: doc.kind,
    category: doc.kind === "gfg" ? "gfg" : "youtube",
    title: doc.title,
    subject: doc.subject || null,
    semester: doc.semester,
    unitNumber: doc.unitNumber,
    unitTitle: doc.unitTitle || null,
    channelTitle: doc.channelTitle || (doc.kind === "gfg" ? "GeeksforGeeks" : "Lecture"),
    duration: doc.duration || null,
    hasThumbnail: doc.kind === "youtube",
    thumbnailUrl: doc.kind === "youtube" ? `/api/resources/${doc._id}/thumb` : null,
  };
}

function escapeRegex(value = "") {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

exports.ensureSeeded = async (_req, _res, next) => {
  try {
    await seedCuratedResources();
  } catch (err) {
    console.warn("Curated resource seed skipped:", err.message);
  }
  next();
};

/**
 * GET /api/resources?q=&kind=&subject=&limit=
 * Returns metadata only — no raw destination URLs.
 */
exports.searchResources = async (req, res) => {
  try {
    await seedCuratedResources();
    const q = String(req.query.q || "").trim();
    const kind = String(req.query.kind || "all").toLowerCase();
    const subject = String(req.query.subject || "").trim();
    const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 40, 1), 80);

    if (!q) {
      return res.json({ results: { youtube: [], gfg: [] }, total: 0 });
    }

    const filter = { active: true };
    if (kind === "youtube" || kind === "gfg") filter.kind = kind;
    if (subject && subject !== "all") {
      filter.subject = new RegExp(escapeRegex(subject), "i");
    }

    const rx = new RegExp(escapeRegex(q), "i");
    filter.$or = [
      { title: rx },
      { subject: rx },
      { unitTitle: rx },
      { tags: rx },
      { channelTitle: rx },
    ];

    const docs = await CuratedResource.find(filter).limit(limit).lean();
    const youtube = docs.filter((d) => d.kind === "youtube").map(publicResource);
    const gfg = docs.filter((d) => d.kind === "gfg").map(publicResource);

    return res.json({
      results: { youtube, gfg },
      total: youtube.length + gfg.length,
    });
  } catch (err) {
    console.error("searchResources:", err);
    return res.status(500).json({ message: "Failed to search resources" });
  }
};

/**
 * POST /api/resources/:id/open
 * Auth required. Returns the destination URL once for the client to navigate.
 */
exports.openResource = async (req, res) => {
  try {
    const doc = await CuratedResource.findById(req.params.id)
      .select("+url +videoId")
      .lean();

    if (!doc || !doc.active) {
      return res.status(404).json({ message: "Resource not found" });
    }

    let url = doc.url || null;
    if (!url && doc.kind === "youtube" && doc.videoId) {
      url = `https://www.youtube.com/watch?v=${doc.videoId}`;
    }
    if (!url) {
      return res.status(404).json({ message: "Resource unavailable" });
    }

    return res.json({ url, kind: doc.kind, title: doc.title });
  } catch (err) {
    console.error("openResource:", err);
    return res.status(500).json({ message: "Failed to open resource" });
  }
};

/**
 * GET /api/resources/:id/thumb
 * Redirects to the thumbnail without exposing the video id in search JSON.
 */
exports.thumbResource = async (req, res) => {
  try {
    const doc = await CuratedResource.findById(req.params.id)
      .select("+thumbnailUrl +videoId")
      .lean();

    if (!doc || doc.kind !== "youtube") {
      return res.status(404).end();
    }

    const thumb =
      doc.thumbnailUrl ||
      (doc.videoId ? `https://i.ytimg.com/vi/${doc.videoId}/mqdefault.jpg` : null);

    if (!thumb) return res.status(404).end();
    return res.redirect(302, thumb);
  } catch {
    return res.status(404).end();
  }
};

/**
 * POST /api/resources/note/:noteId/open
 * Alias-friendly note open (same as download URL issue). Prefer notes download.
 */
exports.openNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.noteId).select("fileUrl title isPublic owner verificationStatus");
    if (!note) return res.status(404).json({ message: "Note not found" });
    if (note.verificationStatus === "rejected") {
      return res.status(404).json({ message: "Note not found" });
    }
    if (!note.fileUrl) return res.status(404).json({ message: "File unavailable" });
    return res.json({ url: note.fileUrl, kind: "note", title: note.title });
  } catch (err) {
    console.error("openNote:", err);
    return res.status(500).json({ message: "Failed to open note" });
  }
};
