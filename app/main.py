from fastapi import FastAPI
from app.database import engine, Base

#  IMPORT ALL MODELS (MANDATORY)
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

# Create tables
Base.metadata.create_all(bind=engine)

# redirect_url 
from fastapi.staticfiles import StaticFiles

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


# connect frontend to backend

from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # allow all (for dev)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)