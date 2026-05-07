import { useGLTF } from '@react-three/drei';
import { useLayoutEffect, useRef } from 'react';
import * as THREE from 'three';

export const ModelLoader = ({ path }: { path: string }) => {
  const { scene } = useGLTF(path);

  const groupRef = useRef<THREE.Group>(null);

  useLayoutEffect(() => {
    const box = new THREE.Box3().setFromObject(scene);

    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());

    // center horizontally
    scene.position.x = -center.x;
    scene.position.z = -center.z;

    // place model on ground
    scene.position.y = -box.min.y;
  }, [scene]);

  return (
    <group ref={groupRef}>
      <primitive object={scene} />
    </group>
  );
};
