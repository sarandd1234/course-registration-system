const express = require("express");
const router = express.Router();
const { getCourseRoster } = require("../controllers/rosterController");

router.get("/:sessionId", getCourseRoster);

module.exports = router;