import { useGLTF } from '@react-three/drei';
import { useEffect } from 'react';

export const ModelLoader = ({
  path,
  position,
  rotation,
  onLoaded,
}: {
  path: string;
  position?: { x: number; y: number; z: number };
  rotation?: { x: number; y: number; z: number };
  onLoaded?: () => void;
}) => {
  const { scene } = useGLTF(path);

  useEffect(() => {
    if (scene) {
      onLoaded?.();
    }
  }, [scene]);

  const [x, y, z] = [position?.x, position?.y, position?.z];
  const [rotX, rotY, rotZ] = [rotation?.x, rotation?.y, rotation?.z];

  return <primitive object={scene} scale={1} position={[x, y, z]} rotation={[rotX, rotY, rotZ]} />;
};
