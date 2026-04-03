from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from fastapi.responses import StreamingResponse

from app.services.pdf_service import generate_grade_pdf
from app.database import get_db
from app.models.user import User
from app.models.student import Student
from app.models.course import Course
from app.models.grade import Grade
from app.models.attendance import Attendance
from app.models.enrollment import Enrollment  
from app.utils.auth import require_role

router = APIRouter()



# Helper: Get Student
# -----------------------------------
def get_student_or_404(db: Session, user_id: int):
    student = db.query(Student).filter(Student.user_id == user_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    return student



# Student Dashboard
# -----------------------------------
@router.get("/dashboard")
def student_dashboard(
    current_user: User = Depends(require_role("student")),
    db: Session = Depends(get_db)
):
    student = get_student_or_404(db, current_user.id)

    return {
        "message": "Welcome to Student Dashboard",
        "student_id": student.id,
        "user": current_user.name
    }


# View Courses 
# -----------------------------------
@router.get("/courses")
def view_courses(
    current_user: User = Depends(require_role("student")),
    db: Session = Depends(get_db)
):
    student = get_student_or_404(db, current_user.id)

    courses = db.query(Course).join(
        Enrollment, Course.id == Enrollment.course_id
    ).filter(
        Enrollment.student_id == student.id
    ).all()

    if not courses:
        return []

    return courses



# View Grades
# -----------------------------------
@router.get("/grades")
def view_grades(
    current_user: User = Depends(require_role("student")),
    db: Session = Depends(get_db)
):
    student = get_student_or_404(db, current_user.id)

    grades = db.query(Grade).filter(
        Grade.student_id == student.id
    ).all()

    return grades



# View Attendance
# -----------------------------------
@router.get("/attendance")
def view_attendance(
    current_user: User = Depends(require_role("student")),
    db: Session = Depends(get_db)
):
    student = get_student_or_404(db, current_user.id)

    attendance = db.query(Attendance).filter(
        Attendance.student_id == student.id
    ).all()

    return attendance



# Download Grade Report as PDF
# -----------------------------------
@router.get("/grades/pdf")
def download_grade_pdf(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("student"))
):
    student = get_student_or_404(db, current_user.id)

    results = db.query(Grade, Course).join(
        Course, Grade.course_id == Course.id
    ).filter(
        Grade.student_id == student.id
    ).all()

    if not results:
        raise HTTPException(status_code=404, detail="No grades found")

    formatted_grades = [
        {
            "course_id": c.id,
            "course_name": c.course_name,
            "score": g.score,
            "grade": g.grade
        }
        for g, c in results
    ]

    pdf_buffer = generate_grade_pdf(current_user.name, formatted_grades)

    return StreamingResponse(
        pdf_buffer,
        media_type="application/pdf",
        headers={
            "Content-Disposition": "attachment; filename=grade_report.pdf"
        }
    )

# Attendance Percentage
# -----------------------------------
@router.get("/attendance/percentage")
def attendance_percentage(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("student"))
):
    student = get_student_or_404(db, current_user.id)

    records = db.query(Attendance).filter(
        Attendance.student_id == student.id
    ).all()

    total_classes = len(records)

    present_classes = sum(
        1 for r in records if r.status.lower() == "present"
    )

    percentage = round(
        (present_classes / total_classes) * 100, 2
    ) if total_classes else 0

    return {
        "student": current_user.name,
        "total_classes": total_classes,
        "present_classes": present_classes,
        "percentage": percentage
    }