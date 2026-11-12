const {
  platformGaAtMs,
  isPlatformGenerallyAvailable,
} = require("../middleware/platformTeamOnly");
const { isEnabled, runGoLiveEmailCampaign } = require("./goLiveEmailCampaign");

let started = false;
let timer = null;
let running = false;
let stopped = false;

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function clearTimer() {
  if (timer) {
    clearTimeout(timer);
    timer = null;
  }
}

async function fire() {
  if (running || stopped) return;
  running = true;
  try {
    // Same clock check the platform gate uses — never send before live.
    if (!isPlatformGenerallyAvailable()) {
      console.log("⏰ [GoLive] Gate still closed — rescheduling");
      schedule();
      return;
    }
    await runGoLiveEmailCampaign();
  } catch (err) {
    console.error("❌ [GoLive] Scheduler run failed:", err.message || err);
  } finally {
    running = false;
  }
}

/**
 * Wait until PLATFORM_GA_AT using the same timestamp as the live gate.
 * Re-checks periodically so timer drift / sleep skew cannot fire early.
 */
async function waitUntilGoLive() {
  while (!stopped) {
    const opensAt = platformGaAtMs();
    const waitMs = opensAt - Date.now();
    if (waitMs <= 0 && isPlatformGenerallyAvailable()) {
      return opensAt;
    }
    // Wake often near the deadline; otherwise every 30s to resync.
    const sleepFor = waitMs <= 0 ? 250 : Math.min(Math.max(waitMs, 25), 30_000);
    await delay(sleepFor);
  }
  return null;
}

function schedule() {
  if (!isEnabled()) {
    console.log("📭 [GoLive] Scheduler idle — GO_LIVE_EMAIL_ENABLED is off");
    return;
  }

  const opensAt = platformGaAtMs();
  const waitMs = Math.max(0, opensAt - Date.now());
  const opensLabel = new Date(opensAt).toISOString();

  clearTimer();

  if (waitMs === 0 && isPlatformGenerallyAvailable()) {
    console.log(`🚀 [GoLive] GA already open (${opensLabel}) — starting campaign now`);
    timer = setTimeout(() => {
      fire();
    }, 0);
    return;
  }

  console.log(
    `⏰ [GoLive] Campaign locked to PLATFORM_GA_AT ${opensLabel} (in ${Math.round(waitMs / 1000)}s)`
  );

  // Async wait loop (not a single setTimeout) so we hit live time exactly.
  timer = setTimeout(() => {
    waitUntilGoLive()
      .then((at) => {
        if (at == null || stopped) return;
        console.log(
          `🚀 [GoLive] PLATFORM_GA_AT reached (${new Date(at).toISOString()}) — sending live emails`
        );
        return fire();
      })
      .catch((err) => {
        console.error("❌ [GoLive] Wait failed:", err.message || err);
      });
  }, 0);
}

function startGoLiveEmailScheduler() {
  if (started) return;
  started = true;
  stopped = false;

  if (process.env.NODE_ENV === "test" || process.env.JEST_WORKER_ID) {
    return;
  }

  schedule();
}

function stopGoLiveEmailScheduler() {
  stopped = true;
  clearTimer();
  started = false;
}

module.exports = {
  startGoLiveEmailScheduler,
  stopGoLiveEmailScheduler,
  scheduleGoLiveEmail: schedule,
};
