# Deployment Guide - Locuno HD Bank Platform

This comprehensive guide covers deployment strategies for the HD Bank digital platform using Cloudflare's edge infrastructure.

## 🏗️ Architecture Overview

The platform consists of:
- **Frontend**: Next.js application deployed to Cloudflare Pages
- **Backend**: Cloudflare Workers with Hono framework
- **Database**: PostgreSQL with Prisma ORM (via connection pooling)
- **Cache**: Cloudflare KV Storage
- **Monitoring**: Cloudflare Analytics, Sentry (optional)

## 📋 Prerequisites

### System Requirements
- Node.js >= 18.0.0
- pnpm >= 8.0.0
- Wrangler CLI (Cloudflare Workers CLI)
- PostgreSQL >= 13 (with connection pooling like PgBouncer)
- Cloudflare account with Pages and Workers enabled

### Required Environment Variables
Ensure all environment variables are configured for each environment:
- Frontend: `apps/frontend/.env.local`
- Backend: `apps/backend/.env`

## 🚀 Deployment Environments

### Development Environment

#### Local Development Setup
```bash
# 1. Clone and install dependencies
git clone <repository-url>
cd locuno-hdbank
pnpm install

# 2. Setup environment files
cp apps/frontend/.env.example apps/frontend/.env.local
cp apps/backend/.env.example apps/backend/.env

# 3. Configure database
# Update DATABASE_URL in apps/backend/.env
# Example: postgresql://username:password@localhost:5432/hdbank_dev

# 4. Run database migrations
pnpm run db:migrate

# 5. Seed the database (optional)
pnpm run db:seed

# 6. Start development servers
pnpm run dev
```

#### Development URLs
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- Database Studio: http://localhost:5555 (run `pnpm run db:studio`)

### Staging Environment

#### Staging Deployment Steps
```bash
# 1. Build applications
pnpm run build

# 2. Run staging deployment script
pnpm run deploy:staging

# 3. Verify deployment
curl -f https://staging-api.hdbank.com/health
curl -f https://staging.hdbank.com
```

#### Staging Configuration
```bash
# Environment Variables for Staging
NODE_ENV=staging
NEXT_PUBLIC_API_URL=https://staging-api.hdbank.com
DATABASE_URL=postgresql://user:pass@staging-db.hdbank.com:5432/hdbank_staging
CORS_ORIGIN=https://staging.hdbank.com
```

### Production Environment

#### Production Deployment Steps
```bash
# 1. Pre-deployment checks
pnpm run lint
pnpm run build
pnpm run test

# 2. Database backup (CRITICAL)
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d_%H%M%S).sql

# 3. Deploy to production
pnpm run deploy:prod

# 4. Run database migrations (if any)
NODE_ENV=production pnpm run db:migrate

# 5. Verify deployment
curl -f https://api.hdbank.com/health
curl -f https://hdbank.com

# 6. Monitor logs and metrics
tail -f /var/log/hdbank/app.log
```

#### Production Configuration
```bash
# Environment Variables for Production
NODE_ENV=production
NEXT_PUBLIC_API_URL=https://api.hdbank.com
DATABASE_URL=postgresql://user:pass@prod-db.hdbank.com:5432/hdbank_prod
CORS_ORIGIN=https://hdbank.com
JWT_SECRET=<strong-production-secret>
BCRYPT_ROUNDS=12
```

## ☁️ Cloudflare Deployment

### Prerequisites Setup
```bash
# Install Wrangler CLI
npm install -g wrangler

# Login to Cloudflare
wrangler login

# Verify authentication
wrangler whoami
```

### Frontend Deployment (Cloudflare Pages)
```bash
# Build the frontend
cd apps/frontend
pnpm run build

# Deploy to Cloudflare Pages
npx wrangler pages deploy out --project-name hdbank-frontend

# Or connect to Git repository for automatic deployments
# Go to Cloudflare Dashboard > Pages > Create a project > Connect to Git
```

### Backend Deployment (Cloudflare Workers)
```bash
# Deploy the worker
cd apps/backend
wrangler deploy

# View worker logs
wrangler tail

# Manage secrets
wrangler secret put JWT_SECRET
wrangler secret put DATABASE_URL
```

## ☁️ Cloud Deployment Options

### Cloudflare Configuration

#### Environment Variables Setup
```bash
# Set production secrets
wrangler secret put JWT_SECRET --env production
wrangler secret put DATABASE_URL --env production
wrangler secret put CORE_BANKING_API_KEY --env production

# Set staging secrets
wrangler secret put JWT_SECRET --env staging
wrangler secret put DATABASE_URL --env staging
```

#### Custom Domain Setup
1. **For Cloudflare Pages**:
   - Go to Cloudflare Dashboard > Pages > Your Project > Custom domains
   - Add your domain (e.g., hdbank.com)
   - Configure DNS records

2. **For Cloudflare Workers**:
   - Go to Cloudflare Dashboard > Workers > Your Worker > Triggers
   - Add custom domain (e.g., api.hdbank.com)
   - Configure DNS records

#### Database Connection Pooling
Since Cloudflare Workers have connection limits, use a connection pooler:

```bash
# Example with PgBouncer
# DATABASE_URL=postgresql://username:password@pgbouncer-host:6543/hdbank_prod?pgbouncer=true
```

### Alternative Deployment Options

#### Vercel (Frontend) + Cloudflare Workers (Backend)
```bash
# Deploy frontend to Vercel
cd apps/frontend
npx vercel --prod

# Deploy backend to Cloudflare Workers
cd ../backend
wrangler deploy --env production
```

#### Netlify (Frontend) + Cloudflare Workers (Backend)
```bash
# Deploy frontend to Netlify
cd apps/frontend
npx netlify deploy --prod --dir=out

# Deploy backend to Cloudflare Workers
cd ../backend
wrangler deploy --env production
```

## 🔧 Deployment Scripts

### Setup Script (`scripts/setup.sh`)
```bash
#!/bin/bash
set -e

echo "🚀 Setting up HD Bank Platform..."

# Install dependencies
pnpm install

# Setup environment files
if [ ! -f apps/frontend/.env.local ]; then
    cp apps/frontend/.env.example apps/frontend/.env.local
    echo "✅ Frontend environment file created"
fi

if [ ! -f apps/backend/.env ]; then
    cp apps/backend/.env.example apps/backend/.env
    echo "✅ Backend environment file created"
fi

# Generate Prisma client
cd apps/backend && pnpm run db:generate

echo "✅ Setup complete! Run 'pnpm run dev' to start development"
```

### Production Deployment Script (`scripts/deploy-prod.sh`)
```bash
#!/bin/bash
set -e

echo "🚀 Deploying to Production..."

# Pre-deployment checks
echo "Running pre-deployment checks..."
pnpm run lint
pnpm run build

# Database backup
echo "Creating database backup..."
pg_dump $DATABASE_URL > "backup_$(date +%Y%m%d_%H%M%S).sql"

# Deploy frontend to CDN
echo "Deploying frontend..."
cd apps/frontend
aws s3 sync out/ s3://hdbank-frontend-prod --delete
aws cloudfront create-invalidation --distribution-id $CLOUDFRONT_DISTRIBUTION_ID --paths "/*"

# Deploy backend
echo "Deploying backend..."
cd ../backend
docker build -t hdbank-backend:latest .
docker tag hdbank-backend:latest $ECR_REPOSITORY:latest
docker push $ECR_REPOSITORY:latest

# Update ECS service
aws ecs update-service --cluster hdbank-prod --service hdbank-backend --force-new-deployment

echo "✅ Production deployment complete!"
```

## 📊 Monitoring & Health Checks

### Health Check Endpoints
- Backend: `GET /health`
- Database: `GET /health/db`
- Redis: `GET /health/redis`

### Monitoring Setup
```bash
# Application metrics
curl https://api.hdbank.com/metrics

# Database monitoring
SELECT * FROM pg_stat_activity;

# Log monitoring
tail -f /var/log/hdbank/app.log | grep ERROR
```

## 🔒 Security Considerations

### SSL/TLS Configuration
- Use Let's Encrypt or AWS ACM for SSL certificates
- Enforce HTTPS redirects
- Configure HSTS headers

### Environment Security
- Use secrets management (AWS Secrets Manager, HashiCorp Vault)
- Rotate JWT secrets regularly
- Enable database encryption at rest
- Configure VPC and security groups properly

### Security Headers
```javascript
// In backend middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));
```

## 🚨 Rollback Procedures

### Quick Rollback Steps
```bash
# 1. Rollback backend service
aws ecs update-service --cluster hdbank-prod --service hdbank-backend --task-definition hdbank-backend:PREVIOUS_VERSION

# 2. Rollback frontend
aws s3 sync s3://hdbank-frontend-backup/ s3://hdbank-frontend-prod --delete
aws cloudfront create-invalidation --distribution-id $CLOUDFRONT_DISTRIBUTION_ID --paths "/*"

# 3. Rollback database (if needed)
psql $DATABASE_URL < backup_YYYYMMDD_HHMMSS.sql
```

## 📞 Support & Troubleshooting

### Common Issues
1. **Database Connection Issues**: Check DATABASE_URL and network connectivity
2. **CORS Errors**: Verify CORS_ORIGIN configuration
3. **Build Failures**: Check Node.js version and dependencies
4. **Memory Issues**: Monitor container memory usage and adjust limits

### Emergency Contacts
- DevOps Team: devops@hdbank.com
- Security Team: security@hdbank.com
- On-call Engineer: +1-XXX-XXX-XXXX

---

**Last Updated**: 2024-01-15
**Version**: 1.0.0
**Maintained by**: HD Bank DevOps Team
