import { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler";
import config from "../config/config";

// Health check response
const healthCheck = asyncHandler((req: Request, res: Response) => {
  return res.status(200).json({
    success: true,
    message: "Health ok",
    enviroment: config.ENV
  });
});

export default healthCheck;
