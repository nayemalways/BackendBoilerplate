import { CookieOptions, Response } from 'express';
import env from '../config/env';

interface AuthTokenInfo {
  accessToken?: string;
  refreshToken?: string;
}

export const SetCookies = (res: Response, tokenInfo: AuthTokenInfo) => {
  const cookieOptions: CookieOptions = {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: env.NODE_ENV === 'production' ? 'none' : 'lax',
  };

  if (tokenInfo.accessToken) {
    res.cookie('accessToken', tokenInfo.accessToken, {
      ...cookieOptions,
    });
  }

  if (tokenInfo.refreshToken) {
    res.cookie('refreshToken', tokenInfo.refreshToken, {
      ...cookieOptions,
    });
  }
};

export const ClearAuthCookies = (res: Response) => {
  const cookieOptions: CookieOptions = {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: env.NODE_ENV === 'production' ? 'none' : 'lax',
  };

  res.clearCookie('accessToken', cookieOptions);
  res.clearCookie('refreshToken', cookieOptions);
};
