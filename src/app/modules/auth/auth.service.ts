import { OAuth2Client } from "google-auth-library";
import { JwtPayload } from "jsonwebtoken";
import env from "../../config/env";
import AppError from "../../errorHelpers/AppError";
import { verifyToken } from "../../utils/jwt";
import { createUserTokens } from "../../utils/user.tokens";
import { IAuthProvider, Role } from "../user/user.interface";
import User from "../user/user.model";

const googleClient = new OAuth2Client();

const googleAuthSystem = async (payload: { id_token: string }) => {
  const { id_token } = payload;

  if (!id_token) {
    throw new Error('Google idToken is required');
  }

  const ticket = await googleClient.verifyIdToken({
    idToken: id_token,
    audience: env.GOOGLE_WEB_CLIENT_ID,
  });

  const googlePayload = ticket.getPayload();

  if (!googlePayload) {
    throw new Error('Invalid Google token');
  }

  const {
    sub,
    email,
    email_verified,
    name,
  } = googlePayload;

  if (!email || !email_verified) {
    throw new Error('Google email is not verified');
  }

  // Important:
  // Use `sub` as googleId. Do not use email as the permanent Google identifier.
  // Find or create user by googleId/sub.
  let user = await User.findOne({ email });

  const auth: IAuthProvider[] = [
        {
          provider: 'google',
          providerId: sub,
        },
      ];

  if (!user) {
    user = await User.create({
      email,
    name,
      auths: auth,
      role: Role.USER,
      isVerified: true,
    });
  }

  // Generate your own JWT tokens
  const tokens = await createUserTokens(user);


  return {
    user,
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
  };
};

const refreshToken = async (token: string) => {
  if (!token) {
    throw new AppError(401, 'Refresh token is required');
  }

  let verifiedToken: JwtPayload;

  try {
    verifiedToken = verifyToken(token, env.JWT_REFRESH_SECRET) as JwtPayload;
  } catch {
    throw new AppError(401, 'Invalid refresh token');
  }

  const user = await User.findById(verifiedToken.userId);

  if (!user) {
    throw new AppError(401, 'User not found');
  }

  return createUserTokens(user as unknown as JwtPayload);
};

export const authService = {
    googleAuthSystem,
    refreshToken,
}
