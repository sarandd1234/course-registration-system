const db = require("../db");

const getSchedule = async (req, res) => {
  try {
    const { studentId } = req.params;

    if (!studentId) {
      return res.status(400).json({
        success: false,
        message: "studentId is required"
      });
    }

    const [rows] = await db.execute(
      `
      SELECT 
        e.StudentID,
        s.SessionID,
        c.CourseID,
        c.CourseNumber,
        c.CourseName,
        c.Credits,
        d.DepartmentName,
        s.SectionNumber,
        s.MeetingTime,
        i.InstructorName
      FROM Enrollment e
      JOIN Sessions s ON e.SessionID = s.SessionID
      JOIN Courses c ON s.CourseID = c.CourseID
      JOIN Departments d ON c.DepartmentID = d.DepartmentID
      LEFT JOIN Instructors i ON s.InstructorID = i.InstructorID
      WHERE e.StudentID = ?
      ORDER BY c.CourseNumber, s.SectionNumber
      `,
      [studentId]
    );

    return res.status(200).json({
      success: true,
      message: "Schedule retrieved successfully",
      data: rows
    });
  } catch (error) {
    console.error("Schedule error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while retrieving schedule",
      error: error.message
    });
  }
};

module.exports = { getSchedule };