from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordRequestForm

from app.database import get_db
from app.models.user import User
from app.models.student import Student
from app.models.teacher import Teacher
from app.schemas.user_schema import UserCreate, UserCreateAdmin, UserResponse
from app.utils.auth import hash_password, verify_password, create_access_token, get_current_user


router = APIRouter()


# ------------------------------------------------
# LOGIN (public)
# ------------------------------------------------
@router.post("/login")
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.email == form_data.username).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email"
        )
    if not verify_password(form_data.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid password"
        )
    access_token = create_access_token(
        data={"user_id": user.id, "role": user.role}
    )
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "role": user.role
    }


# ------------------------------------------------
# ADMIN ONLY: CREATE USER (student, teacher, parent, admin)
# ------------------------------------------------
@router.post("/admin/users", response_model=UserResponse)
def create_user(
    user_data: UserCreateAdmin,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Only admin can access this endpoint
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only administrators can create users"
        )

    # Check if email already exists
    existing = db.query(User).filter(User.email == user_data.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    # Hash password
    hashed_pw = hash_password(user_data.password)

    # Create user
    new_user = User(
        name=user_data.name,
        email=user_data.email,
        password=hashed_pw,
        role=user_data.role
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    # Create associated profile based on role
    if new_user.role == "student":
        # Optionally accept course_id and parent_id from admin
        student_profile = Student(
            user_id=new_user.id,
            course_id=user_data.course_id,   # can be None
            parent_id=user_data.parent_id    # can be None
        )
        db.add(student_profile)

    elif new_user.role == "teacher":
        teacher_profile = Teacher(user_id=new_user.id)
        db.add(teacher_profile)

    elif new_user.role == "parent":
        # Parent profile might need additional fields; adjust as needed
        # For now, just create a placeholder (you may have a Parent model)
        # If you don't have a Parent model, skip this or add one.
        pass

    db.commit()
    return new_user


# ------------------------------------------------
# OPTIONAL: GET CURRENT USER INFO (for frontend)
# ------------------------------------------------
@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user