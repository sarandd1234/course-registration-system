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
      "SELECT SessionID, CourseID, Capacity, isActive FROM Sessions WHERE SessionID = ?",
      [SessionID]
    );

    if (sessionRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Session not found"
      });
    }

    const session = sessionRows[0];

    if (session.isActive === 0) {
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
      SELECT p.PrereqCourseID, c.CourseName AS PrereqCourseName
      FROM Prerequisites p
      JOIN Courses c ON p.PrereqCourseID = c.CourseID
      WHERE p.CourseID = ?
      `,
      [session.CourseID]
    );

    for (const prereq of prereqRows) {
      const [metRows] = await db.execute(
        `
        SELECT e.EnrollmentID
        FROM Enrollment e
        JOIN Sessions s ON e.SessionID = s.SessionID
        WHERE e.StudentID = ? AND s.CourseID = ?
        `,
        [StudentID, prereq.PrereqCourseID]
      );

      if (metRows.length === 0) {
        return res.status(400).json({
          success: false,
          message: `Prerequisite not satisfied. Complete ${prereq.PrereqCourseName} first.`
        });
      }
    }

    const [countRows] = await db.execute(
      "SELECT COUNT(*) AS enrolledCount FROM Enrollment WHERE SessionID = ?",
      [SessionID]
    );

    const enrolledCount = countRows[0].enrolledCount;
    const capacity = session.Capacity;

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
      data: { StudentID, SessionID }
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