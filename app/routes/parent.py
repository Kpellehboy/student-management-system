from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.models.student import Student
from app.models.grade import Grade
from app.models.attendance import Attendance
from app.utils.auth import require_role

router = APIRouter()


# -----------------------------
# Parent Dashboard
# -----------------------------
@router.get("/dashboard")
def parent_dashboard(
    current_user: User = Depends(require_role("parent")),
    db: Session = Depends(get_db)
):

    # Find student linked to this parent
    student = db.query(Student).filter(
        Student.parent_id == current_user.id
    ).first()

    if not student:
        raise HTTPException(status_code=404, detail="No student linked")

    return {
        "message": "Parent Dashboard",
        "student_id": student.id
    }


# -----------------------------
# View Student Grades
# -----------------------------
@router.get("/grades")
def view_child_grades(
    current_user: User = Depends(require_role("parent")),
    db: Session = Depends(get_db)
):

    student = db.query(Student).filter(
        Student.parent_id == current_user.id
    ).first()

    if not student:
        raise HTTPException(status_code=404, detail="No student linked")

    grades = db.query(Grade).filter(
        Grade.student_id == student.id
    ).all()

    return grades


# -----------------------------
# View Student Attendance
# -----------------------------
@router.get("/attendance")
def view_child_attendance(
    current_user: User = Depends(require_role("parent")),
    db: Session = Depends(get_db)
):

    student = db.query(Student).filter(
        Student.parent_id == current_user.id
    ).first()

    if not student:
        raise HTTPException(status_code=404, detail="No student linked")

    attendance = db.query(Attendance).filter(
        Attendance.student_id == student.id
    ).all()

    return attendance