# BackendBoilerplate

Node.js, Express, TypeScript, and MongoDB backend starter with authentication, validation, email OTP, secure middleware, and optional third-party integrations already scaffolded.

## Requirements

- Node.js 18+
- npm
- MongoDB database
- SMTP/email credentials if you want OTP email to work

## How To Run

1. Install dependencies:

```bash
npm install
```

2. Create your environment file:

```bash
cp .env.example .env
```

On Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

3. Update `.env` with your credentials.

Minimum values needed to start cleanly:

```env
MONGO_URI=mongodb://localhost:27017/boilerplate
PORT=3002
NODE_ENV=development

JWT_ACCESS_SECRET=your-access-secret
JWT_ACCESS_EXPIRATION=1d
JWT_REFRESH_SECRET=your-refresh-secret
JWT_REFRESH_EXPIRATION=30d
BCRYPT_SALT_ROUND=10

FRONTEND_URL=http://localhost:3000
BACKEND_URL=http://localhost:3002

REQUEST_RATE_LIMIT_TIME=10
REQUEST_RATE_LIMIT=100

EXPRESS_SESSION_SECRET=your-session-secret
```

4. Start the development server:

```bash
npm run dev
```

The API will run at:

```text
http://localhost:3002
```

5. Build for production:

```bash
npm run build
```

## Available Scripts

- `npm run dev` - start the server with `nodemon` and `ts-node`
- `npm run build` - compile TypeScript
- `npm run lint` - run ESLint on `src`
- `npm run format` - format the project with Prettier

## Pre-Built Features

- Express 5 application setup with TypeScript
- MongoDB connection using Mongoose
- Modular route structure under `/api/v1`
- User registration with email, password, OTP, and role
- Password hashing with bcrypt
- Zod request validation
- JWT access and refresh token generation
- Auth cookies for access and refresh tokens
- Centralized response helper
- Centralized async wrapper
- Global error handler with custom `AppError`
- Not-found middleware
- MongoDB query sanitization middleware
- Rate limiting
- CORS, cookie parsing, JSON parsing, and URL encoded parsing
- Nodemailer + EJS email template support
- Cloudinary upload/delete utility
- Multer Cloudinary storage config
- Graceful shutdown handlers for `SIGTERM` and `SIGINT`
- Unhandled rejection and uncaught exception handlers

## API Routes

Base URL:

```text
/api/v1
```

User routes:

- `POST /api/v1/user/create` - create user and send OTP email
- `GET /api/v1/user/verify/:otp` - verify user OTP
- `GET /api/v1/user/resend-otp` - resend OTP

Auth routes:

- `POST /api/v1/auth/login` - credentials login through Passport local strategy
- `GET /api/v1/auth/google` - start Google OAuth login
- `GET /api/v1/auth/google/callback` - Google OAuth callback
- `GET /api/v1/auth/facebook` - start Facebook OAuth login
- `GET /api/v1/auth/facebook/callback` - Facebook OAuth callback

## Optional Pre-Built Features

Some integrations are already written but intentionally commented or credential-dependent. To use them, uncomment the related code and add the required credentials in `.env`.

### Passport Local, Google, And Facebook Auth

File:

```text
src/app/config/passport.config.ts
```

This file contains commented Passport strategies for:

- Credentials login with email and password
- Google OAuth registration/login
- Facebook OAuth registration/login
- Passport serialize and deserialize session handlers

To enable it:

- Uncomment `src/app/config/passport.config.ts`
- Add these credentials to `.env`:

```env
GOOGLE_WEB_CLIENT_ID=
GOOGLE_OAUTH_ID=
GOOGLE_OAUTH_SECRET=
GOOGLE_CALLBACK_URL=

FACEBOOK_APP_ID=
FACEBOOK_APP_SECRET=
FACEBOOK_APP_CALLBACK_URL=

EXPRESS_SESSION_SECRET=
FRONTEND_URL=
```

### Redis

Files:

```text
src/app/config/redis.config.ts
src/server.ts
```

Redis connection is already configured, but startup is commented in `src/server.ts`:

```ts
// import { connectRedis } from './app/config/redis.config';
// await connectRedis(); // Turn on if needed
```

To enable it, uncomment those lines and add:

```env
REDIS_HOST=
REDIS_PORT=
REDIS_USERNAME=
REDIS_PASSWORD=
```

### Email OTP And Templates

Files:

```text
src/app/utils/sendMail.ts
src/app/utils/templates
```

Email sending is already used during user registration and OTP resend. Add SMTP credentials:

```env
EMAIL_HOST=
EMAIL_PORT=
EMAIL_USER=
EMAIL_PASSWORD=
EMAIL_FROM=
EMAIL_FROM_NAME=
UNSUBSCRIBE_MAIL=
BACKEND_URL=
```

### Cloudinary Upload

Files:

```text
src/app/config/cloudinary.config.ts
src/app/config/multer.config.ts
```

Cloudinary upload/delete helpers and Multer storage are ready. Add:

```env
CLOUDINARY_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_SECRET=
```

Then import `multerUpload` in any route where file upload is needed.

## Folder Overview

```text
src/
  app.ts
  server.ts
  app/
    config/
    errorHelpers/
    middlewares/
    modules/
      auth/
      user/
    routes/
    utils/
```

## Notes

- Keep real secrets out of `.env.example`.
- If an optional feature is not needed, keep its credentials empty only if `env.ts` does not require them for your current setup.
- For production, set `NODE_ENV=production`, use strong JWT/session secrets, configure trusted CORS origins, and use secure HTTPS cookies.
