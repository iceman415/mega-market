import "reflect-metadata";
import { DataSource } from "typeorm";
import { DATABASE_URL, NODE_ENV } from "@/config/env";
import { User } from "@/entities/User";
import { Vehicle } from "@/entities/Vehicle";
import { Part } from "@/entities/Part";

const isDevelopment = NODE_ENV === "development";
const isProduction = NODE_ENV === "production";

export const AppDataSource = new DataSource({
  type: "postgres",
  url: DATABASE_URL,
  ssl: isDevelopment ? false : { rejectUnauthorized: false },
  synchronize: isDevelopment,
  logging: isDevelopment ? ["error", "warn"] : false,
  entities: [User, Vehicle, Part],
  migrations: isDevelopment
    ? [__dirname + "/migrations/*.ts"]
    : [__dirname + "/migrations/*.js"],
  migrationsRun: false,
  extra: {
    max: isProduction ? 10 : 20,
  },
});
