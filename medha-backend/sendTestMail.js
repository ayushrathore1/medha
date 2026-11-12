/**
 * Send a quick test email via Hostinger Mail API (sendEmail helper).
 * Run from medha-backend:
 *   node sendTestMail.js [to@email.com] [auth|hello|announcement]
 */

require("dotenv").config();

const { sendEmail, MAILBOXES } = require("./utils/sendEmail");

const TO = process.argv[2] || process.env.MAIL_TEST_TO || "rathoreayush512@gmail.com";
const MAILBOX = (process.argv[3] || process.env.MAIL_TEST_MAILBOX || "auth").toLowerCase();

async function main() {
  const box = MAILBOXES[MAILBOX];
  if (!box) {
    throw new Error(`Unknown mailbox "${MAILBOX}". Use auth, hello, or announcement.`);
  }

  console.log(`Mailbox: ${MAILBOX}`);
  console.log(`From:    ${box.address}`);
  console.log(`To:      ${TO}`);
  console.log(`API:     ${process.env.HOSTINGER_MAIL_API_BASE || "https://api.mail.hostinger.com"}`);

  await sendEmail({
    mailbox: MAILBOX,
    to: TO,
    subject: `Medha Revision — ${MAILBOX} mailbox test`,
    displayName: "Medha Revision",
    html: `<p>Hostinger Mail API is working for <strong>${box.address}</strong> (${MAILBOX}).</p>`,
    text: `Hostinger Mail API is working for ${box.address} (${MAILBOX}).`,
  });

  console.log("✅ Test send completed");
}

main().catch((err) => {
  console.error("Fatal:", err.message || err);
  process.exit(1);
});
