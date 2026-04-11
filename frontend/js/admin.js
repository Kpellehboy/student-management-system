const API = "https://student-management-system-xge8.onrender.com";
const token = localStorage.getItem("access_token");

// Redirect to login if no token
if (!token) {
    window.location.href = "./index.html";
}

function logout() {
    localStorage.clear();
    window.location.href = "./index.html";
}

// ---------- Course Management ----------
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

// ---------- View Functions ----------
async function getStudents() {
    fetchData(`/admin/students?_=${Date.now()}`, 'students');
}
async function getTeachers() {
    fetchData(`/admin/teachers?_=${Date.now()}`, 'teachers');
}
async function getCourses() {
    fetchData(`/admin/courses?_=${Date.now()}`, 'courses');
}
async function getUsers() {
    fetchData(`/admin/users?_=${Date.now()}`, 'users');
}

// ---------- Generic Fetch with type ----------
async function fetchData(endpoint, endpointType = '') {
    try {
        const res = await fetch(`${API}${endpoint}`, {
            headers: { "Authorization": `Bearer ${token}` }
        });
        if (!res.ok) throw new Error("API Error: " + res.status);
        const data = await res.json();
        renderTable(data, endpointType);
    } catch (err) {
        document.getElementById("output").innerHTML = `<p style="color:red;">${err.message}</p>`;
    }
}

// ---------- Enhanced Table Render with Action Buttons ----------
function renderTable(data, endpointType = '') {
    const container = document.getElementById("output");
    if (!data || data.length === 0) {
        container.innerHTML = "<p>No Data Available</p>";
        return;
    }

    let html = `<table class="data-table"><thead><tr>`;
    // Headers
    Object.keys(data[0]).forEach(key => {
        html += `<th>${key.replace(/_/g, " ").toUpperCase()}</th>`;
    });
    // Add Actions column for user list
    if (endpointType === 'users') {
        html += `<th>ACTIONS</th>`;
    }
    html += `</tr></thead><tbody>`;

    data.forEach(row => {
        html += "<tr>";
        Object.values(row).forEach(value => {
            let display = (value === null || value === undefined) ? "—" : value;
            html += `<td>${display}</td>`;
        });
        // Add action buttons for each user
        if (endpointType === 'users' && row.id) {
            html += `<td>
                <button onclick="updateUser(${row.id})" style="background:#3b82f6; color:white; border:none; padding:4px 8px; margin-right:4px; border-radius:6px;">✏️ Edit</button>
                <button onclick="deleteUser(${row.id})" style="background:#ef4444; color:white; border:none; padding:4px 8px; border-radius:6px;">🗑️ Delete</button>
            </td>`;
        }
        html += "</tr>";
    });
    html += `</tbody></table>`;
    container.innerHTML = html;
}

// ---------- User CRUD Operations ----------
async function updateUser(userId) {
    const newName = prompt("Enter new name:");
    if (!newName) return;
    const newEmail = prompt("Enter new email:");
    if (!newEmail) return;
    const newRole = prompt("Enter new role (admin/student/teacher/parent):");
    if (!newRole) return;

    const res = await fetch(`${API}/admin/users/${userId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ name: newName, email: newEmail, role: newRole })
    });
    const data = await res.json();
    alert(JSON.stringify(data));
    getUsers(); // refresh list
}

async function deleteUser(userId) {
    if (!confirm("Are you sure you want to delete this user?")) return;
    const res = await fetch(`${API}/admin/users/${userId}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
    });
    const data = await res.json();
    alert(data.message);
    getUsers(); // refresh list
}

// ---------- UI Helpers ----------
function showSection(sectionId) {
    const sections = ["createCourse", "assignTeacher", "enrollStudent", "assignParent"];
    sections.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.style.display = "none";
    });
    const target = document.getElementById(sectionId);
    if (target) target.style.display = "block";
}

// ---------- Expose to Global Scope ----------
window.getStudents = getStudents;
window.getTeachers = getTeachers;
window.getCourses = getCourses;
window.createCourse = createCourse;
window.assignTeacher = assignTeacher;
window.enrollStudent = enrollStudent;
window.assignParent = assignParent;
window.logout = logout;
window.showSection = showSection;
window.getUsers = getUsers;
window.updateUser = updateUser;
window.deleteUser = deleteUser;