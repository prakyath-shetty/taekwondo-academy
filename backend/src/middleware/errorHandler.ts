import { Request, Response, NextFunction } from 'express';

export const notFound = (req: Request, res: Response, _next: NextFunction): void => {
  res.status(404).json({
    success: false,
    message: `Not Found - ${req.originalUrl}`,
  });
};

export const errorHandler = (
  err: any,
  _req: Request,
  res: Response
): void => {
  const statusCode = err.statusCode || 500;

  // Never leak internal error details to the client
  const publicMessage = statusCode === 500
    ? 'An unexpected error occurred. Please try again later.'
    : err.message || 'Server Error';

  // Log the full error server-side for debugging
  console.error(`[Error ${statusCode}]`, err.message, err.stack?.split('\n').slice(1, 3).join(' '));

  res.status(statusCode).json({
    success: false,
    message: publicMessage,
    ...(process.env.NODE_ENV === 'development' && statusCode === 500 ? { debug: err.message } : {}),
  });
};
