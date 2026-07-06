import { Request, Response } from "express";
import { vehicleService } from "@/services/vehicle.service";
import { createVehicleSchema, updateVehicleSchema } from "@/validators";

export const vehicleController = {
  async getAll(_req: Request, res: Response) {
    const vehicles = await vehicleService.findAll();
    res.json(vehicles);
  },

  async getById(req: Request, res: Response) {
    const id = req.params.id as string;
    const vehicle = await vehicleService.findById(id);
    if (!vehicle) {
      res.status(404).json({ error: "Vehicle not found" });
      return;
    }
    res.json(vehicle);
  },

  async create(req: Request, res: Response) {
    const parsed = createVehicleSchema.parse(req.body);
    const vehicle = await vehicleService.create(parsed);
    res.status(201).json(vehicle);
  },

  async update(req: Request, res: Response) {
    const id = req.params.id as string;
    const parsed = updateVehicleSchema.parse(req.body);
    const vehicle = await vehicleService.update(id, parsed);
    if (!vehicle) {
      res.status(404).json({ error: "Vehicle not found" });
      return;
    }
    res.json(vehicle);
  },

  async remove(req: Request, res: Response) {
    const id = req.params.id as string;
    const deleted = await vehicleService.delete(id);
    if (!deleted) {
      res.status(404).json({ error: "Vehicle not found" });
      return;
    }
    res.json({ message: "Vehicle deleted" });
  },
};
