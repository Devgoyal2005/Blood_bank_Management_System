from database import init_db, SessionLocal, Donor
import uuid
from datetime import datetime, timedelta
import random

def create_sample_donors():
    """Create sample donors for testing"""
    db = SessionLocal()
    
    # Check if donors already exist
    existing_donors = db.query(Donor).count()
    if existing_donors > 0:
        print(f"Database already has {existing_donors} donors. Skipping sample data creation.")
        db.close()
        return
    
    # Sample locations around Dehradun/Rishikesh area (30.3275, 78.0325)
    sample_donors = [
        {
            "name": "Rajesh Kumar",
            "email": "rajesh.kumar@example.com",
            "phone": "+91-9876543210",
            "blood_type": "O+",
            "age": 28,
            "weight": 75.5,
            "address": "Clock Tower, Dehradun, Uttarakhand 248001",
            "latitude": 30.3165,
            "longitude": 78.0322,
            "last_donation_date": (datetime.now() - timedelta(days=90)).strftime("%Y-%m-%d")
        },
        {
            "name": "Priya Sharma",
            "email": "priya.sharma@example.com",
            "phone": "+91-9876543211",
            "blood_type": "A+",
            "age": 32,
            "weight": 62.0,
            "address": "Rajpur Road, Dehradun, Uttarakhand 248009",
            "latitude": 30.3398,
            "longitude": 78.0445,
            "last_donation_date": (datetime.now() - timedelta(days=120)).strftime("%Y-%m-%d")
        },
        {
            "name": "Amit Singh",
            "email": "amit.singh@example.com",
            "phone": "+91-9876543212",
            "blood_type": "B+",
            "age": 45,
            "weight": 85.0,
            "address": "Paltan Bazaar, Dehradun, Uttarakhand 248001",
            "latitude": 30.3255,
            "longitude": 78.0436,
            "last_donation_date": (datetime.now() - timedelta(days=60)).strftime("%Y-%m-%d")
        },
        {
            "name": "Neha Gupta",
            "email": "neha.gupta@example.com",
            "phone": "+91-9876543213",
            "blood_type": "AB+",
            "age": 29,
            "weight": 58.5,
            "address": "Sahastradhara Road, Dehradun, Uttarakhand 248001",
            "latitude": 30.3618,
            "longitude": 78.0832,
            "last_donation_date": (datetime.now() - timedelta(days=150)).strftime("%Y-%m-%d")
        },
        {
            "name": "Vikram Yadav",
            "email": "vikram.yadav@example.com",
            "phone": "+91-9876543214",
            "blood_type": "O-",
            "age": 38,
            "weight": 80.0,
            "address": "Mussoorie Road, Dehradun, Uttarakhand 248009",
            "latitude": 30.3255,
            "longitude": 78.0322,
            "last_donation_date": (datetime.now() - timedelta(days=100)).strftime("%Y-%m-%d")
        },
        {
            "name": "Anjali Verma",
            "email": "anjali.verma@example.com",
            "phone": "+91-9876543215",
            "blood_type": "A-",
            "age": 26,
            "weight": 55.0,
            "address": "GMS Road, Dehradun, Uttarakhand 248001",
            "latitude": 30.3186,
            "longitude": 78.0378,
            "last_donation_date": (datetime.now() - timedelta(days=80)).strftime("%Y-%m-%d")
        },
        {
            "name": "Sanjay Rawat",
            "email": "sanjay.rawat@example.com",
            "phone": "+91-9876543216",
            "blood_type": "B-",
            "age": 41,
            "weight": 90.5,
            "address": "EC Road, Dehradun, Uttarakhand 248001",
            "latitude": 30.3203,
            "longitude": 78.0294,
            "last_donation_date": (datetime.now() - timedelta(days=110)).strftime("%Y-%m-%d")
        },
        {
            "name": "Kavita Negi",
            "email": "kavita.negi@example.com",
            "phone": "+91-9876543217",
            "blood_type": "O+",
            "age": 34,
            "weight": 65.0,
            "address": "Haridwar Road, Dehradun, Uttarakhand 248001",
            "latitude": 30.2993,
            "longitude": 78.0190,
            "last_donation_date": (datetime.now() - timedelta(days=70)).strftime("%Y-%m-%d")
        },
        {
            "name": "Rohit Bisht",
            "email": "rohit.bisht@example.com",
            "phone": "+91-9876543218",
            "blood_type": "A+",
            "age": 50,
            "weight": 78.0,
            "address": "Ballupur, Dehradun, Uttarakhand 248001",
            "latitude": 30.3431,
            "longitude": 78.0569,
            "last_donation_date": (datetime.now() - timedelta(days=130)).strftime("%Y-%m-%d")
        },
        {
            "name": "Sunita Chauhan",
            "email": "sunita.chauhan@example.com",
            "phone": "+91-9876543219",
            "blood_type": "AB-",
            "age": 27,
            "weight": 60.0,
            "address": "Prem Nagar, Dehradun, Uttarakhand 248007",
            "latitude": 30.2863,
            "longitude": 78.0649,
            "last_donation_date": (datetime.now() - timedelta(days=95)).strftime("%Y-%m-%d")
        }
    ]
    
    try:
        for donor_data in sample_donors:
            donor = Donor(
                id=str(uuid.uuid4()),
                registered_at=datetime.now() - timedelta(days=random.randint(30, 365)),
                medical_conditions=None,
                **donor_data
            )
            db.add(donor)
        
        db.commit()
        print(f"Successfully created {len(sample_donors)} sample donors!")
        
        # Display created donors
        print("\nSample Donors Created (Dehradun/Rishikesh Area):")
        print("-" * 80)
        for donor_data in sample_donors:
            print(f"{donor_data['name']} | {donor_data['blood_type']} | {donor_data['address']}")
        print("-" * 80)
        print(f"\nLocation: Latitude 30.3275, Longitude 78.0325")
        print("Search in this area to see all sample donors!")
        
    except Exception as e:
        print(f"Error creating sample donors: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    print("Initializing database...")
    init_db()
    print("Database initialized!")
    
    print("\nCreating sample donors...")
    create_sample_donors()
    print("\nSetup complete!")
