// routes/dropRoutes.js

const express = require("express");
const router = express.Router();
const { dropCourse } = require("../controllers/dropController");

router.delete("/", dropCourse);

module.exports = router;