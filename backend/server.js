const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const courseRoutes = require("./routes/courseRoutes");
const eligibilityRoutes = require("./routes/eligibilityRoutes");
const db = require("./db");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/eligibility", eligibilityRoutes);

app.get("/", (req, res) => {
  res.send("Backend API is running.");
});

app.get("/test-db", async (req, res) => {
  try {
    const [rows] = await db.execute("SHOW TABLES");
    res.json({
      success: true,
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

app.get("/test-students", async (req, res) => {
  try {
    const [rows] = await db.execute("SELECT * FROM Students");
    res.json(rows);
  } catch (error) {
    console.error("Students error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch students",
      error: error.message
    });
  }
});

app.get("/test-courses", async (req, res) => {
  try {
    const [rows] = await db.execute("SELECT * FROM Courses");
    res.json(rows);
  } catch (error) {
    console.error("Courses error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch courses",
      error: error.message
    });
  }
});

app.get("/test-departments", async (req, res) => {
  try {
    const [rows] = await db.execute("SELECT * FROM Departments");
    res.json(rows);
  } catch (error) {
    console.error("Departments error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch departments",
      error: error.message
    });
  }
});

app.get("/test-enrollment", async (req, res) => {
  try {
    const [rows] = await db.execute("SELECT * FROM Enrollment");
    res.json(rows);
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
