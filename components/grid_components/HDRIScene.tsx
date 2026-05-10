"use client";

import { useRef, useEffect } from "react";

import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";

export const HDRIScene = ({
  src,
  rotation,
  active,
  modalRef,
  onReady,
}: {
  src: string;
  rotation: React.RefObject<{ x: number; y: number }>;
  active: boolean;
  modalRef: React.RefObject<HTMLDivElement | null>;
  onReady?: () => void;
}) => {
  const texture = useTexture(src);
  const meshRef = useRef<THREE.Mesh>(null);

  useEffect(() => {
    if (texture && onReady) {
      texture.colorSpace = THREE.SRGBColorSpace;

      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;
      texture.generateMipmaps = false;

      onReady();
    }
  }, [texture]);

  useFrame(({ gl }) => {
    if (!active || !modalRef?.current) return;

    const rect = modalRef?.current.getBoundingClientRect();

    const left = rect.left;
    const bottom = window.innerHeight - rect.bottom;

    const width = rect.width;
    const height = rect.height;

    gl.setScissor(left, bottom, width, height);
    gl.setViewport(left, bottom, width, height);
    gl.setScissorTest(true);

    if (meshRef.current) {
      meshRef.current.rotation.y = rotation.current.x;
      meshRef.current.rotation.x = rotation.current.y;
    }
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[5, 32, 32]} />
      <meshBasicMaterial map={texture} side={THREE.BackSide} />
    </mesh>
  );
};
