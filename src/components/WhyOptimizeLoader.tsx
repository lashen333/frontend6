// src\components\WhyOptimizeLoader.tsx
"use client";
import { useEffect, useState, useRef } from "react";
import { getVisitorId } from "@/utils/visitorId";
import { getUTMParams } from "@/utils/utm";
import WhyOptimizeSection from "./WhyOptimizeSection";

interface Variant {
  _id: string;
  title: string;
  boxes: { heading: string; description: string }[];
}

export default function WhyOptimizeLoader() {
  const [variant, setVariant] = useState<Variant | null>(null);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const startTime = useRef<number>(Date.now());

  useEffect(() => {
    async function fetchVariant() {
      try {
        const res = await fetch(`${apiUrl}/api/get-why-optimize`);
        const data: Variant = await res.json();
        setVariant(data);

        // Track Impression
        fetch(`${apiUrl}/api/track-why-optimize`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            event: "why_optimize_impression",
            variantId: data._id,
            userId: getVisitorId(),
            utms: getUTMParams(),
            timestamp: Date.now(),
          }),
        });

        // Start stay time timer
        startTime.current = Date.now();
      } catch (err) {
        console.error("Error fetching WhyOptimize variant:", err);
      }
    }

    fetchVariant();

    // When user leaves, track stay time
    return () => {
      if (variant) {
        const stayTime = Math.floor((Date.now() - startTime.current) / 1000);
        fetch(`${apiUrl}/api/track-why-optimize`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            event: "why_optimize_stay_time",
            variantId: variant._id,
            userId: getVisitorId(),
            utms: getUTMParams(),
            stayTime,
            timestamp: Date.now(),
          }),
        });
      }
    };
  }, [apiUrl, variant]);

  if (!variant) return <div>Loading...</div>;

  return <WhyOptimizeSection {...variant} />;
}
