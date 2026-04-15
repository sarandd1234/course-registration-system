const db = require("../db");

const addToWaitlist = async (req, res) => {
  try {
    const { StudentID, SessionID } = req.body;

    if (!StudentID || !SessionID) {
      return res.status(400).json({
        success: false,
        message: "StudentID and SessionID are required"
      });
    }

    const [studentRows] = await db.execute(
      "SELECT StudentID FROM Students WHERE StudentID = ?",
      [StudentID]
    );

    if (studentRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Student not found"
      });
    }

    const [sessionRows] = await db.execute(
      "SELECT SessionID FROM Sessions WHERE SessionID = ?",
      [SessionID]
    );

    if (sessionRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Session not found"
      });
    }

    const [enrollmentRows] = await db.execute(
      "SELECT * FROM Enrollment WHERE StudentID = ? AND SessionID = ?",
      [StudentID, SessionID]
    );

    if (enrollmentRows.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Student is already enrolled in this session"
      });
    }

    const [existingWaitlist] = await db.execute(
      "SELECT * FROM Waitlist WHERE StudentID = ? AND SessionID = ?",
      [StudentID, SessionID]
    );

    if (existingWaitlist.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Student is already on the waitlist for this session"
      });
    }

    await db.execute(
      "INSERT INTO Waitlist (StudentID, SessionID) VALUES (?, ?)",
      [StudentID, SessionID]
    );

    return res.status(200).json({
      success: true,
      message: "Student successfully added to waitlist",
      data: {
        StudentID,
        SessionID
      }
    });
  } catch (error) {
    console.error("Waitlist error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while processing waitlist request",
      error: error.message
    });
  }
};

module.exports = { addToWaitlist };