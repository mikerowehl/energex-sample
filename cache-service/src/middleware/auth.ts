import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export interface AuthRequest extends Request {
  user?: any;
}

export function authenticateJWT(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    console.error("Authorization header missing");
    return res.status(401).json({ error: "Authorization header missing" });
  }

  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    console.error("Authorization header malformed:", authHeader);
    return res.status(401).json({ error: "Authorization header must be in format 'Bearer <token>'" });
  }

  const token = parts[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string, { algorithms: ["HS256"] });
    req.user = decoded;
    next();
  } catch (err: any) {
    console.error("JWT verification failed:", err.message);
    return res.status(403).json({ error: "Invalid or expired token" });
  }
}

