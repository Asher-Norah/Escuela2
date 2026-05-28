# app/schemas/teacher.py
# -----------------------
# Pydantic schemas for Teacher data.
#
# We have TWO types of schemas per resource:
#   - Create schemas: data coming IN (from frontend)
#   - Response schemas: data going OUT (to frontend)
#
# Why separate? Because we never send the password back to the frontend.
# The Response schema simply leaves it out.

from pydantic import BaseModel, EmailStr
from typing import Optional

# TeacherCreate — used when registering a new teacher.
# This is what the frontend sends in the request body.
class TeacherCreate(BaseModel):
    name:       str
    email:      EmailStr        # EmailStr auto-validates email format
    password:   str
    tsc_number: Optional[str] = None
    subject:    Optional[str] = None
    is_class_teacher: Optional[bool] = False
    assigned_class:   Optional[str]  = None

# TeacherLogin — used when a teacher logs in.
class TeacherLogin(BaseModel):
    email:    EmailStr
    password: str

# TeacherResponse — used when sending teacher data back to the frontend.
# Notice: no password field — we never expose it.
class TeacherResponse(BaseModel):
    id:         int
    name:       str
    email:      str
    tsc_number: Optional[str] = None
    subject:    Optional[str] = None
    is_class_teacher: bool
    assigned_class:   Optional[str] = None
    is_active:  bool

    # model_config tells Pydantic to read data from SQLAlchemy model
    # attributes instead of just plain dictionaries.
    model_config = {"from_attributes": True}