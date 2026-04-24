'use client';

import { useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, Html, useProgress, Float } from '@react-three/drei';
import * as THREE from 'three';

// Simple loading spinner
function Loader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="flex flex-col items-center gap-3">
        <div className="w-12 h-12 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
        <p className="text-gray-600 text-sm">{progress.toFixed(0)}% loaded</p>
      </div>
    </Html>
  );
}

// Simple placeholder model - a floating geometric shape
function PlaceholderModel() {
  const groupRef = useRef<THREE.Group>(null);

  return (
    <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.5}>
      <group ref={groupRef}>
        {/* Main shape */}
        <mesh>
          <icosahedronGeometry args={[1.5, 1]} />
          <meshStandardMaterial 
            color="#e2e8f0" 
            metalness={0.1}
            roughness={0.5}
            wireframe={false}
          />
        </mesh>
        
        {/* Wireframe overlay */}
        <mesh>
          <icosahedronGeometry args={[1.55, 1]} />
          <meshBasicMaterial 
            color="#94a3b8" 
            wireframe 
            transparent 
            opacity={0.3}
          />
        </mesh>

        {/* Orbiting rings */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[2, 0.03, 16, 100]} />
          <meshStandardMaterial color="#cbd5e1" />
        </mesh>
        
        <mesh rotation={[0, Math.PI / 2, 0]}>
          <torusGeometry args={[2.2, 0.03, 16, 100]} />
          <meshStandardMaterial color="#cbd5e1" />
        </mesh>

        {/* Small floating particles */}
        {Array.from({ length: 8 }).map((_, i) => {
          const angle = (i / 8) * Math.PI * 2;
          const radius = 2.5;
          const x = Math.cos(angle) * radius;
          const z = Math.sin(angle) * radius;
          
          return (
            <mesh key={i} position={[x, 0, z]}>
              <sphereGeometry args={[0.05, 16, 16]} />
              <meshStandardMaterial color="#64748b" emissive="#64748b" emissiveIntensity={0.5} />
            </mesh>
          );
        })}
      </group>
    </Float>
  );
}

interface ModelSceneProps {
  modelPath?: string;
}

export const ModelScene = ({ modelPath }: ModelSceneProps) => {
  return (
    <div className="w-full h-full" style={{ backgroundColor: '#f1f5f9' }}>
      <Canvas
        camera={{ position: [5, 3, 5], fov: 45 }}
        gl={{ 
          antialias: true,
          preserveDrawingBuffer: true,
          alpha: false,
        }}
        style={{ background: '#f1f5f9' }}
        // Force the canvas background color
        onCreated={({ gl }) => {
          gl.setClearColor('#f1f5f9');
        }}
      >
        <color attach="background" args={['#f1f5f9']} />
        
        <ambientLight intensity={0.6} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        
        <PlaceholderModel />
        
        <ContactShadows
          position={[0, -3, 0]}
          opacity={0.3}
          scale={10}
          blur={2}
          far={4}
        />
        <Environment preset="city" />
        <OrbitControls
          enableDamping
          dampingFactor={0.05}
          minDistance={3}
          maxDistance={15}
          maxPolarAngle={Math.PI / 1.5}
          autoRotate
          autoRotateSpeed={0.5}
        />
      </Canvas>
    </div>
  );
}