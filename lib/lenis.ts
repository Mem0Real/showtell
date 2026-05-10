import Lenis from "@studio-freight/lenis";

let lenisInstance: Lenis | null = null;

export function initLenis() {
  if (lenisInstance) return lenisInstance;

  lenisInstance = new Lenis({
    smoothWheel: true,
    lerp: 0.08,
  });

  function raf(time: number) {
    lenisInstance?.raf(time);
    requestAnimationFrame(raf);
  }

  requestAnimationFrame(raf);

  return lenisInstance;
}

export const getLenis = (): Lenis | null => {
  return lenisInstance;
};

export const stopLenis = () => {
  lenisInstance?.stop();
};

export const startLenis = () => {
  lenisInstance?.start();
};

export const scrollTo = (id: string, offset?: number | undefined) => {
  const element = document.getElementById(id);

  if (!element) return;

  lenisInstance?.scrollTo(element, {
    offset: offset || 0,
    duration: 1.5,
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  });
};
