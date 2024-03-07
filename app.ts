import express, { Request, Response, NextFunction } from "express";
import { Routes } from "./src/route";
import * as bodyParser from "body-parser";
var cors = require("cors");

export default class BirthApp {
  app: express.Application;

  initExpress(): this {
    this.app = express();
    this._preHandlerMiddleware();
    this.app.use(cors({ origin: "*" }));

    Routes.forEach((route) => {
      this.app[route.method](
        route.url,
        (req: Request, res: Response, next: NextFunction) => {
          const result = new (route.controller as any)()[route.action](
            req,
            res,
            next
          );
          if (result instanceof Promise) {
            result.then((result) =>
              result !== null && result !== undefined
                ? res.send(result)
                : undefined
            );
          } else if (result !== null && result !== undefined) {
            res.json(result);
          }
        }
      );
    });

    return this;
  }
  startExpress() {
    this.app.listen(process.env.PORT, () => {
      console.log(
        `Express server has started on http://localhost:${process.env.PORT} on this DB : ${process.env.DB_NAME}.`
      );
    });
    return this.app;
  }

  _preHandlerMiddleware() {
    this.app.use(bodyParser.json());
  }
}
