import { z } from 'zod';
export declare const UserSchema: z.ZodObject<{
    id: z.ZodString;
    email: z.ZodString;
    firstName: z.ZodString;
    lastName: z.ZodString;
    phoneNumber: z.ZodOptional<z.ZodString>;
    dateOfBirth: z.ZodOptional<z.ZodDate>;
    createdAt: z.ZodDate;
    updatedAt: z.ZodDate;
}, "strip", z.ZodTypeAny, {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    createdAt: Date;
    updatedAt: Date;
    phoneNumber?: string | undefined;
    dateOfBirth?: Date | undefined;
}, {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    createdAt: Date;
    updatedAt: Date;
    phoneNumber?: string | undefined;
    dateOfBirth?: Date | undefined;
}>;
export type User = z.infer<typeof UserSchema>;
export declare const AccountSchema: z.ZodObject<{
    id: z.ZodString;
    userId: z.ZodString;
    accountNumber: z.ZodString;
    accountType: z.ZodEnum<["CHECKING", "SAVINGS", "CREDIT"]>;
    balance: z.ZodNumber;
    currency: z.ZodDefault<z.ZodString>;
    status: z.ZodEnum<["ACTIVE", "INACTIVE", "FROZEN"]>;
    createdAt: z.ZodDate;
    updatedAt: z.ZodDate;
}, "strip", z.ZodTypeAny, {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    status: "ACTIVE" | "INACTIVE" | "FROZEN";
    userId: string;
    accountNumber: string;
    accountType: "CHECKING" | "SAVINGS" | "CREDIT";
    balance: number;
    currency: string;
}, {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    status: "ACTIVE" | "INACTIVE" | "FROZEN";
    userId: string;
    accountNumber: string;
    accountType: "CHECKING" | "SAVINGS" | "CREDIT";
    balance: number;
    currency?: string | undefined;
}>;
export type Account = z.infer<typeof AccountSchema>;
export declare const TransactionSchema: z.ZodObject<{
    id: z.ZodString;
    fromAccountId: z.ZodOptional<z.ZodString>;
    toAccountId: z.ZodOptional<z.ZodString>;
    amount: z.ZodNumber;
    currency: z.ZodDefault<z.ZodString>;
    type: z.ZodEnum<["DEPOSIT", "WITHDRAWAL", "TRANSFER", "PAYMENT"]>;
    status: z.ZodEnum<["PENDING", "COMPLETED", "FAILED", "CANCELLED"]>;
    description: z.ZodOptional<z.ZodString>;
    reference: z.ZodOptional<z.ZodString>;
    createdAt: z.ZodDate;
    updatedAt: z.ZodDate;
}, "strip", z.ZodTypeAny, {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    type: "DEPOSIT" | "WITHDRAWAL" | "TRANSFER" | "PAYMENT";
    status: "PENDING" | "COMPLETED" | "FAILED" | "CANCELLED";
    currency: string;
    amount: number;
    fromAccountId?: string | undefined;
    toAccountId?: string | undefined;
    description?: string | undefined;
    reference?: string | undefined;
}, {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    type: "DEPOSIT" | "WITHDRAWAL" | "TRANSFER" | "PAYMENT";
    status: "PENDING" | "COMPLETED" | "FAILED" | "CANCELLED";
    amount: number;
    currency?: string | undefined;
    fromAccountId?: string | undefined;
    toAccountId?: string | undefined;
    description?: string | undefined;
    reference?: string | undefined;
}>;
export type Transaction = z.infer<typeof TransactionSchema>;
export declare const ApiResponseSchema: z.ZodObject<{
    success: z.ZodBoolean;
    message: z.ZodOptional<z.ZodString>;
    data: z.ZodOptional<z.ZodAny>;
    errors: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    success: boolean;
    message?: string | undefined;
    errors?: string[] | undefined;
    data?: any;
}, {
    success: boolean;
    message?: string | undefined;
    errors?: string[] | undefined;
    data?: any;
}>;
export type ApiResponse<T = any> = {
    success: boolean;
    message?: string;
    data?: T;
    errors?: string[];
};
export declare const LoginRequestSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
    password: string;
}, {
    email: string;
    password: string;
}>;
export type LoginRequest = z.infer<typeof LoginRequestSchema>;
export declare const AuthResponseSchema: z.ZodObject<{
    user: z.ZodObject<{
        id: z.ZodString;
        email: z.ZodString;
        firstName: z.ZodString;
        lastName: z.ZodString;
        phoneNumber: z.ZodOptional<z.ZodString>;
        dateOfBirth: z.ZodOptional<z.ZodDate>;
        createdAt: z.ZodDate;
        updatedAt: z.ZodDate;
    }, "strip", z.ZodTypeAny, {
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        createdAt: Date;
        updatedAt: Date;
        phoneNumber?: string | undefined;
        dateOfBirth?: Date | undefined;
    }, {
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        createdAt: Date;
        updatedAt: Date;
        phoneNumber?: string | undefined;
        dateOfBirth?: Date | undefined;
    }>;
    token: z.ZodString;
    refreshToken: z.ZodString;
    expiresIn: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    user: {
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        createdAt: Date;
        updatedAt: Date;
        phoneNumber?: string | undefined;
        dateOfBirth?: Date | undefined;
    };
    token: string;
    refreshToken: string;
    expiresIn: number;
}, {
    user: {
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        createdAt: Date;
        updatedAt: Date;
        phoneNumber?: string | undefined;
        dateOfBirth?: Date | undefined;
    };
    token: string;
    refreshToken: string;
    expiresIn: number;
}>;
export type AuthResponse = z.infer<typeof AuthResponseSchema>;
export declare const TransferRequestSchema: z.ZodObject<{
    fromAccountId: z.ZodString;
    toAccountId: z.ZodString;
    amount: z.ZodNumber;
    description: z.ZodOptional<z.ZodString>;
    reference: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    fromAccountId: string;
    toAccountId: string;
    amount: number;
    description?: string | undefined;
    reference?: string | undefined;
}, {
    fromAccountId: string;
    toAccountId: string;
    amount: number;
    description?: string | undefined;
    reference?: string | undefined;
}>;
export type TransferRequest = z.infer<typeof TransferRequestSchema>;
export declare const PaginationSchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodNumber>;
    limit: z.ZodDefault<z.ZodNumber>;
    sortBy: z.ZodOptional<z.ZodString>;
    sortOrder: z.ZodDefault<z.ZodEnum<["asc", "desc"]>>;
}, "strip", z.ZodTypeAny, {
    page: number;
    limit: number;
    sortOrder: "asc" | "desc";
    sortBy?: string | undefined;
}, {
    page?: number | undefined;
    limit?: number | undefined;
    sortBy?: string | undefined;
    sortOrder?: "asc" | "desc" | undefined;
}>;
export type Pagination = z.infer<typeof PaginationSchema>;
export declare const PaginatedResponseSchema: z.ZodObject<{
    data: z.ZodArray<z.ZodAny, "many">;
    pagination: z.ZodObject<{
        page: z.ZodNumber;
        limit: z.ZodNumber;
        total: z.ZodNumber;
        totalPages: z.ZodNumber;
        hasNext: z.ZodBoolean;
        hasPrev: z.ZodBoolean;
    }, "strip", z.ZodTypeAny, {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
        hasNext: boolean;
        hasPrev: boolean;
    }, {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
        hasNext: boolean;
        hasPrev: boolean;
    }>;
}, "strip", z.ZodTypeAny, {
    data: any[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
        hasNext: boolean;
        hasPrev: boolean;
    };
}, {
    data: any[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
        hasNext: boolean;
        hasPrev: boolean;
    };
}>;
export type PaginatedResponse<T = any> = {
    data: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
        hasNext: boolean;
        hasPrev: boolean;
    };
};
//# sourceMappingURL=index.d.ts.map