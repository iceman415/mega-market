"use client";

import { use, useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Package, MapPin, ChevronLeft, ChevronRight, MessageCircle } from "lucide-react";
import { ImageViewer } from "@/components/ImageViewer";
import { Part } from "@/types";

interface PartPageProps {
  params: Promise<{ id: string }>;
}

export default function PartPage({ params }: PartPageProps) {
  const { id } = use(params);
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState(0);
  const [part, setPart] = useState<Part | null>(null);
  const [loading, setLoading] = useState(true);
  const [viewerOpen, setViewerOpen] = useState(false);
  const dragRef = useRef(false);
  const dragX = useRef(0);
  const dir = useRef(1);

  useEffect(() => {
    async function fetchPart() {
      try {
        const res = await fetch("/api/parts");
        const parts: Part[] = await res.json();
        const found = parts.find((p) => p.id === id);
        setPart(found || null);
      } catch (error) {
        console.error("Failed to fetch part:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchPart();
  }, [id]);

  const nextImage = useCallback(() => {
    if (!part) return;
    dir.current = 1;
    setSelectedImage((prev) => (prev + 1) % part.images.length);
  }, [part]);

  const prevImage = useCallback(() => {
    if (!part) return;
    dir.current = -1;
    setSelectedImage((prev) => (prev - 1 + part.images.length) % part.images.length);
  }, [part]);

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-mega-blue border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!part) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-oswald text-2xl mb-4">Part not found</h1>
          <button onClick={() => router.back()}>Go Back</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.button
          whileHover={{ x: -4 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => router.back()}
          className="flex items-center gap-2 text-mega-blue mb-6 font-oswald"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Parts
        </motion.button>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="w-full min-w-0">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative h-[250px] sm:h-[300px] md:h-[400px] rounded-xl overflow-hidden mb-4 bg-black/5"
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              style={{ touchAction: "pan-y" }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedImage}
                  initial={{ opacity: 0, x: dir.current > 0 ? 80 : -80 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: dir.current > 0 ? -80 : 80 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="absolute inset-0 cursor-pointer"
                  onClick={() => setViewerOpen(true)}
                >
                  <Image
                    src={part.images[selectedImage]}
                    alt={part.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority
                  />
                </motion.div>
              </AnimatePresence>

              {part.images.length > 1 && (
                <>
                  <button
                    onClick={(e) => { e.stopPropagation(); prevImage(); }}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white/90 rounded-full p-1.5 transition-all hover:scale-110 active:scale-95 z-10"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); nextImage(); }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white/90 rounded-full p-1.5 transition-all hover:scale-110 active:scale-95 z-10"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>

                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                    {part.images.map((_, index) => (
                      <button
                        key={index}
                        onClick={(e) => { e.stopPropagation(); dir.current = index > selectedImage ? 1 : -1; setSelectedImage(index); }}
                        className={`rounded-full transition-all ${
                          index === selectedImage
                            ? "bg-white w-3 h-3"
                            : "bg-white/50 hover:bg-white/70 w-2 h-2"
                        }`}
                      />
                    ))}
                  </div>

                  <span className="absolute top-2 right-2 bg-black/40 text-white text-xs px-2 py-0.5 rounded-full z-10 font-inter">
                    {selectedImage + 1}/{part.images.length}
                  </span>
                </>
              )}
            </motion.div>

            {part.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2 max-w-full scrollbar-thin">
                {part.images.map((image, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => { dir.current = index > selectedImage ? 1 : -1; setSelectedImage(index); }}
                    className={`relative h-16 w-20 sm:h-20 sm:w-24 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-colors ${
                      selectedImage === index
                        ? "border-mega-blue"
                        : "border-transparent"
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`Image ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="96px"
                    />
                  </motion.button>
                ))}
              </div>
            )}
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="min-w-0"
          >
            <h1 className="font-oswald text-2xl sm:text-3xl md:text-4xl text-gray-900 mb-2">
              {part.name}
            </h1>
            <p className="font-inter text-lg sm:text-xl text-gray-500 mb-6">
              Part #: {part.partNumber}
            </p>

            <div className="bg-white rounded-xl p-4 sm:p-6 mb-6">
              <p className="font-oswald text-2xl sm:text-3xl text-mega-blue mb-4">
                ${Number(part.price).toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Package className="w-5 h-5 text-gray-500" />
                  <p className="font-inter text-gray-600">{part.compatibility}</p>
                </div>
                <div>
                  <p className="font-inter text-sm text-gray-500">Location</p>
                  <p className="font-oswald text-lg flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {part.location || "Dealership"}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 sm:p-6">
              <h3 className="font-oswald text-xl mb-4">Description</h3>
              <p className="font-inter text-gray-600">{part.description}</p>
            </div>

            <Link href="/contact?item=part">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full bg-mega-blue text-white py-4 rounded-full font-oswald text-lg inline-flex items-center justify-center gap-3 hover:bg-mega-blue-dark transition-colors mt-6"
              >
                <MessageCircle className="w-5 h-5" />
                Contact
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </div>

      {viewerOpen && (
        <ImageViewer
          images={part.images}
          initialIndex={selectedImage}
          onClose={() => setViewerOpen(false)}
        />
      )}
    </div>
  );
}
