import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from '../contexts/AuthContext';

const API_URL = 'http://localhost:8000';

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    full_name: ''
  });

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post(`${API_URL}/api/auth/login`, {
        email: formData.email,
        password: formData.password
      });

      const { access_token, user } = response.data;
      login(access_token, user);
      
      toast.success(`Welcome back, ${user.full_name}!`);
      
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error.response?.data?.detail || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    
    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post(`${API_URL}/api/auth/register`, {
        email: formData.email,
        password: formData.password,
        full_name: formData.full_name
      });

      const { access_token, user } = response.data;
      login(access_token, user);
      
      toast.success(`Welcome, ${user.full_name}! Your account has been created.`);
      
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
    } catch (error) {
      console.error('Registration error:', error);
      toast.error(error.response?.data?.detail || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="form-container" style={{ maxWidth: '500px', width: '100%' }}>
        <div className="card" style={{ padding: '40px 30px' }}>
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <h1 style={{ fontSize: '48px', marginBottom: '10px' }}>🩸</h1>
            <h2 style={{ color: '#dc3545', marginBottom: '10px' }}>Blood Bank Management</h2>
            <p style={{ color: '#666', fontSize: '16px' }}>
              {isRegisterMode ? 'Create your account' : 'Sign in to continue'}
            </p>
          </div>

          <form onSubmit={isRegisterMode ? handleRegister : handleLogin}>
            {isRegisterMode && (
              <div className="form-group" style={{ marginBottom: '20px' }}>
                <label>Full Name *</label>
                <input
                  type="text"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  required
                  placeholder="Enter your full name"
                  style={{ width: '100%', padding: '12px', fontSize: '16px' }}
                />
              </div>
            )}

            <div className="form-group" style={{ marginBottom: '20px' }}>
              <label>Email Address *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="your.email@example.com"
                style={{ width: '100%', padding: '12px', fontSize: '16px' }}
              />
            </div>

            <div className="form-group" style={{ marginBottom: '25px' }}>
              <label>Password *</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength="6"
                placeholder={isRegisterMode ? 'Create a password (min 6 characters)' : 'Enter your password'}
                style={{ width: '100%', padding: '12px', fontSize: '16px' }}
              />
              {isRegisterMode && (
                <small style={{ color: '#666', fontSize: '12px', display: 'block', marginTop: '5px' }}>
                  Password must be at least 6 characters long
                </small>
              )}
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading}
              style={{ width: '100%', padding: '15px', fontSize: '18px', marginBottom: '15px' }}
            >
              {isLoading ? 'Please wait...' : (isRegisterMode ? '🔐 Create Account' : '🔓 Sign In')}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #ddd' }}>
            <p style={{ color: '#666', marginBottom: '10px' }}>
              {isRegisterMode ? 'Already have an account?' : "Don't have an account?"}
            </p>
            <button
              onClick={() => {
                setIsRegisterMode(!isRegisterMode);
                setFormData({ email: '', password: '', full_name: '' });
              }}
              className="btn btn-secondary"
              style={{ padding: '10px 30px' }}
            >
              {isRegisterMode ? 'Sign In' : 'Create Account'}
            </button>
          </div>

          <div style={{ marginTop: '30px', padding: '15px', background: '#f8f9fa', borderRadius: '8px' }}>
            <h4 style={{ color: '#333', marginBottom: '10px', fontSize: '16px' }}>
              Why sign {isRegisterMode ? 'up' : 'in'}?
            </h4>
            <ul style={{ 
              textAlign: 'left', 
              color: '#666', 
              lineHeight: '1.8',
              listStyle: 'none',
              padding: 0,
              fontSize: '14px'
            }}>
              <li>✅ Register as a blood donor</li>
              <li>✅ Request blood for emergencies</li>
              <li>✅ Track your donation history</li>
              <li>✅ Contact NGOs for help</li>
              <li>✅ View nearby donors on map</li>
            </ul>
          </div>

          <div style={{ marginTop: '20px', padding: '12px', background: '#fff3cd', borderRadius: '8px' }}>
            <p style={{ color: '#856404', fontSize: '13px', margin: 0 }}>
              🔒 <strong>Secure & Private:</strong> Your data is encrypted and stored securely in our database.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
