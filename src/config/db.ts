import "reflect-metadata";
import dotenv from "dotenv";
import { DataSource } from "typeorm";
import { ContentSecurity } from "../models/content-security.entity";

dotenv.config();

export const AppDataSource = new DataSource({
  type: "mysql",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [ContentSecurity],
  synchronize: true,//process.env.NODE_ENV !== "production",  // true only if not production
  logging: false,
});

