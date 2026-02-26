from fastapi import FastAPI, UploadFile, File, Form, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime
from sqlalchemy.orm import Session
import math
import uuid
import os

from database import init_db, get_db, Donor, BloodRequest as BloodRequestModel

app = FastAPI(title="Blood Bank Management System")

# Initialize database on startup
@app.on_event("startup")
def startup_event():
    init_db()
    print("Database initialized!")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models
class DonorRegistration(BaseModel):
    name: str
    email: EmailStr
    phone: str
    blood_type: str
    age: int
    weight: float
    address: str
    latitude: float
    longitude: float
    last_donation_date: Optional[str] = None
    medical_conditions: Optional[str] = None

class BloodRequest(BaseModel):
    patient_name: str
    hospital_name: str
    blood_type: str
    units_needed: int
    urgency: str
    contact_phone: str
    contact_email: EmailStr
    latitude: float
    longitude: float
    additional_info: Optional[str] = None

class DonorResponse(BaseModel):
    id: str
    name: str
    blood_type: str
    phone: str
    email: str
    latitude: float
    longitude: float
    distance: Optional[float] = None

# Helper function to calculate distance between two coordinates
def calculate_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Calculate distance in kilometers using Haversine formula"""
    R = 6371  # Earth's radius in kilometers
    
    lat1_rad = math.radians(lat1)
    lat2_rad = math.radians(lat2)
    delta_lat = math.radians(lat2 - lat1)
    delta_lon = math.radians(lon2 - lon1)
    
    a = math.sin(delta_lat / 2) ** 2 + math.cos(lat1_rad) * math.cos(lat2_rad) * math.sin(delta_lon / 2) ** 2
    c = 2 * math.asin(math.sqrt(a))
    
    return R * c

@app.get("/")
def read_root():
    return {"message": "Blood Bank Management System API"}

@app.post("/api/donors/register")
async def register_donor(donor: DonorRegistration, db: Session = Depends(get_db)):
    """Register a new blood donor"""
    # Check if email already exists
    existing_donor = db.query(Donor).filter(Donor.email == donor.email).first()
    if existing_donor:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    donor_id = str(uuid.uuid4())
    
    new_donor = Donor(
        id=donor_id,
        name=donor.name,
        email=donor.email,
        phone=donor.phone,
        blood_type=donor.blood_type,
        age=donor.age,
        weight=donor.weight,
        address=donor.address,
        latitude=donor.latitude,
        longitude=donor.longitude,
        last_donation_date=donor.last_donation_date,
        medical_conditions=donor.medical_conditions,
        registered_at=datetime.now()
    )
    
    db.add(new_donor)
    db.commit()
    db.refresh(new_donor)
    
    return {
        "success": True,
        "message": "Donor registered successfully",
        "donor_id": donor_id
    }

@app.get("/api/donors")
def get_all_donors(db: Session = Depends(get_db)):
    """Get all registered donors"""
    donors = db.query(Donor).all()
    donors_list = [
        {
            "id": donor.id,
            "name": donor.name,
            "email": donor.email,
            "phone": donor.phone,
            "blood_type": donor.blood_type,
            "age": donor.age,
            "weight": donor.weight,
            "address": donor.address,
            "latitude": donor.latitude,
            "longitude": donor.longitude,
            "last_donation_date": donor.last_donation_date,
            "medical_conditions": donor.medical_conditions,
            "registered_at": donor.registered_at.isoformat() if donor.registered_at else None
        }
        for donor in donors
    ]
    return {"donors": donors_list}

@app.get("/api/donors/nearby")
def get_nearby_donors(
    latitude: float,
    longitude: float,
    max_distance: float = 50.0,
    db: Session = Depends(get_db)
):
    """Get all nearby donors regardless of blood type"""
    nearby_donors = []
    
    # Query all donors from database
    donors = db.query(Donor).all()
    
    for donor in donors:
        distance = calculate_distance(
            latitude, longitude,
            donor.latitude, donor.longitude
        )
        
        if distance <= max_distance:
            nearby_donors.append({
                "id": donor.id,
                "name": donor.name,
                "blood_type": donor.blood_type,
                "phone": donor.phone,
                "email": donor.email,
                "address": donor.address,
                "latitude": donor.latitude,
                "longitude": donor.longitude,
                "distance": round(distance, 2)
            })
    
    # Sort by distance
    nearby_donors.sort(key=lambda x: x["distance"])
    
    return {"donors": nearby_donors, "total": len(nearby_donors)}

@app.post("/api/blood-requests")
async def create_blood_request(
    patient_name: str = Form(...),
    hospital_name: str = Form(...),
    blood_type: str = Form(...),
    units_needed: int = Form(...),
    urgency: str = Form(...),
    contact_phone: str = Form(...),
    contact_email: str = Form(...),
    latitude: float = Form(...),
    longitude: float = Form(...),
    additional_info: Optional[str] = Form(None),
    proof_document: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    """Create a new blood request with proof document"""
    request_id = str(uuid.uuid4())
    
    # Save uploaded file
    upload_dir = "uploads/blood_requests"
    os.makedirs(upload_dir, exist_ok=True)
    file_extension = proof_document.filename.split(".")[-1]
    file_path = os.path.join(upload_dir, f"{request_id}.{file_extension}")
    
    with open(file_path, "wb") as f:
        content = await proof_document.read()
        f.write(content)
    
    new_request = BloodRequestModel(
        id=request_id,
        patient_name=patient_name,
        hospital_name=hospital_name,
        blood_type=blood_type,
        units_needed=units_needed,
        urgency=urgency,
        contact_phone=contact_phone,
        contact_email=contact_email,
        latitude=latitude,
        longitude=longitude,
        additional_info=additional_info,
        proof_document_path=file_path,
        status="pending",
        created_at=datetime.now()
    )
    
    db.add(new_request)
    db.commit()
    db.refresh(new_request)
    
    # Find nearest donors
    nearest_donors = find_nearest_donors(blood_type, latitude, longitude, db)
    
    return {
        "success": True,
        "message": "Blood request created successfully",
        "request_id": request_id,
        "nearest_donors": nearest_donors
    }

@app.get("/api/blood-requests/{blood_type}/nearest-donors")
def get_nearest_donors(
    blood_type: str,
    latitude: float,
    longitude: float,
    max_distance: float = 50.0,
    db: Session = Depends(get_db)
):
    """Find nearest donors for a specific blood type"""
    nearest_donors = find_nearest_donors(blood_type, latitude, longitude, db, max_distance)
    return {"donors": nearest_donors}

def find_nearest_donors(
    blood_type: str,
    latitude: float,
    longitude: float,
    db: Session,
    max_distance: float = 50.0
) -> List[DonorResponse]:
    """Helper function to find nearest donors"""
    matching_donors = []
    
    # Blood type compatibility
    compatible_types = get_compatible_blood_types(blood_type)
    
    # Query donors from database
    donors = db.query(Donor).filter(Donor.blood_type.in_(compatible_types)).all()
    
    for donor in donors:
        distance = calculate_distance(
            latitude, longitude,
            donor.latitude, donor.longitude
        )
        
        if distance <= max_distance:
            matching_donors.append({
                "id": donor.id,
                "name": donor.name,
                "blood_type": donor.blood_type,
                "phone": donor.phone,
                "email": donor.email,
                "latitude": donor.latitude,
                "longitude": donor.longitude,
                "distance": round(distance, 2)
            })
    
    # Sort by distance
    matching_donors.sort(key=lambda x: x["distance"])
    
    return matching_donors

def get_compatible_blood_types(blood_type: str) -> List[str]:
    """Get compatible blood types for transfusion"""
    compatibility = {
        "A+": ["A+", "A-", "O+", "O-"],
        "A-": ["A-", "O-"],
        "B+": ["B+", "B-", "O+", "O-"],
        "B-": ["B-", "O-"],
        "AB+": ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
        "AB-": ["A-", "B-", "AB-", "O-"],
        "O+": ["O+", "O-"],
        "O-": ["O-"]
    }
    
    return compatibility.get(blood_type, [blood_type])

@app.get("/api/blood-requests")
def get_all_blood_requests(db: Session = Depends(get_db)):
    """Get all blood requests"""
    requests = db.query(BloodRequestModel).all()
    requests_list = [
        {
            "id": req.id,
            "patient_name": req.patient_name,
            "hospital_name": req.hospital_name,
            "blood_type": req.blood_type,
            "units_needed": req.units_needed,
            "urgency": req.urgency,
            "contact_phone": req.contact_phone,
            "contact_email": req.contact_email,
            "latitude": req.latitude,
            "longitude": req.longitude,
            "additional_info": req.additional_info,
            "status": req.status,
            "created_at": req.created_at.isoformat() if req.created_at else None
        }
        for req in requests
    ]
    return {"requests": requests_list}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
