const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");
const multer = require("multer");
const {
  AUDIO_UPLOAD_MAX_BYTES,
  IMAGE_UPLOAD_MAX_BYTES,
} = require("../config/bodyLimits");

const imageUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: IMAGE_UPLOAD_MAX_BYTES, files: 1 },
});
const audioUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: AUDIO_UPLOAD_MAX_BYTES, files: 1 },
});

const catalog = require("../controllers/learnCatalogController");
const admin = require("../controllers/learnAdminController");
const slides = require("../controllers/learnSlideController");

router.get("/subjects", authMiddleware, catalog.listSubjects);
router.get("/subjects/:subject/content", authMiddleware, catalog.listSubjectContent);
router.post("/:contentId/like", authMiddleware, catalog.toggleLike);
router.post("/:contentId/view", authMiddleware, catalog.recordAuthenticatedView);
router.get("/:contentId", authMiddleware, catalog.getContent);

router.post("/admin/content", authMiddleware, admin.createContent);
router.get("/admin/imagekit-auth", authMiddleware, admin.getImagekitAuth);
router.patch("/admin/content/:contentId", authMiddleware, admin.updateContent);
router.delete("/admin/content/:contentId", authMiddleware, admin.deleteContent);
router.get("/admin/subjects", authMiddleware, admin.listAdminSubjects);

router.patch("/:id/slide/:step", authMiddleware, slides.updateSlide);
router.post("/:id/view", slides.incrementView);
router.post(
  "/:id/slide/:step/voice",
  authMiddleware,
  audioUpload.single("voiceNote"),
  async (req, res) => {
    try {
      // Fetch user to check admin/team status
      const User = require("../models/User");
      const user = await User.findById(req.userId);

      // Allow access for admins (isAdmin=true OR role='admin') or team members
      const hasAccess =
        user && (user.isAdmin || user.role === "admin" || user.role === "team");
      if (!hasAccess) {
        return res
          .status(403)
          .json({ success: false, message: "Admin/Team access required" });
      }

      const { id, step } = req.params;
      const stepNumber = parseInt(step);

      if (!req.file) {
        return res
          .status(400)
          .json({ success: false, message: "No audio file provided" });
      }

      const content = await LearnContent.findById(id);
      if (!content || content.type !== "animation") {
        return res
          .status(404)
          .json({ success: false, message: "Animation not found" });
      }

      // Upload to Cloudinary as audio
      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              resource_type: "video", // Cloudinary uses 'video' for audio
              folder: "medha/animation-voice-notes",
              public_id: `${content.animationId}_step_${stepNumber}`,
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          )
          .end(req.file.buffer);
      });

      // Find or create slide data entry
      let slideIndex = content.slideData.findIndex(
        (s) => s.stepNumber === stepNumber
      );
      if (slideIndex === -1) {
        content.slideData.push({ stepNumber });
        slideIndex = content.slideData.length - 1;
      }

      // Delete old voice note if exists
      if (content.slideData[slideIndex].voiceNotePublicId) {
        await cloudinary.uploader.destroy(
          content.slideData[slideIndex].voiceNotePublicId,
          { resource_type: "video" }
        );
      }

      content.slideData[slideIndex].voiceNoteUrl = result.secure_url;
      content.slideData[slideIndex].voiceNotePublicId = result.public_id;
      await content.save();

      res.json({ success: true, voiceNoteUrl: result.secure_url });
    } catch (error) {
      console.error("Error uploading voice note:", error);
      res
        .status(500)
        .json({ success: false, message: "Failed to upload voice note" });
    }
  }
);
router.post(
  "/:id/slide/:step/note-image",
  authMiddleware,
  imageUpload.single("image"),
  async (req, res) => {
    try {
      // Fetch user to check admin/team status
      const User = require("../models/User");
      const user = await User.findById(req.userId);
      const hasAccess =
        user && (user.isAdmin || user.role === "admin" || user.role === "team");
      if (!hasAccess) {
        return res
          .status(403)
          .json({ success: false, message: "Admin/Team access required" });
      }

      const { id, step } = req.params;
      const stepNumber = parseInt(step);

      if (!req.file) {
        return res
          .status(400)
          .json({ success: false, message: "No image file provided" });
      }

      const content = await LearnContent.findById(id);
      if (!content || content.type !== "animation") {
        return res
          .status(404)
          .json({ success: false, message: "Animation not found" });
      }

      // Upload to Cloudinary
      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              folder: "medha/animation-note-images",
              public_id: `${content.animationId}_step_${stepNumber}_note`,
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          )
          .end(req.file.buffer);
      });

      // Find or create slide data entry
      let slideIndex = content.slideData.findIndex(
        (s) => s.stepNumber === stepNumber
      );
      if (slideIndex === -1) {
        content.slideData.push({ stepNumber });
        slideIndex = content.slideData.length - 1;
      }

      // Delete old image if exists
      if (content.slideData[slideIndex].notes?.imagePublicId) {
        await cloudinary.uploader.destroy(
          content.slideData[slideIndex].notes.imagePublicId
        );
      }

      if (!content.slideData[slideIndex].notes) {
        content.slideData[slideIndex].notes = {};
      }
      content.slideData[slideIndex].notes.imageUrl = result.secure_url;
      content.slideData[slideIndex].notes.imagePublicId = result.public_id;
      await content.save();

      res.json({ success: true, imageUrl: result.secure_url });
    } catch (error) {
      console.error("Error uploading note image:", error);
      res
        .status(500)
        .json({ success: false, message: "Failed to upload image" });
    }
  }
);
router.delete("/:id/slide/:step/voice", authMiddleware, slides.deleteSlideVoice);
router.get("/animation/:animationId/audio", slides.getAnimationAudio);
router.put(
  "/animation/:animationId/part-audio/:partNumber",
  authMiddleware,
  slides.upsertPartAudio
);
router.post(
  "/animation/:animationId/timings",
  authMiddleware,
  slides.saveTimings
);
router.post(
  "/animation/:animationId/transcribe",
  authMiddleware,
  slides.transcribeAnimation
);
router.get("/animation/:animationId/slides", slides.getAnimationSlides);
router.patch(
  "/animation/:animationId/slide/:step",
  authMiddleware,
  slides.updateAnimationSlide
);
router.get("/:id/slides", authMiddleware, slides.getSlides);
router.post(
  "/animation/global-voice",
  authMiddleware,
  (req, res, next) => {
    req.setTimeout(120000);
    res.setTimeout(120000);
    next();
  },
  audioUpload.single("audioFile"),
  async (req, res) => {
    console.log("[GLOBAL-VOICE] Request received for animation upload");
    try {
      // Fetch user to check admin/team status
      const User = require("../models/User");
      const user = await User.findById(req.userId);

      if (!user || (!user.isAdmin && user.role !== "team")) {
        return res
          .status(403)
          .json({ success: false, message: "Admin/Team access required" });
      }

      const { language, animationId, title, totalSteps, subject, category } =
        req.body;

      console.log("[GLOBAL-VOICE] Request body:", {
        language,
        animationId,
        title,
        totalSteps,
      });
      console.log(
        "[GLOBAL-VOICE] File received:",
        req.file
          ? {
              fieldname: req.file.fieldname,
              mimetype: req.file.mimetype,
              size: req.file.size,
              originalname: req.file.originalname,
            }
          : "No file"
      );

      if (!req.file) {
        console.log("[GLOBAL-VOICE] Error: No audio file in request");
        return res
          .status(400)
          .json({ success: false, message: "No audio file provided" });
      }

      if (!animationId) {
        return res
          .status(400)
          .json({ success: false, message: "Animation ID is required" });
      }

      if (!["hindi", "english"].includes(language)) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid language specified" });
      }

      // Find or create content for this animation
      let content = await LearnContent.findOne({ animationId: animationId });

      if (!content) {
        // Auto-create content entry for this animation
        content = await LearnContent.create({
          subject: subject || "C++",
          semester: 3,
          unit: 1,
          title: title || animationId,
          description: `Animation: ${title || animationId}`,
          type: "animation",
          animationId: animationId,
          animationSteps: parseInt(totalSteps) || 1,
          animationCategory: category || "general",
          order: 0,
        });
        console.log("[GLOBAL-VOICE] Created new content entry:", content._id);
      }

      // Upload to Cloudinary
      console.log("[GLOBAL-VOICE] Starting Cloudinary upload...");
      const result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            resource_type: "video",
            folder: "medha/animation-global-voice",
            public_id: `${animationId}_global_${language}`,
            timeout: 120000, // 2 minute timeout for Cloudinary
          },
          (error, result) => {
            if (error) {
              console.error("[GLOBAL-VOICE] Cloudinary upload error:", error);
              reject(error);
            } else {
              console.log(
                "[GLOBAL-VOICE] Cloudinary upload success:",
                result.secure_url
              );
              resolve(result);
            }
          }
        );

        // Handle stream errors
        uploadStream.on("error", (err) => {
          console.error("[GLOBAL-VOICE] Upload stream error:", err);
          reject(err);
        });

        uploadStream.end(req.file.buffer);
      });

      // Delete old file if exists
      const oldFileId =
        language === "hindi"
          ? content.audioHindiFileId
          : content.audioEnglishFileId;
      if (oldFileId) {
        try {
          await cloudinary.uploader.destroy(oldFileId, {
            resource_type: "video",
          });
        } catch (e) {
          console.warn("Failed to delete old audio:", e);
        }
      }

      // Update content
      if (language === "hindi") {
        content.audioHindiUrl = result.secure_url;
        content.audioHindiFileId = result.public_id;
      } else {
        content.audioEnglishUrl = result.secure_url;
        content.audioEnglishFileId = result.public_id;
      }

      await content.save();
      console.log("[GLOBAL-VOICE] Upload completed successfully");

      res.json({
        success: true,
        audioUrl: result.secure_url,
        language,
        contentId: content._id,
      });
    } catch (error) {
      console.error(
        "[GLOBAL-VOICE] Error uploading global voice for animation:",
        error
      );
      console.error("[GLOBAL-VOICE] Error stack:", error.stack);
      res.status(500).json({
        success: false,
        message: "Failed to upload global voice",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  }
);
router.post(
  "/:id/global-voice",
  authMiddleware,
  audioUpload.single("audioFile"),
  async (req, res) => {
    try {
      // Fetch user to check admin/team status
      const User = require("../models/User");
      const user = await User.findById(req.userId);

      if (!user || (!user.isAdmin && user.role !== "team")) {
        return res
          .status(403)
          .json({ success: false, message: "Admin/Team access required" });
      }

      const { id } = req.params;
      const { language } = req.body; // 'hindi' or 'english'

      if (!req.file) {
        return res
          .status(400)
          .json({ success: false, message: "No audio file provided" });
      }

      if (!["hindi", "english"].includes(language)) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid language specified" });
      }

      const content = await LearnContent.findById(id);
      if (!content) {
        return res
          .status(404)
          .json({ success: false, message: "Content not found" });
      }

      // Upload to Cloudinary
      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              resource_type: "video",
              folder: "medha/animation-global-voice",
              public_id: `${content.animationId}_global_${language}`,
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          )
          .end(req.file.buffer);
      });

      // Delete old file if exists
      const oldFileId =
        language === "hindi"
          ? content.audioHindiFileId
          : content.audioEnglishFileId;
      if (oldFileId) {
        try {
          await cloudinary.uploader.destroy(oldFileId, {
            resource_type: "video",
          });
        } catch (e) {
          console.warn("Failed to delete old audio:", e);
        }
      }

      // Update content
      if (language === "hindi") {
        content.audioHindiUrl = result.secure_url;
        content.audioHindiFileId = result.public_id;
      } else {
        content.audioEnglishUrl = result.secure_url;
        content.audioEnglishFileId = result.public_id;
      }

      await content.save();

      res.json({
        success: true,
        audioUrl: result.secure_url,
        language,
      });
    } catch (error) {
      console.error("Error uploading global voice:", error);
      res
        .status(500)
        .json({ success: false, message: "Failed to upload global voice" });
    }
  }
);

module.exports = router;
