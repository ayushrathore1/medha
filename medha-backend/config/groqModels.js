/**
 * Groq production model IDs (developer tier).
 * llama-3.3-70b-versatile / llama-3.1-8b-instant were shut down for free/dev tiers (Aug 2026).
 * @see https://console.groq.com/docs/deprecations
 */

/** Capable default for chat, generation, moderation, recommendations */
const GROQ_CAPABLE =
  process.env.GROQ_MODEL ||
  process.env.GROQ_CAPABLE_MODEL ||
  "openai/gpt-oss-120b";

/** Faster / cheaper default for streaming chat & light tasks */
const GROQ_FAST =
  process.env.GROQ_FAST_MODEL ||
  "openai/gpt-oss-20b";

/** NoteScan / upload moderation (override with GROQ_MODERATION_MODEL) */
const GROQ_MODERATION =
  process.env.GROQ_MODERATION_MODEL || GROQ_CAPABLE;

module.exports = {
  GROQ_CAPABLE,
  GROQ_FAST,
  GROQ_MODERATION,
};
