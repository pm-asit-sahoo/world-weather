import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { fetchExtremeEvents } from '../services/climateService';
import '../styles/WorldMap.css';

// Fix for Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

// Custom icons for different event types
const getEventIcon = (eventType) => {
  const iconSize = [25, 25];
  const iconAnchor = [12, 12];
  const popupAnchor = [0, -12];
  
  let iconUrl;
  
  switch (eventType) {
    case 'hurricane':
    case 'cyclone':
      iconUrl = 'https://img.icons8.com/color/48/000000/hurricane.png';
      break;
    case 'wildfire':
      iconUrl = 'https://img.icons8.com/color/48/000000/fire-element.png';
      break;
    case 'flood':
      iconUrl = 'https://img.icons8.com/color/48/000000/flood.png';
      break;
    case 'drought':
      iconUrl = 'https://img.icons8.com/color/48/000000/drought.png';
      break;
    case 'heatwave':
      iconUrl = 'https://img.icons8.com/color/48/000000/temperature.png';
      break;
    case 'tornado':
      iconUrl = 'https://img.icons8.com/color/48/000000/tornado.png';
      break;
    default:
      iconUrl = 'https://img.icons8.com/color/48/000000/marker.png';
  }
  
  return L.icon({
    iconUrl,
    iconSize,
    iconAnchor,
    popupAnchor
  });
};

const WorldMap = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const loadEvents = async () => {
      try {
        setLoading(true);
        const data = await fetchExtremeEvents();
        setEvents(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching extreme events:', err);
        setError('Failed to load extreme events data');
        setLoading(false);
      }
    };
    
    loadEvents();
  }, []);
  
  if (loading) {
    return (
      <div className="loading-map">
        <div className="spinner"></div>
        <p>Loading map data...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="error-map">
        <p>{error}</p>
      </div>
    );
  }
  
  return (
    <div className="world-map">
      <MapContainer 
        center={[20, 0]} 
        zoom={2} 
        minZoom={2}
        maxBounds={[[-90, -180], [90, 180]]}
        scrollWheelZoom={true}
        className="map-container"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {events.map((event) => (
          <Marker 
            key={event.id}
            position={[event.location.lat, event.location.lng]}
            icon={getEventIcon(event.type)}
          >
            <Popup>
              <div className="event-popup">
                <h3>{event.name}</h3>
                <p className="event-type">{event.type.charAt(0).toUpperCase() + event.type.slice(1)}</p>
                <p className="event-date">{event.date}</p>
                <p className="event-description">{event.description}</p>
                <p className="event-impact"><strong>Impact:</strong> {event.impact}</p>
                <div className="event-intensity">
                  <span>Severity:</span>
                  {[...Array(5)].map((_, i) => (
                    <span 
                      key={i} 
                      className={`intensity-dot ${i < event.intensity ? 'active' : ''}`}
                    ></span>
                  ))}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      
      <div className="map-legend">
        <h4>Event Types</h4>
        <div className="legend-items">
          <div className="legend-item">
            <img src="https://img.icons8.com/color/48/000000/hurricane.png" alt="Hurricane/Cyclone" width="20" />
            <span>Hurricane/Cyclone</span>
          </div>
          <div className="legend-item">
            <img src="https://img.icons8.com/color/48/000000/fire-element.png" alt="Wildfire" width="20" />
            <span>Wildfire</span>
          </div>
          <div className="legend-item">
            <img src="https://img.icons8.com/color/48/000000/flood.png" alt="Flood" width="20" />
            <span>Flood</span>
          </div>
          <div className="legend-item">
            <img src="https://img.icons8.com/color/48/000000/drought.png" alt="Drought" width="20" />
            <span>Drought</span>
          </div>
          <div className="legend-item">
            <img src="https://img.icons8.com/color/48/000000/temperature.png" alt="Heatwave" width="20" />
            <span>Heatwave</span>
          </div>
          <div className="legend-item">
            <img src="https://img.icons8.com/color/48/000000/tornado.png" alt="Tornado" width="20" />
            <span>Tornado</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorldMap;
