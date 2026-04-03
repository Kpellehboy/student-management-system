from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import date

from app.database import get_db
from app.models.user import User
from app.models.teacher import Teacher
from app.models.student import Student
from app.models.course import Course
from app.models.attendance import Attendance
from app.models.grade import Grade
from app.utils.auth import require_role

router = APIRouter()


# Teacher Dashboard
# -----------------------------
@router.get("/dashboard")
def teacher_dashboard(
    current_user: User = Depends(require_role("teacher")),
    db: Session = Depends(get_db)
):
    teacher = db.query(Teacher).filter(Teacher.user_id == current_user.id).first()
    if not teacher:
        raise HTTPException(status_code=404, detail="Teacher profile not found")
    courses = db.query(Course).filter(Course.teacher_id == teacher.id).all()
    return {
        "message": "Welcome Teacher",
        "teacher": current_user.name,
        "courses": courses
    }


# View Students in Course
# -----------------------------
@router.get("/students")
def view_students(
    current_user: User = Depends(require_role("teacher")),
    db: Session = Depends(get_db)
):
    # OPTION 2: Return ALL students (ignore teacher's courses)
    students = db.query(Student).all()
    return students


# Add Attendance
# -----------------------------
@router.post("/attendance")
def add_attendance(
    student_id: int,
    course_id: int,
    status: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("teacher"))
):
    teacher = db.query(Teacher).filter(Teacher.user_id == current_user.id).first()
    if not teacher:
        raise HTTPException(status_code=404, detail="Teacher not found")
    attendance = Attendance(
        student_id=student_id,
        course_id=course_id,
        date=date.today(),
        status=status
    )
    db.add(attendance)
    db.commit()
    db.refresh(attendance)
    return {
        "message": "Attendance added successfully",
        "teacher": current_user.name
    }


# Add Grade
# -----------------------------
@router.post("/grade")
def add_grade(
    student_id: int,
    course_id: int,
    score: int,
    grade: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("teacher"))
):
    new_grade = Grade(
        student_id=student_id,
        course_id=course_id,
        score=score,
        grade=grade
    )
    db.add(new_grade)
    db.commit()
    db.refresh(new_grade)
    return {
        "message": "Grade added successfully",
        "grade": new_grade
    }
