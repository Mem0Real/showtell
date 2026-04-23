'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Inter } from 'next/font/google';
import { TextContainer } from '@/components/hero_components/TextContainer';
import { Navbar } from '@/components/Navbar';

const inter = Inter({ subsets: ['latin'] });

type Phase =
  | 'loading' // Pulse while video loads
  | 'split' // Text splits, video appears small
  | 'zoom' // Video zooms to full screen
  | 'complete'; // Navbar and text fade in, autoplay starts

export default function HeroPage() {
  const [phase, setPhase] = useState<Phase>('loading');
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [showOverlayContent, setShowOverlayContent] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Handle video loading
  useEffect(() => {
    console.log('video component');

    const video = videoRef.current;
    if (!video) {
      console.log('no video');
      return;
    }

    const handleLoadedData = () => {
      setVideoLoaded(true);
      console.log('video loaded');
    };

    const handleError = (e: any) => {
      console.error('Video loading failed', e);
    };

    const checkIfLoaded = () => {
      // readyState 4 means HAVE_ENOUGH_DATA
      if (video.readyState >= 4) {
        console.log('Video is already loaded (cached)');
        handleLoadedData();
      } else {
        video.addEventListener('loadeddata', handleLoadedData);
        video.addEventListener('error', handleError);
      }
    };

    checkIfLoaded();

    return () => {
      video.removeEventListener('loadeddata', handleLoadedData);
      video.removeEventListener('error', handleError);
    };
  }, []);

  // Phase transitions
  useEffect(() => {
    if (!videoLoaded) return;

    const timers: NodeJS.Timeout[] = [];

    // Phase 2: Split text and show small video
    timers.push(setTimeout(() => setPhase('split'), 500));

    // Phase 3: Video zooms to full screen
    timers.push(setTimeout(() => setPhase('zoom'), 2000));

    // Phase 4: Show overlay content
    timers.push(setTimeout(() => setShowOverlayContent(true), 2500));

    // Phase 5: Complete - start autoplay
    timers.push(
      setTimeout(() => {
        setPhase('complete');
        if (videoRef.current) {
          videoRef.current.play();
        }
      }, 2500),
    );

    return () => timers.forEach(clearTimeout);
  }, [videoLoaded]);

  // Video animation variants
  const videoVariants = {
    initial: {
      opacity: 0,
      scale: 0.3,
      filter: 'blur(20px)',
    },
    split: {
      opacity: 1,
      scale: 0.3,
      filter: 'blur(0px)',
      transition: { duration: 1, ease: [0.43, 0.13, 0.23, 0.96] },
    },
    zoom: {
      opacity: 1,
      scale: 1,
      filter: 'blur(0px)',
      transition: { duration: 1.2, ease: [0.43, 0.13, 0.23, 0.96] },
    },
    complete: {
      opacity: 1,
      scale: 1,
      filter: 'blur(0px)',
    },
  };


  return (
    // <div className='relative w-full h-screen overflow-hidden bg-linear-to-b from-black to-neutral-200'>
    //   {/* Navbar */}
    //   <motion.nav
    //     variants={navbarVariants as any}
    //     initial='hidden'
    //     animate={showOverlayContent ? 'visible' : 'hidden'}
    //     className='absolute top-0 left-0 right-0 z-30 px-8 py-6'
    //   >
    //     <div className='max-w-7xl mx-auto flex justify-between items-center text-white'>
    //       <div className='text-2xl font-bold'>SHOWTEL</div>
    //       <div className='flex gap-8'>
    //         <a href='#' className='hover:text-gray-300 transition'>
    //           Home
    //         </a>
    //         <a href='#' className='hover:text-gray-300 transition'>
    //           About
    //         </a>
    //         <a href='#' className='hover:text-gray-300 transition'>
    //           Contact
    //         </a>
    //       </div>
    //     </div>
    //   </motion.nav>

    //   {/* Text Container */}
    //   <motion.div
    //     className='relative z-10 w-full h-screen flex justify-center items-center gap-6'
    //     animate={phase === 'loading' ? 'loading' : undefined}
    //     variants={pulseVariants as any}
    //   >
    //     <motion.h1
    //       custom={true}
    //       variants={textVariants as any}
    //       initial='initial'
    //       animate={phase}
    //       className={`${inter.className} text-5xl md:text-7xl font-bold text-white`}
    //     >
    //       SHOWTEL
    //     </motion.h1>

    //     <motion.h1
    //       custom={false}
    //       variants={textVariants as any}
    //       initial='initial'
    //       animate={phase}
    //       className={`${inter.className} text-5xl md:text-7xl font-bold text-white`}
    //     >
    //       EXPERIENCE
    //     </motion.h1>
    //   </motion.div>

    //   {/* Overlay Content (appears after zoom) */}
    //   <AnimatePresence>
    //     {showOverlayContent && (
    //       <motion.div
    //         initial={{ opacity: 0 }}
    //         animate={{ opacity: 1 }}
    //         transition={{ duration: 0.8 }}
    //         className='absolute inset-0 z-30 flex flex-col items-center justify-center pointer-events-none'
    //       >
    //         <motion.h2
    //           initial={{ y: 30, opacity: 0 }}
    //           animate={{ y: 0, opacity: 1 }}
    //           transition={{ duration: 0.6, delay: 0.3 }}
    //           className='text-white text-2xl md:text-4xl font-light mb-4'
    //         >
    //           Welcome to the Future
    //         </motion.h2>
    //         <motion.p
    //           initial={{ y: 30, opacity: 0 }}
    //           animate={{ y: 0, opacity: 1 }}
    //           transition={{ duration: 0.6, delay: 0.5 }}
    //           className='text-white/80 text-lg md:text-xl'
    //         >
    //           Discover amazing experiences
    //         </motion.p>
    //         <motion.button
    //           initial={{ y: 30, opacity: 0 }}
    //           animate={{ y: 0, opacity: 1 }}
    //           transition={{ duration: 0.6, delay: 0.7 }}
    //           className='mt-8 px-8 py-3 bg-white text-black rounded-full font-semibold hover:bg-gray-200 transition pointer-events-auto cursor-pointer'
    //         >
    //           Get Started
    //         </motion.button>
    //       </motion.div>
    //     )}
    //   </AnimatePresence>

    //   {/* Video */}
    //   <motion.video
    //     ref={videoRef}
    //     muted
    //     loop
    //     playsInline
    //     preload='auto'
    //     variants={videoVariants as any}
    //     initial='initial'
    //     animate={phase}
    //     className='absolute inset-0 w-full h-full object-cover z-20'
    //     src='/videos/hero.webm'
    //   />

    //   {/* Loading indicator */}
    //   <AnimatePresence>
    //     {phase === 'loading' && (
    //       <motion.div
    //         initial={{ opacity: 0 }}
    //         animate={{ opacity: 1 }}
    //         exit={{ opacity: 0 }}
    //         className='absolute bottom-8 left-1/2 -translate-x-1/2 z-30 text-black/60 text-sm'
    //       >
    //         Loading...
    //       </motion.div>
    //     )}
    //   </AnimatePresence>
    // </div>

    <section className='w-full h-full sm:h-full md:h-[99vh] px-4 py-8'>
      <div className='border border-black text-neutral-800 h-full'>
        {/* Navbar */}
        <Navbar showOverlayContent={showOverlayContent} />

        {/* Main Content */}
        <TextContainer phase={phase} />

        {/* Process being 
          1) Text split while image zooms in to 50%
          2) At 50% pause for a sec then text start unsplit while image zoom to box
          3) Navbar pushes down from top and overlay text pops up 
        */}

        {/* Overlay Content (appears after zoom) */}
        <AnimatePresence>
          {showOverlayContent && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              className='absolute inset-0 z-30 flex flex-col items-center justify-center pointer-events-none'
            >
              <motion.h2
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className='text-white text-2xl md:text-4xl font-light mb-4'
              >
                Welcome to the Future
              </motion.h2>
              <motion.p
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className='text-white/80 text-lg md:text-xl'
              >
                Discover amazing experiences
              </motion.p>
              <motion.button
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.7 }}
                className='mt-8 px-8 py-3 bg-white text-black rounded-full font-semibold hover:bg-gray-200 transition pointer-events-auto cursor-pointer'
              >
                Get Started
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Video */}
        <motion.video
          ref={videoRef}
          muted
          loop
          playsInline
          preload='auto'
          variants={videoVariants as any}
          initial='initial'
          animate={phase}
          className='absolute inset-0 w-full h-full object-cover z-20'
          src='/videos/hero.webm'
        />

        {/* Loading indicator */}
        <AnimatePresence>
          {phase === 'loading' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className='absolute bottom-8 left-1/2 -translate-x-1/2 z-30 text-black/60 text-sm'
            >
              Loading...
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
