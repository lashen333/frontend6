// src\components\HeroLoader.tsx
'use client';

import { useEffect, useState } from 'react';
import Hero from './Hero';
import { HeroVariantType } from '@/types/HeroVariant.types';
import { getVisitorId } from '@/utils/visitorId';
import { getUTMParams } from '@/utils/utm';
import { useGeoLocation } from '@/hooks/useGeoLocation';
import { sendAnalyticsEvent } from '@/utils/sendAnalyticsEvent';


export default function HeroLoader() {
  const [variant, setVariant] = useState<HeroVariantType | null>(null);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const location = useGeoLocation();

  useEffect(() => {
    const searchParams = window.location.search;
    const url = `${apiUrl}/api/get-hero${searchParams}`;

    async function fetchVariant() {
      try {
        const res = await fetch(url);
        const data = await res.json();
        setVariant(data);

        // Track UTM landing event with analytics data
        const utms = getUTMParams();
        const hasUtm = utms.utm_campaign || utms.utm_content || utms.utm_source;

        if (hasUtm) {
          // Use the modular sender so location is included!
          sendAnalyticsEvent(
            "utm_landing",
            {
              variantId: data.variantId || data._id,
              visitorId: getVisitorId(),
              value: 1,
              utms,
            },
            location // always pass latest location
          );
        }

        console.log('📊 Hero variant loaded:', data);
      } catch (err) {
        console.error('❌ Failed to load hero variant:', err);
      }
    }

    fetchVariant();
  // Add location to deps so we track with latest GPS when ready
  }, [apiUrl, location]);

  if (!variant) return <div className="text-center p-10">Loading...</div>;

  return (
    <Hero
      title={variant.title}
      subtitle={variant.subtitle}
      ctaText={variant.ctaText}
      variantId={variant._id}
    />
  );
}
