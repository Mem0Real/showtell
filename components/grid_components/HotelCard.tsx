"use client";

import Image from "next/image";

interface Hotel {
  name: string;
}

export const HotelCard = ({
  hotel,
  onOpen,
}: {
  hotel: Hotel;
  onOpen: (hotel: Hotel) => void;
}) => {
  const dir = hotel.name.replaceAll(" ", "_").toLowerCase();

  return (
    <button
      onClick={() => onOpen(hotel)}
      className="group relative w-full overflow-hidden rounded-2xl bg-neutral-200 text-left cursor-pointer"
    >
      {/* Image */}
      <div className="relative aspect-4/3 w-full">
        <Image
          src={`/3d/hotels/${dir}/card.png`}
          alt={hotel.name}
          fill
          priority={false}
          sizes="(max-width: 768px) 100vw, 50vw"
          className="
            object-cover
            transition-opacity
            duration-300
            group-hover:opacity-95
          "
        />
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/10 to-transparent" />

      {/* Text */}
      <div className="absolute bottom-0 p-5 text-white">
        <h3 className="text-2xl font-semibold">{hotel.name}</h3>

        <p className="text-sm text-white/70 mt-1">View experience</p>
      </div>
    </button>
  );
};
