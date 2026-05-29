from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from app.routes import auth, teacher
from app.routes.admin import dashboard, students, staff, academic, communication, fees
import app.models

app = FastAPI(
    title="ESCUELA API",
    description="School Management System API",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Auth + Teacher routes
app.include_router(auth.router)
app.include_router(teacher.router)

# Admin routes
app.include_router(dashboard.router)
app.include_router(students.router)
app.include_router(staff.router)
app.include_router(academic.router)
app.include_router(communication.router)
app.include_router(fees.router)

Base.metadata.create_all(bind=engine)

@app.get("/")
def root():
    return {"message": "ESCUELA API is running 🎓"}