import "reflect-metadata";
import { AppDataSource } from "@/database/data-source";
import { User } from "@/entities/User";
import bcrypt from "bcryptjs";

async function seed() {
  await AppDataSource.initialize();
  console.log("Connected to DB");

  const repo = AppDataSource.getRepository(User);

  const existing = await repo.findOneBy({ email: "admin@megamarket.com" });
  if (existing) {
    console.log("Admin already exists, skipping seed.");
    await AppDataSource.destroy();
    return;
  }

  const password = await bcrypt.hash("admin123", 12);

  const admin = repo.create({
    name: "Admin",
    email: "admin@megamarket.com",
    password,
    role: "admin",
  });

  await repo.save(admin);
  console.log("Admin created:");
  console.log("  Email: admin@megamarket.com");
  console.log("  Password: admin123");
  console.log("  IMPORTANT: Change password after first login.");

  await AppDataSource.destroy();
}

seed().catch(console.error);
