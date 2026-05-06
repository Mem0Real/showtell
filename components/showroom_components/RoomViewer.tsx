'use client';

import { useRef, useState, useEffect } from 'react';
import { r3fTunnel } from '@/lib/r3fTunnel';
import { RoomScene } from '@/components/showroom_components/RoomScene';
import { Canvas } from '@react-three/fiber';

export const RoomViewer = ({ rooms }: any) => {
  const [active, setActive] = useState(rooms[0]);
  const [loaded, setLoaded] = useState(false);
  const [dragging, setDragging] = useState(false);

  const rotation = useRef({ x: 0, y: 0 });
  const last = useRef({ x: 0, y: 0 });

  /* Pointer logic (desktop + mobile) */
  useEffect(() => {
    const move = (e: PointerEvent) => {
      if (!dragging) return;

      let dx = 0;
      let dy = 0;

      if (document.pointerLockElement) {
        dx = e.movementX;
        dy = e.movementY;
      } else {
        dx = e.clientX - last.current.x;
        dy = e.clientY - last.current.y;

        last.current = { x: e.clientX, y: e.clientY };
      }

      rotation.current.x += dx * 0.003;
      rotation.current.y += dy * 0.003;

      rotation.current.y = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, rotation.current.y));
    };

    const up = () => {
      setDragging(false);
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

  /* Preload other rooms AFTER first load */
  useEffect(() => {
    const preload = async () => {
      rooms.forEach((room: any) => {
        const img = new Image();
        img.src = room.src;
      });
    };

    preload();
  }, []);

  return (
    <div
      className='relative w-full h-full rounded-2xl overflow-hidden bg-black/20'
      style={{
        cursor: dragging ? 'none' : 'grab',
        touchAction: 'none',
      }}
    >
      {/* Dropdown */}
      <div className='absolute top-4 right-4 z-20'>
        <select
          value={active.src}
          onChange={(e) => setActive(rooms.find((r: any) => r.src === e.target.value))}
          className='bg-black/60 text-white px-3 py-1 rounded-md text-sm cursor-pointer'
        >
          {rooms.map((room: any) => (
            <option key={room.src} value={room.src}>
              {room.label}
            </option>
          ))}
        </select>
      </div>

      {/* Loading */}
      {!loaded && (
        <div className='absolute inset-0 flex items-center justify-center z-10'>
          <div className='w-8 h-8 border-2 border-white/40 border-t-white rounded-full animate-spin' />
        </div>
      )}

      <Canvas className='absolute inset-0' camera={{ fov: 75 }}>
        <RoomScene src={active.src} rotation={rotation} onReady={() => setLoaded(true)} />
      </Canvas>

      {/* Drag Layer */}
      <div
        className='absolute inset-0 z-10'
        onPointerDown={(e) => {
          setDragging(true);

          last.current = {
            x: e.clientX,
            y: e.clientY,
          };

          (e.currentTarget as HTMLElement).requestPointerLock?.();
        }}
      />
    </div>
  );
};
