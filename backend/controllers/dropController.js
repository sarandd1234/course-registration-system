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
      "SELECT * FROM Enrollment WHERE StudentID = ? AND SessionID = ?",
      [StudentID, SessionID]
    );

    if (enrollmentRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Enrollment not found. Student is not enrolled in this session."
      });
    }

    await db.execute(
      "DELETE FROM Enrollment WHERE StudentID = ? AND SessionID = ?",
      [StudentID, SessionID]
    );

    return res.status(200).json({
      success: true,
      message: "Course dropped successfully",
      data: {
        StudentID,
        SessionID
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