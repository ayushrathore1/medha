const User = require("../models/User");

async function requireAdminOrTeam(req, res) {
  const user = await User.findById(req.userId);
  const hasAccess =
    user && (user.isAdmin || user.role === "admin" || user.role === "team");
  if (!hasAccess) {
    res
      .status(403)
      .json({ success: false, message: "Admin/Team access required" });
    return null;
  }
  return user;
}

module.exports = { requireAdminOrTeam };
