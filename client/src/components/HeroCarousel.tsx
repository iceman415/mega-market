"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import type { Vehicle } from "@/types";
import { cn } from "@/lib/utils";
import SoldBadge from "./SoldBadge";

interface HeroCarouselProps {
  vehicles: Vehicle[];
}

const slideVariant = {
  enter: (d: number) => ({
    x: d > 0 ? "100%" : "-100%",
    opacity: 0,
  }),
  center: { x: 0, opacity: 1 },
  exit: (d: number) => ({
    x: d < 0 ? "100%" : "-100%",
    opacity: 0,
  }),
};

export default function HeroCarousel({ vehicles }: HeroCarouselProps) {
  const [[page, dir], setPage] = useState([0, 0]);
  const total = vehicles.length;
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const goTo = useCallback(
    (i: number) => {
      setPage(([p]) => [i, i > p ? 1 : -1]);
    },
    [],
  );

  const goNext = useCallback(() => {
    setPage(([p]) => [(p + 1) % total, 1]);
  }, [total]);

  const goPrev = useCallback(() => {
    setPage(([p]) => [(p - 1 + total) % total, -1]);
  }, [total]);

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(goNext, 2000);
  }, [goNext]);

  useEffect(() => {
    if (total <= 1) return;
    resetTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [total, resetTimer]);

  if (total === 0) return null;

  const vehicle = vehicles[page];

  return (
    <div
      className="relative w-full overflow-hidden bg-gray-900"
      style={{ height: "min(500px, 50vh)" }}
    >
      <AnimatePresence initial={false} custom={dir}>
        <motion.div
          key={page}
          custom={dir}
          variants={slideVariant}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0"
          onAnimationComplete={resetTimer}
        >
          <Link href={`/vehicle/${vehicle.id}`} className="relative block h-full w-full">
            <Image
              src={vehicle.images[0] || "/placeholder.svg"}
              alt={`${vehicle.brand} ${vehicle.model}`}
              fill
              className={cn("object-cover", vehicle.sold && "grayscale")}
              priority
              sizes="100vw"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

            {vehicle.sold && (
              <div className="absolute top-6 left-6 z-20">
                <SoldBadge size="lg" />
              </div>
            )}

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="absolute bottom-0 left-0 right-0 p-6 md:p-10"
            >
              <h2 className="mb-2 text-2xl font-bold text-white md:text-4xl font-oswald drop-shadow-lg">
                {vehicle.brand} {vehicle.model}
              </h2>
              <div className="flex flex-wrap items-center gap-3 text-sm text-white/90 md:text-base drop-shadow">
                <span>{vehicle.year}</span>
                <span className="text-white/40">|</span>
                <span>{vehicle.mileage} mi</span>
                <span className="text-white/40">|</span>
                <span className="text-lg font-bold text-white font-oswald">
                  ${Number(vehicle.price).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
            </motion.div>
          </Link>
        </motion.div>
      </AnimatePresence>

      {total > 1 && (
        <>
          <button
            onClick={() => { goPrev(); resetTimer(); }}
            className="absolute top-1/2 left-4 z-20 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white backdrop-blur-sm transition-all hover:bg-black/60 hover:scale-110 active:scale-95"
            aria-label="Previous"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={() => { goNext(); resetTimer(); }}
            className="absolute top-1/2 right-4 z-20 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white backdrop-blur-sm transition-all hover:bg-black/60 hover:scale-110 active:scale-95"
            aria-label="Next"
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 gap-2">
            {vehicles.map((_, i) => (
              <button
                key={i}
                onClick={() => { goTo(i); resetTimer(); }}
                className={cn(
                  "rounded-full transition-all duration-500 ease-out",
                  i === page
                    ? "w-10 h-2.5 bg-white shadow-[0_0_10px_rgba(255,255,255,0.6)]"
                    : "w-2.5 h-2.5 bg-white/40 hover:bg-white/70",
                )}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
