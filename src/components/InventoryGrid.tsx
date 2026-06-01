"use client";

import { motion } from "framer-motion";
import { VehicleCard } from "./VehicleCard";
import { PartCard } from "./PartCard";
import { Vehicle, Part } from "@/types";
import { useRouter } from "next/navigation";

interface InventoryGridProps {
  vehicles: Vehicle[];
  parts: Part[];
  activeSection: "inventory" | "parts";
}

export function InventoryGrid({ vehicles, parts, activeSection }: InventoryGridProps) {
  const router = useRouter();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  if (activeSection === "inventory") {
    if (vehicles.length === 0) {
      return (
        <div className="py-16 text-center">
          <p className="font-oswald text-xl text-gray-500">
            No vehicles available at the moment
          </p>
        </div>
      );
    }

    return (
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {vehicles.map((vehicle) => (
          <motion.div key={vehicle.id} variants={itemVariants}>
            <VehicleCard
              vehicle={vehicle}
              onClick={() => router.push(`/vehicle/${vehicle.id}`)}
            />
          </motion.div>
        ))}
      </motion.div>
    );
  }

  if (parts.length === 0) {
    return (
      <div className="py-16 text-center">
        <p className="font-oswald text-xl text-gray-500">
          No parts available at the moment
        </p>
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      {parts.map((part) => (
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