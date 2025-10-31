import { Request, Response } from 'express';
import { CatchAsync } from '../../utils/CatchAsync';
import { SendResponse } from '../../utils/SendResponse';
import { userServices } from './user.service';
import { generateToken, verifyToken } from '../../utils/jwt';
import env from '../../config/env';
import { JwtPayload } from 'jsonwebtoken';

const createUser = CatchAsync(async (req: Request, res: Response) => {
  const result = await userServices.createUserService(req.body);

  res.cookie('email', result.email, {
    httpOnly: true,
    secure: false,
  });

  SendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Users fetched successfully!',
    data: result,
  });
});

const verifyUser = CatchAsync(async (req: Request, res: Response) => {
  const email = req.cookies['email'] as string;
  const otp = req.params.otp;
  const verifyEmailToken = verifyToken(email, env.JWT_SECRET) as JwtPayload;

  const result = await userServices.verifyUserService(
    verifyEmailToken.email,
    otp
  );

  const jwtPayload = {
    email: result?.email,
    _id: result?._id,
    role: result?.role,
    isVerified: result?.isVerified,
  };

  const authToken = generateToken(
    jwtPayload,
    env.JWT_SECRET,
    env.JWT_EXPIRATION
  );

  SendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'User verified successfuly!',
    data: {
      token: authToken,
      data: result,
    },
  });
});

const resendOTP = CatchAsync(async (req: Request, res: Response) => {
  const email = req.cookies['email'] as string;
  await userServices.resendOTPService(email);

  SendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'OTP Sent Successfully!',
    data: null,
  });
});

export const userControllers = {
  createUser,
  verifyUser,
  resendOTP,
};
