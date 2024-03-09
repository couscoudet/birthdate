import { validate } from "class-validator";
import { UserSchema } from "../entity/UserSchema.dto";
import UserService from "../service/UserService";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import User from "../entity/User";

export default class UserController {
  private userService = new UserService();

  private saltRounds = 10;

  async store(req: Request, res: Response): Promise<User> {
    try {
      let user = new UserSchema();
      user.hydrate(req.body.user);
      const errors = await validate(user);
      if (errors.length > 0) {
        res.status(400).send("user validation failed : " + errors);
      } else {
        const email = req.body.user.email;
        const password = await bcrypt.hash(
          req.body.user.password,
          this.saltRounds
        );
        const createdUser = await this.userService.store({ email, password });
        delete createdUser.password;
        return createdUser;
      }
    } catch (e) {
      if (e.message.includes("Duplicate entry")) {
        res.status(409).json({ message: "This email already exist" });
      } else {
        res
          .status(500)
          .json({ error: e.message, message: "can't create user" });
      }
    }
  }

  async getUser(email: string): Promise<User> {
    try {
      return await this.userService.getUser(email);
    } catch (e) {
      throw new Error(e.message);
    }
  }
}
