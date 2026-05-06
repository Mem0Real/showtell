import * as THREE from 'three';

const hdriTextureCache = new Map<string, THREE.Texture>();

export const preloadHDRI = async (src: string) => {
  if (hdriTextureCache.has(src)) return hdriTextureCache.get(src)!;

  return new Promise<THREE.Texture>((resolve) => {
    new THREE.TextureLoader().load(src, (tex) => {
      tex.colorSpace = THREE.SRGBColorSpace;
      hdriTextureCache.set(src, tex);
      resolve(tex);
    });
  });
};