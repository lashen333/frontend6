// src\components\Hero.tsx
'use client';

import { useEffect } from 'react';
import { getVisitorId } from '@/utils/visitorId';
import { useGeoLocation } from '@/hooks/useGeoLocation';
import { sendAnalyticsEvent } from '@/utils/sendAnalyticsEvent';

interface HeroProps {
  title: string;
  subtitle: string;
  ctaText: string;
  variantId: string;
  onCtaClick?: () => void;
}

export default function Hero({ title, subtitle, ctaText, variantId, onCtaClick }: HeroProps) {
  const location = useGeoLocation();

  // Track "stay_time" event on page leave/visibility change
  useEffect(() => {
    const start = Date.now();

    const handleLeave = () => {
      const duration = Date.now() - start;
      // GTM event (unchanged)
      window.dataLayer?.push({
        event: 'stay_time',
        value: duration,
        variantId,
        visitorId: getVisitorId(),
      });
      console.log('📊 stay_time sent to GTM:', duration);
      // Backend analytics (updated to include GPS location if available)
      sendAnalyticsEvent('stay_time', { variantId, value: duration }, location);
    };

    const visibilityHandler = () => {
      if (document.visibilityState === 'hidden') handleLeave();
    };
    document.addEventListener('visibilitychange', visibilityHandler);

    return () => {
      document.removeEventListener('visibilitychange', visibilityHandler);
    };
  }, [variantId, location.lat, location.lon]); // re-run if location updates

  // Track CTA click
  const handleCta = () => {
    // GTM event (unchanged)
    window.dataLayer?.push({
      event: 'cta_click',
      variantId,
      visitorId: getVisitorId(),
    });
    console.log('📊 cta_click sent to GTM');
    // Backend analytics (with location)
    sendAnalyticsEvent('cta_click', { variantId }, location);

    if (onCtaClick) onCtaClick();
  };

  return (
    <section className="min-h-screen flex flex-col justify-center items-center text-center px-4 bg-gradient-to-b from-white to-gray-100">
      <h1 className="text-4xl sm:text-5xl font-bold mb-4">{title}</h1>
      <p className="text-lg sm:text-xl text-gray-700 mb-6 max-w-xl">{subtitle}</p>
      <button
        onClick={handleCta}
        className="bg-blue-600 text-white px-6 py-3 rounded-xl text-lg hover:bg-blue-700 transition-all"
      >
        {ctaText}
      </button>
    </section>
  );
}
