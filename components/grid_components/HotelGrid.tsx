'use client';

import { motion } from 'framer-motion';
import { HotelCard } from '@/components/grid_components/HotelCard';
import { playfair } from '@/lib/fonts';
import { useState } from 'react';
import { HDRIModal } from '@/components/grid_components/HDRIModal';

// Grid Component
export const HotelGrid = () => {
  const [activeHotel, setActiveHotel] = useState<any>(null);

  const dir = '/3d/hotels/';

  const hotels = [
    {
      name: 'Hilton Hotel',
      hdriSrc: `${dir}/hilton_hotel/hotel_room.jpg`,
      previewSrc: `${dir}/hilton_hotel/ht2.jpg`,
    },
    {
      name: 'Radison Blu Hotel',
      hdriSrc: `${dir}/radison_blu_hotel/hotel_room.jpg`,
      previewSrc: `${dir}/radison_blu_hotel/ht2.jpg`,
    },
    {
      name: 'Getfam Hotel',
      hdriSrc: `${dir}/getfam_hotel/hotel_room.jpg`,
      previewSrc: `${dir}/getfam_hotel/ht2.jpg`,
    },
    {
      name: 'Sarem International Hotel',
      hdriSrc: `${dir}/sarem_international_hotel/hotel_room.jpg`,
      previewSrc: `${dir}/sarem_international_hotel/ht2.jpg`,
    },
  ];

  return (
    <section className='w-full min-h-screen bg-light py-20 px-4 md:px-8'>
      <div className='max-w-[80vw] md:max-w-[85vw] mx-auto'>
        <motion.div
          className='mb-16'
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className={`text-5xl md:text-6xl font-bold text-neutral-800 mb-4 ${playfair.className}`}>
            Properties Showcase
          </h2>
          <p className='text-neutral-800/60 text-lg'>Drag on the images to explore every detail</p>
        </motion.div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          {hotels.map((hotel, index) => (
            <motion.div
              key={hotel.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
            >
              <HotelCard hotel={hotel} onOpen={setActiveHotel} />
            </motion.div>
          ))}

          {activeHotel && <HDRIModal hotel={activeHotel} onClose={() => setActiveHotel(null)} />}
        </div>
      </div>
    </section>
  );
};
