const db = require("../db");

async function getMissingPrereqCourseNames(studentID, sessionID) {
  const [sessionRows] = await db.execute(
    `SELECT CourseID FROM Sessions WHERE SessionID = ?`,
    [sessionID]
  );

  if (sessionRows.length === 0) {
    return ["Selected course session not found"];
  }

  const targetCourseID = sessionRows[0].CourseID;

  const [prereqRows] = await db.execute(
    `
    SELECT p.PrereqCourseID, c.CourseName
    FROM Prerequisites p
    JOIN Courses c ON p.PrereqCourseID = c.CourseID
    WHERE p.CourseID = ?
    `,
    [targetCourseID]
  );

  if (prereqRows.length === 0) {
    return [];
  }

  const missing = [];

  for (const prereq of prereqRows) {
    const [metRows] = await db.execute(
      `
      SELECT e.EnrollmentID
      FROM Enrollment e
      JOIN Sessions s ON e.SessionID = s.SessionID
      WHERE e.StudentID = ? AND s.CourseID = ?
      `,
      [studentID, prereq.PrereqCourseID]
    );

    if (metRows.length === 0) {
      missing.push(prereq.CourseName);
    }
  }

  return missing;
}

const addToWaitlist = async (req, res) => {
  const { StudentID, SessionID } = req.body;

  if (!StudentID || !SessionID) {
    return res.status(400).json({
      success: false,
      message: "StudentID and SessionID are required"
    });
  }

  try {
    const [sessionRows] = await db.execute(
      `SELECT SessionID, Capacity, isActive FROM Sessions WHERE SessionID = ?`,
      [SessionID]
    );

    if (sessionRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Session not found"
      });
    }

    if (!sessionRows[0].isActive) {
      return res.status(400).json({
        success: false,
        message: "Session is not active"
      });
    }

    const [enrolled] = await db.execute(
      `SELECT * FROM Enrollment WHERE StudentID = ? AND SessionID = ?`,
      [StudentID, SessionID]
    );

    if (enrolled.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Student is already enrolled in this session"
      });
    }

    const [existingWaitlist] = await db.execute(
      `SELECT * FROM Waitlist WHERE StudentID = ? AND SessionID = ?`,
      [StudentID, SessionID]
    );

    if (existingWaitlist.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Student is already on the waitlist"
      });
    }

    const missingPrereqs = await getMissingPrereqCourseNames(StudentID, SessionID);

    if (missingPrereqs.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Prerequisite not satisfied. Complete ${missingPrereqs.join(", ")} first.`
      });
    }

    const [enrollmentCountRows] = await db.execute(
      `SELECT COUNT(*) AS enrolledCount FROM Enrollment WHERE SessionID = ?`,
      [SessionID]
    );

    const enrolledCount = Number(enrollmentCountRows[0].enrolledCount);
    const capacity = Number(sessionRows[0].Capacity);

    if (enrolledCount < capacity) {
      return res.status(400).json({
        success: false,
        message: "Seats are still available. Student should enroll directly instead of waitlisting."
      });
    }

    const [positionRows] = await db.execute(
      `SELECT COUNT(*) AS count FROM Waitlist WHERE SessionID = ?`,
      [SessionID]
    );

    const nextPosition = Number(positionRows[0].count) + 1;

    await db.execute(
      `
      INSERT INTO Waitlist (StudentID, SessionID, WaitlistDate, Position)
      VALUES (?, ?, NOW(), ?)
      `,
      [StudentID, SessionID, nextPosition]
    );

    return res.status(200).json({
      success: true,
      message: `Added to waitlist successfully at position ${nextPosition}`
    });
  } catch (error) {
    console.error("Waitlist add error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to add student to waitlist",
      error: error.message
    });
  }
};

const getWaitlistBySession = async (req, res) => {
  const { sessionId } = req.params;

  try {
    const [rows] = await db.execute(
      `
      SELECT
        w.WaitlistID,
        w.StudentID,
        s.FirstName,
        s.LastName,
        w.SessionID,
        w.WaitlistDate,
        w.Position
      FROM Waitlist w
      JOIN Students s ON w.StudentID = s.StudentID
      WHERE w.SessionID = ?
      ORDER BY w.Position ASC, w.WaitlistDate ASC
      `,
      [sessionId]
    );

    return res.status(200).json({
      success: true,
      message: "Waitlist retrieved successfully",
      data: rows
    });
  } catch (error) {
    console.error("Waitlist fetch error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to load waitlist",
      error: error.message
    });
  }
};

const getWaitlistByStudent = async (req, res) => {
  const { studentId } = req.params;

  try {
    const [rows] = await db.execute(
      `
      SELECT
        w.WaitlistID,
        w.StudentID,
        w.SessionID,
        w.WaitlistDate,
        w.Position,
        c.CourseName,
        c.CourseNumber,
        sess.SectionNumber,
        sess.MeetingTime,
        COALESCE(i.InstructorName, 'TBA') AS InstructorName
      FROM Waitlist w
      JOIN Sessions sess ON w.SessionID = sess.SessionID
      JOIN Courses c ON sess.CourseID = c.CourseID
      LEFT JOIN Instructors i ON sess.InstructorID = i.InstructorID
      WHERE w.StudentID = ?
      ORDER BY w.WaitlistDate DESC
      `,
      [studentId]
    );

    return res.status(200).json({
      success: true,
      message: "Student waitlist retrieved successfully",
      data: rows
    });
  } catch (error) {
    console.error("Student waitlist fetch error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to load student waitlist",
      error: error.message
    });
  }
};

module.exports = {
  addToWaitlist,
  getWaitlistBySession,
  getWaitlistByStudent
};