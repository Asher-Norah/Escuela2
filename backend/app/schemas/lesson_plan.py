# app/schemas/lesson_plan.py

from pydantic import BaseModel
from typing import Optional
from datetime import date

class LessonPlanCreate(BaseModel):
    # All fields match our frontend form exactly
    date:               Optional[date]   = None
    subject:            str
    class_name:         str
    time:               Optional[str]    = None
    duration:           Optional[str]    = None
    roll:               Optional[int]    = None
    average_age:        Optional[str]    = None
    topic:              str
    sub_topic:          Optional[str]    = None
    objectives:         Optional[str]    = None
    references:         Optional[str]    = None
    teaching_aids:      Optional[str]    = None
    introduction:       Optional[str]    = None
    teacher_activities: Optional[str]    = None
    pupil_activities:   Optional[str]    = None
    bb_plan:            Optional[str]    = None
    remarks:            Optional[str]    = None

class LessonPlanResponse(LessonPlanCreate):
    id:         int
    teacher_id: int

    model_config = {"from_attributes": True}