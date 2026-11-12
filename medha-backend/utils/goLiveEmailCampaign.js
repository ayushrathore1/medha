const React = require("react");
const User = require("../models/User");
const EmailLog = require("../models/EmailLog");
const { sendEmail, MAILBOXES } = require("./sendEmail");
const { renderEmail } = require("../emails/renderEmail");
const { GoLiveEmail } = require("../emails/GoLiveEmail");

const CAMPAIGN_ID = "go-live-2026-11-12";
const SUBJECT = "Medha Revision is live — open your syllabus";
const EMAIL_DELAY_MS = Number(process.env.GO_LIVE_EMAIL_DELAY_MS || 2000);
const LOCK_MS = Number(process.env.GO_LIVE_EMAIL_LOCK_MS || 30 * 60 * 1000);
const MAILBOX_CYCLE = ["hello", "announcement"];

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function isEnabled() {
  const raw = String(process.env.GO_LIVE_EMAIL_ENABLED || "true").toLowerCase();
  return raw !== "false" && raw !== "0" && raw !== "off";
}

/** Stable hello/announcement pick so retries keep the same mailbox. */
function mailboxForEmail(email) {
  const value = String(email || "").toLowerCase();
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash + value.charCodeAt(i)) % 2;
  }
  return MAILBOX_CYCLE[hash];
}

/**
 * Reserve the address in EmailLog before send so two workers cannot both mail it.
 * Returns false if this address already received the campaign mail.
 */
async function reserveRecipient(email) {
  const updated = await EmailLog.findOneAndUpdate(
    {
      campaignId: CAMPAIGN_ID,
      recipients: { $ne: email },
    },
    {
      $addToSet: { recipients: email },
      $inc: { totalRecipients: 1 },
      $set: {
        lastSentAt: new Date(),
        lockUntil: new Date(Date.now() + LOCK_MS),
      },
    },
    { new: true }
  );
  return Boolean(updated);
}

async function releaseRecipient(email) {
  await EmailLog.updateOne(
    { campaignId: CAMPAIGN_ID },
    {
      $pull: { recipients: email },
      $inc: { totalRecipients: -1 },
    }
  );
}

async function ensureLog() {
  try {
    return await EmailLog.findOneAndUpdate(
      { campaignId: CAMPAIGN_ID },
      {
        $setOnInsert: {
          subject: SUBJECT,
          htmlBody: "[React Email Component: GoLiveEmail]",
          campaignId: CAMPAIGN_ID,
          status: "pending",
          recipients: [],
          sentCount: 0,
          totalRecipients: 0,
          lastSentAt: new Date(),
        },
      },
      { upsert: true, new: true }
    );
  } catch (err) {
    if (err && err.code === 11000) {
      return EmailLog.findOne({ campaignId: CAMPAIGN_ID });
    }
    throw err;
  }
}

async function claimCampaign({ force = false } = {}) {
  const now = new Date();
  const log = await ensureLog();

  if (log.status === "completed" && !force) {
    return { claimed: false, reason: "completed", log };
  }

  const claimQuery = force
    ? {
        campaignId: CAMPAIGN_ID,
        $or: [
          { status: { $ne: "running" } },
          { status: "running", lockUntil: { $lte: now } },
        ],
      }
    : {
        campaignId: CAMPAIGN_ID,
        $or: [
          { status: { $in: ["pending", "interrupted"] } },
          { status: "running", lockUntil: { $lte: now } },
        ],
      };

  const claimed = await EmailLog.findOneAndUpdate(
    claimQuery,
    {
      $set: {
        status: "running",
        lockUntil: new Date(Date.now() + LOCK_MS),
        subject: SUBJECT,
        htmlBody: "[React Email Component: GoLiveEmail]",
      },
      $inc: { sentCount: 1 },
    },
    { new: true }
  );

  if (!claimed) {
    const current = await EmailLog.findOne({ campaignId: CAMPAIGN_ID });
    return {
      claimed: false,
      reason: current?.status === "completed" ? "completed" : "locked",
      log: current || log,
    };
  }

  return { claimed: true, reason: "claimed", log: claimed };
}

async function finishCampaign({ interrupted = false } = {}) {
  await EmailLog.updateOne(
    { campaignId: CAMPAIGN_ID },
    {
      $set: {
        status: interrupted ? "interrupted" : "completed",
        lockUntil: null,
        lastSentAt: new Date(),
      },
    }
  );
}

async function runGoLiveEmailCampaign({ force = false } = {}) {
  if (!isEnabled() && !force) {
    console.log("📭 [GoLive] Skipped — GO_LIVE_EMAIL_ENABLED is off");
    return { skipped: true, reason: "disabled" };
  }

  if (!process.env.HOSTINGER_MAIL_API_TOKEN) {
    console.warn("📭 [GoLive] Skipped — HOSTINGER_MAIL_API_TOKEN is not set");
    return { skipped: true, reason: "no-token" };
  }

  const claim = await claimCampaign({ force });
  if (!claim.claimed) {
    console.log(`📭 [GoLive] Skipped — campaign ${claim.reason}`);
    return {
      skipped: true,
      reason: claim.reason,
      alreadySent: claim.log?.recipients?.length || 0,
    };
  }

  const alreadySent = new Set(
    (claim.log.recipients || []).map((email) => String(email).toLowerCase())
  );

  const users = await User.find({
    email: { $exists: true, $ne: null },
  })
    .select("name email")
    .sort({ createdAt: 1 })
    .lean();

  const recipients = users.filter((user) => {
    const email = String(user.email || "")
      .trim()
      .toLowerCase();
    return email.includes("@") && !alreadySent.has(email);
  });

  if (!recipients.length) {
    await finishCampaign();
    console.log("📭 [GoLive] Nothing to send — all users already covered");
    return {
      skipped: false,
      success: 0,
      failed: 0,
      skippedExisting: alreadySent.size,
      totalUsers: users.length,
    };
  }

  console.log(
    `📧 [GoLive] Starting: ${recipients.length} to send (${alreadySent.size} already received)`
  );

  let success = 0;
  let failed = 0;

  for (let i = 0; i < recipients.length; i += 1) {
    const user = recipients[i];
    const email = String(user.email).trim().toLowerCase();
    const mailbox = mailboxForEmail(email);
    const contactMail = MAILBOXES[mailbox]?.address;
    const firstName = user.name ? String(user.name).split(" ")[0] : "there";

    const reserved = await reserveRecipient(email);
    if (!reserved) {
      console.log(`⏭️ [GoLive] Skip ${email} — already reserved/sent`);
      continue;
    }

    try {
      const html = await renderEmail(
        React.createElement(GoLiveEmail, {
          name: firstName,
          contactMail,
        })
      );

      await sendEmail({
        mailbox,
        to: email,
        subject: SUBJECT,
        html,
        displayName: "Medha Revision",
      });

      success += 1;
      console.log(
        `✅ [GoLive] [${i + 1}/${recipients.length}] ${mailbox} → ${email}`
      );
    } catch (err) {
      failed += 1;
      await releaseRecipient(email);
      console.error(
        `❌ [GoLive] [${i + 1}/${recipients.length}] ${email}: ${err.message}`
      );
    }

    if (i < recipients.length - 1) {
      await delay(EMAIL_DELAY_MS);
    }
  }

  // Only complete when every known user is in the recipients list.
  const refreshed = await EmailLog.findOne({ campaignId: CAMPAIGN_ID }).lean();
  const covered = new Set(
    (refreshed?.recipients || []).map((email) => String(email).toLowerCase())
  );
  const remaining = users.filter((user) => {
    const email = String(user.email || "")
      .trim()
      .toLowerCase();
    return email.includes("@") && !covered.has(email);
  }).length;

  if (remaining === 0) {
    await finishCampaign();
  } else {
    await finishCampaign({ interrupted: true });
  }

  console.log(
    `📧 [GoLive] Done: ${success} sent, ${failed} failed, ${alreadySent.size} previously sent, ${remaining} remaining`
  );

  return {
    skipped: false,
    success,
    failed,
    skippedExisting: alreadySent.size,
    remaining,
    totalUsers: users.length,
  };
}

module.exports = {
  CAMPAIGN_ID,
  SUBJECT,
  isEnabled,
  runGoLiveEmailCampaign,
};
