'use client';

import { useEffect } from 'react';
import { initLenis } from '@/lib/lenis';
import Hero from '@/components/Hero';
import HotelGrid from '@/components/HotelGrid';

export default function Home() {
  useEffect(() => {
    initLenis();
  }, []);

  return (
    <main className='bg-neutral-200'>
      <Hero />
      <HotelGrid />
    </main>
  );
}
