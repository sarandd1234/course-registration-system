const db = require("../db");

const getAcademicProgress = async (req, res) => {
  try {
    const { studentId } = req.params;

    if (!studentId) {
      return res.status(400).json({
        success: false,
        message: "StudentID is required"
      });
    }

    const [rows] = await db.execute(
      `
      SELECT 
          st.StudentID,
          CONCAT(st.FirstName, ' ', st.LastName) AS StudentName,
          c.CourseID,
          c.CourseName,
          s.SessionID,

          CASE
              WHEN e.EnrollmentID IS NOT NULL THEN 'ENROLLED'
              WHEN w.WaitlistID IS NOT NULL THEN CONCAT('WAITLISTED (Position ', w.Position, ')')
              WHEN EXISTS (
                  SELECT 1
                  FROM Prerequisites p
                  WHERE p.CourseID = c.CourseID
                  AND NOT EXISTS (
                      SELECT 1
                      FROM Enrollment e2
                      JOIN Sessions s2 ON e2.SessionID = s2.SessionID
                      WHERE e2.StudentID = st.StudentID
                      AND s2.CourseID = p.PrereqCourseID
                  )
              ) THEN 'INELIGIBLE (Missing Prerequisite)'
              ELSE 'ELIGIBLE'
          END AS EnrollmentStatus,

          s.Capacity,
          (
              SELECT COUNT(*)
              FROM Enrollment e3
              WHERE e3.SessionID = s.SessionID
          ) AS CurrentEnrollment

      FROM Students st
      JOIN Sessions s ON s.isActive = TRUE
      JOIN Courses c ON s.CourseID = c.CourseID

      LEFT JOIN Enrollment e
          ON e.StudentID = st.StudentID
          AND e.SessionID = s.SessionID

      LEFT JOIN Waitlist w
          ON w.StudentID = st.StudentID
          AND w.SessionID = s.SessionID

      WHERE st.StudentID = ?

      ORDER BY st.StudentID, c.CourseID;
      `,
      [studentId]
    );

    return res.status(200).json({
      success: true,
      message: "Academic progress retrieved successfully",
      data: rows
    });
  } catch (error) {
    console.error("Academic Progress Error:", error);
    return res.status(500).json({
      success: false,
      message: "Error retrieving academic progress",
      error: error.message
    });
  }
};

module.exports = { getAcademicProgress };