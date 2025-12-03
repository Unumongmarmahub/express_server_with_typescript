import jwt, { JwtPayload } from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import config from "../config";

const auth = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization;
      if (!token) {
        return res.status(500).json({ message: "You are not allowed." });
      }
      const decode = jwt.verify(
        token,
        config.jwtSecret as string
      ) as JwtPayload;

      console.log(decode);
      req.user = decode;

      if (roles.length && !roles.includes(decode.role as string)) {
        return res.status(500).json({
          error: "Unauthorized",
        });
      }
      next();
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };
};

export default auth;
