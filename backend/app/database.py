# app/database.py
# ----------------
# This file connects our FastAPI app to the PostgreSQL database.
#
# SQLAlchemy is the library we use to talk to the database.
# Instead of writing raw SQL like "SELECT * FROM students",
# we write Python code and SQLAlchemy translates it to SQL for us.

from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv
import os

# load_dotenv() reads our .env file and loads the variables inside it.
# This keeps sensitive info like passwords OUT of our code.
load_dotenv()

# DATABASE_URL is the connection string to our PostgreSQL database.
# It looks like: postgresql://username:password@host/database_name
# We store it in .env so it's never exposed in our code.
DATABASE_URL = os.getenv("DATABASE_URL")

# create_engine() creates the actual connection to the database.
# Think of it as opening a phone line to PostgreSQL.
engine = create_engine(DATABASE_URL)

# SessionLocal is a factory that creates database sessions.
# A session is like a conversation with the database —
# you open it, do your work, then close it.
SessionLocal = sessionmaker(
    autocommit=False,  # don't save changes automatically
    autoflush=False,   # don't send queries automatically
    bind=engine        # use our database connection
)

# Base is the parent class all our database models will inherit from.
# When we create a model like "class Student(Base)", SQLAlchemy
# knows it represents a table in the database.
Base = declarative_base()

# get_db() is a helper function used in every API route.
# It opens a database session, gives it to the route to use,
# then closes it when the route is done — even if an error occurs.
# The 'yield' keyword is what makes this work (it's a generator).
def get_db():
    db = SessionLocal()
    try:
        yield db        # give the session to whoever called this
    finally:
        db.close()      # always close the session when done