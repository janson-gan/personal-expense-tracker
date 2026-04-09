import { Request, Response, NextFunction } from "express";

// Handle unknown route error
const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({
    success: false,
    message: "Not Found",
  });

  return;
};

export default notFoundHandler;
