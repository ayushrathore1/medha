const jwt = require("jsonwebtoken");
const User = require("../models/User");

/**
 * Production early-access gate: only team / admin can use the live platform APIs.
 *
 * Auto-opens for everyone at PLATFORM_GA_AT (default: 12 Nov 2026, 18:00 IST).
 * NODE_ENV=production → gated until that instant (unless PLATFORM_OPEN=true).
 * Auth, health, public stats, and session/invite endpoints stay reachable so
 * regular users can still sign in and land on the coming-soon surface.
 */

const DEFAULT_PLATFORM_GA_AT = "2026-11-12T18:00:00+05:30";

function platformGaAtMs() {
  const raw = process.env.PLATFORM_GA_AT || DEFAULT_PLATFORM_GA_AT;
  const ms = Date.parse(raw);
  return Number.isFinite(ms) ? ms : Date.parse(DEFAULT_PLATFORM_GA_AT);
}

function isPlatformGenerallyAvailable(now = Date.now()) {
  if (String(process.env.PLATFORM_OPEN || "").toLowerCase() === "true") return true;
  return now >= platformGaAtMs();
}

function isProductionTeamOnly(now = Date.now()) {
  if (isPlatformGenerallyAvailable(now)) return false;
  if (String(process.env.PLATFORM_TEAM_ONLY || "").toLowerCase() === "true") return true;
  return process.env.NODE_ENV === "production";
}

function pathOf(req) {
  const raw = String(req.originalUrl || req.url || req.path || "");
  return raw.split("?")[0];
}

function isAllowlisted(pathname) {
  const allowExact = new Set([
    "/",
    "/health",
    "/api/test-db",
    "/api/stats",
    "/api/platform/status",
  ]);
  if (allowExact.has(pathname)) return true;

  const allowPrefixes = [
    "/api/auth",
    "/api/users/me",
    "/api/team/join",
    "/api/team/check",
    "/api/messages/check-admin",
    "/api/past-papers",
  ];
  return allowPrefixes.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
}

function isStaffUser(user) {
  if (!user) return false;
  const role = String(user.role || "").toLowerCase();
  return Boolean(user.isAdmin || role === "admin" || role === "team");
}

async function platformTeamOnly(req, res, next) {
  if (!isProductionTeamOnly()) return next();
  if (req.method === "OPTIONS") return next();

  const pathname = pathOf(req);
  if (isAllowlisted(pathname)) return next();

  // Static uploads under /uploads are mounted separately — this middleware is API-scoped.

  const authHeader = req.header("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(403).json({
      success: false,
      code: "PLATFORM_TEAM_ONLY",
      message:
        "Medha Revision is in early access. Only team members can use the platform right now.",
    });
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    return res.status(500).json({ message: "Server configuration error" });
  }

  try {
    const token = authHeader.replace("Bearer ", "");
    const decoded = jwt.verify(token, secret);
    const user = await User.findById(decoded.userId).select("role isAdmin email");
    if (!isStaffUser(user)) {
      return res.status(403).json({
        success: false,
        code: "PLATFORM_TEAM_ONLY",
        message:
          "Medha Revision is in early access. Your account is waitlisted until we open for everyone.",
      });
    }
    // Attach for downstream handlers if auth middleware hasn't run yet
    if (!req.user) {
      req.user = {
        _id: decoded.userId,
        id: decoded.userId,
        userId: decoded.userId,
        email: decoded.email,
      };
      req.userId = decoded.userId;
    }
    return next();
  } catch {
    return res.status(401).json({ message: "Token is not valid" });
  }
}

module.exports = platformTeamOnly;
module.exports.isProductionTeamOnly = isProductionTeamOnly;
module.exports.isPlatformGenerallyAvailable = isPlatformGenerallyAvailable;
module.exports.platformGaAtMs = platformGaAtMs;
