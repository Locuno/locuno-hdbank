export declare class UserService {
    private userProfileDO;
    constructor(env: any);
    createUser(userData: {
        email: string;
        password: string;
        firstName: string;
        lastName: string;
        phoneNumber?: string;
    }): Promise<{
        success: boolean;
        userId?: string;
        error?: string;
    }>;
    authenticateUser(email: string, password: string): Promise<{
        success: boolean;
        user?: any;
        error?: string;
    }>;
    getUserProfile(email: string): Promise<{
        success: boolean;
        user?: any;
        error?: string;
    }>;
    updateUserProfile(email: string, updates: {
        firstName?: string;
        lastName?: string;
        phoneNumber?: string;
    }): Promise<{
        success: boolean;
        user?: any;
        error?: string;
    }>;
    changePassword(email: string, currentPassword: string, newPassword: string): Promise<{
        success: boolean;
        error?: string;
    }>;
    storeRefreshToken(email: string, token: string, expiresAt: string, invalidateOld?: string): Promise<{
        success: boolean;
        error?: string;
    }>;
    validateRefreshToken(token: string): Promise<{
        success: boolean;
        user?: any;
        error?: string;
    }>;
    invalidateRefreshToken(token: string): Promise<{
        success: boolean;
        error?: string;
    }>;
    generatePasswordResetToken(email: string): Promise<{
        success: boolean;
        resetToken?: string;
        error?: string;
    }>;
    deleteUser(email: string): Promise<{
        success: boolean;
        error?: string;
    }>;
}
//# sourceMappingURL=UserService.d.ts.map