import { useState } from 'react';
import Link from 'next/link';

import { motion, useScroll, useMotionValueEvent } from 'motion/react';

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
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);

  useMotionValueEvent(scrollY, 'change', (current) => {
    const previous = scrollY.getPrevious() ?? 0;
    if (current > previous && current > 100) setHidden(true);
    else setHidden(false);
  });

  const navbarVariants = {
    hidden: {
      y: -40,
      opacity: 0,
      transition: {
        duration: 0.3,
        ease: 'easeOut',
      },
    },
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
      animate={showOverlayContent ? (hidden ? 'hidden' : 'visible') : 'hidden'}
      className='fixed top-4 left-0 right-0 z-40 w-[96%] lg:w-[97%] xl:w-[98.3%] mx-auto'
    >
      <div className='mx-auto flex justify-between items-center bg-light text-stone-800 ps-8 h-full border border-stone-800'>
        <div className='text-xl py-2 pr-4 font-bold h-full border-r border-stone-800 uppercase'>shotel</div>
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
