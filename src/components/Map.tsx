'use client';

import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect } from 'react';
import L from 'leaflet';

type Location = {
    lat: number;
    lng: number;
    label: string;
};


function FitBounds({ locations }: { locations: Location[] }) {
    const map = useMap();

    useEffect(() => {
        if (locations.length === 0) return;

        const bounds = L.latLngBounds(locations.map((loc) => [loc.lat, loc.lng]));
        map.fitBounds(bounds, { padding: [30, 30] });
    }, [locations, map]);

    return null;
}

export default function LeafletMap({ locations }: { locations: Location[] }) {
    const center = locations.length > 0 ? [locations[0].lat, locations[0].lng] : [20.5937, 78.9629]; // default to India center

    return (
        <MapContainer center={center as L.LatLngExpression} zoom={10} style={{ height: '500px', width: '100%' }} scrollWheelZoom={true}>
            <TileLayer attribution='&copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {locations.map((loc, index) => (
                <Marker key={index} position={[loc.lat, loc.lng]}>
                    <Popup>{loc.label}</Popup>
                </Marker>
            ))}
            <FitBounds locations={locations} />
        </MapContainer>
    );
}