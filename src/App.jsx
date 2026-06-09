import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import './App.css';

import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

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
