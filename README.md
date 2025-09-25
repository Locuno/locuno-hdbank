# Locuno HD Bank Digital Platform

A modern, secure, and scalable digital banking platform built with cutting-edge technologies.

## 🏗️ Architecture

This is a monorepo containing:

- **Frontend**: Next.js application with static export
- **Backend**: Node.js/Express API server
- **Shared Packages**: Common utilities and types
- **Documentation**: Comprehensive guides and API docs

## 🚀 Quick Start

### Prerequisites

- Node.js >= 18.0.0
- pnpm >= 8.0.0

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd locuno-hdbank

# Install dependencies
pnpm install

# Setup development environment
pnpm run setup

# Start development servers
pnpm run dev
```

## 📁 Project Structure

```
locuno-hdbank/
├── apps/
│   ├── frontend/          # Next.js frontend application
│   └── backend/           # Express.js backend API
├── packages/
│   ├── shared/            # Shared utilities and types
│   ├── ui/                # Reusable UI components
│   └── config/            # Shared configuration
├── docs/                  # Documentation
├── scripts/               # Deployment and utility scripts
├── config/                # Environment configurations
└── deployment.md          # Deployment guide
```

## 🛠️ Development

### Available Scripts

- `pnpm run dev` - Start all development servers
- `pnpm run build` - Build all applications
- `pnpm run test` - Run all tests
- `pnpm run lint` - Lint all code
- `pnpm run clean` - Clean all build artifacts

### Environment Setup

1. Copy environment files:
   ```bash
   cp apps/frontend/.env.example apps/frontend/.env.local
   cp apps/backend/.env.example apps/backend/.env
   ```

2. Configure your environment variables
3. Run database migrations: `pnpm run db:migrate`
4. Seed the database: `pnpm run db:seed`

## 🚢 Deployment

See [deployment.md](./deployment.md) for detailed deployment instructions.

## 📚 Documentation

- [API Documentation](./docs/api/README.md)
- [Frontend Guide](./docs/frontend/README.md)
- [Backend Guide](./docs/backend/README.md)
- [Deployment Guide](./deployment.md)

## 🔒 Security

This application handles sensitive financial data. Please review our security guidelines in [docs/security/README.md](./docs/security/README.md).

## 🤝 Contributing

Please read our contributing guidelines in [CONTRIBUTING.md](./CONTRIBUTING.md).

## 📄 License

This project is proprietary software owned by HD Bank.
