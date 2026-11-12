require("dotenv").config();

const MAIL_API_BASE = process.env.HOSTINGER_MAIL_API_BASE || "https://api.mail.hostinger.com";
const MAIL_FROM_NAME = process.env.MAIL_FROM_NAME || "Medha Revision";

const MAILBOXES = {
  auth: {
    address:
      process.env.MAIL_AUTH_ADDRESS ||
      process.env.MAIL_FROM_ADDRESS ||
      "auth@medharevision.shopcampuskart.in",
    resourceId: process.env.HOSTINGER_MAILBOX_AUTH_ID || "",
  },
  hello: {
    address: process.env.MAIL_HELLO_ADDRESS || "hello@medharevision.shopcampuskart.in",
    resourceId: process.env.HOSTINGER_MAILBOX_HELLO_ID || "",
  },
  announcement: {
    address:
      process.env.MAIL_ANNOUNCEMENT_ADDRESS ||
      "announcement@medharevision.shopcampuskart.in",
    resourceId: process.env.HOSTINGER_MAILBOX_ANNOUNCEMENT_ID || "",
  },
};

const DEFAULT_MAILBOX = process.env.MAIL_DEFAULT_MAILBOX || "auth";
const mailboxIdCache = Object.fromEntries(
  Object.entries(MAILBOXES).map(([key, box]) => [key, box.resourceId || ""])
);

function htmlToText(html) {
  return String(html || "")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function displayNameFrom(from, displayName) {
  if (displayName) return displayName;
  if (typeof from === "string") {
    const quoted = from.match(/^"([^"]+)"/);
    if (quoted) return quoted[1];
    const angle = from.match(/^(.*?)\s*</);
    if (angle?.[1]?.trim()) return angle[1].trim();
  }
  return MAIL_FROM_NAME;
}

function recipientsOf(to) {
  return (Array.isArray(to) ? to : [to])
    .map((value) => String(value || "").trim())
    .filter(Boolean);
}

function resolveMailboxKey(mailbox) {
  const key = String(mailbox || DEFAULT_MAILBOX).toLowerCase().trim();
  if (!MAILBOXES[key]) {
    throw new Error(
      `Unknown mailbox "${mailbox}". Use one of: ${Object.keys(MAILBOXES).join(", ")}`
    );
  }
  return key;
}

async function readJson(response) {
  const text = await response.text();
  if (!text) return {};
  try {
    return JSON.parse(text);
  } catch {
    return { error: text };
  }
}

async function resolveMailboxId(token, mailboxKey) {
  const key = resolveMailboxKey(mailboxKey);
  if (mailboxIdCache[key]) return mailboxIdCache[key];

  const response = await fetch(`${MAIL_API_BASE}/api/v1/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const body = await readJson(response);
  if (!response.ok) {
    throw new Error(body.error || `Hostinger /me failed (${response.status})`);
  }

  const mailboxes = body?.data?.mailboxes || [];
  const wanted = MAILBOXES[key].address.toLowerCase();
  const match =
    mailboxes.find((box) => String(box.address || "").toLowerCase() === wanted) ||
    null;

  if (!match?.resourceId) {
    throw new Error(`No Hostinger mailbox found for ${MAILBOXES[key].address}`);
  }

  mailboxIdCache[key] = match.resourceId;
  return mailboxIdCache[key];
}

async function sendViaHostinger({
  to,
  subject,
  html,
  text,
  from,
  displayName,
  mailbox = DEFAULT_MAILBOX,
}) {
  const token = process.env.HOSTINGER_MAIL_API_TOKEN;
  if (!token) {
    throw new Error("HOSTINGER_MAIL_API_TOKEN is not set");
  }

  const recipients = recipientsOf(to);
  if (!recipients.length) {
    throw new Error("Email recipient is required");
  }

  const mailboxKey = resolveMailboxKey(mailbox);
  const mailboxId = await resolveMailboxId(token, mailboxKey);
  const payload = {
    to: recipients,
    displayName: displayNameFrom(from, displayName),
    subject: subject || "",
    html,
    text: text || htmlToText(html),
  };

  const response = await fetch(
    `${MAIL_API_BASE}/api/v1/mailboxes/${encodeURIComponent(mailboxId)}/send`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }
  );

  if (response.status === 204 || response.ok) {
    console.log(
      `✅ Email sent via Hostinger (${mailboxKey}: ${MAILBOXES[mailboxKey].address}) to ${recipients.join(", ")}`
    );
    return {
      messageId: `hostinger:${mailboxId}`,
      mailbox: mailboxKey,
      from: MAILBOXES[mailboxKey].address,
    };
  }

  const body = await readJson(response);
  const detail = body.error || body.code || `Hostinger send failed (${response.status})`;
  throw new Error(detail);
}

async function sendEmail(options) {
  if (process.env.NODE_ENV === "test") {
    return { messageId: "test-skipped" };
  }

  try {
    return await sendViaHostinger(options);
  } catch (error) {
    console.error("❌ Error sending email:", error.message || error);
    throw error;
  }
}

if (process.env.NODE_ENV !== "test" && process.env.HOSTINGER_MAIL_API_TOKEN) {
  Promise.all(
    Object.keys(MAILBOXES).map(async (key) => {
      const id = await resolveMailboxId(process.env.HOSTINGER_MAIL_API_TOKEN, key);
      console.log(`✅ Hostinger mailbox ready (${key}: ${MAILBOXES[key].address}, ${id})`);
      return id;
    })
  ).catch((error) => {
    console.error("❌ Hostinger Mail API:", error.message || error);
  });
} else if (process.env.NODE_ENV !== "test") {
  console.warn("⚠️ HOSTINGER_MAIL_API_TOKEN is not set. Auth and reset emails will not send.");
}

module.exports = { sendEmail, MAILBOXES };
