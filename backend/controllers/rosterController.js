const db = require("../db");

const getCourseRoster = async (req, res) => {
  const { sessionID } = req.params;

  if (!sessionID) {
    return res.status(400).json({
      success: false,
      message: "SessionID is required"
    });
  }

  try {
    const [rows] = await db.execute(
      `
      SELECT
        s.StudentID,
        s.FirstName,
        s.LastName,
        c.CourseName,
        sess.SessionID,
        sess.SectionNumber
      FROM Enrollment e
      JOIN Students s ON e.StudentID = s.StudentID
      JOIN Sessions sess ON e.SessionID = sess.SessionID
      JOIN Courses c ON sess.CourseID = c.CourseID
      WHERE e.SessionID = ?
      ORDER BY s.LastName ASC, s.FirstName ASC
      `,
      [sessionID]
    );

    return res.status(200).json(rows);
  } catch (error) {
    console.error("Roster fetch error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to load roster"
    });
  }
};

module.exports = { getCourseRoster };