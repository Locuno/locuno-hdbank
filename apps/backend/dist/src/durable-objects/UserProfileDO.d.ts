import { z } from 'zod';
declare const UserProfileSchema: z.ZodObject<{
    id: z.ZodString;
    email: z.ZodString;
    firstName: z.ZodString;
    lastName: z.ZodString;
    phoneNumber: z.ZodOptional<z.ZodString>;
    dateOfBirth: z.ZodOptional<z.ZodString>;
    address: z.ZodOptional<z.ZodObject<{
        street: z.ZodOptional<z.ZodString>;
        city: z.ZodOptional<z.ZodString>;
        state: z.ZodOptional<z.ZodString>;
        zipCode: z.ZodOptional<z.ZodString>;
        country: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        street?: string | undefined;
        city?: string | undefined;
        state?: string | undefined;
        zipCode?: string | undefined;
        country?: string | undefined;
    }, {
        street?: string | undefined;
        city?: string | undefined;
        state?: string | undefined;
        zipCode?: string | undefined;
        country?: string | undefined;
    }>>;
    kycStatus: z.ZodDefault<z.ZodEnum<["pending", "verified", "rejected"]>>;
    accountStatus: z.ZodDefault<z.ZodEnum<["active", "suspended", "closed"]>>;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
    lastLoginAt: z.ZodOptional<z.ZodString>;
    loginAttempts: z.ZodDefault<z.ZodNumber>;
    lockedUntil: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    createdAt: string;
    updatedAt: string;
    kycStatus: "pending" | "verified" | "rejected";
    accountStatus: "active" | "suspended" | "closed";
    loginAttempts: number;
    phoneNumber?: string | undefined;
    dateOfBirth?: string | undefined;
    address?: {
        street?: string | undefined;
        city?: string | undefined;
        state?: string | undefined;
        zipCode?: string | undefined;
        country?: string | undefined;
    } | undefined;
    lastLoginAt?: string | undefined;
    lockedUntil?: string | undefined;
}, {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    createdAt: string;
    updatedAt: string;
    phoneNumber?: string | undefined;
    dateOfBirth?: string | undefined;
    address?: {
        street?: string | undefined;
        city?: string | undefined;
        state?: string | undefined;
        zipCode?: string | undefined;
        country?: string | undefined;
    } | undefined;
    kycStatus?: "pending" | "verified" | "rejected" | undefined;
    accountStatus?: "active" | "suspended" | "closed" | undefined;
    lastLoginAt?: string | undefined;
    loginAttempts?: number | undefined;
    lockedUntil?: string | undefined;
}>;
declare const AuthDataSchema: z.ZodObject<{
    userId: z.ZodString;
    email: z.ZodString;
    passwordHash: z.ZodString;
    salt: z.ZodString;
    refreshTokens: z.ZodDefault<z.ZodArray<z.ZodObject<{
        token: z.ZodString;
        expiresAt: z.ZodString;
        createdAt: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        createdAt: string;
        token: string;
        expiresAt: string;
    }, {
        createdAt: string;
        token: string;
        expiresAt: string;
    }>, "many">>;
    twoFactorEnabled: z.ZodDefault<z.ZodBoolean>;
    twoFactorSecret: z.ZodOptional<z.ZodString>;
    recoveryTokens: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    email: string;
    userId: string;
    passwordHash: string;
    salt: string;
    refreshTokens: {
        createdAt: string;
        token: string;
        expiresAt: string;
    }[];
    twoFactorEnabled: boolean;
    recoveryTokens: string[];
    twoFactorSecret?: string | undefined;
}, {
    email: string;
    userId: string;
    passwordHash: string;
    salt: string;
    refreshTokens?: {
        createdAt: string;
        token: string;
        expiresAt: string;
    }[] | undefined;
    twoFactorEnabled?: boolean | undefined;
    twoFactorSecret?: string | undefined;
    recoveryTokens?: string[] | undefined;
}>;
export type UserProfile = z.infer<typeof UserProfileSchema>;
export type AuthData = z.infer<typeof AuthDataSchema>;
export type RefreshToken = {
    token: string;
    expiresAt: string;
    createdAt: string;
};
export declare class UserProfileDO {
    private state;
    private env;
    constructor(state: any, env: any);
    private hashPassword;
    private generateSalt;
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
        user?: UserProfile;
        error?: string;
    }>;
    getUserProfile(email: string): Promise<UserProfile | null>;
    getUserProfileById(userId: string): Promise<UserProfile | null>;
    updateUserProfile(email: string, updates: Partial<UserProfile>): Promise<{
        success: boolean;
        user?: UserProfile;
        error?: string;
    }>;
    storeRefreshToken(email: string, token: string, expiresAt: string, invalidateOld?: string): Promise<{
        success: boolean;
        error?: string;
    }>;
    validateRefreshToken(email: string, token: string): Promise<boolean>;
    revokeRefreshToken(email: string, token: string): Promise<boolean>;
    changePassword(email: string, currentPassword: string, newPassword: string): Promise<{
        success: boolean;
        error?: string;
    }>;
    deleteUser(email: string): Promise<boolean>;
    generatePasswordResetToken(email: string): Promise<{
        success: boolean;
        resetToken?: string;
        error?: string;
    }>;
    validateRefreshTokenByToken(token: string): Promise<{
        valid: boolean;
        email?: string;
        error?: string;
    }>;
    invalidateRefreshToken(token: string): Promise<{
        success: boolean;
        error?: string;
    }>;
    fetch(request: Request): Promise<Response>;
}
export { UserProfileDO as default };
//# sourceMappingURL=UserProfileDO.d.ts.map