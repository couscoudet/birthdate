import express, { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import { AppDataSource } from "./data-source";
import BirthApp from "../app";

dotenv.config();

const app = express();

AppDataSource.initialize()
  .then(() => {
    // start express server
    new BirthApp().initExpress().startExpress();
  })
  .catch((error) => console.log(error));
