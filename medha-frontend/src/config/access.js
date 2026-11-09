/**
 * Route access — single source of truth for guest vs signed-in vs staff.
 *
 * PUBLIC  — browse without an account
 * AUTH    — requires logged-in session (token + user)
 * STAFF   — team / admin only (StaffRoute + API)
 * GUEST_ONLY — auth forms; signed-in users are sent to the desk
 */

/** Paths anyone can open (no session). */
export const PUBLIC_ROUTES = {
  exact: new Set([
    "/",
    "/search",
    "/notes",
    "/past-papers",
    "/terms",
    "/privacy",
    "/coming-soon",
    "/inside",
    "/login",
    "/register",
    "/signup",
    "/forgot-password",
    "/reset-password",
    "/verify-email",
  ]),
  prefixes: ["/subjects", "/auth/", "/past-papers"],
};

/** Paths that require a logged-in user. */
export const AUTH_ROUTES = {
  exact: new Set([
    "/dashboard",
    "/profile",
    "/join-team",
  ]),
  prefixes: ["/note/", "/profile/"],
};

/** Paths that require team/admin. */
export const STAFF_ROUTES = {
  exact: new Set(["/admin", "/team-dashboard"]),
  prefixes: ["/admin/"],
};

/** Auth marketing surfaces — bounce signed-in users away. */
export const GUEST_ONLY_ROUTES = {
  exact: new Set([
    "/login",
    "/register",
    "/signup",
    "/forgot-password",
  ]),
  prefixes: [],
};

function matchList(pathname, { exact, prefixes }) {
  const path = pathname.split("?")[0] || "/";
  if (exact.has(path)) return true;
  return prefixes.some((p) => path === p || path.startsWith(p));
}

export function isPublicPath(pathname) {
  return matchList(pathname, PUBLIC_ROUTES);
}

export function isAuthRequiredPath(pathname) {
  if (matchList(pathname, STAFF_ROUTES)) return true;
  return matchList(pathname, AUTH_ROUTES);
}

export function isStaffPath(pathname) {
  return matchList(pathname, STAFF_ROUTES);
}

export function isGuestOnlyPath(pathname) {
  return matchList(pathname, GUEST_ONLY_ROUTES);
}

export function hasSession(user) {
  if (!user) return false;
  if (typeof window === "undefined") return Boolean(user);
  return Boolean(user && localStorage.getItem("token"));
}
