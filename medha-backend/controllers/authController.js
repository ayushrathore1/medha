const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const env = require("../config/env");
const { applyPendingTeamInvite } = require("./teamController");
const { applyDailyActivity } = require("../utils/streak");

// Helper to create JWT (always with userId)
const generateToken = (user) => {
  return jwt.sign(
    { userId: user._id, email: user.email }, // Payload: userId
    env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: "All fields are required." });

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(409).json({ message: "Email already registered." });

    const hashedPassword = await bcrypt.hash(password, 10);

    let user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    try {
      user = await applyPendingTeamInvite(user);
    } catch (inviteErr) {
      console.warn("Pending team invite apply failed:", inviteErr.message);
    }

    const token = generateToken(user);

    return res.status(201).json({
      message: "Registration successful.",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        auraPoints: user.auraPoints || 0,
        role: user.role || "user",
        isAdmin: user.isAdmin || user.role === "admin" || user.role === "team",
      },
      token,
    });
  } catch (err) {
    console.error("Register Error:", err);
    return res.status(500).json({ message: "Server error. Please try again." });
  }
};

// @route   POST /api/auth/login
// @desc    Authenticate user and get token
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "All fields are required." });

    const user = await User.findOne({ email }).select("+password");
    if (!user)
      return res.status(401).json({ message: "Invalid email or password." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid email or password." });

    const token = generateToken(user);

    applyDailyActivity(user);
    await user.save();

    try {
      await applyPendingTeamInvite(user);
    } catch (inviteErr) {
      console.warn("Pending team invite apply failed:", inviteErr.message);
    }

    return res.json({
      message: "Login successful.",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        streak: user.streak,
        university: user.university,
        branch: user.branch,
        gender: user.gender,
        isAdmin: user.isAdmin || user.role === "admin" || user.role === "team",
        role: user.role || "user",
        auraPoints: user.auraPoints || 0,
      },
      token,
    });
  } catch (err) {
    console.error("Login Error:", err);
    return res.status(500).json({ message: "Server error. Please try again." });
  }
};
