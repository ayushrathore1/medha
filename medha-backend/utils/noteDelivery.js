/**
 * Cloudinary often returns 401 ACL on public res.cloudinary.com raw PDF URLs.
 * Issue a short-lived private download URL for in-app viewers (same approach as past papers).
 */
require("dotenv").config();
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

function publicIdFromNote(note) {
  if (note?.cloudinaryPublicId) return note.cloudinaryPublicId;
  const url = String(note?.fileUrl || "");
  if (!url.includes("res.cloudinary.com")) return null;
  const marker = "/upload/";
  const idx = url.indexOf(marker);
  if (idx === -1) return null;
  const rest = url.slice(idx + marker.length).replace(/^v\d+\//, "");
  return decodeURIComponent(rest.split("?")[0]);
}

function isCloudinaryUrl(url) {
  return /res\.cloudinary\.com/i.test(String(url || ""));
}

/**
 * @param {object} note
 * @param {{ attachment?: boolean, ttlSec?: number }} [opts]
 * @returns {string|null}
 */
function signedNoteUrl(note, opts = {}) {
  const publicId = publicIdFromNote(note);
  if (!publicId) {
    // Local /uploads path or non-Cloudinary URL — return as stored
    return note?.fileUrl || null;
  }

  const ttlSec = opts.ttlSec || 15 * 60;
  const expires_at = Math.floor(Date.now() / 1000) + ttlSec;

  try {
    return cloudinary.utils.private_download_url(publicId, "", {
      resource_type: "raw",
      type: "upload",
      attachment: Boolean(opts.attachment),
      expires_at,
    });
  } catch (err) {
    console.error("[noteDelivery] signed URL failed:", err.message);
    // Fall back only for non-ACL local paths; Cloudinary public URLs often 401
    if (!isCloudinaryUrl(note.fileUrl)) return note.fileUrl || null;
    return null;
  }
}

module.exports = {
  publicIdFromNote,
  isCloudinaryUrl,
  signedNoteUrl,
};
