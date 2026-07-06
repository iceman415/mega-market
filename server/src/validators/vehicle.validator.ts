import { z } from "zod";

export const createVehicleSchema = z.object({
  brand: z.string().min(1, "Brand is required"),
  model: z.string().min(1, "Model is required"),
  year: z.string().min(1, "Year is required"),
  price: z.string().min(1, "Price is required"),
  mileage: z.string().min(1, "Mileage is required"),
  description: z.string().min(1, "Description is required"),
  location: z.string().min(1, "Location is required"),
  sold: z.boolean().optional().default(false),
  images: z.array(z.string()).optional().default([]),
  youtubeUrl: z.string().url().nullable().optional(),
});

export const updateVehicleSchema = createVehicleSchema.partial();
