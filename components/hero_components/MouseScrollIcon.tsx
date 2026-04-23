import { motion } from 'framer-motion';

export const MouseScrollIcon = () => {
  return (
    <div
      className='mouse'
      style={{
        position: 'relative',
        width: '32px',
        height: '48px',
        borderRadius: '20px',
        border: '2px solid #f1f5f9',
      }}
    >
      <motion.div
        className='trackball'
        style={{
          position: 'absolute',
          width: '6px',
          height: '6px',
          background: '#f1f5f9',
          borderRadius: '50%',
          top: 5,
          left: 11,
        }}
        animate={{
          y: [0, 25],
          scale: [1, 0.9, 0.4],
          opacity: [1, 1, 0],
        }}
        transition={{
          duration: 1.4,
          repeat: Infinity,
          repeatType: 'loop',
          ease: 'linear',
        }}
      />
    </div>
  );
};
