# app/models/lesson_plan.py
# --------------------------
# Stores lesson preparation forms filled by teachers.

from sqlalchemy import Column, Integer, String, Date, ForeignKey, DateTime, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base

class LessonPlan(Base):
    __tablename__ = "lesson_plans"

    id         = Column(Integer, primary_key=True, autoincrement=True)
    teacher_id = Column(Integer, ForeignKey("teachers.id", ondelete="CASCADE"), nullable=False)

    # Lesson details — matches the fields in our frontend form
    date             = Column(Date)
    subject          = Column(String, nullable=False)
    class_name       = Column(String, nullable=False)
    time             = Column(String)
    duration         = Column(String)
    roll             = Column(Integer)           # number of students
    average_age      = Column(String)
    topic            = Column(String, nullable=False)
    sub_topic        = Column(String)
    objectives       = Column(Text)              # Text = long string (no length limit)
    references       = Column(Text)
    teaching_aids    = Column(Text)
    introduction     = Column(Text)
    teacher_activities = Column(Text)
    pupil_activities   = Column(Text)
    bb_plan          = Column(Text)              # blackboard plan
    remarks          = Column(Text)
    created_at       = Column(DateTime, default=datetime.utcnow)

    teacher = relationship("Teacher", back_populates="lesson_plans")