'use client';

import { useRef, useEffect } from 'react';

import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';

export const HDRIScene = ({
  src,
  rotation,
  active,
  onReady,
}: {
  src: string;
  rotation: React.RefObject<{ x: number; y: number }>;
  active: boolean;
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
    if (!active) return;

    // Center modal viewport (60% of screen)
    const width = size.width * 0.7;
    const height = size.height * 0.7;

    const left = (size.width - width) / 2;
    const bottom = (size.height - height) / 2;

    gl.setViewport(left, bottom, width, height);
    gl.setScissor(left, bottom, width, height);
    gl.setScissorTest(true);

    if (meshRef.current) {
      meshRef.current.rotation.y = rotation.current.x;
      meshRef.current.rotation.x = rotation.current.y;
    }

    gl.setScissorTest(false);
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[5, 32, 32]} />
      <meshBasicMaterial map={texture} side={THREE.BackSide} />
    </mesh>
  );
};
