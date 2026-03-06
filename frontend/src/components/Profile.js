import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [donorProfile, setDonorProfile] = useState(null);
  const [donationHistory, setDonationHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user && user.is_donor && user.donor_id) {
      fetchDonorProfile();
    }
  }, [user]);

  const fetchDonorProfile = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:8000/api/donors/${user.donor_id}/profile`);
      setDonorProfile(response.data.donor);
      setDonationHistory(response.data.donation_history || []);
    } catch (err) {
      console.error('Error fetching donor profile:', err);
      toast.error('Failed to load donation history');
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

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) {
    return null;
  }

  return (
    <div>
      <div className="page-header">
        <h2>My Profile</h2>
        <p>Manage your account and donation information</p>
      </div>

      <div className="form-container">
        <div className="card">
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            {user.picture && (
              <img 
                src={user.picture} 
                alt={user.full_name}
                style={{
                  width: '120px',
                  height: '120px',
                  borderRadius: '50%',
                  marginBottom: '20px',
                  border: '4px solid #dc3545'
                }}
              />
            )}
            <h2 style={{ color: '#333', marginBottom: '5px' }}>{user.full_name}</h2>
            <p style={{ color: '#666', fontSize: '16px' }}>{user.email}</p>
          </div>

          <div style={{ 
            background: '#f8f9fa', 
            padding: '20px', 
            borderRadius: '8px',
            marginBottom: '20px'
          }}>
            <h3 style={{ color: '#333', marginBottom: '15px', fontSize: '18px' }}>
              Account Information
            </h3>
            <div style={{ display: 'grid', gap: '15px' }}>
              <div>
                <strong style={{ color: '#666', display: 'block', marginBottom: '5px' }}>
                  Account Type:
                </strong>
                <span style={{ fontSize: '16px', color: '#333' }}>
                  {user.is_donor ? '🩸 Registered Donor' : '👤 Regular User'}
                </span>
              </div>
              {user.is_donor && user.donor_id && (
                <div>
                  <strong style={{ color: '#666', display: 'block', marginBottom: '5px' }}>
                    Donor ID:
                  </strong>
                  <span style={{ fontSize: '16px', color: '#333', fontFamily: 'monospace' }}>
                    {user.donor_id}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Donor Statistics */}
          {user.is_donor && donorProfile && (
            <div style={{
              background: 'linear-gradient(135deg, #fff5f5 0%, #fee 100%)',
              border: '2px solid #ffc9c9',
              borderRadius: '12px',
              padding: '20px',
              marginBottom: '20px'
            }}>
              <h3 style={{ color: '#dc3545', marginBottom: '20px', fontSize: '18px' }}>
                📊 My Donation Statistics
              </h3>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                gap: '20px',
                marginBottom: '15px'
              }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#dc3545' }}>
                    {donorProfile.total_donations || 0}
                  </div>
                  <div style={{ fontSize: '14px', color: '#666' }}>Total Donations</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#dc3545' }}>
                    {donorProfile.blood_type}
                  </div>
                  <div style={{ fontSize: '14px', color: '#666' }}>Blood Type</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#dc3545' }}>
                    {donorProfile.last_donation_date ? formatDate(donorProfile.last_donation_date) : 'Never'}
                  </div>
                  <div style={{ fontSize: '14px', color: '#666' }}>Last Donation</div>
                </div>
              </div>
              {donorProfile.aadhaar_number && (
                <div style={{ marginTop: '15px', paddingTop: '15px', borderTop: '1px solid #ffc9c9' }}>
                  <strong style={{ color: '#666', fontSize: '14px' }}>🆔 Aadhaar:</strong>
                  <span style={{ marginLeft: '10px', fontFamily: 'monospace', fontSize: '14px' }}>
                    {donorProfile.aadhaar_number}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Donation History */}
          {user.is_donor && donationHistory.length > 0 && (
            <div style={{
              background: 'white',
              border: '1px solid #dee2e6',
              borderRadius: '12px',
              padding: '20px',
              marginBottom: '20px'
            }}>
              <h3 style={{ color: '#333', marginBottom: '20px', fontSize: '18px' }}>
                📅 My Donation History
              </h3>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: '#f8f9fa' }}>
                      <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Date</th>
                      <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Blood Type</th>
                      <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Units</th>
                      <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Hospital</th>
                      <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {donationHistory.map((donation, index) => (
                      <tr key={donation.id || index} style={{ borderBottom: '1px solid #e9ecef' }}>
                        <td style={{ padding: '12px' }}>{formatDate(donation.donation_date)}</td>
                        <td style={{ padding: '12px' }}>
                          <span style={{
                            background: '#dc3545',
                            color: 'white',
                            padding: '4px 12px',
                            borderRadius: '12px',
                            fontSize: '12px',
                            fontWeight: '600'
                          }}>
                            {donation.blood_type}
                          </span>
                        </td>
                        <td style={{ padding: '12px' }}>{donation.units_donated} unit{donation.units_donated !== 1 ? 's' : ''}</td>
                        <td style={{ padding: '12px' }}>{donation.hospital_name || 'N/A'}</td>
                        <td style={{ padding: '12px', color: '#666' }}>{donation.notes || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {user.is_donor && loading && (
            <div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
              Loading donation history...
            </div>
          )}

          {!user.is_donor && (
            <div style={{
              background: 'linear-gradient(135deg, #dc3545 0%, #c82333 100%)',
              color: 'white',
              padding: '20px',
              borderRadius: '8px',
              marginBottom: '20px',
              textAlign: 'center'
            }}>
              <h3 style={{ color: 'white', marginBottom: '10px' }}>
                Become a Blood Donor!
              </h3>
              <p style={{ marginBottom: '15px', opacity: 0.95 }}>
                Register as a blood donor and help save lives in your community.
              </p>
              <button
                className="btn"
                onClick={() => navigate('/register-donor')}
                style={{
                  background: 'white',
                  color: '#dc3545',
                  fontWeight: '600'
                }}
              >
                Register as Donor
              </button>
            </div>
          )}

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '15px',
            marginBottom: '20px'
          }}>
            <button
              className="btn btn-primary"
              onClick={() => navigate('/request-blood')}
            >
              🩸 Request Blood
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => navigate('/view-donors')}
            >
              🗺️ View Donors
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => navigate('/contact-ngo')}
            >
              🆘 Contact NGO
            </button>
          </div>

          <button
            className="btn"
            onClick={handleLogout}
            style={{
              width: '100%',
              background: '#6c757d',
              borderColor: '#6c757d'
            }}
          >
            🚪 Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}

export default Profile;
