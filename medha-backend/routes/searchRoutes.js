const express = require("express");
const router = express.Router();
const searchController = require("../controllers/searchController");
const auth = require("../middleware/auth");

// GET /api/search - Universal database search
router.get("/", auth.optionalAuth, searchController.searchAll);

// GET /api/search/suggestions - Instant suggestions & autocomplete
router.get("/suggestions", searchController.getSuggestions);

// GET /api/search/popular - Popular & trending search queries
router.get("/popular", searchController.getPopularSearches);

// POST /api/search/history - Log search history
router.post("/history", auth.optionalAuth, searchController.logSearchHistory);

module.exports = router;
