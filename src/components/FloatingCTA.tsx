"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { DollarSign } from "lucide-react";

interface FloatingCTAProps {
  onClick?: () => void;
}

export function FloatingCTA({ onClick }: FloatingCTAProps) {
  const router = useRouter();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      router.push("/trade-in");
    }
  };

  return (
    <motion.button
      onClick={handleClick}
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: 0.5, type: "spring", stiffness: 100 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className="fixed right-4 bottom-24 z-50 bg-mega-blue text-white px-4 sm:px-6 py-3 sm:py-4 rounded-full shadow-2xl flex items-center gap-2 sm:gap-3 font-oswald text-sm sm:text-lg whitespace-nowrap"
    >
      <span>TRADE YOUR CAR</span>
      <DollarSign className="w-4 h-4 sm:w-5 sm:h-5" />
    </motion.button>
  );
}