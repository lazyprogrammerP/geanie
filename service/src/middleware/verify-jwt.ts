import { NextFunction, Request, Response } from "express";
import jsonwebtoken from "jsonwebtoken";
import { JWTPayload } from "../interfaces/auth.interfaces";
import prisma from "../prisma";

export default async function verifyJWT(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  const token = authHeader ? authHeader?.split(" ")[1] : null;

  if (!token) {
    return res.status(401).json({ status: "error", message: "Unauthorized.", data: null });
  }

  if (!process.env.JWT_SECRET) {
    console.error(`The JWT_SECRET environment variable is not set.`);
    return res.status(500).json({ status: "error", message: "Internal server error.", data: null });
  }

  try {
    const decoded = jsonwebtoken.verify(token, process.env.JWT_SECRET) as JWTPayload;
    if (!decoded.userId) {
      return res.status(401).json({ status: "error", message: "Unauthorized.", data: null });
    }

    const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
    if (!user) {
      return res.status(401).json({ status: "error", message: "Unauthorized.", data: null });
    }

    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(401).json({ status: "error", message: "Unauthorized.", data: null });
  }
}
