// controllers/scheduleController.js

const getSchedule = async (req, res) => {
  try {
    const { studentId } = req.query;

    if (!studentId) {
      return res.status(400).json({
        success: false,
        message: "studentId is required"
      });
    }

    // Temporary placeholder data until DB query is finalized
    const mockSchedule = [
      {
        courseId: "INFO350",
        courseName: "Database Systems",
        instructor: "Dr. Smith",
        time: "Mon/Wed 10:00 AM",
        location: "Room 205"
      },
      {
        courseId: "INFO465",
        courseName: "Projects in Information Systems",
        instructor: "Prof. Johnson",
        time: "Tue/Thu 2:00 PM",
        location: "Room 110"
      }
    ];

    return res.status(200).json({
      success: true,
      message: "Schedule retrieved successfully",
      data: mockSchedule
    });
  } catch (error) {
    console.error("Schedule error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while retrieving schedule"
    });
  }
};

module.exports = { getSchedule };