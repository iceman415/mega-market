import { Router } from "express";
import { clothingController } from "@/controllers/clothing.controller";
import { authMiddleware } from "@/middlewares/auth.middleware";

const router = Router();

router.get("/", clothingController.getAll);
router.get("/:id", clothingController.getById);
router.post("/", authMiddleware, clothingController.create);
router.put("/:id", authMiddleware, clothingController.update);
router.delete("/:id", authMiddleware, clothingController.remove);

export default router;
