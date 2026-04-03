from sqlalchemy import Column, Integer, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base


class Teacher(Base):

    __tablename__ = "teachers"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    user = relationship("User")

    # 🔥 IMPORTANT relationship
    courses = relationship(
        "Course",
        back_populates="teacher",
        cascade="all, delete"
    )