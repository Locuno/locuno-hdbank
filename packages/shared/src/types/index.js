"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaginatedResponseSchema = exports.PaginationSchema = exports.TransferRequestSchema = exports.AuthResponseSchema = exports.LoginRequestSchema = exports.ApiResponseSchema = exports.TransactionSchema = exports.AccountSchema = exports.UserSchema = void 0;
var zod_1 = require("zod");
// User Types
exports.UserSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
    email: zod_1.z.string().email(),
    firstName: zod_1.z.string().min(1),
    lastName: zod_1.z.string().min(1),
    phoneNumber: zod_1.z.string().optional(),
    dateOfBirth: zod_1.z.date().optional(),
    createdAt: zod_1.z.date(),
    updatedAt: zod_1.z.date(),
});
// Account Types
exports.AccountSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
    userId: zod_1.z.string().uuid(),
    accountNumber: zod_1.z.string(),
    accountType: zod_1.z.enum(['CHECKING', 'SAVINGS', 'CREDIT']),
    balance: zod_1.z.number(),
    currency: zod_1.z.string().default('USD'),
    status: zod_1.z.enum(['ACTIVE', 'INACTIVE', 'FROZEN']),
    createdAt: zod_1.z.date(),
    updatedAt: zod_1.z.date(),
});
// Transaction Types
exports.TransactionSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
    fromAccountId: zod_1.z.string().uuid().optional(),
    toAccountId: zod_1.z.string().uuid().optional(),
    amount: zod_1.z.number().positive(),
    currency: zod_1.z.string().default('USD'),
    type: zod_1.z.enum(['DEPOSIT', 'WITHDRAWAL', 'TRANSFER', 'PAYMENT']),
    status: zod_1.z.enum(['PENDING', 'COMPLETED', 'FAILED', 'CANCELLED']),
    description: zod_1.z.string().optional(),
    reference: zod_1.z.string().optional(),
    createdAt: zod_1.z.date(),
    updatedAt: zod_1.z.date(),
});
// API Response Types
exports.ApiResponseSchema = zod_1.z.object({
    success: zod_1.z.boolean(),
    message: zod_1.z.string().optional(),
    data: zod_1.z.any().optional(),
    errors: zod_1.z.array(zod_1.z.string()).optional(),
});
// Authentication Types
exports.LoginRequestSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(8),
});
exports.AuthResponseSchema = zod_1.z.object({
    user: exports.UserSchema,
    token: zod_1.z.string(),
    refreshToken: zod_1.z.string(),
    expiresIn: zod_1.z.number(),
});
// Transfer Request Types
exports.TransferRequestSchema = zod_1.z.object({
    fromAccountId: zod_1.z.string().uuid(),
    toAccountId: zod_1.z.string().uuid(),
    amount: zod_1.z.number().positive(),
    description: zod_1.z.string().optional(),
    reference: zod_1.z.string().optional(),
});
// Pagination Types
exports.PaginationSchema = zod_1.z.object({
    page: zod_1.z.number().int().positive().default(1),
    limit: zod_1.z.number().int().positive().max(100).default(20),
    sortBy: zod_1.z.string().optional(),
    sortOrder: zod_1.z.enum(['asc', 'desc']).default('desc'),
});
exports.PaginatedResponseSchema = zod_1.z.object({
    data: zod_1.z.array(zod_1.z.any()),
    pagination: zod_1.z.object({
        page: zod_1.z.number(),
        limit: zod_1.z.number(),
        total: zod_1.z.number(),
        totalPages: zod_1.z.number(),
        hasNext: zod_1.z.boolean(),
        hasPrev: zod_1.z.boolean(),
    }),
});
