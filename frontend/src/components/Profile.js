import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

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
