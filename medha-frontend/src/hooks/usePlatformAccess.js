import { useEffect, useState } from "react";
import { isComingSoonMode, isTeamUser } from "../config/appMode";
import { API_BASE } from "../config/api";
import {
  hasCompletedLaunchReload,
  markLaunchReloadDone,
  msUntilPlatformLaunch,
  PLATFORM_GA_AT_MS,
  scheduleLaunchReloadOnce,
} from "../config/launch";

/**
 * Live platform-access flag that flips automatically at GA without a redeploy.
 * Schedules a wake-up at launch, re-checks on focus, syncs with the API clock,
 * and performs exactly one hard reload when GA hits (so open tabs get the new build).
 */
export function usePlatformAccess(user) {
  const [now, setNow] = useState(() => Date.now());
  const [serverOpen, setServerOpen] = useState(null);

  useEffect(() => {
    const refresh = () => setNow(Date.now());
    refresh();

    const wait = msUntilPlatformLaunch(now);
    let timer = null;
    if (wait > 0) {
      // Timers above ~24 days are unreliable in browsers; clamp and re-arm.
      const delay = Math.min(wait + 250, 24 * 60 * 60 * 1000);
      timer = window.setTimeout(refresh, delay);
    }

    window.addEventListener("focus", refresh);
    document.addEventListener("visibilitychange", refresh);
    return () => {
      if (timer) window.clearTimeout(timer);
      window.removeEventListener("focus", refresh);
      document.removeEventListener("visibilitychange", refresh);
    };
  }, [now]);

  // One hard reload at GA for tabs that were already open on coming-soon.
  useEffect(() => {
    return scheduleLaunchReloadOnce();
  }, []);

  // If React flips open before the scheduled reload (focus / status sync), still reload once.
  useEffect(() => {
    if (hasCompletedLaunchReload()) return;
    if (now < PLATFORM_GA_AT_MS) return;
    // Only reload if this tab was waiting before launch (session marker).
    try {
      const waiting = sessionStorage.getItem("medha_pre_ga_tab") === "1";
      if (!waiting) return;
      sessionStorage.removeItem("medha_pre_ga_tab");
      markLaunchReloadDone();
      window.location.reload();
    } catch {
      /* ignore */
    }
  }, [now]);

  useEffect(() => {
    if (msUntilPlatformLaunch() > 0) {
      try {
        sessionStorage.setItem("medha_pre_ga_tab", "1");
      } catch {
        /* ignore */
      }
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/api/platform/status`);
        if (!res.ok) return;
        const data = await res.json();
        if (cancelled) return;
        if (typeof data?.open === "boolean") setServerOpen(data.open);
        if (data?.opensAt) {
          const serverGa = Date.parse(data.opensAt);
          if (Number.isFinite(serverGa) && Math.abs(serverGa - PLATFORM_GA_AT_MS) < 60_000) {
            setNow(Date.now());
          }
        }
      } catch {
        /* offline / CORS — fall back to local clock */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const comingSoon =
    serverOpen === true ? false : serverOpen === false ? true : isComingSoonMode(now);

  return {
    now,
    comingSoon,
    canAccess: !comingSoon || isTeamUser(user),
  };
}
