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

const YT_ID_RE = /^[a-zA-Z0-9_-]{11}$/;

/** Tiny SVG placeholder — always 200 so browsers never log ytimg 404s. */
const THUMB_PLACEHOLDER_SVG = Buffer.from(
  `<svg xmlns="http://www.w3.org/2000/svg" width="320" height="180" viewBox="0 0 320 180">
  <rect width="320" height="180" fill="#111827"/>
  <circle cx="160" cy="90" r="28" fill="#1f2937"/>
  <polygon points="152,74 152,106 180,90" fill="#9ca3af"/>
</svg>`
);

function sendThumbPlaceholder(res, maxAge = 3600) {
  res.set({
    "Content-Type": "image/svg+xml; charset=utf-8",
    "Cache-Control": `public, max-age=${maxAge}`,
  });
  return res.status(200).send(THUMB_PLACEHOLDER_SVG);
}

async function fetchThumbBuffer(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 4000);
  try {
    const upstream = await fetch(url, {
      method: "GET",
      redirect: "follow",
      signal: controller.signal,
      headers: { Accept: "image/*,*/*;q=0.8" },
    });
    if (!upstream.ok) return null;
    const type = String(upstream.headers.get("content-type") || "");
    if (type && !type.startsWith("image/")) return null;
    const buf = Buffer.from(await upstream.arrayBuffer());
    // YouTube sometimes returns a tiny error GIF; treat empty/tiny as miss
    if (!buf.length || buf.length < 200) return null;
    return { buf, type: type || "image/jpeg" };
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

/**
 * GET /api/resources/:id/thumb
 * Proxies the thumbnail (or a placeholder). Never 302 to ytimg — that spams
 * the browser console with 404s when video ids are missing/invalid.
 */
exports.thumbResource = async (req, res) => {
  try {
    const doc = await CuratedResource.findById(req.params.id)
      .select("+thumbnailUrl +videoId")
      .lean();

    if (!doc || doc.kind !== "youtube") {
      return sendThumbPlaceholder(res);
    }

    const videoId = String(doc.videoId || "").trim();
    const candidates = [];

    if (doc.thumbnailUrl && /^https?:\/\//i.test(doc.thumbnailUrl)) {
      candidates.push(doc.thumbnailUrl);
    }
    if (YT_ID_RE.test(videoId)) {
      // Prefer hq over mq — fewer dead ids, same proxy path either way
      candidates.push(`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`);
      candidates.push(`https://i.ytimg.com/vi/${videoId}/mqdefault.jpg`);
      candidates.push(`https://i.ytimg.com/vi/${videoId}/default.jpg`);
    }

    for (const url of candidates) {
      const hit = await fetchThumbBuffer(url);
      if (!hit) continue;
      res.set({
        "Content-Type": hit.type,
        "Cache-Control": "public, max-age=86400",
      });
      return res.status(200).send(hit.buf);
    }

    return sendThumbPlaceholder(res, 7200);
  } catch {
    return sendThumbPlaceholder(res);
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
