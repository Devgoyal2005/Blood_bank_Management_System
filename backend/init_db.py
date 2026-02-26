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
    
    # Sample locations around New York City
    sample_donors = [
        {
            "name": "John Smith",
            "email": "john.smith@example.com",
            "phone": "+1-212-555-0101",
            "blood_type": "O+",
            "age": 28,
            "weight": 75.5,
            "address": "123 Broadway, New York, NY 10001",
            "latitude": 40.7589,
            "longitude": -73.9851,
            "last_donation_date": (datetime.now() - timedelta(days=90)).strftime("%Y-%m-%d")
        },
        {
            "name": "Sarah Johnson",
            "email": "sarah.j@example.com",
            "phone": "+1-212-555-0102",
            "blood_type": "A+",
            "age": 32,
            "weight": 62.0,
            "address": "456 5th Avenue, New York, NY 10018",
            "latitude": 40.7549,
            "longitude": -73.9840,
            "last_donation_date": (datetime.now() - timedelta(days=120)).strftime("%Y-%m-%d")
        },
        {
            "name": "Michael Brown",
            "email": "m.brown@example.com",
            "phone": "+1-212-555-0103",
            "blood_type": "B+",
            "age": 45,
            "weight": 85.0,
            "address": "789 Park Avenue, New York, NY 10021",
            "latitude": 40.7736,
            "longitude": -73.9566,
            "last_donation_date": (datetime.now() - timedelta(days=60)).strftime("%Y-%m-%d")
        },
        {
            "name": "Emily Davis",
            "email": "emily.davis@example.com",
            "phone": "+1-212-555-0104",
            "blood_type": "AB+",
            "age": 29,
            "weight": 58.5,
            "address": "321 Madison Avenue, New York, NY 10017",
            "latitude": 40.7527,
            "longitude": -73.9772,
            "last_donation_date": (datetime.now() - timedelta(days=150)).strftime("%Y-%m-%d")
        },
        {
            "name": "David Wilson",
            "email": "d.wilson@example.com",
            "phone": "+1-212-555-0105",
            "blood_type": "O-",
            "age": 38,
            "weight": 80.0,
            "address": "555 Lexington Avenue, New York, NY 10022",
            "latitude": 40.7580,
            "longitude": -73.9716,
            "last_donation_date": (datetime.now() - timedelta(days=100)).strftime("%Y-%m-%d")
        },
        {
            "name": "Jennifer Martinez",
            "email": "jen.martinez@example.com",
            "phone": "+1-212-555-0106",
            "blood_type": "A-",
            "age": 26,
            "weight": 55.0,
            "address": "789 Amsterdam Avenue, New York, NY 10025",
            "latitude": 40.7939,
            "longitude": -73.9720,
            "last_donation_date": (datetime.now() - timedelta(days=80)).strftime("%Y-%m-%d")
        },
        {
            "name": "Robert Taylor",
            "email": "r.taylor@example.com",
            "phone": "+1-212-555-0107",
            "blood_type": "B-",
            "age": 41,
            "weight": 90.5,
            "address": "234 West 42nd Street, New York, NY 10036",
            "latitude": 40.7577,
            "longitude": -73.9857,
            "last_donation_date": (datetime.now() - timedelta(days=110)).strftime("%Y-%m-%d")
        },
        {
            "name": "Lisa Anderson",
            "email": "lisa.anderson@example.com",
            "phone": "+1-212-555-0108",
            "blood_type": "O+",
            "age": 34,
            "weight": 65.0,
            "address": "678 Columbus Avenue, New York, NY 10024",
            "latitude": 40.7789,
            "longitude": -73.9759,
            "last_donation_date": (datetime.now() - timedelta(days=70)).strftime("%Y-%m-%d")
        },
        {
            "name": "James Thomas",
            "email": "james.thomas@example.com",
            "phone": "+1-212-555-0109",
            "blood_type": "A+",
            "age": 50,
            "weight": 78.0,
            "address": "890 Broadway, Brooklyn, NY 11211",
            "latitude": 40.7081,
            "longitude": -73.9571,
            "last_donation_date": (datetime.now() - timedelta(days=130)).strftime("%Y-%m-%d")
        },
        {
            "name": "Maria Garcia",
            "email": "maria.garcia@example.com",
            "phone": "+1-212-555-0110",
            "blood_type": "AB-",
            "age": 27,
            "weight": 60.0,
            "address": "145 Court Street, Brooklyn, NY 11201",
            "latitude": 40.6909,
            "longitude": -73.9923,
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
        print("\nSample Donors Created:")
        print("-" * 80)
        for donor_data in sample_donors:
            print(f"{donor_data['name']} | {donor_data['blood_type']} | {donor_data['address']}")
        print("-" * 80)
        
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
