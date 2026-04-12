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

    // Check if student exists
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

    // Check if session exists
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

    // Temporary response until Waitlist table is created
    return res.status(200).json({
      success: true,
      message: "Waitlist endpoint created successfully. Waitlist table not ready yet.",
      data: {
        StudentID,
        SessionID,
        status: "pending_table_setup"
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