import { DataSource } from "typeorm";
import dotenv from "dotenv";
dotenv.config();

export const AppDataSource = new DataSource({
  type: "mariadb",
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT,
  username: process.env.DB_USER,
  password: process.env.DB_PWD,
  database: process.env.DB_NAME,
  synchronize: true,
  logging: true,
  entities: ["./src/entity/*{.ts, .js}"],
  migrations: [],
  subscribers: [],
});
