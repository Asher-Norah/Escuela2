# app/models/attendance.py
# -------------------------
# Represents the "attendance" table.
# Every time a teacher takes a register, rows are created here —
# one row per student per day.

from sqlalchemy import Column, Integer, String, Date, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base

class Attendance(Base):
    __tablename__ = "attendance"

    id         = Column(Integer, primary_key=True, autoincrement=True)

    # ForeignKey links this row to a specific student and teacher.
    # If student id=5 is deleted, their attendance rows are also deleted (CASCADE).
    student_id = Column(Integer, ForeignKey("students.id", ondelete="CASCADE"), nullable=False)
    teacher_id = Column(Integer, ForeignKey("teachers.id", ondelete="CASCADE"), nullable=False)

    date       = Column(Date, nullable=False)           # which day
    class_name = Column(String, nullable=False)         # which class
    mark       = Column(String, nullable=False)         # P, A, or L
    note       = Column(String)                         # absence reason (optional)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships — lets us do attendance.student.name etc.
    student = relationship("Student", back_populates="attendances")
    teacher = relationship("Teacher", back_populates="attendances")