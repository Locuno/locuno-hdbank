#!/bin/bash

# Cloudflare Workers Deployment Script for HDBank Backend
# This script handles authentication, environment setup, and deployment

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_NAME="hdbank-backend"
DEFAULT_ENV="staging"

# Function to print colored output
print_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if wrangler is installed
check_wrangler() {
    if ! command -v wrangler &> /dev/null; then
        print_error "Wrangler CLI is not installed. Installing..."
        npm install -g wrangler
    else
        print_success "Wrangler CLI is available"
    fi
}

# Function to check authentication
check_auth() {
    print_info "Checking Cloudflare authentication..."
    if ! wrangler whoami &> /dev/null; then
        print_warning "Not authenticated with Cloudflare. Starting login process..."
        wrangler login
    else
        print_success "Already authenticated with Cloudflare"
        wrangler whoami
    fi
}

# Function to setup environment variables and secrets
setup_secrets() {
    local env=$1
    print_info "Setting up secrets for environment: $env"
    
    # Check if .env file exists
    if [ -f ".env.${env}" ]; then
        print_info "Found .env.${env} file. Setting up secrets..."
        
        # Read secrets from .env file and set them
        while IFS='=' read -r key value; do
            # Skip comments and empty lines
            [[ $key =~ ^#.*$ ]] && continue
            [[ -z $key ]] && continue
            
            # Remove quotes from value if present
            value=$(echo $value | sed 's/^"\|"$//g')
            
            # Set secret for the environment
            if [[ $key == *"SECRET"* ]] || [[ $key == *"PASSWORD"* ]] || [[ $key == *"KEY"* ]] || [[ $key == "DATABASE_URL" ]]; then
                print_info "Setting secret: $key"
                echo "$value" | wrangler secret put $key --env $env
            fi
        done < ".env.${env}"
    else
        print_warning "No .env.${env} file found. You may need to set secrets manually."
        print_info "Example secrets you might need to set:"
        echo "  - JWT_SECRET"
        echo "  - DATABASE_URL"
        echo "  - ENCRYPTION_KEY"
        print_info "Use: wrangler secret put SECRET_NAME --env $env"
    fi
}

# Function to build the project
build_project() {
    print_info "Building the project..."
    
    # Clean previous build
    npm run clean
    
    # Generate Prisma client if needed
    if [ -f "prisma/schema.prisma" ]; then
        print_info "Generating Prisma client..."
        npm run db:generate
    fi
    
    # Build TypeScript
    npm run build
    
    print_success "Build completed successfully"
}

# Function to deploy to Cloudflare Workers
deploy_worker() {
    local env=$1
    print_info "Deploying to Cloudflare Workers (environment: $env)..."
    
    if [ "$env" = "production" ]; then
        print_warning "Deploying to PRODUCTION environment!"
        read -p "Are you sure you want to continue? (y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            print_info "Deployment cancelled."
            exit 0
        fi
    fi
    
    # Deploy using wrangler
    wrangler deploy --env $env
    
    print_success "Deployment completed successfully!"
    
    # Show deployment info
    print_info "Getting deployment information..."
    wrangler deployments list --env $env
}

# Function to run post-deployment checks
post_deployment_checks() {
    local env=$1
    print_info "Running post-deployment checks..."
    
    # Get the worker URL
    local worker_url
    if [ "$env" = "production" ]; then
        worker_url="https://hdbank-backend-prod.your-subdomain.workers.dev"
    else
        worker_url="https://hdbank-backend-staging.your-subdomain.workers.dev"
    fi
    
    print_info "Testing health endpoint..."
    if curl -f "$worker_url/health" > /dev/null 2>&1; then
        print_success "Health check passed!"
    else
        print_warning "Health check failed. Please verify the deployment."
    fi
    
    print_info "Worker URL: $worker_url"
}

# Function to show usage
show_usage() {
    echo "Usage: $0 [OPTIONS]"
    echo ""
    echo "Options:"
    echo "  -e, --env ENV        Environment to deploy to (staging|production) [default: staging]"
    echo "  -s, --setup-only     Only setup secrets, don't deploy"
    echo "  -d, --deploy-only    Only deploy, skip setup"
    echo "  -h, --help          Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0                   # Deploy to staging"
    echo "  $0 -e production     # Deploy to production"
    echo "  $0 -s -e staging     # Only setup secrets for staging"
    echo "  $0 -d -e production  # Only deploy to production"
}

# Main deployment function
main() {
    local env="$DEFAULT_ENV"
    local setup_only=false
    local deploy_only=false
    
    # Parse command line arguments
    while [[ $# -gt 0 ]]; do
        case $1 in
            -e|--env)
                env="$2"
                shift 2
                ;;
            -s|--setup-only)
                setup_only=true
                shift
                ;;
            -d|--deploy-only)
                deploy_only=true
                shift
                ;;
            -h|--help)
                show_usage
                exit 0
                ;;
            *)
                print_error "Unknown option: $1"
                show_usage
                exit 1
                ;;
        esac
    done
    
    # Validate environment
    if [[ "$env" != "staging" && "$env" != "production" ]]; then
        print_error "Invalid environment: $env. Must be 'staging' or 'production'"
        exit 1
    fi
    
    print_info "Starting deployment process for environment: $env"
    
    # Check prerequisites
    check_wrangler
    check_auth
    
    if [ "$deploy_only" = false ]; then
        setup_secrets "$env"
    fi
    
    if [ "$setup_only" = false ]; then
        build_project
        deploy_worker "$env"
        post_deployment_checks "$env"
    fi
    
    print_success "Deployment process completed!"
}

# Run main function with all arguments
main "$@"