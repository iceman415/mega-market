"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface ImageViewerProps {
  images: string[];
  initialIndex: number;
  onClose: () => void;
}

export default function ImageViewer({
  images,
  initialIndex,
  onClose,
}: ImageViewerProps) {
  const [index, setIndex] = useState(initialIndex);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [dragPos, setDragPos] = useState({ x: 0, y: 0 });
  const [imageSize, setImageSize] = useState({ w: 0, h: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const lastPinchDist = useRef(0);

  const total = images.length;

  const resetZoom = useCallback(() => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  }, []);

  const goNext = useCallback(() => {
    resetZoom();
    setIndex((i) => (i + 1) % total);
  }, [total, resetZoom]);

  const goPrev = useCallback(() => {
    resetZoom();
    setIndex((i) => (i - 1 + total) % total);
  }, [total, resetZoom]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [onClose, goPrev, goNext]);

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setScale((s) => {
      const next = Math.max(1, Math.min(5, s + delta));
      return next;
    });
  };

  const handleDoubleClick = () => {
    if (scale > 1) {
      resetZoom();
    } else {
      setScale(3);
    }
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    if (scale > 1) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
      setDragPos({ x: e.clientX, y: e.clientY });
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (isDragging && scale > 1) {
      const dx = e.clientX - dragStart.x;
      const dy = e.clientY - dragStart.y;
      setPosition({ x: dx, y: dy });
    }
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      lastPinchDist.current = Math.hypot(dx, dy);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      e.preventDefault();
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const dist = Math.hypot(dx, dy);
      if (lastPinchDist.current > 0) {
        const delta = dist / lastPinchDist.current;
        setScale((s) => Math.max(1, Math.min(5, s * delta)));
      }
      lastPinchDist.current = dist;
    }
  };

  const handleTouchEnd = () => {
    lastPinchDist.current = 0;
  };

  const handleContainerPointerDown = (e: React.PointerEvent) => {
    if (scale <= 1 && e.target === containerRef.current) {
      const rect = containerRef.current!.getBoundingClientRect();
      const clickX = e.clientX;
      const third = rect.width / 3;
      if (clickX < rect.left + third) goPrev();
      else if (clickX > rect.right - third) goNext();
      else onClose();
    }
  };

  if (total === 0) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90"
      onPointerDown={handleContainerPointerDown}
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        className="absolute top-4 right-4 z-30 rounded-full bg-white/10 p-2 text-white backdrop-blur-sm transition-colors hover:bg-white/20"
        aria-label="Close"
      >
        <X className="h-6 w-6" />
      </button>

      {total > 1 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            goPrev();
          }}
          className="absolute left-4 top-1/2 z-30 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white backdrop-blur-sm transition-colors hover:bg-white/20"
          aria-label="Previous"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
      )}

      {total > 1 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            goNext();
          }}
          className="absolute right-4 top-1/2 z-30 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white backdrop-blur-sm transition-colors hover:bg-white/20"
          aria-label="Next"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      )}

      <div
        className="relative flex h-full w-full items-center justify-center overflow-hidden"
        onWheel={handleWheel}
        onDoubleClick={handleDoubleClick}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{ touchAction: scale > 1 ? "none" : "pan-y" }}
      >
        <Image
          src={images[index]}
          alt={`Image ${index + 1}`}
          width={1200}
          height={900}
          className="max-h-full max-w-full object-contain transition-transform duration-200"
          style={{
            transform: `scale(${scale}) translate(${position.x / scale}px, ${position.y / scale}px)`,
            cursor: scale > 1 ? "grab" : "zoom-in",
          }}
          draggable={false}
          onLoadingComplete={(img) => {
            setImageSize({ w: img.naturalWidth, h: img.naturalHeight });
          }}
          sizes="100vw"
          priority
        />
      </div>

      {total > 1 && (
        <div className="absolute bottom-6 left-1/2 z-30 -translate-x-1/2 rounded-full bg-white/10 px-4 py-2 text-sm text-white backdrop-blur-sm">
          {index + 1} / {total}
        </div>
      )}
    </div>
  );
}
