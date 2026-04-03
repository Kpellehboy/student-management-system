from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base


class Course(Base):

    __tablename__ = "courses"

    id = Column(Integer, primary_key=True, index=True)

    course_name = Column(String)

    teacher_id = Column(Integer, ForeignKey("teachers.id"))

    teacher = relationship("Teacher")