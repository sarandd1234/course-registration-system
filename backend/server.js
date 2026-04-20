const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const courseRoutes = require("./routes/courseRoutes");
const eligibilityRoutes = require("./routes/eligibilityRoutes");
const enrollmentRoutes = require("./routes/enrollmentRoutes");
const waitlistRoutes = require("./routes/waitlistRoutes");
const dropRoutes = require("./routes/dropRoutes");
const scheduleRoutes = require("./routes/scheduleRoutes");
const rosterRoutes = require("./routes/rosterRoutes");
const db = require("./db");
const academicProgressRoutes = require("./routes/academicProgressRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// Main API Routes
app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/eligibility", eligibilityRoutes);
app.use("/api/enroll", enrollmentRoutes);
app.use("/api/waitlist", waitlistRoutes);
app.use("/api/drop", dropRoutes);
app.use("/api/schedule", scheduleRoutes);
app.use("/api/roster", rosterRoutes);
app.use("/api/academic-progress", academicProgressRoutes);

// Home Route
app.get("/", (req, res) => {
  res.send("Backend API is running.");
});

// Test DB Connection
app.get("/test-db", async (req, res) => {
  try {
    const [rows] = await db.execute("SHOW TABLES");
    res.json({
      success: true,
      message: "Database connection successful",
      tables: rows
    });
  } catch (error) {
    console.error("DB connection error:", error);
    res.status(500).json({
      success: false,
      message: "Database connection failed",
      error: error.message
    });
  }
});

// Test Students
app.get("/test-students", async (req, res) => {
  try {
    const [rows] = await db.execute("SELECT * FROM Students");
    res.json({
      success: true,
      message: "Students retrieved successfully",
      data: rows
    });
  } catch (error) {
    console.error("Students error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch students",
      error: error.message
    });
  }
});

// Test Courses
app.get("/test-courses", async (req, res) => {
  try {
    const [rows] = await db.execute("SELECT * FROM Courses");
    res.json({
      success: true,
      message: "Courses retrieved successfully",
      data: rows
    });
  } catch (error) {
    console.error("Courses error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch courses",
      error: error.message
    });
  }
});

// Test Departments
app.get("/test-departments", async (req, res) => {
  try {
    const [rows] = await db.execute("SELECT * FROM Departments");
    res.json({
      success: true,
      message: "Departments retrieved successfully",
      data: rows
    });
  } catch (error) {
    console.error("Departments error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch departments",
      error: error.message
    });
  }
});

// Test Enrollment
app.get("/test-enrollment", async (req, res) => {
  try {
    const [rows] = await db.execute("SELECT * FROM Enrollment");
    res.json({
      success: true,
      message: "Enrollment data retrieved successfully",
      data: rows
    });
  } catch (error) {
    console.error("Enrollment error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch enrollment",
      error: error.message
    });
  }
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});