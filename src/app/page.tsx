// src\app\page.tsx
'use client';

import HeroLoader from '@/components/HeroLoader';
import GeoTracker from '@/components/GeoTracker';

export default function Home() {
  return (
    <main>
      <GeoTracker />
      
      {/* This component is responsible for loading the hero section */}
      {/* It will show a loading state until the hero data is fetched */}
      <HeroLoader />
      
    </main>
  );
}
