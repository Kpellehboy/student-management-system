const API = "https://student-management-system-xge8.onrender.com";

// Get token from localStorage (using the correct key)
function getToken() {
    return localStorage.getItem("access_token");
}

// ---------------- LOGOUT ----------------
function logout() {
    localStorage.clear();
    window.location.href = "index.html";
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
    const token = getToken();
    if (!token) {
        // No token, redirect to login
        window.location.href = "index.html";
        return;
    }

    try {
        const res = await fetch(`${API}${endpoint}`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (res.status === 401 || res.status === 403) {
            // Unauthorized - clear token and redirect
            localStorage.clear();
            window.location.href = "index.html";
            return;
        }

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

    // No data
    if (!data || (Array.isArray(data) && data.length === 0) || (typeof data === 'object' && Object.keys(data).length === 0)) {
        html = "<p style='text-align:center;'>No data available</p>";
    }
    // Array (grades / attendance)
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
                // Grade coloring
                if (key === "grade") {
                    if (value === "A") value = `<span style="color:#10b981; font-weight:bold;">${value}</span>`;
                    else if (value === "B") value = `<span style="color:#3b82f6; font-weight:bold;">${value}</span>`;
                    else if (value === "C") value = `<span style="color:#f59e0b; font-weight:bold;">${value}</span>`;
                    else value = `<span style="color:#ef4444;">${value}</span>`;
                }
                html += `<td>${value}</td>`;
            }
            html += "</tr>";
        });
        html += "</tbody></table>";
    }
    // Object (dashboard)
    else {
        html = "<div style='background:#f8fafc; padding:1rem; border-radius:16px;'>";
        for (let key in data) {
            html += `<p><strong>${formatKey(key)}:</strong> ${data[key]}</p>`;
        }
        html += "</div>";
    }

    document.getElementById("output").innerHTML = html;
}

// ---------------- FORMAT KEYS ----------------
function formatKey(key) {
    return key.replace(/_/g, " ").toUpperCase();
}

// ---------------- AUTO LOAD DASHBOARD ON PAGE LOAD ----------------
document.addEventListener("DOMContentLoaded", () => {
    // Check token on load
    if (!getToken()) {
        window.location.href = "index.html";
    } else {
        loadDashboard();
    }
});