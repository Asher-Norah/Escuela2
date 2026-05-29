# app/routes/admin/dashboard.py
# --------------------------------
# Admin dashboard routes.
# Returns school-wide stats for the admin dashboard:
# - Total students, teachers, attendance rate, fee collection
# - School health score
# - Recent activity

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.teacher import Teacher
from app.models.student import Student
from app.models.attendance import Attendance
from app.models.assignment import Assignment
from app.routes.teacher import get_current_teacher
from datetime import date

router = APIRouter(prefix="/api/admin", tags=["Admin"])

# Helper — checks if logged in user is admin
def require_admin(teacher: Teacher = Depends(get_current_teacher)):
    if teacher.role != "admin":
        from fastapi import HTTPException
        raise HTTPException(status_code=403, detail="Admin access required")
    return teacher

# GET /api/admin/dashboard
@router.get("/dashboard")
def get_dashboard(
    admin: Teacher = Depends(require_admin),
    db:    Session = Depends(get_db)
):
    total_students = db.query(Student).filter(Student.is_active == True).count()
    total_teachers = db.query(Teacher).filter(
        Teacher.is_active == True,
        Teacher.role == "teacher"
    ).count()

    # Attendance rate today
    today = date.today()
    today_records = db.query(Attendance).filter(Attendance.date == today).all()
    if today_records:
        present = len([r for r in today_records if r.mark == 'P'])
        att_rate = round((present / len(today_records)) * 100, 1)
    else:
        att_rate = 0

    # Students per class
    from sqlalchemy import func
    class_counts = db.query(
        Student.class_name,
        func.count(Student.id).label('count')
    ).filter(Student.is_active == True).group_by(Student.class_name).all()

    return {
        "total_students":   total_students,
        "total_teachers":   total_teachers,
        "attendance_rate":  att_rate,
        "students_by_class": [{"class_name": c.class_name, "count": c.count} for c in class_counts],
    }