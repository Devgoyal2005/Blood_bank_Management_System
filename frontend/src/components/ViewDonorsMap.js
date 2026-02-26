import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import DonorMap from './DonorMap';

const API_URL = 'http://localhost:8000';

function ViewDonorsMap() {
  const [location, setLocation] = useState({
    latitude: '',
    longitude: '',
    maxDistance: '50'
  });

  const [donors, setDonors] = useState([]);
  const [showMap, setShowMap] = useState(false);
  const [loading, setLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);

  const handleChange = (e) => {
    setLocation({
      ...location,
      [e.target.name]: e.target.value
    });
  };

  const getCurrentLocation = () => {
    setLocationLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            ...location,
            latitude: position.coords.latitude.toString(),
            longitude: position.coords.longitude.toString()
          });
          toast.success('Location detected successfully!');
          setLocationLoading(false);
        },
        (error) => {
          toast.error('Unable to get your location. Please enter manually.');
          setLocationLoading(false);
        }
      );
    } else {
      toast.error('Geolocation is not supported by your browser.');
      setLocationLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.get(
        `${API_URL}/api/donors/nearby`,
        {
          params: {
            latitude: parseFloat(location.latitude),
            longitude: parseFloat(location.longitude),
            max_distance: parseFloat(location.maxDistance)
          }
        }
      );

      setDonors(response.data.donors);
      setShowMap(true);
      
      if (response.data.donors.length > 0) {
        toast.success(`Found ${response.data.total} donor(s) nearby!`);
        setTimeout(() => {
          document.getElementById('map-section')?.scrollIntoView({ 
            behavior: 'smooth' 
          });
        }, 500);
      } else {
        toast.info('No donors found in this area. Try increasing the search radius.');
      }
    } catch (error) {
      toast.error('Failed to fetch donors. Please try again.');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h2>View Donors on Map</h2>
        <p>Find all registered blood donors near your location</p>
      </div>

      <div className="form-container">
        <div className="card">
          <form onSubmit={handleSearch}>
            <div className="form-row">
              <div className="form-group">
                <label>Latitude *</label>
                <input
                  type="number"
                  name="latitude"
                  value={location.latitude}
                  onChange={handleChange}
                  required
                  step="any"
                  placeholder="e.g., 40.7128"
                />
              </div>

              <div className="form-group">
                <label>Longitude *</label>
                <input
                  type="number"
                  name="longitude"
                  value={location.longitude}
                  onChange={handleChange}
                  required
                  step="any"
                  placeholder="e.g., -74.0060"
                />
              </div>
            </div>

            <button
              type="button"
              className="btn btn-secondary"
              onClick={getCurrentLocation}
              disabled={locationLoading}
              style={{ width: '100%', marginBottom: '20px' }}
            >
              {locationLoading ? 'Detecting Location...' : '📍 Use Current Location'}
            </button>

            <div className="form-row form-row-single">
              <div className="form-group">
                <label>Search Radius (km) *</label>
                <input
                  type="number"
                  name="maxDistance"
                  value={location.maxDistance}
                  onChange={handleChange}
                  required
                  min="1"
                  max="500"
                  placeholder="e.g., 50"
                />
                <small style={{ color: '#666', fontSize: '12px', marginTop: '5px', display: 'block' }}>
                  Distance in kilometers (1-500 km)
                </small>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary submit-btn"
              disabled={loading}
            >
              {loading ? 'Searching...' : '🔍 Search Donors'}
            </button>
          </form>
        </div>

        {showMap && (
          <div id="map-section" style={{ marginTop: '40px' }}>
            {donors.length > 0 ? (
              <div className="card">
                <h3 style={{ color: '#dc3545', marginBottom: '20px' }}>
                  Nearby Donors ({donors.length})
                </h3>
                
                <DonorMap
                  donors={donors}
                  requestLocation={{
                    lat: parseFloat(location.latitude),
                    lng: parseFloat(location.longitude)
                  }}
                />

                <div className="donors-list">
                  <h4 style={{ marginBottom: '15px', marginTop: '30px' }}>Donor Details:</h4>
                  {donors.map((donor, index) => (
                    <div key={donor.id} className="donor-card">
                      <h4>
                        {index + 1}. {donor.name} - {donor.blood_type}
                      </h4>
                      <div className="donor-info">
                        <div className="donor-info-item">
                          <strong>Distance:</strong> {donor.distance} km
                        </div>
                        <div className="donor-info-item">
                          <strong>Phone:</strong> {donor.phone}
                        </div>
                        <div className="donor-info-item">
                          <strong>Email:</strong> {donor.email}
                        </div>
                        <div className="donor-info-item">
                          <strong>Address:</strong> {donor.address}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="card" style={{ textAlign: 'center' }}>
                <h3 style={{ color: '#dc3545' }}>No Donors Found</h3>
                <p style={{ color: '#666', marginTop: '10px' }}>
                  No registered donors found within {location.maxDistance} km of your location.
                  Try increasing the search radius.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default ViewDonorsMap;
