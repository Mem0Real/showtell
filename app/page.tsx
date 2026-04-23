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
    <main className='w-full h-full bg-light'>
      <Hero />
      <HotelGrid />
      <div className='h-screen w-full bg-accentSoft'></div>
    </main>
  );
}
