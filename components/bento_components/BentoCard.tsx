import Image from "next/image";

import { BentoItem } from "@/lib/types";

export const BentoCard = ({
  item,
  index,
}: {
  item: BentoItem;
  index: number;
}) => {
  const sizeClasses = {
    small: "col-span-1 row-span-1",
    medium: "col-span-1 row-span-1",
    large: "col-span-2 row-span-2",
    tall: "col-span-1 row-span-2",
    wide: "col-span-2 row-span-1",
  };

  return (
    <article
      className={`${sizeClasses[item.size]} group relative overflow-hidden rounded-2xl bg-neutral-200 min-h-55 md:min-h-70`}
      style={{ contain: "layout paint" }}
    >
      {/* IMAGE */}
      <Image
        src={item.image}
        alt={item.title}
        fill
        priority={index < 2}
        quality={75}
        sizes="
          (max-width: 768px) 50vw,
          (max-width: 1200px) 33vw,
          25vw
        "
        className="
          object-cover
          transition-transform duration-500
          group-hover:scale-[1.03]
        "
        loading={index < 2 ? "eager" : "lazy"}
      />

      {/* OVERLAY */}
      <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />

      {/* CONTENT */}
      <div className="absolute inset-x-0 bottom-0 z-10 p-4 md:p-5">
        <span className="inline-block text-[10px] md:text-xs uppercase tracking-wider text-white/70 mb-2">
          {item.category}
        </span>

        <h3 className="text-white text-lg md:text-2xl font-semibold leading-tight">
          {item.title}
        </h3>

        <p className="text-white/70 text-sm mt-1">{item.location}</p>

        {/* EXTRA INFO */}
        <div className="mt-3 flex items-center gap-3 text-xs text-white/80">
          {item.stats?.rooms && <span>{item.stats.rooms} Rooms</span>}

          {item.stats?.rating && <span>★ {item.stats.rating}</span>}
        </div>
      </div>
    </article>
  );
};
