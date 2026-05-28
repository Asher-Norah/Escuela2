# app/models/student.py
# ----------------------
# Represents the "students" table.

from sqlalchemy import Column, Integer, String, Date, Boolean, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base

class Student(Base):
    __tablename__ = "students"

    id           = Column(Integer, primary_key=True, autoincrement=True)
    name         = Column(String, nullable=False)
    admission_no = Column(String, unique=True, nullable=False)  # e.g. GFA/2022/0041
    class_name   = Column(String, nullable=False)               # e.g. Form 3 North
    stream       = Column(String)                               # e.g. North, South
    date_of_birth = Column(Date)
    gender       = Column(String)                               # Male / Female
    parent_phone  = Column(String)                              # for SMS alerts
    parent_email  = Column(String)
    is_active     = Column(Boolean, default=True)               # False = withdrawn
    created_at    = Column(DateTime, default=datetime.utcnow)

    # Relationships
    attendances = relationship("Attendance", back_populates="student")