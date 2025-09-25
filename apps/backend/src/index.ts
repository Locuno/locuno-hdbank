import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { secureHeaders } from 'hono/secure-headers';
import { createConfig, validateConfig } from './config';
import { errorHandler } from './middleware/errorHandler';
import { authRoutes } from './routes/auth';
import { userRoutes } from './routes/users';
import { accountRoutes } from './routes/accounts';
import { transactionRoutes } from './routes/transactions';
import { healthRoutes } from './routes/health';
import { family } from './routes/family';
import { wallet } from './routes/wallet';
import { rewards } from './routes/rewards';
import { sepayWebhook } from './routes/sepay-webhook';
import vietqr from './routes/vietqr';
import { UserProfileDO } from './durable-objects/UserProfileDO';
import { FamilyDO } from './durable-objects/FamilyDO';
import { CommunityWalletDO } from './durable-objects/CommunityWalletDO';
import { SmartRewardsDO } from './durable-objects/SmartRewardsDO';

// Define Cloudflare Worker environment
type Bindings = {
  CACHE?: any; // KV namespace for caching
  USER_PROFILE_DO: any; // Durable Object namespace
  FAMILY_DO: any; // Family Durable Object namespace
  COMMUNITY_WALLET_DO: any; // Community Wallet Durable Object namespace
  SMART_REWARDS_DO: any; // Smart Rewards Durable Object namespace
  JWT_SECRET?: string;
  DATABASE_URL?: string;
};

const app = new Hono<{ Bindings: Bindings }>();

// Security headers middleware
app.use('*', secureHeaders());

// CORS configuration - will be set dynamically per request
app.use('*', async (c, next) => {
  const config = createConfig(c.env);
  const corsMiddleware = cors({
    origin: config.cors.origin,
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization'],
    credentials: config.cors.credentials,
  });
  return corsMiddleware(c, next);
});

// Logging middleware
app.use('*', logger());

// API routes
app.route('/api/health', healthRoutes);
app.route('/api/auth', authRoutes);
app.route('/api/users', userRoutes);
app.route('/api/accounts', accountRoutes);
app.route('/api/transactions', transactionRoutes);
app.route('/api/family', family);
app.route('/api/wallet', wallet);
app.route('/api/rewards', rewards);
app.route('/api/sepay', sepayWebhook);
app.route('/api/vietqr', vietqr);

// Health check endpoint (for load balancers)
app.get('/health', (c) => {
  const config = createConfig(c.env);
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
// Export Durable Object class for Cloudflare Workers
export { UserProfileDO, FamilyDO, CommunityWalletDO, SmartRewardsDO };

export default app;
