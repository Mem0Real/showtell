import React, { useState, useRef } from 'react';
import Image from 'next/image';

import { AnimatePresence, LayoutGroup, motion } from 'motion/react';

interface BentoItem {
  id: string;
  title: string;
  location: string;
  description: string;
  image: string;
  size: 'small' | 'medium' | 'large' | 'tall' | 'wide';
  modelPath?: string; // Path to 3D model
  stats?: {
    rooms: number;
    area: string;
    rating: number;
  };
}
interface BentoCardProps {
  item: BentoItem;
  onOpenModel: (item: BentoItem) => void;
}

export const BentoCard: React.FC<BentoCardProps> = ({ item, onOpenModel }) => {
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Size configurations
  const sizeClasses = {
    small: 'col-span-1 row-span-1',
    medium: 'col-span-1 row-span-1 md:col-span-2 md:row-span-1',
    large: 'col-span-1 row-span-1 md:col-span-2 md:row-span-2',
    tall: 'col-span-1 row-span-2',
    wide: 'col-span-2 row-span-1',
  };

  return (
    <motion.div
      ref={cardRef}
      className={`relative ${sizeClasses[item.size]} rounded-2xl overflow-hidden group`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 0.98 }}
      layoutId={`card-${item.id}`}
    >
      {/* Image */}
      <div className='absolute inset-0'>
        <Image
          src={item.image}
          alt={item.title}
          fill
          className='object-cover transition-transform duration-700 group-hover:scale-110'
          sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
          priority={item.size === 'large'}
        />
      </div>

      {/* Gradient Overlay */}
      <div className='absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent' />

      {/* Hover Overlay */}
      <motion.div
        className='absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300'
        initial={false}
        animate={{ opacity: isHovered ? 1 : 0 }}
      />

      {/* Content */}
      <div className='absolute inset-0 p-2 xl:p-6 xl:py-2 flex flex-col justify-between'>
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
            className='relative flex flex-col justify-center md:justify-around items-start h-full'
          >
            <motion.div
              className='flex items-end justify-between'
              animate={{
                y: isHovered ? 0 : 0,
              }}
              transition={{ duration: 0.3 }}
            >
              <div>
                <h3
                  className={`text-white text-lg font-bold mb-1 ${item.size !== 'small' ? 'md:text-2xl' : 'lg:text-2xl'}`}
                >
                  {item.title}
                </h3>
                <p className='text-white/80 text-sm mb-2'>{item.location}</p>
              </div>
            </motion.div>

            {/* Description and button - appears on hover */}
            <AnimatePresence mode='popLayout'>
              {isHovered && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{
                    opacity: isHovered ? 1 : 0,
                    y: isHovered ? 0 : 20,
                  }}
                  exit={{
                    y: 20,
                    opacity: 0,
                  }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                >
                  <p
                    className={`text-white/90 text-sm mt-3 mb-4 line-clamp-2 hidden ${item.size !== 'small' ? 'md:block' : 'lg:block'}`}
                  >
                    {item.description}
                  </p>

                  {/* 3D Button */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenModel(item);
                    }}
                    className={`md:px-2 lg:px-4 py-1 rounded-sm lg:rounded-full text-white font-light lg:font-medium text-sm xl:text-base transition-all duration-300 ${
                      item.modelPath
                        ? 'bg-white/30 backdrop-blur-sm hover:bg-white/40 border border-white/20 cursor-pointer'
                        : 'bg-gray-500/50 cursor-not-allowed'
                    }`}
                    disabled={!item.modelPath}
                  >
                    {item.modelPath ? (
                      <span className='flex items-center gap-1 md:gap-2'>
                        <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2}
                            d='M15 12a3 3 0 11-6 0 3 3 0 016 0z'
                          />
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2}
                            d='M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z'
                          />
                        </svg>
                        View 3D Model
                      </span>
                    ) : (
                      '3D Model Coming Soon'
                    )}
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </LayoutGroup>
      </div>

      <div className='absolute hidden md:flex gap-1 top-2 right-2'>
        {/* 3D Badge */}
        {item.modelPath && (
          <div className='bg-white/20 backdrop-blur-sm rounded-full p-2'>
            <svg className='w-5 h-5 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4'
              />
            </svg>
          </div>
        )}

        {/* Rating */}
        {item.stats && (
          <div className='flex items-center gap-1 bg-white/20 backdrop-blur-sm rounded-lg px-2 py-1 w-fit'>
            <svg className='w-4 h-4 text-yellow-400' fill='currentColor' viewBox='0 0 20 20'>
              <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
            </svg>
            <span className='text-white text-xs font-medium'>{item.stats.rating}</span>
          </div>
        )}
      </div>
    </motion.div>
  );
};
