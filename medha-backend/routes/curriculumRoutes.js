const express = require("express");
const auth = require("../middleware/auth");
const { staffAuth, fullAdminAuth } = require("../middleware/staffAuth");
const curriculumController = require("../controllers/curriculumController");

const router = express.Router();

// Public student-facing tree (auto-seeds empty DB from catalogs)
router.get("/tree", curriculumController.publicTree);

// Staff / admin curriculum management
router.use(auth, staffAuth);
router.use(curriculumController.ensureSeeded);

router.post("/seed", fullAdminAuth, curriculumController.reseedFromCatalog);

router.get("/semesters", curriculumController.listSemesters);
router.post("/semesters", curriculumController.createSemester);
router.patch("/semesters/:semesterId", curriculumController.updateSemester);
router.delete("/semesters/:semesterId", curriculumController.deleteSemester);

router.get("/subjects", curriculumController.listSubjects);
router.get("/subjects/:subjectId", curriculumController.getSubject);
router.post("/subjects", curriculumController.createSubject);
router.patch("/subjects/:subjectId", curriculumController.updateSubject);
router.delete("/subjects/:subjectId", curriculumController.deleteSubject);

router.post("/subjects/:subjectId/units", curriculumController.createUnit);
router.patch("/subjects/:subjectId/units/:unitId", curriculumController.updateUnit);
router.delete("/subjects/:subjectId/units/:unitId", curriculumController.deleteUnit);

router.post("/subjects/:subjectId/units/:unitId/topics", curriculumController.createTopic);
router.patch(
  "/subjects/:subjectId/units/:unitId/topics/:topicId",
  curriculumController.updateTopic
);
router.delete(
  "/subjects/:subjectId/units/:unitId/topics/:topicId",
  curriculumController.deleteTopic
);

router.post(
  "/subjects/:subjectId/units/:unitId/topics/:topicId/resources",
  curriculumController.addTopicResource
);
router.patch(
  "/subjects/:subjectId/units/:unitId/topics/:topicId/resources/:resourceId",
  curriculumController.updateTopicResource
);
router.delete(
  "/subjects/:subjectId/units/:unitId/topics/:topicId/resources/:resourceId",
  curriculumController.deleteTopicResource
);
router.post(
  "/subjects/:subjectId/units/:unitId/topics/:topicId/resources/:resourceId/open",
  curriculumController.openTopicResource
);

router.delete(
  "/semesters/:semesterId/force",
  fullAdminAuth,
  (req, res, next) => {
    req.query.force = "1";
    return curriculumController.deleteSemester(req, res, next);
  }
);

module.exports = router;
