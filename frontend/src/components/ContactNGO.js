import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const API_URL = 'http://localhost:8000';

function ContactNGO() {
  const [formData, setFormData] = useState({
    user_name: '',
    user_email: '',
    user_phone: '',
    blood_type_needed: '',
    urgency_level: 'urgent',
    message: '',
    location: '',
    latitude: '',
    longitude: ''
  });

  const [ngoInfo, setNgoInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);

  const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const urgencyLevels = ['normal', 'urgent', 'critical', 'emergency'];

  useEffect(() => {
    fetchNGOInfo();
  }, []);

  const fetchNGOInfo = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/ngo/info`);
      setNgoInfo(response.data);
    } catch (error) {
      console.error('Error fetching NGO info:', error);
    }
  };

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
        latitude: formData.latitude ? parseFloat(formData.latitude) : null,
        longitude: formData.longitude ? parseFloat(formData.longitude) : null
      };

      const response = await axios.post(
        `${API_URL}/api/ngo/contact`,
        submitData
      );

      if (response.data.success) {
        toast.success('Your request has been sent to the NGO successfully!');
        toast.info(`The NGO will contact you at ${formData.user_phone}`);
        
        // Reset form
        setFormData({
          user_name: '',
          user_email: '',
          user_phone: '',
          blood_type_needed: '',
          urgency_level: 'urgent',
          message: '',
          location: '',
          latitude: '',
          longitude: ''
        });
      }
    } catch (error) {
      toast.error('Failed to send request. Please try again.');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h2>🆘 Contact NGO for Help</h2>
        <p>Can't find donors? We're here to help you 24/7</p>
      </div>

      <div className="form-container">
        {/* NGO Information Card */}
        {ngoInfo && (
          <div className="card" style={{ background: 'linear-gradient(135deg, #dc3545 0%, #c82333 100%)', color: 'white', marginBottom: '30px' }}>
            <h3 style={{ color: 'white', marginBottom: '15px' }}>
              📞 {ngoInfo.ngo_name}
            </h3>
            <p style={{ fontSize: '16px', marginBottom: '10px', opacity: 0.95 }}>
              {ngoInfo.description}
            </p>
            <div style={{ marginTop: '20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px' }}>
              <div style={{ background: 'rgba(255,255,255,0.2)', padding: '15px', borderRadius: '8px' }}>
                <strong style={{ display: 'block', marginBottom: '5px' }}>📧 Email:</strong>
                <a href={`mailto:${ngoInfo.ngo_email}`} style={{ color: 'white', textDecoration: 'underline' }}>
                  {ngoInfo.ngo_email}
                </a>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.2)', padding: '15px', borderRadius: '8px' }}>
                <strong style={{ display: 'block', marginBottom: '5px' }}>📱 Phone:</strong>
                <a href={`tel:${ngoInfo.ngo_phone}`} style={{ color: 'white', textDecoration: 'underline' }}>
                  {ngoInfo.ngo_phone}
                </a>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.2)', padding: '15px', borderRadius: '8px' }}>
                <strong style={{ display: 'block', marginBottom: '5px' }}>🚨 Emergency:</strong>
                <a href={`mailto:${ngoInfo.ngo_emergency_email}`} style={{ color: 'white', textDecoration: 'underline' }}>
                  {ngoInfo.ngo_emergency_email}
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Contact Form */}
        <div className="card">
          <h3 style={{ color: '#dc3545', marginBottom: '20px' }}>
            Send Your Request to NGO
          </h3>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Your Name *</label>
                <input
                  type="text"
                  name="user_name"
                  value={formData.user_name}
                  onChange={handleChange}
                  required
                  placeholder="Enter your full name"
                />
              </div>

              <div className="form-group">
                <label>Your Email *</label>
                <input
                  type="email"
                  name="user_email"
                  value={formData.user_email}
                  onChange={handleChange}
                  required
                  placeholder="your.email@example.com"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Your Phone Number *</label>
                <input
                  type="tel"
                  name="user_phone"
                  value={formData.user_phone}
                  onChange={handleChange}
                  required
                  placeholder="+91-9876543210"
                />
              </div>

              <div className="form-group">
                <label>Blood Type Needed (Optional)</label>
                <select
                  name="blood_type_needed"
                  value={formData.blood_type_needed}
                  onChange={handleChange}
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
                <label>Urgency Level *</label>
                <select
                  name="urgency_level"
                  value={formData.urgency_level}
                  onChange={handleChange}
                  required
                >
                  {urgencyLevels.map(level => (
                    <option key={level} value={level}>
                      {level.charAt(0).toUpperCase() + level.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Location (Optional)</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g., Dehradun, Uttarakhand"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Latitude (Optional)</label>
                <input
                  type="number"
                  name="latitude"
                  value={formData.latitude}
                  onChange={handleChange}
                  step="any"
                  placeholder="e.g., 30.3275"
                />
              </div>

              <div className="form-group">
                <label>Longitude (Optional)</label>
                <input
                  type="number"
                  name="longitude"
                  value={formData.longitude}
                  onChange={handleChange}
                  step="any"
                  placeholder="e.g., 78.0325"
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
                <label>Your Message *</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="5"
                  placeholder="Describe your situation and what help you need..."
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary submit-btn"
              disabled={loading}
            >
              {loading ? 'Sending Request...' : '📤 Send Request to NGO'}
            </button>
          </form>
        </div>

        {/* Help Information */}
        <div className="card" style={{ marginTop: '30px', background: '#f8f9fa' }}>
          <h4 style={{ color: '#333', marginBottom: '15px' }}>ℹ️ When to Contact NGO?</h4>
          <ul style={{ color: '#666', lineHeight: '1.8', paddingLeft: '20px' }}>
            <li>Unable to find donors in your area</li>
            <li>Need urgent/emergency blood assistance</li>
            <li>Require help with blood bank coordination</li>
            <li>Need guidance on blood donation process</li>
            <li>Any questions or concerns about blood donation</li>
          </ul>
          <p style={{ marginTop: '15px', color: '#dc3545', fontWeight: '600' }}>
            🕐 Available 24/7 for emergency situations
          </p>
        </div>
      </div>
    </div>
  );
}

export default ContactNGO;
