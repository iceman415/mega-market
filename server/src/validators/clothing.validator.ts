import { z } from "zod";

export const createClothingSchema = z.object({
  name: z.string().min(1, "Name is required"),
  price: z.string().min(1, "Price is required"),
  description: z.string().min(1, "Description is required"),
  location: z.string().min(1, "Location is required"),
  size: z.string().nullable().optional(),
  color: z.string().nullable().optional(),
  sold: z.boolean().optional().default(false),
  images: z.array(z.string()).optional().default([]),
  youtubeUrl: z.string().url().nullable().optional(),
});

export const updateClothingSchema = createClothingSchema.partial();
