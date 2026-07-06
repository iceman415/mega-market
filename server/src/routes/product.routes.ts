import { Router } from "express";

const router = Router();

router.get("/", (_req, res) => {
  res.json({ message: "Get all products" });
});

router.get("/:id", (req, res) => {
  res.json({ message: `Get product ${req.params.id}` });
});

router.post("/", (req, res) => {
  res.status(201).json({ message: "Create product", data: req.body });
});

export default router;
