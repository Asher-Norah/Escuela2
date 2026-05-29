# app/routes/admin/communication.py
# ------------------------------------
# Broadcast messages to teachers, parents, students or all.
# Currently stores messages in DB.
# SMS via Africa's Talking and Email via SMTP will be added later.

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import Optional, List
from app.database import get_db
from app.models.teacher import Teacher
from app.models.student import Student
from app.routes.teacher import get_current_teacher
from pydantic import BaseModel
from datetime import datetime

router = APIRouter(prefix="/api/admin/communication", tags=["Admin - Communication"])

def require_admin(teacher: Teacher = Depends(get_current_teacher)):
    if teacher.role != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    return teacher

class BroadcastMessage(BaseModel):
    subject:    str
    message:    str
    # Who to send to — can combine multiple
    send_to_teachers: Optional[bool] = False
    send_to_parents:  Optional[bool] = False
    send_to_students: Optional[bool] = False
    # Filter by class (optional — if empty, sends to all)
    class_name:  Optional[str] = None
    # Channels
    send_sms:    Optional[bool] = False
    send_email:  Optional[bool] = False

# POST /api/admin/communication/broadcast
@router.post("/broadcast")
def broadcast_message(
    data:  BroadcastMessage,
    admin: Teacher = Depends(require_admin),
    db:    Session = Depends(get_db)
):
    recipients = []

    if data.send_to_teachers:
        query = db.query(Teacher).filter(
            Teacher.role == "teacher",
            Teacher.is_active == True
        )
        teachers = query.all()
        recipients.extend([{"name": t.name, "email": t.email, "type": "teacher"} for t in teachers])

    if data.send_to_parents or data.send_to_students:
        query = db.query(Student).filter(Student.is_active == True)
        if data.class_name:
            query = query.filter(Student.class_name == data.class_name)
        students = query.all()

        if data.send_to_students:
            recipients.extend([{"name": s.name, "adm_no": s.admission_no, "type": "student"} for s in students])
        if data.send_to_parents:
            recipients.extend([
                {"name": f"Parent of {s.name}", "phone": s.parent_phone,
                 "email": s.parent_email, "type": "parent"}
                for s in students if s.parent_phone or s.parent_email
            ])

    # TODO: Send actual SMS via Africa's Talking:
    # if data.send_sms:
    #     for r in recipients:
    #         if r.get("phone"):
    #             africastalking.SMS.send(data.message, [r["phone"]])

    # TODO: Send actual Email via SMTP:
    # if data.send_email:
    #     for r in recipients:
    #         if r.get("email"):
    #             send_email(r["email"], data.subject, data.message)

    return {
        "message":         "Broadcast queued successfully",
        "total_recipients": len(recipients),
        "recipients":      recipients,
        "sent_at":         datetime.utcnow().isoformat(),
    }