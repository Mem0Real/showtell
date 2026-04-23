'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

// SVG Scribble Path Component
const ScribbleDivider = () => {
  return (
    <svg
      className='absolute inset-0 w-full h-full'
      preserveAspectRatio='none'
      viewBox='0 0 1200 120'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      {/* Multiple scribble paths for organic feel */}

      {/* Main scribble line - top */}
      <motion.path
        d='M-50 40 C 100 10, 200 80, 350 35 C 500 -10, 550 70, 700 45 C 850 20, 950 65, 1100 30 C 1150 10, 1200 50, 1250 35'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        fill='none'
        className='text-gray-400'
        initial={{ pathLength: 0, opacity: 0 }}
        whileInView={{ pathLength: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 2, ease: 'easeInOut' }}
      />

      {/* Secondary scribble line - bottom */}
      <motion.path
        d='M-50 80 C 150 110, 300 50, 450 85 C 600 120, 700 60, 850 75 C 1000 90, 1050 55, 1200 70 C 1220 75, 1240 65, 1250 80'
        stroke='currentColor'
        strokeWidth='1.5'
        strokeLinecap='round'
        fill='none'
        className='text-gray-300'
        initial={{ pathLength: 0, opacity: 0 }}
        whileInView={{ pathLength: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 2.5, ease: 'easeInOut', delay: 0.3 }}
      />

      {/* Decorative scribble dots */}
      <motion.path
        d='M100 25 Q 150 15 200 25 Q 250 35 300 25'
        stroke='currentColor'
        strokeWidth='1.5'
        strokeLinecap='round'
        fill='none'
        className='text-gray-300/50'
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5, delay: 0.5 }}
      />

      {/* Short scribble accents */}
      <motion.path
        d='M500 60 Q 520 50 540 60'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        fill='none'
        className='text-gray-400/60'
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 1 }}
      />

      <motion.path
        d='M800 55 Q 820 65 840 55'
        stroke='currentColor'
        strokeWidth='1.5'
        strokeLinecap='round'
        fill='none'
        className='text-gray-400/60'
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 1.2 }}
      />
    </svg>
  );
};

// Alternative: Curvy scribble with slanted ends
const CurvyScribbleDivider = () => {
  return (
    <svg
      className='absolute inset-0 w-full h-full'
      preserveAspectRatio='none'
      viewBox='0 0 1200 200'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      {/* Slanted left end */}
      <motion.path
        d='M-20 180 L 50 20'
        stroke='currentColor'
        strokeWidth='2'
        className='text-gray-400'
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5 }}
      />

      {/* Main curvy line */}
      <motion.path
        d='M50 20 C 200 120, 300 -20, 500 80 C 700 180, 800 40, 1000 100 C 1100 130, 1150 60, 1220 40'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        fill='none'
        className='text-gray-400'
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 2, ease: 'easeInOut' }}
      />

      {/* Slanted right end */}
      <motion.path
        d='M1220 40 L 1250 180'
        stroke='currentColor'
        strokeWidth='2'
        className='text-gray-400'
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5, delay: 0.5 }}
      />

      {/* Additional squiggly accents */}
      <motion.path
        d='M150 60 Q 180 40 210 60 T 270 60'
        stroke='currentColor'
        strokeWidth='1.5'
        strokeLinecap='round'
        fill='none'
        className='text-gray-300/60'
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 2, delay: 0.8 }}
      />

      <motion.path
        d='M600 140 Q 630 120 660 140 T 720 140'
        stroke='currentColor'
        strokeWidth='1'
        strokeLinecap='round'
        fill='none'
        className='text-gray-300/40'
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 2, delay: 1 }}
      />
    </svg>
  );
};

// Floating text particles
const FloatingChar = ({ char, index }: { char: string; index: number }) => {
  return (
    <motion.span
      className='inline-block'
      initial={{ opacity: 0, y: 20, rotate: -10 }}
      whileInView={{ opacity: 1, y: 0, rotate: 0 }}
      viewport={{ once: true }}
      transition={{
        duration: 0.5,
        delay: 0.1 * index,
        type: 'spring',
        stiffness: 100,
      }}
      whileHover={{
        y: -10,
        scale: 1.2,
        transition: { duration: 0.2 },
      }}
    >
      {char === ' ' ? '\u00A0' : char}
    </motion.span>
  );
};

// Main Divider Component
export const ClipMask = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 0.8]);

  const motto = 'Crafting Spaces, Creating Memories';
  const subtitle = 'Where Every Stay Tells a Story';

  return (
    <section ref={containerRef} className='relative w-full py-24 md:py-32 bg-linear-to-b from-light via-white to-gray-50 overflow-hidden'>
      {/* Background subtle texture */}
      <div className='absolute inset-0 opacity-[0.03]'>
        <div
          className='w-full h-full'
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      {/* Curvy scribble divider */}
      <div className='relative w-full h-24 md:h-32 mb-8'>
        <CurvyScribbleDivider />
        {/* Or use: <ScribbleDivider /> */}
      </div>

      {/* Content */}
      <motion.div style={{ opacity, scale }} className='relative z-10 max-w-4xl mx-auto px-4 text-center'>
        {/* Motto */}
        <h2 className='text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight cursor-pointer'>
          {motto.split('').map((char, index) => (
            <FloatingChar key={index} char={char} index={index} />
          ))}
        </h2>

        {/* Subtitle */}
        <motion.p
          className='text-lg md:text-xl text-gray-600 mb-12 max-w-2xl mx-auto'
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          {subtitle}
        </motion.p>

        {/* Decorative scribble under text */}
        <motion.div
          className='relative mx-auto w-48 h-8'
          initial={{ opacity: 0, scaleX: 0 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 1 }}
        >
          <svg viewBox='0 0 200 20' fill='none' xmlns='http://www.w3.org/2000/svg' className='w-full h-full'>
            <motion.path
              d='M10 15 Q 50 5, 100 15 T 190 10'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              fill='none'
              className='text-gray-400'
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, delay: 1.2 }}
            />
          </svg>
        </motion.div>

        {/* Small decorative elements */}
        <div className='flex justify-center gap-4 mt-8'>
          <motion.div
            className='w-2 h-2 rounded-full bg-gray-300'
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 1.5 }}
          />
          <motion.div
            className='w-3 h-3 rounded-full bg-gray-400'
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 1.7 }}
          />
          <motion.div
            className='w-2 h-2 rounded-full bg-gray-300'
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 1.9 }}
          />
        </div>
      </motion.div>

      {/* Bottom scribble divider */}
      <div className='relative w-full h-24 md:h-32 mt-12 rotate-180'>
        <CurvyScribbleDivider />
      </div>

      {/* Floating decorative scribbles in background */}
      <motion.div
        className='absolute top-10 left-10 w-32 h-32 opacity-10'
        animate={{
          rotate: 360,
          scale: [1, 1.1, 1],
        }}
        transition={{
          rotate: { duration: 20, repeat: Infinity, ease: 'linear' },
          scale: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
        }}
      >
        <svg viewBox='0 0 100 100' fill='none'>
          <path
            d='M10 50 Q 30 30, 50 50 T 90 50'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            className='text-gray-400'
          />
        </svg>
      </motion.div>

      <motion.div
        className='absolute bottom-10 right-10 w-24 h-24 opacity-10'
        animate={{
          rotate: -360,
          scale: [1, 1.2, 1],
        }}
        transition={{
          rotate: { duration: 15, repeat: Infinity, ease: 'linear' },
          scale: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
        }}
      >
        <svg viewBox='0 0 100 100' fill='none'>
          <circle cx='50' cy='50' r='30' stroke='currentColor' strokeWidth='1.5' className='text-gray-400' />
        </svg>
      </motion.div>
    </section>
  );
};
