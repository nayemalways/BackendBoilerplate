import { Request, Response } from 'express';
import { CatchAsync } from '../../utils/CatchAsync';
import { SendResponse } from '../../utils/SendResponse';
import { userServices } from './user.service';
import { createUserTokens } from '../../utils/user.tokens';
import { SetCookies } from '../../utils/setCookie';
import env from '../../config/env';
import { JwtPayload } from 'jsonwebtoken';


const createUser = CatchAsync(async (req: Request, res: Response) => {
  const result = await userServices.createUserService(req.body);

  res.cookie('email', result.email, {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: env.NODE_ENV === 'production' ? 'none' : 'lax',
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


  const result = await userServices.verifyUserService(
    email,
    otp
  );

  const jwtPayload = {
    _id: result?._id,
    email: result?.email,
    role: result?.role,
    isVerified: result?.isVerified,
  };

  // Set refreshToken and accessToken in Cookies
  const userTokens = await createUserTokens(jwtPayload);
  SetCookies(res, userTokens);


  SendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'User verified successfully!',
    data: {
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

const getMe = CatchAsync(async (req: Request, res: Response) => {
  const authUser = req.user as JwtPayload;
  const result = await userServices.getMeService(authUser.userId);

  SendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Profile fetched successfully!',
    data: result,
  });
});

export const userControllers = {
  createUser,
  getMe,
  verifyUser,
  resendOTP,
};
