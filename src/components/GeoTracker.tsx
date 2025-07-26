"use client";
import { useEffect } from "react";
import { getVisitorId } from "@/utils/visitorId";

export default function GeoTracker() {
  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";

    // Use your visitorId utility
    const analyticsData = {
      event: "page_view",           // Customize this as needed
      variantId: "default",         // Or dynamically set per page/experiment
      visitorId: getVisitorId(),    // Now using your reusable util!
      userAgent: window.navigator.userAgent,
      utms: {},                     // Populate if you track UTM params
      timestamp: Date.now()
    };

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        position => {
          fetch(`${apiUrl}/api/track`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              ...analyticsData,
              lat: position.coords.latitude,
              lon: position.coords.longitude
            }),
          });
        },
        () => {
          fetch(`${apiUrl}/api/track`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(analyticsData),
          });
        }
      );
    } else {
      fetch(`${apiUrl}/api/track`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(analyticsData),
      });
    }
  }, []);

  return null;
}
