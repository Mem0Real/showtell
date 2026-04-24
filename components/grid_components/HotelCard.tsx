'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Hotel {
  name: string;
  videoSrc: string; // now used as frame path base
  frameSrc: string; // now used as frame path base
}

interface HotelCardProps {
  hotel: Hotel;
}

export const HotelCard: React.FC<HotelCardProps> = ({ hotel }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [framesReady, setFramesReady] = useState(false);
  const [currentSet, setCurrentSet] = useState(hotel.frameSrc);
  const [showDropdown, setShowDropdown] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const lastX = useRef(0);
  const isDraggingRef = useRef(false);

  const images = useRef<HTMLImageElement[]>([]);
  const currentFrame = useRef(0);
  const targetFrame = useRef(0);

  const TOTAL_FRAMES = 124;

  const videoOptions = [
    { label: 'Exterior', src: '/frames/exterior' },
    { label: 'Living Room', src: '/frames/living' },
    { label: 'Bedroom', src: '/frames/bedroom' },
  ];

  useEffect(() => {
    isDraggingRef.current = isDragging;
  }, [isDragging]);

  // Load frames
  useEffect(() => {
    let loaded = 0;
    const imgs: HTMLImageElement[] = [];

    setIsLoading(true);
    setFramesReady(false);

    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const img = new Image();
      img.src = `${currentSet}/frame_${String(i).padStart(4, '0')}.jpg`;

      img.onload = () => {
        loaded++;
        if (loaded === TOTAL_FRAMES) {
          images.current = imgs;
          setFramesReady(true);
          setIsLoading(false);
          drawFrame(0);
        }
      };

      imgs.push(img);
    }
  }, [currentSet]);

  // Draw frame
  const drawFrame = (index: number) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    const img = images.current[index];

    if (!canvas || !ctx || !img) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  };

  // Smooth animation loop
  useEffect(() => {
    const loop = () => {
      if (framesReady) {
        currentFrame.current += (targetFrame.current - currentFrame.current) * 0.15;

        let index = Math.floor(currentFrame.current);

        if (index < 0) index = TOTAL_FRAMES - 1;
        if (index >= TOTAL_FRAMES) index = 0;

        drawFrame(index);
      }

      requestAnimationFrame(loop);
    };

    loop();
  }, [framesReady]);

  // Drag logic
  const handleDrag = (deltaX: number) => {
    const sensitivity = 0.2;

    targetFrame.current += deltaX * sensitivity;

    if (targetFrame.current < 0) targetFrame.current = TOTAL_FRAMES - 1;
    if (targetFrame.current >= TOTAL_FRAMES) targetFrame.current = 0;
  };

  // Mouse
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!framesReady) return;
    setIsDragging(true);
    lastX.current = e.clientX;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current || !framesReady) return;

    const deltaX = e.clientX - lastX.current;
    lastX.current = e.clientX;

    handleDrag(deltaX);
  };

  useEffect(() => {
    const up = () => setIsDragging(false);
    if (isDragging) {
      window.addEventListener('mouseup', up);
      return () => window.removeEventListener('mouseup', up);
    }
  }, [isDragging]);

  // Touch
  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const start = (e: TouchEvent) => {
      if (!framesReady) return;
      e.preventDefault();
      setIsDragging(true);
      setIsHovered(true);
      lastX.current = e.touches[0].clientX;
    };

    const move = (e: TouchEvent) => {
      if (!isDraggingRef.current || !framesReady) return;
      e.preventDefault();

      const x = e.touches[0].clientX;
      const deltaX = x - lastX.current;
      lastX.current = x;

      handleDrag(deltaX);
    };

    const end = () => setIsDragging(false);

    card.addEventListener('touchstart', start, { passive: false });
    card.addEventListener('touchmove', move, { passive: false });
    card.addEventListener('touchend', end);

    return () => {
      card.removeEventListener('touchstart', start);
      card.removeEventListener('touchmove', move);
      card.removeEventListener('touchend', end);
    };
  }, [framesReady]);

  const handleVideoChange = (src: string) => {
    setCurrentSet(src);
    setShowDropdown(false);
  };

  return (
    <motion.div
      ref={cardRef}
      className='relative w-full h-125 rounded-2xl overflow-hidden group touch-none'
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsDragging(false);
        setShowDropdown(false);
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      style={{
        cursor: !framesReady ? 'wait' : isDragging ? 'grabbing' : isHovered ? 'grab' : 'default',
        touchAction: 'none',
      }}
    >
      {/* Canvas replaces video */}
      <canvas ref={canvasRef} width={800} height={600} className='absolute inset-0 w-full h-full object-cover' />

      {/* Loading */}
      <AnimatePresence>
        {isLoading && (
          <motion.div className='absolute inset-0 bg-gray-200 flex items-center justify-center'>
            <div className='w-8 h-8 border-2 border-gray-400 border-t-gray-800 rounded-full animate-spin' />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dropdown */}
      <AnimatePresence>
        {isHovered && framesReady && (
          <div className='absolute top-4 left-4 z-10'>
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className='bg-black/50 text-white px-4 py-2 rounded-lg'
            >
              {videoOptions.find((opt) => opt.src === currentSet)?.label}
            </button>

            {showDropdown && (
              <div className='mt-2 bg-black/70 rounded-lg'>
                {videoOptions.map((option) => (
                  <button
                    key={option.src}
                    onClick={() => handleVideoChange(option.src)}
                    className='block w-full text-left px-4 py-2 text-white'
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
