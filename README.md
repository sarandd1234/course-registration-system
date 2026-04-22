Course Registration System

A full-stack web application that allows students to search, enroll in, and manage course registrations. The system supports real-time enrollment, waitlisting, schedule tracking, and dashboard management.

Features
- Student Authentication (Login/Logout)
- Course Search with filters (title, number, instructor, department)
- Course Enrollment
- Waitlist System (FIFO logic)
- Dashboard with:
- Enrolled Courses
- Schedule View
- Waitlist Status + Position
- Notifications
- Instructor Course Roster View
- Drop Course Functionality
  
Tech Stack
- Frontend: HTML, CSS, JavaScript 
- Backend: Node.js / Express
- Database: SQL-based database (MySQL / Postman)

Project Structure
/frontend
  index.html
  login.html
  dashboard.html
  courses.html
  styles.css
  app.js

/backend
  server.js
  routes/
  controllers/
  database/
  
Setup Instructions
1. Clone Repository
git clone https://github.com/sarandd1234/course-registration-system.git
cd course-registration-system
2. Install Backend Dependencies
npm install
3. Start Backend Server
node server.js
Runs on: http://localhost:3001
4. Run Frontend
Open index.html in browser

API Base URL
http://localhost:3001/api

Demo Credentials
Student ID: S001
Password: pass1234

Notes
Ensure backend is running before using frontend
Database must be connected properly
Some features (PDF export) are placeholders
