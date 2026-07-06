import { VehicleSkeleton } from "./VehicleSkeleton";
import { PartSkeleton } from "./PartSkeleton";

interface InventorySkeletonProps {
  activeSection: "inventory" | "parts";
}

export function InventorySkeleton({ activeSection }: InventorySkeletonProps) {
  const skeletons = [1, 2, 3, 4, 5, 6];

  return (
    <div className="py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {skeletons.map((i) =>
        activeSection === "inventory" ? (
          <VehicleSkeleton key={i} />
        ) : (
          <PartSkeleton key={i} />
        )
      )}
    </div>
  );
}
