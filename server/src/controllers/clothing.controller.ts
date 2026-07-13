import { Request, Response } from "express";
import { clothingService } from "@/services/clothing.service";
import { createClothingSchema, updateClothingSchema } from "@/validators";

export const clothingController = {
  async getAll(_req: Request, res: Response) {
    const clothing = await clothingService.findAll();
    res.json(clothing);
  },

  async getById(req: Request, res: Response) {
    const id = req.params.id as string;
    const clothing = await clothingService.findById(id);
    if (!clothing) {
      res.status(404).json({ error: "Clothing not found" });
      return;
    }
    res.json(clothing);
  },

  async create(req: Request, res: Response) {
    const parsed = createClothingSchema.parse(req.body);
    const clothing = await clothingService.create(parsed);
    res.status(201).json(clothing);
  },

  async update(req: Request, res: Response) {
    const id = req.params.id as string;
    const parsed = updateClothingSchema.parse(req.body);
    const clothing = await clothingService.update(id, parsed);
    if (!clothing) {
      res.status(404).json({ error: "Clothing not found" });
      return;
    }
    res.json(clothing);
  },

  async remove(req: Request, res: Response) {
    const id = req.params.id as string;
    const deleted = await clothingService.delete(id);
    if (!deleted) {
      res.status(404).json({ error: "Clothing not found" });
      return;
    }
    res.json({ message: "Clothing deleted" });
  },
};
