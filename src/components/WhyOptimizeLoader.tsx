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

type Props = {
  campaignId?: string | null; // optional; passed from server page if available
};

export default function WhyOptimizeLoader({ campaignId }: Props) {
  const [variant, setVariant] = useState<Variant | null>(null);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  // keep original features but make them robust against re-renders
  const startTimeRef = useRef<number>(Date.now());
  const variantRef = useRef<Variant | null>(null);
  const apiUrlRef = useRef(apiUrl);
  apiUrlRef.current = apiUrl;

  // Build resolver-style URL using current search params
  function buildUrls() {
    const urlParams = new URLSearchParams(
      typeof window !== "undefined" ? window.location.search : ""
    );

    // allow server-provided campaignId to override if missing in URL
    if (campaignId && !urlParams.get("campaign_id")) {
      urlParams.set("campaign_id", String(campaignId));
    }

    const passKeys = [
      "ad_id",
      "campaign_id",
      "post_id",
      "utm_source",
      "utm_campaign",
      "utm_content",
    ];

    const qs = new URLSearchParams();
    passKeys.forEach((k) => {
      const v = urlParams.get(k);
      if (v) qs.set(k, v);
    });

    const hasAny = Array.from(qs.keys()).length > 0;
    return {
      hasAny,
      resolveUrl: `${apiUrlRef.current}/api/get-why-optimize?${qs.toString()}`, // if you create a resolver for WhyOptimize later, just swap endpoint
      legacyUrl: `${apiUrlRef.current}/api/get-why-optimize`, // original endpoint you already had
    };
  }

  // Normalize in case your API returns different shapes later
  function normalizeVariant(data: any): Variant | null {
    if (!data) return null;
    if (data._id && data.title && Array.isArray(data.boxes)) return data as Variant;
    // If later you return { whyVariant: {...} } you can adapt here.
    return null;
  }

  useEffect(() => {
    let mounted = true;

    async function fetchVariant() {
      try {
        const { hasAny, resolveUrl, legacyUrl } = buildUrls();

        // Try resolver-style (with params) first; fall back to legacy
        const res = await fetch(hasAny ? resolveUrl : legacyUrl, { cache: "no-store" });
        let data = await res.json();

        let v = normalizeVariant(data);
        if (!v && hasAny) {
          const res2 = await fetch(legacyUrl, { cache: "no-store" });
          data = await res2.json();
          v = normalizeVariant(data);
        }
        if (!v) throw new Error("No valid WhyOptimize variant");

        if (!mounted) return;
        setVariant(v);
        variantRef.current = v;

        // ---- Impression tracking (kept) ----
        fetch(`${apiUrlRef.current}/api/track-why-optimize`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            event: "why_optimize_impression",
            variantId: v._id,
            userId: getVisitorId(),
            utms: getUTMParams(),
            timestamp: Date.now(),
          }),
        }).catch(() => {});

        // Start/Reset stay-time timer (kept)
        startTimeRef.current = Date.now();
      } catch (err) {
        console.error("Error fetching WhyOptimize variant:", err);
      }
    }

    fetchVariant();

    // Cleanup — track stay time on unmount (kept)
    return () => {
      mounted = false;
      const v = variantRef.current;
      if (v) {
        const stayTime = Math.floor((Date.now() - startTimeRef.current) / 1000);
        fetch(`${apiUrlRef.current}/api/track-why-optimize`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            event: "why_optimize_stay_time",
            variantId: v._id,
            userId: getVisitorId(),
            utms: getUTMParams(),
            stayTime,
            timestamp: Date.now(),
          }),
        }).catch(() => {});
      }
    };
    // only run on mount/unmount; internal refs handle updates
  }, [campaignId]);

  if (!variant) return <div>Loading...</div>;

  return <WhyOptimizeSection {...variant} />;
}
