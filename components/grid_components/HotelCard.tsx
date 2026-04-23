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

  // Video options (you can customize these per hotel)
  const videoOptions = [
    { label: 'Exterior', src: hotel.videoSrc },
    { label: 'Living Room', src: '/videos/v1.mkv' },
    { label: 'Bedroom', src: '/videos/v2.mkv' },
    // { label: 'Bathroom', src: '/videos/v2.mkv' },
    // { label: 'Outside View', src: '/videos/v3.mkv' },
  ];

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedData = () => {
      if (video.duration && Number.isFinite(video.duration)) {
        setVideoReady(true);
        setIsLoading(false);
      }
    };

    const handleError = (e: Event) => {
      console.error('Video loading failed:', e);
      setIsLoading(false);
      // Fallback: set a timeout to retry
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.load();
        }
      }, 1000);
    };

    // Check if already loaded (cached)
    if (video.readyState >= 3) {
      handleLoadedData();
    } else {
      video.addEventListener('loadeddata', handleLoadedData);
      video.addEventListener('error', handleError);
      video.addEventListener('canplay', handleLoadedData); // Additional fallback
    }

    return () => {
      video.removeEventListener('loadeddata', handleLoadedData);
      video.removeEventListener('error', handleError);
      video.removeEventListener('canplay', handleLoadedData);
    };
  }, [currentVideo]);

  // Preload video on mount
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Force preload
    video.preload = 'auto';
    video.load();

    // Set timeout for slow connections
    const timeout = setTimeout(() => {
      if (!videoReady) {
        console.log('Video load timeout - retrying');
        video.load();
      }
    }, 5000);

    return () => clearTimeout(timeout);
  }, []);

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

  // Touch support for mobile
  const touchStartX = useRef(0);
  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (!videoReady || !videoRef.current) return;
      setIsDragging(true);
      touchStartX.current = e.touches[0].clientX;
      lastX.current = e.touches[0].clientX;
    },
    [videoReady],
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!isDragging || !videoReady || !videoRef.current) return;

      const deltaX = e.touches[0].clientX - lastX.current;
      lastX.current = e.touches[0].clientX;

      const video = videoRef.current;
      const step = deltaX * 0.02;
      let newTime = video.currentTime + step;

      if (newTime < 0) newTime = video.duration + newTime;
      if (newTime > video.duration) newTime = newTime - video.duration;

      video.currentTime = newTime;
    },
    [isDragging, videoReady],
  );

  return (
    <motion.div
      ref={cardRef}
      className='relative w-full h-125 rounded-2xl overflow-hidden group'
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsDragging(false);
        setShowDropdown(false);
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={() => setIsDragging(false)}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      whileHover={{ scale: 1.02 }}
      style={{
        cursor: !videoReady ? 'wait' : isDragging ? 'grabbing' : isHovered ? 'grab' : 'default',
      }}
    >
      {/* Video */}
      <video
        ref={videoRef}
        src={currentVideo}
        muted
        preload='auto'
        className='absolute inset-0 w-full h-full object-cover'
        loop
        playsInline
        // poster='/images/hotel_placeholder.png'
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
      <div className='absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent' />

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
                        className={`w-full text-left px-4 py-2.5 text-sm transition ${
                          currentVideo === option.src
                            ? 'text-white bg-white/20'
                            : 'text-white/70 hover:text-white hover:bg-white/10 cursor-pointer'
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

      {/* Hotel name - slides down on hover */}
      <motion.div
        className='absolute bottom-0 left-0 right-0 p-6'
        initial={{ y: 0, opacity: 1 }}
        animate={{
          y: isHovered ? 100 : 0,
          opacity: isHovered ? 0 : 1,
        }}
        transition={{ duration: 0.4, ease: [0.43, 0.13, 0.23, 0.96] }}
      >
        <h3 className='text-white text-3xl font-bold mb-1'>{hotel.name}</h3>
        <p className='text-gray-600 text-sm'>{videoReady ? 'Drag to explore • Click to switch views' : 'Loading...'}</p>
      </motion.div>

      {/* Dragging feedback */}
      {/* <AnimatePresence>
        {isDragging && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className='absolute inset-0 border-2 border-white/40 rounded-2xl pointer-events-none'
          >
            <motion.div
              className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/50 backdrop-blur-md rounded-full px-6 py-3'
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
            >
              <div className='flex items-center gap-3 text-white'>
                <motion.div animate={{ x: [-5, 5, -5] }} transition={{ duration: 2, repeat: Infinity }}>
                  ←
                </motion.div>
                <span className='text-sm'>Dragging</span>
                <motion.div animate={{ x: [5, -5, 5] }} transition={{ duration: 2, repeat: Infinity }}>
                  →
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence> */}

      {/* Progress indicator */}
      {/* <motion.div
        className='absolute bottom-0 left-0 right-0 h-0.5 bg-white/10'
        animate={{ opacity: isHovered ? 1 : 0 }}
      >
        <motion.div
          className='h-full bg-white/80'
          style={{
            width:
              videoReady && videoRef.current
                ? `${(videoRef.current.currentTime / videoRef.current.duration) * 100}%`
                : '0%',
          }}
        />
      </motion.div> */}
    </motion.div>
  );
};
