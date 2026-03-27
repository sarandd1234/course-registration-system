const db = require("../db");

const checkEligibility = async (req, res) => {
  try {
    const { studentId, sessionId } = req.params;

    const [studentRows] = await db.execute(
      `SELECT StudentID, FirstName, LastName, Program
       FROM Students
       WHERE StudentID = ?`,
      [studentId]
    );

    if (studentRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Student not found"
      });
    }

    const [sessionRows] = await db.execute(
      `SELECT
          s.SessionID,
          c.CourseID,
          c.CourseName,
          c.Program
       FROM Sessions s
       JOIN Courses c ON s.CourseID = c.CourseID
       WHERE s.SessionID = ?`,
      [sessionId]
    );

    if (sessionRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Session not found"
      });
    }

    const student = studentRows[0];
    const session = sessionRows[0];

    const [duplicateRows] = await db.execute(
      `SELECT e.EnrollmentID
       FROM Enrollment e
       JOIN Sessions s ON e.SessionID = s.SessionID
       WHERE e.StudentID = ? AND s.CourseID = ?`,
      [studentId, session.CourseID]
    );

    const [prereqRows] = await db.execute(
      `SELECT PrereqCourseID
       FROM Prerequisites
       WHERE CourseID = ?`,
      [session.CourseID]
    );

    const [completedRows] = await db.execute(
      `SELECT s.CourseID
       FROM Enrollment e
       JOIN Sessions s ON e.SessionID = s.SessionID
       WHERE e.StudentID = ?`,
      [studentId]
    );

    const completedCourseIds = completedRows.map(row => row.CourseID);
    const missingPrereqs = prereqRows
      .map(row => row.PrereqCourseID)
      .filter(prereq => !completedCourseIds.includes(prereq));

    const programMatch = student.Program === session.Program;
    const alreadyEnrolled = duplicateRows.length > 0;
    const prerequisitesMet = missingPrereqs.length === 0;

    const eligible = programMatch && !alreadyEnrolled && prerequisitesMet;

    return res.status(200).json({
      success: true,
      eligible,
      checks: {
        programMatch,
        alreadyEnrolled,
        prerequisitesMet,
        missingPrereqs
      },
      student,
      session
    });
  } catch (error) {
    console.error("Eligibility error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

module.exports = { checkEligibility };