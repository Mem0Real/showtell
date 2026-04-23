'use client';

import { Suspense, useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, useProgress, Html } from '@react-three/drei';
import * as THREE from 'three';

// Loading component for 3D model
function Loader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="flex flex-col items-center gap-3">
        <div className="w-12 h-12 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        <p className="text-white text-sm">{progress.toFixed(0)}% loaded</p>
      </div>
    </Html>
  );
}

// Placeholder model while loading actual 3D model
function PlaceholderModel() {
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#f0f0f0" wireframe />
    </mesh>
  );
}

// Simple 3D room model (you can replace with actual GLTF models)
function RoomModel() {
  const meshRef = useRef<THREE.Group>(null);
  
  // Auto-rotate animation
  useEffect(() => {
    if (!meshRef.current) return;
    
    let animationId: number;
    const rotate = () => {
      if (meshRef.current) {
        meshRef.current.rotation.y += 0.005;
      }
      animationId = requestAnimationFrame(rotate);
    };
    
    rotate();
    return () => cancelAnimationFrame(animationId);
  }, []);

  return (
    <group ref={meshRef}>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]}>
        <planeGeometry args={[4, 4]} />
        <meshStandardMaterial color="#e5e5e5" />
      </mesh>
      
      {/* Walls */}
      <mesh position={[0, 1, -2]}>
        <boxGeometry args={[4, 2, 0.1]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      
      <mesh position={[-2, 1, 0]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[4, 2, 0.1]} />
        <meshStandardMaterial color="#f5f5f5" />
      </mesh>

      {/* Furniture */}
      <mesh position={[0.5, -0.2, -1]}>
        <boxGeometry args={[1.5, 0.4, 0.8]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>
      
      <mesh position={[-1, -0.3, -1]}>
        <boxGeometry args={[0.8, 0.3, 0.8]} />
        <meshStandardMaterial color="#A0522D" />
      </mesh>

      {/* Window */}
      <mesh position={[0, 1, -1.95]}>
        <planeGeometry args={[1.5, 1]} />
        <meshStandardMaterial color="#87CEEB" emissive="#87CEEB" emissiveIntensity={0.5} />
      </mesh>
    </group>
  );
}

interface ModelViewerProps {
  isOpen: boolean;
  onClose: () => void;
  modelPath?: string;
  title?: string;
}

export const  ModelViewer = ({ isOpen, onClose, modelPath, title }: ModelViewerProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [fullscreen, setFullscreen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setIsLoading(true);
      // Simulate loading time
      const timer = setTimeout(() => setIsLoading(false), 1000);
      return () => clearTimeout(timer);
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center"
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/90 backdrop-blur-sm"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Modal Content */}
          <motion.div
            className={`relative z-10 bg-gray-900 rounded-2xl overflow-hidden shadow-2xl ${
              fullscreen ? 'fixed inset-4' : 'w-[90vw] h-[80vh] max-w-6xl'
            }`}
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            {/* Header */}
            <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between p-4 bg-linear-to-b from-black/50 to-transparent">
              <div>
                {title && (
                  <h2 className="text-white text-xl font-bold">{title}</h2>
                )}
                <p className="text-white/60 text-sm">3D Preview</p>
              </div>
              
              <div className="flex items-center gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setFullscreen(!fullscreen)}
                  className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition text-white"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {fullscreen ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 9V4.5M9 9H4.5M9 9L3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5l5.25 5.25" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
                    )}
                  </svg>
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onClose}
                  className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition text-white"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </motion.button>
              </div>
            </div>

            {/* Loading Overlay */}
            <AnimatePresence>
              {isLoading && (
                <motion.div
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 z-30 bg-gray-900 flex items-center justify-center"
                >
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <p className="text-white text-lg">Loading 3D Model...</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* 3D Canvas */}
            <div className="w-full h-full">
              <Canvas
                camera={{ position: [5, 3, 5], fov: 45 }}
                gl={{ antialias: true, alpha: false }}
                onCreated={() => setIsLoading(false)}
              >
                <Suspense fallback={<Loader />}>
                  <ambientLight intensity={0.5} />
                  <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
                  <pointLight position={[-10, -10, -10]} intensity={0.5} />
                  
                  {/* Replace with actual model loading logic */}
                  {modelPath ? (
                    <PlaceholderModel /> // Replace with: <Gltf src={modelPath} />
                  ) : (
                    <RoomModel />
                  )}
                  
                  <ContactShadows
                    position={[0, -0.5, 0]}
                    opacity={0.4}
                    scale={10}
                    blur={2}
                    far={4}
                  />
                  <Environment preset="apartment" />
                  <OrbitControls
                    enableDamping
                    dampingFactor={0.05}
                    minDistance={2}
                    maxDistance={10}
                    maxPolarAngle={Math.PI / 2}
                  />
                </Suspense>
              </Canvas>
            </div>

            {/* Controls Help */}
            <div className="absolute bottom-4 left-4 right-4 z-20 flex justify-between items-center">
              <div className="flex gap-4 text-white/60 text-sm">
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                  </svg>
                  Drag to rotate
                </span>
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                  </svg>
                  Scroll to zoom
                </span>
              </div>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 bg-white text-gray-900 rounded-full font-medium text-sm"
              >
                Book This Property
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}