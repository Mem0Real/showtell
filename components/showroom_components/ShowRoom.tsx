'use client';

import { RoomViewer } from '@/components/showroom_components/RoomViewer';

export const ShowRoom = () => {
  const rooms = [
    { label: 'Living Room', src: '/3d/hotels/showroom/living.jpg' },
    { label: 'Bedroom', src: '/3d/hotels/showroom/bedroom.jpg' },
    { label: 'Bathroom', src: '/3d/hotels/showroom/bathroom.jpg' },
  ];

  return (
    <section className='w-full py-24 px-4 md:px-10'>
      <div className='max-w-[85vw] mx-auto'>
        {/* Container */}
        <div className='relative grid grid-cols-1 lg:grid-cols-2 gap-10 p-6 md:p-4 rounded-3xl bg-linear-to-br from-neutral-100 to-neutral-200 border border-neutral-300/40 overflow-hidden'>
          {/* subtle background accent */}
          <div className='absolute inset-0 opacity-30 pointer-events-none'>
            <div className='absolute size-100 bg-black/10 blur-3xl -top-20 -left-20 rounded-full' />
          </div>

          {/* LEFT TEXT */}
          <div className='relative z-10 flex flex-col justify-center'>
            <h2 className='text-4xl md:text-5xl font-bold mb-4 text-neutral-900'>Explore Every Room</h2>

            <p className='text-neutral-700/70 leading-relaxed max-w-md'>
              Step inside each space and experience how it feels to be there. Drag to look around and switch between
              rooms instantly.
            </p>
          </div>

          {/* RIGHT VIEWER */}
          <div className='relative h-100 md:h-125 lg:h-150'>
            <RoomViewer rooms={rooms} />
          </div>
        </div>
      </div>
    </section>
  );
};
