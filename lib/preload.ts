const previewCache = new Set<string>();
const hdriCache = new Set<string>();

export const preloadImage = (src: string) => {
  if (previewCache.has(src)) return Promise.resolve();

  return new Promise<void>((resolve) => {
    const img = new Image();
    img.src = src;
    img.onload = () => {
      previewCache.add(src);
      resolve();
    };
  });
};