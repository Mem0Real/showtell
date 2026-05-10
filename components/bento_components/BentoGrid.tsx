"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useState, useRef } from "react";
import { BentoCard } from "@/components/bento_components/BentoCard";
import { playfair } from "@/lib/fonts";
import { bentoItems } from "@/lib/data";
import { scrollTo } from "@/lib/lenis";

const categories = ["All", "Luxury", "Resort", "Urban", "Rural"];

export const BentoGrid = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeCategory, setActiveCategory] = useState("All");

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const titleY = useTransform(scrollYProgress, [0, 0.5], [60, 0]);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.3], [0, 1]);
  const bgY = useTransform(scrollYProgress, [0, 1], [0, -50]);

  const filteredItems =
    activeCategory === "All"
      ? bentoItems
      : bentoItems.filter((item) => item.category === activeCategory);

  return (
    <div className="w-screen md:w-[97vw] lg:w-full h-full mx-auto relative">
      <section
        ref={sectionRef}
        className="w-full min-h-screen relative py-12 md:py-20 px-4 md:px-6 lg:px-8 overflow-hidden bg-linear-to-b from-gray-50 via-white to-gray-50"
      >
        {/* Animated Background */}
        <motion.div
          style={{ y: bgY }}
          className="absolute inset-0 pointer-events-none"
        >
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-100/30 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-amber-100/20 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-150 h-150 bg-rose-50/30 rounded-full blur-3xl" />
        </motion.div>

        <div className="max-w-[95vw] lg:max-w-[85vw] mx-auto relative z-10">
          {/* Header */}
          <motion.div
            className="mb-16 md:mb-20 max-w-3xl"
            style={{ y: titleY, opacity: titleOpacity }}
          >
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <span className="w-12 h-0.5 bg-gray-900" />
                <span className="text-sm font-medium text-gray-500 uppercase tracking-widest">
                  Curated Collection
                </span>
              </div>

              <h2
                className={`text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight ${playfair.className}`}
              >
                Discover Extraordinary
                <span className="relative inline-block">
                  Stays
                  <svg
                    className="absolute -bottom-2 left-0 w-full h-3 text-blue-500"
                    viewBox="0 0 100 10"
                    preserveAspectRatio="none"
                  >
                    <path
                      d="M 0 5 Q 50 10, 100 5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="8"
                      strokeLinecap="round"
                      opacity="0.3"
                    />
                  </svg>
                </span>
              </h2>

              <p className="text-gray-600 text-lg md:text-xl leading-relaxed max-w-2xl">
                Each property tells its own story. From urban penthouses to
                secluded retreats, find the perfect backdrop for your next
                chapter.
              </p>
            </motion.div>

            {/* Category Filter */}
            <motion.div
              className="flex flex-wrap gap-3 mt-10"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              {categories.map((category) => (
                <motion.button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`relative px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 hover:cursor-pointer ${
                    activeCategory === category
                      ? "bg-gray-900 text-white shadow-lg shadow-gray-900/20"
                      : "bg-white text-gray-600 hover:bg-gray-50 shadow-md hover:shadow-lg border border-gray-100"
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {/* {category} */}
                  {activeCategory === category && (
                    <motion.div
                      layoutId="activeCategory"
                      className="absolute inset-0 bg-gray-900 rounded-full"
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 30,
                      }}
                    />
                  )}
                  <span className="relative z-10">{category}</span>
                </motion.button>
              ))}
            </motion.div>
          </motion.div>

          {/* Bento Grid */}
          <motion.div
            id="bentoGrid"
            layout
            className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 auto-rows-max"
          >
            {filteredItems.map((item, index) => (
              <motion.div
                key={item.id}
                layout
                className="h-full"
                initial={{ opacity: 0, y: 40, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1,
                  type: "spring",
                  stiffness: 100,
                  damping: 15,
                }}
              >
                <BentoCard item={item} index={index} />
              </motion.div>
            ))}
          </motion.div>

          {/* Bottom CTA */}
          <motion.div
            className="text-center mt-16 md:mt-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
          >
            <div className="flex flex-col md:flex-row items-center justify-center gap-4">
              <motion.button
                className="group relative px-8 py-4 bg-gray-900 text-white rounded-full font-medium text-lg overflow-hidden shadow-lg shadow-gray-900/20 hover:cursor-pointer"
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => scrollTo("properties")}
              >
                <span className="relative z-10 flex items-center gap-2">
                  Explore All Properties
                  <svg
                    className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </span>
                <div className="absolute inset-0 bg-linear-to-r from-blue-600 to-purple-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </motion.button>

              <motion.button
                className="px-8 py-4 bg-white text-gray-900 rounded-full font-medium text-lg shadow-md hover:shadow-lg border border-gray-100"
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => scrollTo("bentoGrid", -500)}
              >
                View Gallery
              </motion.button>
            </div>

            <div className="flex items-center justify-center gap-8 mt-8 text-sm text-gray-400">
              <span>✦ Premium Locations</span>
              <span>✦ Best Rate Guarantee</span>
              <span>✦ Free Cancellation</span>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};
