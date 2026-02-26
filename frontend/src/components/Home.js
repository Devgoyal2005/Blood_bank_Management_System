import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="home">
      <section className="hero-section">
        <div className="container">
          <h1>Save Lives by Donating Blood</h1>
          <p>Join our community of life-savers. Every drop counts!</p>
          <div className="hero-buttons">
            <Link to="/register-donor" className="btn btn-primary">
              Become a Donor
            </Link>
            <Link to="/request-blood" className="btn btn-secondary">
              Request Blood
            </Link>
          </div>
        </div>
      </section>

      <section className="info-section">
        <div className="container">
          <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#333' }}>
            Why Donate Blood?
          </h2>
          <div className="info-cards">
            <div className="info-card">
              <h3>🎯 Save Lives</h3>
              <p>
                One blood donation can save up to three lives. Your contribution
                makes a real difference in emergency situations and surgeries.
              </p>
            </div>
            <div className="info-card">
              <h3>🏥 Health Benefits</h3>
              <p>
                Regular blood donation helps maintain healthy iron levels and may
                reduce the risk of heart disease.
              </p>
            </div>
            <div className="info-card">
              <h3>🤝 Community Support</h3>
              <p>
                Help patients in your local community who need blood for treatments,
                surgeries, and emergency care.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="info-section" style={{ background: '#f8f9fa' }}>
        <div className="container">
          <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#333' }}>
            How It Works
          </h2>
          <div className="info-cards">
            <div className="info-card">
              <h3>1. Register</h3>
              <p>
                Sign up as a blood donor by providing your details and location.
                It only takes a few minutes!
              </p>
            </div>
            <div className="info-card">
              <h3>2. Get Matched</h3>
              <p>
                When someone needs blood in your area, we'll notify you based on
                your blood type and location.
              </p>
            </div>
            <div className="info-card">
              <h3>3. Donate</h3>
              <p>
                Visit the nearest blood bank or hospital to donate blood and save
                a life!
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="info-section">
        <div className="container">
          <div className="card" style={{ textAlign: 'center' }}>
            <h2 style={{ color: '#dc3545', marginBottom: '20px' }}>
              Need Blood Urgently?
            </h2>
            <p style={{ fontSize: '18px', marginBottom: '30px', color: '#666' }}>
              Submit your blood request with the required details and find the
              nearest available donors on our interactive map.
            </p>
            <Link to="/request-blood" className="btn btn-primary">
              Request Blood Now
            </Link>
          </div>
        </div>
      </section>

      <section className="info-section" style={{ background: '#f8f9fa' }}>
        <div className="container">
          <div className="card" style={{ textAlign: 'center' }}>
            <h2 style={{ color: '#dc3545', marginBottom: '20px' }}>
              🗺️ Explore Donors in Your Area
            </h2>
            <p style={{ fontSize: '18px', marginBottom: '30px', color: '#666' }}>
              View all registered blood donors near your location on an interactive map.
              Find donors of all blood types in your area.
            </p>
            <Link to="/view-donors" className="btn btn-primary">
              View Donors Map
            </Link>
          </div>
        </div>
      </section>

      <section className="info-section">
        <div className="container">
          <div className="card" style={{ textAlign: 'center', background: 'linear-gradient(135deg, #dc3545 0%, #c82333 100%)', color: 'white' }}>
            <h2 style={{ color: 'white', marginBottom: '20px' }}>
              🆘 Need Emergency Help?
            </h2>
            <p style={{ fontSize: '18px', marginBottom: '30px', opacity: 0.95 }}>
              Can't find donors or in an emergency situation? Contact our NGO partners
              for immediate assistance. We're here to help 24/7!
            </p>
            <Link to="/contact-ngo" className="btn" style={{ background: 'white', color: '#dc3545', fontWeight: '600', padding: '15px 30px', fontSize: '18px' }}>
              Contact NGO Now
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
