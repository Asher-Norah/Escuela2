# app/models/record_of_work.py

from sqlalchemy import Column, Integer, String, Date, ForeignKey, DateTime, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base

class RecordOfWork(Base):
    __tablename__ = "records_of_work"

    id         = Column(Integer, primary_key=True, autoincrement=True)
    teacher_id = Column(Integer, ForeignKey("teachers.id", ondelete="CASCADE"), nullable=False)
    class_name = Column(String, nullable=False)
    date       = Column(Date)
    time       = Column(String)
    topic      = Column(String, nullable=False)
    sub_topic  = Column(String)
    notes      = Column(Text)
    present    = Column(Integer)   # number present
    absent     = Column(Integer)   # number absent
    created_at = Column(DateTime, default=datetime.utcnow)

    teacher = relationship("Teacher", back_populates="records_of_work")