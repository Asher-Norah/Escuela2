# app/models/assignment.py

from sqlalchemy import Column, Integer, String, Date, ForeignKey, DateTime, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base

class Assignment(Base):
    __tablename__ = "assignments"

    id          = Column(Integer, primary_key=True, autoincrement=True)
    teacher_id  = Column(Integer, ForeignKey("teachers.id", ondelete="CASCADE"), nullable=False)
    title       = Column(String, nullable=False)
    class_name  = Column(String, nullable=False)
    due_date    = Column(Date)
    description = Column(Text)
    total_marks = Column(Integer)
    status      = Column(String, default="open")   # open / grading / graded
    attachment  = Column(String)                   # file path/URL when uploaded
    created_at  = Column(DateTime, default=datetime.utcnow)

    teacher = relationship("Teacher", back_populates="assignments")