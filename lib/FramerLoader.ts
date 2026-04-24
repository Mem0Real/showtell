import { useEffect, useRef, useState } from 'react';

export const useFrameSequence = (path: string, frameCount: number) => {
  const images = useRef<HTMLImageElement[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let loadedCount = 0;
    const imgs: HTMLImageElement[] = [];

    for (let i = 1; i <= frameCount; i++) {
      const img = new Image();
      img.src = `${path}/frame_${String(i).padStart(4, '0')}.jpg`;

      img.onload = () => {
        loadedCount++;
        if (loadedCount === frameCount) {
          images.current = imgs;
          setLoaded(true);
        }
      };

      imgs.push(img);
    }
  }, [path, frameCount]);

  return { images, loaded };
};
