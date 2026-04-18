const db = require("../db");

const getCourses = async (req, res) => {
  try {
    const { department, courseNumber, instructor } = req.query;

    let query = `
      SELECT 
        c.CourseID,
        c.CourseNumber,
        c.CourseName,
        c.Credits,
        d.DepartmentName,
        s.SessionID,
        s.SectionNumber,
        s.MeetingTime,
        s.Capacity,
        s.isActive,
        i.InstructorName,
        COUNT(e.EnrollmentID) AS enrolledCount,
        (s.Capacity - COUNT(e.EnrollmentID)) AS seatsAvailable
      FROM Courses c
      JOIN Departments d ON c.DepartmentID = d.DepartmentID
      JOIN Sessions s ON c.CourseID = s.CourseID
      LEFT JOIN Instructors i ON s.InstructorID = i.InstructorID
      LEFT JOIN Enrollment e ON s.SessionID = e.SessionID
      WHERE s.isActive = 1
    `;

    const params = [];

    if (department) {
      query += ` AND d.DepartmentName LIKE ?`;
      params.push(`%${department}%`);
    }

    if (courseNumber) {
      query += ` AND c.CourseNumber LIKE ?`;
      params.push(`%${courseNumber}%`);
    }

    if (instructor) {
      query += ` AND i.InstructorName LIKE ?`;
      params.push(`%${instructor}%`);
    }

    query += `
      GROUP BY
        c.CourseID,
        c.CourseNumber,
        c.CourseName,
        c.Credits,
        d.DepartmentName,
        s.SessionID,
        s.SectionNumber,
        s.MeetingTime,
        s.Capacity,
        s.isActive,
        i.InstructorName
      ORDER BY c.CourseNumber, s.SectionNumber
    `;

    const [rows] = await db.execute(query, params);

    return res.status(200).json({
      success: true,
      message: "Courses retrieved successfully",
      data: rows
    });
  } catch (error) {
    console.error("Courses error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while retrieving courses",
      error: error.message
    });
  }
};

module.exports = { getCourses };