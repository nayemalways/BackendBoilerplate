import { OAuth2Client } from "google-auth-library";
import env from "../../config/env";
import { createUserTokens } from "../../utils/user.tokens";
import { Role } from "../user/user.interface";
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

  const auth = [
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

export const authService = {
    googleAuthSystem,
}