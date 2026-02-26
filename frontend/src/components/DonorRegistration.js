import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const API_URL = 'http://localhost:8000';

function DonorRegistration() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    blood_type: '',
    age: '',
    weight: '',
    address: '',
    latitude: '',
    longitude: '',
    last_donation_date: '',
    medical_conditions: ''
  });

  const [loading, setLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);

  const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const getCurrentLocation = () => {
    setLocationLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData({
            ...formData,
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const submitData = {
        ...formData,
        age: parseInt(formData.age),
        weight: parseFloat(formData.weight),
        latitude: parseFloat(formData.latitude),
        longitude: parseFloat(formData.longitude)
      };

      const response = await axios.post(
        `${API_URL}/api/donors/register`,
        submitData
      );

      if (response.data.success) {
        toast.success('Registration successful! Thank you for becoming a donor.');
        setFormData({
          name: '',
          email: '',
          phone: '',
          blood_type: '',
          age: '',
          weight: '',
          address: '',
          latitude: '',
          longitude: '',
          last_donation_date: '',
          medical_conditions: ''
        });
      }
    } catch (error) {
      toast.error('Registration failed. Please try again.');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h2>Register as Blood Donor</h2>
        <p>Fill in your details to join our life-saving community</p>
      </div>

      <div className="form-container">
        <div className="card">
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Full Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Enter your full name"
                />
              </div>

              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="your.email@example.com"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Phone Number *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  placeholder="+1234567890"
                />
              </div>

              <div className="form-group">
                <label>Blood Type *</label>
                <select
                  name="blood_type"
                  value={formData.blood_type}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Blood Type</option>
                  {bloodTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Age *</label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  required
                  min="18"
                  max="65"
                  placeholder="18-65 years"
                />
              </div>

              <div className="form-group">
                <label>Weight (kg) *</label>
                <input
                  type="number"
                  name="weight"
                  value={formData.weight}
                  onChange={handleChange}
                  required
                  min="50"
                  step="0.1"
                  placeholder="Minimum 50 kg"
                />
              </div>
            </div>

            <div className="form-row form-row-single">
              <div className="form-group">
                <label>Address *</label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  rows="3"
                  placeholder="Enter your complete address"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Latitude *</label>
                <input
                  type="number"
                  name="latitude"
                  value={formData.latitude}
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
                  value={formData.longitude}
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

            <div className="form-row">
              <div className="form-group">
                <label>Last Donation Date (Optional)</label>
                <input
                  type="date"
                  name="last_donation_date"
                  value={formData.last_donation_date}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Medical Conditions (Optional)</label>
                <input
                  type="text"
                  name="medical_conditions"
                  value={formData.medical_conditions}
                  onChange={handleChange}
                  placeholder="Any medical conditions"
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary submit-btn"
              disabled={loading}
            >
              {loading ? 'Registering...' : 'Register as Donor'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default DonorRegistration;
