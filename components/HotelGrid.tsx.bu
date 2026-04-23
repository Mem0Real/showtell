'use client';
import { useRef } from 'react';

const hotels = [
  {
    id: 1,
    name: 'Aurora Suites',
    gif: '/cards/hotel1.gif',
    video: '/videos/v1.mkv',
  },
  {
    id: 2,
    name: 'Velaris Resort',
    gif: '/cards/hotel2.gif',
    video: '/videos/v2.mkv',
  },
];

function HotelCard({ hotel }: any) {
  const videoRef = useRef<HTMLVideoElement>(null);

  return (
    <div
      key={hotel.id}
      className='group relative rounded-xl overflow-hidden cursor-pointer'
      onMouseEnter={() => videoRef.current?.play()}
      onMouseLeave={() => {
        videoRef.current?.pause();
        videoRef.current!.currentTime = 0;
      }}
    >
      <video ref={videoRef} src={hotel.video} muted loop playsInline className='w-full h-full object-cover' />

      <div className='absolute inset-0 bg-linear-to-t from-black/70 to-transparent' />

      <div className='absolute bottom-4 left-4'>
        <h3 className='text-lg text-white'>{hotel.name}</h3>
      </div>
    </div>
  );
}

export default function HotelGrid() {
  return (
    <section className='px-6 py-24 max-w-6xl mx-auto'>
      <h2 className='text-3xl font-display mb-12 text-accent'>Featured Hotels</h2>

      <div className='grid md:grid-cols-2 gap-8'>{hotels.map((hotel) => HotelCard({ hotel }))}</div>
    </section>
  );
}
