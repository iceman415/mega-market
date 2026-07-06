"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import type { Vehicle, Part } from "@/types";
import VehicleCard from "./VehicleCard";
import PartCard from "./PartCard";

interface InventoryGridProps {
  vehicles: Vehicle[];
  parts: Part[];
  activeSection: "inventory" | "parts";
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 24 },
  },
} as const;

export default function InventoryGrid({
  vehicles,
  parts,
  activeSection,
}: InventoryGridProps) {
  const router = useRouter();
  const isInventory = activeSection === "inventory";

  if (isInventory && vehicles.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center font-inter">
        <p className="text-lg font-semibold text-gray-900">No vehicles available</p>
        <p className="mt-1 text-sm text-gray-500">
          Check back soon for new inventory.
        </p>
      </div>
    );
  }

  if (!isInventory && parts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center font-inter">
        <p className="text-lg font-semibold text-gray-900">No parts available</p>
        <p className="mt-1 text-sm text-gray-500">
          Check back soon for new parts.
        </p>
      </div>
    );
  }

  return (
    <motion.div
      key={activeSection}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
    >
      {isInventory &&
        vehicles.map((vehicle) => (
          <motion.div key={vehicle.id} variants={itemVariants}>
            <VehicleCard
              vehicle={vehicle}
              onClick={() => router.push(`/vehicle/${vehicle.id}`)}
            />
          </motion.div>
        ))}

      {!isInventory &&
        parts.map((part) => (
          <motion.div key={part.id} variants={itemVariants}>
            <PartCard
              part={part}
              onClick={() => router.push(`/part/${part.id}`)}
            />
          </motion.div>
        ))}
    </motion.div>
  );
}
