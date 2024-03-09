import UserController from "./UserController";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import RefreshTokenService from "../service/RefreshTokenService";
dotenv.config();

export default class AuthController {
  private userController = new UserController();
  private refreshTokenService = new RefreshTokenService();

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
        if (result === true) {
          const token = jwt.sign(
            { user: { id: user.id, email: user.email } },
            process.env.JWT_PRIVATE_KEY,
            { expiresIn: "15m" }
          );
          const refreshToken = jwt.sign(
            { user: { id: user.id, email: user.email } },
            process.env.JWT_PRIVATE_REFRESH_KEY,
            { expiresIn: "7d" }
          );
          const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
          await this.refreshTokenService.storeOrUpdate({
            refreshToken: hashedRefreshToken,
            user: user,
          });
          return { user: user.email, token: token, refreshToken: refreshToken };
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
}
