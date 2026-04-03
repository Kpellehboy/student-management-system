const API = "http://127.0.0.1:8000";
const token = localStorage.getItem("token");

function logout() {
    localStorage.clear();
    window.location.href = "login.html";
}

async function loadDashboard() {
    fetchData("/teacher/dashboard");
}

// ✅ FIXED: Always fetch fresh data, no caching
async function getStudents() {
    // Clear output first and show loading
    document.getElementById("output").innerHTML = "<p>Loading...</p>";
    // Add a random query param to bypass any browser/network cache
    const cacheBuster = `?_=${Date.now()}`;
    await fetchData(`/teacher/students${cacheBuster}`);
}

async function addAttendance() {
    const student_id = document.getElementById("att_student_id").value;
    const course_id = document.getElementById("att_course_id").value;
    const status = document.getElementById("status").value;
    try {
        await fetch(`${API}/teacher/attendance?student_id=${student_id}&course_id=${course_id}&status=${status}`, {
            method: "POST",
            headers: { "Authorization": `Bearer ${token}` }
        });
        showMessage("✅ Attendance added successfully");
    } catch (err) {
        showMessage("❌ Error adding attendance");
    }
}

async function addGrade() {
    const student_id = document.getElementById("grade_student_id").value;
    const course_id = document.getElementById("grade_course_id").value;
    const score = document.getElementById("score").value;
    let grade = document.getElementById("grade_value").value;
    if (!grade) grade = calculateGrade(score);
    try {
        await fetch(`${API}/teacher/grade?student_id=${student_id}&course_id=${course_id}&score=${score}&grade=${grade}`, {
            method: "POST",
            headers: { "Authorization": `Bearer ${token}` }
        });
        showMessage("✅ Grade added successfully");
    } catch (err) {
        showMessage("❌ Error adding grade");
    }
}

function calculateGrade(score) {
    score = parseInt(score);
    if (score >= 90) return "A";
    if (score >= 75) return "B";
    if (score >= 60) return "C";
    return "F";
}

// Generic fetch – now accepts full endpoint (with optional cache buster)
async function fetchData(endpoint) {
    try {
        const res = await fetch(`${API}${endpoint}`, {
            headers: { "Authorization": `Bearer ${token}` }
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        displayData(data);
    } catch (err) {
        document.getElementById("output").innerHTML = `<p style='color:red;'>Error: ${err.message}</p>`;
    }
}

// ✅ Improved display: shows "null" clearly, handles empty arrays
function displayData(data) {
    let html = "";
    if (!data) {
        html = "<p>No data available</p>";
    }
    else if (typeof data === "object" && !Array.isArray(data) && data.courses) {
        // Dashboard view
        html = `<div class='card'><p><strong>Message:</strong> ${data.message || ""}</p>`;
        html += `<p><strong>Teacher:</strong> ${data.teacher || ""}</p>`;
        html += `<p><strong>Courses:</strong></p><ul>`;
        (data.courses || []).forEach(course => {
            html += `<li>${course.name || course.id} (ID: ${course.id})</li>`;
        });
        html += `</ul></div>`;
    }
    else if (Array.isArray(data)) {
        if (data.length === 0) {
            html = "<p>No students found for your courses.</p>";
        } else {
            html = "<table class='data-table'><thead><tr>";
            // Get all keys from first object
            const keys = Object.keys(data[0]);
            keys.forEach(key => html += `<th>${formatKey(key)}</th>`);
            html += "</tr></thead><tbody>";
            data.forEach(item => {
                html += "<tr>";
                keys.forEach(key => {
                    let value = item[key];
                    // Show "null" as text
                    if (value === null || value === undefined) value = "<em>null</em>";
                    // Grade coloring
                    if (key === "grade" && typeof value === "string") {
                        if (value === "A") value = `<span class="grade-a">${value}</span>`;
                        else if (value === "B") value = `<span class="grade-b">${value}</span>`;
                        else if (value === "C") value = `<span class="grade-c">${value}</span>`;
                    }
                    html += `<td>${value}</td>`;
                });
                html += "</tr>";
            });
            html += "</tbody></table>";
        }
    }
    else {
        // Single object fallback
        html = "<div class='card'>";
        for (let key in data) {
            let val = data[key];
            if (val === null || val === undefined) val = "<em>null</em>";
            html += `<p><strong>${formatKey(key)}:</strong> ${val}</p>`;
        }
        html += "</div>";
    }
    document.getElementById("output").innerHTML = html;
}

function formatKey(key) {
    return key.replace(/_/g, " ").toUpperCase();
}

function showMessage(msg) {
    document.getElementById("output").innerHTML = `<p style="color:green; font-weight:bold;">${msg}</p>`;
}

function showSection(section) {
    document.getElementById("dashboard").style.display = "none";
    document.getElementById("attendance").style.display = "none";
    document.getElementById("grade").style.display = "none";
    document.getElementById(section).style.display = "block";
}

// Auto-load dashboard on page load
document.addEventListener("DOMContentLoaded", () => {
    loadDashboard();
});