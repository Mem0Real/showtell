'use client';

import { motion } from 'framer-motion';

export const AnotherClipMask = () => {
  const motto = 'Your Safe Haven Awaits';

  return (
    <section className='relative w-full py-24 md:py-32 bg-linear-to-b from-gray-50 to-light overflow-hidden'>
      <div className='max-w-full lg:max-w-4xl mx-auto px-2 lg:px-4'>
        {/* Hand-drawn border box */}
        <div className='relative'>
          {/* SVG Border */}
          <motion.svg
            className='absolute -inset-8 md:-inset-12'
            viewBox='0 0 500 200'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
            preserveAspectRatio='none'
          >
            {/* Top-left corner */}
            <motion.path
              d='M20 10 C 10 10, 5 20, 5 35 L 5 160 C 5 175, 15 190, 30 190'
              stroke='currentColor'
              strokeWidth='2.5'
              strokeLinecap='round'
              fill='none'
              className='text-gray-300'
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, ease: 'easeInOut' }}
            />

            {/* Bottom-right corner */}
            <motion.path
              d='M480 190 C 490 190, 495 180, 495 165 L 495 40 C 495 25, 485 10, 470 10'
              stroke='currentColor'
              strokeWidth='2.5'
              strokeLinecap='round'
              fill='none'
              className='text-gray-300'
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, ease: 'easeInOut', delay: 0.3 }}
            />

            {/* Scribble accents on corners */}
            <motion.path
              d='M25 25 Q 30 15, 40 25 Q 50 35, 55 25'
              stroke='currentColor'
              strokeWidth='1.5'
              strokeLinecap='round'
              fill='none'
              className='text-gray-400'
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.6 }}
            />

            <motion.path
              d='M450 175 Q 455 185, 465 175 Q 475 165, 480 175'
              stroke='currentColor'
              strokeWidth='1.5'
              strokeLinecap='round'
              fill='none'
              className='text-gray-400'
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.9 }}
            />

            {/* Side scribbles */}
            <motion.path
              d='M5 80 Q 15 75, 5 70 Q 15 65, 5 60'
              stroke='currentColor'
              strokeWidth='1'
              strokeLinecap='round'
              fill='none'
              className='text-gray-300/60'
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, delay: 1.2 }}
            />

            <motion.path
              d='M495 80 Q 485 75, 495 70 Q 485 65, 495 60'
              stroke='currentColor'
              strokeWidth='1'
              strokeLinecap='round'
              fill='none'
              className='text-gray-300/60'
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, delay: 1.2 }}
            />
          </motion.svg>

          {/* Content inside the border */}
          <motion.div
            className='relative py-16 md:py-20 text-center'
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <h2 className='text-5xl md:text-7xl font-bold text-gray-900 mb-4'>{motto}</h2>
            <div className='w-24 h-1 bg-linear-to-r from-transparent via-gray-400 to-transparent mx-auto mt-6' />
            <p className='mt-6 text-gray-600 text-lg max-w-md mx-auto'>
              Discover extraordinary rooms designed to inspire and delight you
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
