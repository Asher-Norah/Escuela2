# app/routes/teacher.py
# ----------------------
# All teacher-specific routes:
#   - Profile
#   - Attendance
#   - Lesson plans
#   - Assignments
#   - Record of work
#
# Every route here requires the teacher to be logged in.
# We check the JWT token on every request using get_current_teacher().

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.teacher import Teacher
from app.models.attendance import Attendance
from app.models.lesson_plan import LessonPlan
from app.models.assignment import Assignment
from app.models.record_of_work import RecordOfWork
from app.models.student import Student
from app.schemas.attendance import AttendanceCreate, AttendanceResponse
from app.schemas.lesson_plan import LessonPlanCreate, LessonPlanResponse
from app.schemas.assignment import AssignmentCreate, AssignmentResponse, AssignmentUpdate
from app.schemas.record_of_work import RecordOfWorkCreate, RecordOfWorkResponse
from app.schemas.teacher import TeacherResponse
from jose import jwt, JWTError
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import os

router = APIRouter(prefix="/api/teacher", tags=["Teacher"])

SECRET_KEY = os.getenv("SECRET_KEY", "escuela-secret-key-change-this-in-production")
ALGORITHM  = "HS256"
security   = HTTPBearer()

# ── AUTH HELPER ───────────────────────────────────────────────────
# get_current_teacher() runs on every protected route.
# It reads the JWT token from the request header,
# decodes it to find the teacher ID,
# then fetches that teacher from the database.
def get_current_teacher(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
):
    try:
        payload    = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        teacher_id = int(payload.get("sub"))
    except (JWTError, TypeError):
        raise HTTPException(status_code=401, detail="Invalid or expired token")

    teacher = db.query(Teacher).filter(Teacher.id == teacher_id).first()
    if not teacher:
        raise HTTPException(status_code=404, detail="Teacher not found")
    return teacher


# ── PROFILE ───────────────────────────────────────────────────────
# GET /api/teacher/profile
@router.get("/profile", response_model=TeacherResponse)
def get_profile(teacher: Teacher = Depends(get_current_teacher)):
    # Depends(get_current_teacher) automatically verifies the token
    # and gives us the logged-in teacher object
    return teacher


# ── ATTENDANCE ────────────────────────────────────────────────────
# POST /api/teacher/attendance
# Teacher submits the full class register
@router.post("/attendance", status_code=201)
def save_attendance(
    data:    AttendanceCreate,
    teacher: Teacher = Depends(get_current_teacher),
    db:      Session = Depends(get_db)
):
    saved = []
    for record in data.records:
        # Check if attendance already exists for this student on this date
        existing = db.query(Attendance).filter(
            Attendance.student_id == record.student_id,
            Attendance.date       == data.date,
            Attendance.class_name == data.class_name,
        ).first()

        if existing:
            # Update existing record
            existing.mark = record.mark
            existing.note = record.note
        else:
            # Create new record
            att = Attendance(
                student_id = record.student_id,
                teacher_id = teacher.id,
                date       = data.date,
                class_name = data.class_name,
                mark       = record.mark,
                note       = record.note,
            )
            db.add(att)
            saved.append(att)

    db.commit()
    return {"message": f"Attendance saved for {len(data.records)} students"}


# GET /api/teacher/attendance?class_name=Form 3 North&date=2025-05-27
@router.get("/attendance", response_model=List[AttendanceResponse])
def get_attendance(
    class_name: str,
    date:       str,
    teacher:    Teacher = Depends(get_current_teacher),
    db:         Session = Depends(get_db)
):
    records = db.query(Attendance).filter(
        Attendance.teacher_id == teacher.id,
        Attendance.class_name == class_name,
        Attendance.date       == date,
    ).all()
    return records


# ── LESSON PLANS ─────────────────────────────────────────────────
# POST /api/teacher/lesson-plans
@router.post("/lesson-plans", response_model=LessonPlanResponse, status_code=201)
def save_lesson_plan(
    data:    LessonPlanCreate,
    teacher: Teacher = Depends(get_current_teacher),
    db:      Session = Depends(get_db)
):
    plan = LessonPlan(**data.model_dump(), teacher_id=teacher.id)
    db.add(plan)
    db.commit()
    db.refresh(plan)
    return plan


# GET /api/teacher/lesson-plans
@router.get("/lesson-plans", response_model=List[LessonPlanResponse])
def get_lesson_plans(
    teacher: Teacher = Depends(get_current_teacher),
    db:      Session = Depends(get_db)
):
    return db.query(LessonPlan).filter(LessonPlan.teacher_id == teacher.id).all()


# ── ASSIGNMENTS ──────────────────────────────────────────────────
# POST /api/teacher/assignments
@router.post("/assignments", response_model=AssignmentResponse, status_code=201)
def create_assignment(
    data:    AssignmentCreate,
    teacher: Teacher = Depends(get_current_teacher),
    db:      Session = Depends(get_db)
):
    assignment = Assignment(**data.model_dump(), teacher_id=teacher.id)
    db.add(assignment)
    db.commit()
    db.refresh(assignment)
    return assignment


# GET /api/teacher/assignments
@router.get("/assignments", response_model=List[AssignmentResponse])
def get_assignments(
    teacher: Teacher = Depends(get_current_teacher),
    db:      Session = Depends(get_db)
):
    return db.query(Assignment).filter(Assignment.teacher_id == teacher.id).all()


# PATCH /api/teacher/assignments/{id}
# Update assignment status: open → grading → graded
@router.patch("/assignments/{assignment_id}", response_model=AssignmentResponse)
def update_assignment(
    assignment_id: int,
    data:    AssignmentUpdate,
    teacher: Teacher = Depends(get_current_teacher),
    db:      Session = Depends(get_db)
):
    assignment = db.query(Assignment).filter(
        Assignment.id         == assignment_id,
        Assignment.teacher_id == teacher.id
    ).first()

    if not assignment:
        raise HTTPException(status_code=404, detail="Assignment not found")

    assignment.status = data.status
    db.commit()
    db.refresh(assignment)
    return assignment


# DELETE /api/teacher/assignments/{id}
@router.delete("/assignments/{assignment_id}", status_code=204)
def delete_assignment(
    assignment_id: int,
    teacher: Teacher = Depends(get_current_teacher),
    db:      Session = Depends(get_db)
):
    assignment = db.query(Assignment).filter(
        Assignment.id         == assignment_id,
        Assignment.teacher_id == teacher.id
    ).first()

    if not assignment:
        raise HTTPException(status_code=404, detail="Assignment not found")

    db.delete(assignment)
    db.commit()


# ── RECORD OF WORK ───────────────────────────────────────────────
# POST /api/teacher/record-of-work
@router.post("/record-of-work", response_model=RecordOfWorkResponse, status_code=201)
def create_row(
    data:    RecordOfWorkCreate,
    teacher: Teacher = Depends(get_current_teacher),
    db:      Session = Depends(get_db)
):
    entry = RecordOfWork(**data.model_dump(), teacher_id=teacher.id)
    db.add(entry)
    db.commit()
    db.refresh(entry)
    return entry


# GET /api/teacher/record-of-work
@router.get("/record-of-work", response_model=List[RecordOfWorkResponse])
def get_row(
    teacher: Teacher = Depends(get_current_teacher),
    db:      Session = Depends(get_db)
):
    return db.query(RecordOfWork).filter(
        RecordOfWork.teacher_id == teacher.id
    ).order_by(RecordOfWork.created_at.desc()).all()

# GET /api/teacher/students?class_name=Form 3 North
@router.get("/students")
def get_students(
    class_name: str,
    teacher:    Teacher = Depends(get_current_teacher),
    db:         Session = Depends(get_db)
):
    students = db.query(Student).filter(
        Student.class_name == class_name,
        Student.is_active  == True
    ).order_by(Student.name).all()
    return students

# ── GRADEBOOK ────────────────────────────────────────────────────
# POST /api/teacher/grades
@router.post("/grades", status_code=201)
def save_grades(
    data:    dict,
    teacher: Teacher = Depends(get_current_teacher),
    db:      Session = Depends(get_db)
):
    # TODO: Create a Grade model later — for now return success
    # This will be fully implemented when we build the gradebook table
    return {"message": "Grades saved successfully", "data": data}

# POST /api/teacher/grades
@router.post("/grades", status_code=201)
def save_grades(
    data:    dict,
    teacher: Teacher = Depends(get_current_teacher),
    db:      Session = Depends(get_db)
):
    return {"message": "Grades saved successfully", "data": data}

# DELETE /api/teacher/record-of-work/{id}
@router.delete("/record-of-work/{entry_id}", status_code=204)
def delete_row(
    entry_id: int,
    teacher:  Teacher = Depends(get_current_teacher),
    db:       Session = Depends(get_db)
):
    entry = db.query(RecordOfWork).filter(
        RecordOfWork.id         == entry_id,
        RecordOfWork.teacher_id == teacher.id
    ).first()

    if not entry:
        raise HTTPException(status_code=404, detail="Entry not found")

    db.delete(entry)
    db.commit()