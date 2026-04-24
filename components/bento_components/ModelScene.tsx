// components/ModelScene.tsx
'use client';

import { useRef, useEffect, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, Html, useProgress } from '@react-three/drei';
import * as THREE from 'three';

// Loading spinner
function Loader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className='flex flex-col items-center gap-3'>
        <div className='w-12 h-12 border-2 border-white/30 border-t-white rounded-full animate-spin' />
        <p className='text-white text-sm'>{progress.toFixed(0)}% loaded</p>
      </div>
    </Html>
  );
}

// Your room model (keep as is)
function RoomModel() {
  const meshRef = useRef<THREE.Group>(null);

  useEffect(() => {
    if (!meshRef.current) return;

    let animationId: number;
    const rotate = () => {
      if (meshRef.current) {
        meshRef.current.rotation.y += 0.005;
      }
      animationId = requestAnimationFrame(rotate);
    };

    rotate();
    return () => cancelAnimationFrame(animationId);
  }, []);

  return (
    <group ref={meshRef}>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]}>
        <planeGeometry args={[4, 4]} />
        <meshStandardMaterial color='#e5e5e5' />
      </mesh>

      {/* Walls */}
      <mesh position={[0, 1, -2]}>
        <boxGeometry args={[4, 2, 0.1]} />
        <meshStandardMaterial color='#ffffff' />
      </mesh>

      <mesh position={[-2, 1, 0]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[4, 2, 0.1]} />
        <meshStandardMaterial color='#f5f5f5' />
      </mesh>

      {/* Furniture */}
      <mesh position={[0.5, -0.2, -1]}>
        <boxGeometry args={[1.5, 0.4, 0.8]} />
        <meshStandardMaterial color='#8B4513' />
      </mesh>

      {/* Window */}
      <mesh position={[0, 1, -1.95]}>
        <planeGeometry args={[1.5, 1]} />
        <meshStandardMaterial color='#87CEEB' emissive='#87CEEB' emissiveIntensity={0.5} />
      </mesh>
    </group>
  );
}

interface ModelSceneProps {
  modelPath?: string;
}

export const ModelScene = ({ modelPath }: ModelSceneProps) => {
  return (
    <div className='w-full h-full'>
      <Canvas
        camera={{ position: [5, 3, 5], fov: 45 }}
        gl={{
          antialias: true,
          preserveDrawingBuffer: true,
        }}
      >
        <Suspense fallback={<Loader />}>
          <ambientLight intensity={0.5} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
          <pointLight position={[-10, -10, -10]} intensity={0.5} />

          <RoomModel />

          <ContactShadows position={[0, -0.5, 0]} opacity={0.4} scale={10} blur={2} far={4} />
          <Environment preset='apartment' />
          <OrbitControls
            enableDamping
            dampingFactor={0.05}
            minDistance={2}
            maxDistance={10}
            maxPolarAngle={Math.PI / 2}
          />
        </Suspense>
      </Canvas>
    </div>
  );
};
