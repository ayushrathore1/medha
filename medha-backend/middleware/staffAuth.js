const User = require("../models/User");

function isFullAdmin(user) {
  return Boolean(user && (user.isAdmin || user.role === "admin"));
}

function isStaff(user) {
  return Boolean(user && (isFullAdmin(user) || user.role === "team"));
}

/**
 * Staff = admin (super) OR team member.
 * Content management (curriculum CRUD) uses this gate.
 */
const staffAuth = async (req, res, next) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ error: "Authentication required" });
    }
    const user = await User.findById(req.userId).select("email role isAdmin name");
    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }
    if (!isStaff(user)) {
      return res.status(403).json({ error: "Team or admin access required" });
    }
    req.staffUser = user;
    req.isFullAdmin = isFullAdmin(user);
    req.isStaff = true;
    next();
  } catch (error) {
    console.error("staffAuth error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

/**
 * Super-admin only — role assignment, invites, destructive user ops.
 */
const fullAdminAuth = async (req, res, next) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ error: "Authentication required" });
    }
    const user = await User.findById(req.userId).select("email role isAdmin name");
    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }
    if (!isFullAdmin(user)) {
      return res.status(403).json({ error: "Admin access required" });
    }
    req.staffUser = user;
    req.isFullAdmin = true;
    req.isStaff = true;
    next();
  } catch (error) {
    console.error("fullAdminAuth error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = {
  staffAuth,
  fullAdminAuth,
  isFullAdmin,
  isStaff,
};
