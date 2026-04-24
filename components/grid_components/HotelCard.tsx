// HotelCard.tsx
'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Hotel {
  name: string;
  videoSrc: string;
}

interface HotelCardProps {
  hotel: Hotel;
}

export const HotelCard: React.FC<HotelCardProps> = ({ hotel }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const [currentVideo, setCurrentVideo] = useState(hotel.videoSrc);
  const [showDropdown, setShowDropdown] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const lastX = useRef(0);
  const isDraggingRef = useRef(false); // Use ref for synchronous access

  // Video options
  const videoOptions = [
    { label: 'Exterior', src: hotel.videoSrc },
    { label: 'Living Room', src: '/videos/v1.mkv' },
    { label: 'Bedroom', src: '/videos/v2.mkv' },
  ];

  // Sync isDragging state to ref for use in native event listeners
  useEffect(() => {
    isDraggingRef.current = isDragging;
  }, [isDragging]);

  // Handle native touch events with passive: false
  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    let isTouching = false;

    const handleTouchStartNative = (e: TouchEvent) => {
      if (!videoReady || !videoRef.current) return;

      e.preventDefault();
      setIsDragging(true);
      isTouching = true;
      lastX.current = e.touches[0].clientX;

      // Keep video playing but at very low speed during drag
      if (videoRef.current) {
        videoRef.current.playbackRate = 0;
        videoRef.current.play().catch(() => {});
      }
    };

    const handleTouchMoveNative = (e: TouchEvent) => {
      if (!isTouching || !videoReady || !videoRef.current) return;

      e.preventDefault();

      const currentX = e.touches[0].clientX;
      const deltaX = currentX - lastX.current;
      lastX.current = currentX;

      if (Math.abs(deltaX) > 0 && videoRef.current) {
        const video = videoRef.current;
        const step = deltaX * 0.0005; // Much smaller step
        let newTime = video.currentTime + step;

        if (newTime < 0) newTime = video.duration + newTime;
        if (newTime > video.duration) newTime = newTime - video.duration;

        // Set time without play/pause tricks
        video.currentTime = newTime;
      }
    };

    const handleTouchEndNative = () => {
      setIsDragging(false);
      isTouching = false;

      // Reset playback rate
      if (videoRef.current) {
        videoRef.current.playbackRate = 1;
      }
    };

    card.addEventListener('touchstart', handleTouchStartNative, { passive: false });
    card.addEventListener('touchmove', handleTouchMoveNative, { passive: false });
    card.addEventListener('touchend', handleTouchEndNative);
    card.addEventListener('touchcancel', handleTouchEndNative);

    return () => {
      card.removeEventListener('touchstart', handleTouchStartNative);
      card.removeEventListener('touchmove', handleTouchMoveNative);
      card.removeEventListener('touchend', handleTouchEndNative);
      card.removeEventListener('touchcancel', handleTouchEndNative);
    };
  }, [videoReady]);

  // Video loading effect
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedData = () => {
      if (video.duration && Number.isFinite(video.duration)) {
        setVideoReady(true);
        setIsLoading(false);
      }
    };

    if (video.readyState >= 3) {
      handleLoadedData();
    } else {
      video.addEventListener('loadeddata', handleLoadedData);
      video.addEventListener('canplay', handleLoadedData);
      return () => {
        video.removeEventListener('loadeddata', handleLoadedData);
        video.removeEventListener('canplay', handleLoadedData);
      };
    }
  }, [currentVideo]);

  // Preload video on mount
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.preload = 'auto';
    video.load();

    const timeout = setTimeout(() => {
      if (!videoReady) {
        video.load();
      }
    }, 5000);

    return () => clearTimeout(timeout);
  }, []);

  // Mouse handlers (unchanged)
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (!videoReady || !videoRef.current) return;
      e.preventDefault();
      setIsDragging(true);
      lastX.current = e.clientX;
    },
    [videoReady],
  );

  useEffect(() => {
    const handleGlobalMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mouseup', handleGlobalMouseUp);
      return () => window.removeEventListener('mouseup', handleGlobalMouseUp);
    }
  }, [isDragging]);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDragging || !videoReady || !videoRef.current) return;

      const deltaX = e.clientX - lastX.current;
      lastX.current = e.clientX;

      const video = videoRef.current;
      const step = deltaX * 0.005;
      let newTime = video.currentTime + step;

      if (newTime < 0) newTime = video.duration + newTime;
      if (newTime > video.duration) newTime = newTime - video.duration;

      video.currentTime = newTime;
    },
    [isDragging, videoReady],
  );

  const handleVideoChange = (src: string) => {
    setCurrentVideo(src);
    setVideoReady(false);
    setIsLoading(true);
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
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      whileHover={{ scale: 1.02 }}
      style={{
        cursor: !videoReady ? 'wait' : isDragging ? 'grabbing' : isHovered ? 'grab' : 'default',
        touchAction: 'none', // Prevent browser touch gestures
      }}
    >
      {/* Video */}
      <video
        ref={videoRef}
        src={currentVideo}
        muted
        preload='auto'
        className='absolute inset-0 w-full h-full object-cover pointer-events-none'
        loop
        playsInline
      />

      {/* Loading State */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className='absolute inset-0 bg-gray-200 flex items-center justify-center'
          >
            <div className='flex flex-col items-center gap-3'>
              <div className='w-8 h-8 border-2 border-gray-400 border-t-gray-800 rounded-full animate-spin' />
              <span className='text-sm text-gray-600'>Loading preview...</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overlay gradient */}
      <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none' />

      {/* Dropdown */}
      <AnimatePresence>
        {isHovered && videoReady && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className='absolute top-4 left-4 z-10'
          >
            <div className='relative'>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowDropdown(!showDropdown);
                }}
                className='bg-black/50 backdrop-blur-md text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-black/70 transition cursor-pointer'
              >
                <span>{videoOptions.find((opt) => opt.src === currentVideo)?.label || 'Exterior'}</span>
                <motion.svg
                  width='12'
                  height='12'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth='2'
                  animate={{ rotate: showDropdown ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <path d='M6 9l6 6 6-6' />
                </motion.svg>
              </button>

              <AnimatePresence>
                {showDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className='absolute top-full mt-2 left-0 bg-black/70 backdrop-blur-md rounded-lg overflow-hidden min-w-40'
                  >
                    {videoOptions.map((option) => (
                      <button
                        key={option.src}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleVideoChange(option.src);
                        }}
                        className={`w-full text-left px-4 py-2.5 text-sm transition cursor-pointer ${
                          currentVideo === option.src
                            ? 'text-white bg-white/20'
                            : 'text-white/70 hover:text-white hover:bg-white/10'
                        }`}
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

      {/* Hotel name */}
      <motion.div
        className='absolute bottom-0 left-0 right-0 p-6 pointer-events-none'
        initial={{ y: 0, opacity: 1 }}
        animate={{
          y: isHovered ? 100 : 0,
          opacity: isHovered ? 0 : 1,
        }}
        transition={{ duration: 0.4, ease: [0.43, 0.13, 0.23, 0.96] }}
      >
        <h3 className='text-white text-3xl font-bold mb-1'>{hotel.name}</h3>
        <p className='text-white/60 text-sm'>{videoReady ? 'Drag to explore • Click to switch views' : 'Loading...'}</p>
      </motion.div>
    </motion.div>
  );
};
