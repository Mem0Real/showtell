'use client';

import { motion } from 'framer-motion';

interface Hotel {
  name: string;
}

export const HotelCard = ({ hotel, onOpen }: { hotel: Hotel; onOpen: (hotel: Hotel) => void }) => {
  const dir = hotel.name.replaceAll(' ', '_').toLowerCase();

  return (
    <motion.div
      className='relative w-full h-125 rounded-2xl overflow-hidden cursor-pointer'
      whileHover={{ scale: 1.02 }}
      onClick={() => onOpen(hotel)}
    >
      <img src={`/3d/hotels/${dir}/card.png`} className='absolute inset-0 w-full h-full object-cover' />

      <div className='absolute inset-0 bg-linear-to-t from-black/80 to-transparent' />

      <div className='absolute bottom-0 p-6 text-white'>
        <h3 className='text-2xl font-bold'>{hotel.name}</h3>
        <p className='text-sm opacity-70'>Click to explore</p>
      </div>
    </motion.div>
  );
};
