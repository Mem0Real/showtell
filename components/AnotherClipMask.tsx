"use client";

import { motion } from "motion/react";
import { playfair } from "@/lib/fonts";

export const AnotherClipMask = () => {
  return (
    <section className="relative py-28 md:py-36 bg-gray-50 overflow-hidden">
      {/* Background accents */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-gray-300 to-transparent" />

        <div className="absolute inset-y-0 left-8 w-px bg-linear-to-b from-transparent via-gray-200 to-transparent hidden lg:block" />

        <div className="absolute inset-y-0 right-8 w-px bg-linear-to-b from-transparent via-gray-200 to-transparent hidden lg:block" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.5 }}
        className="relative z-10 max-w-4xl mx-auto px-6 text-center"
      >
        <p className="uppercase tracking-[0.35em] text-xs md:text-sm text-gray-500 mb-6">
          Your Next Escape
        </p>

        <h2
          className={`text-4xl md:text-6xl lg:text-7xl text-gray-900 leading-tight ${playfair.className}`}
        >
          Your Safe Haven
          <br />
          Awaits
        </h2>

        <p className="mt-8 text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
          Exceptional hospitality, refined interiors, and destinations designed
          for rest and inspiration.
        </p>

        <div className="mt-12 flex items-center justify-center gap-3">
          <span className="w-2 h-2 rounded-full bg-gray-300" />
          <span className="w-16 h-px bg-gray-300" />
          <span className="w-2 h-2 rounded-full bg-gray-300" />
        </div>
      </motion.div>
    </section>
  );
};
