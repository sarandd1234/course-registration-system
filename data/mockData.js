const students = [
  {
    StudentID: "1001",
    FirstName: "Saran",
    LastName: "Diawara",
    Program: "Information Systems",
    Password: "pass123",
    CompletedCourses: ["INFO101", "INFO201"]
  },
  {
    StudentID: "1002",
    FirstName: "Alex",
    LastName: "Johnson",
    Program: "Marketing",
    Password: "test456",
    CompletedCourses: ["MKTG101"]
  },
  {
    StudentID: "1003",
    FirstName: "Jordan",
    LastName: "Lee",
    Program: "Information Systems",
    Password: "hello789",
    CompletedCourses: []
  }
];

const courses = [
  {
    CourseID: "INFO300",
    DepartmentID: "INFO",
    CourseNumber: "300",
    CourseName: "Database Systems",
    InstructorName: "Dr. Smith",
    Program: "Information Systems",
    Prerequisites: ["INFO101"]
  },
  {
    CourseID: "INFO465",
    DepartmentID: "INFO",
    CourseNumber: "465",
    CourseName: "Projects in Information Systems",
    InstructorName: "Dr. Brown",
    Program: "Information Systems",
    Prerequisites: ["INFO201"]
  },
  {
    CourseID: "MKTG302",
    DepartmentID: "MKTG",
    CourseNumber: "302",
    CourseName: "Marketing Principles",
    InstructorName: "Dr. Lee",
    Program: "Marketing",
    Prerequisites: []
  }
];

module.exports = { students, courses };