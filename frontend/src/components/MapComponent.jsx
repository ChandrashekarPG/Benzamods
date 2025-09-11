// MapComponent.jsx
import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

export default function MapComponent() {
  // Your location coordinates (example: Bangalore)
  const position = [12.9716, 77.5946];

  return (
    <div id="map">
      <MapContainer center={position} zoom={13} scrollWheelZoom={true} style={{ height: "100%", width: "100%" }}>
        {/* OpenStreetMap tiles */}
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={position}>
          <Popup>My Location</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
