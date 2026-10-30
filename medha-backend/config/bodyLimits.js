/**
 * Request size limits.
 *
 * JSON / urlencoded stay small. Multipart file uploads use per-endpoint
 * Multer limits (notes, audio, images) and skip the JSON cap.
 *
 * Reverse proxies (nginx client_max_body_size, etc.) should allow at least
 * AUDIO_UPLOAD_MAX_BYTES / NOTE_UPLOAD_MAX_BYTES (default 25MB).
 */

function parseSize(value, fallbackBytes) {
  if (value == null || value === "") return fallbackBytes;
  if (typeof value === "number" && Number.isFinite(value) && value > 0) {
    return Math.floor(value);
  }

  const match = String(value)
    .trim()
    .toLowerCase()
    .match(/^(\d+(?:\.\d+)?)\s*(b|kb|mb|gb)?$/);
  if (!match) return fallbackBytes;

  const amount = parseFloat(match[1]);
  const unit = match[2] || "b";
  const multiplier = { b: 1, kb: 1024, mb: 1024 * 1024, gb: 1024 * 1024 * 1024 }[
    unit
  ];
  const bytes = Math.floor(amount * multiplier);
  return bytes > 0 ? bytes : fallbackBytes;
}

const JSON_LIMIT_BYTES = parseSize(
  process.env.JSON_BODY_LIMIT,
  1024 * 1024 // 1 MB — cropped avatars, notes, chat; not bulk files
);
const AUDIO_UPLOAD_MAX_BYTES = parseSize(
  process.env.AUDIO_UPLOAD_MAX_BYTES,
  25 * 1024 * 1024
);
const IMAGE_UPLOAD_MAX_BYTES = parseSize(
  process.env.IMAGE_UPLOAD_MAX_BYTES,
  5 * 1024 * 1024
);

function formatBytes(bytes) {
  const mb = bytes / (1024 * 1024);
  if (mb >= 1) return Number.isInteger(mb) ? `${mb}MB` : `${mb.toFixed(1)}MB`;
  const kb = bytes / 1024;
  return Number.isInteger(kb) ? `${kb}KB` : `${kb.toFixed(0)}KB`;
}

const PAYLOAD_TOO_LARGE_MESSAGE = `Request body too large. Maximum size is ${formatBytes(JSON_LIMIT_BYTES)}.`;

function mapPayloadTooLargeError(err) {
  if (!err) return null;
  if (err.type === "entity.too.large" || err.name === "PayloadTooLargeError") {
    return { status: 413, message: PAYLOAD_TOO_LARGE_MESSAGE };
  }
  return null;
}

function sendPayloadTooLarge(res) {
  return res.status(413).json({
    success: false,
    error: PAYLOAD_TOO_LARGE_MESSAGE,
    message: PAYLOAD_TOO_LARGE_MESSAGE,
  });
}

module.exports = {
  parseSize,
  JSON_LIMIT_BYTES,
  AUDIO_UPLOAD_MAX_BYTES,
  IMAGE_UPLOAD_MAX_BYTES,
  formatBytes,
  PAYLOAD_TOO_LARGE_MESSAGE,
  mapPayloadTooLargeError,
  sendPayloadTooLarge,
};
