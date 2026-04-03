const API = "http://127.0.0.1:8000";
const token = localStorage.getItem("token");

function logout() {
    localStorage.clear();
    window.location.href = "./login.html";
}

async function createCourse() {
    const name = document.getElementById("course_name").value;
    const res = await fetch(`${API}/admin/create-course?course_name=${name}`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` }
    });
    const data = await res.json();
    alert(JSON.stringify(data));
}

async function assignTeacher() {
    const teacher_id = document.getElementById("teacher_id").value;
    const course_id = document.getElementById("course_id").value;
    const res = await fetch(`${API}/admin/assign-teacher?teacher_id=${teacher_id}&course_id=${course_id}`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` }
    });
    const data = await res.json();
    alert(JSON.stringify(data));
}

async function enrollStudent() {
    const student_id = document.getElementById("student_id").value;
    const course_id = document.getElementById("course_id2").value;
    const res = await fetch(`${API}/admin/enroll-student?student_id=${student_id}&course_id=${course_id}`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` }
    });
    const data = await res.json();
    alert(JSON.stringify(data));
    // Refresh student view if visible (optional)
    if (document.getElementById("output").innerHTML.includes("Student")) getStudents();
}

async function assignParent() {
    const student_id = document.getElementById("student_id_p").value;
    const parent_id = document.getElementById("parent_id").value;
    const res = await fetch(`${API}/admin/assign-parent?student_id=${student_id}&parent_id=${parent_id}`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` }
    });
    const data = await res.json();
    alert(JSON.stringify(data));
}

// ---------- VIEW FUNCTIONS with cache busting ----------
async function getStudents() {
    fetchData(`/admin/students?_=${Date.now()}`);
}
async function getTeachers() {
    fetchData(`/admin/teachers?_=${Date.now()}`);
}
async function getCourses() {
    fetchData(`/admin/courses?_=${Date.now()}`);
}

async function fetchData(endpoint) {
    try {
        const res = await fetch(`${API}${endpoint}`, {
            headers: { "Authorization": `Bearer ${token}` }
        });
        if (!res.ok) throw new Error("API Error: " + res.status);
        const data = await res.json();
        renderTable(data);
    } catch (err) {
        document.getElementById("output").innerHTML = `<p style="color:red;">${err.message}</p>`;
    }
}

function renderTable(data) {
    const container = document.getElementById("output");
    if (!data || data.length === 0) {
        container.innerHTML = "<p>No Data Available</p>";
        return;
    }
    let html = `<table class="data-table"><thead><tr>`;
    Object.keys(data[0]).forEach(key => {
        html += `<th>${key.replace(/_/g, " ").toUpperCase()}</th>`;
    });
    html += `</tr></thead><tbody>`;
    data.forEach(row => {
        html += "<tr>";
        Object.values(row).forEach(value => {
            let display = (value === null || value === undefined) ? "—" : value;
            html += `<td>${display}</td>`;
        });
        html += "</tr>";
    });
    html += `</tbody></table>`;
    container.innerHTML = html;
}

function showSection(sectionId) {
    const sections = ["createCourse", "assignTeacher", "enrollStudent", "assignParent"];
    sections.forEach(id => {
        document.getElementById(id).style.display = "none";
    });
    document.getElementById(sectionId).style.display = "block";
}

// Make functions global
window.getStudents = getStudents;
window.getTeachers = getTeachers;
window.getCourses = getCourses;
window.createCourse = createCourse;
window.assignTeacher = assignTeacher;
window.enrollStudent = enrollStudent;
window.assignParent = assignParent;
window.logout = logout;
window.showSection = showSection;