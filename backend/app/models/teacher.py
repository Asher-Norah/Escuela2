# app/models/teacher.py
# ----------------------
# This represents the "teachers" table in PostgreSQL.
# Every teacher who logs into ESCUELA has a row here.

from sqlalchemy import Column, Integer, String, Boolean, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base

class Teacher(Base):
    # __tablename__ tells SQLAlchemy what to call this
    # table in the actual PostgreSQL database.
    __tablename__ = "teachers"

    # Every table needs a primary key — a unique ID for each row.
    # autoincrement means PostgreSQL assigns 1, 2, 3... automatically.
    id         = Column(Integer, primary_key=True, autoincrement=True)

    # Basic profile info
    name       = Column(String, nullable=False)       # full name
    email      = Column(String, unique=True, nullable=False)  # login email
    password   = Column(String, nullable=False)       # hashed password (never plain text)
    tsc_number = Column(String, unique=True)          # TSC registration number
    subject    = Column(String)                       # main subject e.g. Mathematics

    # Class teacher info
    is_class_teacher  = Column(Boolean, default=False)  # is this teacher a class teacher?
    assigned_class    = Column(String)                  # e.g. "Form 3 North"

    # Account status
    is_active  = Column(Boolean, default=True)        # False = account disabled
    role = Column(String, default="teacher")  # "teacher" or "admin"
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships — these let us access related data easily.
    # e.g. teacher.lesson_plans gives all lesson plans by this teacher.
    lesson_plans   = relationship("LessonPlan",   back_populates="teacher")
    attendances    = relationship("Attendance",   back_populates="teacher")
    assignments    = relationship("Assignment",   back_populates="teacher")
    records_of_work = relationship("RecordOfWork", back_populates="teacher")