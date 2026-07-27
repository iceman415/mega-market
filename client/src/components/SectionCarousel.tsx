"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import SoldBadge from "./SoldBadge";

interface CarouselItem {
  id: string;
  name: string;
  images: string[];
  price: string;
  sold: boolean;
  link: string;
}

interface SectionCarouselProps {
  items: CarouselItem[];
  title: string;
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

export default function SectionCarousel({ items, title }: SectionCarouselProps) {
  const [[page, dir], setPage] = useState([0, 0]);
  const total = items.length;
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
    timerRef.current = setInterval(goNext, 5000);
  }, [goNext]);

  useEffect(() => {
    if (total <= 1) return;
    resetTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [total, resetTimer]);

  if (total === 0) return null;

  const item = items[page];

  return (
    <div className="relative w-full overflow-hidden rounded-xl bg-gray-900" style={{ height: "min(400px, 40vh)" }}>
      <div className="absolute top-4 left-4 z-20">
        <span className="rounded-full bg-white/20 px-4 py-1.5 text-sm font-bold text-white backdrop-blur-sm font-oswald">
          {title}
        </span>
      </div>

      <AnimatePresence initial={false} custom={dir}>
        <motion.div
          key={page}
          custom={dir}
          variants={slideVariant}
          initial="enter"
          animate="center"
          exit="exit"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          onDragEnd={(_, info) => {
            const threshold = 60;
            if (info.offset.x > threshold) { goPrev(); resetTimer(); }
            else if (info.offset.x < -threshold) { goNext(); resetTimer(); }
          }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0 cursor-grab active:cursor-grabbing"
          style={{ touchAction: "pan-y" }}
        >
          <Link href={item.link} className="relative block h-full w-full">
            <Image
              src={item.images[0] || "/placeholder.svg"}
              alt={item.name}
              fill
              className={cn("object-cover", item.sold && "grayscale")}
              priority
              sizes="100vw"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

            {item.sold && (
              <div className="absolute top-6 right-6 z-20">
                <SoldBadge size="lg" />
              </div>
            )}

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="absolute bottom-0 left-0 right-0 p-6 md:p-10"
            >
              <h2 className="mb-2 text-xl md:text-3xl font-bold text-white font-oswald drop-shadow-lg">
                {item.name}
              </h2>
              <div className="flex flex-wrap items-center gap-3 text-sm text-white/90 md:text-base drop-shadow">
                <span className="text-lg font-bold text-white font-oswald">
                  ${Number(item.price).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
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
            {items.map((_, i) => (
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
