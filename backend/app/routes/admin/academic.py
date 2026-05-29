# app/routes/admin/academic.py
# ------------------------------
# Academic performance routes.
# Class performance, subject performance,
# attendance reports per class.

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import Optional
from app.database import get_db
from app.models.teacher import Teacher
from app.models.student import Student
from app.models.attendance import Attendance
from app.routes.teacher import get_current_teacher

router = APIRouter(prefix="/api/admin/academic", tags=["Admin - Academic"])

def require_admin(teacher: Teacher = Depends(get_current_teacher)):
    if teacher.role != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    return teacher

# GET /api/admin/academic/attendance?class_name=Form 3 North&date=2025-05-28
@router.get("/attendance")
def get_attendance_report(
    class_name: Optional[str] = None,
    date:       Optional[str] = None,
    admin:      Teacher = Depends(require_admin),
    db:         Session = Depends(get_db)
):
    query = db.query(Attendance)
    if class_name: query = query.filter(Attendance.class_name == class_name)
    if date:       query = query.filter(Attendance.date == date)
    records = query.all()

    total   = len(records)
    present = len([r for r in records if r.mark == 'P'])
    absent  = len([r for r in records if r.mark == 'A'])
    late    = len([r for r in records if r.mark == 'L'])

    return {
        "total":    total,
        "present":  present,
        "absent":   absent,
        "late":     late,
        "rate":     round((present / total * 100), 1) if total > 0 else 0,
        "records":  [{"student_name": r.student_name, "adm_no": r.adm_no,
                      "mark": r.mark, "note": r.note, "date": str(r.date)} for r in records]
    }

# GET /api/admin/academic/attendance/summary
# Returns attendance rate per class
@router.get("/attendance/summary")
def get_attendance_summary(
    admin: Teacher = Depends(require_admin),
    db:    Session = Depends(get_db)
):
    records = db.query(Attendance).all()
    summary = {}
    for r in records:
        if r.class_name not in summary:
            summary[r.class_name] = {"total": 0, "present": 0}
        summary[r.class_name]["total"] += 1
        if r.mark == 'P':
            summary[r.class_name]["present"] += 1

    return [
        {
            "class_name": cls,
            "total":      data["total"],
            "present":    data["present"],
            "rate":       round((data["present"] / data["total"] * 100), 1) if data["total"] > 0 else 0
        }
        for cls, data in summary.items()
    ]