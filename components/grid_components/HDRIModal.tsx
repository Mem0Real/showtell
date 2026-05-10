"use client";

import { useRef, useState, useEffect } from "react";
import { r3fTunnel } from "@/lib/r3fTunnel";
import { HDRIScene } from "./HDRIScene";
import Image from "next/image";

export const HDRIModal = ({
  hotel,
  onClose,
}: {
  hotel: any;
  onClose: () => void;
}) => {
  const [loaded, setLoaded] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [dragging, setDragging] = useState(false);

  // const dragging = useRef(false);
  const rotation = useRef({ x: 0, y: 0 });
  const modalRef = useRef<HTMLDivElement>(null);

  const dir = hotel.name.replaceAll(" ", "_").toLowerCase();

  // pointer drag
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

        if (document.pointerLockElement) {
          document.exitPointerLock();
        }
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-90 flex items-center justify-center cursor-pointer">
      {/* BACKDROP */}
      <div
        className="absolute inset-0 bg-black/5 z-90 cursor-pointer"
        onClick={onClose}
      />

      {/* MODAL */}
      <div
        ref={modalRef}
        className={`relative z-100 isolate overflow-hidden rounded-2xl bg-transparent transition-all duration-300 cursor-grab
        ${
          isFullscreen
            ? "w-screen h-screen rounded-none"
            : "w-[94vw] h-[78vh] md:w-[88vw] md:h-[82vh] xl:w-[75vw] xl:h-[80vh]"
        }`}
      >
        {/* PREVIEW */}
        {!loaded && (
          <Image
            src={`/3d/hotels/${dir}/preview.png`}
            className="absolute inset-0 w-full h-full object-cover cursor-grab"
            fill
            alt={`${dir}_preview`}
          />
        )}

        {/* LOADER */}
        {!loaded && (
          <div className="absolute inset-0 flex items-center justify-center z-105">
            <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          </div>
        )}

        {/* TOP UI */}
        <div className="absolute top-4 right-4 z-110 flex gap-3">
          <button
            onClick={() => setIsFullscreen((p) => !p)}
            className="h-10 w-10 rounded-full bg-black/50 text-white backdrop-blur-sm"
          >
            {isFullscreen ? "⤢" : "⛶"}
          </button>

          <button
            onClick={onClose}
            className="h-10 w-10 rounded-full bg-black/50 text-white backdrop-blur-sm"
          >
            ✕
          </button>
        </div>

        {/* 3D SCENE */}
        <div className="absolute inset-0 z-95">
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

        {/* INTERACTION LAYER */}
        <div
          className="absolute inset-0 z-100"
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
