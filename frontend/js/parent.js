const API = "https://student-management-system-df8x.onrender.com";
const token = localStorage.getItem("token");

// ---------------- LOGOUT ----------------
function logout() {
    localStorage.clear();
    window.location.href = "login.html";
}

// ---------------- DASHBOARD ----------------
async function loadDashboard() {
    fetchData("/parent/dashboard");
}

// ---------------- GRADES ----------------
async function getGrades() {
    fetchData("/parent/grades");
}

// ---------------- ATTENDANCE ----------------
async function getAttendance() {
    fetchData("/parent/attendance");
}

// ---------------- FETCH FUNCTION ----------------
async function fetchData(endpoint) {
    try {
        const res = await fetch(`${API}${endpoint}`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        const data = await res.json();

        displayData(data);

    } catch (error) {
        document.getElementById("output").innerHTML =
            "<p style='color:red;'>Error loading data</p>";
    }
}

// ---------------- DISPLAY FUNCTION ----------------
function displayData(data) {
    let html = "";

    // ❌ No data
    if (!data || data.length === 0) {
        html = "<p style='text-align:center;'>No data available</p>";
    }

    // ✅ Array (grades / attendance)
    else if (Array.isArray(data)) {

        html = "<table class='data-table'>";

        // Header
        html += "<thead><tr>";
        for (let key in data[0]) {
            html += `<th>${formatKey(key)}</th>`;
        }
        html += "</tr></thead>";

        // Body
        html += "<tbody>";
        data.forEach(item => {
            html += "<tr>";

            for (let key in item) {

                let value = item[key];

                // 🎨 Grade coloring
                if (key === "grade") {
                    if (value === "A")
                        value = `<span class="grade-a">${value}</span>`;
                    else if (value === "B")
                        value = `<span class="grade-b">${value}</span>`;
                    else if (value === "C")
                        value = `<span class="grade-c">${value}</span>`;
                }

                html += `<td>${value}</td>`;
            }

            html += "</tr>";
        });

        html += "</tbody></table>";
    }

    // ✅ Object (dashboard)
    else {
        html = "<div class='card'>";
        for (let key in data) {
            html += `<p><strong>${formatKey(key)}:</strong> ${data[key]}</p>`;
        }
        html += "</div>";
    }

    document.getElementById("output").innerHTML = html;
}

// ---------------- FORMAT KEYS ----------------
function formatKey(key) {
    return key.replace("_", " ").toUpperCase();
}

// ---------------- AUTO LOAD ----------------
document.addEventListener("DOMContentLoaded", () => {
    loadDashboard();
});