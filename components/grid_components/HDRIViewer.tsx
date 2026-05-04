'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { useRef } from 'react';

const Scene = ({src, rotation} : {src: string ,rotation: React.RefObject<{x: number, y: number}>}) => {
  const texture = useTexture(src);
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (!meshRef.current) return;

    meshRef.current.rotation.y = rotation.current.x;
    meshRef.current.rotation.x = rotation.current.y;
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[5, 32, 32]} />
      <meshBasicMaterial map={texture} side={THREE.BackSide} />
    </mesh>
  )
}

export const HDRIViewer = ({
  src,
  rotation,
}: {
  src: string;
  rotation: React.RefObject<{ x: number; y: number }>;
}) => {
  return (
    <Canvas
      camera={{ position: [0, 0, 0.1] }}
      gl={{ antialias: true }}
      dpr={[1, 1.5]}
    >
      <Scene src={src} rotation={rotation} />
    </Canvas>
  );
};