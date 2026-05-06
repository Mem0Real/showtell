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

  useFrame(({ camera }) => {
    gl.setViewport(0, 0, size.width, size.height);

    if (meshRef.current) {
      meshRef.current.rotation.y = rotation.current.x;
      meshRef.current.rotation.x = rotation.current.y;
    }

    // FAKE DEPTH: slight zoom based on vertical rotation
    const zoom = 1 + Math.abs(rotation.current.y) * 0.15;

    camera.position.x = Math.sin(rotation.current.x) * 0.2;
    camera.position.y = Math.sin(rotation.current.y) * 0.1;
    camera.position.z = zoom;
  });

  return (
    <>
      {/* Background sphere */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[50, 64, 64]} />
        <meshBasicMaterial map={texture} side={THREE.BackSide} />
      </mesh>

      {/* Foreground subtle parallax layer */}
      <mesh scale={1.01}>
        <sphereGeometry args={[50, 64, 64]} />
        <meshBasicMaterial map={texture} side={THREE.BackSide} transparent opacity={0.15} />
      </mesh>

      {/* Slight blur */}
      <meshBasicMaterial map={texture} side={THREE.BackSide} />

      <meshBasicMaterial map={texture} side={THREE.BackSide} transparent opacity={0.1} />
    </>
  );
};
