require("dotenv").config();

const MAIL_API_BASE = process.env.HOSTINGER_MAIL_API_BASE || "https://api.mail.hostinger.com";
const MAIL_FROM_ADDRESS = process.env.MAIL_FROM_ADDRESS || "medharevision@codelearnn.com";
const MAIL_FROM_NAME = process.env.MAIL_FROM_NAME || "Medha Revision";

let cachedMailboxId = process.env.HOSTINGER_MAILBOX_RESOURCE_ID || "";

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

async function readJson(response) {
  const text = await response.text();
  if (!text) return {};
  try {
    return JSON.parse(text);
  } catch {
    return { error: text };
  }
}

async function resolveMailboxId(token) {
  if (cachedMailboxId) return cachedMailboxId;

  const response = await fetch(`${MAIL_API_BASE}/api/v1/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const body = await readJson(response);
  if (!response.ok) {
    throw new Error(body.error || `Hostinger /me failed (${response.status})`);
  }

  const mailboxes = body?.data?.mailboxes || [];
  const wanted = MAIL_FROM_ADDRESS.toLowerCase();
  const match =
    mailboxes.find((box) => String(box.address || "").toLowerCase() === wanted) ||
    mailboxes[0];

  if (!match?.resourceId) {
    throw new Error(`No Hostinger mailbox found for ${MAIL_FROM_ADDRESS}`);
  }

  cachedMailboxId = match.resourceId;
  return cachedMailboxId;
}

async function sendViaHostinger({ to, subject, html, text, from, displayName }) {
  const token = process.env.HOSTINGER_MAIL_API_TOKEN;
  if (!token) {
    throw new Error("HOSTINGER_MAIL_API_TOKEN is not set");
  }

  const recipients = recipientsOf(to);
  if (!recipients.length) {
    throw new Error("Email recipient is required");
  }

  const mailboxId = await resolveMailboxId(token);
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
    console.log(`✅ Email sent via Hostinger Mail API to ${recipients.join(", ")}`);
    return { messageId: `hostinger:${mailboxId}` };
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
  resolveMailboxId(process.env.HOSTINGER_MAIL_API_TOKEN)
    .then((id) => {
      console.log(`✅ Hostinger Mail API ready (${MAIL_FROM_ADDRESS}, ${id})`);
    })
    .catch((error) => {
      console.error("❌ Hostinger Mail API:", error.message || error);
    });
} else if (process.env.NODE_ENV !== "test") {
  console.warn("⚠️ HOSTINGER_MAIL_API_TOKEN is not set. Auth and reset emails will not send.");
}

module.exports = { sendEmail };
