# Durable Objects Implementation for User Management

This document provides comprehensive documentation for the Durable Objects implementation used for user profile management, authentication, and session handling in the Locuno HDBank application.

## Overview

Durable Objects provide a serverless, stateful computing environment that ensures strong consistency and global uniqueness. Our implementation uses Durable Objects to manage user profiles, authentication data, and session tokens with guaranteed consistency across all operations.

## Architecture

### Components

1. **UserProfileDO** - The main Durable Object class handling user data
2. **UserService** - Service layer for interacting with Durable Objects
3. **Authentication Routes** - API endpoints for user authentication
4. **User Routes** - API endpoints for user profile management

### Data Flow

```
Client Request → API Routes → UserService → UserProfileDO → Cloudflare Storage
```

## UserProfileDO Class

### Location
`apps/backend/src/durable-objects/UserProfileDO.ts`

### Key Features

- **User Registration**: Create new user accounts with encrypted passwords
- **Authentication**: Verify user credentials using Web Crypto API
- **Profile Management**: Update and retrieve user profile information
- **Session Management**: Handle refresh tokens and session invalidation
- **Password Reset**: Generate and validate password reset tokens

### Data Schemas

#### UserProfile Schema
```typescript
const UserProfileSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  firstName: z.string(),
  lastName: z.string(),
  phoneNumber: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});
```

#### AuthData Schema
```typescript
const AuthDataSchema = z.object({
  userId: z.string(),
  email: z.string().email(),
  passwordHash: z.string(),
  refreshTokens: z.array(z.object({
    token: z.string(),
    expiresAt: z.string(),
  })),
  passwordResetToken: z.string().optional(),
  passwordResetExpires: z.string().optional(),
});
```

### API Endpoints

The UserProfileDO handles the following internal endpoints:

#### POST /create-user
Creates a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword",
  "firstName": "John",
  "lastName": "Doe",
  "phoneNumber": "+1234567890"
}
```

**Response:**
```json
{
  "success": true,
  "userId": "user-uuid"
}
```

#### POST /authenticate
Authenticates a user with email and password.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "user-uuid",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe"
  }
}
```

#### POST /get-profile
Retrieves user profile information.

#### POST /update-profile
Updates user profile information.

#### POST /change-password
Changes user password after validating current password.

#### POST /refresh-token
Stores a new refresh token for the user.

#### POST /validate-refresh-token
Validates a refresh token and returns user data.

#### POST /invalidate-token
Invalidates a specific refresh token.

#### POST /forgot-password
Generates a password reset token.

#### POST /delete-user
Deletes a user account and all associated data.

## UserService Class

### Location
`apps/backend/src/services/UserService.ts`

### Purpose
Provides a clean interface for interacting with UserProfileDO from the application routes.

### Methods

- `createUser(userData)` - Create a new user
- `authenticateUser(email, password)` - Authenticate user credentials
- `getUserProfile(email)` - Get user profile data
- `updateUserProfile(email, updates)` - Update user profile
- `changePassword(email, currentPassword, newPassword)` - Change user password
- `storeRefreshToken(email, token, expiresAt, invalidateOld?)` - Store refresh token
- `validateRefreshToken(token)` - Validate refresh token
- `invalidateRefreshToken(token)` - Invalidate refresh token
- `generatePasswordResetToken(email)` - Generate password reset token
- `deleteUser(email)` - Delete user account

## API Routes

### Authentication Routes (`/api/auth`)

#### POST /api/auth/register
Register a new user account.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "securepassword",
  "firstName": "John",
  "lastName": "Doe",
  "phoneNumber": "+1234567890"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "accessToken": "jwt-token",
    "refreshToken": "refresh-token",
    "user": {
      "id": "user-uuid",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe"
    }
  }
}
```

#### POST /api/auth/login
Authenticate user and return tokens.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "accessToken": "jwt-token",
    "refreshToken": "refresh-token",
    "user": {
      "id": "user-uuid",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe"
    }
  }
}
```

#### POST /api/auth/logout
Logout user and invalidate refresh token.

#### POST /api/auth/refresh
Refresh access token using refresh token.

#### POST /api/auth/forgot-password
Generate password reset token.

### User Routes (`/api/users`)

All user routes require JWT authentication.

#### GET /api/users/me
Get current user profile.

**Response:**
```json
{
  "success": true,
  "message": "Profile retrieved successfully",
  "data": {
    "user": {
      "id": "user-uuid",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "phoneNumber": "+1234567890"
    }
  }
}
```

#### PUT /api/users/me
Update current user profile.

**Request:**
```json
{
  "firstName": "Jane",
  "lastName": "Smith",
  "phoneNumber": "+0987654321"
}
```

#### POST /api/users/change-password
Change user password.

**Request:**
```json
{
  "currentPassword": "oldpassword",
  "newPassword": "newpassword"
}
```

#### DELETE /api/users/me
Delete user account.

## Configuration

### Wrangler Configuration

The `wrangler.toml` file includes Durable Objects configuration:

```toml
[[durable_objects.bindings]]
name = "USER_PROFILE_DO"
class_name = "UserProfileDO"
script_name = "locuno-hdbank-backend"
```

### Environment Variables

Required environment variables:
- `JWT_SECRET` - Secret key for JWT token signing
- `DATABASE_URL` - Database connection string (if using external DB)
- `SMTP_*` - Email configuration for password reset

## Security Features

### Password Security
- Uses Web Crypto API for password hashing
- PBKDF2 with SHA-256 and 100,000 iterations
- Cryptographically secure random salt generation

### Token Security
- JWT tokens with configurable expiration
- Refresh tokens stored securely in Durable Objects
- Token invalidation on logout
- Password reset tokens with expiration

### Data Protection
- All user data stored in Durable Objects with strong consistency
- Automatic data encryption at rest
- Secure data transmission over HTTPS

## Error Handling

The implementation includes comprehensive error handling:

- **Validation Errors**: Input validation using Zod schemas
- **Authentication Errors**: Invalid credentials, expired tokens
- **Authorization Errors**: Missing or invalid JWT tokens
- **Server Errors**: Internal server errors with proper logging

## Testing

### Local Development

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Test authentication endpoints:
   ```bash
   # Register a new user
   curl -X POST http://localhost:8787/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","password":"password123","firstName":"Test","lastName":"User"}'
   
   # Login
   curl -X POST http://localhost:8787/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","password":"password123"}'
   ```

### Production Testing

Before deploying to production:

1. Test all authentication flows
2. Verify token refresh mechanism
3. Test password reset functionality
4. Validate user profile operations
5. Test error scenarios

## Deployment

### Prerequisites

1. Cloudflare Workers account
2. Wrangler CLI installed and configured
3. Environment variables set in Cloudflare dashboard

### Deployment Steps

1. Build the application:
   ```bash
   npm run build
   ```

2. Deploy to Cloudflare Workers:
   ```bash
   npm run deploy
   ```

3. Verify Durable Objects are properly configured in Cloudflare dashboard

## Monitoring and Logging

- All operations are logged with appropriate log levels
- Error tracking for authentication failures
- Performance monitoring for Durable Objects operations
- Token usage and refresh patterns

## Best Practices

1. **Always validate input data** using Zod schemas
2. **Handle errors gracefully** with proper HTTP status codes
3. **Use strong passwords** with minimum requirements
4. **Implement rate limiting** for authentication endpoints
5. **Monitor token usage** to detect suspicious activity
6. **Regular security audits** of authentication flows

## Troubleshooting

### Common Issues

1. **Durable Objects not found**: Check wrangler.toml configuration
2. **JWT verification failed**: Verify JWT_SECRET environment variable
3. **Password hash mismatch**: Ensure consistent hashing algorithm
4. **Token expired**: Check token expiration settings

### Debug Mode

Enable debug logging by setting `LOG_LEVEL=debug` in environment variables.

## Future Enhancements

- Multi-factor authentication (MFA)
- OAuth integration
- User role and permission management
- Account lockout after failed attempts
- Password strength requirements
- Email verification for new accounts