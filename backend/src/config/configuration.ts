export default () => ({
  port: parseInt(process.env.PORT ?? '3000', 10),
  mongoUri: process.env.MONGO_URI ?? 'mongodb://localhost:27017/pescamarche',
  corsOrigins: (
    process.env.CORS_ORIGIN ?? 'http://localhost:5173,http://localhost:5174'
  )
    .split(',')
    .map((origin) => origin.trim()),
  jwtSecret: process.env.JWT_SECRET ?? 'dev-secret-change-me',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? '8h',
  adminEmail: process.env.ADMIN_EMAIL ?? 'admin@pescamarche.com',
  adminPassword: process.env.ADMIN_PASSWORD ?? 'changeme123',
  mpAccessToken: process.env.MP_ACCESS_TOKEN ?? '',
  frontendUrl: process.env.FRONTEND_URL ?? 'http://localhost:5173',
  backendUrl: process.env.BACKEND_URL ?? 'http://localhost:3000',
  gmailUser: process.env.GMAIL_USER ?? '',
  gmailAppPassword: process.env.GMAIL_APP_PASSWORD ?? '',
});
