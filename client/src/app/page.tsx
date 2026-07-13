"use client";

import { motion } from "framer-motion";
import { Navbar, HeroCarousel, InventoryGrid, TradeInSection, Footer, FloatingCTA, SearchBar } from "@/components";
import { useAppStore } from "@/store";
import { useVehicles, useParts, useClothing } from "@/hooks";
import { InventorySkeleton } from "@/components/InventorySkeleton";

export default function Home() {
  const { activeSection } = useAppStore();
  const { data: vehicles, isLoading: vehiclesLoading } = useVehicles();
  const { data: parts, isLoading: partsLoading } = useParts();
  const { data: clothing, isLoading: clothingLoading } = useClothing();
  const loading = vehiclesLoading || partsLoading || clothingLoading;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <SearchBar />

      <main className="flex-1">
        {activeSection === "inventory" && !loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <HeroCarousel vehicles={vehicles || []} />
          </motion.div>
        )}

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="py-8"
          >
            <h2 className="font-oswald text-2xl md:text-3xl text-gray-900 mb-2">
              {activeSection === "inventory" ? "Featured Vehicles" : activeSection === "clothing" ? "Clothing" : "Auto Parts"}
            </h2>
            <p className="font-inter text-gray-500">
              {activeSection === "inventory"
                ? "Browse our selection of quality vehicles"
                : activeSection === "clothing"
                ? "Shop our latest clothing"
                : "Find the right parts for your vehicle"}
            </p>
          </motion.div>

          {loading ? (
            <InventorySkeleton activeSection={activeSection} />
          ) : (
            <InventoryGrid
              vehicles={vehicles || []}
              parts={parts || []}
              clothing={clothing || []}
              activeSection={activeSection}
            />
          )}
        </section>

        <TradeInSection />
      </main>

      <Footer />
      <FloatingCTA />
    </div>
  );
}
