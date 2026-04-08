import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export type JwtUserPayload = {
  user_id: string;
  username: string;
  name: string;
  email: string;
  iat?: number;
  exp?: number;
};

export type AuthenticatedRequest = Request & {
  user?: JwtUserPayload;
};

export const authMiddleware = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;
  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    return res.status(500).json({
      code: 500,
      status: "error",
      message: "JWT_SECRET belum diset.",
    });
  }

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      code: 401,
      status: "error",
      message: "Unauthorized",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, jwtSecret) as JwtUserPayload;
    req.user = decoded;
    return next();
  } catch (error) {
    return res.status(401).json({
      code: 401,
      status: "error",
      message: "Invalid token",
    });
  }
};
