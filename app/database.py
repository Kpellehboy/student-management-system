# from sqlalchemy import create_engine
# from sqlalchemy.ext.declarative import declarative_base
# from sqlalchemy.orm import sessionmaker

# # SQLite database URL
# DATABASE_URL = "sqlite:///./student_management.db"

# # Create database engine
# engine = create_engine(
#     DATABASE_URL, connect_args={"check_same_thread": False}
# )

# # Create session
# SessionLocal = sessionmaker(
#     autocommit=False,
#     autoflush=False,
#     bind=engine
# )

# # Base class for models
# Base = declarative_base()


# # Dependency to get DB session
# def get_db():
#     db = SessionLocal()
#     try:
#         yield db
#     finally:
#         db.close()


import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

# Create engine
engine = create_engine(DATABASE_URL)

# Session
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class
Base = declarative_base()


# ✅ ADD THIS (THIS IS YOUR MISSING PART)
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()