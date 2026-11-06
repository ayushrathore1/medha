const Note = require("../models/Note");
const User = require("../models/User");
const { sendNotePipelineEmail } = require("../utils/noteEmails");
const { queueStats } = require("../utils/groqQueue");

/** Staff: list notes that passed AI and need categorization */
exports.listAwaitingTeam = async (req, res) => {
  try {
    const notes = await Note.find({
      isPublic: true,
      verificationStatus: "awaiting_team",
    })
      .sort({ createdAt: 1 })
      .limit(100)
      .populate("owner", "name email")
      .lean();

    res.json({
      notes,
      queue: queueStats(),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/** Staff: list pending AI scans (optional visibility) */
exports.listPendingScans = async (req, res) => {
  try {
    const notes = await Note.find({
      isPublic: true,
      verificationStatus: "pending",
    })
      .sort({ createdAt: 1 })
      .limit(50)
      .populate("owner", "name email")
      .select("-extractedText")
      .lean();
    res.json({ notes, queue: queueStats() });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * Staff categorizes + publishes (or rejects) a note.
 * Body: { action: "publish"|"reject", subjectTag?, semester?, noteType?, reason? }
 */
exports.reviewNote = async (req, res) => {
  try {
    const { noteId } = req.params;
    const { action, subjectTag, semester, noteType, reason } = req.body || {};

    if (!["publish", "reject"].includes(action)) {
      return res.status(400).json({ message: "action must be publish or reject" });
    }

    const note = await Note.findById(noteId);
    if (!note) return res.status(404).json({ message: "Note not found" });

    if (!["awaiting_team", "pending", "rejected"].includes(note.verificationStatus)) {
      return res.status(409).json({
        message: `Note is ${note.verificationStatus} and cannot be reviewed this way`,
      });
    }

    note.teamReviewedBy = req.userId;
    note.teamReviewedAt = new Date();

    if (action === "reject") {
      note.verificationStatus = "rejected";
      note.pipelineStage = "failed";
      note.isPublic = false;
      note.verificationReason = reason || "Our team could not approve this upload for public sharing.";
      await note.save();

      if (!note.emailsSent?.rejected) {
        const owner = await User.findById(note.owner).select("name email");
        if (owner?.email) {
          const mail = await sendNotePipelineEmail({
            to: owner.email,
            name: owner.name,
            title: note.title,
            variant: "rejected",
            reason: note.verificationReason,
          });
          if (mail.sent) {
            note.emailsSent = { ...(note.emailsSent.toObject?.() || note.emailsSent || {}), rejected: true };
            await note.save();
          }
        }
      }

      return res.json({ message: "Note rejected", note });
    }

    if (subjectTag) note.subjectTag = String(subjectTag).trim();
    if (semester) note.semester = String(semester).trim();
    if (noteType) note.noteType = String(noteType).trim();
    if (!note.subjectTag) {
      return res.status(400).json({ message: "subjectTag is required to publish" });
    }

    note.verificationStatus = "approved";
    note.pipelineStage = "done";
    note.isPublic = true;
    note.verificationReason = reason || "Approved and categorized by the Medha team.";
    await note.save();

    if (!note.emailsSent?.live) {
      const owner = await User.findById(note.owner).select("name email");
      if (owner?.email) {
        const mail = await sendNotePipelineEmail({
          to: owner.email,
          name: owner.name,
          title: note.title,
          variant: "live",
          reason: "Students can now find and download your notes.",
        });
        if (mail.sent) {
          note.emailsSent = { ...(note.emailsSent.toObject?.() || note.emailsSent || {}), live: true };
          await note.save();
        }
      }
    }

    res.json({ message: "Note published", note });
  } catch (err) {
    console.error("reviewNote:", err);
    res.status(500).json({ message: err.message });
  }
};
