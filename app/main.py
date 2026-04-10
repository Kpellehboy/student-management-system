from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.database import engine, Base

# IMPORT ALL MODELS (MANDATORY)
from app.models import user
from app.models import student
from app.models import teacher
from app.models import course
from app.models import attendance
from app.models import grade

# Import routes
from app.routes import auth, student, teacher, parent, admin


app = FastAPI(
    title="Student Management System API"
)

# CORS (move here - early initialization)
origins = [
    "https://student-management-system-snowy-omega.vercel.app",
    "http://localhost:3000",
]


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # allow all origins
    allow_credentials=False,  # IMPORTANT: must be False when using "*"
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create tables
Base.metadata.create_all(bind=engine)

# Static frontend (optional - safe version)
app.mount("/frontend", StaticFiles(directory="frontend"), name="frontend")

# Register routes
app.include_router(admin.router, prefix="/admin", tags=["Admin"])
app.include_router(auth.router, prefix="/auth", tags=["Auth"])
app.include_router(student.router, prefix="/student", tags=["Student"])
app.include_router(teacher.router, prefix="/teacher", tags=["Teacher"])
app.include_router(parent.router, prefix="/parent", tags=["Parent"])


@app.get("/")
def home():
    return {"message": "Student Management System API is running"}