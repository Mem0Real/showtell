'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTexture } from '@react-three/drei';

import { HDRIViewer } from '@/components/grid_components/HDRIViewer';

interface Hotel {
  name: string;
  hdriSrc: string;
  previewSrc: string;
}

interface HotelCardProps {
  hotel: Hotel;
}

export const HotelCard: React.FC<HotelCardProps> = ({ hotel }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const cardRef = useRef<HTMLDivElement>(null);
  const lastX = useRef(0);
  const lastY = useRef(0);
  const isDraggingRef = useRef(false);

  const rotation = useRef({ x: 0, y: 0 });

  const [currentHDRI, setCurrentHDRI] = useState(hotel.hdriSrc);

  const hdriOptions = [
    { label: 'Exterior', src: hotel.hdriSrc },
    { label: 'Living Room', src: `/3d/hotels/${hotel.name}/exterior.jpg` },
    { label: 'Bedroom', src: `/3d/hotels/${hotel.name}/exterior.jpg` },
  ];

  /* Preload Textures */
  useEffect(() => {
  useTexture.preload(hdriOptions.map(opt => opt.src));
}, []);

  /* Mouse Drag  */

  useEffect(() => {
    isDraggingRef.current = isDragging;
  }, [isDragging]);

  const handleDrag = (dx: number, dy: number) => {
    rotation.current.x += dx * 0.005;
    rotation.current.y += dy * 0.005;

    rotation.current.y = Math.max(
      -Math.PI / 2,
      Math.min(Math.PI / 2, rotation.current.y)
    );
  };

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    lastX.current = e.clientX;
    lastY.current = e.clientY;
  }, []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDraggingRef.current) return;

      const dx = e.clientX - lastX.current;
      const dy = e.clientY - lastY.current;

      lastX.current = e.clientX;
      lastY.current = e.clientY;

      handleDrag(dx, dy);
    },
    []
  );

  useEffect(() => {
    const handleMouseUp = () => setIsDragging(false);

    if (isDragging) {
      window.addEventListener('mouseup', handleMouseUp);
      return () => window.removeEventListener('mouseup', handleMouseUp);
    }
  }, [isDragging]);

  /* Touch */

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const start = (e: TouchEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('.dropdown-menu')) return;

      setIsDragging(true);
      setIsHovered(true);

      lastX.current = e.touches[0].clientX;
      lastY.current = e.touches[0].clientY;
    };

    const move = (e: TouchEvent) => {
      if (!isDraggingRef.current) return;

      const x = e.touches[0].clientX;
      const y = e.touches[0].clientY;

      const dx = x - lastX.current;
      const dy = y - lastY.current;

      lastX.current = x;
      lastY.current = y;

      handleDrag(dx, dy);
    };

    const end = () => setIsDragging(false);

    card.addEventListener('touchstart', start, { passive: true });
    card.addEventListener('touchmove', move, { passive: true });
    card.addEventListener('touchend', end);

    return () => {
      card.removeEventListener('touchstart', start);
      card.removeEventListener('touchmove', move);
      card.removeEventListener('touchend', end);
    };
  }, []);

  /* UI Actions  */

  const handleHDRIChange = (src: string) => {
    setCurrentHDRI(src);
    setShowDropdown(false);
  };

  const isActive = isHovered && isDragging;

  return (
    <motion.div
      ref={cardRef}
      className="relative w-full h-125 rounded-2xl overflow-hidden group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsDragging(false);
        setShowDropdown(false);
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      style={{
        cursor: isDragging ? 'grabbing' : isHovered ? 'grab' : 'default',
        touchAction: 'none',
      }}
    >
      <div className="absolute inset-0">
        {/* Image fallback */}
        <motion.img
          src={hotel.previewSrc}
          className="absolute inset-0 w-full h-full object-cover"
          animate={{ opacity: isActive ? 0 : 1 }}
          transition={{ duration: 0.4 }}
        />

        {/* Canvas */}
        <motion.div
          className="absolute inset-0"
          animate={{ opacity: isActive ? 1 : 0 }}
          transition={{ duration: 0.4 }}
        >
          {isActive && (
            <HDRIViewer src={currentHDRI} rotation={rotation} />
          )}
        </motion.div>
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

      {/* Dropdown */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-4 left-4 z-10 dropdown-menu"
          >
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowDropdown(!showDropdown);
                }}
                className="bg-black/50 text-white px-4 py-2 rounded-lg dropdown-menu"
              >
                {
                  hdriOptions.find((opt) => opt.src === currentHDRI)
                    ?.label
                }
              </button>

              <AnimatePresence>
                {showDropdown && (
                  <motion.div className="absolute top-full mt-2 bg-black/70 rounded-lg dropdown-menu">
                    {hdriOptions.map((option) => (
                      <button
                        key={option.src}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleHDRIChange(option.src);
                        }}
                        className="block w-full text-left px-4 py-2 text-white"
                      >
                        {option.label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Title */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 p-6 pointer-events-none"
        initial={{ y: 0, opacity: 1 }}
        animate={{
          y: isHovered ? 100 : 0,
          opacity: isHovered ? 0 : 1,
        }}
      >
        <h3 className="text-white text-3xl font-bold mb-1">
          {hotel.name}
        </h3>
        <p className="text-white/60 text-sm">
          Drag to explore
        </p>
      </motion.div>
    </motion.div>
  );
};