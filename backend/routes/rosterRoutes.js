const express = require("express");
const router = express.Router();
const { getCourseRoster } = require("../controllers/rosterController");

// Get roster by session
router.get("/:sessionID", getCourseRoster);

module.exports = router;