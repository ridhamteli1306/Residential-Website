import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import api from '../services/api';

import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

// Fix for default marker icons in React-Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl,
    iconUrl,
    shadowUrl
});

// Main Gate coordinates (simulated center of complex)
const centerPosition = [10.998356, -63.856972]; // Approximated Porlamar/Guacuco area

const CommunityMap = () => {
    const [units, setUnits] = useState([]);

    useEffect(() => {
        const fetchUnits = async () => {
            try {
                const response = await api.get('/units');
                // For the prototype, we will randomly assign slight coordinate offsets around the center
                // to visualize units on the map, since actual lat/long aren't stored in SQLite yet
                const unitsWithSimulatedCoords = response.data.map(unit => ({
                    ...unit,
                    lat: centerPosition[0] + (Math.random() - 0.5) * 0.005,
                    lng: centerPosition[1] + (Math.random() - 0.5) * 0.005
                }));
                setUnits(unitsWithSimulatedCoords);
            } catch (error) {
                console.error("Error fetching units for map", error);
            }
        };
        fetchUnits();
    }, []);

    return (
        <MapContainer center={centerPosition} zoom={16} style={{ height: '100%', width: '100%', zIndex: 0 }}>
            {/* Standard OpenStreetMap Tiles (Free, no API Key needed) */}
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* Main Gate Marker */}
            <Marker position={centerPosition}>
                <Popup>
                    <strong>Main Security Gate</strong><br />
                    Terrazas de Guacuco Entrance
                </Popup>
            </Marker>

            {/* Distributed Unit Markers */}
            {units.slice(0, 50).map(unit => ( // Render only first 50 to keep map performant
                <Marker key={unit.id} position={[unit.lat, unit.lng]}>
                    <Popup>
                        <strong>Unit: {unit.number}</strong><br />
                        Type: {unit.type.replace(/_/g, ' ')}<br />
                        Owner: {unit.owner?.name || 'Vacant'}
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
};

export default CommunityMap;
