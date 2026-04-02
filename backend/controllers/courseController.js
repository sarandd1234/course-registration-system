const db = require("../db");

const getCourses = async (req, res) => {
  try {
    const { department, courseNumber, instructor } = req.query;

    let query = `
      SELECT
        c.CourseID,
        c.CourseNumber,
        c.CourseName,
        c.Program,
        d.DepartmentName,
        s.SessionID,
        i.InstructorName
      FROM Courses c
      JOIN Departments d ON c.DepartmentID = d.DepartmentID
      JOIN Sessions s ON c.CourseID = s.CourseID
      JOIN Instructors i ON s.InstructorID = i.InstructorID
      WHERE 1=1
    `;

    const params = [];

    if (department) {
      query += ` AND d.DepartmentName LIKE ?`;
      params.push(`%${department}%`);
    }

    if (courseNumber) {
      query += ` AND c.CourseNumber = ?`;
      params.push(courseNumber);
    }

    if (instructor) {
      query += ` AND i.InstructorName LIKE ?`;
      params.push(`%${instructor}%`);
    }

    const [rows] = await db.execute(query, params);

    return res.status(200).json({
      success: true,
      count: rows.length,
      courses: rows
    });
  } catch (error) {
    console.error("Course fetch error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

module.exports = { getCourses };
