import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { secureHeaders } from 'hono/secure-headers';
import { config } from './config';
import { errorHandler } from './middleware/errorHandler';
import { authRoutes } from './routes/auth';
import { userRoutes } from './routes/users';
import { accountRoutes } from './routes/accounts';
import { transactionRoutes } from './routes/transactions';
import { healthRoutes } from './routes/health';
const app = new Hono();
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
//# sourceMappingURL=index.js.map