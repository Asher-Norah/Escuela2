# app/routes/admin/staff.py
# ---------------------------
# Admin routes for managing teaching staff.
# Add, view, edit, remove teachers.
# View teacher records of work and lesson plans.

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import Optional
from app.database import get_db
from app.models.teacher import Teacher
from app.models.record_of_work import RecordOfWork
from app.models.lesson_plan import LessonPlan
from app.routes.teacher import get_current_teacher
from app.routes.auth import hash_password
from pydantic import BaseModel, EmailStr

router = APIRouter(prefix="/api/admin/staff", tags=["Admin - Staff"])

def require_admin(teacher: Teacher = Depends(get_current_teacher)):
    if teacher.role != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    return teacher

class StaffCreate(BaseModel):
    name:             str
    email:            EmailStr
    password:         str
    tsc_number:       Optional[str] = None
    subject:          Optional[str] = None
    is_class_teacher: Optional[bool] = False
    assigned_class:   Optional[str] = None

class StaffUpdate(BaseModel):
    name:             Optional[str]  = None
    subject:          Optional[str]  = None
    is_class_teacher: Optional[bool] = None
    assigned_class:   Optional[str]  = None
    is_active:        Optional[bool] = None

# GET /api/admin/staff
@router.get("")
def get_all_staff(
    admin: Teacher = Depends(require_admin),
    db:    Session = Depends(get_db)
):
    return db.query(Teacher).filter(Teacher.role == "teacher").all()

# GET /api/admin/staff/{id}
@router.get("/{teacher_id}")
def get_staff_member(
    teacher_id: int,
    admin:      Teacher = Depends(require_admin),
    db:         Session = Depends(get_db)
):
    teacher = db.query(Teacher).filter(Teacher.id == teacher_id).first()
    if not teacher:
        raise HTTPException(status_code=404, detail="Teacher not found")
    return teacher

# POST /api/admin/staff — Add new teacher
@router.post("", status_code=201)
def add_teacher(
    data:  StaffCreate,
    admin: Teacher = Depends(require_admin),
    db:    Session = Depends(get_db)
):
    existing = db.query(Teacher).filter(Teacher.email == data.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    teacher = Teacher(
        name             = data.name,
        email            = data.email,
        password         = hash_password(data.password),
        tsc_number       = data.tsc_number,
        subject          = data.subject,
        is_class_teacher = data.is_class_teacher or False,
        assigned_class   = data.assigned_class,
        role             = "teacher",
        is_active        = True,
    )
    db.add(teacher)
    db.commit()
    db.refresh(teacher)
    return teacher

# PATCH /api/admin/staff/{id}
@router.patch("/{teacher_id}")
def update_teacher(
    teacher_id: int,
    data:       StaffUpdate,
    admin:      Teacher = Depends(require_admin),
    db:         Session = Depends(get_db)
):
    teacher = db.query(Teacher).filter(Teacher.id == teacher_id).first()
    if not teacher:
        raise HTTPException(status_code=404, detail="Teacher not found")

    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(teacher, field, value)

    db.commit()
    db.refresh(teacher)
    return teacher

# DELETE /api/admin/staff/{id} — soft delete
@router.delete("/{teacher_id}", status_code=204)
def remove_teacher(
    teacher_id: int,
    admin:      Teacher = Depends(require_admin),
    db:         Session = Depends(get_db)
):
    teacher = db.query(Teacher).filter(Teacher.id == teacher_id).first()
    if not teacher:
        raise HTTPException(status_code=404, detail="Teacher not found")
    teacher.is_active = False
    db.commit()

# GET /api/admin/staff/{id}/records-of-work
@router.get("/{teacher_id}/records-of-work")
def get_teacher_row(
    teacher_id: int,
    admin:      Teacher = Depends(require_admin),
    db:         Session = Depends(get_db)
):
    return db.query(RecordOfWork).filter(
        RecordOfWork.teacher_id == teacher_id
    ).order_by(RecordOfWork.created_at.desc()).all()

# GET /api/admin/staff/{id}/lesson-plans
@router.get("/{teacher_id}/lesson-plans")
def get_teacher_lesson_plans(
    teacher_id: int,
    admin:      Teacher = Depends(require_admin),
    db:         Session = Depends(get_db)
):
    return db.query(LessonPlan).filter(
        LessonPlan.teacher_id == teacher_id
    ).order_by(LessonPlan.created_at.desc()).all()