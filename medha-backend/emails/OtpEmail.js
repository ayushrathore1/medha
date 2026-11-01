const React = require("react");
const { Text } = require("react-email");
const { MedhaLayout } = require("./components/Layout");
const { colors, links, styles } = require("./components/styles");
const { EmailKicker, EmailTitle, EmailLead, EmailCode } = require("./components/primitives");
const h = React.createElement;

function OtpEmail({ code, type = "verification", expiryMinutes = 10 }) {
  const isLogin = type === "login";
  const title = isLogin ? "Your login code" : "Verify your email";
  const lead = isLogin
    ? "Use this code to sign in to Medha Revision. Do not share it."
    : "Use this code to finish creating your Medha Revision account.";

  return h(MedhaLayout, {
    preview: `${title}: ${code}. Expires in ${expiryMinutes} minutes.`,
  },
    h(EmailKicker, null, isLogin ? "Sign in" : "Email verification"),
    h(EmailTitle, null, title),
    h(EmailLead, null, lead),
    h(EmailCode, {
      value: code,
      caption: `Expires in ${expiryMinutes} minutes`,
    }),
    h(Text, {
      style: { ...styles.body, textAlign: "center", marginBottom: 8 },
    },
      isLogin
        ? "If you did not try to sign in, you can ignore this email."
        : "If you did not create an account, you can ignore this email."
    ),
    h(Text, {
      style: { ...styles.note, textAlign: "center" },
    },
      "Sent from ",
      h("a", { href: `mailto:${links.authMail}`, style: { color: colors.ink, fontWeight: "600", textDecoration: "none" } }, links.authMail)
    )
  );
}

module.exports = { OtpEmail };
