import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { AnimatePresence, LayoutGroup, motion } from 'motion/react';
import { BentoItem } from '@/lib/types';

export const BentoCard = ({ item }: { item: BentoItem }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  const sizeClasses = {
    small: 'col-span-1 row-span-1',
    medium: 'col-span-1 row-span-1 md:col-span-2 md:row-span-1',
    large: 'col-span-1 row-span-1 md:col-span-2 md:row-span-2',
    tall: 'col-span-1 row-span-2',
    wide: 'col-span-2 row-span-1',
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    
    setMousePosition({ x, y });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setMousePosition({ x: 0, y: 0 });
  };

  return (
    <motion.div
      ref={cardRef}
      className={`relative ${sizeClasses[item.size]} rounded-2xl overflow-hidden group`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 0.98 }}
      layoutId={`card-${item.id}`}
      style={{
        perspective: '1000px',
        transformStyle: 'preserve-3d',
      }}
    >
      {/* Image with parallax */}
      <motion.div 
        className='absolute inset-0'
        animate={{
          x: isHovered ? mousePosition.x * -20 : 0,
          y: isHovered ? mousePosition.y * -20 : 0,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <Image
          src={item.image}
          alt={item.title}
          fill
          className='object-cover transition-transform duration-700'
          sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
          priority={item.size === 'large'}
        />
      </motion.div>

      {/* Gradient Overlay */}
      <div className='absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent' />

      {/* Hover Overlay with glare effect */}
      {/* <motion.div
        className='absolute inset-0 opacity-0 group-hover:opacity-70 transition-opacity '
        initial={false}
        animate={{
          opacity: isHovered ? 1 : 0,
          background: isHovered
            ? `radial-gradient(circle at ${(mousePosition.x + 0.5) * 100}% ${(mousePosition.y + 0.5) * 100}%, rgba(255,255,255,0.1) 0%, rgba(0,0,0,0.4) 100%)`
            : 'rgba(0,0,0,0.4)',
        }}
      /> */}

      {/* Content with depth */}
      <motion.div 
        className='absolute inset-0 p-2 xl:p-6 xl:py-2 flex flex-col justify-between cursor-pointer'
        animate={{
          x: isHovered ? mousePosition.x * 10 : 0,
          y: isHovered ? mousePosition.y * 10 : 0,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        {/* Top content */}
        <div className='hidden xl:block'>
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : -10 }}
            transition={{ duration: 0.3 }}
          >
            {item.stats && (
              <div className='flex gap-3 mb-3'>
                <span className='px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-white text-xs'>
                  {item.stats.rooms} Rooms
                </span>
                <span className='px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-white text-xs'>
                  {item.stats.area}
                </span>
              </div>
            )}
          </motion.div>
        </div>

        {/* Bottom content */}
        <LayoutGroup>
          <motion.div
            layout='position'
            className='relative flex flex-col justify-center items-start h-full xl:h-auto'
          >
            <div className='flex items-end justify-between'>
              <div>
                <h3 className={`text-white text-lg font-bold mb-1 ${item.size !== 'small' ? 'md:text-2xl' : 'lg:text-2xl'}`}>
                  {item.title}
                </h3>
                <p className='text-white/80 text-sm mb-2'>{item.location}</p>
              </div>
            </div>

            <AnimatePresence mode='popLayout'>
              {isHovered && (
                <motion.div
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    scale: 1,
                  }}
                  exit={{
                    y: 20,
                    opacity: 0,
                    scale: 0.95,
                  }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                >
                  <p className={`text-white/90 text-sm mt-3 mb-4 line-clamp-2 hidden ${item.size !== 'small' ? 'md:block' : 'lg:block'}`}>
                    {item.description}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </LayoutGroup>
      </motion.div>

      {/* Rating with depth */}
      <motion.div 
        className='absolute hidden md:flex gap-1 top-2 right-2'
        animate={{
          x: isHovered ? mousePosition.x * 15 : 0,
          y: isHovered ? mousePosition.y * 15 : 0,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        {item.stats && (
          <div className='flex items-center gap-1 bg-white/20 backdrop-blur-sm rounded-lg px-2 py-1 w-fit'>
            <svg className='w-4 h-4 text-yellow-400' fill='currentColor' viewBox='0 0 20 20'>
              <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
            </svg>
            <span className='text-white text-xs font-medium'>{item.stats.rating}</span>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};