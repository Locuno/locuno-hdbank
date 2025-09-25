# Cloudflare Workers Deployment Guide

This guide will help you deploy the HDBank backend to Cloudflare Workers.

## Prerequisites

1. **Cloudflare Account**: You need a Cloudflare account with Workers enabled
2. **Node.js**: Ensure you have Node.js 18+ installed
3. **Wrangler CLI**: The deployment script will install it if not present

## Quick Start

### 1. Setup Environment Variables

Copy the example environment files and fill in your actual values:

```bash
# For staging
cp .env.staging.example .env.staging

# For production
cp .env.production.example .env.production
```

Edit these files with your actual database URLs, JWT secrets, and other configuration.

### 2. Update Wrangler Configuration

Edit `wrangler.toml` and update:
- KV namespace IDs (if using KV storage)
- D1 database IDs (if using Cloudflare D1)
- Worker names and routes

### 3. Deploy

```bash
# Deploy to staging (default)
./deploy.sh

# Deploy to production
./deploy.sh -e production

# Only setup secrets without deploying
./deploy.sh -s -e staging

# Only deploy without setting up secrets
./deploy.sh -d -e production
```

## Deployment Script Options

```bash
./deploy.sh [OPTIONS]

Options:
  -e, --env ENV        Environment to deploy to (staging|production) [default: staging]
  -s, --setup-only     Only setup secrets, don't deploy
  -d, --deploy-only    Only deploy, skip setup
  -h, --help          Show help message
```

## Manual Deployment Steps

If you prefer to deploy manually:

### 1. Install Dependencies

```bash
npm install
```

### 2. Authenticate with Cloudflare

```bash
npx wrangler login
```

### 3. Set Secrets

```bash
# Set JWT secret
echo "your-jwt-secret" | npx wrangler secret put JWT_SECRET --env staging

# Set database URL
echo "your-database-url" | npx wrangler secret put DATABASE_URL --env staging

# Set other secrets as needed
echo "your-encryption-key" | npx wrangler secret put ENCRYPTION_KEY --env staging
```

### 4. Build and Deploy

```bash
# Build the project
npm run build

# Deploy to staging
npm run deploy -- --env staging

# Deploy to production
npm run deploy -- --env production
```

## Environment Configuration

### Staging Environment
- Worker name: `hdbank-backend-staging`
- Environment variables are set in `wrangler.toml` under `[env.staging]`

### Production Environment
- Worker name: `hdbank-backend-prod`
- Environment variables are set in `wrangler.toml` under `[env.production]`

## Required Secrets

The following secrets need to be set for each environment:

| Secret Name | Description | Required |
|-------------|-------------|----------|
| `JWT_SECRET` | Secret key for JWT token signing | Yes |
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `ENCRYPTION_KEY` | Key for encrypting sensitive data | Yes |
| `SMTP_PASSWORD` | Email service password | Optional |
| `API_KEY` | Third-party API keys | Optional |

## Database Setup

### Using External PostgreSQL

1. Set up a PostgreSQL database (e.g., on Neon, Supabase, or AWS RDS)
2. Add the connection string to your environment file
3. Run migrations if needed:

```bash
npm run db:migrate
```

### Using Cloudflare D1 (Alternative)

1. Create a D1 database:

```bash
npx wrangler d1 create hdbank-db
```

2. Update `wrangler.toml` with the database ID
3. Run migrations:

```bash
npx wrangler d1 migrations apply hdbank-db --env staging
```

## Monitoring and Logs

### View Logs

```bash
# Tail logs for staging
npx wrangler tail --env staging

# Tail logs for production
npx wrangler tail --env production
```

### Check Deployment Status

```bash
# List deployments
npx wrangler deployments list --env staging

# Get worker info
npx wrangler whoami
```

## Troubleshooting

### Common Issues

1. **Authentication Error**
   ```bash
   npx wrangler login
   ```

2. **Build Errors**
   - Check TypeScript compilation: `npm run build`
   - Ensure all dependencies are installed: `npm install`

3. **Runtime Errors**
   - Check worker logs: `npx wrangler tail --env staging`
   - Verify environment variables and secrets are set correctly

4. **Database Connection Issues**
   - Verify `DATABASE_URL` secret is set correctly
   - Ensure database is accessible from Cloudflare Workers
   - Check if database supports connection pooling

### Performance Optimization

1. **Cold Start Optimization**
   - Keep bundle size small
   - Use dynamic imports for heavy dependencies
   - Implement proper caching strategies

2. **Database Optimization**
   - Use connection pooling
   - Implement query optimization
   - Consider using Cloudflare D1 for better integration

## Security Considerations

1. **Secrets Management**
   - Never commit `.env.*` files to version control
   - Use Wrangler secrets for sensitive data
   - Rotate secrets regularly

2. **CORS Configuration**
   - Set appropriate CORS origins in `wrangler.toml`
   - Restrict to your frontend domains only

3. **Rate Limiting**
   - Configure appropriate rate limits
   - Use Cloudflare's built-in DDoS protection

## Support

For issues related to:
- **Cloudflare Workers**: [Cloudflare Workers Documentation](https://developers.cloudflare.com/workers/)
- **Wrangler CLI**: [Wrangler Documentation](https://developers.cloudflare.com/workers/wrangler/)
- **Hono Framework**: [Hono Documentation](https://hono.dev/)