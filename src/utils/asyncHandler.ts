import { NextFunction, Request, Response, RequestHandler } from "express";

// This is to wrap controller for catching any errors and pass it to next function
const asyncHandler = (requestHandler: RequestHandler) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(requestHandler(req, res, next)).catch(next);
  };
};

export default asyncHandler;
