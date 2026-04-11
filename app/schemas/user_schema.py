from pydantic import BaseModel, EmailStr
from typing import Optional

# Base schema with common fields
class UserBase(BaseModel):
    name: str
    email: EmailStr
    role: str   # "admin", "teacher", "student", "parent"

# For creating a user (public registration - if you still want it)
class UserCreate(UserBase):
    password: str

# For admin-only user creation (includes optional student/parent linking)
class UserCreateAdmin(UserCreate):
    course_id: Optional[int] = None   # for student enrollment
    parent_id: Optional[int] = None   # for linking student to parent

# For returning user data (without password)
class UserResponse(UserBase):
    id: int

    class Config:
        from_attributes = True   # For SQLAlchemy 2.0 style (formerly orm_mode)