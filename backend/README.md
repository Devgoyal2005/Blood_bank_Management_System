# Backend Run Instructions

## Setup

1. Create and activate virtual environment:
```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate

# Linux/Mac
source venv/bin/activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Initialize database with sample data:
```bash
python init_db.py
```

This will:
- Create the SQLite database (`blood_bank.db`)
- Create all necessary tables
- Populate with 10 sample donors around NYC

4. Run the server:
```bash
python main.py
```

Server will be available at: http://localhost:8000

## API Documentation

Once the server is running, visit:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Sample Data

The database includes 10 sample donors with various blood types located around New York City:
- John Smith (O+) - Broadway, NY
- Sarah Johnson (A+) - 5th Avenue, NY
- Michael Brown (B+) - Park Avenue, NY
- Emily Davis (AB+) - Madison Avenue, NY
- David Wilson (O-) - Lexington Avenue, NY
- And 5 more...

Use coordinates around NYC (40.7128, -74.0060) to test the blood request feature!
