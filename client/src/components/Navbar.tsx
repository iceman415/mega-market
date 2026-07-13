"use client";

import Image from "next/image";
import { Search } from "lucide-react";
import { motion } from "framer-motion";
import { LuCar } from "react-icons/lu";
import { GiAutoRepair } from "react-icons/gi";
import { VscJersey } from "react-icons/vsc";
import { useAppStore } from "@/store";

interface NavbarProps {
  onSearchToggle?: () => void;
}

export default function Navbar({ onSearchToggle }: NavbarProps) {
  const { activeSection, setActiveSection } = useAppStore();

  const btnClass = (section: string) =>
    `shrink-0 rounded-full px-2.5 sm:px-4 py-1 sm:py-1.5 text-xs sm:text-sm font-semibold font-oswald tracking-wide transition-colors flex items-center gap-1 sm:gap-1.5 ${
      activeSection === section
        ? "bg-mega-blue text-white"
        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
    }`;

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-md">
      <div className="flex items-center justify-between px-2 sm:px-8 py-2 sm:py-3 gap-1 sm:gap-2">
        <Image
          src="/logotype-mega-market.png"
          alt="MEGA MARKET"
          width={120}
          height={30}
          className="h-8 sm:h-10 w-auto shrink-0"
          priority
        />

        <div className="flex items-center gap-1 sm:gap-2">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setActiveSection("inventory")}
            className={btnClass("inventory")}
          >
            <LuCar className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            Car
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setActiveSection("parts")}
            className={btnClass("parts")}
          >
            <GiAutoRepair className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            Part
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setActiveSection("clothing")}
            className={btnClass("clothing")}
          >
            <VscJersey className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            Clothing
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onSearchToggle}
            className="flex items-center justify-center rounded-full bg-gray-100 p-1.5 sm:p-2 text-gray-700 hover:bg-gray-200 shrink-0"
            aria-label="Search"
          >
            <Search className="h-4 w-4 sm:h-5 sm:w-5" />
          </motion.button>
        </div>
      </div>
    </nav>
  );
}
