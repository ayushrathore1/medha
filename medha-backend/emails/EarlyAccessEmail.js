const React = require("react");
const { Text, Link } = require("react-email");
const { MedhaLayout } = require("./components/Layout");
const { colors, fontJakarta, clLinks, styles } = require("./components/styles");
const { EmailKicker, EmailTitle, EmailLead, EmailButton, EmailPanel } = require("./components/primitives");
const h = React.createElement;

function EarlyAccessEmail({ name }) {
  const first = String(name || "there").split(" ")[0];

  return h(MedhaLayout, {
    preview: "A free Vibe Coding guide, and early access to CodeLearnn, from the Medha Revision team.",
  },
    h(EmailKicker, null, "From the Medha Revision team"),
    h(EmailTitle, null, `Hey ${first}.`),
    h(EmailLead, null, "You've been using Medha Revision for exam prep. On the side we built CodeLearnn — a structured path from scattered videos to a job-ready roadmap."),

    h(EmailPanel, { accent: colors.lime },
      h(Text, {
        style: { ...styles.kicker, color: colors.ink, marginBottom: 8 },
      }, "Free guide"),
      h(Text, {
        style: {
          margin: "0 0 8px 0",
          fontFamily: fontJakarta,
          fontSize: "18px",
          fontWeight: "800",
          letterSpacing: "-0.03em",
          color: colors.ink,
        },
      }, "The Vibe Coding Playbook"),
      h(Text, { style: { ...styles.body, margin: 0 } },
        "Build and ship a small AI-powered app with no prior coding experience. Prompts, deploy steps, and a weekend workflow."
      )
    ),
    h(EmailButton, { href: clLinks.vibeCodingGuide, variant: "lime" }, "Read the free guide"),

    h(Text, {
      style: { ...styles.body, marginTop: 28 },
    },
      "CodeLearnn is launching soon. Medha Revision users get first access. Join the waitlist if you want a structured learning OS after exams."
    ),
    h(EmailButton, { href: clLinks.waitlist }, "Join the CodeLearnn waitlist"),

    h(Text, { style: styles.note },
      "Questions: reply or write to ",
      h(Link, {
        href: `mailto:${clLinks.feedbackEmail}`,
        style: { color: colors.ink, fontWeight: "600", textDecoration: "none" },
      }, clLinks.feedbackEmail),
      "."
    )
  );
}

module.exports = { EarlyAccessEmail };
