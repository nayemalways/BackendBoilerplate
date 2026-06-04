import express from 'express';
import { userControllers } from './user.controller';
import { validateRequest } from '../../middlewares/validateRequest';
import { userZodSchema } from './user.validate';
import { checkAuth } from '../../middlewares/auth.middleware';
import { Role } from './user.interface';

const router = express.Router();

router.post('/create', validateRequest(userZodSchema), userControllers.createUser);
router.get('/me', checkAuth(Role.USER, Role.ADMIN), userControllers.getMe);
router.get('/verify/:otp', userControllers.verifyUser);
router.get('/resend-otp', userControllers.resendOTP);


export const userRoutes = router;
