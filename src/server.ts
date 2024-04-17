import dotenv from "dotenv";
import { dataBaseSource } from "./data-source";
import BirthApp from "./app";

dotenv.config();
dataBaseSource
  .getDataSource()
  .initialize()
  .then(() => {
    // start express server
    new BirthApp().initExpress().startExpress();
  })
  .catch((error) => console.log(error));
