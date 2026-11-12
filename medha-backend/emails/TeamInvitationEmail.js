const React = require("react");
const { Text } = require("react-email");
const { MedhaLayout } = require("./components/Layout");
const { colors, links, styles } = require("./components/styles");
const {
  EmailKicker,
  EmailTitle,
  EmailLead,
  EmailButton,
  EmailPanel,
} = require("./components/primitives");
const h = React.createElement;

function TeamInvitationEmail({ firstName, joinLink, alreadyMember = false }) {
  const first = firstName || "there";
  const cta = alreadyMember ? "Open Ops desk" : "Join the team";

  return h(
    MedhaLayout,
    {
      preview:
        "You're on the Medha Revision team — early access before we open to everyone.",
    },
    h(EmailKicker, null, "Team access"),
    h(EmailTitle, null, "Welcome to the Medha Revision team"),
    h(
      EmailLead,
      null,
      `Hi ${first}. You've been given access to the Medha Revision team.`
    ),
    h(
      EmailPanel,
      { accent: colors.green },
      h(
        Text,
        { style: { ...styles.body, margin: "0 0 12px 0", color: colors.ink } },
        "You're accessing the platform before we open it for other users. Use this early window to check the product, improve it, and add what engineering students actually need."
      ),
      h(
        Text,
        { style: { ...styles.body, margin: 0, color: colors.ink } },
        "Help make Medha Revision the best place for engineering students to get the right resources for their prep — curriculum, notes, and revision that match their semester and branch."
      )
    ),
    h(
      Text,
      { style: { ...styles.body, margin: "20px 0 0 0", color: colors.ink } },
      alreadyMember
        ? "Your team access is already active. Sign in with this email and open the Ops desk to start."
        : "Sign in (or create an account) with this same email, then open the link below — no invite code needed. Admin already approved you."
    ),
    h(EmailButton, { href: joinLink }, cta),
    h(
      Text,
      { style: styles.note },
      "Questions: ",
      h(
        "a",
        {
          href: `mailto:${links.helloMail}`,
          style: {
            color: colors.ink,
            fontWeight: "600",
            textDecoration: "none",
          },
        },
        links.helloMail
      )
    )
  );
}

module.exports = { TeamInvitationEmail };
