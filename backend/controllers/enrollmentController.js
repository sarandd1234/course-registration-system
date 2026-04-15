const db = require("../db");

const enrollStudent = async (req, res) => {
  try {
    const { StudentID, SessionID } = req.body;

    if (!StudentID || !SessionID) {
      return res.status(400).json({
        success: false,
        message: "StudentID and SessionID are required"
      });
    }

    const [studentRows] = await db.execute(
      "SELECT StudentID FROM Students WHERE StudentID = ?",
      [StudentID]
    );

    if (studentRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Student not found"
      });
    }

    const [sessionRows] = await db.execute(
      "SELECT SessionID, Capacity, isActive FROM Sessions WHERE SessionID = ?",
      [SessionID]
    );

    if (sessionRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Session not found"
      });
    }

    if (sessionRows[0].isActive === 0) {
      return res.status(400).json({
        success: false,
        message: "This session is not active"
      });
    }

    const [existingEnrollment] = await db.execute(
      "SELECT * FROM Enrollment WHERE StudentID = ? AND SessionID = ?",
      [StudentID, SessionID]
    );

    if (existingEnrollment.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Student is already enrolled in this session"
      });
    }

    const [prereqRows] = await db.execute(
      `
      SELECT p.PrereqCourseID
      FROM Sessions s
      JOIN Courses c ON s.CourseID = c.CourseID
      LEFT JOIN Prerequisites p ON c.CourseID = p.CourseID
      WHERE s.SessionID = ?
      `,
      [SessionID]
    );

    if (prereqRows.length > 0 && prereqRows.some(row => row.PrereqCourseID)) {
      return res.status(400).json({
        success: false,
        message: "Prerequisite not satisfied"
      });
    }

    const [countRows] = await db.execute(
      "SELECT COUNT(*) AS enrolledCount FROM Enrollment WHERE SessionID = ?",
      [SessionID]
    );

    const enrolledCount = countRows[0].enrolledCount;
    const capacity = sessionRows[0].Capacity;

    if (enrolledCount >= capacity) {
      return res.status(400).json({
        success: false,
        message: "Class is full",
        waitlistAvailable: true
      });
    }

    await db.execute(
      "INSERT INTO Enrollment (StudentID, SessionID) VALUES (?, ?)",
      [StudentID, SessionID]
    );

    return res.status(200).json({
      success: true,
      message: "Enrollment successful",
      data: {
        StudentID,
        SessionID
      }
    });
  } catch (error) {
    console.error("Enrollment error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while enrolling student",
      error: error.message
    });
  }
};

module.exports = { enrollStudent };