"use client";

import { Canvas } from "@react-three/fiber";
import { r3fTunnel } from "@/lib/r3fTunnel";

export const R3fCanvasHost = () => {
  return (
    <Canvas
      camera={{ position: [0, 0, 0.1] }}
      gl={{
        antialias: false,
        powerPreference: "high-performance",
      }}
      dpr={[1, 1.5]}
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 50,
      }}
    >
      <r3fTunnel.Out />
    </Canvas>
  );
};
