'use client';

import { useRef, useEffect, useState, Suspense } from 'react';
import * as THREE from 'three';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, Html, useProgress, Float } from '@react-three/drei';

import { AnimatePresence, motion } from 'motion/react';

import { ModelLoader } from '@/components/bento_components/ModelLoader';
import { BentoItem } from '@/components/bento_components/BentoGrid';

const Loader = ({ onDone }: { onDone?: () => void }) => {
  const { progress, active } = useProgress();

  useEffect(() => {
    if (!active && progress === 100) {
      onDone?.();
    }
  }, [active, progress, onDone]);

  return (
    <Html center>
      <div className='flex flex-col items-center gap-3'>
        <div className='w-12 h-12 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin' />
        <p className='text-gray-600 text-sm'>{progress.toFixed(0)}%</p>
      </div>
    </Html>
  );
};

interface ModelSceneProps {
  modelPath?: string;
}

// Simple placeholder model - a floating geometric shape
const PlaceholderModel = () => {
  const groupRef = useRef<THREE.Group>(null);

  return (
    <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.5}>
      <group ref={groupRef}>
        {/* Main shape */}
        <mesh>
          <icosahedronGeometry args={[1.5, 1]} />
          <meshStandardMaterial color='#e2e8f0' metalness={0.1} roughness={0.5} wireframe={false} />
        </mesh>

        {/* Wireframe overlay */}
        <mesh>
          <icosahedronGeometry args={[1.55, 1]} />
          <meshBasicMaterial color='#94a3b8' wireframe transparent opacity={0.3} />
        </mesh>

        {/* Orbiting rings */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[2, 0.03, 16, 100]} />
          <meshStandardMaterial color='#cbd5e1' />
        </mesh>

        <mesh rotation={[0, Math.PI / 2, 0]}>
          <torusGeometry args={[2.2, 0.03, 16, 100]} />
          <meshStandardMaterial color='#cbd5e1' />
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
              <meshStandardMaterial color='#64748b' emissive='#64748b' emissiveIntensity={0.5} />
            </mesh>
          );
        })}
      </group>
    </Float>
  );
};

export const ModelScene = ({ selectedItem }: { selectedItem: BentoItem }) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className='w-full h-full relative' style={{ backgroundColor: '#f1f5f9' }}>
      {/* Smooth fade overlay */}
      <div
        className={`absolute inset-0 bg-light transition-opacity duration-500 z-10 ${
          loaded ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      />

      {/* Loading Overlay */}
      <AnimatePresence>
        {!loaded && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className='absolute inset-0 z-20 bg-light flex items-center justify-center'
          >
            <div className='flex flex-col items-center gap-4'>
              <div className='w-12 h-12 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin' />
              <p className='text-gray-600 text-sm font-medium'>Loading 3D Model...</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Canvas
        camera={{ position: [5, 3, 5], fov: 45 }}
        gl={{ antialias: true }}
        onCreated={({ gl }) => {
          gl.setClearColor('#f1f5f9');
        }}
      >
        <color attach='background' args={['#f1f5f9']} />

        <ambientLight intensity={0.6} />
        <spotLight position={[10, 10, 10]} intensity={1} />

        {/* {modelPath ? <ModelLoader path={modelPath} onLoaded={() => setLoaded(true)} /> : <PlaceholderModel />} */}
        <Suspense fallback={<Loader onDone={() => setLoaded(true)} />}>
          {selectedItem.modelPath && (
            <ModelLoader
              path={selectedItem.modelPath}
              position={selectedItem?.position}
              rotation={selectedItem?.rotation}
              onLoaded={() => setLoaded(true)}
            />
          )}
        </Suspense>

        <ContactShadows position={[0, -3, 0]} opacity={0.3} scale={10} blur={2} />
        {/* <Environment preset='sunset' /> */}

        <OrbitControls
          enablePan={false}
          // enableDamping
          // dampingFactor={0.05}
          // autoRotate
          // autoRotateSpeed={0.5}
          minPolarAngle={Math.PI / 1.95}
          maxPolarAngle={Math.PI / 1.95}
        />
      </Canvas>
    </div>
  );
};
