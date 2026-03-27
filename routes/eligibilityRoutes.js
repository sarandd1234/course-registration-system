const express = require("express");
const router = express.Router();
const { checkEligibility } = require("../controllers/eligibilityController");

router.get("/:studentId/:sessionId", checkEligibility);

module.exports = router;