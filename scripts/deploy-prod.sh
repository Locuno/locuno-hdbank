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

# Deploy frontend
log "Deploying frontend..."
cd apps/frontend

# Check if AWS CLI is available for S3 deployment
if command -v aws &> /dev/null && [ -n "$S3_BUCKET" ]; then
    log "Deploying to S3 bucket: $S3_BUCKET"
    if aws s3 sync out/ "s3://$S3_BUCKET" --delete; then
        success "Frontend deployed to S3"
        
        # Invalidate CloudFront cache if distribution ID is set
        if [ -n "$CLOUDFRONT_DISTRIBUTION_ID" ]; then
            log "Invalidating CloudFront cache..."
            aws cloudfront create-invalidation --distribution-id "$CLOUDFRONT_DISTRIBUTION_ID" --paths "/*"
            success "CloudFront cache invalidated"
        fi
    else
        error "Frontend deployment to S3 failed"
    fi
else
    warning "AWS CLI not available or S3_BUCKET not set, skipping S3 deployment"
fi

cd ../..

# Deploy backend
log "Deploying backend..."
cd apps/backend

# Docker deployment
if command -v docker &> /dev/null; then
    log "Building Docker image..."
    if docker build -t hdbank-backend:latest .; then
        success "Docker image built successfully"
        
        # Tag and push to registry if ECR_REPOSITORY is set
        if [ -n "$ECR_REPOSITORY" ]; then
            log "Pushing to ECR repository: $ECR_REPOSITORY"
            docker tag hdbank-backend:latest "$ECR_REPOSITORY:latest"
            docker tag hdbank-backend:latest "$ECR_REPOSITORY:$(date +%Y%m%d_%H%M%S)"
            
            if docker push "$ECR_REPOSITORY:latest" && docker push "$ECR_REPOSITORY:$(date +%Y%m%d_%H%M%S)"; then
                success "Docker image pushed to ECR"
                
                # Update ECS service if configured
                if [ -n "$ECS_CLUSTER" ] && [ -n "$ECS_SERVICE" ]; then
                    log "Updating ECS service..."
                    aws ecs update-service --cluster "$ECS_CLUSTER" --service "$ECS_SERVICE" --force-new-deployment
                    success "ECS service updated"
                fi
            else
                error "Failed to push Docker image to ECR"
            fi
        fi
    else
        error "Docker image build failed"
    fi
else
    warning "Docker not available, skipping containerized deployment"
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

# Check backend health
if [ -n "$BACKEND_URL" ]; then
    if curl -f "$BACKEND_URL/health" > /dev/null 2>&1; then
        success "Backend health check passed"
    else
        error "Backend health check failed"
    fi
fi

# Check frontend
if [ -n "$FRONTEND_URL" ]; then
    if curl -f "$FRONTEND_URL" > /dev/null 2>&1; then
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
