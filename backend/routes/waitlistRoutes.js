const express = require("express");
const router = express.Router();
const {
  addToWaitlist,
  getWaitlistBySession,
  getWaitlistByStudent
} = require("../controllers/waitlistController");

router.post("/", addToWaitlist);
router.get("/session/:sessionId", getWaitlistBySession);
router.get("/student/:studentId", getWaitlistByStudent);

module.exports = router;