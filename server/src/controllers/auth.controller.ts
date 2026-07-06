import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { AppDataSource } from "@/database/data-source";
import { User } from "@/entities/User";
import { JWT_SECRET } from "@/config/env";
import { loginSchema, createAdminSchema, changePasswordSchema } from "@/validators";

export const authController = {
  async login(req: Request, res: Response) {
    const { email, password } = loginSchema.parse(req.body);

    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({
      where: { email },
      select: { id: true, name: true, email: true, password: true, role: true },
    });

    if (!user) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax" as const,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    };
    res.cookie("token", token, cookieOptions);

    res.json({
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  },

  async verify(req: Request, res: Response) {
    const tokenUser = (req as any).user;
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({
      where: { id: tokenUser.id },
      select: { id: true, name: true, email: true, role: true },
    });

    if (!user) {
      res.status(401).json({ error: "User not found" });
      return;
    }

    res.json({ valid: true, user });
  },

  async registerAdmin(req: Request, res: Response) {
    const { name, email, password } = createAdminSchema.parse(req.body);

    const userRepository = AppDataSource.getRepository(User);
    const existing = await userRepository.findOneBy({ email });
    if (existing) {
      res.status(409).json({ error: "Email already in use" });
      return;
    }

    const hashed = await bcrypt.hash(password, 12);
    const user = userRepository.create({
      name,
      email,
      password: hashed,
      role: "admin",
    });
    await userRepository.save(user);

    res.status(201).json({ message: "Admin created" });
  },

  async changePassword(req: Request, res: Response) {
    const tokenUser = (req as any).user;
    const { currentPassword, newPassword } = changePasswordSchema.parse(req.body);

    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({
      where: { id: tokenUser.id },
      select: { id: true, password: true },
    });

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      res.status(401).json({ error: "Current password is incorrect" });
      return;
    }

    const hashed = await bcrypt.hash(newPassword, 12);
    await userRepository.update(user.id, { password: hashed });

    res.json({ message: "Password updated successfully" });
  },

  async logout(req: Request, res: Response) {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });
    res.json({ message: "Logged out" });
  },
};
