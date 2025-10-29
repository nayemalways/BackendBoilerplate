/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from 'express';
import AppError from '../errorHelpers/AppError';
import { handleDuplicateError } from '../helper/duplicate.error';
import { zodErrorHandler } from '../helper/zod.error';
import { handleCastError } from '../helper/cast.error';
import { validationError } from '../helper/validation.error';
import { TErrorSources } from '../interface/error.types';
import env from '../config/env';

// Error Handler
export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = 500;
  let message = `Something went wrong ${err.message}`;
  let errorSources: TErrorSources[] = [];

  // Duplicate error
  if (err.code === 11000) {
    const simplifiedError = handleDuplicateError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
  }
  // Zod Error
  else if (err.name === 'ZodError') {
    const simplifiedError = zodErrorHandler(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorSources = simplifiedError.errorSources as TErrorSources[];
  }
  // Cast Error
  else if (err.name === 'CastError') {
    const simplifiedError = handleCastError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
  }
  // Validation Error
  else if (err.name === 'ValidationError') {
    const simplifiedError = validationError(err);
    statusCode = simplifiedError.statusCode;
    errorSources = simplifiedError.errorSources as TErrorSources[];
    message = simplifiedError.message;
  } else if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  } else if (err instanceof Error) {
    statusCode = 500;
    message = err.message;
  }

  res.status(statusCode).json({
    success: false,
    message,
    errorSources,
    err: env.NODE_ENV === 'development' ? err : null,
    stack: env.NODE_ENV === 'development' ? err.stack : null,
  });
};
