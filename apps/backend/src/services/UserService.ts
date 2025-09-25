import { UserProfileDO } from '../durable-objects/UserProfileDO';

// User service that integrates with Durable Objects
export class UserService {
  private userProfileDO: any;

  constructor(env: any) {
    // Get Durable Object instance for user management
    const doId = env.USER_PROFILE_DO.idFromName('user-manager');
    this.userProfileDO = env.USER_PROFILE_DO.get(doId);
  }

  // Create a new user
  async createUser(userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phoneNumber?: string;
  }): Promise<{
    success: boolean;
    userId?: string;
    error?: string;
  }> {
    try {
      const response = await this.userProfileDO.fetch('http://do/create-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });

      return await response.json();
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'User creation failed',
      };
    }
  }

  // Authenticate user
  async authenticateUser(email: string, password: string): Promise<{
    success: boolean;
    user?: any;
    error?: string;
  }> {
    try {
      const response = await this.userProfileDO.fetch('http://do/authenticate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      return await response.json();
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Authentication failed',
      };
    }
  }

  // Get user profile
  async getUserProfile(email: string): Promise<{
    success: boolean;
    user?: any;
    error?: string;
  }> {
    try {
      const response = await this.userProfileDO.fetch('http://do/get-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      return await response.json();
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Profile retrieval failed',
      };
    }
  }

  // Update user profile
  async updateUserProfile(email: string, updates: {
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
  }): Promise<{
    success: boolean;
    user?: any;
    error?: string;
  }> {
    try {
      const response = await this.userProfileDO.fetch('http://do/update-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, updates }),
      });

      return await response.json();
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Profile update failed',
      };
    }
  }

  // Change user password
  async changePassword(email: string, currentPassword: string, newPassword: string): Promise<{
    success: boolean;
    error?: string;
  }> {
    try {
      const response = await this.userProfileDO.fetch('http://do/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, currentPassword, newPassword }),
      });

      return await response.json();
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Password change failed',
      };
    }
  }

  // Store refresh token
  async storeRefreshToken(email: string, token: string, expiresAt: string, invalidateOld?: string): Promise<{
    success: boolean;
    error?: string;
  }> {
    try {
      const response = await this.userProfileDO.fetch('http://do/refresh-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, token, expiresAt, invalidateOld }),
      });

      return await response.json();
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Token storage failed',
      };
    }
  }

  // Validate refresh token
  async validateRefreshToken(token: string): Promise<{
    success: boolean;
    user?: any;
    error?: string;
  }> {
    try {
      const response = await this.userProfileDO.fetch('http://do/validate-refresh-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });

      return await response.json();
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Token validation failed',
      };
    }
  }

  // Invalidate refresh token
  async invalidateRefreshToken(token: string): Promise<{
    success: boolean;
    error?: string;
  }> {
    try {
      const response = await this.userProfileDO.fetch('http://do/invalidate-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });

      return await response.json();
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Token invalidation failed',
      };
    }
  }

  // Generate password reset token
  async generatePasswordResetToken(email: string): Promise<{
    success: boolean;
    resetToken?: string;
    error?: string;
  }> {
    try {
      const response = await this.userProfileDO.fetch('http://do/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      return await response.json();
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Reset token generation failed',
      };
    }
  }

  // Delete user
  async deleteUser(email: string): Promise<{
    success: boolean;
    error?: string;
  }> {
    try {
      const response = await this.userProfileDO.fetch('http://do/delete-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      return await response.json();
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'User deletion failed',
      };
    }
  }
}