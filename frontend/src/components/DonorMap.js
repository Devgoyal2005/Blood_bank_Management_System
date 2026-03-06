import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Tooltip, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './DonorMap.css';
import L from 'leaflet';

// Fix for default marker icons in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// Custom icons for different marker types
const requestIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const donorIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

function DonorMap({ donors, requestLocation, onDonorClick }) {
  const [map, setMap] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Component to auto-fit map bounds
  function MapBounds() {
    const map = useMap();
    
    useEffect(() => {
      if (donors && donors.length > 0) {
        const bounds = [];
        
        // Add all donor positions
        donors.forEach(donor => {
          bounds.push([donor.latitude, donor.longitude]);
        });
        
        // Add request location
        if (requestLocation) {
          bounds.push([requestLocation.lat, requestLocation.lng]);
        }
        
        // Fit bounds with padding
        if (bounds.length > 0) {
          map.fitBounds(bounds, {
            padding: [50, 50],
            maxZoom: 14
          });
        }
      }
    }, [donors, map]);
    
    return null;
  }

  const toggleFullscreen = () => {
    const mapElement = document.getElementById('donor-map-container');
    
    if (!isFullscreen) {
      // Enter fullscreen
      if (mapElement.requestFullscreen) {
        mapElement.requestFullscreen();
      } else if (mapElement.mozRequestFullScreen) { // Firefox
        mapElement.mozRequestFullScreen();
      } else if (mapElement.webkitRequestFullscreen) { // Chrome, Safari, Opera
        mapElement.webkitRequestFullscreen();
      } else if (mapElement.msRequestFullscreen) { // IE/Edge
        mapElement.msRequestFullscreen();
      }
      setIsFullscreen(true);
    } else {
      // Exit fullscreen
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
      setIsFullscreen(false);
    }
  };

  // Listen for fullscreen changes
  React.useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.mozFullScreenElement ||
        document.msFullscreenElement
      );
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
    };
  }, []);

  return (
    <div 
      id="donor-map-container"
      className={`map-container ${isFullscreen ? 'fullscreen-map' : ''}`}
      style={{ 
        height: isFullscreen ? '100vh' : '600px', 
        borderRadius: isFullscreen ? '0' : '12px', 
        overflow: 'hidden',
        position: 'relative'
      }}
    >
      {/* Fullscreen Toggle Button */}
      <button
        onClick={toggleFullscreen}
        style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          zIndex: 1000,
          backgroundColor: 'white',
          border: '2px solid #ccc',
          borderRadius: '6px',
          padding: '10px 15px',
          cursor: 'pointer',
          fontSize: '16px',
          fontWeight: '600',
          boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
          display: 'flex',
          alignItems: 'center',
          gap: '5px',
          transition: 'all 0.3s ease'
        }}
        onMouseEnter={(e) => {
          e.target.style.backgroundColor = '#f0f0f0';
          e.target.style.transform = 'scale(1.05)';
        }}
        onMouseLeave={(e) => {
          e.target.style.backgroundColor = 'white';
          e.target.style.transform = 'scale(1)';
        }}
        title={isFullscreen ? 'Exit Fullscreen' : 'View Fullscreen'}
      >
        {isFullscreen ? (
          <>
            <span style={{ fontSize: '18px' }}>⊗</span>
            <span>Exit Fullscreen</span>
          </>
        ) : (
          <>
            <span style={{ fontSize: '18px' }}>⛶</span>
            <span>Fullscreen</span>
          </>
        )}
      </button>

      <MapContainer
        center={[requestLocation.lat, requestLocation.lng]}
        zoom={12}
        style={{ height: '100%', width: '100%' }}
        whenCreated={setMap}
      >
        {/* Auto-fit bounds component */}
        <MapBounds />
        
        {/* OpenStreetMap tile layer - completely free! */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Marker for request location */}
        <Marker position={[requestLocation.lat, requestLocation.lng]} icon={requestIcon}>
          <Popup>
            <div style={{ padding: '5px' }}>
              <strong style={{ color: '#dc3545' }}>📍 Your Location</strong>
              <p style={{ margin: '5px 0 0 0', fontSize: '12px' }}>
                Blood Request Location
              </p>
            </div>
          </Popup>
        </Marker>

        {/* Markers for donors */}
        {donors.map((donor) => (
          <Marker
            key={donor.id}
            position={[donor.latitude, donor.longitude]}
            icon={donorIcon}
            eventHandlers={{
              click: () => {
                if (onDonorClick) {
                  onDonorClick(donor);
                }
              }
            }}
          >
            {/* Permanent tooltip with donor name */}
            <Tooltip 
              permanent 
              direction="top" 
              offset={[0, -20]}
              className="donor-name-tooltip"
            >
              <div style={{ 
                fontSize: '12px', 
                fontWeight: '600', 
                whiteSpace: 'nowrap',
                textAlign: 'center'
              }}>
                {donor.name}
                <div style={{ fontSize: '10px', color: '#666' }}>
                  {donor.distance} km
                </div>
              </div>
            </Tooltip>
            
            <Popup>
              <div style={{ padding: '5px', minWidth: '180px' }}>
                <h4 style={{ margin: '0 0 8px 0', color: '#dc3545', fontSize: '14px' }}>
                  {donor.name}
                </h4>
                <p style={{ margin: '3px 0', fontSize: '12px' }}>
                  <strong>Blood Type:</strong> {donor.blood_type}
                </p>
                <p style={{ margin: '3px 0', fontSize: '12px' }}>
                  <strong>Distance:</strong> {donor.distance} km
                </p>
                <p style={{ margin: '3px 0', fontSize: '12px' }}>
                  <strong>Total Donations:</strong> {donor.total_donations || 0}
                </p>
                <p style={{ margin: '3px 0', fontSize: '12px' }}>
                  <strong>Phone:</strong> {donor.phone}
                </p>
                {onDonorClick && (
                  <button
                    onClick={() => onDonorClick(donor)}
                    style={{
                      marginTop: '10px',
                      width: '100%',
                      padding: '8px',
                      background: '#dc3545',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '12px',
                      fontWeight: '600'
                    }}
                  >
                    View Full Profile
                  </button>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

export default DonorMap;
