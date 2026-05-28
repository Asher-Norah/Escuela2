# app/main.py
# ------------
# This is the entry point of the entire FastAPI application.
# It creates the app, connects all the routes,
# and creates the database tables on startup.

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from app.routes import auth, teacher

# Import all models so SQLAlchemy knows about them
# when creating tables
import app.models

# Create the FastAPI app
app = FastAPI(
    title="ESCUELA API",
    description="School Management System API",
    version="1.0.0"
)

# CORS — Cross Origin Resource Sharing.
# This allows our Next.js frontend (running on port 3000)
# to talk to our FastAPI backend (running on port 8000).
# Without this, the browser blocks the requests.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # frontend URL
    allow_credentials=True,
    allow_methods=["*"],     # allow GET, POST, PUT, DELETE etc.
    allow_headers=["*"],     # allow all headers
)

# Register our route files
# All auth routes will be at /api/auth/...
# All teacher routes will be at /api/teacher/...
app.include_router(auth.router)
app.include_router(teacher.router)

# Create all database tables on startup.
# SQLAlchemy reads all our models and creates the matching
# tables in PostgreSQL if they don't exist yet.
Base.metadata.create_all(bind=engine)

# Root endpoint — just confirms the API is running
@app.get("/")
def root():
    return {"message": "ESCUELA API is running 🎓"}