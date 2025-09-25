import { Hono } from 'hono';
const health = new Hono();
// Basic health check
health.get('/', (c) => {
    return c.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        service: 'hdbank-backend',
        version: '1.0.0',
        environment: c.env?.ENVIRONMENT || 'development',
    });
});
// Detailed health check
health.get('/detailed', async (c) => {
    const checks = {
        database: 'unknown',
        cache: 'unknown',
        external_apis: 'unknown',
    };
    try {
        // Database check would go here
        // const dbResult = await checkDatabase();
        checks.database = 'healthy';
    }
    catch (error) {
        checks.database = 'unhealthy';
    }
    try {
        // Cache check (KV storage)
        if (c.env?.CACHE) {
            await c.env.CACHE.get('health-check');
            checks.cache = 'healthy';
        }
    }
    catch (error) {
        checks.cache = 'unhealthy';
    }
    const allHealthy = Object.values(checks).every(status => status === 'healthy');
    return c.json({
        status: allHealthy ? 'healthy' : 'degraded',
        timestamp: new Date().toISOString(),
        checks,
        uptime: Date.now(), // In a real worker, this would be more meaningful
    }, allHealthy ? 200 : 503);
});
export { health as healthRoutes };
//# sourceMappingURL=health.js.map