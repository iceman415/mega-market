"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface ImageViewerProps {
  images: string[];
  initialIndex: number;
  onClose: () => void;
}

export function ImageViewer({ images, initialIndex, onClose }: ImageViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const panStart = useRef({ x: 0, y: 0 });
  const swipeStart = useRef(0);
  const isSwiping = useRef(false);
  const lastPinchDist = useRef(0);
  const dir = useRef(1);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { onClose(); return; }
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKey);
    };
  }, [onClose]);

  function prev() {
    if (currentIndex <= 0) return;
    dir.current = -1;
    setScale(1);
    setPosition({ x: 0, y: 0 });
    setCurrentIndex((i) => i - 1);
  }

  function next() {
    if (currentIndex >= images.length - 1) return;
    dir.current = 1;
    setScale(1);
    setPosition({ x: 0, y: 0 });
    setCurrentIndex((i) => i + 1);
  }

  const handlePointerDown = (e: React.PointerEvent) => {
    if (scale > 1) {
      setIsPanning(true);
      panStart.current = { x: e.clientX - position.x, y: e.clientY - position.y };
    } else {
      isSwiping.current = true;
      swipeStart.current = e.clientX;
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (isPanning) {
      setPosition({ x: e.clientX - panStart.current.x, y: e.clientY - panStart.current.y });
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (isSwiping.current) {
      const dx = e.clientX - swipeStart.current;
      if (Math.abs(dx) > 50) dx > 0 ? prev() : next();
    }
    setIsPanning(false);
    isSwiping.current = false;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2 && lastPinchDist.current > 0) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      setScale((s) => Math.max(1, Math.min(5, s * (dist / lastPinchDist.current))));
      lastPinchDist.current = dist;
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      lastPinchDist.current = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
    }
  };

  const handleTouchEnd = () => { lastPinchDist.current = 0; };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    setScale((s) => Math.max(1, Math.min(5, s - e.deltaY * 0.005)));
  };

  const toggleZoom = () => {
    if (scale > 1) { setScale(1); setPosition({ x: 0, y: 0 }); }
    else setScale(2);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
      onClick={onClose}
    >
      <button
        onClick={(e) => { e.stopPropagation(); onClose(); }}
        className="absolute top-3 right-3 sm:top-4 sm:right-4 text-white/80 hover:text-white z-30 transition-colors"
        aria-label="Close"
      >
        <X className="w-7 h-7 sm:w-8 sm:h-8" />
      </button>

      {images.length > 1 && (
        <>
          <button
            onClick={(e) => { e.stopPropagation(); prev(); }}
            disabled={currentIndex === 0}
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white z-30 disabled:opacity-20 transition-all"
          >
            <ChevronLeft className="w-8 h-8 sm:w-10 sm:h-10" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); next(); }}
            disabled={currentIndex === images.length - 1}
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white z-30 disabled:opacity-20 transition-all"
          >
            <ChevronRight className="w-8 h-8 sm:w-10 sm:h-10" />
          </button>
        </>
      )}

      <div
        className="relative w-full h-full max-w-[95vw] max-h-[95vh] flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onWheel={handleWheel}
        onDoubleClick={toggleZoom}
        style={{ touchAction: "none" }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: dir.current > 0 ? 250 : -250 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: dir.current > 0 ? -250 : 250 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="relative w-full h-full flex items-center justify-center"
          >
            <div
              className="relative w-full h-full"
              style={{
                transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                transition: isPanning ? "none" : "transform 0.15s ease-out",
              }}
            >
              <Image
                src={images[currentIndex]}
                alt=""
                fill
                className="object-contain"
                sizes="95vw"
                priority
                draggable={false}
              />
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/50 text-sm font-inter pointer-events-none">
        {currentIndex + 1} / {images.length}
      </div>
    </motion.div>
  );
}
