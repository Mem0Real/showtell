'use client';

import { Suspense, useEffect, useRef } from 'react';

import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, ContactShadows, Environment, Sky } from '@react-three/drei';

import { ModelLoader } from '@/components/bento_components/ModelLoader';
import { BentoItem } from '@/components/bento_components/BentoGrid';

function SceneDebugger({ target, angle }: { target: [number, number, number] | undefined; angle: number | undefined }) {
  const controlsRef = useRef<any>(null);

  return (
    <OrbitControls
      ref={controlsRef}
      makeDefault
      enableDamping
      dampingFactor={0.05}
      // minDistance={2}
      // maxDistance={200}
      target={target || [0, 0, 0]}
      minPolarAngle={angle ? angle - 0.13 : undefined}
      maxPolarAngle={angle ? angle : undefined}
      onEnd={(e: any) => {
        const camera = e.target.object;
        const target = e.target.target;
        const angle = e.target.getPolarAngle();

        const config = {
          cameraPosition: [
            Number(camera.position.x.toFixed(2)),
            Number(camera.position.y.toFixed(2)),
            Number(camera.position.z.toFixed(2)),
          ],

          target: [Number(target.x.toFixed(2)), Number(target.y.toFixed(2)), Number(target.z.toFixed(2))],
          angle,
        };

        console.log(config);

        navigator.clipboard.writeText(JSON.stringify(config, null, 2));
      }}
    />
  );
}

function ResizeFix() {
  const { gl, camera, size } = useThree();

  useEffect(() => {
    const timeout = setTimeout(() => {
      gl.setSize(size.width, size.height);
      camera.updateProjectionMatrix();
    }, 300);

    return () => clearTimeout(timeout);
  }, [gl, camera, size]);

  return null;
}

export const ModelScene = ({ selectedItem }: { selectedItem: BentoItem }) => {
  return (
    <div className='w-full h-full' style={{ backgroundColor: '#f1f5f9' }}>
      <Canvas
        camera={{
          position: selectedItem.cameraPosition,
          fov: 40,
          far: 100000,
        }}
        gl={{ antialias: true }}
        onCreated={({ gl, camera, size }) => {
          gl.setClearColor('#f1f5f9');

          requestAnimationFrame(() => {
            gl.setSize(size.width, size.height);
            camera.updateProjectionMatrix();
          });
        }}
        frameloop='demand'
      >
        <ResizeFix />

        {/* <color attach='background' args={['#a2a2a2']} /> */}

        <ambientLight intensity={3.6} />
        <spotLight position={[10, 10, 10]} intensity={1} />

        <Sky sunPosition={[100, 20, 100]} turbidity={10} />

        <Suspense fallback={null}>{selectedItem.modelPath && <ModelLoader path={selectedItem.modelPath} />}</Suspense>

        <mesh rotation={[-Math.PI / 2, 0, -Math.PI]} position={[0, -0.15, 0]}>
          <planeGeometry args={[24, 24]} />
          <meshBasicMaterial color={'#777'} />
        </mesh>

        {/* <ContactShadows position={[0, 0, 0]} opacity={0.8} scale={20} blur={2.5} far={10} /> */}

        <SceneDebugger target={selectedItem.target} angle={selectedItem?.angle} />
      </Canvas>
    </div>
  );
};
