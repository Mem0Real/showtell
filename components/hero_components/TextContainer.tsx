import { motion } from 'framer-motion';
import { inter } from '@/lib/fonts';

export const TextContainer = ({ phase }: any) => {
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
      x: isLeft ? '-20vw' : '20vw',
      opacity: 1,
      transition: { duration: 1.3, ease: [0.43, 0.13, 0.23, 0.96] },
    }),
    zoom: (isLeft: Boolean) => ({
      x: isLeft ? '-15vw' : '15vw',
      opacity: 1,
      transition: { duration: 1.4, ease: 'easeOut' },
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

  return (
    <>
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
          SHOW
        </motion.h1>

        <motion.h1
          custom={false}
          variants={textVariants as any}
          initial='initial'
          animate={phase}
          className={`${inter.className} text-5xl md:text-9xl font-bold text-stone-800`}
        >
          TELL
        </motion.h1>
      </motion.div>
    </>
  );
};
