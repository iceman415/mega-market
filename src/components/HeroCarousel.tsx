"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Vehicle } from "@/types";

interface HeroCarouselProps {
  vehicles: Vehicle[];
}

export function HeroCarousel({ vehicles }: HeroCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (vehicles.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % vehicles.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [vehicles.length]);

  if (vehicles.length === 0) return null;

  const currentVehicle = vehicles[currentIndex];

  return (
    <div className="relative w-full h-[400px] md:h-[500px] overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentVehicle.id}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0"
        >
          <Image
            src={currentVehicle.images[0]}
            alt={`${currentVehicle.brand} ${currentVehicle.model}`}
            fill
            className="object-cover"
            priority
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="max-w-7xl mx-auto"
            >
              <h2 className="font-oswald text-3xl md:text-5xl text-white mb-2">
                {currentVehicle.brand} {currentVehicle.model}
              </h2>
              <p className="font-inter text-lg md:text-xl text-white/90 mb-4">
                {currentVehicle.year} | {currentVehicle.mileage} miles
              </p>
              <p className="font-oswald text-2xl md:text-3xl text-white">
                ${Number(currentVehicle.price).toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </p>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="absolute bottom-4 right-4 flex gap-2">
        {vehicles.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full transition-colors ${
              index === currentIndex ? "bg-white" : "bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
}