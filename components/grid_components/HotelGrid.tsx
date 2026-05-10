"use client";

import { HotelCard } from "@/components/grid_components/HotelCard";
import { playfair } from "@/lib/fonts";
import { useState } from "react";
import { HDRIModal } from "@/components/grid_components/HDRIModal";
import { hotels } from "@/lib/data";

export const HotelGrid = () => {
  const [activeHotel, setActiveHotel] = useState<any>(null);

  return (
    <section
      id="properties"
      className="w-full bg-light py-16 md:py-20 px-4 md:px-8"
    >
      <div className="max-w-[92vw] xl:max-w-[85vw] mx-auto">
        {/* Header */}
        <div className="mb-12 md:mb-16">
          <p className="text-sm uppercase tracking-[0.25em] text-neutral-500 mb-4">
            Premium Collection
          </p>

          <h2
            className={`text-4xl md:text-6xl font-bold text-neutral-900 mb-4 ${playfair.className}`}
          >
            Properties Showcase
          </h2>

          <p className="text-neutral-600 text-base md:text-lg">
            Explore immersive hotel experiences
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {hotels.map((hotel) => (
            <HotelCard key={hotel.name} hotel={hotel} onOpen={setActiveHotel} />
          ))}
        </div>
      </div>

      {activeHotel && (
        <HDRIModal hotel={activeHotel} onClose={() => setActiveHotel(null)} />
      )}
    </section>
  );
};
