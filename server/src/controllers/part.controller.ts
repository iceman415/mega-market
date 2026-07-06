import { Request, Response } from "express";
import { partService } from "@/services/part.service";
import { createPartSchema, updatePartSchema } from "@/validators";

export const partController = {
  async getAll(_req: Request, res: Response) {
    const parts = await partService.findAll();
    res.json(parts);
  },

  async getById(req: Request, res: Response) {
    const id = req.params.id as string;
    const part = await partService.findById(id);
    if (!part) {
      res.status(404).json({ error: "Part not found" });
      return;
    }
    res.json(part);
  },

  async create(req: Request, res: Response) {
    const parsed = createPartSchema.parse(req.body);
    const part = await partService.create(parsed);
    res.status(201).json(part);
  },

  async update(req: Request, res: Response) {
    const id = req.params.id as string;
    const parsed = updatePartSchema.parse(req.body);
    const part = await partService.update(id, parsed);
    if (!part) {
      res.status(404).json({ error: "Part not found" });
      return;
    }
    res.json(part);
  },

  async remove(req: Request, res: Response) {
    const id = req.params.id as string;
    const deleted = await partService.delete(id);
    if (!deleted) {
      res.status(404).json({ error: "Part not found" });
      return;
    }
    res.json({ message: "Part deleted" });
  },
};
