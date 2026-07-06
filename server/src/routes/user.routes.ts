import { Router } from "express";

const router = Router();

router.get("/", (_req, res) => {
  res.json({ message: "Get all users" });
});

router.get("/:id", (req, res) => {
  res.json({ message: `Get user ${req.params.id}` });
});

router.post("/", (req, res) => {
  res.status(201).json({ message: "Create user", data: req.body });
});

export default router;
