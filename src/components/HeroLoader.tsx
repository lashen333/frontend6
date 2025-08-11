// src/components/HeroLoader.tsx
'use client';

import { useEffect, useState } from 'react';
import Hero from './Hero';
import { HeroVariantType } from '@/types/HeroVariant.types';
import { getVisitorId } from '@/utils/visitorId';
import { getUTMParams } from '@/utils/utm';
import { useGeoLocation } from '@/hooks/useGeoLocation';
import { sendAnalyticsEvent } from '@/utils/sendAnalyticsEvent';

type HeroLoaderProps = {
  initialVariant?: HeroVariantType | null;
  campaignId?: string | null;
};

export default function HeroLoader({ initialVariant, campaignId }: HeroLoaderProps) {
  const [variant, setVariant] = useState<HeroVariantType | null>(initialVariant ?? null);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const location = useGeoLocation();

  useEffect(() => {
    if (initialVariant) return;

    // Build query: start from current URL, then ensure campaign_id is present if we have it
    const sp = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
    if (campaignId && !sp.has('campaign_id')) {
      sp.set('campaign_id', campaignId);
    }
    const url = `${apiUrl}/api/get-hero?${sp.toString()}`;

    async function fetchVariant() {
      try {
        const res = await fetch(url, { cache: 'no-store' });
        const data = await res.json();
        setVariant(data);

        const utms = getUTMParams();
        const hasUtm = utms.utm_campaign || utms.utm_content || utms.utm_source;

        if (hasUtm) {
          sendAnalyticsEvent(
            'utm_landing',
            {
              variantId: data.variantId || data._id,
              visitorId: getVisitorId(),
              value: 1,
              utms,
              // use campaignId in analytics too
              campaignId: campaignId ?? sp.get('campaign_id') ?? null,
            },
            location
          );
        }
      } catch (err) {
        console.error('❌ Failed to load hero variant:', err);
      }
    }

    fetchVariant();
  }, [apiUrl, location, initialVariant, campaignId]);

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
