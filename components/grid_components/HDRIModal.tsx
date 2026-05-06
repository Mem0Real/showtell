'use client';

import { useRef, useState, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { r3fTunnel } from '@/lib/r3fTunnel';
import { HDRIScene } from './HDRIScene';

const preloadImage = (src: string) =>
  new Promise<void>((resolve) => {
    const img = new Image();
    img.src = src;
    img.onload = () => resolve();
  });

export const HDRIModal = ({ hotel, onClose }: { hotel: any; onClose: () => void }) => {
  const [previewLoaded, setPreviewLoaded] = useState(false);
  const [sceneReady, setSceneReady] = useState(false);

  const [dragging, setDragging] = useState(false);

  const rotation = useRef({ x: 0, y: 0 });

  const dir = hotel.name.replaceAll(' ', '_').toLowerCase();

  /* ---------------- PRELOAD ---------------- */

  useEffect(() => {
    const previewSrc = `/3d/hotels/${dir}/pre.png`;

    preloadImage(previewSrc).then(() => {
      setPreviewLoaded(true);
    });
  }, [dir]);

  /* ---------------- ROTATION ---------------- */

  useEffect(() => {
    const move = (e: PointerEvent) => {
      if (!dragging) return;

      rotation.current.x += e.movementX * 0.005;
      rotation.current.y += e.movementY * 0.005;
    };

    const up = () => {
      setDragging(false);
      if (document.pointerLockElement) document.exitPointerLock();
    };

    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);

    return () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };
  }, [dragging]);

  /* ---------------- ESC ---------------- */

  useEffect(() => {
    const esc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', esc);
    return () => window.removeEventListener('keydown', esc);
  }, [onClose]);

  return (
    <AnimatePresence>
      <motion.div className='fixed inset-0 z-100 flex items-center justify-center'>
        {/* BACKDROP */}
        <div className='absolute inset-0 bg-black/20' onClick={onClose} />

        {/* MODAL */}
        <motion.div
          className='relative w-[90vw] h-[80vh] lg:w-[70vw] lg:h-[70vh] overflow-hidden rounded-xl'
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          style={{
            cursor: dragging ? 'none' : 'grab',
            touchAction: 'none',
          }}
        >
          {/* Preview */}
          {previewLoaded && (
            <motion.img
              src={`/3d/hotels/${dir}/pre.png`}
              className='absolute inset-0 w-full h-full object-cover scale-105'
              initial={{ opacity: 1 }}
              animate={{ opacity: sceneReady ? 0 : 1 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              style={{
                filter: 'blur(12px)',
                transform: 'scale(1.1)',
              }}
            />
          )}

          {/* Scene */}
          <motion.div
            className='absolute inset-0'
            initial={{ opacity: 0 }}
            animate={{ opacity: sceneReady ? 1 : 0 }}
            transition={{ duration: 0.8 }}
          >
            <r3fTunnel.In>
              <Suspense fallback={null}>
                <HDRIScene
                  src={`/3d/hotels/${dir}/hotel_room.jpg`}
                  rotation={rotation}
                  active={true}
                  onReady={() => setSceneReady(true)}
                />
              </Suspense>
            </r3fTunnel.In>
          </motion.div>

          <button
            onClick={onClose}
            className='absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-black/60 px-3 py-1 rounded-full'
          >
            ✕
          </button>

          {/* Drag layer */}
          <div
            className='absolute inset-0 z-30'
            onPointerDown={(e) => {
              setDragging(true);
              (e.currentTarget as HTMLElement).requestPointerLock();
            }}
          />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
