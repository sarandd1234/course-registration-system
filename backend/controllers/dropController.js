// controllers/dropController.js

const dropCourse = async (req, res) => {
  try {
    const { studentId, courseId } = req.body;

    if (!studentId || !courseId) {
      return res.status(400).json({
        success: false,
        message: "studentId and courseId are required"
      });
    }

    // Temporary placeholder logic until DB side is finalized
    return res.status(200).json({
      success: true,
      message: "Course dropped successfully",
      data: {
        studentId,
        courseId
      }
    });
  } catch (error) {
    console.error("Drop course error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while dropping course"
    });
  }
};

module.exports = { dropCourse };