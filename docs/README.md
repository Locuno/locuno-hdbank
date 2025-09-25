# Documentation

This directory contains comprehensive documentation for the HD Bank Digital Platform.

## 📚 Available Documentation

### Setup and Deployment
- [Cloudflare Setup Guide](./cloudflare-setup.md) - Complete guide for deploying to Cloudflare Pages and Workers
- [Deployment Guide](../deployment.md) - Main deployment documentation

### Architecture and Development
- [API Documentation](./api/README.md) - REST API endpoints and schemas
- [Frontend Guide](./frontend/README.md) - Frontend development guide
- [Backend Guide](./backend/README.md) - Backend development guide
- [Database Schema](./database/README.md) - Database design and migrations

### Security and Operations
- [Security Guidelines](./security/README.md) - Security best practices and policies
- [Monitoring Guide](./monitoring/README.md) - Application monitoring and alerting
- [Troubleshooting](./troubleshooting/README.md) - Common issues and solutions

## 🚀 Quick Start

1. **Development Setup**
   ```bash
   pnpm run setup
   pnpm run dev
   ```

2. **Cloudflare Deployment**
   ```bash
   # Install Wrangler CLI
   npm install -g wrangler
   
   # Login to Cloudflare
   wrangler login
   
   # Deploy everything
   pnpm run cf:deploy:all
   ```

3. **Environment Configuration**
   - Copy `.env.example` files to `.env` files
   - Update environment variables
   - Set Cloudflare secrets using `wrangler secret put`

## 📖 Documentation Standards

When contributing to documentation:

1. **Use clear, concise language**
2. **Include code examples** where applicable
3. **Keep documentation up-to-date** with code changes
4. **Use proper markdown formatting**
5. **Include diagrams** using Mermaid when helpful

## 🔗 External Resources

- [Cloudflare Workers Documentation](https://developers.cloudflare.com/workers/)
- [Cloudflare Pages Documentation](https://developers.cloudflare.com/pages/)
- [Hono Framework Documentation](https://hono.dev/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)

## 📞 Support

For questions or issues:
- Check the [Troubleshooting Guide](./troubleshooting/README.md)
- Review existing documentation
- Contact the development team

---

**Last Updated**: 2024-01-15
**Maintained by**: HD Bank Development Team
