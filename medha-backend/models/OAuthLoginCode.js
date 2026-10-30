const mongoose = require("mongoose");

/**
 * One-time Google login codes. The OAuth callback stores the JWT here and
 * redirects the browser with only `code`. POST /api/auth/google/exchange
 * consumes the document and returns the token in the JSON body.
 */
const oauthLoginCodeSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    token: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    used: {
      type: Boolean,
      default: false,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

oauthLoginCodeSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model("OAuthLoginCode", oauthLoginCodeSchema);
