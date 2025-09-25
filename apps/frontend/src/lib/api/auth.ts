import { api } from './index';

// Define types locally since shared package may not be available
export interface LoginRequest {
  email: string;
  password: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: string[];
}

// Types for Locuno authentication
export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  role?: 'family' | 'community' | 'both';
  idNumber?: string; // Vietnamese ID for eKYC
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    lastLoginAt?: string;
  };
  token: string;
  refreshToken: string;
  expiresIn: number;
}

export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  kycStatus: 'pending' | 'verified' | 'rejected';
  accountStatus: 'active' | 'suspended' | 'closed';
  role?: 'family' | 'community' | 'both';
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
}

// Authentication service
export const authService = {
  // Register new user
  async register(userData: RegisterRequest): Promise<ApiResponse<AuthResponse>> {
    try {
      const response = await api.post<ApiResponse<AuthResponse>>('/api/auth/register', userData);
      
      if (response.data.success && response.data.data) {
        // Store auth data in localStorage
        localStorage.setItem('authToken', response.data.data.token);
        localStorage.setItem('refreshToken', response.data.data.refreshToken);
        localStorage.setItem('user', JSON.stringify(response.data.data.user));
      }
      
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed',
        errors: error.response?.data?.errors || [error.message],
      };
    }
  },

  // Login user
  async login(credentials: LoginRequest): Promise<ApiResponse<AuthResponse>> {
    try {
      const response = await api.post<ApiResponse<AuthResponse>>('/api/auth/login', credentials);
      
      if (response.data.success && response.data.data) {
        // Store auth data in localStorage
        localStorage.setItem('authToken', response.data.data.token);
        localStorage.setItem('refreshToken', response.data.data.refreshToken);
        localStorage.setItem('user', JSON.stringify(response.data.data.user));
      }
      
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed',
        errors: error.response?.data?.errors || [error.message],
      };
    }
  },

  // Logout user
  async logout(): Promise<ApiResponse<void>> {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      
      if (refreshToken) {
        await api.post('/api/auth/logout', { refreshToken });
      }
      
      // Clear local storage
      localStorage.removeItem('authToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      
      return { success: true, message: 'Logged out successfully' };
    } catch (error: any) {
      // Clear local storage even if API call fails
      localStorage.removeItem('authToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      
      return {
        success: false,
        message: error.response?.data?.message || 'Logout failed',
      };
    }
  },

  // Refresh token
  async refreshToken(): Promise<ApiResponse<{ token: string; refreshToken: string; expiresIn: number }>> {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }
      
      const response = await api.post<ApiResponse<{ token: string; refreshToken: string; expiresIn: number }>>(
        '/api/auth/refresh',
        { refreshToken }
      );
      
      if (response.data.success && response.data.data) {
        // Update stored tokens
        localStorage.setItem('authToken', response.data.data.token);
        localStorage.setItem('refreshToken', response.data.data.refreshToken);
      }
      
      return response.data;
    } catch (error: any) {
      // Clear tokens if refresh fails
      localStorage.removeItem('authToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      
      return {
        success: false,
        message: error.response?.data?.message || 'Token refresh failed',
      };
    }
  },

  // Get current user from localStorage
  getCurrentUser(): UserProfile | null {
    try {
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    } catch {
      return null;
    }
  },

  // Check if user is authenticated
  isAuthenticated(): boolean {
    const token = localStorage.getItem('authToken');
    const user = this.getCurrentUser();
    return !!(token && user);
  },

  // Get auth token
  getToken(): string | null {
    return localStorage.getItem('authToken');
  },

  // Forgot password
  async forgotPassword(email: string): Promise<ApiResponse<void>> {
    try {
      const response = await api.post<ApiResponse<void>>('/api/auth/forgot-password', { email });
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Password reset request failed',
      };
    }
  },

  // Get user profile
  async getProfile(): Promise<ApiResponse<UserProfile>> {
    try {
      const response = await api.get<ApiResponse<UserProfile>>('/api/users/profile');
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch profile',
      };
    }
  },

  // Update user profile
  async updateProfile(updates: Partial<UserProfile>): Promise<ApiResponse<UserProfile>> {
    try {
      const response = await api.put<ApiResponse<UserProfile>>('/api/users/profile', updates);
      
      if (response.data.success && response.data.data) {
        // Update stored user data
        localStorage.setItem('user', JSON.stringify(response.data.data));
      }
      
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Profile update failed',
      };
    }
  },
};

export default authService;
