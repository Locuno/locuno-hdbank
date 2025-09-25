import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { jwt } from 'hono/jwt';
import { createConfig } from '../config';
import { UserService } from '../services/UserService';

// Define schemas for validation
const UpdateProfileSchema = z.object({
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  phoneNumber: z.string().optional(),
});

const ChangePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8),
});

type Bindings = {
  USER_PROFILE_DO: any;
  JWT_SECRET?: string;
  [key: string]: any;
};

const users = new Hono<{ Bindings: Bindings }>();

// JWT middleware for protected routes
users.use('*', async (c, next) => {
  const config = createConfig(c.env);
  const jwtMiddleware = jwt({
    secret: config.jwt.secret,
  });
  return jwtMiddleware(c, next);
});

// Get current user profile
users.get('/me', async (c) => {
  try {
    const payload = c.get('jwtPayload');
    const userService = new UserService(c.env);
    
    const result = await userService.getUserProfile(payload.email);
    
    if (!result.success) {
      return c.json({
        success: false,
        message: result.error || 'Failed to retrieve profile',
      }, 404);
    }
    
    return c.json({
      success: true,
      message: 'Profile retrieved successfully',
      data: {
        user: result.user,
      },
    });
  } catch (error) {
    console.error('Get profile error:', error);
    return c.json({
      success: false,
      message: 'Internal server error',
    }, 500);
  }
});

// Update user profile
users.put('/me', zValidator('json', UpdateProfileSchema), async (c) => {
  try {
    const payload = c.get('jwtPayload');
    const rawUpdates = c.req.valid('json');
    const userService = new UserService(c.env);
    
    // Filter out undefined values
    const updates: { firstName?: string; lastName?: string; phoneNumber?: string } = {};
    if (rawUpdates.firstName !== undefined) updates.firstName = rawUpdates.firstName;
    if (rawUpdates.lastName !== undefined) updates.lastName = rawUpdates.lastName;
    if (rawUpdates.phoneNumber !== undefined) updates.phoneNumber = rawUpdates.phoneNumber;
    
    const result = await userService.updateUserProfile(payload.email, updates);
    
    if (!result.success) {
      return c.json({
        success: false,
        message: result.error || 'Failed to update profile',
      }, 400);
    }
    
    return c.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user: result.user,
      },
    });
  } catch (error) {
    console.error('Update profile error:', error);
    return c.json({
      success: false,
      message: 'Internal server error',
    }, 500);
  }
});

// Change password
users.post('/change-password', zValidator('json', ChangePasswordSchema), async (c) => {
  try {
    const payload = c.get('jwtPayload');
    const { currentPassword, newPassword } = c.req.valid('json');
    const userService = new UserService(c.env);
    
    const result = await userService.changePassword(payload.email, currentPassword, newPassword);
    
    if (!result.success) {
      return c.json({
        success: false,
        message: result.error || 'Failed to change password',
      }, 400);
    }
    
    return c.json({
      success: true,
      message: 'Password changed successfully',
    });
  } catch (error) {
    console.error('Change password error:', error);
    return c.json({
      success: false,
      message: 'Internal server error',
    }, 500);
  }
});

// Delete user account
users.delete('/me', async (c) => {
  try {
    const payload = c.get('jwtPayload');
    const userService = new UserService(c.env);
    
    const result = await userService.deleteUser(payload.email);
    
    if (!result.success) {
      return c.json({
        success: false,
        message: result.error || 'Failed to delete account',
      }, 400);
    }
    
    return c.json({
      success: true,
      message: 'Account deleted successfully',
    });
  } catch (error) {
    console.error('Delete user error:', error);
    return c.json({
      success: false,
      message: 'Internal server error',
    }, 500);
  }
});

export { users as userRoutes };
