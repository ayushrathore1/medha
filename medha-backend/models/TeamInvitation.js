const mongoose = require("mongoose");

const teamInvitationSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  /** Legacy field — invites no longer require a user-entered code. */
  code: {
    type: String,
    required: false,
    default: null,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
  used: {
    type: Boolean,
    default: false,
  },
  invitedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
}, { timestamps: true });

// Auto-expire documents after expiry
// Note: expiresAt is the actual date/time of expiration.
// We can use TTL index on expiresAt. mongo will remove document after this time.
teamInvitationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model("TeamInvitation", teamInvitationSchema);
