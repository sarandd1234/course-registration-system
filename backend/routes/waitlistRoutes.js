const express = require("express");
const router = express.Router();
const {
  addToWaitlist,
  getWaitlistBySession,
  getWaitlistByStudent
} = require("../controllers/waitlistController");

router.post("/", addToWaitlist);
router.get("/session/:sessionID", getWaitlistBySession);
router.get("/student/:studentID", getWaitlistByStudent);

module.exports = router;