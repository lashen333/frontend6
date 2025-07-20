// src/components/HeroLoader.tsx
'use client';

import { useEffect, useState } from 'react';
import Hero from './Hero';
import { HeroVariantType } from '@/types/HeroVariant.types';
import { getVisitorId } from '@/utils/visitorId';
import { getUTMParams } from '@/utils/utm';

export default function HeroLoader() {
  const [variant, setVariant] = useState<HeroVariantType | null>(null);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

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
          const visitorId = getVisitorId();
          const userAgent = navigator.userAgent;
          fetch(`${apiUrl}/api/track`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              event: 'utm_landing',
              variantId: data.variantId || data._id,
              value: 1,
              utms,
              visitorId,
              userAgent,
              timestamp: Date.now(),
            }),
          });
        }
        console.log('📊 Hero variant loaded:', data);
      } catch (err) {
        console.error('❌ Failed to load hero variant:', err);
      }
    }

    fetchVariant();
    // apiUrl in deps in case you change env
  }, [apiUrl]);

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
