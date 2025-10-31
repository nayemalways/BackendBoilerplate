import { Router } from "express";
import passport from "passport";
import { authController } from "./auth.controller";


const router = Router();

router.get('/google', authController.googleRegister);

router.get('/google/callback', 
    passport.authenticate('google', { failureRedirect: '/login' }),
    authController.googleCallback
)

export const authRouter = router;