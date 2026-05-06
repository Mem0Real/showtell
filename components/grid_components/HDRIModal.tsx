'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { r3fTunnel } from '@/lib/r3fTunnel';
import { HDRIScene } from './HDRIScene';

export const HDRIModal = ({ hotel, onClose }: { hotel: any; onClose: () => void }) => {
  const [loaded, setLoaded] = useState(false);
  const [dragging, setDragging] = useState(false);

  const rotation = useRef({ x: 0, y: 0 });

  // Dragging logic
  useEffect(() => {
    const move = (e: PointerEvent) => {
      if (!dragging) return;

      const dx = e.movementX;
      const dy = e.movementY;

      rotation.current.x += dx * 0.005;
      rotation.current.y += dy * 0.005;

      rotation.current.y = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, rotation.current.y));
    };

    const up = () => {
      setDragging(false);

      // exit pointer lock on release
      if (document.pointerLockElement) {
        document.exitPointerLock();
      }
    };

    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);

    return () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };
  }, [dragging]);

  // Close on esc
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();

        // also exit pointer lock if active
        if (document.pointerLockElement) {
          document.exitPointerLock();
        }
      }
    };

    window.addEventListener('keydown', handleKey);

    return () => {
      window.removeEventListener('keydown', handleKey);
    };
  }, [onClose]);

  const dir = hotel.name.replaceAll(' ', '_').toLowerCase();

  return (
    <AnimatePresence>
      <motion.div
        className={`fixed z-100 inset-0 flex items-center justify-center ${!loaded && 'bg-black/40'}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Backdrop */}
        <div className='absolute inset-0 bg-black/10 -z-50' onClick={onClose} />

        {/* Modal */}
        <motion.div
          className='relative w-[90vw] h-[80vh] lg:w-[70vw] lg:h-[70vh] rounded-xl overflow-hidden z-60'
          initial={{ scale: 0.96, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.96, opacity: 0 }}
          transition={{ duration: 0.25 }}
          style={{
            cursor: dragging ? 'none' : 'grab', // move cursor control HERE
            touchAction: 'none',
          }}
        >
          {/* Preview */}
          <motion.img
            src={`/3d/hotels/${dir}/preview.png`}
            className='absolute inset-0 w-full h-full object-cover z-10 blur-md'
            animate={{ opacity: loaded ? 0 : 1 }}
            transition={{ duration: 0.5 }}
          />

          {/* Spinner */}
          {!loaded && (
            <div className='absolute inset-0 flex items-center justify-center z-20'>
              <div className='w-8 h-8 border-2 border-white/40 border-t-white rounded-full animate-spin' />
            </div>
          )}

          {/* Close Button (FIXED Z-INDEX) */}
          <button
            onClick={onClose}
            className='z-50 absolute top-4 left-1/2 -translate-x-1/2 bg-black/60 px-3 py-1 rounded-full hover:cursor-pointer hover:scale-110 hover:bg-black/40 transition-all duration-100'
          >
            <svg width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='white' strokeWidth='2'>
              <line x1='18' y1='6' x2='6' y2='18' />
              <line x1='6' y1='6' x2='18' y2='18' />
            </svg>
          </button>

          {/* 3D Layer */}
          <motion.div
            className='absolute inset-0 z-0'
            animate={{ opacity: loaded ? 1 : 0 }}
            transition={{ duration: 0.5 }}
          >
            <r3fTunnel.In>
              <HDRIScene
                src={`/3d/hotels/${dir}/hotel_room.jpg`}
                rotation={rotation}
                active={true}
                onReady={() => setLoaded(true)}
              />
            </r3fTunnel.In>
          </motion.div>

          <div
            className='absolute inset-0 z-30'
            onPointerDown={(e) => {
              e.stopPropagation();

              setDragging(true);

              (e.currentTarget as HTMLElement).requestPointerLock();
            }}
          />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
