// src\hooks\useGeoLocation.ts
import { useState, useEffect } from "react";

export function useGeoLocation() {
  const [location, setLocation] = useState<{ lat?: number; lon?: number }>({});

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        pos => setLocation({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
        () => setLocation({})
      );
    }
  }, []);

  return location; // { lat, lon } if available
}
