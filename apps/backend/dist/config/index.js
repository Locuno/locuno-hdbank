// Cloudflare Workers environment - no dotenv needed
export const config = {
    // Server configuration
    env: process.env.NODE_ENV || 'development',
    port: parseInt(process.env.PORT || '3001', 10),
    host: process.env.HOST || 'localhost',
    // Database configuration
    database: {
        url: process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/hdbank_dev',
        poolSize: parseInt(process.env.DATABASE_POOL_SIZE || '10', 10),
    },
    // JWT configuration
    jwt: {
        secret: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production',
        expiresIn: process.env.JWT_EXPIRES_IN || '24h',
        refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
    },
    // Security configuration
    security: {
        bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS || '12', 10),
    },
    // Rate limiting configuration
    rateLimit: {
        windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10), // 15 minutes
        maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
    },
    // CORS configuration
    cors: {
        origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
        credentials: process.env.CORS_CREDENTIALS === 'true',
    },
    // Logging configuration
    logging: {
        level: process.env.LOG_LEVEL || 'info',
        format: process.env.LOG_FORMAT || 'combined',
    },
    // Redis configuration
    redis: {
        url: process.env.REDIS_URL || 'redis://localhost:6379',
    },
    // SMTP configuration
    smtp: {
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.SMTP_PORT || '587', 10),
        user: process.env.SMTP_USER || '',
        pass: process.env.SMTP_PASS || '',
    },
    // Core Banking API configuration
    coreBanking: {
        apiUrl: process.env.CORE_BANKING_API_URL || 'https://api.hdbank.com',
        apiKey: process.env.CORE_BANKING_API_KEY || '',
        timeout: parseInt(process.env.CORE_BANKING_TIMEOUT || '30000', 10),
    },
    // Monitoring configuration
    monitoring: {
        sentryDsn: process.env.SENTRY_DSN || '',
        newRelicLicenseKey: process.env.NEW_RELIC_LICENSE_KEY || '',
    },
};
// Validate required environment variables
const requiredEnvVars = [
    'DATABASE_URL',
    'JWT_SECRET',
];
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);
if (missingEnvVars.length > 0) {
    console.error('❌ Missing required environment variables:', missingEnvVars.join(', '));
    process.exit(1);
}
// Validate JWT secret strength in production
if (config.env === 'production' && config.jwt.secret.length < 32) {
    console.error('❌ JWT_SECRET must be at least 32 characters long in production');
    process.exit(1);
}
//# sourceMappingURL=index.js.map