import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

const jwtMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const extractTokenFromHeader = () => {
    const headersAuth = req.get("authorization");
    if (headersAuth && headersAuth.includes("Bearer ")) {
      return headersAuth.split("Bearer ")[1];
    } else {
      res.status(403).send("unauthorized, you must be authentified");
    }
  };

  const token = extractTokenFromHeader();
  try {
    const payload = jwt.verify(token, process.env.JWT_PRIVATE_KEY);
    req["user"] = payload.user;
    next();
  } catch {
    res.status(403).send("unauthorized");
  }
};

export default jwtMiddleware;
