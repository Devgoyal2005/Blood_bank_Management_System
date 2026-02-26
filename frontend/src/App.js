import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import DonorRegistration from './components/DonorRegistration';
import BloodRequest from './components/BloodRequest';
import ViewDonorsMap from './components/ViewDonorsMap';
import ContactNGO from './components/ContactNGO';
import Login from './components/Login';
import Profile from './components/Profile';
import Home from './components/Home';

// Protected Route Component
function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <h3>Loading...</h3>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: window.location }} replace />;
  }

  return children;
}

// Navigation Bar Component
function NavigationBar() {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="container">
        <div className="nav-brand">
          <h1>🩸 Blood Bank Management</h1>
        </div>
        <ul className="nav-links">
          <li><Link to="/">Home</Link></li>
          {isAuthenticated ? (
            <>
              <li><Link to="/register-donor">Become a Donor</Link></li>
              <li><Link to="/request-blood">Request Blood</Link></li>
              <li><Link to="/view-donors">View Donors</Link></li>
              <li><Link to="/contact-ngo" style={{ background: 'rgba(255,255,255,0.2)', padding: '5px 10px', borderRadius: '5px' }}>🆘 NGO Help</Link></li>
              <li style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Link to="/profile" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {user?.picture && (
                    <img 
                      src={user.picture} 
                      alt={user.full_name}
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        border: '2px solid white'
                      }}
                    />
                  )}
                  <span>{user?.full_name?.split(' ')[0] || 'Profile'}</span>
                </Link>
              </li>
            </>
          ) : (
            <li><Link to="/login" style={{ background: '#dc3545', padding: '8px 16px', borderRadius: '5px' }}>Sign In</Link></li>
          )}
        </ul>
      </div>
    </nav>
  );
}

function AppContent() {
  return (
    <div className="App">
      <NavigationBar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/register-donor" 
          element={
            <ProtectedRoute>
              <DonorRegistration />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/request-blood" 
          element={
            <ProtectedRoute>
              <BloodRequest />
            </ProtectedRoute>
          } 
        />
        <Route path="/view-donors" element={<ViewDonorsMap />} />
        <Route 
          path="/contact-ngo" 
          element={
            <ProtectedRoute>
              <ContactNGO />
            </ProtectedRoute>
          } 
        />
      </Routes>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
