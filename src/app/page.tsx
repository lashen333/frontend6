// src\app\page.tsx
'use client';

import { useEffect, useState } from 'react';
import Hero from '@/components/Hero';

interface HeroContent {
  title: string;
  subtitle: string;
  ctaText: string;
}

export default function Home() {
  const [content, setContent] = useState<HeroContent>({
    title: "Unlock More Conversions with Smart Optimization",
    subtitle: "Track, analyze, and personalize your landing page in real time.",
    ctaText: "Get Started",
  });

  useEffect(() => {
    fetch("http://localhost:5000/api/optimize-content")
      .then(res => res.json())
      .then(data => {
        if (data.change && data.variant) {
          console.log("🎯 Updating Hero content:", data.variant);
          setContent(data.variant);
        }
      })
      .catch(err => console.error("Failed to fetch optimization data", err));
  }, []);

  return (
    <main>
      <Hero
        title={content.title}
        subtitle={content.subtitle}
        ctaText={content.ctaText}
        onCtaClick={() => console.log("CTA Clicked!")}
      />
    </main>
  );
}
