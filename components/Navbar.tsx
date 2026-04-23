import { motion } from 'framer-motion';
import Link from 'next/link';

const navlinks = [
  {
    title: 'Home',
    url: '#',
  },
  {
    title: 'About',
    url: '#',
  },
  {
    title: 'Contact',
    url: '#',
  },
];

export const Navbar = ({ showOverlayContent }: { showOverlayContent: Boolean }) => {
  // Navbar animation variants
  const navbarVariants = {
    hidden: { y: -100, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
        delay: 0.2,
      },
    },
  };

  return (
    <motion.nav
      variants={navbarVariants as any}
      initial='hidden'
      animate={showOverlayContent ? 'visible' : 'hidden'}
      className='fixed top-0 left-0 right-0 z-30 px-8 py-6'
    >
      <div className='mx-auto flex justify-between items-center bg-accentSoft/90 text-stone-800 ps-8 h-full border border-stone-800'>
        <div className='text-xl py-2 pr-4 font-bold h-full border-r border-stone-800'>SHOWTEL</div>
        <div className='flex h-full'>
          {navlinks.map((link, i) => (
            <Link
              key={i}
              href={link.url}
              className='h-full py-2 px-16 text-base border border-stone-800 border-y-0 not-first:border-l-0 last:border-r-0'
            >
              {link.title}
            </Link>
          ))}
        </div>
      </div>
    </motion.nav>
  );
};
