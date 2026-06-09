import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import './App.css';

const getMarkerIcon = (type) => {
  let color = 'blue'; // Default color
  
  if (type === 'Flood') color = 'red';
  if (type === 'Shelter') color = 'green';
  if (type === 'Blocked Road') color = 'orange';
  if (type === 'Medical') color = 'violet';

  return new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });
};

function App() {
  const defaultPosition = [35.7915, -78.7812];
  const [incidents, setIncidents] = useState([
    { id: 1, position: [35.7940, -78.7820], type: 'Flood', notes: 'Main St. flooded under the bridge.' },
    { id: 2, position: [35.7900, -78.7750], type: 'Shelter', notes: 'Community Center open. High capacity.' }
  ]);

  const [selectedType, setSelectedType] = useState('Flood');
  const [notes, setNotes] = useState('');

  function MapClickHandler() {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        const userNotes = prompt("Enter details for this incident (e.g., 'Downed power line'):");
        
        if (userNotes) {
          const newIncident = {
            id: Date.now(),
            position: [lat, lng],
            type: selectedType,
            notes: userNotes
          };
          
          setIncidents([...incidents, newIncident]);
        }
      },
    });
    return null;
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>CrisisMap: Community Disaster Response</h1>
        <p>Live crowdsourced hazard and resource tracking</p>
      </header>
      
      <main className="app-content">
        {/* Left Control Sidebar */}
        <div className="sidebar">
          <h3>Report an Incident</h3>
          <p className="instruction-text">
            1. Select the marker type below.<br />
            2. <strong>Click anywhere on the map</strong> to place it!
          </p>

          <div className="form-group">
            <label>Marker Type:</label>
            <select 
              value={selectedType} 
              onChange={(e) => setSelectedType(e.target.value)}
              className="type-select"
            >
              <option value="Flood">🔴 Flood / Hazard</option>
              <option value="Shelter">🟢 Safe Shelter</option>
              <option value="Blocked Road">🟠 Blocked Road</option>
              <option value="Medical">🔵 Medical Aid</option>
            </select>
          </div>

          <div className="legend">
            <h4>Map Tracking Legend</h4>
            <p>🔴 Active Hazard Reports</p>
            <p>🟢 Available Safe Shelters</p>
            <p>🟠 Structural/Road Blocks</p>
            <p>🔵 Medical Stations</p>
          </div>
        </div>

        <div className="map-wrapper">
          <MapContainer 
            center={defaultPosition} 
            zoom={14} 
            scrollWheelZoom={true}
            className="leaflet-container"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            <MapClickHandler />
        
            {incidents.map((incident) => (
              <Marker key={incident.id} position={incident.position} icon={getMarkerIcon(incident.type)}>
                <Popup>
                  <strong>[{incident.type}]</strong>
                  <br />
                  {incident.notes}
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </main>
    </div>
  );
}

export default App;
