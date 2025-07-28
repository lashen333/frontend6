// src\components\UserClusterMap.tsx
"use client";
import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Icon } from "leaflet";

// ✅ Fix default marker icon path without using `any`
delete (Icon.Default.prototype as unknown as { _getIconUrl?: string })._getIconUrl;

Icon.Default.mergeOptions({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

type UserLocation = {
  lat: number;
  lon: number;
  city?: string;
  region?: string;
  country?: string;
  village?: string;
  road?: string;
};

export default function UserClusterMap() {
  const [points, setPoints] = useState<UserLocation[]>([]);

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    fetch(`${apiUrl}/api/user-locations`)
      .then((res) => res.json())
      .then(setPoints)
      .catch(() => setPoints([]));
  }, []);

  if (!points.length) return <div>Loading user map...</div>;

  return (
    <MapContainer
      center={[7.8731, 80.7718]} // Sri Lanka center
      zoom={7}
      style={{ height: 400, width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {points.map((point, i) =>
        point.lat && point.lon ? (
          <Marker key={i} position={[point.lat, point.lon]}>
            <Popup>
              <b>City:</b> {point.city || "Unknown"} <br />
              <b>Region:</b> {point.region || "Unknown"} <br />
              <b>Village:</b> {point.village || "-"} <br />
              <b>Road:</b> {point.road || "-"} <br />
              <b>Country:</b> {point.country || "Unknown"}
            </Popup>
          </Marker>
        ) : null
      )}
    </MapContainer>
  );
}
