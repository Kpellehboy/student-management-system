const API = "http://127.0.0.1:8000";

// ---------------- UI SWITCH ----------------
function showLogin() {
    document.getElementById("registerBox").style.display = "none";
    document.getElementById("loginBox").style.display = "block";
}

function showRegister() {
    document.getElementById("registerBox").style.display = "block";
    document.getElementById("loginBox").style.display = "none";
}

// ---------------- REGISTER ----------------
async function register() {
    const data = {
        name: document.getElementById("r_name").value,
        email: document.getElementById("r_email").value,
        password: document.getElementById("r_password").value,
        role: document.getElementById("r_role").value
    };

    const res = await fetch(`${API}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });

    const result = await res.json();

    document.getElementById("msg").innerText =
        result.message || "Registered successfully!";
}

// ---------------- LOGIN ----------------
async function login() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const res = await fetch(`${API}/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: `username=${email}&password=${password}`
    });

    const data = await res.json();

    if (!data.access_token) {
        document.getElementById("msg").innerText = "Login failed";
        return;
    }

    localStorage.setItem("token", data.access_token);
    localStorage.setItem("role", data.role);

    // redirect
    if (data.role === "admin") window.location.href = "./admin.html";
    else if (data.role === "student") window.location.href = "./student.html";
    else if (data.role === "teacher") window.location.href = "./teacher.html";
    else if (data.role === "parent") window.location.href = "./parent.html";
}