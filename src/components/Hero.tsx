// src\components\Hero.tsx
'use client';

import { useEffect } from 'react';
import { getVisitorId } from '@/utils/visitorId';

interface HeroProps {
  title: string;
  subtitle: string;
  ctaText: string;
  variantId: string;
  onCtaClick?: () => void;
}

type AnalyticsPayload = {
  event: string;
  variantId: string;
  visitorId: string;
  userAgent: string;
  timestamp: number;
  value?: number;
};

export default function Hero({ title, subtitle, ctaText, variantId, onCtaClick }: HeroProps) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  // Helper to POST analytics event to backend
  const trackEvent = (event: string, value?: number) => {
    const visitorId = getVisitorId();
    const userAgent = typeof navigator !== 'undefined' ? navigator.userAgent : '';
    const payload: AnalyticsPayload = {
      event,
      variantId,
      visitorId,
      userAgent,
      timestamp: Date.now(),
    };
    if (typeof value !== 'undefined') payload.value = value;

    fetch(`${apiUrl}/api/track`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }).catch((err) => console.error(`❌ Failed to send ${event}:`, err));
  };

  useEffect(() => {
    const start = Date.now();

    const handleLeave = () => {
      const duration = Date.now() - start;
      // GTM event (optional)
      window.dataLayer?.push({
        event: 'stay_time',
        value: duration,
        variantId,
        visitorId: getVisitorId(),
      });
      console.log('📊 stay_time sent to GTM:', duration);
      // Backend analytics
      trackEvent('stay_time', duration);
    };

    const visibilityHandler = () => {
      if (document.visibilityState === 'hidden') handleLeave();
    };
    document.addEventListener('visibilitychange', visibilityHandler);

    return () => {
      document.removeEventListener('visibilitychange', visibilityHandler);
    };
    // eslint-disable-next-line
  }, [variantId]);

  const handleCta = () => {
    // GTM event (optional)
    window.dataLayer?.push({
      event: 'cta_click',
      variantId,
      visitorId: getVisitorId(),
    });
    console.log('📊 cta_click sent to GTM');
    // Backend analytics
    trackEvent('cta_click');

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
