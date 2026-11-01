const React = require("react");
const { Text } = require("react-email");
const { MedhaLayout } = require("./components/Layout");
const { colors, links, styles } = require("./components/styles");
const { EmailKicker, EmailTitle, EmailLead, EmailButton, EmailChip, EmailPanel } = require("./components/primitives");
const h = React.createElement;

function ReEngagementEmail({ name, feedbackUrl }) {
  const first = String(name || "there").split(" ")[0];
  const href = feedbackUrl || links.suggest;

  return h(MedhaLayout, {
    preview: `${first}, Medha Revision has a new search. Tell us what you still need.`,
  },
    h(EmailKicker, null, "We've been building"),
    h(EmailTitle, null, `Hey ${first}.`),
    h(EmailLead, null, "You signed up earlier. The product is different now: university-aware search, notes, lectures and previous-year questions on the same syllabus map."),
    h("div", { style: { marginBottom: 16 } },
      h(EmailChip, { fill: true }, "Smarter search"),
      h(EmailChip, null, "Notes"),
      h(EmailChip, null, "PYQs")
    ),
    h(EmailPanel, { accent: colors.lime },
      h(Text, {
        style: { ...styles.body, margin: "0 0 8px 0", color: colors.ink, fontWeight: "700" },
      }, "Tell us what would make you open Medha every week."),
      h(Text, { style: { ...styles.note, color: colors.muted } },
        "A missing subject. A better notes flow. Or something we should stop doing."
      )
    ),
    h(EmailButton, { href }, "Send a suggestion"),
    h(Text, { style: { ...styles.note, textAlign: "center" } },
      "Takes about 30 seconds. We read every reply."
    )
  );
}

module.exports = { ReEngagementEmail };
