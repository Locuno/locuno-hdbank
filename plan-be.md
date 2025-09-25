# Backend Architecture Plan - Locuno HD Bank

## Overview

This document outlines the complete backend architecture for the Locuno HD Bank digital platform, including all Durable Objects, API endpoints, services, and data flows.

## Technology Stack

- **Runtime**: Cloudflare Workers
- **Framework**: Hono.js
- **State Management**: Cloudflare Durable Objects
- **Authentication**: JWT tokens with refresh token mechanism
- **Validation**: Zod schemas
- **Security**: Web Crypto API for password hashing

## Architecture Components

### 1. Durable Objects

#### UserProfileDO
**Location**: `apps/backend/src/durable-objects/UserProfileDO.ts`

**Purpose**: Manages user profiles, authentication data, and session tokens with strong consistency.

**Data Schemas**:
```typescript
// User Profile Schema
const UserProfileSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  firstName: z.string(),
  lastName: z.string(),
  phoneNumber: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

// Authentication Data Schema
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

**Internal Endpoints**:
- `POST /create-user` - Create new user account
- `POST /authenticate` - Authenticate user credentials
- `POST /get-profile` - Retrieve user profile
- `POST /update-profile` - Update user profile
- `POST /change-password` - Change user password
- `POST /refresh-token` - Store refresh token
- `POST /validate-refresh-token` - Validate refresh token
- `POST /invalidate-token` - Invalidate refresh token
- `POST /forgot-password` - Generate password reset token
- `POST /delete-user` - Delete user account

**Security Features**:
- PBKDF2 password hashing with SHA-256
- 100,000 iterations for password derivation
- Cryptographically secure random salt generation
- Refresh token management with expiration

### 2. Services Layer

#### UserService
**Location**: `apps/backend/src/services/UserService.ts`

**Purpose**: Provides clean interface for interacting with UserProfileDO from API routes.

**Methods**:
- `createUser(userData)` - Create new user
- `authenticateUser(email, password)` - Authenticate credentials
- `getUserProfile(email)` - Get user profile
- `updateUserProfile(email, updates)` - Update profile
- `changePassword(email, currentPassword, newPassword)` - Change password
- `storeRefreshToken(email, token, expiresAt, invalidateOld?)` - Store refresh token
- `validateRefreshToken(token)` - Validate refresh token
- `invalidateRefreshToken(token)` - Invalidate refresh token
- `generatePasswordResetToken(email)` - Generate reset token
- `deleteUser(email)` - Delete user account

## API Endpoints

### Authentication Routes (`/api/auth`)

#### POST /api/auth/register
**Purpose**: Register new user account

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "securepassword",
  "firstName": "John",
  "lastName": "Doe",
  "phoneNumber": "+1234567890"
}
```

**Response**:
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
**Purpose**: Authenticate user and return tokens

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

**Response**:
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
**Purpose**: Logout user and invalidate refresh token

**Request Body**:
```json
{
  "refreshToken": "refresh-token"
}
```

#### POST /api/auth/refresh
**Purpose**: Refresh access token using refresh token

**Request Body**:
```json
{
  "refreshToken": "refresh-token"
}
```

#### POST /api/auth/forgot-password
**Purpose**: Generate password reset token

**Request Body**:
```json
{
  "email": "user@example.com"
}
```

### User Management Routes (`/api/users`)

**Authentication**: All routes require JWT authentication

#### GET /api/users/me
**Purpose**: Get current user profile

**Response**:
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
**Purpose**: Update current user profile

**Request Body**:
```json
{
  "firstName": "Jane",
  "lastName": "Smith",
  "phoneNumber": "+0987654321"
}
```

#### POST /api/users/change-password
**Purpose**: Change user password

**Request Body**:
```json
{
  "currentPassword": "oldpassword",
  "newPassword": "newpassword"
}
```

#### DELETE /api/users/me
**Purpose**: Delete user account

### Account Management Routes (`/api/accounts`)

**Status**: Implementation pending - TODO endpoints
**Authentication**: JWT required

#### GET /api/accounts
**Purpose**: Get all user accounts

**Response Structure**:
```json
{
  "success": true,
  "data": [
    {
      "id": "acc-123",
      "accountNumber": "1234567890",
      "accountType": "CHECKING",
      "balance": 1500.00,
      "currency": "USD",
      "status": "ACTIVE"
    }
  ]
}
```

#### GET /api/accounts/:accountId
**Purpose**: Get specific account details

#### GET /api/accounts/:accountId/balance
**Purpose**: Get account balance

#### GET /api/accounts/:accountId/statement
**Purpose**: Get account statement

### Transaction Routes (`/api/transactions`)

**Status**: Implementation pending - TODO endpoints
**Authentication**: JWT required

#### GET /api/transactions
**Purpose**: Get transaction history with pagination

**Query Parameters**:
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 20)
- `accountId` - Filter by account ID

**Response Structure**:
```json
{
  "success": true,
  "data": [
    {
      "id": "txn-123",
      "fromAccountId": "acc-123",
      "toAccountId": "acc-456",
      "amount": 100.00,
      "currency": "USD",
      "type": "TRANSFER",
      "status": "COMPLETED",
      "description": "Transfer to savings",
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 1,
    "totalPages": 1,
    "hasNext": false,
    "hasPrev": false
  }
}
```

#### GET /api/transactions/:transactionId
**Purpose**: Get specific transaction details

#### POST /api/transactions/transfer
**Purpose**: Create money transfer

**Request Body** (using TransferRequestSchema):
```json
{
  "fromAccountId": "acc-123",
  "toAccountId": "acc-456",
  "amount": 100.00,
  "currency": "USD",
  "description": "Transfer description"
}
```

#### GET /api/transactions/transfer/:transferId/status
**Purpose**: Get transfer status

#### POST /api/transactions/:transactionId/cancel
**Purpose**: Cancel transaction

### Health Check Routes (`/api/health`)

#### GET /api/health
**Purpose**: Basic health check

**Response**:
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00Z",
  "service": "hdbank-backend",
  "version": "1.0.0",
  "environment": "development"
}
```

#### GET /api/health/detailed
**Purpose**: Detailed health check with system status

**Response**:
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00Z",
  "checks": {
    "database": "healthy",
    "cache": "healthy",
    "external_apis": "healthy"
  }
}
```

#### GET /health
**Purpose**: Load balancer health check

## Configuration

### Wrangler Configuration (`wrangler.toml`)

```toml
[[durable_objects.bindings]]
name = "USER_PROFILE_DO"
class_name = "UserProfileDO"
script_name = "locuno-hdbank-backend"
```

### Environment Variables

**Required**:
- `JWT_SECRET` - JWT signing secret
- `DATABASE_URL` - Database connection string

**Optional**:
- `ENVIRONMENT` - Environment name
- `SMTP_HOST` - Email server host
- `SMTP_PORT` - Email server port
- `SMTP_USER` - Email username
- `SMTP_PASS` - Email password

### Bindings Type Definition

```typescript
type Bindings = {
  CACHE?: any; // KV namespace for caching
  USER_PROFILE_DO: any; // Durable Object namespace
  JWT_SECRET?: string;
  DATABASE_URL?: string;
};
```

## Data Flow Architecture

### Authentication Flow
```
Client → POST /api/auth/login → UserService → UserProfileDO → Validate Credentials → Generate JWT + Refresh Token → Response
```

### User Profile Management Flow
```
Client → JWT Middleware → API Route → UserService → UserProfileDO → Storage Operation → Response
```

### Token Refresh Flow
```
Client → POST /api/auth/refresh → UserService → UserProfileDO → Validate Refresh Token → Generate New JWT → Response
```

## Security Implementation

### Password Security
- **Algorithm**: PBKDF2 with SHA-256
- **Iterations**: 100,000
- **Salt**: Cryptographically secure random generation
- **Storage**: Only hashed passwords stored

### Token Security
- **JWT**: Configurable expiration (default 24 hours)
- **Refresh Tokens**: Stored in Durable Objects with expiration
- **Token Invalidation**: On logout and password change
- **Reset Tokens**: UUID-based with expiration

### Middleware Stack
1. **Security Headers**: `secureHeaders()` middleware
2. **CORS**: Dynamic configuration per environment
3. **Logging**: Request/response logging
4. **JWT Authentication**: Protected route validation
5. **Input Validation**: Zod schema validation
6. **Error Handling**: Centralized error handling

## Implementation Status

### ✅ Completed
- UserProfileDO Durable Object
- UserService layer
- Authentication routes (`/api/auth/*`)
- User management routes (`/api/users/*`)
- Health check routes (`/api/health/*`)
- JWT middleware
- Password hashing with Web Crypto API
- Refresh token management
- Configuration management
- Error handling middleware

### 🚧 Pending Implementation
- Account management routes (`/api/accounts/*`)
- Transaction routes (`/api/transactions/*`)
- Account Durable Object (future)
- Transaction Durable Object (future)
- Email service integration
- Rate limiting middleware
- Audit logging
- Multi-factor authentication

## Future Enhancements

### Additional Durable Objects
1. **AccountDO** - Account management and balance tracking
2. **TransactionDO** - Transaction processing and history
3. **NotificationDO** - Real-time notifications
4. **AuditDO** - Audit trail and compliance logging

### Enhanced Security
- Multi-factor authentication (MFA)
- OAuth integration
- Account lockout policies
- Password strength requirements
- Email verification
- Device fingerprinting

### Performance Optimizations
- KV namespace for caching
- Connection pooling
- Query optimization
- CDN integration
- Response compression

### Monitoring & Observability
- Structured logging
- Metrics collection
- Error tracking
- Performance monitoring
- Health check dashboards

## Development Guidelines

### Code Organization
- **Routes**: API endpoint definitions
- **Services**: Business logic layer
- **Durable Objects**: State management
- **Middleware**: Cross-cutting concerns
- **Config**: Environment configuration

### Testing Strategy
- Unit tests for services
- Integration tests for API endpoints
- End-to-end tests for user flows
- Load testing for performance
- Security testing for vulnerabilities

### Deployment Process
1. Local development with Wrangler
2. Staging environment testing
3. Production deployment
4. Health check verification
5. Monitoring setup

This architecture provides a solid foundation for a secure, scalable digital banking platform using Cloudflare's edge computing infrastructure.