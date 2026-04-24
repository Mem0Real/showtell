'use client';

import { motion } from 'framer-motion';
import { HotelCard } from '@/components/grid_components/HotelCard';

// Grid Component
export const HotelGrid = () => {
  const hotels = [
    { name: 'Grand Horizon', videoSrc: '/videos/v3.mkv' },
    { name: 'Ocean Vista', videoSrc: '/videos/v3.mkv' },
    { name: 'Mountain Retreat', videoSrc: '/videos/v3.mkv' },
    { name: 'Urban Luxury', videoSrc: '/videos/v3.mkv' },
  ];

  return (
    <section className='w-full min-h-screen bg-light py-20 px-4 md:px-8'>
      <div className='max-w-[85vw] mx-auto'>
        <motion.div
          className='mb-16'
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className={`text-5xl md:text-6xl font-bold text-neutral-800 mb-4`}>Properties Showcase</h2>
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
              <HotelCard hotel={hotel} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
