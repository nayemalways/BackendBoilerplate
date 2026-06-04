import dotenv from 'dotenv';
dotenv.config();

interface EnvInterfaces {
  PORT: string;
  MONGO_URI: string;
  NODE_ENV: 'development' | 'production';
  JWT_ACCESS_SECRET: string;
  JWT_ACCESS_EXPIRATION: string;
  JWT_REFRESH_SECRET: string;
  JWT_REFRESH_EXPIRATION: string;
  BCRYPT_SALT_ROUND: string;

  FRONTEND_URL: string;
  BACKEND_URL: string;

  CLOUDINARY_SECRET: string;
  CLOUDINARY_API_KEY: string;
  CLOUDINARY_NAME: string;

  REDIS_HOST: string;
  REDIS_PORT: string;
  REDIS_USERNAME: string;
  REDIS_PASSWORD: string;

  REQUEST_RATE_LIMIT: number;
  REQUEST_RATE_LIMIT_TIME: number;

  EMAIL_HOST: string;
  EMAIL_PORT: string;
  EMAIL_USER: string;
  EMAIL_PASSWORD: string;
  EMAIL_FROM: string;
  EMAIL_FROM_NAME: string;
  UNSUBSCRIBE_MAIL: string;

 
  GOOGLE_WEB_CLIENT_ID: string;
  GOOGLE_OAUTH_ID: string;
  GOOGLE_OAUTH_SECRET: string;
  GOOGLE_CALLBACK_URL: string;

  FACEBOOK_APP_ID: string;
  FACEBOOK_APP_SECRET: string;
  FACEBOOK_APP_CALLBACK_URL: string;

  EXPRESS_SESSION_SECRET: string;
}

const loadEnvVariables = (): EnvInterfaces => {
  const requireEnvVariables: string[] = [
    'PORT',
    'MONGO_URI',
    'JWT_ACCESS_SECRET',
    'NODE_ENV',
    'JWT_ACCESS_SECRET',
    'JWT_ACCESS_EXPIRATION',
    'JWT_REFRESH_SECRET',
    'JWT_REFRESH_EXPIRATION',
    'BCRYPT_SALT_ROUND',
 
    'FRONTEND_URL',
    'BACKEND_URL',
 
    'CLOUDINARY_NAME',
    'CLOUDINARY_SECRET',
    'CLOUDINARY_API_KEY',

    'REQUEST_RATE_LIMIT',
    'REQUEST_RATE_LIMIT_TIME',
     
    'REDIS_HOST',
    'REDIS_PORT',
    'REDIS_USERNAME',
    'REDIS_PASSWORD',

    'EMAIL_HOST',
    'EMAIL_PORT',
    'EMAIL_USER',
    'EMAIL_PASSWORD',
    'EMAIL_FROM',
    'EMAIL_FROM_NAME',
    'UNSUBSCRIBE_MAIL',

    'GOOGLE_WEB_CLIENT_ID',
    'GOOGLE_OAUTH_ID',
    'GOOGLE_OAUTH_SECRET',
    'GOOGLE_CALLBACK_URL',

    'FACEBOOK_APP_ID',
    'FACEBOOK_APP_SECRET',
    'FACEBOOK_APP_CALLBACK_URL',

    'EXPRESS_SESSION_SECRET'
  ];
  requireEnvVariables.forEach((KEY) => {
    if (!process.env[KEY]) {
      throw new Error(`Missing required env variable ${KEY}`);
    }
  });

  return {
    MONGO_URI: process.env.MONGO_URI as string,
    PORT: process.env.PORT as string,
    NODE_ENV: process.env.NODE_ENV as 'development' | 'production',
    BCRYPT_SALT_ROUND: process.env.BCRYPT_SALT_ROUND as string,

    JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET as string,
    JWT_ACCESS_EXPIRATION: process.env.JWT_ACCESS_EXPIRATION as string,
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET as string,
    JWT_REFRESH_EXPIRATION: process.env.JWT_REFRESH_EXPIRATION as string,

    FRONTEND_URL: process.env.FRONTEND_URL as string,
    BACKEND_URL: process.env.BACKEND_URL as string,


    CLOUDINARY_SECRET: process.env.CLOUDINARY_SECRET as string,
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY as string,
    CLOUDINARY_NAME: process.env.CLOUDINARY_NAME as string,

    REQUEST_RATE_LIMIT_TIME: Number(process.env.REQUEST_RATE_LIMIT_TIME) as number,
    REQUEST_RATE_LIMIT:Number( process.env.REQUEST_RATE_LIMIT) as number,

    REDIS_HOST: process.env.REDIS_HOST as string,
    REDIS_PORT: process.env.REDIS_PORT as string,
    REDIS_USERNAME: process.env.REDIS_USERNAME as string,
    REDIS_PASSWORD: process.env.REDIS_PASSWORD as string,

    EMAIL_PASSWORD: process.env.EMAIL_PASSWORD as string,
    EMAIL_USER: process.env.EMAIL_USER as string,
    EMAIL_PORT: process.env.EMAIL_PORT as string,
    EMAIL_HOST: process.env.EMAIL_HOST as string,
    EMAIL_FROM: process.env.EMAIL_FROM as string,
    EMAIL_FROM_NAME: process.env.EMAIL_FROM_NAME as string,
    UNSUBSCRIBE_MAIL: process.env.UNSUBSCRIBE_MAIL as string,


    GOOGLE_WEB_CLIENT_ID: process.env.GOOGLE_WEB_CLIENT_ID as string,
    GOOGLE_OAUTH_ID: process.env.GOOGLE_OAUTH_ID as string,
    GOOGLE_OAUTH_SECRET: process.env.GOOGLE_OAUTH_SECRET as string,
    GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL as string,

    FACEBOOK_APP_ID: process.env.FACEBOOK_APP_ID as string,
    FACEBOOK_APP_SECRET: process.env.FACEBOOK_APP_SECRET as string,
    FACEBOOK_APP_CALLBACK_URL: process.env.FACEBOOK_APP_CALLBACK_URL as string,

    EXPRESS_SESSION_SECRET: process.env.EXPRESS_SESSION_SECRET as string,
  };
};

export default loadEnvVariables();
