const React = require("react");
const { sendEmail } = require("./sendEmail");
const { renderEmail } = require("../emails/renderEmail");
const { NotePipelineEmail } = require("../emails/NotePipelineEmail");

async function sendNotePipelineEmail({ to, name, title, variant, reason }) {
  if (!to) return { sent: false, skipped: true };
  try {
    const element = React.createElement(NotePipelineEmail, {
      name,
      title,
      variant,
      reason,
    });
    const html = await renderEmail(element);
    const subject =
      variant === "live"
        ? `Your notes “${title}” are live on Medha Revision`
        : variant === "rejected"
          ? `Update on your Medha Revision upload`
          : `Update on your Medha Revision upload`;

    await sendEmail({
      to,
      subject,
      html,
      text:
        variant === "live"
          ? `Hi ${name || "there"}, your notes "${title}" are now live on Medha Revision.`
          : `Hi ${name || "there"}, we could not publish "${title}". ${reason || ""}`.trim(),
    });
    return { sent: true };
  } catch (err) {
    console.error("[NoteEmail] Failed:", err.message);
    return { sent: false, error: err.message };
  }
}

module.exports = { sendNotePipelineEmail };
