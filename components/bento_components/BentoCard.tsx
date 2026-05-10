import React, { useState, useRef } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { BentoItem } from "@/lib/types";

export const BentoCard = ({
  item,
  index,
}: {
  item: BentoItem;
  index: number;
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  // Grid placement based on size
  const sizeClasses = {
    small: "col-span-1 row-span-1",
    medium: "col-span-1 row-span-1 md:col-span-1 md:row-span-1",
    large: "col-span-2 row-span-2",
    tall: "col-span-1 row-span-2",
    wide: "col-span-2 row-span-1",
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePosition({ x, y });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setMousePosition({ x: 0, y: 0 });
  };
  return (
    <motion.div
      ref={cardRef}
      className={`
        ${sizeClasses[item.size]} 
        relative rounded-2xl overflow-hidden group cursor-pointer
        shadow-lg hover:shadow-2xl transition-shadow duration-500
        min-h-72 md:min-h-96 lg:min-h-125 perspective-distant transform-3d h-full
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className="absolute inset-0 size-full">
        <motion.div
          className="size-full relative"
          animate={{
            scale: isHovered ? 1.1 : 1,
            x: isHovered ? mousePosition.x * -15 : 0,
            y: isHovered ? mousePosition.y * -15 : 0,
          }}
          transition={{ type: "spring", stiffness: 200, damping: 25 }}
        >
          <Image
            src={item.image}
            alt={item.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 50vw, 25vw"
            priority={index < 4}
            style={{ objectFit: "cover" }}
          />
        </motion.div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/30 to-transparent z-10" />
      </div>

      {/* Content */}
      <div className="absolute inset-0 z-30 p-3 md:p-4 lg:p-6 flex flex-col justify-end">
        {/* Category Tag */}
        <motion.span
          className="self-start px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs text-white font-medium mb-2"
          whileHover={{ scale: 1.05 }}
        >
          {item.category || "Luxury"}
        </motion.span>

        {/* Title & Location */}
        <motion.div
          animate={{ y: isHovered ? -10 : 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 25 }}
        >
          <h3 className="text-white text-lg md:text-xl lg:text-2xl font-bold mb-1 leading-tight">
            {item.title}
          </h3>
          <div className="flex items-center gap-2 text-white/80 text-xs md:text-sm">
            <svg
              className="w-3 h-3 md:w-4 md:h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <span>{item.location}</span>
          </div>
        </motion.div>

        {/* Hover Content */}
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{
            opacity: isHovered ? 1 : 0,
            height: isHovered ? "auto" : 0,
          }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="overflow-hidden"
        >
          <div className="pt-3 space-y-3">
            {item.stats && (
              <div className="flex flex-wrap gap-2">
                {item.stats.rooms && (
                  <span className="px-2 py-1 bg-white/20 backdrop-blur-sm rounded-md text-white text-xs">
                    🛏️ {item.stats.rooms} Rooms
                  </span>
                )}
                {item.stats.area && (
                  <span className="px-2 py-1 bg-white/20 backdrop-blur-sm rounded-md text-white text-xs">
                    📐 {item.stats.area}
                  </span>
                )}
                {item.stats.rating && (
                  <span className="px-2 py-1 bg-white/20 backdrop-blur-sm rounded-md text-white text-xs flex items-center gap-1">
                    ⭐ {item.stats.rating}
                  </span>
                )}
              </div>
            )}

            {item.description && (
              <p className="text-white/90 text-xs md:text-sm line-clamp-2 leading-relaxed">
                {item.description}
              </p>
            )}

            <motion.button
              className="px-4 py-2 bg-white text-gray-900 rounded-lg text-xs md:text-sm font-medium hover:bg-gray-100 transition-colors w-full"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              View Details
            </motion.button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};
