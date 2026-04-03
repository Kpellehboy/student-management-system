from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.models.student import Student
from app.models.teacher import Teacher
from app.models.course import Course
from app.utils.auth import require_role

router = APIRouter()


# Create Course
# -----------------------------
@router.post("/create-course", status_code=status.HTTP_201_CREATED)
def create_course(
    course_name: str,
    db: Session = Depends(get_db),
    _: User = Depends(require_role("admin"))
):
    # Check duplicate course
    existing = db.query(Course).filter(Course.course_name == course_name).first()

    if existing:
        raise HTTPException(status_code=400, detail="Course already exists")

    new_course = Course(course_name=course_name)

    db.add(new_course)
    db.commit()
    db.refresh(new_course)

    return {
        "message": "Course created successfully",
        "course_id": new_course.id,
        "course_name": new_course.course_name
    }



# Assign Teacher to Course
# -----------------------------
@router.post("/assign-teacher")
def assign_teacher(
    teacher_id: int,
    course_id: int,
    db: Session = Depends(get_db),
    _: User = Depends(require_role("admin"))
):
    course = db.query(Course).filter(Course.id == course_id).first()

    if not course:
        raise HTTPException(status_code=404, detail="Course not found")

    teacher = db.query(Teacher).filter(Teacher.id == teacher_id).first()

    if not teacher:
        raise HTTPException(status_code=404, detail="Teacher not found")

    course.teacher_id = teacher.id
    db.commit()

    return {
        "message": "Teacher assigned successfully",
        "course_id": course.id,
        "teacher_id": teacher.id
    }


# Enroll Student to Course
# -----------------------------
# router/admin.py (only the enroll_student part is changed – rest unchanged)

@router.post("/enroll-student")
def enroll_student(
    student_id: int,
    course_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("admin"))
):
    student = db.query(Student).filter(Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")

    #  student's direct course_id (for teacher view & admin view)
    student.course_id = course.id

    # Keep the Enrollment record (optional, for future many-to-many)
    from app.models.enrollment import Enrollment
    enrollment = Enrollment(student_id=student.id, course_id=course.id)
    db.add(enrollment)

    db.commit()

    return {"message": "Student enrolled successfully", "course_id": course.id}


# View All Students
# -----------------------------
@router.get("/students")
def get_students(
    db: Session = Depends(get_db),
    _: User = Depends(require_role("admin"))
):
    students = db.query(Student).all()

    if not students:
        return {"message": "No students found"}

    return students



# View All Teachers
# -----------------------------
@router.get("/teachers")
def get_teachers(
    db: Session = Depends(get_db),
    _: User = Depends(require_role("admin"))
):
    teachers = db.query(Teacher).all()

    if not teachers:
        return {"message": "No teachers found"}

    return teachers



# View All Courses
# -----------------------------
@router.get("/courses")
def get_courses(
    db: Session = Depends(get_db),
    _: User = Depends(require_role("admin"))
):
    courses = db.query(Course).all()

    if not courses:
        return {"message": "No courses found"}

    return courses



# Assign Parent to Student
# -----------------------------
@router.post("/assign-parent")
def assign_parent(
    student_id: int,
    parent_id: int,
    db: Session = Depends(get_db),
    _: User = Depends(require_role("admin"))
):

    student = db.query(Student).filter(Student.id == student_id).first()

    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    parent = db.query(User).filter(User.id == parent_id).first()

    if not parent or parent.role != "parent":
        raise HTTPException(status_code=400, detail="Invalid parent user")

    student.parent_id = parent.id
    db.commit()

    return {
        "message": "Parent assigned successfully",
        "student_id": student.id,
        "parent_id": parent.id
    }