#!/bin/bash
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
BACKUP_DIR="./backups"
LOG_FILE="./logs/deploy-$(date +%Y%m%d_%H%M%S).log"

# Create directories if they don't exist
mkdir -p logs backups

# Logging function
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1" | tee -a "$LOG_FILE"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1" | tee -a "$LOG_FILE"
    exit 1
}

warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1" | tee -a "$LOG_FILE"
}

success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1" | tee -a "$LOG_FILE"
}

# Start deployment
log "🚀 Starting Production Deployment..."

# Check if we're on the main branch
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "main" ] && [ "$CURRENT_BRANCH" != "master" ]; then
    warning "You're not on the main/master branch. Current branch: $CURRENT_BRANCH"
    read -p "Do you want to continue? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        error "Deployment cancelled"
    fi
fi

# Check for uncommitted changes
if [ -n "$(git status --porcelain)" ]; then
    error "You have uncommitted changes. Please commit or stash them before deploying."
fi

# Pre-deployment checks
log "Running pre-deployment checks..."

# Check environment variables
if [ ! -f apps/backend/.env ]; then
    error "Backend environment file not found. Please create apps/backend/.env"
fi

if [ ! -f apps/frontend/.env.local ]; then
    error "Frontend environment file not found. Please create apps/frontend/.env.local"
fi

# Run linting
log "Running linting..."
if ! pnpm run lint; then
    error "Linting failed. Please fix the issues before deploying."
fi

# Run tests (if available)
log "Running tests..."
if pnpm run test --if-present; then
    success "Tests passed"
else
    warning "Tests failed or not available"
    read -p "Do you want to continue with deployment? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        error "Deployment cancelled due to test failures"
    fi
fi

# Build applications
log "Building applications..."
if ! pnpm run build; then
    error "Build failed. Please fix the issues before deploying."
fi

success "Pre-deployment checks completed"

# Database backup
log "Creating database backup..."
if [ -n "$DATABASE_URL" ]; then
    BACKUP_FILE="$BACKUP_DIR/backup_$(date +%Y%m%d_%H%M%S).sql"
    if pg_dump "$DATABASE_URL" > "$BACKUP_FILE"; then
        success "Database backup created: $BACKUP_FILE"
    else
        error "Database backup failed"
    fi
else
    warning "DATABASE_URL not set, skipping database backup"
fi

# Deploy frontend to Cloudflare Pages
log "Deploying frontend to Cloudflare Pages..."
cd apps/frontend

# Check if Wrangler CLI is available
if command -v wrangler &> /dev/null; then
    log "Deploying to Cloudflare Pages: $CF_PAGES_PROJECT_NAME"
    if wrangler pages deploy out --project-name "${CF_PAGES_PROJECT_NAME:-hdbank-frontend}" --compatibility-date=2024-01-15; then
        success "Frontend deployed to Cloudflare Pages"
    else
        error "Frontend deployment to Cloudflare Pages failed"
    fi
else
    error "Wrangler CLI not available. Please install with: npm install -g wrangler"
fi

cd ../..

# Deploy backend to Cloudflare Workers
log "Deploying backend to Cloudflare Workers..."
cd apps/backend

# Check if Wrangler CLI is available
if command -v wrangler &> /dev/null; then
    log "Deploying to Cloudflare Workers..."

    # Set secrets if they exist as environment variables
    if [ -n "$JWT_SECRET" ]; then
        echo "$JWT_SECRET" | wrangler secret put JWT_SECRET --env production
    fi

    if [ -n "$DATABASE_URL" ]; then
        echo "$DATABASE_URL" | wrangler secret put DATABASE_URL --env production
    fi

    # Deploy the worker
    if wrangler deploy --env production; then
        success "Backend deployed to Cloudflare Workers"
    else
        error "Backend deployment to Cloudflare Workers failed"
    fi
else
    error "Wrangler CLI not available. Please install with: npm install -g wrangler"
fi

cd ../..

# Run database migrations
log "Running database migrations..."
cd apps/backend
if NODE_ENV=production pnpm run db:migrate; then
    success "Database migrations completed"
else
    error "Database migrations failed"
fi
cd ../..

# Health checks
log "Performing health checks..."
sleep 10  # Wait for services to start

# Check backend health (Cloudflare Workers)
if [ -n "$CF_WORKER_URL" ]; then
    if curl -f "$CF_WORKER_URL/health" > /dev/null 2>&1; then
        success "Backend health check passed"
    else
        error "Backend health check failed"
    fi
fi

# Check frontend (Cloudflare Pages)
if [ -n "$CF_PAGES_URL" ]; then
    if curl -f "$CF_PAGES_URL" > /dev/null 2>&1; then
        success "Frontend health check passed"
    else
        error "Frontend health check failed"
    fi
fi

# Deployment summary
log "📊 Deployment Summary:"
log "- Branch: $CURRENT_BRANCH"
log "- Commit: $(git rev-parse --short HEAD)"
log "- Timestamp: $(date)"
log "- Log file: $LOG_FILE"

success "🎉 Production deployment completed successfully!"

# Optional: Send notification (Slack, email, etc.)
if [ -n "$SLACK_WEBHOOK_URL" ]; then
    curl -X POST -H 'Content-type: application/json' \
        --data "{\"text\":\"🚀 HD Bank production deployment completed successfully!\nBranch: $CURRENT_BRANCH\nCommit: $(git rev-parse --short HEAD)\"}" \
        "$SLACK_WEBHOOK_URL"
fi

log "Deployment process finished. Check the logs for details: $LOG_FILE"
