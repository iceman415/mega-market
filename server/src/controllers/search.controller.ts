import { Request, Response } from "express";
import { vehicleService } from "@/services/vehicle.service";
import { partService } from "@/services/part.service";

export const searchController = {
  async globalSearch(req: Request, res: Response) {
    const query = (req.query.q as string || "").trim();
    if (!query) {
      res.json({ vehicles: [], parts: [] });
      return;
    }

    const [vehicles, parts] = await Promise.all([
      vehicleService.search(query),
      partService.search(query),
    ]);

    res.json({ vehicles, parts });
  },
};
