// src/components/WhyOptimizeLoader.tsx
"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import { getVisitorId } from "@/utils/visitorId";
import { getUTMParams } from "@/utils/utm";
import WhyOptimizeSection from "./WhyOptimizeSection";

interface VariantBox {
  heading: string;
  description: string;
}
interface Variant {
  _id: string;
  title: string;
  boxes: VariantBox[];
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

  // Build resolver-style URL using current search params
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

  // Type-safe normalizer (no `any`, no extra deps)
  const normalizeVariant = useCallback((data: unknown): Variant | null => {
    const isBox = (b: unknown): b is VariantBox =>
      typeof b === "object" &&
      b !== null &&
      "heading" in b &&
      "description" in b &&
      typeof (b as Record<string, unknown>).heading === "string" &&
      typeof (b as Record<string, unknown>).description === "string";

    const isVariant = (d: unknown): d is Variant => {
      if (typeof d !== "object" || d === null) return false;
      const r = d as Record<string, unknown>;
      return (
        typeof r._id === "string" &&
        typeof r.title === "string" &&
        Array.isArray(r.boxes) &&
        r.boxes.every(isBox)
      );
    };

    if (isVariant(data)) return data;

    // Support { whyVariant: {...} } shape
    if (
      typeof data === "object" &&
      data !== null &&
      "whyVariant" in data &&
      isVariant((data as { whyVariant?: unknown }).whyVariant)
    ) {
      return (data as { whyVariant: Variant }).whyVariant;
    }

    return null;
  }, []);

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
