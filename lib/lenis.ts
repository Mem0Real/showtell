// lib/lenis.ts
import Lenis from '@studio-freight/lenis';

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

export function getLenis(): Lenis | null {
  return lenisInstance;
}

export function stopLenis() {
  lenisInstance?.stop();
}

export function startLenis() {
  lenisInstance?.start();
}