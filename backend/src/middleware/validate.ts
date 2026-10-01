import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';

export const validate = (req: Request, _res: Response, next: NextFunction): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    req.res!.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(e => e.msg),
    });
    return;
  }
  next();
};
