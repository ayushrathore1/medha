const express = require("express");
const router = express.Router();
const multer = require("multer");
const adminController = require("../controllers/adminController");
const auth = require("../middleware/auth");
const adminAuth = require("../middleware/adminAuth");
const { fullAdminAuth } = require("../middleware/staffAuth");

// Memory storage for audio file uploads (no need to persist)
const audioUpload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 25 * 1024 * 1024, // 25MB max (Groq Whisper limit)
  },
  fileFilter: (req, file, cb) => {
    // Accept common audio formats
    const allowedMimes = [
      "audio/mpeg", // mp3
      "audio/mp4", // mp4 audio
      "audio/mp3",
      "audio/wav",
      "audio/wave",
      "audio/x-wav",
      "audio/webm",
      "audio/ogg",
      "audio/flac",
      "audio/m4a",
      "audio/x-m4a",
      "video/mp4", // mp4 with audio
      "video/webm", // webm with audio
    ];

    if (
      allowedMimes.includes(file.mimetype) ||
      file.originalname.match(/\.(mp3|wav|m4a|mp4|webm|ogg|flac|mpeg|mpga)$/i)
    ) {
      cb(null, true);
    } else {
      cb(
        new Error(
          "Invalid audio format. Supported: mp3, wav, m4a, mp4, webm, ogg, flac"
        )
      );
    }
  },
});

// All routes here are protected by auth AND adminAuth
router.use(auth);
router.use(adminAuth);

// Get all users
router.get("/users", adminController.getAllUsers);

// Send Email
router.post("/send-email", adminController.sendAdminEmail);

// Generate Email Content (AI)
router.post("/generate-email", adminController.generateEmailContent);

// Super-admin only: delete users, assign roles, invite team
router.delete("/users/:id", fullAdminAuth, adminController.deleteUser);
router.put("/users/:id/role", fullAdminAuth, adminController.updateUserRole);
router.post("/invite-team", fullAdminAuth, adminController.inviteTeamMember);

// Team roster — visible to staff (adminAuth already allows team)
router.get("/team", adminController.getTeamMembers);

// Get Email History
router.get("/history", adminController.getEmailHistory);

// Re-Engagement Email Campaign
// POST /api/admin/send-reengagement
// Body: { mode: "preview" | "dry-run" | "send", sampleName?: "Ayush" }
router.post("/send-reengagement", adminController.sendReEngagementEmail);

// Audio Transcription (Whisper)
router.post(
  "/transcribe",
  audioUpload.single("audio"),
  adminController.transcribeAudio
);

module.exports = router;
