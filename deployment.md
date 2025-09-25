# Deployment Guide - Locuno HD Bank Platform

This comprehensive guide covers deployment strategies for the HD Bank digital platform across different environments.

## 🏗️ Architecture Overview

The platform consists of:
- **Frontend**: Next.js application with static export
- **Backend**: Node.js/Express API server
- **Database**: PostgreSQL with Prisma ORM
- **Cache**: Redis (optional)
- **Monitoring**: Sentry, New Relic (optional)

## 📋 Prerequisites

### System Requirements
- Node.js >= 18.0.0
- pnpm >= 8.0.0
- PostgreSQL >= 13
- Redis >= 6.0 (optional)
- Docker & Docker Compose (for containerized deployment)

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

## 🐳 Docker Deployment

### Docker Compose Setup
```yaml
# docker-compose.yml
version: '3.8'
services:
  frontend:
    build:
      context: .
      dockerfile: apps/frontend/Dockerfile
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://backend:3001
    depends_on:
      - backend

  backend:
    build:
      context: .
      dockerfile: apps/backend/Dockerfile
    ports:
      - "3001:3001"
    environment:
      - DATABASE_URL=postgresql://postgres:password@db:5432/hdbank
      - REDIS_URL=redis://redis:6379
    depends_on:
      - db
      - redis

  db:
    image: postgres:15
    environment:
      - POSTGRES_DB=hdbank
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

volumes:
  postgres_data:
```

### Docker Deployment Commands
```bash
# Build and start services
docker-compose up -d

# View logs
docker-compose logs -f

# Scale services
docker-compose up -d --scale backend=3

# Stop services
docker-compose down
```

## ☁️ Cloud Deployment Options

### AWS Deployment

#### Using AWS ECS with Fargate
```bash
# 1. Build and push Docker images
docker build -t hdbank-frontend apps/frontend/
docker build -t hdbank-backend apps/backend/

# 2. Tag and push to ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <account>.dkr.ecr.us-east-1.amazonaws.com
docker tag hdbank-frontend:latest <account>.dkr.ecr.us-east-1.amazonaws.com/hdbank-frontend:latest
docker push <account>.dkr.ecr.us-east-1.amazonaws.com/hdbank-frontend:latest

# 3. Deploy using ECS CLI or Terraform
ecs-cli compose --project-name hdbank service up
```

#### AWS Services Used
- **ECS Fargate**: Container orchestration
- **RDS PostgreSQL**: Managed database
- **ElastiCache Redis**: Managed cache
- **ALB**: Load balancing
- **CloudFront**: CDN for frontend
- **Route 53**: DNS management
- **ACM**: SSL certificates

### Vercel Deployment (Frontend Only)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy frontend
cd apps/frontend
vercel --prod

# Configure environment variables in Vercel dashboard
# NEXT_PUBLIC_API_URL=https://your-backend-api.com
```

### Railway Deployment

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up
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
