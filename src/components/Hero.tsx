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
  }, [variantId, location]); // re-run if location updates

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
    <section className="relative min-h-screen flex flex-col justify-center items-center text-center px-6 sm:px-8 bg-gradient-to-br from-black via-gray-900 to-black overflow-hidden">
      {/* Decorative background glows */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-yellow-400 rounded-full blur-3xl opacity-20 -translate-x-1/3 -translate-y-1/3 animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-yellow-300 rounded-full blur-3xl opacity-20 translate-x-1/3 translate-y-1/3 animate-pulse delay-200"></div>

      {/* Content */}
      <h1
        className="text-4xl sm:text-6xl font-extrabold leading-tight mb-6 text-yellow-400 drop-shadow-lg animate-fadeInDown"
        style={{ animationDelay: "0.2s" }}
      >
        {title}
      </h1>
      <p
        className="text-lg sm:text-xl text-gray-300 mb-8 max-w-2xl leading-relaxed animate-fadeInUp"
        style={{ animationDelay: "0.4s" }}
      >
        {subtitle}
      </p>

      {/* CTA Button */}
      <button
        onClick={handleCta}
        className="relative bg-yellow-400 text-black px-8 py-4 rounded-2xl text-lg font-bold shadow-lg hover:bg-yellow-300 hover:scale-105 hover:shadow-2xl transition-all duration-300 ease-in-out animate-fadeInUp"
        style={{ animationDelay: "0.6s" }}
      >
        <span className="relative z-10">{ctaText}</span>
        <span className="absolute inset-0 bg-white/20 rounded-2xl opacity-0 hover:opacity-100 transition-all duration-300"></span>
      </button>
    </section>


  );
}
