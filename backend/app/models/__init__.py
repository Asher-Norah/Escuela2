# app/models/__init__.py
# This file imports all models so SQLAlchemy can find them
# when creating the database tables.

from .teacher import Teacher
from .student import Student
from .attendance import Attendance
from .lesson_plan import LessonPlan
from .assignment import Assignment
from .record_of_work import RecordOfWork