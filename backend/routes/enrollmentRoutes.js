const express = require("express");
const router = express.Router();

const {
  enrollStudent,
  getEnrollments
} = require("../controllers/enrollmentController");

router.post("/", enrollStudent);
router.get("/", getEnrollments);

module.exports = router;