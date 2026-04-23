'use client';

import { useEffect } from 'react';
import { initLenis } from '@/lib/lenis';

import { Hero } from '@/components/hero_components/Hero';
import { HotelGrid } from '@/components/grid_components/HotelGrid';
import { ClipMask } from '@/components/ClipMask';
import { BentoGrid } from '@/components/bento_components/BentoGrid';
import { AnotherClipMask } from '@/components/AnotherClipMask';

export default function Home() {
  useEffect(() => {
    initLenis();
  }, []);

  return (
    <main className='w-full h-full bg-light'>
      <Hero />
      <HotelGrid />
      <ClipMask />
      <BentoGrid />
      <AnotherClipMask />
      <div className='h-screen w-full bg-linear-to-b from-gray-50 to-light'></div>
    </main>
  );
}
