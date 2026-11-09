const express = require("express");
const pastPaperController = require("../controllers/pastPaperController");

const router = express.Router();

router.get("/meta", pastPaperController.getMeta);
router.get("/", pastPaperController.listPapers);
router.get("/:id/file", pastPaperController.streamPaperFile);
router.get("/:id/download", pastPaperController.downloadPaper);

module.exports = router;
