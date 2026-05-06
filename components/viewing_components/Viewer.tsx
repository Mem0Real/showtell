import { Environment, OrbitControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import React, { useEffect, useRef, useState } from 'react';

export const Viewer = () => {
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

  return (
    <div
      className='fixed z-100 inset-0 flex items-center justify-center'
      style={{
        cursor: dragging ? 'none' : 'grab',
        touchAction: 'none',
      }}
    >
      <Canvas
        // className='absolute inset-0'
        camera={{ fov: 75 }}
        // style={{
        //   position: 'fixed',
        //   inset: 0,
        //   pointerEvents: 'none',
        //   zIndex: 20,
        // }}
      >
        <Environment files={'/3d/hotel_room_4k.exr'} background near={100} far={1000} resolution={1024} />

        <OrbitControls
          enableZoom={false} // Optional: disables zooming, only allows rotation
          enableDamping={false}
        />
      </Canvas>
    </div>
  );
};
