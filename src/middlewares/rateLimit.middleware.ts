import { NextFunction, Request, Response } from "express";
import rateLimit from "express-rate-limit";

export const rateLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 5,
});

export default rateLimiter;
