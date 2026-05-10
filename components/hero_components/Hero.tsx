"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";
import { TextContainer } from "@/components/hero_components/TextContainer";
import { Navbar } from "@/components/Navbar";
import { VideoContainer } from "@/components/hero_components/VideoContainer";

type Phase =
  | "loading" // Pulse while video loads
  | "split" // Text splits, video appears small
  | "zoom" // Video zooms to full screen
  | "complete"; // Navbar and text fade in, autoplay starts

export const Hero = () => {
  const [phase, setPhase] = useState<Phase>("loading");
  const [videoLoaded, setVideoLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Handle video loading
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedData = () => {
      setVideoLoaded(true);
    };

    const handleError = (e: any) => {
      console.error("Video loading failed", e);
    };

    const checkIfLoaded = () => {
      // readyState 4 means HAVE_ENOUGH_DATA
      if (video.readyState >= 4) handleLoadedData();
      else {
        video.addEventListener("loadeddata", handleLoadedData);
        video.addEventListener("error", handleError);
      }
    };

    checkIfLoaded();

    return () => {
      video.removeEventListener("loadeddata", handleLoadedData);
      video.removeEventListener("error", handleError);
    };
  }, []);

  // Phase transitions
  useEffect(() => {
    let forceStartTimer: NodeJS.Timeout;
    forceStartTimer = setTimeout(() => {
      setVideoLoaded(true);
    }, 2000);

    return () => {
      clearTimeout(forceStartTimer);
    };
  }, []);

  useEffect(() => {
    if (!videoLoaded) return;

    // Check if user has already scrolled past hero
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const heroHeight = window.innerHeight;

      // If scrolled more than 20% of hero height, skip animations
      if (scrollY > heroHeight * 0.2) {
        // Jump straight to complete state
        setPhase("complete");
      }
    };

    // Check immediately
    handleScroll();

    // Also listen for scroll events during animation
    window.addEventListener("scroll", handleScroll, { passive: true });

    const timers: NodeJS.Timeout[] = [];

    // Phase 2: Split text and show small video
    timers.push(setTimeout(() => setPhase("split"), 500));

    // Phase 3: Video zooms to full screen
    timers.push(setTimeout(() => setPhase("zoom"), 2000));

    // Phase 4: Show overlay content
    timers.push(setTimeout(() => setPhase("complete"), 2500));

    return () => {
      timers.forEach(clearTimeout);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [videoLoaded]);

  // If mobile, skip animation alltogether and just fade & play
  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    if (isMobile) {
      setPhase("complete");
      return;
    }
  }, []);

  // Play video the moment it loads
  useEffect(() => {
    if (phase === "complete" && videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  }, [phase]);

  return (
    <section className="relative w-full h-[99vh] px-2 md:px-4 py-2 md:py-4 pb-2">
      <div className="relative border border-black text-neutral-800 h-full">
        {/* Navbar */}
        <Navbar phase={phase} />

        {/* Main Content */}
        <TextContainer phase={phase} />

        {/* Process being 
          1) Text split while image zooms in to 50%
          2) At 50% pause for a sec then text start unsplit while image zoom to box
          3) Navbar pushes down from top and overlay text pops up 
        */}

        {/* Video */}
        <VideoContainer videoRef={videoRef} phase={phase} />
      </div>
    </section>
  );
};
