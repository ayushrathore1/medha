import { isPlatformGenerallyAvailable } from "./launch";
import { needsAcademicProfile } from "../lib/academicProfile";

/**
 * Production early-access mode.
 * Vite production builds (`import.meta.env.PROD`) mirror NODE_ENV=production deploys.
 * Auto-opens for everyone at PLATFORM_GA_AT (see launch.js).
 * Override: VITE_FORCE_INSIDE=true unlocks the full desk against a prod build.
 * Override: VITE_PLATFORM_OPEN / VITE_PLATFORM_TEAM_ONLY force open / closed.
 */
export function isComingSoonMode(now = Date.now()) {
  if (import.meta.env.VITE_FORCE_INSIDE === "true") return false;
  if (!import.meta.env.PROD) return false;
  return !isPlatformGenerallyAvailable(now);
}

/** @deprecated Prefer isComingSoonMode() — evaluated once at import (may be stale across GA). */
export const IS_COMING_SOON_MODE = isComingSoonMode();

/** Team / admin — can enter the live platform while others stay on coming soon. */
export function isTeamUser(user) {
  if (!user) return false;
  const role = String(user.role || "").toLowerCase();
  return Boolean(user.isAdmin || role === "admin" || role === "team");
}

/** True when this session should load the real Medha desk (not the public gate). */
export function canAccessPlatform(user, now = Date.now()) {
  return !isComingSoonMode(now) || isTeamUser(user);
}

/**
 * Where auth flows land after login/register/verify.
 * Regular users before GA → /inside (member coming soon).
 * Team/admin or after GA → desk home.
 */
export function getPostAuthHome(user, now = Date.now()) {
  if (needsAcademicProfile(user)) return "/complete-profile";
  if (!isComingSoonMode(now)) return "/";
  if (isTeamUser(user)) return "/";
  return "/inside";
}

/** Resolve ?next= after auth; keep users on routes they’re allowed to open. */
export function resolvePostAuthPath(user, nextParam, now = Date.now()) {
  const next = String(nextParam || "").trim();
  if (needsAcademicProfile(user)) {
    if (next.startsWith("/") && !next.startsWith("//") && next !== "/complete-profile") {
      return `/complete-profile?next=${encodeURIComponent(next)}`;
    }
    return "/complete-profile";
  }
  if (!next.startsWith("/") || next.startsWith("//")) {
    return getPostAuthHome(user, now);
  }
  if (isComingSoonMode(now) && !canAccessPlatform(user, now)) {
    if (next.startsWith("/join-team")) return next;
    return "/inside";
  }
  const staff =
    next === "/admin" ||
    next === "/team-dashboard" ||
    next.startsWith("/admin/");
  if (staff && !isTeamUser(user)) {
    return getPostAuthHome(user, now);
  }
  if (
    next === "/inside" ||
    next === "/coming-soon" ||
    next === "/login" ||
    next === "/register" ||
    next === "/signup"
  ) {
    return getPostAuthHome(user, now);
  }
  return next;
}

/** @deprecated Prefer getPostAuthHome(user). */
export const POST_AUTH_HOME = isComingSoonMode() ? "/inside" : "/";
