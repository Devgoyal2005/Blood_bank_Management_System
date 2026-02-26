# Frontend Run Instructions

## Setup

1. Install dependencies:
```bash
cd frontend
npm install
```

2. Start the development server:
```bash
npm start
```

Application will open at: http://localhost:3000

## No Configuration Required!

✅ **No API keys needed** - The map uses OpenStreetMap (Leaflet.js) which is completely free!

## Testing the Application

### Test Blood Request Feature:
Use these example coordinates to see sample donors on the map:

**New York City (10 sample donors available):**
- Latitude: `40.7128`
- Longitude: `-74.0060`

Just enter these coordinates in the blood request form, select a blood type, and you'll see nearby donors on the interactive map!

## Build for Production

```bash
npm run build
```

This creates an optimized production build in the `build` folder.

## Map Features

- 🗺️ **Leaflet.js + OpenStreetMap** - Free and open-source
- 📍 Red markers = Blood request locations
- 📍 Blue markers = Donor locations
- Click markers for detailed information
- Fully responsive and mobile-friendly
