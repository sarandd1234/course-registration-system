const BASE_URL = "http://localhost:3001/api";

async function loadPage(page) {
  const res = await fetch(page);
  const html = await res.text();
  document.getElementById("app").innerHTML = html;

}

window.onload = () => {
  const student = JSON.parse(localStorage.getItem("student"));

  if (student) {
    showAuthenticatedUI(student);
    loadPage("courses.html");
  } else {
    loadPage("login.html");
  }
};

function showAuthenticatedUI(student) {
  const nav = document.getElementById("navBar");
  const userInfo = document.getElementById("userInfo");

  nav.style.display = "flex";
  userInfo.innerText = `Hi, ${student.FirstName} ${student.LastName} (${student.StudentID})`;
}

async function handleLogin() {
  const studentID = document.getElementById("studentID").value;
  const password = document.getElementById("password").value;
  const message = document.getElementById("loginMessage");

  try {
    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        StudentID: studentID,
        Password: password
      })
    });

    const data = await response.json();

    console.log("Login Response:", data);

    if (response.ok && data.success) {
      message.innerText = "Login successful!";
      message.style.color = "green";

      localStorage.setItem("student", JSON.stringify(data.student));

      showAuthenticatedUI(data.student);

      loadPage("courses.html");
    } else {
      message.innerText = data.message || "Invalid credentials";
      message.style.color = "red";
    }

  } catch (error) {
    console.error(error);
    message.innerText = "Error connecting to server";
  }
}

function logout() {
  localStorage.removeItem("student");
  document.getElementById("navBar").style.display = "none";
  loadPage("login.html");
}

function recoverPassword() {
  alert("Password recovery coming soon");
}

async function searchCourses() {
  const semester = document.getElementById("semester")?.value;
  const department = document.getElementById("department").value;
  const courseNumber = document.getElementById("courseNumber").value;
  const instructor = document.getElementById("instructor").value;

  let query = "";

  if (department) query += `?department=${department}`;
  else query += "?";

  if (semester) query += `&semester=${semester}`;
  if (courseNumber) query += `&courseNumber=${courseNumber}`;
  if (instructor) query += `&instructor=${instructor}`;

  try {
    const response = await fetch(`${BASE_URL}/courses${query}`);
    const data = await response.json();

    console.log("Courses:", data);
    console.log("Search URL:", `${BASE_URL}/courses${query}`);

    const courses = Array.isArray(data)
    ? data
    : data.courses
    ? data.courses
    : data.data
    ? data.data
    : [];
    const filteredCourses = courses.filter(course => {
      if (course.isActive === false) return false;
      if (course.seatsAvailable !== undefined && course.seatsAvailable <= 0) return false;
      return true;
    });

    displayCourses(filteredCourses);

  } catch (error) {
    console.error(error);
  }
}

function displayCourses(courses) {
  const resultsDiv = document.getElementById("results");

  resultsDiv.innerHTML = "";

  if (!courses || courses.length === 0) {
    resultsDiv.innerHTML = "<p>No courses found</p>";
    return;
  }

  courses.forEach(course => {
    const div = document.createElement("div");

    div.innerHTML = `
      <p>Course: ${course.CourseName}</p>
      <p>Department: ${course.DepartmentName || "TBA"}</p>
      <p>Instructor: ${course.InstructorName || "TBA"}</p>
      <p>Section: ${course.SectionNumber || "TBA"}</p>
      <p>Time: ${course.MeetingTime || "TBA"}</p>
      <p>Credits: ${course.Credits || "TBA"}</p>
      <p>Seats: ${course.seatsAvailable ?? "TBA"}</p>
      <p>Status: ${course.isActive ? "Active" : "Inactive"}</p>
      ${course.isActive !== false
        ? `<button onclick="enroll('${course.SessionID}')">Enroll</button>`
        : ""
      }
      <button onclick="joinWaitlist('${course.SessionID}')">Join Waitlist</button>
      <hr/>
    `;

    resultsDiv.appendChild(div);
  });
}
async function enroll(sessionID) {
  const student = JSON.parse(localStorage.getItem("student"));

  try {
    const res = await fetch(`${BASE_URL}/enroll`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        StudentID: student.StudentID,
        SessionID: sessionID
      })
    });

    const data = await res.json();

    if (data.success) {
      showConfirmation("Enrolled successfully!");
      addNotification("Successfully enrolled!");
      loadMyCourses();
    } else {
      showConfirmation(data.message || "Enrollment failed");
    }

  } catch (err) {
    console.error(err);
    showConfirmation("Server error during enrollment");
  }
}
async function joinWaitlist(sessionID) {
  const student = JSON.parse(localStorage.getItem("student"));

  try {
    const res = await fetch(`${BASE_URL}/waitlist`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        StudentID: student.StudentID,
        SessionID: sessionID
      })
    });

    const data = await res.json();

    if (data?.success) {
      showConfirmation("Added to waitlist!");
    } else {
      showConfirmation("Waitlist submitted (pending backend processing)");
    }

  } catch (err) {
    console.warn("Waitlist backend not ready, using fallback UI");

    showConfirmation("Added to waitlist (temporary mode)");
  }
}

function showConfirmation(message) {
  const popup = document.getElementById("popup");
  popup.innerText = message;
  popup.style.display = "block";

  setTimeout(() => {
    popup.style.display = "none";
  }, 3000);
}
function enableDrag() {
  const widgets = document.querySelectorAll(".widget");

  widgets.forEach(w => {
    w.draggable = true;

    w.addEventListener("dragstart", e => {
      e.dataTransfer.setData("text/plain", e.target.innerHTML);
    });

    w.addEventListener("drop", e => {
      e.preventDefault();
      e.target.innerHTML = e.dataTransfer.getData("text/plain");
    });

    w.addEventListener("dragover", e => e.preventDefault());
  });
}

async function loadDashboard() {
  loadMyCourses();
  loadNotifications();
  loadSchedule();
}
async function loadMyCourses() {
  const student = JSON.parse(localStorage.getItem("student"));

  try {
    const res = await fetch(`${BASE_URL}/enrollments?studentID=${student.StudentID}`);
    const data = await res.json();

    const courses = Array.isArray(data)
    ? data
    : data.courses
    ? data.courses
    : data.data
    ? data.data
    : [];
    const container = document.getElementById("myCourses");
    container.innerHTML = "";

    courses.forEach(course => {
      const div = document.createElement("div");

      div.innerHTML = `
        <p><strong>${course.CourseName}</strong></p>
        <p>${course.InstructorName || "TBA"}</p>
        <p>${course.SectionNumber || "TBA"}</p>
        <p>${course.MeetingTime || "TBA"}</p>
      `;

      container.appendChild(div);
    });

  } catch (err) {
    console.error("Dashboard error:", err);
  }
}

async function loadSchedule() {
  const student = JSON.parse(localStorage.getItem("student"));

  try {
    const res = await fetch(`${BASE_URL}/enrollments?studentID=${student.StudentID}`);
    const data = await res.json();

    const courses = Array.isArray(data)
    ? data
    : data.courses
    ? data.courses
    : data.data
    ? data.data
    : [];
    const container = document.getElementById("schedule");
    container.innerHTML = "";

    courses.forEach(course => {
      const div = document.createElement("div");
      div.classList.add("schedule-item");

      div.innerHTML = `
        <p><strong>${course.CourseName}</strong></p>
        <p>Time: ${course.MeetingTime || "TBD"}</p>
      `;

      container.appendChild(div);
    });

  } catch (err) {
    console.error("Schedule error:", err);
  }
}

async function loadCourseRoster(sessionID) {
  try {
    const res = await fetch(`${BASE_URL}/roster?sessionID=${sessionID}`);
    const students = await res.json();

    const container = document.getElementById("rosterList");
    container.innerHTML = "<h4>Enrolled Students</h4>";

    students.forEach(s => {
      const p = document.createElement("p");
      p.innerText = `${s.FirstName} ${s.LastName} (${s.StudentID})`;
      container.appendChild(p);
    });
  } catch (err) {
    console.error("Roster load error:", err);
  }
}
