/** Calendar-day helpers (server local timezone). */

function startOfDay(date = new Date()) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function dayKey(date) {
  const d = startOfDay(date);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function daysBetween(earlier, later) {
  return Math.round((startOfDay(later) - startOfDay(earlier)) / 86400000);
}

/**
 * Streak still counts if the user was active today or yesterday.
 * After a missed day, show 0 until they record activity again.
 */
function getEffectiveStreak(user) {
  if (!user?.lastActiveDate) return 0;
  const diff = daysBetween(user.lastActiveDate, new Date());
  if (diff === 0 || diff === 1) return Number(user.streak) || 0;
  return 0;
}

/**
 * Record today's study/login activity on a mongoose user document (not saved).
 * @returns {{ streak: number, recordedToday: boolean, changed: boolean }}
 */
function applyDailyActivity(user) {
  const today = startOfDay(new Date());
  const last = user.lastActiveDate ? startOfDay(user.lastActiveDate) : null;
  let streak = Number(user.streak) || 0;
  let changed = false;

  if (!last) {
    streak = 1;
    changed = true;
  } else {
    const diff = daysBetween(last, today);
    if (diff === 0) {
      // Already active today — keep streak
    } else if (diff === 1) {
      streak += 1;
      changed = true;
    } else if (diff > 1) {
      streak = 1;
      changed = true;
    }
  }

  user.streak = Math.max(1, streak);
  if (!last || daysBetween(last, today) !== 0) {
    user.lastActiveDate = new Date();
    changed = true;
  }

  const history = Array.isArray(user.activityHistory) ? user.activityHistory : [];
  const key = dayKey(today);
  const alreadyLogged = history.some((d) => dayKey(d) === key);
  if (!alreadyLogged) {
    history.push(today);
    // Keep roughly one year of calendar dots
    user.activityHistory = history.slice(-400);
    changed = true;
  } else {
    user.activityHistory = history;
  }

  return {
    streak: user.streak,
    recordedToday: true,
    changed,
  };
}

module.exports = {
  startOfDay,
  dayKey,
  daysBetween,
  getEffectiveStreak,
  applyDailyActivity,
};
