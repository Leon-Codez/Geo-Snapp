import React, { useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

function LeafletMap() {
  useEffect(() => {
    // Create the map
    const map = L.map('map').setView([43.0379, -76.1349], 13);

    // Add the tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    // Add sample markers
    const visited = [
      {
        id: 1,
        name: 'Syracuse Landmark',
        lat: 43.0379,
        lng: -76.1349,
        desc: 'Visited on your first day!'
      },
      {
        id: 2,
        name: 'Downtown Plaza',
        lat: 43.0412,
        lng: -76.1505,
        desc: 'Unlocked after event!'
      }
    ];

    visited.forEach((place) => {
      L.marker([place.lat, place.lng])
        .addTo(map)
        .bindPopup(`<strong>${place.name}</strong><br>${place.desc}`);
    });
  }, []);

  return (
    <div style={{ height: '500px', width: '100%', marginTop: '20px' }}>
      <div id="map" style={{ height: '100%' }}></div>
    </div>
  );
}

export default LeafletMap;
