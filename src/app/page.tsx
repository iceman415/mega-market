"use client";

import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { HeroCarousel } from "@/components/HeroCarousel";
import { InventoryGrid } from "@/components/InventoryGrid";
import { TradeInSection } from "@/components/TradeInSection";
import { Footer } from "@/components/Footer";
import { FloatingCTA } from "@/components/FloatingCTA";
import { useAppStore } from "@/store";
import { useData } from "@/hooks/useData";

export default function Home() {
  const { activeSection } = useAppStore();
  const { vehicles, parts, loading } = useData();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-mega-blue border-t-transparent rounded-full animate-spin" />
          <p className="font-oswald text-xl text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <main className="flex-1">
        {activeSection === "inventory" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <HeroCarousel vehicles={vehicles} />
          </motion.div>
        )}

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="py-8"
          >
            <h2 className="font-oswald text-2xl md:text-3xl text-gray-900 mb-2">
              {activeSection === "inventory" ? "Featured Vehicles" : "Auto Parts"}
            </h2>
            <p className="font-inter text-gray-500">
              {activeSection === "inventory"
                ? "Browse our selection of quality vehicles"
                : "Find the right parts for your vehicle"}
            </p>
          </motion.div>

          <InventoryGrid
            vehicles={vehicles}
            parts={parts}
            activeSection={activeSection}
          />
        </section>

        <TradeInSection />
      </main>

      <Footer />

      <FloatingCTA />
    </div>
  );
}