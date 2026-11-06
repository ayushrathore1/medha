const express = require("express");
const router = express.Router();
const noteController = require("../controllers/noteController");
const noteReviewController = require("../controllers/noteReviewController");
const auth = require("../middleware/auth");
const upload = require("../middleware/upload");
const { staffAuth } = require("../middleware/staffAuth");

// Get all public notes (explore feature) - must be before /:noteId
router.get("/public", auth.optionalAuth, noteController.getPublicNotes);

// Staff review queue (before /:noteId)
router.get("/review/queue", auth, staffAuth, noteReviewController.listAwaitingTeam);
router.get("/review/pending", auth, staffAuth, noteReviewController.listPendingScans);
router.post("/review/:noteId", auth, staffAuth, noteReviewController.reviewNote);

// List user's own notes (optionally by subject)
router.get("/", auth, noteController.getNotes);

// Upload a note (file upload). Size/type filter runs in multer; magic bytes next.
router.post("/", auth, upload.single("file"), upload.validateFile, noteController.uploadNote);

// Create a text-only note
router.post("/text", auth, noteController.createTextNote);

// Toggle note visibility (public/private)
router.patch("/:noteId/visibility", auth, noteController.toggleVisibility);

// Toggle Like
router.post("/:noteId/like", auth, noteController.toggleLike);

// Record a download and award Aura
router.post("/:noteId/download", auth, noteController.recordDownload);

// Update/Edit a note by ID
router.put("/:noteId", auth, noteController.updateNote);

// Delete a note by ID
router.delete("/:noteId", auth, noteController.deleteNote);

// Get a single note by ID
router.get("/:noteId", auth.optionalAuth, noteController.getNoteById);

module.exports = router;
