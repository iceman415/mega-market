"use client";

import { cn } from "@/lib/utils";

interface SoldBadgeProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeMap = {
  sm: "px-2 py-0.5 text-xs",
  md: "px-3 py-1 text-sm",
  lg: "px-4 py-1.5 text-base",
};

export default function SoldBadge({ size = "md", className }: SoldBadgeProps) {
  return (
    <span
      className={cn(
        "inline-block rounded-md bg-red-600 font-bold text-white uppercase font-oswald",
        sizeMap[size],
        className,
      )}
    >
      SOLD
    </span>
  );
}
