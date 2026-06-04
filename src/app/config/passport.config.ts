/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
import bcrypt from 'bcrypt';
import passport from 'passport';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import {
  Profile,
  Strategy as GoogleStrategy,
  VerifyCallback,
} from 'passport-google-oauth20';
import { Strategy as LocalStrategy } from 'passport-local';
import env from './env';
import User from '../modules/user/user.model';
import { Role } from '../modules/user/user.interface';

passport.use(
  new LocalStrategy(
    { usernameField: 'email', passwordField: 'password' },
    async (email: string, password: string, done: any) => {
      try {
        const user = await User.findOne({ email });

        if (!user) {
          return done(null, false, { message: 'User does not exist!' });
        }

        const isGoogleUser = user.auths?.some(
          (provider) => provider.provider === 'google'
        );
        const isFacebookUser = user.auths?.some(
          (provider) => provider.provider === 'facebook'
        );

        if (isGoogleUser || isFacebookUser) {
          return done(null, false, {
            message:
              'This account was created with a social provider. Please login with that provider or set a password first.',
          });
        }

        if (!user.password) {
          return done(null, false, { message: 'Password is not set!' });
        }

        const isMatchPassword = await bcrypt.compare(password, user.password);

        if (!isMatchPassword) {
          return done(null, false, { message: 'Password incorrect!' });
        }

        return done(null, user);
      } catch (error) {
        console.log('Passport local login error: ', error);
        done(error);
      }
    }
  )
);

passport.use(
  new GoogleStrategy(
    {
      clientID: env.GOOGLE_OAUTH_ID,
      clientSecret: env.GOOGLE_OAUTH_SECRET,
      callbackURL: env.GOOGLE_CALLBACK_URL,
    },
    async (
      _accessToken: string,
      _refreshToken: string,
      profile: Profile,
      done: VerifyCallback
    ) => {
      try {
        const email = profile.emails?.[0].value;

        if (!email) {
          return done(null, false, { message: 'No email found' });
        }

        let user = await User.findOne({ email });

        if (!user) {
          user = await User.create({
            name: profile.displayName,
            email,
            picture: profile.photos?.[0].value,
            role: Role.USER,
            isVerified: true,
            auths: [
              {
                provider: 'google',
                providerId: profile.id,
              },
            ],
          });
        }

        return done(null, user);
      } catch (error) {
        console.log('Google strategy error', error);
        done(error);
      }
    }
  )
);

passport.use(
  new FacebookStrategy(
    {
      clientID: env.FACEBOOK_APP_ID,
      clientSecret: env.FACEBOOK_APP_SECRET,
      callbackURL: env.FACEBOOK_APP_CALLBACK_URL,
      profileFields: ['id', 'displayName', 'emails', 'photos'],
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        const email =
          profile.emails?.[0]?.value || `${profile.id}@facebook.com`;
        let user = await User.findOne({ email });

        if (!user) {
          user = await User.create({
            name: profile.displayName,
            email,
            picture: profile.photos?.[0]?.value,
            role: Role.USER,
            isVerified: true,
            auths: [
              {
                provider: 'facebook',
                providerId: profile.id,
              },
            ],
          });
        }

        done(null, user);
      } catch (error) {
        console.log('Passport Facebook authentication error: ', error);
        done(error);
      }
    }
  )
);

passport.serializeUser((user: any, done: (err: any, id?: unknown) => void) => {
  done(null, user._id);
});

passport.deserializeUser(async (id: string, done: any) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    console.log(error);
    done(error);
  }
});
