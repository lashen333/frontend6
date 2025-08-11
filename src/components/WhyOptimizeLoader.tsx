// src/components/WhyOptimizeLoader.tsx
"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import { getVisitorId } from "@/utils/visitorId";
import { getUTMParams } from "@/utils/utm";
import WhyOptimizeSection from "./WhyOptimizeSection";

interface Variant {
  _id: string;
  title: string;
  boxes: { heading: string; description: string }[];
}

type Props = {
  campaignId?: string | null;
};

export default function WhyOptimizeLoader({ campaignId }: Props) {
  const [variant, setVariant] = useState<Variant | null>(null);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  // stable refs
  const startTimeRef = useRef<number>(Date.now());
  const variantRef = useRef<Variant | null>(null);
  const apiUrlRef = useRef(apiUrl);
  apiUrlRef.current = apiUrl;

  // ---- Type guard instead of `any` ----
  const isVariant = (data: unknown): data is Variant => {
    if (!data || typeof data !== "object") return false;
    const d = data as Record<string, unknown>;
    const boxes = d.boxes as unknown;
    return (
      typeof d._id === "string" &&
      typeof d.title === "string" &&
      Array.isArray(boxes) &&
      boxes.every(
        (b) =>
          b &&
          typeof b === "object" &&
          typeof (b as any).heading === "string" &&
          typeof (b as any).description === "string"
      )
    );
  };

  // ---- Memoized helpers to satisfy exhaustive-deps ----
  const buildUrls = useCallback(() => {
    const urlParams = new URLSearchParams(
      typeof window !== "undefined" ? window.location.search : ""
    );

    // prefer server-provided campaignId if missing in URL
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
    ] as const;

    const qs = new URLSearchParams();
    passKeys.forEach((k) => {
      const v = urlParams.get(k);
      if (v) qs.set(k, v);
    });

    const hasAny = Array.from(qs.keys()).length > 0;
    return {
      hasAny,
      resolveUrl: `${apiUrlRef.current}/api/get-why-optimize?${qs.toString()}`,
      legacyUrl: `${apiUrlRef.current}/api/get-why-optimize`,
    };
  }, [campaignId]);

  const normalizeVariant = useCallback(
    (data: unknown): Variant | null => {
      if (isVariant(data)) return data;
      // future-proof: if API later returns { whyVariant: {...} }
      if (
        data &&
        typeof data === "object" &&
        "whyVariant" in data &&
        isVariant((data as any).whyVariant)
      ) {
        return (data as any).whyVariant as Variant;
      }
      return null;
    },
    [isVariant]
  );

  useEffect(() => {
    let mounted = true;

    async function fetchVariant() {
      try {
        const { hasAny, resolveUrl, legacyUrl } = buildUrls();

        // try resolver first, then fallback
        const res = await fetch(hasAny ? resolveUrl : legacyUrl, {
          cache: "no-store",
        });
        let data: unknown = await res.json();

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

        // impression
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

        // start timer
        startTimeRef.current = Date.now();
      } catch (err) {
        console.error("Error fetching WhyOptimize variant:", err);
      }
    }

    fetchVariant();

    // cleanup → stay time
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
  }, [buildUrls, normalizeVariant]);

  if (!variant) return <div>Loading...</div>;

  return <WhyOptimizeSection {...variant} />;
}
