"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useRef, useState, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Vehicle } from "@/types";

interface VehicleCardProps {
  vehicle: Vehicle;
  onClick: () => void;
}

export function VehicleCard({ vehicle, onClick }: VehicleCardProps) {
  const [currentImage, setCurrentImage] = useState(0);
  const dragRef = useRef(false);
  const dragX = useRef(0);
  const dir = useRef(1);

  const nextImage = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    dir.current = 1;
    setCurrentImage((prev) => (prev + 1) % vehicle.images.length);
  }, [vehicle.images.length]);

  const prevImage = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    dir.current = -1;
    setCurrentImage((prev) => (prev - 1 + vehicle.images.length) % vehicle.images.length);
  }, [vehicle.images.length]);

  const handlePointerDown = (e: React.PointerEvent) => {
    dragRef.current = false;
    dragX.current = e.clientX;
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (Math.abs(e.clientX - dragX.current) > 10) dragRef.current = true;
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (dragRef.current) {
      const dx = e.clientX - dragX.current;
      if (dx > 50) prevImage();
      else if (dx < -50) nextImage();
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    if (dragRef.current) { e.stopPropagation(); return; }
    onClick();
  };

  return (
    <motion.div
      whileHover={{ y: -8 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleClick}
      className="bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer transition-shadow hover:shadow-xl"
    >
      <div
        className="relative h-48 w-full overflow-hidden"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        style={{ touchAction: "pan-y" }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentImage}
            initial={{ opacity: 0, x: dir.current > 0 ? 60 : -60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: dir.current > 0 ? -60 : 60 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute inset-0"
          >
            <Image
              src={vehicle.images[currentImage]}
              alt={`${vehicle.brand} ${vehicle.model}`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority={currentImage === 0}
            />
          </motion.div>
        </AnimatePresence>

        {vehicle.images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-1 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white/90 rounded-full p-1 transition-all hover:scale-110 active:scale-95"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-1 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white/90 rounded-full p-1 transition-all hover:scale-110 active:scale-95"
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
              {vehicle.images.map((_, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation();
                    dir.current = index > currentImage ? 1 : -1;
                    setCurrentImage(index);
                  }}
                  className={`rounded-full transition-all ${
                    index === currentImage
                      ? "bg-white w-3 h-3"
                      : "bg-white/50 hover:bg-white/70 w-2 h-2"
                  }`}
                />
              ))}
            </div>

            <span className="absolute top-2 right-2 bg-black/40 text-white text-[11px] px-2 py-0.5 rounded-full font-inter">
              {currentImage + 1}/{vehicle.images.length}
            </span>
          </>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-oswald text-xl text-gray-900 mb-1">
          {vehicle.brand} {vehicle.model}
        </h3>
        <p className="font-inter text-sm text-gray-500 mb-2">{vehicle.year}</p>
        <p className="font-inter text-sm text-gray-600 mb-4 line-clamp-2">
          {vehicle.description}
        </p>
        <p className="font-oswald text-2xl text-mega-blue">
          ${Number(vehicle.price).toLocaleString("en-US", { minimumFractionDigits: 2 })}
        </p>
      </div>
    </motion.div>
  );
}
