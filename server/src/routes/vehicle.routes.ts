import { Router } from "express";
import { vehicleController } from "@/controllers/vehicle.controller";
import { authMiddleware } from "@/middlewares/auth.middleware";

const router = Router();

router.get("/", vehicleController.getAll);
router.get("/:id", vehicleController.getById);
router.post("/", authMiddleware, vehicleController.create);
router.put("/:id", authMiddleware, vehicleController.update);
router.delete("/:id", authMiddleware, vehicleController.remove);

export default router;
