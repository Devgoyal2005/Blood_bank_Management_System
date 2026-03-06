import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './DonorProfile.css';

function DonorProfile({ donorId, onClose }) {
  const [donor, setDonor] = useState(null);
  const [donationHistory, setDonationHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDonorProfile();
  }, [donorId]);

  const fetchDonorProfile = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:8000/api/donors/${donorId}/profile`);
      setDonor(response.data.donor);
      setDonationHistory(response.data.donation_history || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching donor profile:', err);
      setError('Failed to load donor profile');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  if (loading) {
    return (
      <div className="donor-profile-modal">
        <div className="donor-profile-content">
          <div className="loading">Loading profile...</div>
        </div>
      </div>
    );
  }

  if (error || !donor) {
    return (
      <div className="donor-profile-modal">
        <div className="donor-profile-content">
          <button className="close-btn" onClick={onClose}>&times;</button>
          <div className="error">{error || 'Donor not found'}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="donor-profile-modal" onClick={onClose}>
      <div className="donor-profile-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>&times;</button>
        
        <div className="profile-header">
          <div className="profile-avatar">
            {donor.name.charAt(0).toUpperCase()}
          </div>
          <div className="profile-title">
            <h2>{donor.name}</h2>
            <p className="blood-type-badge">{donor.blood_type}</p>
          </div>
        </div>

        <div className="profile-details">
          <div className="detail-row">
            <span className="detail-label">📧 Email:</span>
            <span className="detail-value">{donor.email}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">📱 Phone:</span>
            <span className="detail-value">{donor.phone}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">🆔 Aadhaar:</span>
            <span className="detail-value">{donor.aadhaar_number || 'Not provided'}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">🎂 Age:</span>
            <span className="detail-value">{donor.age} years</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">⚖️ Weight:</span>
            <span className="detail-value">{donor.weight} kg</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">📍 Address:</span>
            <span className="detail-value">{donor.address}</span>
          </div>
        </div>

        <div className="donation-stats">
          <h3>📊 Donation Statistics</h3>
          <div className="stats-grid">
            <div className="stat-box">
              <div className="stat-number">{donor.total_donations || 0}</div>
              <div className="stat-label">Total Donations</div>
            </div>
            <div className="stat-box">
              <div className="stat-number">
                {donor.last_donation_date ? formatDate(donor.last_donation_date) : 'Never'}
              </div>
              <div className="stat-label">Last Donation</div>
            </div>
          </div>
        </div>

        {donationHistory && donationHistory.length > 0 && (
          <div className="donation-history">
            <h3>📅 Donation History</h3>
            <div className="history-table">
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Blood Type</th>
                    <th>Units</th>
                    <th>Hospital</th>
                    <th>Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {donationHistory.map((donation, index) => (
                    <tr key={donation.id || index}>
                      <td>{formatDate(donation.donation_date)}</td>
                      <td><span className="blood-badge">{donation.blood_type}</span></td>
                      <td>{donation.units_donated} unit{donation.units_donated !== 1 ? 's' : ''}</td>
                      <td>{donation.hospital_name || 'N/A'}</td>
                      <td>{donation.notes || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="profile-actions">
          <button className="contact-btn">📞 Contact Donor</button>
          <button className="close-profile-btn" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}

export default DonorProfile;
