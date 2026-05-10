"use client";

import { useRef, useState, useEffect } from "react";
import { r3fTunnel } from "@/lib/r3fTunnel";
import { HDRIScene } from "./HDRIScene";

export const HDRIModal = ({
  hotel,
  onClose,
}: {
  hotel: any;
  onClose: () => void;
}) => {
  const [loaded, setLoaded] = useState(false);
  const [dragging, setDragging] = useState(false);

  const [isFullscreen, setIsFullscreen] = useState(false);

  // const dragging = useRef(false);
  const rotation = useRef({ x: 0, y: 0 });
  const modalRef = useRef<HTMLDivElement>(null);

  const dir = hotel.name.replaceAll(" ", "_").toLowerCase();

  // Dragging logic
  useEffect(() => {
    const move = (e: PointerEvent) => {
      if (!dragging) return;

      rotation.current.x += e.movementX * 0.005;
      rotation.current.y += e.movementY * 0.005;

      rotation.current.y = Math.max(
        -Math.PI / 2,
        Math.min(Math.PI / 2, rotation.current.y),
      );
    };

    const up = () => {
      setDragging(false);

      // exit pointer lock on release
      if (document.pointerLockElement) document.exitPointerLock();
    };

    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);

    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
  }, [dragging]);

  // ESC close
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();

        if (document.pointerLockElement) document.exitPointerLock();
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return (
    <div
      className={`fixed z-100 inset-0 flex items-center justify-center cursor-pointer
    ${!loaded && "bg-black/40"}
    `}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/5 -z-50 cursor-pointer"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        ref={modalRef}
        className={`relative z-60 isolate overflow-hidden rounded-2xl bg-transparent transition-all duration-300 cursor-grab
        ${
          isFullscreen
            ? "w-screen h-screen rounded-none"
            : "w-[94vw] h-[78vh] md:w-[88vw] md:h-[82vh] xl:w-[75vw] xl:h-[80vh]"
        }`}
        style={{
          cursor: dragging ? "none" : "grab",
          touchAction: "none",
        }}
      >
        {/* Preview */}
        {!loaded && (
          <img
            src={`/3d/hotels/${dir}/preview.png`}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500
              ${loaded ? "opacity-0" : "opacity-100"}
              `}
            alt={`${dir}_preview`}
          />
        )}

        {/* Spinner */}
        {!loaded && (
          <div className="absolute inset-0 z-20 flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          </div>
        )}

        {/* Top buttons */}
        <div
          className={`absolute right-4 z-50 flex gap-3 bg-transparent
          ${isFullscreen ? "top-16" : "top-4"}
          `}
        >
          <button
            onClick={() => setIsFullscreen((p) => !p)}
            className="h-10 w-10 rounded-full bg-black/50 text-white backdrop-blur-sm"
          >
            {isFullscreen ? "⤹" : "⛶"}
          </button>

          <button
            onClick={onClose}
            className="h-10 w-10 rounded-full bg-black/50 text-white backdrop-blur-sm"
          >
            ✕
          </button>
        </div>

        {/* 3D Layer */}
        <div
          className={`absolute inset-0 z-0 transition-opacity duration-500
          ${loaded ? "opacity-100" : "opacity-0"}
          `}
        >
          <r3fTunnel.In>
            <HDRIScene
              src={`/3d/hotels/${dir}/hotel_room.jpg`}
              rotation={rotation}
              active={true}
              modalRef={modalRef}
              onReady={() => setLoaded(true)}
            />
          </r3fTunnel.In>
        </div>

        {/* Interaction Layer */}
        <div
          className="absolute inset-0 z-30"
          onPointerDown={(e) => {
            e.stopPropagation();

            setDragging(true);

            (e.currentTarget as HTMLElement).requestPointerLock();
          }}
        />
      </div>
    </div>
  );
};
