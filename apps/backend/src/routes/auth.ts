import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { LoginRequestSchema } from '@locuno-hdbank/shared';
import { z } from 'zod';
import { sign, verify } from 'hono/jwt';
import { createConfig } from '../config';

// Registration schema
const RegisterRequestSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  phoneNumber: z.string().optional(),
});

// Refresh token schema
const RefreshTokenSchema = z.object({
  refreshToken: z.string(),
});

// Password reset schema
const ForgotPasswordSchema = z.object({
  email: z.string().email(),
});

type Bindings = {
  USER_PROFILE_DO: any; // Durable Object namespace
  JWT_SECRET?: string;
  [key: string]: any;
};

const auth = new Hono<{ Bindings: Bindings }>();

// Registration endpoint
auth.post('/register', zValidator('json', RegisterRequestSchema), async (c) => {
  const userData = c.req.valid('json');
  const config = createConfig(c.env);
  
  try {
    // Get Durable Object instance for user management
    const doId = c.env.USER_PROFILE_DO.idFromName('user-manager');
    const doStub = c.env.USER_PROFILE_DO.get(doId);
    
    // Create user via Durable Object
    const response = await doStub.fetch('http://do/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    
    const result = await response.json() as { success: boolean; userId?: string; error?: string };
    
    if (!result.success) {
      return c.json({
        success: false,
        message: result.error || 'Registration failed',
      }, 400);
    }
    
    // Generate JWT token
    const payload = {
      userId: result.userId,
      email: userData.email,
      exp: Math.floor(Date.now() / 1000) + (config.jwt.expiresIn === '24h' ? 86400 : 3600),
    };
    
    const token = await sign(payload, config.jwt.secret);
    
    // Generate refresh token
    const refreshToken = crypto.randomUUID();
    const refreshTokenExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
    
    // Store refresh token
    await doStub.fetch('http://do/refresh-token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: userData.email,
        token: refreshToken,
        expiresAt: refreshTokenExpiry,
      }),
    });
    
    return c.json({
      success: true,
      message: 'Registration successful',
      data: {
        user: {
          id: result.userId,
          email: userData.email,
          firstName: userData.firstName,
          lastName: userData.lastName,
        },
        token,
        refreshToken,
        expiresIn: config.jwt.expiresIn === '24h' ? 86400 : 3600,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    return c.json({
      success: false,
      message: 'Internal server error',
    }, 500);
  }
});

// Login endpoint
auth.post('/login', zValidator('json', LoginRequestSchema), async (c) => {
  const { email, password } = c.req.valid('json');
  const config = createConfig(c.env);
  
  try {
    // Get Durable Object instance for user management
    const doId = c.env.USER_PROFILE_DO.idFromName('user-manager');
    const doStub = c.env.USER_PROFILE_DO.get(doId);
    
    // Authenticate user via Durable Object
    const response = await doStub.fetch('http://do/authenticate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    
    const result = await response.json() as { success: boolean; user?: any; error?: string };
    
    if (!result.success) {
      return c.json({
        success: false,
        message: result.error || 'Authentication failed',
      }, 401);
    }
    
    // Generate JWT token
    const payload = {
      userId: result.user.id,
      email: result.user.email,
      exp: Math.floor(Date.now() / 1000) + (config.jwt.expiresIn === '24h' ? 86400 : 3600),
    };
    
    const token = await sign(payload, config.jwt.secret);
    
    // Generate refresh token
    const refreshToken = crypto.randomUUID();
    const refreshTokenExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
    
    // Store refresh token
    await doStub.fetch('http://do/refresh-token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        token: refreshToken,
        expiresAt: refreshTokenExpiry,
      }),
    });
    
    return c.json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: result.user.id,
          email: result.user.email,
          firstName: result.user.firstName,
          lastName: result.user.lastName,
          lastLoginAt: result.user.lastLoginAt,
        },
        token,
        refreshToken,
        expiresIn: config.jwt.expiresIn === '24h' ? 86400 : 3600,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return c.json({
      success: false,
      message: 'Internal server error',
    }, 500);
  }
});

// Logout endpoint
auth.post('/logout', zValidator('json', RefreshTokenSchema), async (c) => {
  const { refreshToken } = c.req.valid('json');
  
  try {
    // Get Durable Object instance for user management
    const doId = c.env.USER_PROFILE_DO.idFromName('user-manager');
    const doStub = c.env.USER_PROFILE_DO.get(doId);
    
    // Invalidate refresh token via Durable Object
    await doStub.fetch('http://do/invalidate-token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: refreshToken }),
    });
    
    return c.json({
      success: true,
      message: 'Logout successful',
    });
  } catch (error) {
    console.error('Logout error:', error);
    return c.json({
      success: false,
      message: 'Internal server error',
    }, 500);
  }
});

// Refresh token endpoint
auth.post('/refresh', zValidator('json', RefreshTokenSchema), async (c) => {
  const { refreshToken } = c.req.valid('json');
  const config = createConfig(c.env);
  
  try {
    // Get Durable Object instance for user management
    const doId = c.env.USER_PROFILE_DO.idFromName('user-manager');
    const doStub = c.env.USER_PROFILE_DO.get(doId);
    
    // Validate refresh token via Durable Object
    const response = await doStub.fetch('http://do/validate-refresh-token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: refreshToken }),
    });
    
    const result = await response.json() as { success: boolean; user?: any; error?: string };
    
    if (!result.success) {
      return c.json({
        success: false,
        message: result.error || 'Invalid refresh token',
      }, 401);
    }
    
    // Generate new JWT token
    const payload = {
      userId: result.user.id,
      email: result.user.email,
      exp: Math.floor(Date.now() / 1000) + (config.jwt.expiresIn === '24h' ? 86400 : 3600),
    };
    
    const newToken = await sign(payload, config.jwt.secret);
    
    // Generate new refresh token
    const newRefreshToken = crypto.randomUUID();
    const refreshTokenExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
    
    // Store new refresh token and invalidate old one
    await doStub.fetch('http://do/refresh-token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: result.user.email,
        token: newRefreshToken,
        expiresAt: refreshTokenExpiry,
        invalidateOld: refreshToken,
      }),
    });
    
    return c.json({
      success: true,
      message: 'Token refreshed successfully',
      data: {
        token: newToken,
        refreshToken: newRefreshToken,
        expiresIn: config.jwt.expiresIn === '24h' ? 86400 : 3600,
      },
    });
  } catch (error) {
    console.error('Token refresh error:', error);
    return c.json({
      success: false,
      message: 'Internal server error',
    }, 500);
  }
});

// Password reset request
auth.post('/forgot-password', zValidator('json', ForgotPasswordSchema), async (c) => {
  const { email } = c.req.valid('json');
  
  try {
    // Get Durable Object instance for user management
    const doId = c.env.USER_PROFILE_DO.idFromName('user-manager');
    const doStub = c.env.USER_PROFILE_DO.get(doId);
    
    // Generate password reset token via Durable Object
    const response = await doStub.fetch('http://do/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    
    const result = await response.json() as { success: boolean; error?: string };
    
    // Always return success to prevent email enumeration attacks
    return c.json({
      success: true,
      message: 'If an account with that email exists, a password reset link has been sent.',
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    return c.json({
      success: true,
      message: 'If an account with that email exists, a password reset link has been sent.',
    });
  }
});

export { auth as authRoutes };
