# Durable Objects Setup Guide

This guide provides quick setup instructions for the Durable Objects implementation in the Locuno HDBank backend.

## Quick Start

### 1. Install Dependencies

```bash
cd apps/backend
npm install
```

### 2. Environment Setup

Create a `.dev.vars` file in the `apps/backend` directory:

```bash
# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here

# Optional: Database URL if using external database
DATABASE_URL=your-database-url

# Optional: SMTP Configuration for password reset emails
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your-email@example.com
SMTP_PASS=your-email-password
```

### 3. Development Server

```bash
npm run dev
```

The server will start on `http://localhost:8787`

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/forgot-password` - Request password reset

### User Management

- `GET /api/users/me` - Get user profile
- `PUT /api/users/me` - Update user profile
- `POST /api/users/change-password` - Change password
- `DELETE /api/users/me` - Delete account

## Example Usage

### Register a New User

```bash
curl -X POST http://localhost:8787/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "securepassword123",
    "firstName": "John",
    "lastName": "Doe",
    "phoneNumber": "+1234567890"
  }'
```

### Login

```bash
curl -X POST http://localhost:8787/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "securepassword123"
  }'
```

### Get User Profile (requires JWT token)

```bash
curl -X GET http://localhost:8787/api/users/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

## Deployment

### Production Deployment

1. Set environment variables in Cloudflare Workers dashboard
2. Deploy using Wrangler:

```bash
npm run deploy
```

### Environment Variables for Production

Set these in your Cloudflare Workers dashboard:

- `JWT_SECRET` - Your production JWT secret
- `DATABASE_URL` - Production database URL (if applicable)
- `SMTP_*` - Production email configuration

## File Structure

```
apps/backend/src/
├── durable-objects/
│   └── UserProfileDO.ts          # Main Durable Object class
├── services/
│   └── UserService.ts             # Service layer for user operations
├── routes/
│   ├── auth.ts                    # Authentication routes
│   └── users.ts                   # User management routes
├── config/
│   └── index.ts                   # Configuration management
└── index.ts                       # Main application entry point
```

## Key Features

✅ **User Registration & Authentication**
- Secure password hashing with Web Crypto API
- JWT token generation and validation
- Refresh token management

✅ **User Profile Management**
- Get, update, and delete user profiles
- Password change functionality
- Account deletion

✅ **Session Management**
- Refresh token storage and validation
- Token invalidation on logout
- Password reset token generation

✅ **Security**
- PBKDF2 password hashing with 100,000 iterations
- Secure random salt generation
- JWT token expiration
- Input validation with Zod schemas

## Troubleshooting

### Common Issues

**Issue**: `DurableObjectNamespace` not found
**Solution**: Ensure `wrangler.toml` has correct Durable Objects configuration

**Issue**: JWT verification failed
**Solution**: Check that `JWT_SECRET` is set in environment variables

**Issue**: User not found errors
**Solution**: Verify user exists and email is correct

### Debug Mode

Enable detailed logging:

```bash
export LOG_LEVEL=debug
npm run dev
```

## Testing

Run the test suite:

```bash
npm test
```

## Documentation

For comprehensive documentation, see:
- [Durable Objects Implementation Guide](../../docs/durable-objects.md)
- [API Documentation](../../docs/api.md)
- [Deployment Guide](./DEPLOYMENT.md)

## Support

For issues and questions:
1. Check the troubleshooting section above
2. Review the comprehensive documentation
3. Check existing GitHub issues
4. Create a new issue with detailed information