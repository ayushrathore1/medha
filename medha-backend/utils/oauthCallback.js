/**
 * Google OAuth callback helpers.
 *
 * Token lifetime: session JWTs expire in 7 days (see jwt.sign expiresIn).
 * There is no refresh-token rotation; after expiry the user signs in again.
 * Logout is client-side (clear localStorage). JWTs are not revoked early.
 *
 * Google flow:
 *  1. GET /api/auth/google stores CSRF `state` in an HttpOnly cookie and
 *     sends the same value to Google.
 *  2. GET /api/auth/google/callback checks state vs cookie, then redirects
 *     to the allowlisted frontend with a one-time `code` only — never a JWT.
 *  3. POST /api/auth/google/exchange returns { token, user } once.
 */
const crypto = require("crypto");
const OAuthLoginCode = require("../models/OAuthLoginCode");

const STATE_COOKIE = "oauth_state";
const STATE_TTL_SECONDS = 600;
const LOGIN_CODE_TTL_MS = 60 * 1000;
const DEFAULT_FRONTEND = "http://localhost:5173";

const ALLOWED_FRONTEND_ORIGINS = [
  "https://medha-revision.vercel.app",
  "https://medha-revision.pages.dev",
  "https://medha.codelearnn.com",
  "http://medha.codelearnn.com",
  "http://localhost:3000",
  "http://localhost:3001",
  "http://localhost:3002",
  "http://localhost:5173",
  "http://localhost:5000",
];

function normalizeOrigin(url) {
  if (!url) return "";
  return String(url).trim().replace(/\/$/, "");
}

function allowedFrontendOrigins() {
  const extra = String(process.env.OAUTH_ALLOWED_ORIGINS || "")
    .split(",")
    .map(normalizeOrigin)
    .filter(Boolean);

  return new Set([...ALLOWED_FRONTEND_ORIGINS, ...extra]);
}

function resolveFrontendUrl() {
  const candidate = normalizeOrigin(process.env.FRONTEND_URL) || DEFAULT_FRONTEND;
  if (allowedFrontendOrigins().has(candidate)) {
    return candidate;
  }
  return DEFAULT_FRONTEND;
}

function parseCookies(req) {
  const header = req.headers.cookie || "";
  const out = {};
  for (const part of header.split(";")) {
    const trimmed = part.trim();
    if (!trimmed) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1);
    try {
      out[key] = decodeURIComponent(value);
    } catch {
      out[key] = value;
    }
  }
  return out;
}

function generateOAuthState() {
  return crypto.randomBytes(32).toString("hex");
}

function isSecureRequest(req) {
  return Boolean(req.secure || req.headers["x-forwarded-proto"] === "https");
}

function oauthStateCookie(state, { secure } = {}) {
  const attrs = [
    `${STATE_COOKIE}=${encodeURIComponent(state)}`,
    "HttpOnly",
    "Path=/api/auth",
    `Max-Age=${STATE_TTL_SECONDS}`,
    "SameSite=Lax",
  ];
  if (secure) attrs.push("Secure");
  return attrs.join("; ");
}

function clearOAuthStateCookie({ secure } = {}) {
  const attrs = [
    `${STATE_COOKIE}=`,
    "HttpOnly",
    "Path=/api/auth",
    "Max-Age=0",
    "SameSite=Lax",
  ];
  if (secure) attrs.push("Secure");
  return attrs.join("; ");
}

function readOAuthStateCookie(req) {
  return parseCookies(req)[STATE_COOKIE] || "";
}

function timingSafeEqual(a, b) {
  const bufA = Buffer.from(String(a));
  const bufB = Buffer.from(String(b));
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

function validateOAuthState(req) {
  const queryState = typeof req.query.state === "string" ? req.query.state : "";
  const cookieState = readOAuthStateCookie(req);
  if (!queryState || !cookieState) return false;
  return timingSafeEqual(queryState, cookieState);
}

async function issueLoginCode({ token, user }) {
  const code = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + LOGIN_CODE_TTL_MS);
  await OAuthLoginCode.create({ code, token, user, expiresAt });
  return code;
}

async function consumeLoginCode(code) {
  if (!code || typeof code !== "string") return null;
  return OAuthLoginCode.findOneAndUpdate(
    { code, used: false, expiresAt: { $gt: new Date() } },
    { $set: { used: true } },
    { new: true }
  );
}

function frontendPath(path, params = {}) {
  const url = new URL(path, `${resolveFrontendUrl()}/`);
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }
  return url.toString();
}

function locationContainsCredential(location) {
  if (!location) return false;
  try {
    const url = new URL(location, "http://localhost");
    const combined = `${url.search} ${url.hash}`.toLowerCase();
    return (
      url.searchParams.has("token") ||
      url.searchParams.has("access_token") ||
      url.searchParams.has("refresh_token") ||
      url.searchParams.has("id_token") ||
      combined.includes("bearer ")
    );
  } catch {
    return /token|bearer /i.test(location);
  }
}

module.exports = {
  STATE_COOKIE,
  LOGIN_CODE_TTL_MS,
  ALLOWED_FRONTEND_ORIGINS,
  generateOAuthState,
  oauthStateCookie,
  clearOAuthStateCookie,
  isSecureRequest,
  validateOAuthState,
  issueLoginCode,
  consumeLoginCode,
  resolveFrontendUrl,
  allowedFrontendOrigins,
  frontendPath,
  locationContainsCredential,
};
