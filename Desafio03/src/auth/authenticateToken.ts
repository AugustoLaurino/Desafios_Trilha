import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "";

interface AuthenticatedRequest extends Request {
  userId?: string;
}

const authenticateToken = (
  req: AuthenticatedRequest,
  res: any,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Token não fornecido" });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err || typeof decoded === "string") {
      return res.status(403).json({ error: "Token inválido" });
    }

    req.userId = (decoded as JwtPayload).sub as string;
    next();
  });
};

export default authenticateToken;
