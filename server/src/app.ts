import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";
import { FRONTEND_URL } from "@/config/env";
import authRoutes from "@/routes/auth.routes";
import vehicleRoutes from "@/routes/vehicle.routes";
import partRoutes from "@/routes/part.routes";
import searchRoutes from "@/routes/search.routes";
import uploadRoutes from "@/routes/upload.routes";

const app = express();

app.use(morgan("dev"));
app.use(helmet());
app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
  })
);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/vehicles", vehicleRoutes);
app.use("/api/parts", partRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/upload", uploadRoutes);

export default app;
