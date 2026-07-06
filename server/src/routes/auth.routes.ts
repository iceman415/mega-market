import { Router } from "express";
import { authController } from "@/controllers/auth.controller";
import { authMiddleware } from "@/middlewares/auth.middleware";

const router = Router();

router.post("/login", authController.login);
router.post("/register", authController.registerAdmin);
router.get("/verify", authMiddleware, authController.verify);
router.put("/password", authMiddleware, authController.changePassword);
router.post("/logout", authController.logout);

export default router;
