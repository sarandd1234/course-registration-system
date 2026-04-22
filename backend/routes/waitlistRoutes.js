const express = require("express");
const router = express.Router();
const {
  addToWaitlist,
  dropFromWaitlist,
  getWaitlistBySession,
  getWaitlistByStudent
} = require("../controllers/waitlistController");

router.post("/", addToWaitlist);
router.delete("/", dropFromWaitlist);
router.get("/session/:sessionId", getWaitlistBySession);
router.get("/student/:studentId", getWaitlistByStudent);

module.exports = router;