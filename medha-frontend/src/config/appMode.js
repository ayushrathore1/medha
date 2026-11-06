/**
 * Production early-access mode.
 * Vite production builds (`import.meta.env.PROD`) mirror NODE_ENV=production deploys.
 * Override: VITE_FORCE_INSIDE=true unlocks the full desk locally against a prod build.
 */
export const IS_COMING_SOON_MODE =
  import.meta.env.PROD && import.meta.env.VITE_FORCE_INSIDE !== "true";

/** Team / admin — can enter the live platform while others stay on coming soon. */
export function isTeamUser(user) {
  if (!user) return false;
  const role = String(user.role || "").toLowerCase();
  return Boolean(user.isAdmin || role === "admin" || role === "team");
}

/** True when this session should load the real Medha desk (not the public gate). */
export function canAccessPlatform(user) {
  return !IS_COMING_SOON_MODE || isTeamUser(user);
}

/**
 * Where auth flows land after login/register/verify.
 * Regular users in production → /inside (member coming soon).
 * Team/admin → desk home.
 */
export function getPostAuthHome(user) {
  if (!IS_COMING_SOON_MODE) return "/";
  if (isTeamUser(user)) return "/";
  return "/inside";
}

/** Resolve ?next= after auth; keep users on routes they’re allowed to open. */
export function resolvePostAuthPath(user, nextParam) {
  // Inline sanitize to avoid circular import with access.js
  const next = String(nextParam || "").trim();
  if (!next.startsWith("/") || next.startsWith("//")) {
    return getPostAuthHome(user);
  }
  if (IS_COMING_SOON_MODE && !canAccessPlatform(user)) {
    if (next.startsWith("/join-team")) return next;
    return "/inside";
  }
  const staff =
    next === "/admin" ||
    next === "/team-dashboard" ||
    next.startsWith("/admin/");
  if (staff && !isTeamUser(user)) {
    return getPostAuthHome(user);
  }
  if (
    next === "/inside" ||
    next === "/coming-soon" ||
    next === "/login" ||
    next === "/register" ||
    next === "/signup"
  ) {
    return getPostAuthHome(user);
  }
  return next;
}

/** @deprecated Prefer getPostAuthHome(user) — kept for imports that need a static default. */
export const POST_AUTH_HOME = IS_COMING_SOON_MODE ? "/inside" : "/";
