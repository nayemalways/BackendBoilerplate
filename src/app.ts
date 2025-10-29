import express, { Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { router } from './app/routes';
import { globalErrorHandler } from './app/middlewares/globalErrorHandler';
import { NotFound } from './app/middlewares/NotFound';
import rateLimit from 'express-rate-limit';
import { safeSanitizeMiddleware } from './app/middlewares/mongoSanitizer';
import env from './app/config/env';


const app = express();

app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(safeSanitizeMiddleware);


const limiter = rateLimit({
  windowMs: env.REQUEST_RATE_LIMIT_TIME * 1000 * 10, 
  max: env.REQUEST_RATE_LIMIT,  
  message: {success: false, statusCode: 400, message: "Too many requests, please try again later."}
});

app.use(limiter);

app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to the show');
});

// GLOBAL ROUTES
app.use('/api/v1', router);

// GLOBAL ERROR HANDLER
app.use(globalErrorHandler);

// NO ROUTE MATCH
app.use(NotFound);

export default app;
