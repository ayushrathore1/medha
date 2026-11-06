const React = require("react");
const { MedhaLayout } = require("./components/Layout");
const { colors, fontJakarta } = require("./components/styles");
const { EmailKicker, EmailTitle, EmailLead, EmailButton, EmailPanel } = require("./components/primitives");
const h = React.createElement;

function NotePipelineEmail({ name, title, variant, reason }) {
  const first = String(name || "there").split(" ")[0];
  const isLive = variant === "live";
  const isReject = variant === "rejected";

  const kicker = isLive ? "Your notes are live" : isReject ? "Upload update" : "Update";
  const heading = isLive
    ? "Your notes are now available"
    : isReject
      ? "We could not publish this upload"
      : "Update on your upload";
  const lead = isLive
    ? `Hi ${first}, your file “${title}” passed our review and is now live for other students on Medha Revision.`
    : isReject
      ? `Hi ${first}, thank you for contributing to Medha Revision. After an automated review, we are unable to publish “${title}” for all students.`
      : `Hi ${first}, there is an update regarding “${title}”.`;

  return h(MedhaLayout, {
    preview: heading,
    children: [
      h(EmailKicker, null, kicker),
      h(EmailTitle, null, heading),
      h(EmailLead, null, lead),
      reason
        ? h(EmailPanel, null,
            h("div", {
              style: {
                fontFamily: fontJakarta,
                fontSize: "14px",
                lineHeight: "1.55",
                color: colors.muted,
              },
            }, reason)
          )
        : null,
      isReject
        ? h(EmailLead, null,
            "You can keep the file in your private library, revise the content, or upload a clearer academic PDF. If you believe this was a mistake, reply to this email and our team will take another look.")
        : null,
      isLive
        ? h(EmailButton, { href: "https://medharevision.shopcampuskart.in/uploads" }, "View your uploads")
        : h(EmailButton, { href: "https://medharevision.shopcampuskart.in/upload" }, "Upload again"),
    ],
  });
}

module.exports = { NotePipelineEmail };
