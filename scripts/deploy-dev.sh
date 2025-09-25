#!/bin/bash
set -e

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log "🚀 Starting Development Deployment..."

# Build applications
log "Building applications..."
pnpm run build

# Start development servers
log "Starting development servers..."
pnpm run dev &

# Wait a moment for servers to start
sleep 5

success "🎉 Development deployment completed!"
log "Development URLs:"
log "- Frontend: http://localhost:3000"
log "- Backend: http://localhost:3001"
log ""
log "Press Ctrl+C to stop the development servers"

# Keep the script running
wait
