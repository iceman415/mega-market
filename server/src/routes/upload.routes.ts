import { Router, Request, Response } from "express";
import { upload } from "@/middlewares/upload.middleware";
import { authMiddleware } from "@/middlewares/auth.middleware";
import { uploadToCloudinary, deleteFromCloudinary } from "@/utils/cloudinary";

const router = Router();

router.post("/", authMiddleware, upload.array("images", 10), async (req, res) => {
  try {
    const files = req.files as Express.Multer.File[] | undefined;
    if (!files || files.length === 0) {
      res.status(400).json({ error: "No files uploaded" });
      return;
    }

    const urls = await Promise.all(
      files.map((f) => uploadToCloudinary(f.buffer))
    );

    res.json({ urls });
  } catch (error) {
    console.error("Upload failed:", error);
    res.status(500).json({ error: "Upload failed" });
  }
});

router.post("/delete", authMiddleware, async (req: Request, res: Response) => {
  try {
    const { url } = req.body;
    if (!url) {
      res.status(400).json({ error: "URL is required" });
      return;
    }

    await deleteFromCloudinary(url);
    res.json({ success: true });
  } catch (error) {
    console.error("Delete failed:", error);
    res.status(500).json({ error: "Failed to delete image" });
  }
});

export default router;
