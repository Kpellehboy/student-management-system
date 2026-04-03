from sqlalchemy import Column, Integer, ForeignKey, String
from sqlalchemy.orm import relationship
from app.database import Base


class Grade(Base):

    __tablename__ = "grades"

    id = Column(Integer, primary_key=True, index=True)

    student_id = Column(Integer, ForeignKey("students.id"))

    course_id = Column(Integer, ForeignKey("courses.id"))

    score = Column(Integer)
    grade = Column(String)

    student = relationship("Student")

    course = relationship("Course")