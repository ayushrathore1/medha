import api from "../api/api";

const PING_DAY_KEY = "medha_streak_ping_day_v1";
let inflight = null;

function localDayKey(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/**
 * Ping the backend once per local calendar day so streaks advance on
 * real study activity — not only on login.
 */
export async function pingDailyActivity({ force = false } = {}) {
  const token = localStorage.getItem("token");
  if (!token) return null;

  const today = localDayKey();
  try {
    if (!force && localStorage.getItem(PING_DAY_KEY) === today) {
      return { skipped: true, streak: null };
    }
  } catch {
    /* ignore */
  }

  if (inflight) return inflight;

  inflight = (async () => {
    try {
      const res = await api.post("/users/activity");
      try {
        localStorage.setItem(PING_DAY_KEY, today);
      } catch {
        /* ignore */
      }
      return res.data;
    } catch (err) {
      console.warn("Daily activity ping failed:", err?.message || err);
      return null;
    } finally {
      inflight = null;
    }
  })();

  return inflight;
}
