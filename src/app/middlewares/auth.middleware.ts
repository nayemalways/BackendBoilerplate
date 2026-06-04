import { NextFunction, Request, Response } from 'express';
import { verifyToken } from '../utils/jwt';
import { JwtPayload } from 'jsonwebtoken';
import AppError from '../errorHelpers/AppError';
import httpStatus from 'http-status-codes';
import env from '../config/env';

export const checkAuth =
  (...restRole: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const bearerToken = req.headers.authorization?.startsWith('Bearer ')
        ? req.headers.authorization.split(' ')[1]
        : req.headers.authorization;
      const accessToken = bearerToken || req.cookies?.accessToken;

      if (!accessToken) {
        throw new AppError(httpStatus.UNAUTHORIZED, 'Not Authorized');
      }

      const verifyUser = verifyToken(accessToken, env.JWT_ACCESS_SECRET) as JwtPayload;

      /*
      ----------------------------------------------------------------
      // More checking will be execute here based on application need
      ----------------------------------------------------------------
      */

       
      // CHECK Verified
      if (!verifyUser) {
        throw new AppError(httpStatus.UNAUTHORIZED, 'Not Authorized')
      }

      if (restRole.length && !restRole.includes(verifyUser.role)) {
        throw new AppError( httpStatus.FORBIDDEN, 'You are not permitted to access this route')
      }

      req.user = verifyUser; // Set an global type for this line see on: interface > index.d.ts
      next();
    } catch (error) {
      next(error);
    }
  };
