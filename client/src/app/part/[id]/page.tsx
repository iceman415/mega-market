"use client";

import { useState, use, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { usePart } from "@/hooks";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  Package,
  ChevronLeft,
  ChevronRight,
  MessageCircle,
} from "lucide-react";
import ImageViewer from "@/components/ImageViewer";
import SoldBadge from "@/components/SoldBadge";
import YouTubeEmbed from "@/components/YouTubeEmbed";
import { PartDetailSkeleton } from "@/components/PartSkeleton";

const imgVariants = {
  enter: (d: number) => ({
    x: d > 0 ? "40%" : "-40%",
    opacity: 0,
    scale: 0.95,
  }),
  center: { x: "0%", opacity: 1, scale: 1 },
  exit: (d: number) => ({
    x: d < 0 ? "40%" : "-40%",
    opacity: 0,
    scale: 0.95,
  }),
};

export default function PartDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { data: part, isLoading } = usePart(id);

  const [[imageIndex, dir], setImageState] = useState([0, 0]);
  const [showFullscreen, setShowFullscreen] = useState(false);

  const images =
    part && part.images.length > 0 ? part.images : ["/placeholder.svg"];

  const goNext = useCallback(() => {
    setImageState(([i]) => [(i + 1) % images.length, 1]);
  }, [images.length]);

  const goPrev = useCallback(() => {
    setImageState(([i]) => [(i - 1 + images.length) % images.length, -1]);
  }, [images.length]);

  const handleDragEnd = useCallback(
    (_: unknown, info: { offset: { x: number }; velocity: { x: number } }) => {
      const threshold = 80;
      if (info.offset.x > threshold) goPrev();
      else if (info.offset.x < -threshold) goNext();
    },
    [goNext, goPrev],
  );

  if (isLoading) {
    return <PartDetailSkeleton />;
  }

  if (!part) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 gap-4">
        <p className="font-oswald text-2xl text-gray-900">Part not found</p>
        <Link
          href="/"
          className="flex items-center gap-2 text-mega-blue hover:underline font-inter"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-mega-blue transition-colors font-inter mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </motion.button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div
              className="relative aspect-[4/3] rounded-xl overflow-hidden bg-white shadow-md cursor-grab active:cursor-grabbing select-none"
              onClick={() => setShowFullscreen(true)}
            >
              <AnimatePresence initial={false} custom={dir}>
                <motion.div
                  key={imageIndex}
                  custom={dir}
                  variants={imgVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.15}
                  onDragEnd={handleDragEnd}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute inset-0"
                  style={{ touchAction: "pan-y" }}
                >
                  <Image
                    src={images[imageIndex]}
                    alt={part.name}
                    fill
                    className={cn(
                      "object-cover pointer-events-none",
                      part.sold && "grayscale",
                    )}
                    priority
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </motion.div>
              </AnimatePresence>

              {part.sold && (
                <div className="absolute top-4 left-4 z-20">
                  <SoldBadge size="lg" />
                </div>
              )}

              {images.length > 1 && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      goPrev();
                    }}
                    className="absolute top-1/2 left-3 z-20 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white backdrop-blur-sm transition-all hover:bg-black/60 hover:scale-110 active:scale-95"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      goNext();
                    }}
                    className="absolute top-1/2 right-3 z-20 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white backdrop-blur-sm transition-all hover:bg-black/60 hover:scale-110 active:scale-95"
                    aria-label="Next image"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="absolute bottom-3 left-1/2 z-20 -translate-x-1/2 rounded-full bg-black/60 px-3 py-1 text-xs text-white font-inter backdrop-blur-sm"
                  >
                    {imageIndex + 1} / {images.length}
                  </motion.div>
                </>
              )}
            </div>

            {images.length > 1 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex gap-2 mt-4 overflow-x-auto pb-2"
              >
                {images.map((img, i) => (
                  <motion.button
                    key={i}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setImageState([i, i > imageIndex ? 1 : -1])}
                    className={`relative w-20 h-16 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-colors ${
                      i === imageIndex
                        ? "border-mega-blue ring-2 ring-mega-blue/30"
                        : "border-transparent hover:border-gray-300"
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`Thumbnail ${i + 1}`}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </motion.button>
                ))}
              </motion.div>
            )}

            {part.youtubeUrl && (
              <div className="mt-6">
                <YouTubeEmbed url={part.youtubeUrl} />
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="space-y-6"
          >
            <div>
              <h1 className="text-3xl md:text-4xl font-bold font-oswald text-gray-900">
                {part.name}
              </h1>
              <p className="text-sm text-gray-500 font-inter mt-1">
                PN: {part.partNumber}
              </p>
            </div>

            <p className="text-3xl font-bold text-mega-blue font-oswald">
              ${Number(part.price).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>

            <div className="flex flex-wrap gap-4 text-sm font-inter">
              <span className="bg-white rounded-full px-4 py-2 shadow-sm text-gray-700">
                Fits: {part.compatibility}
              </span>
              <span className="flex items-center gap-1.5 bg-white rounded-full px-4 py-2 shadow-sm text-gray-700">
                <Package className="h-4 w-4 text-gray-400" />
                {part.location}
              </span>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="font-oswald text-lg font-semibold text-gray-900 mb-3">
                Description
              </h2>
              <p className="text-gray-600 leading-relaxed font-inter whitespace-pre-line">
                {part.description}
              </p>
            </div>

            {!part.sold && (
              <motion.a
                href={`/contact?item=part&id=${part.id}`}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center justify-center gap-2 w-full rounded-full bg-mega-blue px-8 py-3 text-base font-bold text-white shadow-lg hover:bg-mega-blue-dark transition-colors font-oswald"
              >
                <MessageCircle className="h-5 w-5" />
                Contact Us
              </motion.a>
            )}
          </motion.div>
        </div>
      </div>

      {showFullscreen && (
        <ImageViewer
          images={images}
          initialIndex={imageIndex}
          onClose={() => setShowFullscreen(false)}
        />
      )}
    </div>
  );
}

function cn(...classes: (string | false | undefined | null)[]) {
  return classes.filter(Boolean).join(" ");
}
