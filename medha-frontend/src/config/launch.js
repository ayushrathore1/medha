/**
 * General availability — 12 November 2026, 6:00 PM IST (UTC+5:30).
 * Both the Vite gate and API gate use this instant so prod opens without a manual flip.
 */
export const PLATFORM_GA_AT_ISO = "2026-11-12T18:00:00+05:30";
export const PLATFORM_GA_AT_MS = Date.parse(PLATFORM_GA_AT_ISO);

export const PLATFORM_LAUNCH_LABEL = "12 November 2026";
export const PLATFORM_LAUNCH_TIME_LABEL = "6:00 PM IST";
export const PLATFORM_LAUNCH_DISPLAY = `${PLATFORM_LAUNCH_LABEL} · ${PLATFORM_LAUNCH_TIME_LABEL}`;

/** True once wall-clock time reaches (or passes) GA. Env overrides always win. */
export function isPlatformGenerallyAvailable(now = Date.now()) {
  if (String(import.meta.env.VITE_PLATFORM_OPEN || "").toLowerCase() === "true") {
    return true;
  }
  if (String(import.meta.env.VITE_PLATFORM_TEAM_ONLY || "").toLowerCase() === "true") {
    return false;
  }
  return Number.isFinite(PLATFORM_GA_AT_MS) && now >= PLATFORM_GA_AT_MS;
}

/** ms until GA (0 if already open / invalid). */
export function msUntilPlatformLaunch(now = Date.now()) {
  if (!Number.isFinite(PLATFORM_GA_AT_MS)) return 0;
  return Math.max(0, PLATFORM_GA_AT_MS - now);
}

/** One reload per GA instant — survives the refresh so we never loop. */
export const PLATFORM_GA_RELOAD_KEY = "medha_platform_ga_reload_v1";

export function hasCompletedLaunchReload() {
  try {
    return localStorage.getItem(PLATFORM_GA_RELOAD_KEY) === PLATFORM_GA_AT_ISO;
  } catch {
    return true;
  }
}

export function markLaunchReloadDone() {
  try {
    localStorage.setItem(PLATFORM_GA_RELOAD_KEY, PLATFORM_GA_AT_ISO);
  } catch {
    /* ignore quota / private mode */
  }
}

/**
 * Schedule a single hard reload when GA hits so open tabs pick up the live build.
 * No-ops if already past GA on first paint, or if this GA reload already ran.
 */
export function scheduleLaunchReloadOnce() {
  if (typeof window === "undefined") return () => {};
  if (hasCompletedLaunchReload()) return () => {};

  const arm = () => {
    if (hasCompletedLaunchReload()) return null;
    const wait = msUntilPlatformLaunch();
    if (wait <= 0) {
      // Already open on first visit — no reload needed.
      return null;
    }
    const delay = Math.min(wait + 400, 24 * 60 * 60 * 1000);
    return window.setTimeout(() => {
      if (hasCompletedLaunchReload()) return;
      if (Date.now() < PLATFORM_GA_AT_MS) {
        // Browser timer clamped / early fire — re-arm.
        scheduleLaunchReloadOnce();
        return;
      }
      markLaunchReloadDone();
      window.location.reload();
    }, delay);
  };

  let timer = arm();
  return () => {
    if (timer) window.clearTimeout(timer);
  };
}
