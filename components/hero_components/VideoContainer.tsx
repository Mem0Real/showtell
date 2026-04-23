import { motion } from 'motion/react';

export const VideoContainer = ({ videoRef, phase }: any) => {
  // Video animation variants
  const videoVariants = {
    initial: {
      opacity: 0,
      scale: 0.1,
      filter: 'blur(20px)',
    },
    split: {
      opacity: 1,
      scale: 0.3,
      filter: 'blur(0px)',
      transition: { duration: 1.0, ease: [0.23, 0.13, 0.23, 0.96], delay: 0.3 },
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
  );
};
