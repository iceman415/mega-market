import { z } from "zod";

export const createPartSchema = z.object({
  name: z.string().min(1, "Name is required"),
  partNumber: z.string().min(1, "Part number is required"),
  compatibility: z.string().min(1, "Compatibility is required"),
  price: z.string().min(1, "Price is required"),
  description: z.string().min(1, "Description is required"),
  location: z.string().min(1, "Location is required"),
  sold: z.boolean().optional().default(false),
  images: z.array(z.string()).optional().default([]),
  youtubeUrl: z.string().url().nullable().optional(),
});

export const updatePartSchema = createPartSchema.partial();
