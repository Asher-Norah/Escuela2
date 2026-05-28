# app/routes/auth.py
# -------------------
# Authentication routes — login and register.
#
# When a teacher logs in:
# 1. We check their email and password against the database
# 2. If correct, we create a JWT token and send it back
# 3. The frontend stores this token and sends it with every request
# 4. This is how we know WHO is making each request
#
# JWT = JSON Web Token. It's like a temporary ID card.
# It contains the teacher's ID and expires after 24 hours.

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.teacher import Teacher
from app.schemas.teacher import TeacherCreate, TeacherLogin, TeacherResponse
import bcrypt as bcrypt_lib
from jose import jwt
from datetime import datetime, timedelta
import os

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

# CryptContext handles password hashing.
# We NEVER store plain text passwords — always hashed.
# bcrypt is the hashing algorithm — industry standard.


# SECRET_KEY is used to sign JWT tokens.
# Anyone with this key can create valid tokens — keep it secret!
SECRET_KEY = os.getenv("SECRET_KEY", "escuela-secret-key-change-this-in-production")
ALGORITHM  = "HS256"

def hash_password(password: str) -> str:
    salt = bcrypt_lib.gensalt()
    return bcrypt_lib.hashpw(password.encode('utf-8'), salt).decode('utf-8')

def verify_password(plain: str, hashed: str) -> bool:
    return bcrypt_lib.checkpw(plain.encode('utf-8'), hashed.encode('utf-8'))

def create_token(teacher_id: int) -> str:
    # Creates a JWT token that expires in 24 hours
    expires = datetime.utcnow() + timedelta(hours=24)
    payload = {"sub": str(teacher_id), "exp": expires}
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)


# ── REGISTER ──────────────────────────────────────────────────────
# POST /api/auth/register
# Creates a new teacher account
@router.post("/register", response_model=TeacherResponse, status_code=201)
def register(data: TeacherCreate, db: Session = Depends(get_db)):

    # Check if email already exists
    existing = db.query(Teacher).filter(Teacher.email == data.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    # Create new teacher with hashed password
    teacher = Teacher(
        name             = data.name,
        email            = data.email,
        password         = hash_password(data.password),
        tsc_number       = data.tsc_number,
        subject          = data.subject,
        is_class_teacher = data.is_class_teacher or False,
        assigned_class   = data.assigned_class,
    )
    db.add(teacher)       # add to session
    db.commit()           # save to database
    db.refresh(teacher)   # reload to get the auto-assigned ID
    return teacher


# ── LOGIN ─────────────────────────────────────────────────────────
# POST /api/auth/login
# Returns a JWT token if credentials are correct
@router.post("/login")
def login(data: TeacherLogin, db: Session = Depends(get_db)):

    # Find teacher by email
    teacher = db.query(Teacher).filter(Teacher.email == data.email).first()

    # verify_password checks plain password against stored hash
    if not teacher or not verify_password(data.password, teacher.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    if not teacher.is_active:
        raise HTTPException(status_code=403, detail="Account disabled")

    # Return the token — frontend stores this and sends it with every request
    return {
        "access_token": create_token(teacher.id),
        "token_type":   "bearer",
        "teacher": {
            "id":               teacher.id,
            "name":             teacher.name,
            "email":            teacher.email,
            "subject":          teacher.subject,
            "is_class_teacher": teacher.is_class_teacher,
            "assigned_class":   teacher.assigned_class,
        }
    }