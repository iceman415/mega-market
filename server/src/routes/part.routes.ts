import { Router } from "express";
import { partController } from "@/controllers/part.controller";
import { authMiddleware } from "@/middlewares/auth.middleware";

const router = Router();

router.get("/", partController.getAll);
router.get("/:id", partController.getById);
router.post("/", authMiddleware, partController.create);
router.put("/:id", authMiddleware, partController.update);
router.delete("/:id", authMiddleware, partController.remove);

export default router;
