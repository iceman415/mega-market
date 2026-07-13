"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import type { Clothing } from "@/types";
import { cn } from "@/lib/utils";
import SoldBadge from "./SoldBadge";

interface ClothingCardProps {
  clothing: Clothing;
  onClick: () => void;
}

const fadeVariant = {
  enter: { opacity: 0, scale: 1.05 },
  center: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
};

export default function ClothingCard({ clothing, onClick }: ClothingCardProps) {
  const [[imageIndex, dir], setImageState] = useState([0, 0]);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartX = useRef(0);
  const totalImages = clothing.images.length;

  const goNext = useCallback(() => {
    setImageState(([i]) => [(i + 1) % totalImages, 1]);
  }, [totalImages]);

  const goPrev = useCallback(() => {
    setImageState(([i]) => [(i - 1 + totalImages) % totalImages, -1]);
  }, [totalImages]);

  const handlePointerDown = (e: React.PointerEvent) => {
    dragStartX.current = e.clientX;
    setIsDragging(false);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (Math.abs(e.clientX - dragStartX.current) > 5) {
      setIsDragging(true);
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    const diff = e.clientX - dragStartX.current;
    if (Math.abs(diff) > 50) {
      if (diff > 0) goPrev();
      else goNext();
    }
  };

  const handleClick = () => {
    if (!isDragging) onClick();
  };

  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      onClick={handleClick}
      className="group cursor-pointer overflow-hidden rounded-xl bg-white shadow-md transition-shadow hover:shadow-xl"
    >
      <div
        className="relative w-full overflow-hidden bg-gray-100"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        style={{ touchAction: "pan-y" }}
      >
        <div className="aspect-square">
          <AnimatePresence initial={false} custom={dir}>
            <motion.div
              key={imageIndex}
              custom={dir}
              variants={fadeVariant}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="absolute inset-0"
            >
              <Image
                src={clothing.images[imageIndex] || "/placeholder.svg"}
                alt={clothing.name}
                fill
                className={cn(
                  "object-cover",
                  clothing.sold && "grayscale",
                )}
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {clothing.sold && (
          <div className="absolute top-3 left-3 z-20">
            <SoldBadge size="md" />
          </div>
        )}

        {totalImages > 1 && (
          <>
            <button
              onClick={(e) => { e.stopPropagation(); goPrev(); }}
              className="absolute top-1/2 left-2 z-20 -translate-y-1/2 rounded-full bg-black/40 p-1 text-white opacity-0 transition-all hover:bg-black/60 group-hover:opacity-100 hover:scale-110 active:scale-95"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); goNext(); }}
              className="absolute top-1/2 right-2 z-20 -translate-y-1/2 rounded-full bg-black/40 p-1 text-white opacity-0 transition-all hover:bg-black/60 group-hover:opacity-100 hover:scale-110 active:scale-95"
              aria-label="Next image"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
            <div className="absolute bottom-2 right-2 z-20 rounded-full bg-black/60 px-2 py-0.5 text-xs text-white">
              {imageIndex + 1}/{totalImages}
            </div>
          </>
        )}

        {totalImages > 1 && (
          <div className="absolute bottom-2 left-1/2 z-20 flex -translate-x-1/2 gap-1">
            {clothing.images.map((_, i) => (
              <span
                key={i}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-300",
                  i === imageIndex ? "w-4 bg-white" : "w-1.5 bg-white/50",
                )}
              />
            ))}
          </div>
        )}
      </div>

      <div className="p-4 font-inter">
        <h3 className="mb-1 text-sm font-semibold text-gray-900 font-oswald">
          {clothing.name}
        </h3>
        <p className="mb-2 line-clamp-2 text-sm leading-snug text-gray-600 whitespace-pre-line">
          {clothing.description}
        </p>
        {clothing.size && <p className="text-xs text-gray-500">Size: {clothing.size}</p>}
        {clothing.color && <p className="text-xs text-gray-500">Color: {clothing.color}</p>}
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-mega-blue font-oswald">
            ${Number(clothing.price).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
          <span className="flex items-center gap-1 text-xs text-gray-400">
            <MapPin className="w-3 h-3" />
            {clothing.location}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
