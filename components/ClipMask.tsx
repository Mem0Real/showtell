import React from 'react';

export const ClipMask = () => {
  return (
    <div className='py-12 md:py-16 lg:py-24 h-full bg-linear-to-b from-light to-gray-50'>
      <section className='relative overflow-hidden bg-linear-to-r from-slate-500 to-slate-200'>
        {/* Scribble Top Border */}
        <div
          className='h-8 bg-repeat-x'
          style={{
            backgroundImage: `url("data:image/svg+xml,%3csvg width='100' height='20' viewBox='0 0 100 20' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M0,10 Q10,5 20,10 T40,10 T60,10 T80,10 T100,10 L100,20 L0,20 Z' fill='white'/%3e%3c/svg%3e")`,
            clipPath: 'polygon(21% 16%, 100% 0%, 84% 79%, 0% 100%)', // Creates 45-degree slant
          }}
        ></div>

        <div
          className='py-16 px-8 relative'
          style={{
            clipPath: 'polygon(21% 16%, 100% 0%, 84% 79%, 0% 100%)', // Creates 45-degree slant
          }}
        >
          <h2 className='text-3xl md:text-5xl font-bold text-center text-slate-800'>
            "Design with <span className='text-purple-600'>Purpose</span>"
          </h2>
        </div>

        {/* Scribble Bottom Border */}
        <div
          className='h-8 bg-repeat-x'
          style={{
            backgroundImage: `url("data:image/svg+xml,%3csvg width='100' height='40' viewBox='0 0 100 20' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M0,0 Q10,5 20,0 T40,0 T60,0 T80,0 T100,0 L100,10 L0,10 Z' fill='white'/%3e%3c/svg%3e")`,
            clipPath: 'polygon(84%, 79%, 100% 0%, 24% 39%, 0% 100%)', // Creates 45-degree slant
          }}
        ></div>
      </section>
    </div>
  );
};
