const mongoose = require("mongoose");

/**
 * Server-only curated links (YouTube, GFG, etc.).
 * Clients never receive raw URLs — only resource ids; open via /api/resources/:id/open.
 */
const CuratedResourceSchema = new mongoose.Schema(
  {
    kind: {
      type: String,
      enum: ["youtube", "gfg"],
      required: true,
      index: true,
    },
    title: { type: String, required: true, index: true },
    subject: { type: String, default: "", index: true },
    semester: { type: Number, default: null },
    unitNumber: { type: Number, default: null },
    unitTitle: { type: String, default: "" },
    tags: [{ type: String }],
    channelTitle: { type: String, default: "" },
    duration: { type: String, default: "" },
    // Sensitive fields — never select in list/search responses
    videoId: { type: String, default: null, select: false },
    url: { type: String, default: null, select: false },
    thumbnailUrl: { type: String, default: null, select: false },
    sourceKey: { type: String, required: true, unique: true },
    active: { type: Boolean, default: true, index: true },
  },
  { timestamps: true }
);

CuratedResourceSchema.index({ title: "text", subject: "text", unitTitle: "text", tags: "text" });

module.exports = mongoose.model("CuratedResource", CuratedResourceSchema);
