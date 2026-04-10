# 🎓 Student Management System (Full Stack)

##  Overview

This is a full-stack **Student Management System** built using **FastAPI (backend)** and **HTML, CSS, JavaScript (frontend)**.
The system supports multiple roles: **Admin, Teacher, Student, and Parent**.

---

##  Features

###  Authentication

* User Registration & Login (JWT-based)
* Role-based access control
  <img width="1366" height="697" alt="image" src="https://github.com/user-attachments/assets/9c89bc7a-8840-42a2-850b-6a359dccd3c7" />


###  Admin

* Create Courses
* Assign Teachers to Courses
* Enroll Students into Courses
* Manage Students & Teachers
  <img width="1366" height="696" alt="image" src="https://github.com/user-attachments/assets/59ae624f-a4e2-463f-9d76-54598052ccc9" />


###  Teacher

* View Students
* Add Attendance
* Add Grades
* Create Assignments
  <img width="1362" height="691" alt="image" src="https://github.com/user-attachments/assets/4d3da5ef-7c6c-428b-a2bb-be666ca21d2c" />


###  Student

* View Courses
* View Grades
* View Attendance
* Download Grade Report (PDF)
* Update Profile
  <img width="1366" height="687" alt="image" src="https://github.com/user-attachments/assets/52fd0bfa-6bc5-41b1-8d4f-522553725896" />


###  Parent

* View Child Grades
* View Child Attendance
* Track Student Progress
  <img width="1355" height="687" alt="image" src="https://github.com/user-attachments/assets/8b8c03f9-49ed-4986-9f04-f0d0bbc0b696" />


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
