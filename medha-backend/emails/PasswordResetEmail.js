const React = require("react");
const { Text } = require("react-email");
const { MedhaLayout } = require("./components/Layout");
const { colors, links, styles } = require("./components/styles");
const { EmailKicker, EmailTitle, EmailLead, EmailButton, EmailPanel } = require("./components/primitives");
const h = React.createElement;

function PasswordResetEmail({ name, resetUrl, ttlMinutes = 30 }) {
  const first = String(name || "there").split(" ")[0];

  return h(MedhaLayout, {
    preview: `Reset your Medha Revision password. This link expires in ${ttlMinutes} minutes.`,
  },
    h(EmailKicker, null, "Account recovery"),
    h(EmailTitle, null, "Reset your password"),
    h(EmailLead, null,
      `Hi ${first}. We received a request to reset the password on this Medha Revision account.`
    ),
    h(EmailPanel, { accent: colors.orange },
      h(Text, { style: { ...styles.body, margin: 0, color: colors.ink } },
        `The link below works once and expires in ${ttlMinutes} minutes.`
      )
    ),
    h(EmailButton, { href: resetUrl }, "Set a new password"),
    h(Text, { style: { ...styles.note, textAlign: "center", marginTop: 8 } },
      "If the button does not open, copy this link into your browser."
    ),
    h(Text, {
      style: {
        ...styles.note,
        textAlign: "center",
        marginTop: 10,
        wordBreak: "break-all",
        color: colors.muted,
      },
    }, resetUrl),
    h(Text, { style: { ...styles.body, marginTop: 24 } },
      "If you did not ask for this, ignore the email. Your current password stays the same."
    ),
    h(Text, { style: styles.note },
      "This message was sent from ",
      h("a", { href: `mailto:${links.authMail}`, style: { color: colors.ink, fontWeight: "600", textDecoration: "none" } }, links.authMail),
      "."
    )
  );
}

module.exports = { PasswordResetEmail };
