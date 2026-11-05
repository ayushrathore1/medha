const React = require("react");
const { Text } = require("react-email");
const { MedhaLayout } = require("./components/Layout");
const { colors, fontJakarta, fontMono, links, styles } = require("./components/styles");
const {
  EmailKicker,
  EmailTitle,
  EmailLead,
  EmailButton,
  EmailPanel,
} = require("./components/primitives");
const h = React.createElement;

function CredentialsEmail({
  name,
  email,
  password,
  generated = false,
  forgotPasswordUrl = links.forgotPassword,
}) {
  const first = String(name || "there").split(" ")[0];
  const resetHint = forgotPasswordUrl || links.forgotPassword;

  return h(
    MedhaLayout,
    {
      preview: `Your Medha Revision login details for ${email}`,
    },
    h(EmailKicker, null, "Your login"),
    h(EmailTitle, null, `You're signed up, ${first}.`),
    h(
      EmailLead,
      null,
      generated
        ? "You signed in with a one-time code, so we created a unique password for email login too."
        : "Keep these details somewhere safe. You can sign in with email and password anytime."
    ),

    h(
      EmailPanel,
      { accent: colors.lime },
      h(
        "div",
        {
          style: {
            fontFamily: fontJakarta,
            fontSize: "12px",
            fontWeight: "700",
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: colors.muted,
            marginBottom: "10px",
          },
        },
        "Login email"
      ),
      h(
        Text,
        {
          style: {
            ...styles.body,
            margin: "0 0 18px 0",
            color: colors.ink,
            fontWeight: "700",
            wordBreak: "break-all",
          },
        },
        email
      ),
      h(
        "div",
        {
          style: {
            fontFamily: fontJakarta,
            fontSize: "12px",
            fontWeight: "700",
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: colors.muted,
            marginBottom: "10px",
          },
        },
        generated ? "Generated password" : "Password"
      ),
      h(
        Text,
        {
          style: {
            margin: 0,
            fontFamily: fontMono,
            fontSize: "22px",
            fontWeight: "700",
            letterSpacing: "0.08em",
            color: colors.ink,
          },
        },
        password
      )
    ),

    h(
      Text,
      { style: { ...styles.body, marginTop: "22px" } },
      "You can change this password anytime with the forgot password link."
    ),

    h(EmailButton, { href: resetHint }, "Forgot password"),

    h(
      Text,
      { style: { ...styles.note, textAlign: "center", marginTop: "8px" } },
      "Or open ",
      h(
        "a",
        {
          href: resetHint,
          style: {
            color: colors.ink,
            fontWeight: "600",
            textDecoration: "none",
            wordBreak: "break-all",
          },
        },
        resetHint
      )
    ),

    h(
      Text,
      { style: { ...styles.note, marginTop: "22px" } },
      "This message was sent from ",
      h(
        "a",
        {
          href: `mailto:${links.authMail}`,
          style: { color: colors.ink, fontWeight: "600", textDecoration: "none" },
        },
        links.authMail
      ),
      "."
    )
  );
}

module.exports = { CredentialsEmail };
