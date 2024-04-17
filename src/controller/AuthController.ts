import UserController from "./UserController";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import RefreshTokenService from "../service/RefreshTokenService";
import EmailUtil from "../util/EmailUtil";
import UserService from "../service/UserService";
dotenv.config();

export default class AuthController {
  private userController = new UserController();
  private userService = new UserService();

  private refreshTokenService = new RefreshTokenService();
  private emailUtil = new EmailUtil();

  async login(req: Request, res: Response) {
    try {
      const user = await this.userController.getUser(req.body.user.email);
      if (user) {
        console.log(user);
        console.log(req.body.user.password);
        const result = await bcrypt.compare(
          req.body.user.password,
          user.password
        );
        if (result === true && user.emailConfirmed) {
          const token = jwt.sign(
            { user: { id: user.id, email: user.email } },
            process.env.JWT_PRIVATE_KEY,
            { expiresIn: "10m" }
          );
          const refreshToken = jwt.sign(
            { user: { id: user.id, email: user.email } },
            process.env.JWT_PRIVATE_REFRESH_KEY,
            { expiresIn: "15d" }
          );
          const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
          await this.refreshTokenService.storeOrUpdate({
            refreshToken: hashedRefreshToken,
            user: user,
          });
          return { user: user.email, token: token, refreshToken: refreshToken };
        } else if (result === true && !user.emailConfirmed) {
          res.status(403).json({
            message:
              "Merci de confirmer votre email en cliquant sur le lien reçu",
          });
        } else {
          res.status(401).send("Authentication failed");
        }
      } else {
        res.status(401).send("Authentication failed");
      }
    } catch (e) {
      res.status(500).json({ error: e.message, message: "can't authenticate" });
    }
  }

  async signup(req: Request, res: Response) {
    try {
      const user = await this.userController.store(req, res);
      const confirmationToken = jwt.sign(
        { user: { id: user.id, email: user.email } },
        process.env.JWT_PRIVATE_KEY_CONFIRMATION,
        { expiresIn: "45m" }
      );
      const info = this.emailUtil.emailConfirm(user.email, confirmationToken);
      res.status(200).json({ message: "mail send", message_info: info });
    } catch (e) {
      res
        .status(e.statusCode ? e.statusCode : 500)
        .json({ error: e.message, message: "signup failed" });
    }
  }

  async confirmEmail(req: Request, res: Response) {
    try {
      const payload = jwt.verify(
        req.params.token,
        process.env.JWT_PRIVATE_KEY_CONFIRMATION
      );
      payload.user.emailConfirmed = true;
      console.log(payload.user);
      return this.userService.updateUser(payload.user.id, payload.user);
    } catch (e) {
      if (e.message === "jwt expired") {
        res
          .status(401)
          .json({ error: e.message, message: "email confirmation failed" });
      } else {
        res
          .status(500)
          .json({ error: e.message, message: "email confirmation failed" });
      }
    }
  }
}
