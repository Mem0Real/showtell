"use client";

import { motion } from "motion/react";
import { playfair } from "@/lib/fonts";

export const ClipMask = () => {
  return (
    <section className="relative py-28 md:py-40 overflow-hidden bg-white">
      {/* Subtle background gradient */}
      <div className="absolute inset-0 bg-linear-to-b from-gray-50 via-white to-gray-50" />

      {/* Decorative top line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[90%] h-px bg-linear-to-r from-transparent via-gray-300 to-transparent" />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.5 }}
        className="relative z-10 max-w-5xl mx-auto px-6 text-center"
      >
        {/* Eyebrow */}
        <p className="uppercase tracking-[0.35em] text-xs md:text-sm text-gray-500 mb-6">
          Crafted Experiences
        </p>

        {/* Main Text */}
        <h2
          className={`text-4xl md:text-6xl lg:text-7xl leading-tight text-gray-900 ${playfair.className}`}
        >
          Crafting Spaces,
          <br />
          Creating Memories
        </h2>

        {/* Supporting text */}
        <p className="mt-8 max-w-2xl mx-auto text-gray-600 text-lg leading-relaxed">
          Thoughtfully designed stays that blend comfort, atmosphere, and
          unforgettable moments.
        </p>

        {/* Minimal divider */}
        <div className="mt-12 flex justify-center">
          <div className="w-24 h-px bg-gray-300" />
        </div>
      </motion.div>
    </section>
  );
};
