import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { playfair } from "@/lib/fonts";

const navlinks = [
  { title: "Home", url: "#" },
  { title: "About", url: "#" },
  { title: "Contact", url: "#" },
];

export const Navbar = ({ phase }: { phase: string }) => {
  const [hidden, setHidden] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false); // State for mobile menu

  useEffect(() => {
    let lastY = window.scrollY;

    const handleScroll = () => {
      const currentY = window.scrollY;

      if (currentY > lastY && currentY > 100) {
        setHidden(true);
        setMobileMenuOpen(false);
      } else {
        setHidden(false);
      }

      lastY = currentY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const navbarVariants = {
    hidden: {
      y: -40,
      opacity: 0,
      transition: { duration: 0.3, ease: "easeOut" },
    },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        delay: 0.2,
      },
    },
  };

  return (
    <motion.nav
      variants={navbarVariants as any}
      initial="hidden"
      animate={
        phase === "complete" ? (hidden ? "hidden" : "visible") : "hidden"
      }
      className="fixed top-4 left-0 right-0 z-40 w-[96%] lg:w-[97%] xl:w-[98.3%] mx-auto"
    >
      <div className="mx-auto flex justify-between items-center bg-light text-stone-800 ps-8 h-full border border-stone-800">
        <div
          className={`text-xl py-2 pr-4 font-bold h-full border-r border-stone-800 uppercase ${playfair.className}`}
        >
          showtell
        </div>

        {/* Hamburger Button for mobile */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="block md:hidden p-2 mr-2"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? (
            // Close Icon
            <motion.svg
              className="size-6"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M18 6L6 18M6 6L18 18"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </motion.svg>
          ) : (
            // Simple Hamburger Icon
            <motion.svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </motion.svg>
          )}
        </button>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex h-full">
          {navlinks.map((link, i) => (
            <Link
              key={i}
              href={link.url}
              className="h-full py-2 px-16 text-base border border-stone-800 border-y-0 not-first:border-l-0 last:border-r-0"
            >
              {link.title}
            </Link>
          ))}
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10, transition: { duration: 0.3 } }}
          className="bg-light border border-stone-800 border-t-0 mx-2 rounded-b-2xl overflow-hidden md:hidden"
        >
          <div className="flex flex-col">
            {navlinks.map((link, i) => (
              <Link
                key={i}
                href={link.url}
                className="py-3 px-8 text-base border-b border-stone-800 last:border-b-0"
                onClick={() => setMobileMenuOpen(false)} // Close menu on click
              >
                {link.title}
              </Link>
            ))}
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
};
