import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import DonorRegistration from './components/DonorRegistration';
import BloodRequest from './components/BloodRequest';
import ViewDonorsMap from './components/ViewDonorsMap';
import Home from './components/Home';

function App() {
  return (
    <Router>
      <div className="App">
        <nav className="navbar">
          <div className="container">
            <div className="nav-brand">
              <h1>🩸 Blood Bank Management</h1>
            </div>
            <ul className="nav-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/register-donor">Become a Donor</Link></li>
              <li><Link to="/request-blood">Request Blood</Link></li>
              <li><Link to="/view-donors">View Donors</Link></li>
            </ul>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register-donor" element={<DonorRegistration />} />
          <Route path="/request-blood" element={<BloodRequest />} />
          <Route path="/view-donors" element={<ViewDonorsMap />} />
        </Routes>

        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </Router>
  );
}

export default App;
