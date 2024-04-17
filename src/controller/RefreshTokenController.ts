import RefreshTokenService from "../service/RefreshTokenService";
import { Request, Response } from "express";
import CustomError from "../util/CustomError";
import jwt from "jsonwebtoken";
import UserService from "../service/UserService";
import bcrypt from "bcrypt";

export default class RefreshTokenController {
  private refreshTokenService = new RefreshTokenService();
  private userService = new UserService();

  private extractTokenFromHeader(req: Request, res: Response) {
    const headersAuth = req.get("authorization");
    if (headersAuth && headersAuth.includes("Bearer ")) {
      return headersAuth.split("Bearer ")[1];
    } else {
      throw new CustomError("unauthorized", 403);
    }
  }

  async updateAccessToken(req: Request, res: Response) {
    try {
      const refreshToken = this.extractTokenFromHeader(req, res);

      const payload = jwt.verify(
        refreshToken,
        process.env.JWT_PRIVATE_REFRESH_KEY
      );

      const user = payload.user;

      const hashedRefreshTokenInDb =
        await this.refreshTokenService.getRefreshTokenFromUser(user.id);

      const result = await bcrypt.compare(refreshToken, hashedRefreshTokenInDb);

      if (result === true) {
        const newToken = jwt.sign(
          { user: { id: user.id, email: user.email } },
          process.env.JWT_PRIVATE_KEY,
          { expiresIn: "10m" }
        );
        const newRefreshToken = jwt.sign(
          { user: { id: user.id, email: user.email } },
          process.env.JWT_PRIVATE_REFRESH_KEY,
          { expiresIn: "15d" }
        );
        const newHashedRefreshToken = await bcrypt.hash(refreshToken, 10);
        await this.refreshTokenService.storeOrUpdate({
          refreshToken: newHashedRefreshToken,
          user: user,
        });
        return {
          user: user.email,
          token: newToken,
          refreshToken: newRefreshToken,
        };
      }
    } catch (e) {
      res.status(e.statusCode ? e.statusCode : 500).send(e.message);
    }
  }
}
