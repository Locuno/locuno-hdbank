import { z } from 'zod';
// User profile schema
const UserProfileSchema = z.object({
    id: z.string(),
    email: z.string().email(),
    firstName: z.string(),
    lastName: z.string(),
    phoneNumber: z.string().optional(),
    dateOfBirth: z.string().optional(),
    address: z.object({
        street: z.string().optional(),
        city: z.string().optional(),
        state: z.string().optional(),
        zipCode: z.string().optional(),
        country: z.string().optional(),
    }).optional(),
    kycStatus: z.enum(['pending', 'verified', 'rejected']).default('pending'),
    accountStatus: z.enum(['active', 'suspended', 'closed']).default('active'),
    createdAt: z.string(),
    updatedAt: z.string(),
    lastLoginAt: z.string().optional(),
    loginAttempts: z.number().default(0),
    lockedUntil: z.string().optional(),
});
const AuthDataSchema = z.object({
    userId: z.string(),
    email: z.string().email(),
    passwordHash: z.string(),
    salt: z.string(),
    refreshTokens: z.array(z.object({
        token: z.string(),
        expiresAt: z.string(),
        createdAt: z.string(),
    })).default([]),
    twoFactorEnabled: z.boolean().default(false),
    twoFactorSecret: z.string().optional(),
    recoveryTokens: z.array(z.string()).default([]),
});
export class UserProfileDO {
    state;
    env;
    constructor(state, env) {
        this.state = state;
        this.env = env;
    }
    // Simple password hashing using Web Crypto API
    async hashPassword(password, salt) {
        const encoder = new TextEncoder();
        const data = encoder.encode(password + salt);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }
    generateSalt() {
        const array = new Uint8Array(16);
        crypto.getRandomValues(array);
        return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
    }
    // Create a new user profile and auth data
    async createUser(userData) {
        try {
            const userId = crypto.randomUUID();
            const now = new Date().toISOString();
            // Check if user already exists
            const existingProfile = await this.state.storage.get(`profile:${userData.email}`);
            if (existingProfile) {
                return { success: false, error: 'User already exists' };
            }
            // Hash password
            const salt = this.generateSalt();
            const passwordHash = await this.hashPassword(userData.password, salt);
            // Create user profile
            const userProfile = {
                id: userId,
                email: userData.email,
                firstName: userData.firstName,
                lastName: userData.lastName,
                phoneNumber: userData.phoneNumber,
                kycStatus: 'pending',
                accountStatus: 'active',
                createdAt: now,
                updatedAt: now,
                loginAttempts: 0,
            };
            // Create auth data
            const authData = {
                userId,
                email: userData.email,
                passwordHash,
                salt,
                refreshTokens: [],
                twoFactorEnabled: false,
                recoveryTokens: [],
            };
            // Store data
            await this.state.storage.put(`profile:${userData.email}`, userProfile);
            await this.state.storage.put(`auth:${userData.email}`, authData);
            await this.state.storage.put(`user:${userId}`, userData.email);
            return { success: true, userId };
        }
        catch (error) {
            return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
        }
    }
    // Authenticate user
    async authenticateUser(email, password) {
        try {
            const authData = await this.state.storage.get(`auth:${email}`);
            const userProfile = await this.state.storage.get(`profile:${email}`);
            if (!authData || !userProfile) {
                return { success: false, error: 'Invalid credentials' };
            }
            // Check if account is locked
            if (userProfile.lockedUntil && new Date(userProfile.lockedUntil) > new Date()) {
                return { success: false, error: 'Account is temporarily locked' };
            }
            // Check if account is suspended
            if (userProfile.accountStatus !== 'active') {
                return { success: false, error: 'Account is not active' };
            }
            // Verify password
            const hashedInputPassword = await this.hashPassword(password, authData.salt);
            const isValidPassword = hashedInputPassword === authData.passwordHash;
            if (!isValidPassword) {
                // Increment login attempts
                const updatedProfile = {
                    ...userProfile,
                    loginAttempts: userProfile.loginAttempts + 1,
                    updatedAt: new Date().toISOString(),
                };
                // Lock account after 5 failed attempts for 15 minutes
                if (updatedProfile.loginAttempts >= 5) {
                    updatedProfile.lockedUntil = new Date(Date.now() + 15 * 60 * 1000).toISOString();
                }
                await this.state.storage.put(`profile:${email}`, updatedProfile);
                return { success: false, error: 'Invalid credentials' };
            }
            // Reset login attempts and update last login
            const updatedProfile = {
                ...userProfile,
                loginAttempts: 0,
                lastLoginAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                lockedUntil: undefined,
            };
            await this.state.storage.put(`profile:${email}`, updatedProfile);
            return { success: true, user: updatedProfile };
        }
        catch (error) {
            return { success: false, error: error instanceof Error ? error.message : 'Authentication failed' };
        }
    }
    // Get user profile by email
    async getUserProfile(email) {
        return await this.state.storage.get(`profile:${email}`) || null;
    }
    // Get user profile by ID
    async getUserProfileById(userId) {
        const email = await this.state.storage.get(`user:${userId}`);
        if (!email)
            return null;
        return await this.getUserProfile(email);
    }
    // Update user profile
    async updateUserProfile(email, updates) {
        try {
            const existingProfile = await this.state.storage.get(`profile:${email}`);
            if (!existingProfile) {
                return { success: false, error: 'User not found' };
            }
            const updatedProfile = {
                ...existingProfile,
                ...updates,
                updatedAt: new Date().toISOString(),
            };
            // Validate updated profile
            const validatedProfile = UserProfileSchema.parse(updatedProfile);
            await this.state.storage.put(`profile:${email}`, validatedProfile);
            return { success: true, user: validatedProfile };
        }
        catch (error) {
            return { success: false, error: error instanceof Error ? error.message : 'Update failed' };
        }
    }
    // Store refresh token
    async storeRefreshToken(email, token, expiresAt, invalidateOld) {
        try {
            const authData = await this.state.storage.get(`auth:${email}`);
            if (!authData) {
                return { success: false, error: 'User not found' };
            }
            // Clean up expired tokens and optionally remove old token
            let validTokens = authData.refreshTokens.filter(rt => new Date(rt.expiresAt) > new Date());
            // Remove old token if specified
            if (invalidateOld) {
                validTokens = validTokens.filter(rt => rt.token !== invalidateOld);
            }
            // Add new token
            validTokens.push({
                token,
                expiresAt,
                createdAt: new Date().toISOString(),
            });
            const updatedAuthData = {
                ...authData,
                refreshTokens: validTokens
            };
            await this.state.storage.put(`auth:${email}`, updatedAuthData);
            return { success: true };
        }
        catch (error) {
            return { success: false, error: error instanceof Error ? error.message : 'Token storage failed' };
        }
    }
    // Validate refresh token
    async validateRefreshToken(email, token) {
        try {
            const authData = await this.state.storage.get(`auth:${email}`);
            if (!authData)
                return false;
            const validToken = authData.refreshTokens.find(rt => rt.token === token && new Date(rt.expiresAt) > new Date());
            return !!validToken;
        }
        catch {
            return false;
        }
    }
    // Revoke refresh token
    async revokeRefreshToken(email, token) {
        try {
            const authData = await this.state.storage.get(`auth:${email}`);
            if (!authData)
                return false;
            const updatedAuthData = {
                ...authData,
                refreshTokens: authData.refreshTokens.filter(rt => rt.token !== token)
            };
            await this.state.storage.put(`auth:${email}`, updatedAuthData);
            return true;
        }
        catch {
            return false;
        }
    }
    // Change password
    async changePassword(email, currentPassword, newPassword) {
        try {
            const authData = await this.state.storage.get(`auth:${email}`);
            if (!authData) {
                return { success: false, error: 'User not found' };
            }
            // Verify current password
            const hashedCurrentPassword = await this.hashPassword(currentPassword, authData.salt);
            const isValidPassword = hashedCurrentPassword === authData.passwordHash;
            if (!isValidPassword) {
                return { success: false, error: 'Current password is incorrect' };
            }
            // Hash new password
            const salt = this.generateSalt();
            const passwordHash = await this.hashPassword(newPassword, salt);
            const updatedAuthData = {
                ...authData,
                passwordHash,
                salt,
                refreshTokens: [], // Invalidate all refresh tokens
            };
            await this.state.storage.put(`auth:${email}`, updatedAuthData);
            return { success: true };
        }
        catch (error) {
            return { success: false, error: error instanceof Error ? error.message : 'Password change failed' };
        }
    }
    // Delete user (GDPR compliance)
    async deleteUser(email) {
        try {
            const userProfile = await this.state.storage.get(`profile:${email}`);
            if (!userProfile)
                return false;
            await this.state.storage.delete(`profile:${email}`);
            await this.state.storage.delete(`auth:${email}`);
            await this.state.storage.delete(`user:${userProfile.id}`);
            return true;
        }
        catch {
            return false;
        }
    }
    // Generate password reset token
    async generatePasswordResetToken(email) {
        try {
            const userProfile = await this.state.storage.get(`profile:${email}`);
            if (!userProfile) {
                return { success: false, error: 'User not found' };
            }
            const resetToken = crypto.randomUUID();
            const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString(); // 1 hour
            await this.state.storage.put(`reset:${resetToken}`, {
                email,
                expiresAt,
                createdAt: new Date().toISOString(),
            });
            return { success: true, resetToken };
        }
        catch (error) {
            return { success: false, error: error instanceof Error ? error.message : 'Reset token generation failed' };
        }
    }
    // Validate refresh token by token only
    async validateRefreshTokenByToken(token) {
        try {
            // Get all auth data to find the token
            const allKeys = await this.state.storage.list({ prefix: 'auth:' });
            for (const [key, authData] of allKeys) {
                const data = authData;
                const validToken = data.refreshTokens.find(rt => rt.token === token && new Date(rt.expiresAt) > new Date());
                if (validToken) {
                    return { valid: true, email: data.email };
                }
            }
            return { valid: false, error: 'Invalid or expired token' };
        }
        catch (error) {
            return { valid: false, error: error instanceof Error ? error.message : 'Token validation failed' };
        }
    }
    // Invalidate refresh token
    async invalidateRefreshToken(token) {
        try {
            // Get all auth data to find and remove the token
            const allKeys = await this.state.storage.list({ prefix: 'auth:' });
            for (const [key, authData] of allKeys) {
                const data = authData;
                const tokenIndex = data.refreshTokens.findIndex(rt => rt.token === token);
                if (tokenIndex !== -1) {
                    const updatedAuthData = {
                        ...data,
                        refreshTokens: data.refreshTokens.filter(rt => rt.token !== token)
                    };
                    await this.state.storage.put(key, updatedAuthData);
                    return { success: true };
                }
            }
            return { success: false, error: 'Token not found' };
        }
        catch (error) {
            return { success: false, error: error instanceof Error ? error.message : 'Token invalidation failed' };
        }
    }
    // Handle HTTP requests to the Durable Object
    async fetch(request) {
        const url = new URL(request.url);
        const method = request.method;
        try {
            switch (`${method} ${url.pathname}`) {
                case 'POST /create': {
                    const userData = await request.json();
                    const result = await this.createUser(userData);
                    return Response.json(result);
                }
                case 'POST /authenticate': {
                    const { email, password } = await request.json();
                    const result = await this.authenticateUser(email, password);
                    return Response.json(result);
                }
                case 'GET /profile': {
                    const email = url.searchParams.get('email');
                    if (!email) {
                        return Response.json({ error: 'Email parameter required' }, { status: 400 });
                    }
                    const profile = await this.getUserProfile(email);
                    return Response.json({ profile });
                }
                case 'PUT /profile': {
                    const { email, updates } = await request.json();
                    const result = await this.updateUserProfile(email, updates);
                    return Response.json(result);
                }
                case 'POST /refresh-token': {
                    const { email, token, expiresAt, invalidateOld } = await request.json();
                    const result = await this.storeRefreshToken(email, token, expiresAt, invalidateOld);
                    return Response.json(result);
                }
                case 'POST /validate-refresh-token': {
                    const { token } = await request.json();
                    const result = await this.validateRefreshTokenByToken(token);
                    return Response.json(result);
                }
                case 'POST /invalidate-token': {
                    const { token } = await request.json();
                    const result = await this.invalidateRefreshToken(token);
                    return Response.json(result);
                }
                case 'POST /forgot-password': {
                    const { email } = await request.json();
                    const result = await this.generatePasswordResetToken(email);
                    return Response.json(result);
                }
                case 'POST /change-password': {
                    const { email, currentPassword, newPassword } = await request.json();
                    const result = await this.changePassword(email, currentPassword, newPassword);
                    return Response.json(result);
                }
                case 'DELETE /user': {
                    const email = url.searchParams.get('email');
                    if (!email) {
                        return Response.json({ error: 'Email parameter required' }, { status: 400 });
                    }
                    const success = await this.deleteUser(email);
                    return Response.json({ success });
                }
                default:
                    return new Response('Not Found', { status: 404 });
            }
        }
        catch (error) {
            return Response.json({ error: error instanceof Error ? error.message : 'Internal Server Error' }, { status: 500 });
        }
    }
}
// Export for Cloudflare Workers
export { UserProfileDO as default };
//# sourceMappingURL=UserProfileDO.js.map