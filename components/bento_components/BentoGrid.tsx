'use client';

import { motion } from 'motion/react';
import { BentoCard } from '@/components/bento_components/BentoCard';
import { playfair } from '@/lib/fonts';
import { bentoItems } from '@/lib/data';

export const BentoGrid = () => {
  return (
    <div className='w-screen md:w-[97vw] lg:w-full h-full mx-auto relative'>
      <section className='w-full min-h-screen bg-gray-50 py-20 px:1 md:px-2 lg:px-4'>
        <div className='max-w-[85vw] mx-auto'>
          {/* Header */}
          <motion.div
            className='mb-16'
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className={`text-5xl md:text-6xl font-bold text-gray-900 mb-4 ${playfair.className}`}>
              Explore Our Properties
            </h2>
            <p className='text-gray-600 text-lg max-w-2xl'>
              Discover our curated collection of unique stays. Click to view in immersive 3D scene.
            </p>
          </motion.div>

          {/* Bento Grid */}
          <div className='grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[200px] grid-flow-dense'>
            {bentoItems.map((item, index) => (
              <BentoCard key={item.id} item={item}/>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
