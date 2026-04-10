from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session

from app.database import engine, Base, get_db

# IMPORT ALL MODELS (MANDATORY)
from app.models import user
from app.models import student
from app.models import teacher
from app.models import course
from app.models import attendance
from app.models import grade

# Import actual model classes (for debug)
from app.models.user import User
from app.models.student import Student

# Import routes
from app.routes import auth, student, teacher, parent, admin


app = FastAPI(
    title="Student Management System API"
)

# ✅ CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://127.0.0.1:5500",
        "http://localhost:5500",
        "https://student-management-system-snowy-omega.vercel.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Create tables
Base.metadata.create_all(bind=engine)

# ✅ Static files
app.mount("/frontend", StaticFiles(directory="frontend"), name="frontend")

# ✅ Register routes
app.include_router(admin.router, prefix="/admin", tags=["Admin"])
app.include_router(auth.router, prefix="/auth", tags=["Auth"])
app.include_router(student.router, prefix="/student", tags=["Student"])
app.include_router(teacher.router, prefix="/teacher", tags=["Teacher"])
app.include_router(parent.router, prefix="/parent", tags=["Parent"])


# ✅ Health check
@app.get("/")
def home():
    return {"message": "Student Management System API is running"}


# 🔥 DEBUG ROUTES (VIEW DATA)

@app.get("/debug/users")
def get_users(db: Session = Depends(get_db)):
    return db.query(User).all()


@app.get("/debug/students")
def get_students(db: Session = Depends(get_db)):
    return db.query(Student).all()