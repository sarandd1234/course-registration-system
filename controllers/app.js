const BASE_URL = "http://localhost:3001/api";

// PAGE SWITCHING
function showPage(pageId) {
  document.getElementById("loginPage").style.display = "none";
  document.getElementById("coursePage").style.display = "none";

  document.getElementById(pageId).style.display = "block";
}

// LOGIN FUNCTION
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

    if (response.ok) {
      message.innerText = "Login successful!";
      message.style.color = "green";

      // OPTIONAL: switch page
      showPage("coursePage");
    } else {
      message.innerText = data.message || "Invalid credentials";
      message.style.color = "red";
    }

  } catch (error) {
    console.error(error);
    message.innerText = "Error connecting to server";
  }
}

// COURSE SEARCH FUNCTION
async function searchCourses() {
  const department = document.getElementById("department").value;
  const courseNumber = document.getElementById("courseNumber").value;
  const instructor = document.getElementById("instructor").value;

  let query = `?department=${department}`;

  if (courseNumber) query += `&courseNumber=${courseNumber}`;
  if (instructor) query += `&instructor=${instructor}`;

  try {
    const response = await fetch(`${BASE_URL}/courses${query}`);
    const data = await response.json();

    console.log("Courses:", data);

    displayCourses(data.courses || data);

  } catch (error) {
    console.error(error);
  }
}

// DISPLAY RESULTS
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
      <p><strong>${course.CourseName}</strong></p>
      <p>Course: ${course.CourseNumber}</p>
      <p>Department: ${course.DepartmentID}</p>
      <p>Instructor: ${course.InstructorName || "N/A"}</p>
      <hr/>
    `;

    resultsDiv.appendChild(div);
  });
}