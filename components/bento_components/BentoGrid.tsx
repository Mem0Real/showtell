"use client";

import { useState, useRef } from "react";
import { BentoCard } from "@/components/bento_components/BentoCard";
import { playfair } from "@/lib/fonts";
import { bentoItems } from "@/lib/data";

const categories = ["All", "Luxury", "Resort", "Urban", "Rural"];

export const BentoGrid = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredItems =
    activeCategory === "All"
      ? bentoItems
      : bentoItems.filter((item) => item.category === activeCategory);

  const scrollTo = (id: string, block: ScrollLogicalPosition = "start") => {
    document
      .getElementById(id)
      ?.scrollIntoView({ behavior: "smooth", block: block });
  };

  return (
    <div className="w-full h-full mx-auto relative">
      <section
        ref={sectionRef}
        className="w-full min-h-screen relative py-12 md:py-20 px-4 md:px-6 lg:px-8 overflow-hidden bg-linear-to-b from-gray-50 via-white to-gray-50"
      >
        <div className="max-w-[95vw] lg:max-w-[85vw] mx-auto relative z-10">
          {/* Header */}
          <div className="mb-16 md:mb-20 max-w-3xl">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <span className="w-12 h-0.5 bg-gray-900" />
                <span className="text-sm font-medium text-gray-500 uppercase tracking-widest">
                  Curated Collection
                </span>
              </div>

              <h2
                className={`text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight min-h-36 ${playfair.className}`}
              >
                Discover Extraordinary <br />
                <span className="text-gray-400">Stays</span>
              </h2>

              <p className="text-gray-600 text-lg md:text-xl leading-relaxed max-w-2xl">
                Each property tells its own story. From urban penthouses to
                secluded retreats, find the perfect backdrop for your next
                chapter.
              </p>
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-3 mt-10">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`relative px-5 py-2.5 rounded-full text-sm font-medium transition-colors duration-200 hover:cursor-pointer ${
                    activeCategory === category
                      ? "bg-gray-900 text-white"
                      : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-100"
                  }`}
                >
                  {/* {category} */}
                  {activeCategory === category && (
                    <div className="absolute inset-0 bg-gray-900 rounded-full" />
                  )}
                  <span className="relative z-10">{category}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Bento Grid */}
          <div
            id="bentoGrid"
            className="grid grid-cols-2 md:grid-cols-4 auto-rows-[220px] md:auto-rows-[280px] gap-3"
          >
            {filteredItems.map((item, index) => (
              <div key={item.id} className="h-full">
                <BentoCard item={item} index={index} />
              </div>
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="text-center mt-16 md:mt-20">
            <div className="flex flex-col md:flex-row items-center justify-center gap-4">
              <button
                className="group relative px-8 py-4 bg-gray-900 text-white rounded-full font-medium text-lg overflow-hidden hover:cursor-pointer"
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
              </button>

              <button
                className="px-8 py-4 bg-black text-white rounded-full hover:bg-neutral-800 transition-colors"
                onClick={() => scrollTo("bentoGrid", "center")}
              >
                View Gallery
              </button>
            </div>

            <div className="flex items-center justify-center gap-8 mt-8 text-sm text-gray-400">
              <span>✦ Premium Locations</span>
              <span>✦ Best Rate Guarantee</span>
              <span>✦ Free Cancellation</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
