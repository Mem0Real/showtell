'use client';

import { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';

export const RoomScene = ({
  src,
  rotation,
  onReady,
}: {
  src: string;
  rotation: React.RefObject<{ x: number; y: number }>;
  onReady?: () => void;
}) => {
  const texture = useTexture(src);
  const meshRef = useRef<THREE.Mesh>(null);
  const { gl, size } = useThree();

  useEffect(() => {
    if (texture && onReady) {
      texture.colorSpace = THREE.SRGBColorSpace;
      onReady();
    }
  }, [texture]);

  useFrame(() => {
    // FULL container (no modal cropping)
    gl.setViewport(0, 0, size.width, size.height);

    if (meshRef.current) {
      meshRef.current.rotation.y = rotation.current.x;
      meshRef.current.rotation.x = rotation.current.y;
    }
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[50, 64, 64]} />
      <meshBasicMaterial map={texture} side={THREE.BackSide} />
    </mesh>
  );
};
