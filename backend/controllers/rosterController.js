const db = require("../db");

const getCourseRoster = async (req, res) => {
  const { sessionId } = req.params;

  if (!sessionId) {
    return res.status(400).json({
      success: false,
      message: "SessionID is required"
    });
  }

  try {
    const [rows] = await db.execute(
      `
      SELECT 
          sess.SessionID,
          c.CourseID,
          c.CourseName,
          sess.SectionNumber,
          sess.MeetingTime,
          COALESCE(i.InstructorName, 'TBA') AS InstructorName,

          st.StudentID,
          CONCAT(st.FirstName, ' ', st.LastName) AS StudentName,

          'ENROLLED' AS Status,
          NULL AS WaitlistPosition

      FROM Enrollment e
      JOIN Students st ON e.StudentID = st.StudentID
      JOIN Sessions sess ON e.SessionID = sess.SessionID
      JOIN Courses c ON sess.CourseID = c.CourseID
      LEFT JOIN Instructors i ON sess.InstructorID = i.InstructorID

      WHERE sess.isActive = TRUE
        AND sess.SessionID = ?

      UNION ALL

      SELECT 
          sess.SessionID,
          c.CourseID,
          c.CourseName,
          sess.SectionNumber,
          sess.MeetingTime,
          COALESCE(i.InstructorName, 'TBA') AS InstructorName,

          st.StudentID,
          CONCAT(st.FirstName, ' ', st.LastName) AS StudentName,

          'WAITLISTED' AS Status,
          w.Position AS WaitlistPosition

      FROM Waitlist w
      JOIN Students st ON w.StudentID = st.StudentID
      JOIN Sessions sess ON w.SessionID = sess.SessionID
      JOIN Courses c ON sess.CourseID = c.CourseID
      LEFT JOIN Instructors i ON sess.InstructorID = i.InstructorID

      WHERE sess.isActive = TRUE
        AND sess.SessionID = ?

      ORDER BY
          CASE
              WHEN Status = 'ENROLLED' THEN 0
              ELSE 1
          END,
          WaitlistPosition,
          StudentName
      `,
      [sessionId, sessionId]
    );

    return res.status(200).json({
      success: true,
      message: "Roster retrieved successfully",
      data: rows
    });
  } catch (error) {
    console.error("Roster fetch error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to load roster",
      error: error.message
    });
  }
};

module.exports = { getCourseRoster };