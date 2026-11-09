const User = require("../models/User");

// Get the current user's profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found." });
    res.json({ user });
  } catch (err) {
    console.error("Get Profile Error:", err);
    res.status(500).json({ message: "Server error fetching profile." });
  }
};

// Update the current user's profile (no password update here)
exports.updateProfile = async (req, res) => {
  try {
    const {
      name,
      college,
      university,
      branch,
      year,
      semester,
      gender,
      avatar,
      avatarIndex,
    } = req.body;
    const updateFields = {};

    if (name) updateFields.name = name;
    if (college !== undefined) updateFields.college = college;
    if (university) updateFields.university = university;
    if (branch) updateFields.branch = branch;
    // Register stores semester in `year`; accept either key from the client
    const yearValue = String(year || semester || "").trim();
    if (yearValue) updateFields.year = yearValue;
    if (gender) updateFields.gender = gender;
    if (avatar !== undefined) updateFields.avatar = avatar;
    if (typeof avatarIndex === "number") updateFields.avatarIndex = avatarIndex;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updateFields },
      { new: true, runValidators: true, select: "-password" }
    );
    if (!user) return res.status(404).json({ message: "User not found." });

    res.json({ message: "Profile updated.", user });
  } catch (err) {
    console.error("Update Profile Error:", err);
    res.status(500).json({ message: "Server error updating profile." });
  }
};

// (Optional) Delete own account
exports.deleteAccount = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found." });
    // You should also cascade delete related data (notes, flashcards, etc.) if needed
    res.json({ message: "User account deleted." });
  } catch (err) {
    console.error("Delete Account Error:", err);
    res.status(500).json({ message: "Error deleting account." });
  }
};
