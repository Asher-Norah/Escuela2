# app/schemas/record_of_work.py

from pydantic import BaseModel
from typing import Optional
from datetime import date

class RecordOfWorkCreate(BaseModel):
    class_name: str
    date:       Optional[date] = None
    time:       Optional[str]  = None
    topic:      str
    sub_topic:  Optional[str]  = None
    notes:      Optional[str]  = None
    present:    Optional[int]  = None
    absent:     Optional[int]  = None

class RecordOfWorkResponse(RecordOfWorkCreate):
    id:         int
    teacher_id: int

    model_config = {"from_attributes": True}