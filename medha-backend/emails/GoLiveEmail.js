const React = require("react");
const { Text } = require("react-email");
const { MedhaLayout } = require("./components/Layout");
const { colors, fontJakarta, links, styles } = require("./components/styles");
const {
  EmailKicker,
  EmailTitle,
  EmailLead,
  EmailButton,
  EmailChip,
  EmailPanel,
} = require("./components/primitives");
const h = React.createElement;

function FeatureRow({ title, copy }) {
  return h(
    "tr",
    null,
    h(
      "td",
      {
        style: {
          padding: "12px 0",
          borderBottom: `1px solid ${colors.line}`,
          fontFamily: fontJakarta,
        },
      },
      h(
        "div",
        {
          style: {
            fontSize: "15px",
            fontWeight: "700",
            color: colors.ink,
            letterSpacing: "-0.02em",
          },
        },
        title
      ),
      h(
        "div",
        {
          style: {
            marginTop: "4px",
            fontSize: "14px",
            lineHeight: "1.55",
            color: colors.muted,
          },
        },
        copy
      )
    )
  );
}

function GoLiveEmail({ name, contactMail }) {
  const first = String(name || "there").split(" ")[0];
  const contact = contactMail || links.helloMail;

  return h(
    MedhaLayout,
    {
      preview: `Medha Revision is live, ${first}. Open your syllabus and start revising.`,
    },
    h(EmailKicker, null, "We're live"),
    h(EmailTitle, null, `Medha Revision is live, ${first}.`),
    h(
      EmailLead,
      null,
      "The early-access gate is open. Notes, lectures, past papers and syllabus search are ready for everyone — pick your university and get going."
    ),

    h(
      "div",
      { style: { margin: "0 0 8px 0" } },
      h(EmailChip, { fill: true }, "Open to all students"),
      h(EmailChip, null, "Syllabus search"),
      h(EmailChip, null, "Notes · PYQs · Lectures")
    ),

    h(
      "table",
      {
        role: "presentation",
        width: "100%",
        cellPadding: "0",
        cellSpacing: "0",
        style: { marginTop: "18px", borderCollapse: "collapse" },
      },
      h(
        "tbody",
        null,
        h(FeatureRow, {
          title: "Search your topic",
          copy: "Type a unit or topic. We surface notes, YouTube lectures and GeeksforGeeks on your scheme.",
        }),
        h(FeatureRow, {
          title: "Stay on your syllabus",
          copy: "RTU and autonomous schemes stay separate, even when subject names match.",
        }),
        h(FeatureRow, {
          title: "Share notes, earn Aura",
          copy: "Upload class notes. You earn Aura when another student downloads them.",
        })
      )
    ),

    h(EmailButton, { href: links.website }, "Open Medha Revision"),

    h(
      EmailPanel,
      { accent: colors.lime },
      h(
        Text,
        { style: { ...styles.body, margin: 0, color: colors.ink } },
        "Tip: set your university on the home page first. Search then opens with subject and unit already scoped."
      )
    ),

    h(
      Text,
      { style: styles.note },
      "Questions? Write to ",
      h(
        "a",
        {
          href: `mailto:${contact}`,
          style: { color: colors.ink, fontWeight: "600", textDecoration: "none" },
        },
        contact
      ),
      "."
    )
  );
}

module.exports = { GoLiveEmail };
