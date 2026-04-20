const express = require("express");
const router = express.Router();
const { getAcademicProgress } = require("../controllers/academicProgressController");

router.get("/:studentId", getAcademicProgress);

module.exports = router;