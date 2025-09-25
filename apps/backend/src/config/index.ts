// Cloudflare Workers environment - configuration factory

export const createConfig = (env: any) => ({
  // Server configuration
  env: env.NODE_ENV || 'development',
  port: parseInt(env.PORT || '3001', 10),
  host: env.HOST || 'localhost',

  // Database configuration
  database: {
    url: env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/hdbank_dev',
    poolSize: parseInt(env.DATABASE_POOL_SIZE || '10', 10),
  },

  // JWT configuration
  jwt: {
    secret: env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production',
    expiresIn: env.JWT_EXPIRES_IN || '24h',
    refreshExpiresIn: env.JWT_REFRESH_EXPIRES_IN || '7d',
  },

  // Security configuration
  security: {
    bcryptRounds: parseInt(env.BCRYPT_ROUNDS || '12', 10),
  },

  // Rate limiting configuration
  rateLimit: {
    windowMs: parseInt(env.RATE_LIMIT_WINDOW_MS || '900000', 10), // 15 minutes
    maxRequests: parseInt(env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
  },

  // CORS configuration
  cors: {
    origin: env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: env.CORS_CREDENTIALS === 'true',
  },

  // Logging configuration
  logging: {
    level: env.LOG_LEVEL || 'info',
    format: env.LOG_FORMAT || 'combined',
  },

  // Redis configuration
  redis: {
    url: env.REDIS_URL || 'redis://localhost:6379',
  },

  // SMTP configuration
  smtp: {
    host: env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(env.SMTP_PORT || '587', 10),
    user: env.SMTP_USER || '',
    pass: env.SMTP_PASS || '',
  },

  // Core Banking API configuration
  coreBanking: {
    apiUrl: env.CORE_BANKING_API_URL || 'https://api.hdbank.com',
    apiKey: env.CORE_BANKING_API_KEY || '',
    timeout: parseInt(env.CORE_BANKING_TIMEOUT || '30000', 10),
  },

  // Monitoring configuration
  monitoring: {
    sentryDsn: env.SENTRY_DSN || '',
    newRelicLicenseKey: env.NEW_RELIC_LICENSE_KEY || '',
  },
});

// Validate configuration
export const validateConfig = (config: ReturnType<typeof createConfig>) => {
  const requiredEnvVars = ['DATABASE_URL', 'JWT_SECRET'];
  const missingVars: string[] = [];
  
  if (!config.database.url || config.database.url.includes('postgresql://postgres:password@localhost')) {
    missingVars.push('DATABASE_URL');
  }
  if (!config.jwt.secret || config.jwt.secret === 'your-super-secret-jwt-key-change-this-in-production') {
    missingVars.push('JWT_SECRET');
  }
  
  if (missingVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
  }
  
  if (config.env === 'production' && config.jwt.secret.length < 32) {
    throw new Error('JWT_SECRET must be at least 32 characters long in production');
  }
};
