const db = require("../db");

const getCourses = async (req, res) => {
  try {
    const { department, courseNumber, instructor, courseName } = req.query;

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
      WHERE 1=1
    `;

    const params = [];

    if (department) {
      query += ` AND (d.DepartmentName LIKE ? OR c.DepartmentID LIKE ?)`;
      params.push(`%${department}%`, `%${department}%`);
    }

    if (courseNumber) {
      query += ` AND c.CourseNumber LIKE ?`;
      params.push(`%${courseNumber}%`);
    }

    if (instructor) {
      query += ` AND i.InstructorName LIKE ?`;
      params.push(`%${instructor}%`);
    }

    if (courseName) {
      query += ` AND c.CourseName LIKE ?`;
      params.push(`%${courseName}%`);
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
      ORDER BY c.CourseName ASC, s.SectionNumber ASC
    `;

    const [rows] = await db.execute(query, params);
    res.json(rows);
  } catch (error) {
    console.error("Course fetch error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to load courses"
    });
  }
};

module.exports = { getCourses };