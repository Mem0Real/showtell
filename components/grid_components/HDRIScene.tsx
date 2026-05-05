'use client';

import { useEffect, useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';

import * as THREE from 'three';

export const HDRIScene = ({
  src,
  rotation,
  rect,
  active,
  onReady,
}: {
  src: string;
  rotation: React.RefObject<{ x: number; y: number }>;
  rect: DOMRect | null;
  active: boolean;
  onReady: any;
}) => {
  const { gl, size } = useThree();

  const [ready, setReady] = useState(false);

  const texture = useTexture(src);
  const meshRef = useRef<THREE.Mesh>(null);

  useEffect(() => {
    if (texture) setReady(true);
  }, []);

  useEffect(() => {
    if (texture && ready) onReady();
  }, [texture]);

  useFrame(() => {
    if (!rect || !active) return;

    const { left, top, width, height } = rect;

    const y = size.height - top - height;

    gl.setScissor(left, y, width, height);
    gl.setViewport(left, y, width, height);

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
