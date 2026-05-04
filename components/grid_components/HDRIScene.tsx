'use client';

import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';

import * as THREE from 'three';

export const HDRIScene = ({
  src,
  rotation,
  rect,
}: {
  src: string;
  rotation: React.RefObject<{ x: number; y: number }>;
  rect: DOMRect | null
}) => {
  const { size } = useThree();
  const texture = useTexture(src);
  const meshRef = useRef<THREE.Mesh>(null);

useFrame(() => {
  if (!meshRef.current || !rect) return;

  const x = (rect.left / window.innerWidth) * 2 - 1;
  const y = -(rect.top / window.innerHeight) * 2 + 1;

  meshRef.current.position.set(x * 2.5, y * 1.5, 0);

  meshRef.current.rotation.y = rotation.current.x;
  meshRef.current.rotation.x = rotation.current.y;
});

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[5, 32, 32]} />
      <meshBasicMaterial map={texture} side={THREE.BackSide} />
    </mesh>
  );
};