# app/routes/admin/fees.py
# --------------------------
# Fee management routes.
# View collection summary, defaulters list.
# Fee structure setup coming when we build the Fee model.

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.teacher import Teacher
from app.models.student import Student
from app.routes.teacher import get_current_teacher

router = APIRouter(prefix="/api/admin/fees", tags=["Admin - Fees"])

def require_admin(teacher: Teacher = Depends(get_current_teacher)):
    if teacher.role != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    return teacher

# GET /api/admin/fees/summary
@router.get("/summary")
def get_fee_summary(
    admin: Teacher = Depends(require_admin),
    db:    Session = Depends(get_db)
):
    # TODO: Build full fee tracking when Fee model is ready
    # For now return structure placeholder
    total_students = db.query(Student).filter(Student.is_active == True).count()
    return {
        "total_students":   total_students,
        "term_target":      total_students * 45000,
        "collected":        0,
        "outstanding":      total_students * 45000,
        "collection_rate":  0,
        "message":          "Fee tracking coming soon — Fee model will be built next"
    }

# GET /api/admin/fees/defaulters
@router.get("/defaulters")
def get_defaulters(
    admin: Teacher = Depends(require_admin),
    db:    Session = Depends(get_db)
):
    # TODO: Return students with outstanding fees once Fee model is built
    students = db.query(Student).filter(Student.is_active == True).all()
    return {
        "total":     len(students),
        "defaulters": [],
        "message":   "Fee model coming soon"
    }