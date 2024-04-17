import express, { Request, Response, NextFunction } from "express";
import { Routes } from "./route";
import * as bodyParser from "body-parser";
import UserService from "./service/UserService";
import jwtMiddleware from "./middleware/jwtMiddleware";
var cors = require("cors");

export default class BirthApp {
  app: express.Application;

  initExpress(): this {
    this.app = express();
    this._preHandlerMiddleware();
    this.app.use(cors({ origin: "*" }));
    this.app.use("/api/*", jwtMiddleware);
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
            res.send(result);
          }
        }
      );
    });

    return this;
  }
  startExpress() {
    this.app.listen(process.env.PORT, () => {
      console.log(
        `Express server has started on http://localhost:${process.env.PORT} on this DB ENV : ${process.env.NODE_ENV}.`
      );
    });
    return this.app;
  }

  _preHandlerMiddleware() {
    this.app.use(bodyParser.json());
  }
}
