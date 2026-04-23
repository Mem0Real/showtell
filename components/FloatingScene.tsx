"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useRef } from "react";

function Orb({ position, color }: any) {
  const ref = useRef<any>(null);

  useFrame((state) => {
    ref.current.position.y =
      position[1] + Math.sin(state.clock.elapsedTime * 0.5) * 0.3;
  });

  return (
    <mesh ref={ref} position={position}>
      <sphereGeometry args={[1.5, 64, 64]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.6}
        toneMapped={false}
      />
    </mesh>
  );
}

export default function FloatingScene() {
  return (
    <div className="absolute inset-0">
      <Canvas camera={{ position: [0, 0, 10] }}>
        <ambientLight intensity={0.3} />

        <Orb position={[-3, 0, 0]} color="#D4AF37" />
        <Orb position={[3, 1, -2]} color="#6D5BA6" />
        <Orb position={[0, -2, -1]} color="#D4AF37" />
      </Canvas>
    </div>
  );
}