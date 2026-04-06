# 🎓 Student Management System (Full Stack)

##  Overview

This is a full-stack **Student Management System** built using **FastAPI (backend)** and **HTML, CSS, JavaScript (frontend)**.
The system supports multiple roles: **Admin, Teacher, Student, and Parent**.

---

##  Features

###  Authentication

* User Registration & Login (JWT-based)
* Role-based access control

###  Admin

* Create Courses
* Assign Teachers to Courses
* Enroll Students into Courses
* Manage Students & Teachers

###  Teacher

* View Students
* Add Attendance
* Add Grades
* Create Assignments

###  Student

* View Courses
* View Grades
* View Attendance
* Download Grade Report (PDF)
* Update Profile

###  Parent

* View Child Grades
* View Child Attendance
* Track Student Progress

---

##  Tech Stack

### Backend

* Python
* FastAPI
* SQLAlchemy
* SQLite
* JWT Authentication

### Frontend

* HTML
* CSS
* JavaScript

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

### 1️ Clone Repository

```
git clone https://github.com/YOUR_USERNAME/student-management-system.git
cd student-management-system
```

### 2️⃣ Create Virtual Environment

```
python -m venv .venv
```

Activate:

```
.venv\Scripts\activate   (Windows)
```

### 3️⃣ Install Dependencies

```
pip install -r requirements.txt
```

### 4️⃣ Run Backend

```
uvicorn app.main:app --reload
```

### 5️⃣ Run Frontend

Open:

```
frontend/login.html
```

---

##  Default Roles

* Admin
* Teacher
* Student
* Parent

---

##  API Documentation

After running backend:

```
http://127.0.0.1:8000/docs
```

---

##  Future Improvements

* Dashboard analytics (charts)
* Role-based UI enhancements
* Email notifications
* Deployment on cloud

---

##  Author

Elijah M. Flomo

---

##  Notes

This project demonstrates a complete **role-based full-stack system** similar to real university portals.
