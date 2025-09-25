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

# Deploy to staging environment
log "Deploying to staging environment..."

# Deploy frontend to Cloudflare Pages (staging)
cd apps/frontend
if command -v wrangler &> /dev/null; then
    log "Deploying frontend to Cloudflare Pages staging..."
    wrangler pages deploy dist --project-name "${CF_PAGES_PROJECT_NAME:-hdbank-frontend}" --compatibility-date=2025-01-15
    success "Frontend deployed to staging"
else
    error "Wrangler CLI not available"
fi
cd ../..

# Deploy backend to Cloudflare Workers (staging)
cd apps/backend
if command -v wrangler &> /dev/null; then
    log "Deploying backend to Cloudflare Workers staging..."

    # Set staging secrets
    if [ -n "$STAGING_JWT_SECRET" ]; then
        echo "$STAGING_JWT_SECRET" | wrangler secret put JWT_SECRET --env staging
    fi

    if [ -n "$STAGING_DATABASE_URL" ]; then
        echo "$STAGING_DATABASE_URL" | wrangler secret put DATABASE_URL --env staging
    fi

    wrangler deploy --env staging
    success "Backend deployed to staging"
else
    error "Wrangler CLI not available"
fi
cd ../..

# Health checks
log "Performing staging health checks..."
sleep 15

if [ -n "$STAGING_CF_WORKER_URL" ]; then
    if curl -f "$STAGING_CF_WORKER_URL/health" > /dev/null 2>&1; then
        success "Staging backend health check passed"
    else
        error "Staging backend health check failed"
    fi
fi

if [ -n "$STAGING_CF_PAGES_URL" ]; then
    if curl -f "$STAGING_CF_PAGES_URL" > /dev/null 2>&1; then
        success "Staging frontend health check passed"
    else
        error "Staging frontend health check failed"
    fi
fi

success "🎉 Staging deployment completed successfully!"
log "Staging URLs:"
log "- Frontend: $STAGING_CF_PAGES_URL"
log "- Backend: $STAGING_CF_WORKER_URL"
