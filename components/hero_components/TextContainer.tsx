import { AnimatePresence, motion, useTransform, useScroll } from 'motion/react';

import { inter } from '@/lib/fonts';
import { MouseScrollIcon } from '@/components/hero_components/MouseScrollIcon';

export const TextContainer = ({ phase, showOverlayContent }: any) => {
  const { scrollYProgress } = useScroll();

  // Pulse animation variants
  const pulseVariants = {
    loading: {
      opacity: [0.6, 1, 0.6],
      scale: [0.98, 1, 0.98],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  };

  // Text animation variants
  const textVariants = {
    initial: { opacity: 0 },
    loading: { opacity: 1 },
    split: (isLeft: Boolean) => ({
      x: isLeft ? '-17vw' : '15vw',
      opacity: 1,
      transition: { duration: 1.3, ease: [0.43, 0.13, 0.23, 0.96] },
    }),
    zoom: (isLeft: Boolean) => ({
      x: 0,
      opacity: 1,
      transition: { duration: 1.0, ease: 'easeIn' },
    }),
    complete: {
      x: 0,
      opacity: 0,
      transition: {
        duration: 0.8,
        delay: 0.3,
        ease: 'easeOut',
      },
    },
  };

  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const filter = useTransform(scrollYProgress, [0, 0.5], ['blur(0px)', 'blur(20px)']);

  return (
    <>
      {/* Split Text */}
      <motion.div
        className={`'relative z-10 w-full h-full flex justify-center items-center gap-6'`}
        animate={phase === 'loading' ? 'loading' : undefined}
        variants={pulseVariants as any}
      >
        <motion.h1
          custom={true}
          variants={textVariants as any}
          initial='initial'
          animate={phase}
          className={`${inter.className} text-5xl md:text-9xl font-bold text-stone-800`}
        >
          SHO
        </motion.h1>

        <motion.h1
          custom={false}
          variants={textVariants as any}
          initial='initial'
          animate={phase}
          className={`${inter.className} text-5xl md:text-9xl font-bold text-stone-800`}
        >
          TEL
        </motion.h1>
      </motion.div>

      {/* Overlay Content (appears after zoom) */}
      <AnimatePresence>
        {showOverlayContent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            style={{ filter, opacity }}
            className='absolute bottom-0 left-1/2 -translate-x-1/2 z-30 pointer-events-none flex flex-col justify-center items-center w-full md:w-fit backdrop-blur-md'
          >
            <div className='h-full w-full xl:px-36 lg:px-12 md:px-4 py-4 bg-gray-400/10 rounded-sm bg-clip-padding border border-b-0 border-gray-100/50 flex flex-col items-center justify-center gap-2'>
              <motion.h2
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className='text-white text-2xl md:text-4xl font-extralight pb-4 capitalize'
              >
                Welcome to shotel
              </motion.h2>
              <motion.p
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className='text-white/80 md:text-lg capitalize'
              >
                Experience your vacation from home
              </motion.p>
              <motion.button
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.7 }}
              >
                <MouseScrollIcon />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
    </>
  );
};
