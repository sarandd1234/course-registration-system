const db = require("../db");

// GET /api/enrollments
const getEnrollments = async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT 
        e.EnrollmentID,
        e.StudentID,
        s.FirstName,
        s.LastName,
        e.SessionID,
        c.CourseID,
        c.CourseName
      FROM Enrollment e
      JOIN Students s ON e.StudentID = s.StudentID
      JOIN Sessions ses ON e.SessionID = ses.SessionID
      JOIN Courses c ON ses.CourseID = c.CourseID
      ORDER BY e.EnrollmentID ASC
    `);

    return res.status(200).json({
      success: true,
      enrollments: rows
    });
  } catch (error) {
    console.error("Fetch enrollments error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

// POST /api/enrollments
const enrollStudent = async (req, res) => {
  try {
    const { StudentID, SessionID } = req.body;

    if (!StudentID || !SessionID) {
      return res.status(400).json({
        success: false,
        message: "StudentID and SessionID are required"
      });
    }

    // Check student exists
    const [studentRows] = await db.execute(
      `SELECT StudentID, FirstName, LastName, Program
       FROM Students
       WHERE StudentID = ?`,
      [StudentID]
    );

    if (studentRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Student not found"
      });
    }

    // Check session exists and get related course info
    const [sessionRows] = await db.execute(
      `SELECT 
          ses.SessionID,
          c.CourseID,
          c.CourseName,
          c.Program
       FROM Sessions ses
       JOIN Courses c ON ses.CourseID = c.CourseID
       WHERE ses.SessionID = ?`,
      [SessionID]
    );

    if (sessionRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Session not found"
      });
    }

    const student = studentRows[0];
    const session = sessionRows[0];

    // Check duplicate enrollment by course
    const [duplicateRows] = await db.execute(
      `SELECT e.EnrollmentID
       FROM Enrollment e
       JOIN Sessions ses ON e.SessionID = ses.SessionID
       WHERE e.StudentID = ? AND ses.CourseID = ?`,
      [StudentID, session.CourseID]
    );

    if (duplicateRows.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Student is already enrolled in this course"
      });
    }

    // Check prerequisites
    const [prereqRows] = await db.execute(
      `SELECT PrereqCourseID
       FROM Prerequisites
       WHERE CourseID = ?`,
      [session.CourseID]
    );

    const [completedRows] = await db.execute(
      `SELECT ses.CourseID
       FROM Enrollment e
       JOIN Sessions ses ON e.SessionID = ses.SessionID
       WHERE e.StudentID = ?`,
      [StudentID]
    );

    const completedCourseIds = completedRows.map(row => row.CourseID);

    const missingPrereqs = prereqRows
      .map(row => row.PrereqCourseID)
      .filter(prereq => !completedCourseIds.includes(prereq));

    if (missingPrereqs.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Prerequisites not met",
        eligible: false,
        missingPrereqs
      });
    }

    // Check student program matches course program
    const programMatch = student.Program === session.Program;

    if (!programMatch) {
      return res.status(400).json({
        success: false,
        message: "Student program does not match course program",
        eligible: false
      });
    }

    // Seat availability check placeholder
    // Add real capacity/seatsAvailable logic here later if needed

    // Insert enrollment
    const [result] = await db.execute(
      `INSERT INTO Enrollment (StudentID, SessionID)
       VALUES (?, ?)`,
      [StudentID, SessionID]
    );

    return res.status(201).json({
      success: true,
      message: "Enrollment successful",
      enrollmentId: result.insertId
    });
  } catch (error) {
    console.error("Enroll error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

module.exports = {
  getEnrollments,
  enrollStudent
};