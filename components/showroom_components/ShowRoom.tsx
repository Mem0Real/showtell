'use client';

import { RoomViewer } from '@/components/showroom_components/RoomViewer';
import { playfair } from '@/lib/fonts';

export const ShowRoom = () => {
  const rooms = [
    { label: 'Living Room', src: '/3d/hotels/showroom/living.jpg' },
    { label: 'Bedroom', src: '/3d/hotels/showroom/bedroom.jpg' },
    { label: 'Bathroom', src: '/3d/hotels/showroom/bathroom.jpeg' },
  ];

  return (
    <section className='w-full py-24 px-4 md:px-10'>
      <div className='relative max-w-[85vw] mx-auto'>
        {/* MAIN PANEL */}
        <div className='relative grid grid-cols-1 lg:grid-cols-2 gap-10 p-6 md:p-10 md:pr-16 bg-stone-900 md:bg-stone-900/90 backdrop-blur-xl border border-white/30 shadow-[0_10px_40px_rgba(0,0,0,0.1)] overflow-hidden clip-path-tablet lg:clip-path-desktop'>
          <div className='absolute inset-0 pointer-events-none'>
            <div className='absolute inset-0 border border-white/20 rounded-[inherit]' />
            <div className='absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent opacity-30 animate-[shine_6s_linear_infinite]' />
          </div>

          <div className='absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-white/40 to-transparent' />
          <div className='absolute bottom-0 left-0 w-full h-px bg-linear-to-r from-transparent via-black/20 to-transparent' />

          {/* LEFT TEXT */}
          <div className='relative z-10 flex flex-col justify-center'>
            <h2 className={` text-4xl md:text-5xl font-bold mb-4 text-neutral-200 ${playfair.className}`}>
              Explore Every Room
            </h2>

            <p className='text-neutral-300/70 leading-relaxed max-w-md'>
              Step inside each space and experience how it feels to be there. Drag to look around and switch between
              rooms instantly.
            </p>
          </div>

          {/* RIGHT VIEWER */}
          <div className='relative h-100 md:h-125 lg:h-150'>
            <div className='absolute inset-0 rounded-2xl overflow-hidden border border-black/40 shadow-[inset_0_0_40px_rgba(255,255,255,0.2)]'>
              <RoomViewer rooms={rooms} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
