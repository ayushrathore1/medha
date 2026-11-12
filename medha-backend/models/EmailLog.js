const mongoose = require("mongoose");

const emailLogSchema = new mongoose.Schema(
  {
    subject: {
      type: String,
      required: true,
    },
    htmlBody: {
      type: String,
      required: true,
    },
    campaignId: {
      type: String,
    },
    status: {
      type: String,
      enum: ["pending", "running", "completed", "interrupted"],
      default: "pending",
    },
    lockUntil: {
      type: Date,
      default: null,
    },
    sentCount: {
      type: Number,
      default: 0,
    },
    totalRecipients: {
      type: Number,
      default: 0,
    },
    recipients: {
      type: [String],
      default: [],
    },
    lastSentAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

emailLogSchema.index({ subject: 1, htmlBody: 1 });
emailLogSchema.index({ campaignId: 1 }, { unique: true, sparse: true });

module.exports = mongoose.model("EmailLog", emailLogSchema);
