"use client";

import { Phone } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function FloatingCTA() {
  const router = useRouter();

  return (
    <motion.button
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 20,
        delay: 1,
      }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => router.push("/contact")}
      className="fixed bottom-6 right-6 z-30 flex items-center gap-2 rounded-full bg-mega-blue px-5 py-3 font-bold text-white shadow-lg hover:bg-mega-blue-dark font-oswald tracking-wide"
    >
      <Phone className="h-5 w-5" />
      CONTACT
    </motion.button>
  );
}
