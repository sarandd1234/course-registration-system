const db = require("../db");

const loginStudent = async (req, res) => {
  try {
    const { StudentID, Password } = req.body;

    if (!StudentID || !Password) {
      return res.status(400).json({
        success: false,
        message: "StudentID and Password are required"
      });
    }

    const [rows] = await db.execute(
      `SELECT StudentID, FirstName, LastName, Program
       FROM Students
       WHERE StudentID = ? AND Password = ?`,
      [StudentID, Password]
    );

    if (rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Login successful",
      student: rows[0]
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

module.exports = { loginStudent };