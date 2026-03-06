from database import init_db, SessionLocal, Donor, User, DonationHistory
from datetime import datetime, timedelta
import uuid
from auth import hash_password

def create_sample_donors():
    """Create sample donors for testing"""
    db = SessionLocal()
    
    # Delete existing data to start fresh
    db.query(DonationHistory).delete()
    db.query(Donor).delete()
    db.query(User).delete()
    db.commit()
    
    print("Creating sample users and donors around Dehradun (30.1065, 78.2923)...")
    
    # Sample location: 30.106523810252916, 78.29225551077595
    base_lat = 30.106523810252916
    base_lon = 78.29225551077595
    
    # Create 3 sample donors with corresponding user accounts
    sample_data = [
        {
            "user_email": "user1@test.com",
            "user_name": "User1",
            "password": "12345678",
            "blood_type": "O+",
            "age": 28,
            "weight": 75.5,
            "phone": "+91-9876543201",
            "address": "Clock Tower, Dehradun, Uttarakhand",
            "latitude": base_lat + 0.005,  # ~0.5 km north
            "longitude": base_lon + 0.003,
            "aadhaar": "1234-5678-9012",
            "total_donations": 5,
            "last_donation": 90
        },
        {
            "user_email": "user2@test.com",
            "user_name": "User2",
            "password": "12345678",
            "blood_type": "A+",
            "age": 32,
            "weight": 68.0,
            "phone": "+91-9876543202",
            "address": "Rajpur Road, Dehradun, Uttarakhand",
            "latitude": base_lat - 0.004,  # ~0.4 km south
            "longitude": base_lon + 0.006,
            "aadhaar": "2345-6789-0123",
            "total_donations": 3,
            "last_donation": 120
        },
        {
            "user_email": "user3@test.com",
            "user_name": "User3",
            "password": "12345678",
            "blood_type": "B+",
            "age": 25,
            "weight": 70.0,
            "phone": "+91-9876543203",
            "address": "Paltan Bazaar, Dehradun, Uttarakhand",
            "latitude": base_lat + 0.002,
            "longitude": base_lon - 0.005,  # ~0.5 km west
            "aadhaar": "3456-7890-1234",
            "total_donations": 7,
            "last_donation": 60
        }
    ]
    
    for data in sample_data:
        # Create user account
        user_id = str(uuid.uuid4())
        donor_id = str(uuid.uuid4())
        
        user = User(
            id=user_id,
            email=data["user_email"],
            full_name=data["user_name"],
            password_hash=hash_password(data["password"]),
            aadhaar_number=data["aadhaar"],
            is_donor=1,
            donor_id=donor_id,
            is_admin=0,
            created_at=datetime.now(),
            last_login=datetime.now()
        )
        db.add(user)
        
        # Create donor profile
        donor = Donor(
            id=donor_id,
            name=data["user_name"],
            email=data["user_email"],
            phone=data["phone"],
            blood_type=data["blood_type"],
            age=data["age"],
            weight=data["weight"],
            address=data["address"],
            latitude=data["latitude"],
            longitude=data["longitude"],
            last_donation_date=(datetime.now() - timedelta(days=data["last_donation"])).strftime("%Y-%m-%d"),
            total_donations=data["total_donations"],
            aadhaar_number=data["aadhaar"],
            user_id=user_id,
            registered_at=datetime.now()
        )
        db.add(donor)
        
        # Create donation history
        for i in range(data["total_donations"]):
            days_ago = data["last_donation"] + (i * 90)  # Every 90 days
            donation = DonationHistory(
                id=str(uuid.uuid4()),
                donor_id=donor_id,
                donation_date=datetime.now() - timedelta(days=days_ago),
                blood_type=data["blood_type"],
                units_donated=1.0,
                hospital_name=f"Sample Hospital {i+1}",
                notes=f"Donation #{i+1}",
                created_at=datetime.now() - timedelta(days=days_ago)
            )
            db.add(donation)
    
    # Create admin user
    admin_id = str(uuid.uuid4())
    admin = User(
        id=admin_id,
        email="admin123@test.com",
        full_name="Admin",
        password_hash=hash_password("12345678"),
        is_donor=0,
        is_admin=1,
        created_at=datetime.now(),
        last_login=datetime.now()
    )
    db.add(admin)
    
    db.commit()
    
    print("\nSample Users Created:")
    print("-" * 80)
    print("DONORS:")
    for data in sample_data:
        print(f"  Email: {data['user_email']} | Password: {data['password']} | Name: {data['user_name']} | Blood: {data['blood_type']}")
    print("\nADMIN:")
    print(f"  Email: admin123@test.com | Password: 12345678 | Name: Admin")
    print("-" * 80)
    print(f"\nLocation: Latitude {base_lat}, Longitude {base_lon}")
    print("Search in this area to see all 3 sample donors!")
    
    db.close()

if __name__ == "__main__":
    print("Initializing database...")
    init_db()
    print("Database initialized!")
    
    print("\nCreating sample donors...")
    create_sample_donors()
    
    print("\nSetup complete!")
