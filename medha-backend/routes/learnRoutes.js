const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });

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
  upload.single("voiceNote"),
  slides.uploadSlideVoice
);
router.post(
  "/:id/slide/:step/note-image",
  authMiddleware,
  upload.single("image"),
  slides.uploadSlideNoteImage
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
  upload.single("audioFile"),
  slides.uploadAnimationGlobalVoice
);
router.post(
  "/:id/global-voice",
  authMiddleware,
  upload.single("audioFile"),
  slides.uploadContentGlobalVoice
);

module.exports = router;
