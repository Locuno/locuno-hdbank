# Cloudflare Setup Guide

This guide walks you through setting up the HD Bank platform on Cloudflare's edge infrastructure.

## Prerequisites

1. **Cloudflare Account**: Sign up at [cloudflare.com](https://cloudflare.com)
2. **Domain**: Add your domain to Cloudflare (optional but recommended)
3. **Wrangler CLI**: Install globally with `npm install -g wrangler`

## Initial Setup

### 1. Authentication
```bash
# Login to Cloudflare
wrangler login

# Verify authentication
wrangler whoami
```

### 2. Create KV Namespace (for caching)
```bash
# Create production KV namespace
wrangler kv:namespace create "CACHE"

# Create preview KV namespace
wrangler kv:namespace create "CACHE" --preview

# Update wrangler.toml with the returned IDs
```

### 3. Database Setup
Since Cloudflare Workers have connection limits, use one of these approaches:

#### Option A: Connection Pooling (Recommended)
Use PgBouncer or similar:
```bash
# Example connection string
DATABASE_URL="postgresql://username:password@pgbouncer-host:6543/hdbank_prod?pgbouncer=true"
```

#### Option B: Cloudflare D1 (SQLite)
```bash
# Create D1 database
wrangler d1 create hdbank-db

# Update wrangler.toml with the database ID
# Uncomment the d1_databases section
```

## Frontend Deployment (Cloudflare Pages)

### Method 1: Direct Upload
```bash
cd apps/frontend

# Build the application
pnpm run build

# Deploy to Cloudflare Pages
wrangler pages deploy out --project-name hdbank-frontend
```

### Method 2: Git Integration (Recommended)
1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com) > Pages
2. Click "Create a project" > "Connect to Git"
3. Select your repository
4. Configure build settings:
   - **Build command**: `cd apps/frontend && pnpm run build`
   - **Build output directory**: `apps/frontend/out`
   - **Root directory**: `/` (leave empty)

### Environment Variables (Pages)
Set these in Cloudflare Dashboard > Pages > Your Project > Settings > Environment variables:

```
NEXT_PUBLIC_API_URL=https://hdbank-backend.your-subdomain.workers.dev
NEXT_PUBLIC_APP_NAME=HD Bank Digital Platform
NEXT_PUBLIC_ENVIRONMENT=production
```

## Backend Deployment (Cloudflare Workers)

### 1. Configure wrangler.toml
Update the `wrangler.toml` file with your specific settings:

```toml
name = "hdbank-backend"
main = "src/index.ts"
compatibility_date = "2025-01-15"
compatibility_flags = ["nodejs_compat"]

[env.production]
name = "hdbank-backend-prod"
vars = { ENVIRONMENT = "production" }

[[kv_namespaces]]
binding = "CACHE"
id = "your-kv-namespace-id"
preview_id = "your-preview-kv-namespace-id"
```

### 2. Set Secrets
```bash
cd apps/backend

# Set production secrets
wrangler secret put JWT_SECRET --env production
wrangler secret put DATABASE_URL --env production
wrangler secret put CORE_BANKING_API_KEY --env production

# Set staging secrets
wrangler secret put JWT_SECRET --env staging
wrangler secret put DATABASE_URL --env staging
```

### 3. Deploy Worker
```bash
# Deploy to production
wrangler deploy --env production

# Deploy to staging
wrangler deploy --env staging

# View logs
wrangler tail --env production
```

## Custom Domain Setup

### Frontend Domain (Pages)
1. Go to Cloudflare Dashboard > Pages > Your Project
2. Click "Custom domains" tab
3. Click "Set up a custom domain"
4. Enter your domain (e.g., `hdbank.com`)
5. Follow DNS configuration instructions

### Backend Domain (Workers)
1. Go to Cloudflare Dashboard > Workers > Your Worker
2. Click "Triggers" tab
3. Click "Add Custom Domain"
4. Enter your API domain (e.g., `api.hdbank.com`)
5. Configure DNS records

## Environment-Specific Configuration

### Production Environment
```bash
# Environment variables for production
export CF_PAGES_PROJECT_NAME="hdbank-frontend-prod"
export CF_WORKER_URL="https://api.hdbank.com"
export CF_PAGES_URL="https://hdbank.com"
```

### Staging Environment
```bash
# Environment variables for staging
export CF_PAGES_PROJECT_NAME="hdbank-frontend-staging"
export STAGING_CF_WORKER_URL="https://hdbank-backend-staging.your-subdomain.workers.dev"
export STAGING_CF_PAGES_URL="https://staging.hdbank.com"
```

## Monitoring and Analytics

### 1. Enable Analytics
- Go to Cloudflare Dashboard > Analytics & Logs
- Enable Web Analytics for Pages
- Enable Workers Analytics

### 2. Set up Alerts
- Configure email alerts for errors
- Set up uptime monitoring
- Monitor performance metrics

### 3. Logging
```bash
# View real-time logs
wrangler tail --env production

# View specific worker logs
wrangler tail hdbank-backend-prod
```

## Security Configuration

### 1. WAF Rules
Set up Web Application Firewall rules:
- Rate limiting
- Geographic restrictions
- Bot protection

### 2. Access Policies
Configure Cloudflare Access for admin endpoints:
- Protect `/admin/*` routes
- Set up authentication policies
- Configure team access

### 3. Security Headers
Headers are configured in `apps/frontend/_headers` file:
- Content Security Policy
- HSTS
- X-Frame-Options
- X-Content-Type-Options

## Troubleshooting

### Common Issues

1. **Worker exceeds CPU time limit**
   - Optimize database queries
   - Use connection pooling
   - Implement caching

2. **Pages build fails**
   - Check build command
   - Verify Node.js version
   - Check environment variables

3. **CORS errors**
   - Update CORS_ORIGIN in worker
   - Check _redirects file
   - Verify API endpoints

### Debug Commands
```bash
# Check worker status
wrangler status

# View worker metrics
wrangler metrics

# Test worker locally
wrangler dev --local

# Check Pages deployment
wrangler pages deployment list --project-name hdbank-frontend
```

## Performance Optimization

### 1. Caching Strategy
- Use KV storage for session data
- Implement edge caching
- Cache static assets

### 2. Database Optimization
- Use connection pooling
- Implement read replicas
- Optimize queries

### 3. Asset Optimization
- Enable Cloudflare's optimization features
- Use WebP images
- Minify CSS/JS

## Backup and Recovery

### 1. Database Backups
```bash
# Automated backup script
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d_%H%M%S).sql
```

### 2. Configuration Backup
- Export wrangler.toml settings
- Document environment variables
- Save DNS configurations

### 3. Rollback Procedures
```bash
# Rollback worker deployment
wrangler rollback --env production

# Rollback Pages deployment
wrangler pages deployment list --project-name hdbank-frontend
wrangler pages deployment rollback <deployment-id>
```

---

For additional support, refer to:
- [Cloudflare Workers Documentation](https://developers.cloudflare.com/workers/)
- [Cloudflare Pages Documentation](https://developers.cloudflare.com/pages/)
- [Wrangler CLI Documentation](https://developers.cloudflare.com/workers/wrangler/)
