// src\app\page.tsx
'use client';

import HeroLoader from '@/components/HeroLoader';
import GeoTracker from '@/components/GeoTracker';
import WhyOptimizeLoader from '@/components/WhyOptimizeLoader';

export default function Home() {
  return (
    <main>
      <GeoTracker />
      
      {/* This component is responsible for loading the hero section */}
      {/* It will show a loading state until the hero data is fetched */}
      <HeroLoader />
      {/* This component loads the "Why Optimize" section */}
      <WhyOptimizeLoader />
      
    </main>
  );
}
