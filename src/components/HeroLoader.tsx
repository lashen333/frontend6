// src\components\HeroLoader.tsx
'use client';

import { useEffect, useState } from 'react';
import Hero from './Hero';
import { HeroVariantType } from '@/types/HeroVariant.types';

export default function HeroLoader() {
  const [variant, setVariant] = useState<HeroVariantType | null>(null);

  useEffect(() => {
    async function fetchVariant() {
      try {
        const res = await fetch('http://localhost:5000/api/get-hero');
        const data = await res.json();
        setVariant(data);
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
