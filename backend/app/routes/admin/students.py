# app/routes/admin/students.py
# ------------------------------
# Admin routes for managing students.
# Enroll, view, edit, delete, filter by class/stream.
# View student medical records.

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import Optional, List
from app.database import get_db
from app.models.student import Student
from app.models.teacher import Teacher
from app.routes.teacher import get_current_teacher
from pydantic import BaseModel
from datetime import date

router = APIRouter(prefix="/api/admin/students", tags=["Admin - Students"])

def require_admin(teacher: Teacher = Depends(get_current_teacher)):
    if teacher.role != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    return teacher

# ── SCHEMAS ────────────────────────────────────────────────────────
class StudentCreate(BaseModel):
    name:          str
    admission_no:  str
    class_name:    str
    stream:        Optional[str]  = None
    gender:        Optional[str]  = None
    date_of_birth: Optional[date] = None
    parent_phone:  Optional[str]  = None
    parent_email:  Optional[str]  = None
    # Medical info
    blood_type:    Optional[str]  = None
    allergies:     Optional[str]  = None
    medical_notes: Optional[str]  = None

class StudentUpdate(BaseModel):
    name:          Optional[str]  = None
    class_name:    Optional[str]  = None
    stream:        Optional[str]  = None
    parent_phone:  Optional[str]  = None
    parent_email:  Optional[str]  = None
    is_active:     Optional[bool] = None
    blood_type:    Optional[str]  = None
    allergies:     Optional[str]  = None
    medical_notes: Optional[str]  = None

# ── GET ALL STUDENTS ───────────────────────────────────────────────
# GET /api/admin/students?class_name=Form 3 North&stream=North
@router.get("")
def get_students(
    class_name: Optional[str] = None,
    stream:     Optional[str] = None,
    gender:     Optional[str] = None,
    is_active:  Optional[bool] = True,
    admin:      Teacher = Depends(require_admin),
    db:         Session = Depends(get_db)
):
    query = db.query(Student)

    if class_name: query = query.filter(Student.class_name == class_name)
    if stream:     query = query.filter(Student.stream == stream)
    if gender:     query = query.filter(Student.gender == gender)
    if is_active is not None:
        query = query.filter(Student.is_active == is_active)

    return query.order_by(Student.class_name, Student.name).all()


# ── GET SINGLE STUDENT ─────────────────────────────────────────────
# GET /api/admin/students/{id}
@router.get("/{student_id}")
def get_student(
    student_id: int,
    admin:      Teacher = Depends(require_admin),
    db:         Session = Depends(get_db)
):
    student = db.query(Student).filter(Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    return student


# ── ENROLL STUDENT ─────────────────────────────────────────────────
# POST /api/admin/students
@router.post("", status_code=201)
def enroll_student(
    data:  StudentCreate,
    admin: Teacher = Depends(require_admin),
    db:    Session = Depends(get_db)
):
    # Check admission number is unique
    existing = db.query(Student).filter(Student.admission_no == data.admission_no).first()
    if existing:
        raise HTTPException(status_code=400, detail="Admission number already exists")

    student = Student(
        name          = data.name,
        admission_no  = data.admission_no,
        class_name    = data.class_name,
        stream        = data.stream,
        gender        = data.gender,
        date_of_birth = data.date_of_birth,
        parent_phone  = data.parent_phone,
        parent_email  = data.parent_email,
        is_active     = True,
    )
    db.add(student)
    db.commit()
    db.refresh(student)
    return student


# ── UPDATE STUDENT ─────────────────────────────────────────────────
# PATCH /api/admin/students/{id}
@router.patch("/{student_id}")
def update_student(
    student_id: int,
    data:       StudentUpdate,
    admin:      Teacher = Depends(require_admin),
    db:         Session = Depends(get_db)
):
    student = db.query(Student).filter(Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    # Only update fields that were provided
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(student, field, value)

    db.commit()
    db.refresh(student)
    return student


# ── DELETE / WITHDRAW STUDENT ──────────────────────────────────────
# DELETE /api/admin/students/{id}
@router.delete("/{student_id}", status_code=204)
def withdraw_student(
    student_id: int,
    admin:      Teacher = Depends(require_admin),
    db:         Session = Depends(get_db)
):
    student = db.query(Student).filter(Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    # Soft delete — mark as inactive instead of deleting
    # This preserves all attendance and grade history
    student.is_active = False
    db.commit()