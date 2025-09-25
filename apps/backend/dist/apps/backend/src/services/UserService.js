// User service that integrates with Durable Objects
export class UserService {
    userProfileDO;
    constructor(env) {
        // Get Durable Object instance for user management
        const doId = env.USER_PROFILE_DO.idFromName('user-manager');
        this.userProfileDO = env.USER_PROFILE_DO.get(doId);
    }
    // Create a new user
    async createUser(userData) {
        try {
            const response = await this.userProfileDO.fetch('http://do/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData),
            });
            return await response.json();
        }
        catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'User creation failed',
            };
        }
    }
    // Authenticate user
    async authenticateUser(email, password) {
        try {
            const response = await this.userProfileDO.fetch('http://do/authenticate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            return await response.json();
        }
        catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Authentication failed',
            };
        }
    }
    // Get user profile
    async getUserProfile(email) {
        try {
            const response = await this.userProfileDO.fetch(`http://do/profile?email=${encodeURIComponent(email)}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });
            return await response.json();
        }
        catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Profile retrieval failed',
            };
        }
    }
    // Update user profile
    async updateUserProfile(email, updates) {
        try {
            const response = await this.userProfileDO.fetch('http://do/profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, updates }),
            });
            return await response.json();
        }
        catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Profile update failed',
            };
        }
    }
    // Change user password
    async changePassword(email, currentPassword, newPassword) {
        try {
            const response = await this.userProfileDO.fetch('http://do/change-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, currentPassword, newPassword }),
            });
            return await response.json();
        }
        catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Password change failed',
            };
        }
    }
    // Store refresh token
    async storeRefreshToken(email, token, expiresAt, invalidateOld) {
        try {
            const response = await this.userProfileDO.fetch('http://do/refresh-token', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, token, expiresAt, invalidateOld }),
            });
            return await response.json();
        }
        catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Token storage failed',
            };
        }
    }
    // Validate refresh token
    async validateRefreshToken(token) {
        try {
            const response = await this.userProfileDO.fetch('http://do/validate-refresh-token', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token }),
            });
            return await response.json();
        }
        catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Token validation failed',
            };
        }
    }
    // Invalidate refresh token
    async invalidateRefreshToken(token) {
        try {
            const response = await this.userProfileDO.fetch('http://do/invalidate-token', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token }),
            });
            return await response.json();
        }
        catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Token invalidation failed',
            };
        }
    }
    // Generate password reset token
    async generatePasswordResetToken(email) {
        try {
            const response = await this.userProfileDO.fetch('http://do/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });
            return await response.json();
        }
        catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Reset token generation failed',
            };
        }
    }
    // Delete user
    async deleteUser(email) {
        try {
            const response = await this.userProfileDO.fetch(`http://do/user?email=${encodeURIComponent(email)}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
            });
            return await response.json();
        }
        catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'User deletion failed',
            };
        }
    }
}
//# sourceMappingURL=UserService.js.map