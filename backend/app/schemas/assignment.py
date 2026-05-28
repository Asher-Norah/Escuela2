# app/schemas/assignment.py

from pydantic import BaseModel
from typing import Optional
from datetime import date

class AssignmentCreate(BaseModel):
    title:       str
    class_name:  str
    due_date:    Optional[date] = None
    description: Optional[str] = None
    total_marks: Optional[int] = None
    attachment:  Optional[str] = None   # file URL after upload

# AssignmentUpdate — for changing status (open → grading → graded)
class AssignmentUpdate(BaseModel):
    status: str    # "open" | "grading" | "graded"

class AssignmentResponse(AssignmentCreate):
    id:         int
    teacher_id: int
    status:     str

    model_config = {"from_attributes": True}