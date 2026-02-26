# Blood Bank Management System

A comprehensive blood donation and blood bank management system built with React.js frontend and FastAPI backend.

## Features

- 🩸 **Donor Registration**: Users can register as blood donors with their details and location
- 🏥 **Blood Request System**: Request blood with proof upload and location
- 🗺️ **Leaflet Maps Integration**: Track and locate nearest donors on an interactive map (completely free!)
- 📍 **Location-Based Matching**: Find compatible donors based on blood type and proximity
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile devices
- 💾 **SQLite Database**: Persistent storage for donors and blood requests

## Tech Stack

### Frontend
- React.js
- React Router
- Axios
- React Toastify
- Leaflet + React-Leaflet (OpenStreetMap - Free!)

### Backend
- FastAPI
- Python 3.8+
- SQLAlchemy
- SQLite Database
- Pydantic
- Uvicorn

## Prerequisites

- Node.js (v14 or higher)
- Python 3.8 or higher

## Installation

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment:
```bash
python -m venv venv
```

3. Activate the virtual environment:
```bash
# Windows
venv\Scripts\activate

# Linux/Mac
source venv/bin/activate
```

4. Install dependencies:
```bash
pip install -r requirements.txt
```

5. Run the FastAPI server:
```bash
python main.py
```

6. Initialize the database with sample donors:
```bash
python init_db.py
```

The backend will run on `http://localhost:8000`

**Sample Donors Created:**
The database will be populated with 10 sample donors around New York City area with different blood types for testing.

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The frontend will run on `http://localhost:3000`

**No API keys required!** The map uses OpenStreetMap which is completely free.

## Usage

### Register as a Donor

1. Click on "Become a Donor" in the navigation
2. Fill in your personal details
3. Use "Use Current Location" or manually enter coordinates
4. Submit the registration form

### Request Blood

1. Click on "Request Blood" in the navigation
2. Enter patient and hospital details
3. Select blood type and urgency level
4. Upload proof document (medical certificate, prescription, etc.)
5. Use "Use Current Location" or manually enter coordinates
6. Submit the request
7. View nearest donors on the interactive map

## API Endpoints

### Donor Registration
- **POST** `/api/donors/register`
  - Register a new blood donor

### Blood Requests
- **POST** `/api/blood-requests`
  - Create a new blood request with proof document upload

### Get Nearest Donors
- **GET** `/api/blood-requests/{blood_type}/nearest-donors`
  - Find nearest donors based on blood type and location

### View All Donors
- **GET** `/api/donors`
  - Get all registered donors

## Blood Type Compatibility

The system automatically matches compatible blood types:

- **A+**: Can receive from A+, A-, O+, O-
- **A-**: Can receive from A-, O-
- **B+**: Can receive from B+, B-, O+, O-
- **B-**: Can receive from B-, O-
- **AB+**: Universal recipient (can receive from all types)
- **AB-**: Can receive from A-, B-, AB-, O-
- **O+**: Can receive from O+, O-
- **O-**: Can only receive from O- (universal donor)

## Project Structure

```
Blood_bank_Management_System/
├── backend/
│   ├── main.py                 # FastAPI application
│   ├── requirements.txt        # Python dependencies
│   └── .env.example           # Environment variables example
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── Home.js        # Home page
│   │   │   ├── DonorRegistration.js  # Donor registration form
│   │   │   ├── BloodRequest.js       # Blood request form
│   │   │   └── DonorMap.js          # Google Maps component
│   │   ├── App.js
│   │   ├── App.css
│   │   ├── index.js
│   │   └── index.css
│   └── package.json
└── README.md
```

## Important Notes

### Map Integration
- Uses **Leaflet.js with OpenStreetMap** - completely free, no API key required!
- Red markers show request locations
- Blue markers show donor locations
- Click on markers to see detailed information

### Database
- SQLite database stores all donor and request information
- Database file: `blood_bank.db` (created automatically)
- Run `python init_db.py` to populate with 10 sample donors

### Sample Donor Locations
Example location (New York City):
- Latitude: 40.7128
- Longitude: -74.0060

Use these coordinates to test the blood request feature and see sample donors on the map!
Migrate to PostgreSQL/Neon DB for production
- [ ] User authentication and authorization
- [ ] Email/SMS notifications to donors
- [ ] Donation history tracking
- [ ] Admin dashboard
- [ ] Real-time chat between donors and requesters
- [ ] Blood bank inventory management
- [ ] Appointment scheduling

## Database Migration to Neon DB

The current implementation uses SQLite. To migrate to Neon DB (PostgreSQL):

1. Update `DATABASE_URL` in `.env` to Neon DB connection string
2. Install PostgreSQL driver: `pip install psycopg2-binary`
3. The SQLAlchemy models will work without changes
4. Update `database.py` to remove SQLite-specific settingslocation API
- Users must grant location permission
- Manual coordinate entry is available as fallback

### Distance Calculation
- Uses Haversine formula for accurate distance calculation
- Default search radius: 50 km
- Distance displayed in kilometers

## Future Enhancements

- [ ] Database integration (PostgreSQL/MongoDB)
- [ ] User authentication and authorization
- [ ] Email/SMS notifications to donors
- [ ] Donation history tracking
- [ ] Admin dashboard
- [ ] Real-time chat between donors and requesters
- [ ] Blood bank inventory management
- [ ] Appointment scheduling

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the MIT License.

## Support

For support, please contact the development team or raise an issue in the repository.
