/**
 * Send a quick test email via Hostinger Mail API (sendEmail helper).
 * Run from medha-backend: node sendTestMail.js [to@email.com]
 */

require("dotenv").config();

const { sendEmail } = require("./utils/sendEmail");

const TO = process.argv[2] || process.env.MAIL_TEST_TO || "rathoreayush512@gmail.com";
const FROM = process.env.MAIL_FROM_ADDRESS || "medharevision@codelearnn.com";

async function main() {
  console.log(`From: ${FROM}`);
  console.log(`To:   ${TO}`);
  console.log(`API:  ${process.env.HOSTINGER_MAIL_API_BASE || "https://api.mail.hostinger.com"}`);

  await sendEmail({
    to: TO,
    subject: "Medha Revision — Hostinger mail test",
    displayName: "Medha Revision",
    html: `<p>Hostinger Mail API is working for <strong>${FROM}</strong>.</p>
<p>Welcome, OTP, password-reset, and credentials emails use this path.</p>`,
    text: `Hostinger Mail API is working for ${FROM}.`,
  });

  console.log("✅ Test send completed");
}

main().catch((err) => {
  console.error("Fatal:", err.message || err);
  process.exit(1);
});
