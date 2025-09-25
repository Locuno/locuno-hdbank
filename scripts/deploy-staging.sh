#!/bin/bash
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
LOG_FILE="./logs/deploy-staging-$(date +%Y%m%d_%H%M%S).log"

# Create directories if they don't exist
mkdir -p logs

# Logging function
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1" | tee -a "$LOG_FILE"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1" | tee -a "$LOG_FILE"
    exit 1
}

success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1" | tee -a "$LOG_FILE"
}

# Start staging deployment
log "🚀 Starting Staging Deployment..."

# Pre-deployment checks
log "Running pre-deployment checks..."

# Run linting
log "Running linting..."
if ! pnpm run lint; then
    error "Linting failed. Please fix the issues before deploying."
fi

# Build applications
log "Building applications..."
if ! pnpm run build; then
    error "Build failed. Please fix the issues before deploying."
fi

success "Pre-deployment checks completed"

# Deploy to staging
log "Deploying to staging environment..."

# Deploy frontend to staging
cd apps/frontend
if [ -n "$STAGING_S3_BUCKET" ]; then
    log "Deploying frontend to staging S3 bucket: $STAGING_S3_BUCKET"
    aws s3 sync out/ "s3://$STAGING_S3_BUCKET" --delete
    
    if [ -n "$STAGING_CLOUDFRONT_DISTRIBUTION_ID" ]; then
        aws cloudfront create-invalidation --distribution-id "$STAGING_CLOUDFRONT_DISTRIBUTION_ID" --paths "/*"
    fi
fi
cd ..

# Deploy backend to staging
cd backend
if [ -n "$STAGING_ECR_REPOSITORY" ]; then
    log "Building and pushing backend to staging..."
    docker build -t hdbank-backend-staging:latest .
    docker tag hdbank-backend-staging:latest "$STAGING_ECR_REPOSITORY:latest"
    docker push "$STAGING_ECR_REPOSITORY:latest"
    
    if [ -n "$STAGING_ECS_CLUSTER" ] && [ -n "$STAGING_ECS_SERVICE" ]; then
        aws ecs update-service --cluster "$STAGING_ECS_CLUSTER" --service "$STAGING_ECS_SERVICE" --force-new-deployment
    fi
fi
cd ..

# Health checks
log "Performing staging health checks..."
sleep 15

if [ -n "$STAGING_BACKEND_URL" ]; then
    if curl -f "$STAGING_BACKEND_URL/health" > /dev/null 2>&1; then
        success "Staging backend health check passed"
    else
        error "Staging backend health check failed"
    fi
fi

if [ -n "$STAGING_FRONTEND_URL" ]; then
    if curl -f "$STAGING_FRONTEND_URL" > /dev/null 2>&1; then
        success "Staging frontend health check passed"
    else
        error "Staging frontend health check failed"
    fi
fi

success "🎉 Staging deployment completed successfully!"
log "Staging URLs:"
log "- Frontend: $STAGING_FRONTEND_URL"
log "- Backend: $STAGING_BACKEND_URL"
