import { Request, Response, NextFunction } from 'express';
import { ZodType } from 'zod';
import logger from '../utils/logger';

// For validate register input
const validate = (schema: ZodType) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const errors = result.error.issues.map((err) => ({
        field: err.path.join('.'),
        err: err.message,
      }));

      logger.warn(`Validation failed: ${JSON.stringify(errors)}`);

      res.status(400).json({
        success: false,
        message: 'Validation failed.',
        errors,
      });
      return;
    }

    req.body = result.data;
    next();
  };
};

export default validate;
