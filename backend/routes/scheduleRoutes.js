// routes/scheduleRoutes.js

const express = require("express");
const router = express.Router();
const { getSchedule } = require("../controllers/scheduleController");

// GET schedule for a specific student
router.get("/:studentId", getSchedule);

module.exports = router;