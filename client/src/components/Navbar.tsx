"use client";

import Image from "next/image";
import Link from "next/link";
import { Search } from "lucide-react";
import { motion } from "framer-motion";
import { useAppStore } from "@/store";

interface NavbarProps {
  onSearchToggle?: () => void;
}

export default function Navbar({ onSearchToggle }: NavbarProps) {
  const { activeSection, setActiveSection } = useAppStore();

  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between bg-white px-3 py-3 shadow-md md:px-8">
      <Image
        src="/logotype-mega-market.png"
        alt="MEGA MARKET"
        width={160}
        height={40}
        className="h-8 sm:h-10 w-auto"
        priority
      />

      <div className="flex items-center gap-1 sm:gap-2">
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setActiveSection("inventory")}
          className={`rounded-full px-3 sm:px-5 py-1.5 text-sm font-semibold font-oswald tracking-wide transition-colors ${
            activeSection === "inventory"
              ? "bg-mega-blue text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          Vehicles
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setActiveSection("parts")}
          className={`rounded-full px-3 sm:px-5 py-1.5 text-sm font-semibold font-oswald tracking-wide transition-colors ${
            activeSection === "parts"
              ? "bg-mega-blue text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          Parts
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onSearchToggle}
          className="flex items-center justify-center rounded-full bg-gray-100 p-2 text-gray-700 hover:bg-gray-200"
          aria-label="Search"
        >
          <Search className="h-5 w-5" />
        </motion.button>

      </div>
    </nav>
  );
}
