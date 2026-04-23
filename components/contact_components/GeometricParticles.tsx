'use client';

import { useRef, useEffect, useState } from 'react';

export const GeometricParticles = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const targetMouseRef = useRef({ x: -1000, y: -1000 });
  const animationFrameRef = useRef<number>(null);
  const canvasRectRef = useRef({ top: 0, left: 0 });
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    // Check if device is mobile/touch
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || 'ontouchstart' in window);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    
    const ctx = canvas.getContext('2d', { 
      alpha: true,
      willReadFrequently: false // Performance optimization
    });
    if (!ctx) return;
    
    // Update canvas position
    const updateCanvasRect = () => {
      const rect = container.getBoundingClientRect();
      canvasRectRef.current = {
        top: rect.top + window.scrollY,
        left: rect.left + window.scrollX,
      };
    };
    
    const resizeCanvas = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
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
    
    // Mobile-optimized grid size
    const getGridSize = () => {
      if (window.innerWidth < 480) return 50; // Small phones
      if (window.innerWidth < 768) return 45; // Tablets
      return 40; // Desktop
    };
    
    // Convert screen coordinates to canvas coordinates
    const getCanvasRelativePosition = (clientX: number, clientY: number) => {
      const rect = canvasRectRef.current;
      return {
        x: clientX - rect.left + window.scrollX,
        y: clientY - rect.top + window.scrollY,
      };
    };
    
    // Mouse events (desktop)
    const handleMouseMove = (e: MouseEvent) => {
      const pos = getCanvasRelativePosition(e.clientX, e.clientY);
      targetMouseRef.current = pos;
    };
    
    const handleMouseLeave = () => {
      targetMouseRef.current = { x: -1000, y: -1000 };
    };
    
    // Touch events (mobile)
    let touchTimeout: NodeJS.Timeout;
    
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const pos = getCanvasRelativePosition(
          e.touches[0].clientX, 
          e.touches[0].clientY
        );
        targetMouseRef.current = pos;
      }
    };
    
    const handleTouchMove = (e: TouchEvent) => {
      // Prevent default only when interacting with the background
      // This allows normal scrolling when not touching the particles
      if (e.touches.length > 0) {
        const pos = getCanvasRelativePosition(
          e.touches[0].clientX, 
          e.touches[0].clientY
        );
        targetMouseRef.current = pos;
        
        // Clear previous timeout
        clearTimeout(touchTimeout);
      }
    };
    
    const handleTouchEnd = () => {
      // Fade out the touch effect instead of instantly removing it
      touchTimeout = setTimeout(() => {
        targetMouseRef.current = { x: -1000, y: -1000 };
      }, 1000); // 1 second fade
    };
    
    // Add both mouse and touch event listeners
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd);
    
    // Reduce animation complexity on mobile
    let frameCount = 0;
    const mobileFrameSkip = 2; // Skip every other frame on mobile
    
    const animate = (time: number) => {
      animationFrameRef.current = requestAnimationFrame(animate);
      
      // Frame skipping for mobile performance
      frameCount++;
      if (isMobile && frameCount % mobileFrameSkip !== 0) return;
      
      const width = container.clientWidth;
      const height = container.clientHeight;
      const gridSize = getGridSize();
      
      // Smooth mouse interpolation (faster on mobile for responsiveness)
      const lerpSpeed = isMobile ? 0.15 : 0.1;
      mouseRef.current.x += (targetMouseRef.current.x - mouseRef.current.x) * lerpSpeed;
      mouseRef.current.y += (targetMouseRef.current.y - mouseRef.current.y) * lerpSpeed;
      
      ctx.clearRect(0, 0, width, height);
      
      const mouse = mouseRef.current;
      const cols = Math.ceil(width / gridSize) + 2;
      const rows = Math.ceil(height / gridSize) + 2;
      
      // Smaller distortion radius on mobile
      const maxDistortion = isMobile ? 120 : 150;
      
      // On mobile, only render if mouse is on screen
      const isMouseActive = mouse.x > -500 && mouse.y > -500;
      
      if (isMouseActive || !isMobile) {
        // Draw subtle connections for distorted points only
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
      
      // Draw points
      const skipPoints = isMobile ? 2 : 1; // Skip every other row on mobile
      for (let i = 0; i < cols; i += skipPoints) {
        for (let j = 0; j < rows; j += skipPoints) {
          const originX = i * gridSize;
          const originY = j * gridSize;
          
          const dx = originX - mouse.x;
          const dy = originY - mouse.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          let x = originX;
          let y = originY;
          let isDistorted = false;
          
          if (distance < maxDistortion && isMouseActive) {
            const force = Math.pow(1 - distance / maxDistortion, 2) * 20;
            const angle = Math.atan2(dy, dx);
            x += Math.cos(angle) * force;
            y += Math.sin(angle) * force;
            isDistorted = true;
          }
          
          // Simplified floating animation on mobile
          const floatAmount = isMobile ? 0.5 : 1;
          const floatX = Math.sin(time * 0.001 + i * 0.3) * floatAmount;
          const floatY = Math.cos(time * 0.001 + j * 0.3) * floatAmount;
          
          x += floatX;
          y += floatY;
          
          const baseOpacity = isMobile ? 0.2 : 0.15;
          const distortionBoost = isDistorted ? (1 - distance / maxDistortion) * 0.4 : 0;
          const opacity = baseOpacity + distortionBoost;
          
          const baseSize = 1.5;
          const sizeBoost = isDistorted ? (1 - distance / maxDistortion) * 3 : 0;
          const size = baseSize + sizeBoost;
          
          ctx.beginPath();
          ctx.arc(x, y, size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(55, 65, 81, ${opacity})`;
          ctx.fill();
          
          // Reduced glow on mobile
          if (isDistorted && distance < 80 && !isMobile) {
            const glowOpacity = (1 - distance / 80) * 0.2;
            ctx.beginPath();
            ctx.arc(x, y, size * 2.5, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(37, 99, 235, ${glowOpacity})`;
            ctx.fill();
          }
        }
      }
    };
    
    animationFrameRef.current = requestAnimationFrame(animate);
    
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('scroll', updateCanvasRect);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      clearTimeout(touchTimeout);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isMobile]); // Re-run effect when mobile state changes
  
  return (
    <div 
      ref={containerRef} 
      className="absolute inset-0 w-full h-full overflow-hidden"
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ 
          pointerEvents: 'none',
          WebkitTapHighlightColor: 'transparent', // Remove tap highlight on iOS
          touchAction: 'none', // Prevent browser gestures from interfering
        }}
      />
    </div>
  );
}