// src\components\HeroLoader.tsx
'use client';

import { useEffect, useState } from 'react';
import Hero from './Hero';
import { HeroVariantType } from '@/types/HeroVariant.types';

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

        //Track the UTM load itself
        if (searchParams.includes(`utm_`)){
          const urlParams = new URLSearchParams(searchParams);
          fetch(`${apiUrl}/api/track`,{
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              event: 'utm_landing',
              variantId: data.variantId,
              value: 1,
              utms: Object.fromEntries(urlParams.entries())
            })
          });
        }
        console.log("📊 Hero variant loaded:", data);
      } catch (err) {
        console.error('❌ Failed to load hero variant:', err);
      }
    }

    fetchVariant();
  }, []);

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
