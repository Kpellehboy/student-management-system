const API = "https://student-management-system-xge8.onrender.com";
const token = localStorage.getItem("access_token");

if (!token) {
    window.location.href = "./index.html";
}

function logout() {
    localStorage.clear();
    window.location.href = "./index.html";
}

async function createCourse() {
    const name = document.getElementById("course_name").value;
    const res = await fetch(`${API}/admin/create-course?course_name=${name}`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` }
    });
    const data = await res.json();
    alert(JSON.stringify(data));
    getCourses();
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

async function getStudents() {
    fetchData('/admin/students', 'students');
}
async function getTeachers() {
    fetchData('/admin/teachers', 'teachers');
}
async function getCourses() {
    fetchData('/admin/courses', 'courses');
}
async function getUsers() {
    fetchData('/admin/users', 'users');
}

async function fetchData(endpoint, type) {
    try {
        const res = await fetch(`${API}${endpoint}?_=${Date.now()}`, {
            headers: { "Authorization": `Bearer ${token}` }
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        renderTable(data, type);
    } catch (err) {
        document.getElementById("output").innerHTML = `<p class="message error">${err.message}</p>`;
    }
}

function renderTable(data, type) {
    const container = document.getElementById("output");
    if (!data || data.length === 0) {
        container.innerHTML = "<p>No Data Available</p>";
        return;
    }
    let html = `<table class="data-table"><thead><tr>`;
    Object.keys(data[0]).forEach(key => {
        html += `<th>${key.replace(/_/g, " ").toUpperCase()}</th>`;
    });
    if (type === 'users') {
        html += `<th>ACTIONS</th>`;
    }
    html += `</td></thead><tbody>`;

    data.forEach(row => {
        html += "<tr>";
        Object.values(row).forEach(value => {
            let display = (value === null || value === undefined) ? "—" : value;
            html += `<td>${display}</td>`;
        });
        if (type === 'users' && row.id) {
            html += `<td>
                <button onclick="updateUser(${row.id})" style="background:#3b82f6; padding:4px 8px; margin-right:4px;">✏️ Edit</button>
                <button onclick="deleteUser(${row.id})" style="background:#ef4444; padding:4px 8px;">🗑️ Delete</button>
            </td>`;
        }
        html += "</tr>";
    });
    html += `</tbody></table>`;
    container.innerHTML = html;
}

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
    getUsers();
}

async function deleteUser(userId) {
    if (!confirm("Delete user permanently?")) return;
    const res = await fetch(`${API}/admin/users/${userId}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
    });
    const data = await res.json();
    alert(data.message);
    getUsers();
}

// NEW: Create User function
async function createUser() {
    const name = document.getElementById("new_name").value;
    const email = document.getElementById("new_email").value;
    const password = document.getElementById("new_password").value;
    const role = document.getElementById("new_role").value;

    if (!name || !email || !password) {
        alert("Please fill all fields");
        return;
    }

    const res = await fetch(`${API}/auth/admin/users`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ name, email, password, role, course_id: null, parent_id: null })
    });
    const data = await res.json();
    if (res.ok) {
        alert(`User "${data.name}" created successfully`);
        document.getElementById("new_name").value = "";
        document.getElementById("new_email").value = "";
        document.getElementById("new_password").value = "";
        getUsers(); // refresh user list if visible
    } else {
        alert(data.detail || "Creation failed");
    }
}

// Updated showSection to include 'createUser'
function showSection(sectionId) {
    const sections = ["createCourse", "assignTeacher", "enrollStudent", "assignParent", "createUser"];
    sections.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.style.display = "none";
    });
    const target = document.getElementById(sectionId);
    if (target) target.style.display = "block";
}

// Expose functions globally
window.getStudents = getStudents;
window.getTeachers = getTeachers;
window.getCourses = getCourses;
window.getUsers = getUsers;
window.createCourse = createCourse;
window.assignTeacher = assignTeacher;
window.enrollStudent = enrollStudent;
window.assignParent = assignParent;
window.updateUser = updateUser;
window.deleteUser = deleteUser;
window.createUser = createUser;
window.logout = logout;
window.showSection = showSection;