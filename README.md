# 🎓 Student Management System (Full Stack)

##  Overview

A full-stack **Student Management System** built with **FastAPI (backend)** and **HTML, CSS, JavaScript (frontend)**.
The system supports multiple user roles with **secure authentication**, **role-based access control**, and **cloud deployment**.

Designed to simulate a real-world **university management portal**.

---

##  Live Demo

* 🔗 Frontend: https://student-management-system-snowy-omega.vercel.app/
* 🔗 Backend API: https://student-management-system-xge8.onrender.com/

---

##  Features

###  Authentication

* JWT-based login & registration
* Secure password hashing
* Role-based authorization (Admin, Teacher, Student, Parent)

---

### 👨‍💼 Admin

* Create and manage courses
* Assign teachers to courses
* Enroll students
* Manage users (students & teachers)

---

### 👨‍🏫 Teacher

* View assigned students
* Mark attendance
* Add grades
* Create assignments

---

### 🎓 Student

* View enrolled courses
* Check grades & attendance
* Download grade report (PDF)
* Update profile

---

### 👨‍👩‍👧 Parent

* Monitor student performance
* View grades & attendance
* Track academic progress

---

## 🛠 Tech Stack

###  Backend

* Python
* FastAPI
* SQLAlchemy
* PostgreSQL (Production)
* SQLite (Local Development)
* JWT Authentication

---

###  Frontend

* HTML
* CSS
* JavaScript

---

### ☁️ Deployment

* Backend: Render
* Frontend: Vercel
* Database: PostgreSQL (Render)

---

##  Project Structure

```
app/
 ├── models/
 ├── routes/
 ├── schemas/
 ├── services/
 ├── utils/
 ├── database.py
 ├── main.py

frontend/
 ├── login.html
 ├── student.html
 ├── teacher.html
 ├── parent.html
 ├── css/
 ├── js/
```

---

##  Installation & Setup

### Clone Repository

```bash
git clone https://github.com/Kpellehboy/student-management-system.git
cd student-management-system
```

---

###  Create Virtual Environment

```bash
python -m venv .venv
```

Activate:

```bash
.venv\Scripts\activate   # Windows
```

---

###  Install Dependencies

```bash
pip install -r requirements.txt
```

---

###  Configure Environment Variables

Create a `.env` file:

```env
DATABASE_URL=sqlite:///./student_management.db
```

---

###  Run Backend

```bash
uvicorn app.main:app --reload
```

---

###  Run Frontend

Open:

```text
frontend/login.html
```

---

##  API Documentation

Available at:

```text
http://127.0.0.1:8000/docs
```

---

##  Production Setup

* Uses **PostgreSQL database**
* Environment variables configured via Render
* Fully deployed backend & frontend

---

##  Security Notes

* Passwords are hashed using bcrypt
* JWT tokens used for authentication
* Sensitive data stored in environment variables

---

##  Future Improvements

* 📊 Dashboard analytics (charts & insights)
* 🔐 Role-based UI restrictions
* 📧 Email notifications
* 📱 Mobile responsiveness improvements
* 🛡️ Advanced security (RBAC middleware)

---

## 👨‍💻 Author

**Elijah M. Flomo**

---

## ⭐ Project Highlights

* Full-stack architecture
* RESTful API design
* Role-based system
* Cloud deployment (Render + Vercel)
* Real database integration (PostgreSQL)

---


