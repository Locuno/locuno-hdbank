import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { secureHeaders } from 'hono/secure-headers';
import { rateLimiter } from 'hono/rate-limiter';
import { config } from './config';
import { errorHandler } from './middleware/errorHandler';
import { authRoutes } from './routes/auth';
import { userRoutes } from './routes/users';
import { accountRoutes } from './routes/accounts';
import { transactionRoutes } from './routes/transactions';
import { healthRoutes } from './routes/health';

// Define Cloudflare Worker environment
type Bindings = {
  CACHE: KVNamespace;
  JWT_SECRET: string;
  DATABASE_URL: string;
};

const app = new Hono<{ Bindings: Bindings }>();

// Security headers middleware
app.use('*', secureHeaders());

// CORS configuration
app.use('*', cors({
  origin: config.cors.origin,
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
  credentials: config.cors.credentials,
}));

// Logging middleware
app.use('*', logger());

// Rate limiting middleware
app.use('*', rateLimiter({
  windowMs: config.rateLimit.windowMs,
  limit: config.rateLimit.maxRequests,
  message: 'Too many requests from this IP, please try again later.',
}));

// API routes
app.route('/api/health', healthRoutes);
app.route('/api/auth', authRoutes);
app.route('/api/users', userRoutes);
app.route('/api/accounts', accountRoutes);
app.route('/api/transactions', transactionRoutes);

// Health check endpoint (for load balancers)
app.get('/health', (c) => {
  return c.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: config.env,
    version: '1.0.0',
    worker: 'cloudflare',
  });
});

// Error handling middleware
app.onError(errorHandler);

// Export the app for Cloudflare Workers
export default app;
