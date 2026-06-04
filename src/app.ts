import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { router } from './app/routes';
import { globalErrorHandler } from './app/middlewares/globalErrorHandler';
import { NotFound } from './app/middlewares/NotFound';
import rateLimit from 'express-rate-limit';
import { safeSanitizeMiddleware } from './app/middlewares/mongoSanitizer';
import env from './app/config/env';
import expressSession from 'express-session';
import passport from 'passport';
import './app/config/passport.config'
import mongoose from 'mongoose';


const app = express();

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

app.use(expressSession({
  secret: env.EXPRESS_SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize()); // Initialized Passport
app.use(passport.session()); // Create a session
app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(safeSanitizeMiddleware);


const limiter = rateLimit({
  windowMs: env.REQUEST_RATE_LIMIT_TIME * 60 * 1000, 
  max: env.REQUEST_RATE_LIMIT,  
  message: {success: false, statusCode: 400, message: "Too many requests, please try again later."}
});

app.use(limiter);

app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to the show');
});

app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Server is healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    database:
      mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    environment: env.NODE_ENV,
  });
});

// GLOBAL ROUTES
app.use('/api/v1', router);

// GLOBAL ERROR HANDLER
app.use(globalErrorHandler);

// NO ROUTE MATCH
app.use(NotFound);

export default app;
