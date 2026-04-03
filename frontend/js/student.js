console.log("Student JS Loaded 🚀");

const API = "http://127.0.0.1:8000";

// ---------------- GLOBAL LOGOUT ----------------
window.logout = function () {
    localStorage.clear();
    window.location.href = "login.html";
};

// ---------------- NORMALIZE API RESPONSE ----------------
function normalizeData(response) {
    if (Array.isArray(response)) return response;

    if (response?.courses) return response.courses;
    if (response?.data) return response.data;
    if (response?.results) return response.results;

    if (typeof response === "object" && response !== null) {
        return [response];
    }

    return [];
}

// ---------------- SAFE FETCH ----------------
async function safeFetch(url) {
    const token = localStorage.getItem("token");

    if (!token) {
        alert("Session expired. Please login again.");
        window.location.href = "login.html";
        return [];
    }

    try {
        const res = await fetch(url, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (!res.ok) return [];

        const json = await res.json();
        return normalizeData(json);

    } catch (error) {
        console.error(error);
        return [];
    }
}

// ---------------- INIT ----------------
window.addEventListener("load", () => {
    bindEvents();
    loadDashboard();
});

// ---------------- EVENT BINDING ----------------
function bindEvents() {
    document.getElementById("btnDashboard").onclick = loadDashboard;
    document.getElementById("btnCourses").onclick = getCourses;
    document.getElementById("btnGrades").onclick = getGrades;
    document.getElementById("btnAttendance").onclick = getAttendance;
    document.getElementById("btnDownloadPDF").onclick = downloadPDF;
}

// ---------------- DASHBOARD (REFINED) ----------------
async function loadDashboard() {
    console.log("Loading Dashboard...");

    const token = localStorage.getItem("token");

    // Dashboard message
    try {
        const res = await fetch(`${API}/student/dashboard`, {
            headers: { "Authorization": `Bearer ${token}` }
        });

        const data = await res.json();

        document.getElementById("dashboardInfo").innerText =
            data.message || "Welcome Student";

    } catch (err) {
        console.error("Dashboard error:", err);
    }

    // ONLY required stats
    await getCourses();               // course count
    await getAttendancePercent();     // attendance %
}

// ---------------- COURSES ----------------
async function getCourses() {
    const data = await safeFetch(`${API}/student/courses`);

    document.getElementById("courseCount").innerText = data.length;

    renderTable(data);
}

// ---------------- GRADES ----------------
async function getGrades() {
    const grades = await safeFetch(`${API}/student/grades`);
    const courses = await safeFetch(`${API}/student/courses`);

    const courseMap = {};
    courses.forEach(c => {
        courseMap[c.id] = c.course_name;
    });

    const formatted = grades.map(g => ({
        ...g,
        course_name: courseMap[g.course_id] || g.course_id
    }));

    renderTable(formatted); // ✅ FIXED
}

// ---------------- ATTENDANCE ----------------
async function getAttendance() {
    const data = await safeFetch(`${API}/student/attendance`);
    renderTable(data);
}

// ---------------- ATTENDANCE % ----------------
async function getAttendancePercent() {
    const token = localStorage.getItem("token");

    try {
        const res = await fetch(`${API}/student/attendance/percentage`, {
            headers: { "Authorization": `Bearer ${token}` }
        });

        const data = await res.json();

        document.getElementById("attendancePercent").innerText =
            data.percentage ? data.percentage + "%" : "0%";

    } catch {
        document.getElementById("attendancePercent").innerText = "0%";
    }
}

// ---------------- DOWNLOAD PDF ----------------
function downloadPDF() {
    const token = localStorage.getItem("token");

    fetch(`${API}/student/grades/pdf`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })
    .then(res => {
        if (!res.ok) throw new Error("Failed to download PDF");
        return res.blob();
    })
    .then(blob => {
        const url = window.URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = "grade_report.pdf";
        document.body.appendChild(a);
        a.click();
        a.remove();
    })
    .catch(err => {
        console.error("PDF error:", err);
        alert("Failed to download PDF");
    });
}

// ---------------- TABLE RENDER ----------------
function renderTable(data) {
    const container = document.getElementById("output");

    if (!data || data.length === 0) {
        container.innerHTML = "<p>No Data Available</p>";
        return;
    }

    let html = `
        <table class="data-table">
            <thead>
                <tr>
    `;

    // Headers
    Object.keys(data[0]).forEach(key => {
        html += `<th>${key.replace(/_/g, " ").toUpperCase()}</th>`;
    });

    html += `
                </tr>
            </thead>
            <tbody>
    `;

    // Rows
    data.forEach(row => {
        html += "<tr>";
        Object.values(row).forEach(value => {
            html += `<td>${value ?? "-"}</td>`;
        });
        html += "</tr>";
    });

    html += `
            </tbody>
        </table>
    `;

    container.innerHTML = html;
}