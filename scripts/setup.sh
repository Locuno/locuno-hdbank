#!/bin/bash
set -e

echo "🚀 Setting up HD Bank Platform..."

# Check prerequisites
echo "Checking prerequisites..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js >= 18.0.0"
    exit 1
fi

if ! command -v pnpm &> /dev/null; then
    echo "❌ pnpm is not installed. Installing pnpm..."
    npm install -g pnpm
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2)
REQUIRED_VERSION="18.0.0"
if [ "$(printf '%s\n' "$REQUIRED_VERSION" "$NODE_VERSION" | sort -V | head -n1)" != "$REQUIRED_VERSION" ]; then
    echo "❌ Node.js version $NODE_VERSION is too old. Please upgrade to >= $REQUIRED_VERSION"
    exit 1
fi

echo "✅ Prerequisites check passed"

# Install dependencies
echo "Installing dependencies..."
pnpm install

# Setup environment files
echo "Setting up environment files..."
if [ ! -f apps/frontend/.env.local ]; then
    cp apps/frontend/.env.example apps/frontend/.env.local
    echo "✅ Frontend environment file created at apps/frontend/.env.local"
    echo "⚠️  Please update the environment variables in apps/frontend/.env.local"
fi

if [ ! -f apps/backend/.env ]; then
    cp apps/backend/.env.example apps/backend/.env
    echo "✅ Backend environment file created at apps/backend/.env"
    echo "⚠️  Please update the environment variables in apps/backend/.env"
fi

# Generate Prisma client
echo "Generating Prisma client..."
cd apps/backend && pnpm run db:generate
cd ../..

# Setup Git hooks (if husky is configured)
if [ -f package.json ] && grep -q "husky" package.json; then
    echo "Setting up Git hooks..."
    pnpm run prepare 2>/dev/null || echo "⚠️  Husky not configured, skipping Git hooks setup"
fi

# Create necessary directories
echo "Creating necessary directories..."
mkdir -p logs
mkdir -p uploads
mkdir -p backups

echo ""
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Update environment variables in:"
echo "   - apps/frontend/.env.local"
echo "   - apps/backend/.env"
echo "2. Setup your PostgreSQL database"
echo "3. Run 'pnpm run db:migrate' to setup database schema"
echo "4. Run 'pnpm run dev' to start development servers"
echo ""
echo "🎉 Happy coding!"
