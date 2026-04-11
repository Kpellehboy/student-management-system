const API = "https://student-management-system-xge8.onrender.com";

// ---------------- LOGIN ----------------
async function login() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const msgDiv = document.getElementById("msg");

    if (!email || !password) {
        msgDiv.innerText = "Please fill all fields";
        return;
    }

    const formData = new URLSearchParams();
    formData.append("username", email);
    formData.append("password", password);

    try {
        // ✅ FIXED: added /auth prefix
        const res = await fetch(`${API}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: formData
        });

        const data = await res.json();

        if (!res.ok) {
            msgDiv.innerText = data.detail || "Login failed";
            return;
        }

        localStorage.setItem("access_token", data.access_token);
        localStorage.setItem("user_role", data.role);

        if (data.role === "admin") window.location.href = "./admin.html";
        else if (data.role === "student") window.location.href = "./student.html";
        else if (data.role === "teacher") window.location.href = "./teacher.html";
        else if (data.role === "parent") window.location.href = "./parent.html";
        else window.location.href = "./index.html";

    } catch (err) {
        msgDiv.innerText = "Server error. Please try again.";
    }
}

function getAuthHeaders() {
    const token = localStorage.getItem("access_token");
    return {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
    };
}