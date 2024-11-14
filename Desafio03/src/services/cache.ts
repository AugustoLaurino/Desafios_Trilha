import { Request, Response, NextFunction } from "express";
import redisClient from "./redisClient";

export const cacheTasks = async (
  req: Request,
  res: any,
  next: NextFunction,
) => {
  const cacheKey = "tasks";

  try {
    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      console.log("Resposta retornada do cache");
      return res.json(JSON.parse(cachedData));
    }
    next();
  } catch (error) {
    console.error("Erro ao verificar cache:", error);
    next();
  }
};
