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
        return;
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
        e.statusCode = 409;
        e.message = "This email already exist";
        throw e;
      } else {
        e.message = "can't create user";
        throw e;
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

  async deleteUser(req: Request, res: Response) {
    try {
      return await this.userService.deleteUser(req.params.id);
    } catch (e) {
      res.status(500).json({ error: e.message, message: "can't delete User" });
    }
  }
}
