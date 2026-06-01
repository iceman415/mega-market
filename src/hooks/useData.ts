"use client";

import { useState, useEffect } from "react";
import { Vehicle, Part } from "@/types";

export function useData() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [parts, setParts] = useState<Part[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [vehiclesRes, partsRes] = await Promise.all([
          fetch("/api/vehicles"),
          fetch("/api/parts"),
        ]);
        const vehiclesData = await vehiclesRes.json();
        const partsData = await partsRes.json();
        setVehicles(vehiclesData);
        setParts(partsData);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return { vehicles, parts, loading };
}