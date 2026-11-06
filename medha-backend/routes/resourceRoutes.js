const express = require("express");
const auth = require("../middleware/auth");
const resourceController = require("../controllers/resourceController");

const router = express.Router();

router.use(resourceController.ensureSeeded);

router.get("/", auth.optionalAuth, resourceController.searchResources);
router.get("/:id/thumb", resourceController.thumbResource);
router.post("/:id/open", auth, resourceController.openResource);
router.post("/note/:noteId/open", auth, resourceController.openNote);

module.exports = router;
