'use client';

import { useEffect } from 'react';
import { initLenis } from '@/lib/lenis';

import { Hero } from '@/components/hero_components/Hero';
import { HotelGrid } from '@/components/grid_components/HotelGrid';
import { ClipMask } from '@/components/ClipMask';
import { BentoGrid } from '@/components/bento_components/BentoGrid';
import { AnotherClipMask } from '@/components/AnotherClipMask';
import { Contact } from '@/components/contact_components/Contact';
import { Footer } from '@/components/Footer';

/* TODO 
  - contact interactive elements not working
  - 3D modal needs fixing
  - compress images
*/
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
      <Contact />
      <Footer />
    </main>
  );
}
