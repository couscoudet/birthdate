import { validate } from "class-validator";
import BirthDaySchema from "../entity/BirthDaySchema.dto";
import { BirthDayService } from "../service/BirthDayService";
import { Request, Response } from "express";
import BirthDay from "../entity/BirthDay";
import { request } from "http";
import { RequestWithUser } from "../interface/RequestWithUser";

export class BirthDayController {
  private birthDayService: BirthDayService;

  constructor() {
    this.birthDayService = new BirthDayService();
  }

  async store(req: RequestWithUser, res: Response): Promise<BirthDay> {
    try {
      let birthday = new BirthDaySchema();
      birthday.hydrate(req.body.birthday);
      const errors = await validate(birthday);
      if (errors.length > 0) {
        res.status(400).send("validation failed : " + errors);
      } else {
        return await this.birthDayService.store(birthday, req.user.id);
      }
    } catch (e) {
      res.status(500).json({ error: e, message: "birthday not created" });
    }
  }

  async getByMonth(
    req: RequestWithUser,
    res: Response
  ): Promise<{ birthdays: BirthDay[] }> {
    try {
      if (
        Number.isInteger(+req.params.month) &&
        +req.params.month > 0 &&
        +req.params.month < 13
      ) {
        return {
          birthdays: await this.birthDayService.getByMonth(
            +req.params.month,
            req.user.id
          ),
        };
      } else {
        res.status(400).send("month must be a number between 1 and 12");
      }
    } catch (e) {
      res.status(500).json({ error: e, message: "cannot get birthdays" });
    }
  }

  async searchByNameQuery(req: Request, res: Response): Promise<BirthDay[]> {
    try {
      if (req.params.query.length > 2 && req.params.query.length < 21) {
        return await this.birthDayService.searchByNameQuery(req.params.query);
      } else {
        res.status(400).send("query must have a length between 3 and 20");
      }
    } catch (e) {
      res.status(500).json({ error: e, message: "cannot get birthdays" });
    }
  }

  async delete(req: Request, res: Response): Promise<{ message: string }> {
    try {
      if (Number.isInteger(+req.params.id)) {
        if (await this.birthDayService.getById(+req.params.id)) {
          return await this.birthDayService.delete(+req.params.id);
        } else {
          res.status(400).send("the birthday id must exist");
        }
      } else {
        res.status(400).send("the birthday id must be a number");
      }
    } catch (e) {
      res.status(500).json({ error: e, message: "birthday not deleted" });
    }
  }
}
