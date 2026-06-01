"use client";

import { motion } from "framer-motion";
import { useAppStore } from "@/store";
import Image from "next/image";

export function Navbar() {
  const { activeSection, setActiveSection } = useAppStore();

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-4">
            <Image
              src="/logotype-mega-market.png"
              alt="MEGA MARKET"
              width={120}
              height={40}
              className="h-auto w-auto"
              style={{ width: 120, height: "auto" }}
            />
          </div>

          <div className="flex gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveSection("inventory")}
              className={`px-6 py-2 rounded-lg font-oswald text-sm transition-colors ${
                activeSection === "inventory"
                  ? "bg-mega-blue text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Vehicles
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveSection("parts")}
              className={`px-6 py-2 rounded-lg font-oswald text-sm transition-colors ${
                activeSection === "parts"
                  ? "bg-mega-blue text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Parts
            </motion.button>
          </div>
        </div>
      </div>
    </nav>
  );
}
