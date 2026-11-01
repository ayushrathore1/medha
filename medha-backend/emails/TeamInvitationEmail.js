const React = require("react");
const { Text } = require("react-email");
const { MedhaLayout } = require("./components/Layout");
const { colors, links, styles } = require("./components/styles");
const { EmailKicker, EmailTitle, EmailLead, EmailButton, EmailCode, EmailPanel } = require("./components/primitives");
const h = React.createElement;

function TeamInvitationEmail({ firstName, code, joinLink }) {
  const first = firstName || "there";

  return h(MedhaLayout, {
    preview: `You're invited to the Medha Revision team. Invite code ${code}.`,
  },
    h(EmailKicker, null, "Team invite"),
    h(EmailTitle, null, "You're invited"),
    h(EmailLead, null,
      `Hi ${first}. Ayush Rathore invited you to join the Medha Revision team.`
    ),
    h(EmailPanel, { accent: colors.green },
      h(Text, { style: { ...styles.body, margin: 0, color: colors.ink } },
        "We're building a syllabus-first study search for college exams. Accept the invite with the email this message reached."
      )
    ),
    h(EmailButton, { href: joinLink }, "Accept invitation"),
    h(Text, { style: { ...styles.note, textAlign: "center" } }, "Or enter this code if the page asks for one."),
    h(EmailCode, { value: code, caption: "Invitation code" }),
    h(Text, { style: styles.note },
      "Questions: ",
      h("a", { href: `mailto:${links.authMail}`, style: { color: colors.ink, fontWeight: "600", textDecoration: "none" } }, links.authMail)
    )
  );
}

module.exports = { TeamInvitationEmail };
