const React = require("react");
const { Text } = require("react-email");
const { MedhaLayout } = require("./components/Layout");
const { colors, fontJakarta, links, styles } = require("./components/styles");
const { EmailKicker, EmailTitle, EmailLead, EmailButton, EmailChip, EmailPanel } = require("./components/primitives");
const h = React.createElement;

function FeatureRow({ title, copy }) {
  return h("tr", null,
    h("td", {
      style: {
        padding: "12px 0",
        borderBottom: `1px solid ${colors.line}`,
        fontFamily: fontJakarta,
      },
    },
      h("div", {
        style: {
          fontSize: "15px",
          fontWeight: "700",
          color: colors.ink,
          letterSpacing: "-0.02em",
        },
      }, title),
      h("div", {
        style: {
          marginTop: "4px",
          fontSize: "14px",
          lineHeight: "1.55",
          color: colors.muted,
        },
      }, copy)
    )
  );
}

function WelcomeEmail({ name }) {
  const first = String(name || "there").split(" ")[0];

  return h(MedhaLayout, {
    preview: `Welcome to Medha Revision, ${first}. Your syllabus is now searchable.`,
  },
    h(EmailKicker, null, "Welcome"),
    h(EmailTitle, null, `You're in, ${first}.`),
    h(EmailLead, null, "Medha Revision maps notes, lectures and previous-year questions to the syllabus you actually sit. Start with your university, then search a topic."),

    h("div", { style: { margin: "0 0 8px 0" } },
      h(EmailChip, { fill: true }, "RTU past papers"),
      h(EmailChip, null, "Notes"),
      h(EmailChip, null, "Syllabus-matched lectures")
    ),

    h("table", {
      role: "presentation",
      width: "100%",
      cellPadding: "0",
      cellSpacing: "0",
      style: { marginTop: "18px", borderCollapse: "collapse" },
    },
      h("tbody", null,
        h(FeatureRow, {
          title: "Search a topic",
          copy: "Type a unit heading or topic. We pull notes, YouTube lectures and GeeksforGeeks.",
        }),
        h(FeatureRow, {
          title: "Stay on your syllabus",
          copy: "RTU and autonomous schemes stay separate, even when the subject name is the same.",
        }),
        h(FeatureRow, {
          title: "Share notes, earn Aura",
          copy: "Upload class notes. You earn Aura when another student downloads them.",
        })
      )
    ),

    h(EmailButton, { href: links.subjects }, "Open my syllabus"),

    h(EmailPanel, { accent: colors.lime },
      h(Text, { style: { ...styles.body, margin: 0, color: colors.ink } },
        "Tip: pick your university on the home page first. Search then opens with subject and unit already set."
      )
    ),

    h(Text, { style: styles.note },
      "Need help? Write to ",
      h("a", { href: `mailto:${links.authMail}`, style: { color: colors.ink, fontWeight: "600", textDecoration: "none" } }, links.authMail),
      "."
    )
  );
}

module.exports = { WelcomeEmail };
