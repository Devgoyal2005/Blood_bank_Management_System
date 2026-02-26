import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import DonorMap from './DonorMap';

const API_URL = 'http://localhost:8000';

function BloodRequest() {
  const [formData, setFormData] = useState({
    patient_name: '',
    hospital_name: '',
    blood_type: '',
    units_needed: '',
    urgency: 'normal',
    contact_phone: '',
    contact_email: '',
    latitude: '',
    longitude: '',
    additional_info: ''
  });

  const [proofDocument, setProofDocument] = useState(null);
  const [fileName, setFileName] = useState('');
  const [loading, setLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [nearestDonors, setNearestDonors] = useState([]);
  const [showMap, setShowMap] = useState(false);

  const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const urgencyLevels = ['normal', 'urgent', 'critical'];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size should not exceed 5MB');
        return;
      }
      setProofDocument(file);
      setFileName(file.name);
    }
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
    
    if (!proofDocument) {
      toast.error('Please upload a proof document');
      return;
    }

    setLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('patient_name', formData.patient_name);
      formDataToSend.append('hospital_name', formData.hospital_name);
      formDataToSend.append('blood_type', formData.blood_type);
      formDataToSend.append('units_needed', formData.units_needed);
      formDataToSend.append('urgency', formData.urgency);
      formDataToSend.append('contact_phone', formData.contact_phone);
      formDataToSend.append('contact_email', formData.contact_email);
      formDataToSend.append('latitude', formData.latitude);
      formDataToSend.append('longitude', formData.longitude);
      formDataToSend.append('additional_info', formData.additional_info || '');
      formDataToSend.append('proof_document', proofDocument);

      const response = await axios.post(
        `${API_URL}/api/blood-requests`,
        formDataToSend,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      if (response.data.success) {
        toast.success('Blood request submitted successfully!');
        setNearestDonors(response.data.nearest_donors);
        setShowMap(true);
        
        // Scroll to map section
        setTimeout(() => {
          document.getElementById('donors-section')?.scrollIntoView({ 
            behavior: 'smooth' 
          });
        }, 500);
      }
    } catch (error) {
      toast.error('Failed to submit blood request. Please try again.');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h2>Request Blood</h2>
        <p>Submit your blood requirement and find nearest donors</p>
      </div>

      <div className="form-container">
        <div className="card">
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Patient Name *</label>
                <input
                  type="text"
                  name="patient_name"
                  value={formData.patient_name}
                  onChange={handleChange}
                  required
                  placeholder="Enter patient name"
                />
              </div>

              <div className="form-group">
                <label>Hospital Name *</label>
                <input
                  type="text"
                  name="hospital_name"
                  value={formData.hospital_name}
                  onChange={handleChange}
                  required
                  placeholder="Enter hospital name"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Blood Type Required *</label>
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

              <div className="form-group">
                <label>Units Needed *</label>
                <input
                  type="number"
                  name="units_needed"
                  value={formData.units_needed}
                  onChange={handleChange}
                  required
                  min="1"
                  placeholder="Number of units"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Urgency Level *</label>
                <select
                  name="urgency"
                  value={formData.urgency}
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
                <label>Contact Phone *</label>
                <input
                  type="tel"
                  name="contact_phone"
                  value={formData.contact_phone}
                  onChange={handleChange}
                  required
                  placeholder="+1234567890"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Contact Email *</label>
                <input
                  type="email"
                  name="contact_email"
                  value={formData.contact_email}
                  onChange={handleChange}
                  required
                  placeholder="contact@example.com"
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

            <div className="form-row form-row-single">
              <div className="form-group">
                <label>Additional Information (Optional)</label>
                <textarea
                  name="additional_info"
                  value={formData.additional_info}
                  onChange={handleChange}
                  rows="3"
                  placeholder="Any additional information about the requirement"
                />
              </div>
            </div>

            <div className="form-row form-row-single">
              <div className="form-group">
                <label>Upload Proof Document * (Medical Certificate, Prescription, etc.)</label>
                <div className="file-upload-wrapper">
                  <input
                    type="file"
                    id="proof-upload"
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                    onChange={handleFileChange}
                  />
                  <label htmlFor="proof-upload" className="file-upload-label">
                    {fileName ? (
                      <div>
                        <div>📄 {fileName}</div>
                        <div style={{ fontSize: '12px', marginTop: '5px', color: '#666' }}>
                          Click to change
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div>📁 Click to upload proof document</div>
                        <div style={{ fontSize: '12px', marginTop: '5px', color: '#666' }}>
                          PDF, JPG, PNG, DOC (Max 5MB)
                        </div>
                      </div>
                    )}
                  </label>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary submit-btn"
              disabled={loading}
            >
              {loading ? 'Submitting Request...' : 'Submit Blood Request'}
            </button>
          </form>
        </div>

        {showMap && nearestDonors.length > 0 && (
          <div id="donors-section" style={{ marginTop: '40px' }}>
            <div className="card">
              <h3 style={{ color: '#dc3545', marginBottom: '20px' }}>
                Nearest Available Donors ({nearestDonors.length})
              </h3>
              
              <DonorMap
                donors={nearestDonors}
                requestLocation={{
                  lat: parseFloat(formData.latitude),
                  lng: parseFloat(formData.longitude)
                }}
              />

              <div className="donors-list">
                <h4 style={{ marginBottom: '15px' }}>Donor Details:</h4>
                {nearestDonors.map((donor, index) => (
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
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {showMap && nearestDonors.length === 0 && (
          <div className="card" style={{ marginTop: '40px', textAlign: 'center' }}>
            <h3 style={{ color: '#dc3545' }}>No Donors Found</h3>
            <p style={{ color: '#666', marginTop: '10px' }}>
              Unfortunately, there are no registered donors matching your blood type in your area at the moment.
              Please try expanding your search radius or contact nearby blood banks.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default BloodRequest;
