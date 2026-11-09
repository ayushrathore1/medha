/**
 * Cloudinary blocks public CDN delivery of many PDF/raw assets (401 ACL).
 * Use a short-lived private download URL instead.
 */
require("dotenv").config();
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

function publicIdFromPaper(paper) {
  if (paper?.cloudinaryPublicId) return paper.cloudinaryPublicId;
  const url = String(paper?.fileUrl || "");
  const marker = "/upload/";
  const idx = url.indexOf(marker);
  if (idx === -1) return null;
  // strip version prefix v123/
  const rest = url.slice(idx + marker.length).replace(/^v\d+\//, "");
  return decodeURIComponent(rest.split("?")[0]);
}

/**
 * @param {object} paper
 * @param {{ attachment?: boolean, ttlSec?: number }} [opts]
 * @returns {string|null}
 */
function signedPastPaperUrl(paper, opts = {}) {
  const publicId = publicIdFromPaper(paper);
  if (!publicId) return paper?.fileUrl || null;

  const ttlSec = opts.ttlSec || 15 * 60;
  const expires_at = Math.floor(Date.now() / 1000) + ttlSec;

  return cloudinary.utils.private_download_url(publicId, "", {
    resource_type: "raw",
    type: "upload",
    attachment: Boolean(opts.attachment),
    expires_at,
  });
}

module.exports = {
  publicIdFromPaper,
  signedPastPaperUrl,
};
