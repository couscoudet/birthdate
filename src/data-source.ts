import { DataSource, EntityTarget, TreeRepository } from "typeorm";
import dotenv from "dotenv";
dotenv.config();

export class dataBaseSource {
  static AppDataSourceProd = new DataSource({
    type: "mariadb",
    host: process.env.DB_HOST,
    port: +process.env.DB_PORT,
    username: process.env.DB_USER,
    password: process.env.DB_PWD,
    database: process.env.DB_NAME_PROD,
    synchronize: true,
    logging: true,
    entities: [`${__dirname}/entity/*.js`],
    migrations: [`${__dirname}/migrations/*.js`],
    subscribers: [],
  });

  static AppDataSourceDev = new DataSource({
    type: "mariadb",
    host: process.env.DB_HOST,
    port: +process.env.DB_PORT,
    username: process.env.DB_USER,
    password: process.env.DB_PWD,
    database: process.env.DB_NAME_DEV,
    synchronize: true,
    logging: true,
    entities: [`${__dirname}/entity/*{.ts, .js}`],
    migrations: [],
    subscribers: [],
  });

  static getDataSource(): DataSource {
    switch (process.env.NODE_ENV) {
      case "prod":
        console.log("********* PRODUCTION ****************");
        console.log(dataBaseSource.AppDataSourceProd.options.entities);
        return dataBaseSource.AppDataSourceProd;
      case "dev":
        console.log("********* DEVELOPMENT ****************");
        return dataBaseSource.AppDataSourceDev;
      default:
        return dataBaseSource.AppDataSourceDev;
    }
  }

  static getRepository<T>(entity: EntityTarget<T>): TreeRepository<T> {
    return dataBaseSource.getDataSource().getTreeRepository(entity);
  }
}
