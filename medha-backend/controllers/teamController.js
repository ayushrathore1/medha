const User = require("../models/User");
const TeamInvitation = require("../models/TeamInvitation");

/**
 * Accept a pending team invite for the logged-in user.
 * No invite code — admin already approved the email.
 */
exports.verifyTeamInvite = async (req, res) => {
  try {
    const userEmail = String(req.user.email || "").toLowerCase();
    if (!userEmail) {
      return res.status(400).json({ message: "Logged-in email is required." });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    if (user.role === "team" || user.role === "admin" || user.isAdmin) {
      return res.json({
        message: "You are already a team member.",
        role: user.role,
      });
    }

    const invitation = await TeamInvitation.findOne({
      email: userEmail,
      used: false,
      expiresAt: { $gt: new Date() },
    }).sort({ createdAt: -1 });

    if (!invitation) {
      return res.status(404).json({
        message:
          "No pending team invite for this email. Ask an admin to invite you again.",
      });
    }

    user.role = "team";
    user.isAdmin = false;
    await user.save();

    invitation.used = true;
    await invitation.save();

    res.json({
      message: "Welcome to the Medha Revision team.",
      role: user.role,
    });
  } catch (error) {
    console.error("Error verifying invitation:", error);
    res.status(500).json({ message: "Could not join the team." });
  }
};

/** Apply a pending invite after login/register (no response shape change needed by callers). */
exports.applyPendingTeamInvite = async (userDoc) => {
  if (!userDoc?.email) return userDoc;
  if (userDoc.role === "team" || userDoc.role === "admin" || userDoc.isAdmin) {
    return userDoc;
  }
  const invitation = await TeamInvitation.findOne({
    email: String(userDoc.email).toLowerCase(),
    used: false,
    expiresAt: { $gt: new Date() },
  }).sort({ createdAt: -1 });
  if (!invitation) return userDoc;
  userDoc.role = "team";
  userDoc.isAdmin = false;
  await userDoc.save();
  invitation.used = true;
  await invitation.save();
  return userDoc;
};

// Check if user has team access
exports.checkTeamAccess = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select(
      "name email role isAdmin"
    );
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const hasAccess =
      user.role === "team" || user.role === "admin" || user.isAdmin;

    res.json({
      hasAccess,
      role: user.role,
      isAdmin: user.isAdmin || false,
      user: {
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Error checking team access:", error);
    res.status(500).json({ message: "Failed to check team access" });
  }
};

// Get all users (for team dashboard - limited fields)
exports.getTeamUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select(
        "name email emailVerified university college branch year role createdAt"
      )
      .lean();
    res.json(users);
  } catch (error) {
    console.error("Error fetching users for team:", error);
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

// Get team members only
exports.getTeamMembers = async (req, res) => {
  try {
    const teamMembers = await User.find({
      $or: [{ role: "team" }, { role: "admin" }, { isAdmin: true }],
    })
      .select("name email role isAdmin createdAt")
      .lean();

    res.json(teamMembers);
  } catch (error) {
    console.error("Error fetching team members:", error);
    res.status(500).json({ message: "Failed to fetch team members" });
  }
};
