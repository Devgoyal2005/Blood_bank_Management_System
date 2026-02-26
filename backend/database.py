from sqlalchemy import create_engine, Column, String, Integer, Float, DateTime, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime
import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://neondb_owner:npg_F8AlpXVRI9ev@ep-jolly-unit-aib14abb-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require")

# Create engine without SQLite-specific connect_args
engine = create_engine(DATABASE_URL, pool_pre_ping=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class Donor(Base):
    __tablename__ = "donors"
    
    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False, index=True)
    phone = Column(String, nullable=False)
    blood_type = Column(String, nullable=False, index=True)
    age = Column(Integer, nullable=False)
    weight = Column(Float, nullable=False)
    address = Column(Text, nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    last_donation_date = Column(String, nullable=True)
    medical_conditions = Column(Text, nullable=True)
    registered_at = Column(DateTime, default=datetime.now)

class BloodRequest(Base):
    __tablename__ = "blood_requests"
    
    id = Column(String, primary_key=True, index=True)
    patient_name = Column(String, nullable=False)
    hospital_name = Column(String, nullable=False)
    blood_type = Column(String, nullable=False, index=True)
    units_needed = Column(Integer, nullable=False)
    urgency = Column(String, nullable=False)
    contact_phone = Column(String, nullable=False)
    contact_email = Column(String, nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    additional_info = Column(Text, nullable=True)
    proof_document_path = Column(String, nullable=False)
    status = Column(String, default="pending")
    created_at = Column(DateTime, default=datetime.now)

class NGOContact(Base):
    __tablename__ = "ngo_contacts"
    
    id = Column(String, primary_key=True, index=True)
    user_name = Column(String, nullable=False)
    user_email = Column(String, nullable=False)
    user_phone = Column(String, nullable=False)
    blood_type_needed = Column(String, nullable=True)
    urgency_level = Column(String, nullable=False)
    message = Column(Text, nullable=False)
    location = Column(String, nullable=True)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    status = Column(String, default="pending")
    created_at = Column(DateTime, default=datetime.now)

class User(Base):
    __tablename__ = "users"
    
    id = Column(String, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    full_name = Column(String, nullable=False)
    password_hash = Column(String, nullable=False)
    picture = Column(String, nullable=True)
    is_donor = Column(Integer, default=0)  # 0=not registered, 1=registered donor
    donor_id = Column(String, nullable=True)  # Link to Donor table if registered
    created_at = Column(DateTime, default=datetime.now)
    last_login = Column(DateTime, default=datetime.now)

def init_db():
    """Initialize database and create tables"""
    Base.metadata.create_all(bind=engine)

def get_db():
    """Get database session"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
