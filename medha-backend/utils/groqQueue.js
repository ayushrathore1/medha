/**
 * Serial Groq job queue with spacing + daily token budget.
 * Prevents bursting past Groq TPM/RPM when many public notes scan at once.
 */
const DEFAULT_GAP_MS = Number(process.env.GROQ_QUEUE_GAP_MS || 2500);
const MAX_CONCURRENT = Math.max(1, Number(process.env.GROQ_QUEUE_CONCURRENCY || 1));
const DAILY_TOKEN_BUDGET = Number(process.env.GROQ_DAILY_TOKEN_BUDGET || 200000);
const MAX_INPUT_CHARS = Number(process.env.GROQ_MODERATION_MAX_CHARS || 4500);

let active = 0;
const queue = [];
let dayKey = "";
let tokensUsedToday = 0;

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function resetBudgetIfNeeded() {
  const key = todayKey();
  if (key !== dayKey) {
    dayKey = key;
    tokensUsedToday = 0;
  }
}

function estimateTokens(text = "") {
  return Math.ceil(String(text).length / 4) + 300;
}

function canAfford(estimate) {
  resetBudgetIfNeeded();
  return tokensUsedToday + estimate <= DAILY_TOKEN_BUDGET;
}

function recordUsage(estimate) {
  resetBudgetIfNeeded();
  tokensUsedToday += estimate;
}

function pump() {
  while (active < MAX_CONCURRENT && queue.length) {
    const job = queue.shift();
    active += 1;
    Promise.resolve()
      .then(() => job.run())
      .then(job.resolve, job.reject)
      .finally(() => {
        active -= 1;
        setTimeout(pump, DEFAULT_GAP_MS);
      });
  }
}

/**
 * @param {() => Promise<any>} fn
 * @param {{ estimateTokens?: number, priority?: boolean }} [opts]
 */
function enqueueGroq(fn, opts = {}) {
  const estimate = opts.estimateTokens || 800;
  if (!canAfford(estimate)) {
    return Promise.reject(
      Object.assign(new Error("Groq daily token budget reached. Retry later."), {
        code: "GROQ_BUDGET",
      })
    );
  }

  return new Promise((resolve, reject) => {
    const entry = {
      run: async () => {
        if (!canAfford(estimate)) {
          throw Object.assign(new Error("Groq daily token budget reached."), {
            code: "GROQ_BUDGET",
          });
        }
        const result = await fn();
        recordUsage(estimate);
        return result;
      },
      resolve,
      reject,
    };
    if (opts.priority) queue.unshift(entry);
    else queue.push(entry);
    pump();
  });
}

function queueStats() {
  resetBudgetIfNeeded();
  return {
    queued: queue.length,
    active,
    tokensUsedToday,
    dailyBudget: DAILY_TOKEN_BUDGET,
    gapMs: DEFAULT_GAP_MS,
  };
}

function truncateForGroq(text = "") {
  return String(text || "").slice(0, MAX_INPUT_CHARS);
}

module.exports = {
  enqueueGroq,
  queueStats,
  truncateForGroq,
  estimateTokens,
  MAX_INPUT_CHARS,
};
