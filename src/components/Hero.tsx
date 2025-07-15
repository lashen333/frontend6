// src\components\Hero.tsx
'use client';

import { useEffect } from 'react';

interface HeroProps {
  title: string;
  subtitle: string;
  ctaText: string;
  variantId: string;
  onCtaClick?: () => void;
}

export default function Hero({ title, subtitle, ctaText, variantId, onCtaClick }: HeroProps) {
  useEffect(() => {
    const start = Date.now();

    const handleLeave = () => {
      const duration = Date.now() - start;
      // Send stay_time to GTM
      window.dataLayer?.push({
        event: 'stay_time',
        value: duration,
        variantId,
      });
      console.log("📊 stay_time sent to GTM:", duration);

      //✅ Send to backend
      fetch('http://localhost:5000/api/track',{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          event: 'stay_time',
          value: duration,
          variantId,
        }),
      }).catch((err) => console.error('❌ Failed to send stay_time:', err));
    };

    const visibilityHandler = () => {
      if (document.visibilityState === 'hidden') {
        handleLeave();
      }
    };

    document.addEventListener('visibilitychange', visibilityHandler);

    return () =>{
      document.removeEventListener('visibilitychange', visibilityHandler);
      
    }
  }, [variantId]);

  const handleCta = () => {
    // Send CTA click to GTM
    window.dataLayer?.push({
      event: 'cta_click',
      variantId,
    });
    console.log("📊 cta_click sent to GTM");

    // ✅ Send to backend
    fetch('http://localhost:5000/api/track', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        event: 'cta_click',
        variantId,
      }),
    }).catch((err) => console.error('❌ Failed to send cta_click:', err));

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
