// src\components\GeoTracker.tsx
"use client";
import { useEffect } from "react";

export default function GeoTracker() {
  useEffect(() => {
    // Get your backend API URL from .env (for development/production)
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        position => {
          // User allowed location access: send GPS data
          fetch(`${apiUrl}/api/track`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              lat: position.coords.latitude,
              lon: position.coords.longitude,
            }),
          });
        },
        () => {
          // User denied location or error: fallback to IP only
          fetch(`${apiUrl}/api/track`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
          });
        }
      );
    } else {
      // If browser doesn't support geolocation, fallback to IP only
      fetch(`${apiUrl}/api/track`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
    }
  }, []);

  return null; // This component doesn't show anything on the UI
}
