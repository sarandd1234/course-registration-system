const BASE_URL = "http://localhost:3001/api";

async function loadPage(page) {
  const res = await fetch(page);
  const html = await res.text();
  document.getElementById("app").innerHTML = html;

  if (page === "courses.html") {
    await loadCourseFilters();
    await searchCourses();
  }

  if (page === "dashboard.html") {
    await loadDashboard();
  }
}

window.onload = async () => {
  const student = JSON.parse(localStorage.getItem("student"));

  if (student) {
    showAuthenticatedUI(student);
    await loadPage("courses.html");
  } else {
    await loadPage("login.html");
  }
};

function showAuthenticatedUI(student) {
  const nav = document.getElementById("navBar");
  const userInfo = document.getElementById("userInfo");

  if (nav) nav.style.display = "flex";
  if (userInfo) {
    userInfo.innerText = `Hi, ${student.FirstName} ${student.LastName} (${student.StudentID})`;
  }
}

async function handleLogin() {
  const studentID = document.getElementById("studentID").value.trim();
  const password = document.getElementById("password").value.trim();
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

    if (response.ok && data.success) {
      localStorage.setItem("student", JSON.stringify(data.student));
      localStorage.removeItem("notifications");

      showAuthenticatedUI(data.student);

      message.innerText = "Login successful!";
      message.style.color = "green";

      await loadPage("courses.html");
    } else {
      message.innerText = data.message || "Invalid credentials";
      message.style.color = "red";
    }
  } catch (error) {
    console.error("Login error:", error);
    message.innerText = "Error connecting to server";
    message.style.color = "red";
  }
}

function logout() {
  localStorage.removeItem("student");
  localStorage.removeItem("notifications");

  const nav = document.getElementById("navBar");
  const userInfo = document.getElementById("userInfo");

  if (nav) nav.style.display = "none";
  if (userInfo) userInfo.innerText = "";

  loadPage("login.html");
}

function recoverPassword() {
  alert("Password recovery coming soon.");
}

function showConfirmation(message, isSuccess = true) {
  let popup = document.getElementById("popup");

  if (!popup) {
    popup = document.createElement("div");
    popup.id = "popup";
    popup.className = "popup";
    document.body.appendChild(popup);
  }

  popup.className = isSuccess ? "popup success" : "popup error";
  popup.innerText = message;
  popup.style.display = "block";

  setTimeout(() => {
    popup.style.display = "none";
  }, 2800);
}

function addNotification(message) {
  let notifications = JSON.parse(localStorage.getItem("notifications")) || [];
  notifications.push(message);

  if (notifications.length > 5) {
    notifications = notifications.slice(-5);
  }

  localStorage.setItem("notifications", JSON.stringify(notifications));
}

function loadNotifications() {
  const container = document.getElementById("notifications");
  if (!container) return;

  const notifications = JSON.parse(localStorage.getItem("notifications")) || [];

  if (notifications.length === 0) {
    container.innerHTML = "<p>No new notifications.</p>";
    return;
  }

  container.innerHTML = "";
  notifications.slice().reverse().forEach(note => {
    const item = document.createElement("div");
    item.className = "notification-item";
    item.innerText = note;
    container.appendChild(item);
  });
}

async function loadCourseFilters() {
  try {
    const res = await fetch(`${BASE_URL}/courses`);
    const courses = await res.json();

    const titleList = document.getElementById("courseTitleList");
    const numberList = document.getElementById("courseNumberList");
    const instructorList = document.getElementById("instructorList");
    const departmentList = document.getElementById("departmentList");

    if (!titleList || !numberList || !instructorList || !departmentList) return;

    titleList.innerHTML = "";
    numberList.innerHTML = "";
    instructorList.innerHTML = "";
    departmentList.innerHTML = "";

    const titles = [...new Set(courses.map(c => c.CourseName).filter(Boolean))];
    const numbers = [...new Set(courses.map(c => c.CourseNumber).filter(Boolean))];
    const instructors = [...new Set(courses.map(c => c.InstructorName).filter(Boolean))];
    const departments = [...new Set(courses.map(c => c.DepartmentName).filter(Boolean))];

    titles.forEach(value => {
      const option = document.createElement("option");
      option.value = value;
      titleList.appendChild(option);
    });

    numbers.forEach(value => {
      const option = document.createElement("option");
      option.value = value;
      numberList.appendChild(option);
    });

    instructors.forEach(value => {
      const option = document.createElement("option");
      option.value = value;
      instructorList.appendChild(option);
    });

    departments.forEach(value => {
      const option = document.createElement("option");
      option.value = value;
      departmentList.appendChild(option);
    });
  } catch (error) {
    console.error("Filter load error:", error);
  }
}

async function searchCourses() {
  const courseName = document.getElementById("courseName")?.value || "";
  const courseNumber = document.getElementById("courseNumber")?.value || "";
  const instructor = document.getElementById("instructor")?.value || "";
  const department = document.getElementById("department")?.value || "";

  const params = new URLSearchParams();

  if (courseName) params.append("courseName", courseName);
  if (courseNumber) params.append("courseNumber", courseNumber);
  if (instructor) params.append("instructor", instructor);
  if (department) params.append("department", department);

  try {
    const response = await fetch(`${BASE_URL}/courses?${params.toString()}`);
    const data = await response.json();

    const courses = Array.isArray(data) ? data : [];
    await displayCourses(courses);
  } catch (error) {
    console.error("Course search error:", error);
    showConfirmation("Failed to load courses", false);
  }
}

async function displayCourses(courses) {
  const tbody = document.getElementById("courseTableBody");
  if (!tbody) return;

  tbody.innerHTML = "";

  const student = JSON.parse(localStorage.getItem("student"));
  let enrolledSessionIds = [];
  let waitlistedSessionIds = [];

  try {
    if (student) {
      const scheduleRes = await fetch(`${BASE_URL}/schedule/${student.StudentID}`);
      const scheduleData = await scheduleRes.json();
      const enrolledCourses = Array.isArray(scheduleData) ? scheduleData : scheduleData.data || [];
      enrolledSessionIds = enrolledCourses.map(course => String(course.SessionID));

      const waitlistRes = await fetch(`${BASE_URL}/waitlist/student/${student.StudentID}`);
      const waitlistData = await waitlistRes.json();
      const waitlistRows = Array.isArray(waitlistData) ? waitlistData : waitlistData.data || [];
      waitlistedSessionIds = waitlistRows.map(item => String(item.SessionID));
    }
  } catch (error) {
    console.error("Status preload error:", error);
  }

  if (!courses.length) {
    tbody.innerHTML = `
      <tr>
        <td colspan="5">No courses found.</td>
      </tr>
    `;
    return;
  }

  courses.forEach(course => {
    const tr = document.createElement("tr");

    const isActive = course.isActive === 1 || course.isActive === true;
    const seatsAvailable = Number(course.seatsAvailable ?? 0);
    const sessionId = String(course.SessionID);

    let statusLabel = "";
    let statusClass = "";
    let actionHtml = "";

    if (enrolledSessionIds.includes(sessionId)) {
      statusLabel = "Enrolled";
      statusClass = "badge enrolled";
      actionHtml = `<button class="secondary-btn" disabled>Enrolled</button>`;
    } else if (waitlistedSessionIds.includes(sessionId)) {
      statusLabel = "Waitlisted";
      statusClass = "badge waitlist";
      actionHtml = `<button class="secondary-btn" onclick="loadPage('dashboard.html')">View Status</button>`;
    } else if (!isActive) {
      statusLabel = "Inactive";
      statusClass = "badge inactive";
      actionHtml = `<button class="secondary-btn" disabled>Inactive</button>`;
    } else if (seatsAvailable <= 0) {
      statusLabel = "Full";
      statusClass = "badge full";
      actionHtml = `<button onclick="joinWaitlist('${course.SessionID}', '${course.CourseName}')">Waitlist</button>`;
    } else {
      statusLabel = `${seatsAvailable} open`;
      statusClass = "badge open";
      actionHtml = `<button onclick="enroll('${course.SessionID}', '${course.CourseName}')">Enroll</button>`;
    }

    tr.innerHTML = `
      <td>
        <div class="table-title">${course.CourseName}</div>
        <div class="table-subtitle">${course.DepartmentName || ""} ${course.CourseNumber || ""} · Section ${course.SectionNumber || "TBA"}</div>
      </td>
      <td>${course.InstructorName || "TBA"}</td>
      <td>${course.MeetingTime || "TBA"}</td>
      <td><span class="${statusClass}">${statusLabel}</span></td>
      <td>${actionHtml}</td>
    `;

    tbody.appendChild(tr);
  });
}

async function enroll(sessionID, courseName) {
  const student = JSON.parse(localStorage.getItem("student"));
  if (!student) return;

  try {
    const res = await fetch(`${BASE_URL}/enroll`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        StudentID: student.StudentID,
        SessionID: sessionID
      })
    });

    const data = await res.json();

    if (data.success) {
      addNotification(`Enrolled in ${courseName}`);
      showConfirmation(data.message || `Enrolled in ${courseName}`, true);
      await loadPage("dashboard.html");
    } else {
      showConfirmation(data.message || "Enrollment failed", false);
      await searchCourses();
    }
  } catch (err) {
    console.error("Enroll error:", err);
    showConfirmation("Server error during enrollment", false);
  }
}

async function joinWaitlist(sessionID, courseName) {
  const student = JSON.parse(localStorage.getItem("student"));
  if (!student) return;

  try {
    const res = await fetch(`${BASE_URL}/waitlist`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        StudentID: student.StudentID,
        SessionID: sessionID
      })
    });

    const data = await res.json();

    if (data.success) {
      addNotification(`Added to waitlist for ${courseName}`);
      showConfirmation(data.message || `Added to waitlist for ${courseName}`, true);
      await loadPage("dashboard.html");
    } else {
      showConfirmation(data.message || "Waitlist failed", false);
      await searchCourses();
    }
  } catch (err) {
    console.error("Waitlist error:", err);
    showConfirmation("Server error during waitlist", false);
  }
}

async function loadDashboard() {
  loadNotifications();
  await loadMyCourses();
  await loadSchedule();
  await loadMyWaitlist();
}

async function loadMyCourses() {
  const student = JSON.parse(localStorage.getItem("student"));
  const container = document.getElementById("myCourses");
  if (!student || !container) return;

  try {
    const res = await fetch(`${BASE_URL}/schedule/${student.StudentID}`);
    const data = await res.json();
    const courses = Array.isArray(data) ? data : data.data || [];

    container.innerHTML = "";

    if (!courses.length) {
      container.innerHTML = "<p>No enrolled courses yet.</p>";
      return;
    }

    courses.forEach(course => {
      const div = document.createElement("div");
      div.className = "dashboard-item";
      div.innerHTML = `
        <div class="item-title">${course.CourseName}</div>
        <div class="item-meta">${course.DepartmentName || ""} ${course.CourseNumber || ""} · Section ${course.SectionNumber || "TBA"}</div>
        <div class="item-meta">${course.InstructorName || "TBA"} · ${course.MeetingTime || "TBA"}</div>
        <div class="item-actions">
          <button onclick="dropCourse('${course.SessionID}', '${course.CourseName}')">Drop</button>
          <button class="secondary-btn" onclick="loadCourseRoster('${course.SessionID}')">View Roster</button>
        </div>
      `;
      container.appendChild(div);
    });
  } catch (err) {
    console.error("My Courses error:", err);
    container.innerHTML = "<p>Unable to load enrolled courses.</p>";
  }
}

async function loadSchedule() {
  const student = JSON.parse(localStorage.getItem("student"));
  const container = document.getElementById("schedule");
  if (!student || !container) return;

  try {
    const res = await fetch(`${BASE_URL}/schedule/${student.StudentID}`);
    const data = await res.json();
    const courses = Array.isArray(data) ? data : data.data || [];

    container.innerHTML = "";

    if (!courses.length) {
      container.innerHTML = "<p>No schedule available yet.</p>";
      return;
    }

    courses.forEach(course => {
      const div = document.createElement("div");
      div.className = "schedule-row";
      div.innerHTML = `
        <span class="schedule-course">${course.CourseName}</span>
        <span class="schedule-time">${course.MeetingTime || "TBA"}</span>
      `;
      container.appendChild(div);
    });
  } catch (err) {
    console.error("Schedule error:", err);
    container.innerHTML = "<p>Unable to load schedule.</p>";
  }
}

async function loadMyWaitlist() {
  const student = JSON.parse(localStorage.getItem("student"));
  const container = document.getElementById("myWaitlist");
  if (!student || !container) return;

  try {
    const res = await fetch(`${BASE_URL}/waitlist/student/${student.StudentID}`);
    const result = await res.json();
    const rows = Array.isArray(result) ? result : result.data || [];

    container.innerHTML = "";

    if (!rows.length) {
      container.innerHTML = "<p>No waitlisted courses yet.</p>";
      return;
    }

    rows.forEach(item => {
      const displayPosition = Number(item.Position);

      const div = document.createElement("div");
      div.className = "dashboard-item";
      div.innerHTML = `
        <div class="item-title">${item.CourseName}</div>
        <div class="item-meta">Section ${item.SectionNumber || "TBA"} · ${item.MeetingTime || "TBA"}</div>
        <div class="item-meta">${item.InstructorName || "TBA"}</div>
        <div class="waitlist-position">Waitlist Position: ${displayPosition}</div>
        <div class="item-actions">
          <button class="secondary-btn" onclick="loadSessionWaitlist('${item.SessionID}')">View Waitlist</button>
        </div>
      `;
      container.appendChild(div);
    });
  } catch (err) {
    console.error("My waitlist error:", err);
    container.innerHTML = "<p>Unable to load waitlisted courses.</p>";
  }
}

async function loadCourseRoster(sessionID) {
  const container = document.getElementById("rosterList");
  if (!container) return;

  try {
    const res = await fetch(`${BASE_URL}/roster/${sessionID}`);

    if (!res.ok) {
      container.innerHTML = "<p>Unable to load roster.</p>";
      return;
    }

    const result = await res.json();
    const students = result.data || [];

    container.innerHTML = "<div class='panel-title'>Course Roster</div>";

    if (!students.length) {
      container.innerHTML += "<p>No students enrolled in this session.</p>";
      return;
    }

    students.forEach(student => {
      const row = document.createElement("div");
      row.className = "mini-row";
      row.innerText = `${student.StudentName} (${student.StudentID}) - ${student.Status}${student.WaitlistPosition ? ` [Position ${student.WaitlistPosition}]` : ""}`;
      container.appendChild(row);
    });
  } catch (err) {
    console.error("Roster load error:", err);
    container.innerHTML = "<p>Unable to load roster.</p>";
  }
}

async function loadSessionWaitlist(sessionID) {
  const container = document.getElementById("waitlistList");
  if (!container) return;

  try {
    const res = await fetch(`${BASE_URL}/waitlist/session/${sessionID}`);

    if (!res.ok) {
      container.innerHTML = "<p>Unable to load waitlist.</p>";
      return;
    }

    const result = await res.json();
    const rows = result.data || [];

    container.innerHTML = "<div class='panel-title'>Session Waitlist</div>";

    if (!rows.length) {
      container.innerHTML += "<p>No students on the waitlist for this session.</p>";
      return;
    }

    rows.forEach(student => {
      const displayPosition = Number(student.Position);
      const row = document.createElement("div");
      row.className = "mini-row";
      row.innerText = `#${displayPosition} - ${student.FirstName} ${student.LastName} (${student.StudentID})`;
      container.appendChild(row);
    });
  } catch (err) {
    console.error("Waitlist load error:", err);
    container.innerHTML = "<p>Unable to load waitlist.</p>";
  }
}

async function dropCourse(sessionID, courseName) {
  const student = JSON.parse(localStorage.getItem("student"));
  if (!student) return;

  try {
    const res = await fetch(`${BASE_URL}/drop`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        StudentID: student.StudentID,
        SessionID: sessionID
      })
    });

    const data = await res.json();

    if (data.success) {
      addNotification(`Dropped ${courseName}`);
      showConfirmation(data.message || `Dropped ${courseName}`, true);
      await loadDashboard();
    } else {
      showConfirmation(data.message || "Drop failed", false);
    }
  } catch (err) {
    console.error("Drop error:", err);
    showConfirmation("Server error while dropping course", false);
  }
}

function downloadSchedulePDF() {
  showConfirmation("PDF download coming soon", true);
