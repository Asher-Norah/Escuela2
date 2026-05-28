# app/schemas/attendance.py

from pydantic import BaseModel
from typing import Optional, List
from datetime import date

# One attendance record for one student
class AttendanceRecord(BaseModel):
    student_id: int
    mark:       str        # must be "P", "A", or "L"
    note:       Optional[str] = None   # absence reason

# AttendanceCreate — teacher submits the full class register at once.
# It's a list of records, one per student.
class AttendanceCreate(BaseModel):
    class_name: str
    date:       date
    records:    List[AttendanceRecord]   # e.g. 38 records for Form 3 North

# AttendanceResponse — what we send back after saving
class AttendanceResponse(BaseModel):
    id:         int
    student_id: int
    class_name: str
    date:       date
    mark:       str
    note:       Optional[str] = None

    model_config = {"from_attributes": True}