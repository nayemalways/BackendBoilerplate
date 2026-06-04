import { Router } from 'express';
import passport from 'passport';
import { authController } from './auth.controller';
import { validateRequest } from '../../middlewares/validateRequest';
import { credentialsLoginZodSchema } from './auth.validate';

const router = Router();

router.get('/google', authController.googleRegister);
router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  authController.googleCallback
);

router.get('/phone/google', authController.googleAuthSystem);

router.get('/facebook', authController.facebookRegister);
router.get('/facebook/callback', authController.facebookCallback);

router.post(
  '/login',
  validateRequest(credentialsLoginZodSchema),
  authController.credentialsLogin
);

router.post('/refresh-token', authController.refreshToken);
router.post('/logout', authController.logout);

export const authRouter = router;
