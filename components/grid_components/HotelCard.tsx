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
  const isDraggingRef = useRef(false);

  const targetTime = useRef(0);
  const rafId = useRef<number | null>(null);

  const videoOptions = [
    { label: 'Exterior', src: '/videos/exterior.mp4' }, // hotel.videoSrc
    { label: 'Living Room', src: '/videos/living.mp4' },
    { label: 'Bedroom', src: '/videos/bedroom.mp4' },
  ];

  useEffect(() => {
    isDraggingRef.current = isDragging;
  }, [isDragging]);

  // Video ready
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !videoReady) return;

    video.pause();
    video.currentTime = 0;

    // trick: briefly play then pause to unlock frame updates
    video
      .play()
      .then(() => {
        video.pause();
      })
      .catch(() => {});
  }, [videoReady]);

  // RAF smoothing loop
  useEffect(() => {
    const update = () => {
      const video = videoRef.current;

      if (video && isDraggingRef.current && video.duration) {
        let diff = targetTime.current - video.currentTime;

        // shortest path (wrap)
        if (Math.abs(diff) > video.duration / 2) {
          diff -= Math.sign(diff) * video.duration;
        }

        const nextTime = video.currentTime + diff * 0.2;

        video.currentTime = (nextTime + video.duration) % video.duration;
      }

      rafId.current = requestAnimationFrame(update);
    };

    rafId.current = requestAnimationFrame(update);

    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, []);

  const applyDrag = (deltaX: number) => {
    const video = videoRef.current;
    if (!video || !video.duration) return;

    const step = deltaX * 0.005;

    let newTime = targetTime.current + step;

    if (newTime < 0) newTime += video.duration;
    if (newTime > video.duration) newTime -= video.duration;

    targetTime.current = newTime;
  };

  // Mouse
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (!videoReady || !videoRef.current) return;

      e.preventDefault();
      setIsDragging(true);
      lastX.current = e.clientX;
      targetTime.current = videoRef.current.currentTime;
    },
    [videoReady],
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDraggingRef.current || !videoReady) return;

      const deltaX = e.clientX - lastX.current;
      lastX.current = e.clientX;

      applyDrag(deltaX);
    },
    [videoReady],
  );

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
      if (!videoReady || !videoRef.current) return;

      const target = e.target as HTMLElement;
      if (target.closest('.dropdown-menu')) return;

      e.preventDefault();

      setIsDragging(true);
      setIsHovered(true);
      lastX.current = e.touches[0].clientX;
      targetTime.current = videoRef.current.currentTime;
    };

    const move = (e: TouchEvent) => {
      if (!isDraggingRef.current || !videoReady) return;

      e.preventDefault();

      const x = e.touches[0].clientX;
      const deltaX = x - lastX.current;
      lastX.current = x;

      applyDrag(deltaX);
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
  }, [videoReady]);

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
      style={{
        cursor: !videoReady ? 'wait' : isDragging ? 'grabbing' : isHovered ? 'grab' : 'default',
        touchAction: 'none',
      }}
    >
      <video
        ref={videoRef}
        src={currentVideo}
        muted
        preload='auto'
        playsInline
        className='absolute inset-0 w-full h-full object-cover pointer-events-none'
        disablePictureInPicture
      />

      <AnimatePresence>
        {isLoading && (
          <motion.div className='absolute inset-0 bg-gray-200 flex items-center justify-center'>
            <div className='w-8 h-8 border-2 border-gray-400 border-t-gray-800 rounded-full animate-spin' />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isHovered && videoReady && (
          <div className='absolute top-4 left-4 z-10 dropdown-menu'>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowDropdown(!showDropdown);
              }}
              className='bg-black/50 text-white px-4 py-2 rounded-lg dropdown-menu'
            >
              {videoOptions.find((opt) => opt.src === currentVideo)?.label}
            </button>

            {showDropdown && (
              <div className='mt-2 bg-black/70 rounded-lg dropdown-menu'>
                {videoOptions.map((option) => (
                  <button
                    key={option.src}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleVideoChange(option.src);
                    }}
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
