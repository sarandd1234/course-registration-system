const db = require("../db");

const dropCourse = async (req, res) => {
  try {
    const { StudentID, SessionID } = req.body;

    if (!StudentID || !SessionID) {
      return res.status(400).json({
        success: false,
        message: "StudentID and SessionID are required"
      });
    }

    const [enrollmentRows] = await db.execute(
      `SELECT * FROM Enrollment WHERE StudentID = ? AND SessionID = ?`,
      [StudentID, SessionID]
    );

    if (enrollmentRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Enrollment not found. Student is not enrolled in this session."
      });
    }

    await db.execute(
      `DELETE FROM Enrollment WHERE StudentID = ? AND SessionID = ?`,
      [StudentID, SessionID]
    );

    const [waitlistRows] = await db.execute(
      `
      SELECT WaitlistID, StudentID, Position
      FROM Waitlist
      WHERE SessionID = ?
      ORDER BY Position ASC, WaitlistDate ASC
      LIMIT 1
      `,
      [SessionID]
    );

    let promotedStudent = null;

    if (waitlistRows.length > 0) {
      const nextStudent = waitlistRows[0];

      await db.execute(
        `
        INSERT INTO Enrollment (StudentID, SessionID)
        VALUES (?, ?)
        `,
        [nextStudent.StudentID, SessionID]
      );

      await db.execute(
        `
        DELETE FROM Waitlist
        WHERE WaitlistID = ?
        `,
        [nextStudent.WaitlistID]
      );

      await db.execute(
        `
        UPDATE Waitlist w
        JOIN (
          SELECT
            WaitlistID,
            ROW_NUMBER() OVER (
              PARTITION BY SessionID
              ORDER BY WaitlistDate, WaitlistID
            ) AS CorrectPosition
          FROM Waitlist
          WHERE SessionID = ?
        ) ranked
        ON w.WaitlistID = ranked.WaitlistID
        SET w.Position = ranked.CorrectPosition
        `,
        [SessionID]
      );

      promotedStudent = nextStudent.StudentID;
    }

    return res.status(200).json({
      success: true,
      message: promotedStudent
        ? "Course dropped successfully and first waitlisted student was enrolled"
        : "Course dropped successfully",
      data: {
        droppedStudent: StudentID,
        SessionID,
        promotedStudent
      }
    });
  } catch (error) {
    console.error("Drop course error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while dropping course",
      error: error.message
    });
  }
};

module.exports = { dropCourse };