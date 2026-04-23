'use client';

import { useRef, useEffect, useState } from 'react';

export const GeometricParticles = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const targetMouseRef = useRef({ x: -1000, y: -1000 });
  const animationFrameRef = useRef<number>(null);
  const canvasRectRef = useRef({ top: 0, left: 0 });
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    // Better touch detection
    const checkTouch = () => {
      const hasTouch =
        'ontouchstart' in window || navigator.maxTouchPoints > 0 || window.matchMedia('(pointer: coarse)').matches;
      setIsTouchDevice(hasTouch || window.innerWidth < 768);
    };

    checkTouch();
    window.addEventListener('resize', checkTouch);

    return () => window.removeEventListener('resize', checkTouch);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d', {
      alpha: true,
      willReadFrequently: false,
    });
    if (!ctx) return;

    const updateCanvasRect = () => {
      const rect = container.getBoundingClientRect();
      canvasRectRef.current = {
        top: rect.top + window.scrollY,
        left: rect.left + window.scrollX,
      };
    };

    const resizeCanvas = () => {
      const dpr = isTouchDevice ? 1 : Math.min(window.devicePixelRatio || 1, 2);
      const width = container.clientWidth;
      const height = container.clientHeight;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);

      updateCanvasRect();
    };

    resizeCanvas();

    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('scroll', updateCanvasRect, { passive: true });

    const getGridSize = () => {
      if (isTouchDevice && window.innerWidth < 480) return 60;
      if (isTouchDevice) return 50;
      return 40;
    };

    const getCanvasRelativePosition = (clientX: number, clientY: number) => {
      const rect = canvasRectRef.current;
      return {
        x: clientX - rect.left + window.scrollX,
        y: clientY - rect.top + window.scrollY,
      };
    };

    // Only add mouse listeners for non-touch devices
    if (!isTouchDevice) {
      const handleMouseMove = (e: MouseEvent) => {
        const pos = getCanvasRelativePosition(e.clientX, e.clientY);
        targetMouseRef.current = pos;
      };

      const handleMouseLeave = () => {
        targetMouseRef.current = { x: -1000, y: -1000 };
      };

      window.addEventListener('mousemove', handleMouseMove, { passive: true });
      window.addEventListener('mouseleave', handleMouseLeave);

      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseleave', handleMouseLeave);
      };
    }

    const animate = (time: number) => {
      animationFrameRef.current = requestAnimationFrame(animate);

      const width = container.clientWidth;
      const height = container.clientHeight;
      const gridSize = getGridSize();

      // On touch devices, keep mouse off screen (no interaction)
      if (!isTouchDevice) {
        const lerpSpeed = 0.1;
        mouseRef.current.x += (targetMouseRef.current.x - mouseRef.current.x) * lerpSpeed;
        mouseRef.current.y += (targetMouseRef.current.y - mouseRef.current.y) * lerpSpeed;
      }

      ctx.clearRect(0, 0, width, height);

      const mouse = mouseRef.current;
      const cols = Math.ceil(width / gridSize) + 2;
      const rows = Math.ceil(height / gridSize) + 2;
      const maxDistortion = 150;

      // Draw connections for desktop only
      if (!isTouchDevice) {
        const isMouseActive = mouse.x > -500 && mouse.y > -500;

        if (isMouseActive) {
          for (let i = 0; i < cols - 1; i++) {
            for (let j = 0; j < rows - 1; j++) {
              const x1 = i * gridSize;
              const y1 = j * gridSize;
              const x2 = (i + 1) * gridSize;
              const y2 = j * gridSize;
              const x3 = i * gridSize;
              const y3 = (j + 1) * gridSize;

              const distort = (ox: number, oy: number) => {
                const dx = ox - mouse.x;
                const dy = oy - mouse.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < maxDistortion) {
                  const force = Math.pow(1 - distance / maxDistortion, 2) * 20;
                  const angle = Math.atan2(dy, dx);
                  return {
                    x: ox + Math.cos(angle) * force,
                    y: oy + Math.sin(angle) * force,
                    distorted: true,
                    force,
                  };
                }
                return { x: ox, y: oy, distorted: false, force: 0 };
              };

              const p1 = distort(x1, y1);
              const p2 = distort(x2, y2);
              const p3 = distort(x3, y3);

              if (p1.distorted || p2.distorted || p3.distorted) {
                const maxForce = Math.max(p1.force, p2.force, p3.force);
                const opacity = 0.08 + maxForce * 0.15;

                ctx.beginPath();
                ctx.moveTo(p1.x, p1.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.strokeStyle = `rgba(55, 65, 81, ${opacity})`;
                ctx.lineWidth = 0.5;
                ctx.stroke();

                ctx.beginPath();
                ctx.moveTo(p1.x, p1.y);
                ctx.lineTo(p3.x, p3.y);
                ctx.stroke();
              }
            }
          }
        }
      } else {
        // On touch devices, draw subtle ambient connections
        for (let i = 0; i < cols - 1; i += 2) {
          for (let j = 0; j < rows - 1; j += 2) {
            const x1 = i * gridSize;
            const y1 = j * gridSize;
            const x2 = (i + 1) * gridSize;
            const y2 = j * gridSize;

            // Gentle pulsing opacity
            const pulse = Math.sin(time * 0.0005 + i * 0.3 + j * 0.3) * 0.03 + 0.05;

            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.strokeStyle = `rgba(55, 65, 81, ${pulse})`;
            ctx.lineWidth = 0.3;
            ctx.stroke();

            if (j < rows - 2) {
              const y3 = (j + 1) * gridSize;
              ctx.beginPath();
              ctx.moveTo(x1, y1);
              ctx.lineTo(x1, y3);
              ctx.stroke();
            }
          }
        }
      }

      // Draw points
      const skipPoints = isTouchDevice ? 2 : 1;
      for (let i = 0; i < cols; i += skipPoints) {
        for (let j = 0; j < rows; j += skipPoints) {
          const originX = i * gridSize;
          const originY = j * gridSize;

          let x = originX;
          let y = originY;
          let isDistorted = false;

          if (!isTouchDevice) {
            const dx = originX - mouse.x;
            const dy = originY - mouse.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < maxDistortion && mouse.x > -500) {
              const force = Math.pow(1 - distance / maxDistortion, 2) * 20;
              const angle = Math.atan2(dy, dx);
              x += Math.cos(angle) * force;
              y += Math.sin(angle) * force;
              isDistorted = true;
            }
          }

          // Floating animation - more pronounced on touch devices
          const floatAmount = isTouchDevice ? 2 : 1;
          const floatSpeed = isTouchDevice ? 0.0008 : 0.001;
          const floatX = Math.sin(time * floatSpeed + i * 0.3 + j * 0.2) * floatAmount;
          const floatY = Math.cos(time * floatSpeed + j * 0.3 + i * 0.2) * floatAmount;

          x += floatX;
          y += floatY;

          // Opacity
          const baseOpacity = isTouchDevice ? 0.12 : 0.15;
          const pulseOpacity = isTouchDevice ? Math.sin(time * 0.001 + i * 0.5 + j * 0.5) * 0.05 + 0.05 : 0;
          const distortionBoost = isDistorted ? 0.4 : 0;
          const opacity = baseOpacity + pulseOpacity + distortionBoost;

          // Size
          const baseSize = isTouchDevice ? 2 : 1.5;
          const sizePulse = isTouchDevice ? Math.sin(time * 0.001 + i * 0.7 + j * 0.7) * 0.5 + 0.5 : 0;
          const sizeBoost = isDistorted ? 3 : 0;
          const size = baseSize + sizePulse + sizeBoost;

          ctx.beginPath();
          ctx.arc(x, y, size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(55, 65, 81, ${opacity})`;
          ctx.fill();

          // Add subtle glow to random points on touch devices
          if (isTouchDevice && Math.random() < 0.02) {
            const glowAlpha = 0.05 + Math.sin(time * 0.002 + i) * 0.03;
            ctx.beginPath();
            ctx.arc(x, y, size * 3, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(107, 114, 128, ${glowAlpha})`;
            ctx.fill();
          }
        }
      }
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('scroll', updateCanvasRect);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isTouchDevice]);

  return (
    <div ref={containerRef} className='absolute inset-0 w-full h-full overflow-hidden'>
      <canvas
        ref={canvasRef}
        className='absolute inset-0 w-full h-full'
        style={{
          pointerEvents: 'none',
        }}
      />
    </div>
  );
};
